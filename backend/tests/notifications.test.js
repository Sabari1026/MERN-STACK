/**
 * Automated Real-Time Notifications & Email Integration Test Suite for HireConnect (Phase 9)
 * Covers:
 * 1. In-App Notification Creation, Recipient Scoping & Retrieval (/api/notifications)
 * 2. Unread Count, Read State Mutations & Read-All (/api/notifications/unread-count, /api/notifications/:id/read)
 * 3. Notification Dismissal & Ownership Enforcement (/api/notifications/:id)
 * 4. Deduplication Key Enforcement
 * 5. Notification Preferences Management (/api/notifications/preferences)
 * 6. Email Service, Sandboxed Transport & Outbox Retries
 * 7. Business Events: Application Submitted, Status Changed, Withdrawn
 * 8. Business Events: Interview Booked, Rescheduled, Cancelled
 * 9. Interview Reminder Scheduler (Approaching windows, cancellation suppression, idempotency)
 */

const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const CandidateProfile = require('../src/models/candidateProfile.model');
const Company = require('../src/models/company.model');
const Job = require('../src/models/job.model');
const Application = require('../src/models/application.model');
const Meeting = require('../src/models/meeting.model');
const Notification = require('../src/models/notification.model');
const NotificationOutbox = require('../src/models/notificationOutbox.model');
const notificationService = require('../src/services/notification.service');
const emailService = require('../src/services/email.service');
const reminderService = require('../src/services/reminder.service');
const applicationService = require('../src/services/application.service');
const schedulingService = require('../src/services/scheduling.service');
const { generateAccessToken } = require('../src/utils/token');

describe('HireConnect Phase 9: Real-Time Notifications & Email Integration', () => {
  let candidateUser = null;
  let candidateToken = '';
  let candidate2User = null;
  let candidate2Token = '';
  let recruiterUser = null;
  let recruiterToken = '';
  let companyDoc = null;
  let jobDoc = null;

  beforeEach(async () => {
    User.__clearMemoryStore();
    CandidateProfile.__clearMemoryStore();
    Company.__clearMemoryStore();
    Job.__clearMemoryStore();
    Application.__clearMemoryStore();
    Meeting.__clearMemoryStore();
    Notification.__clearMemoryStore();
    NotificationOutbox.__clearMemoryStore();
    emailService.clearSentEmails();

    // 1. Candidate User
    candidateUser = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav.sharma@hireconnect.io',
      role: 'candidate',
      isEmailVerified: true
    });
    candidateToken = generateAccessToken(candidateUser);

    // 2. Second Candidate User
    candidate2User = await User.create({
      name: 'Vikram Malhotra',
      email: 'vikram.m@hireconnect.io',
      role: 'candidate',
      isEmailVerified: true
    });
    candidate2Token = generateAccessToken(candidate2User);

    // 3. Recruiter User
    recruiterUser = await User.create({
      name: 'Priya Mehta',
      email: 'priya.mehta@hireconnect.io',
      role: 'recruiter',
      isEmailVerified: true
    });
    recruiterToken = generateAccessToken(recruiterUser);

    // 4. Company & Job Opening
    companyDoc = await Company.create({
      name: 'Razorpay Software',
      slug: 'razorpay',
      industry: 'FinTech',
      verificationStatus: 'verified',
      createdBy: recruiterUser._id
    });

    jobDoc = await Job.create({
      company: companyDoc._id,
      recruiter: recruiterUser._id,
      title: 'Senior Frontend Architect',
      status: 'published'
    });
  });

  // ==========================================================================
  // 1. IN-APP NOTIFICATION RETRIEVAL & OWNERSHIP
  // ==========================================================================
  describe('1. In-App Notification Retrieval & Ownership (/api/notifications)', () => {
    it('should reject unauthenticated requests with 401', async () => {
      const res = await request(app).get('/api/notifications');
      expect(res.status).toBe(401);
    });

    it('should return empty list and zero unread count for user with no notifications', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.notifications).toEqual([]);
      expect(res.body.unreadCount).toBe(0);
    });

    it('should list notifications belonging ONLY to authenticated user', async () => {
      // Notification for candidateUser
      await Notification.create({
        recipient: candidateUser._id,
        type: 'application_submitted',
        title: 'Application Received',
        message: 'Your application for Senior Frontend Architect was submitted.',
        actionUrl: '/applications/app-1'
      });

      // Notification for recruiterUser
      await Notification.create({
        recipient: recruiterUser._id,
        type: 'new_applicant',
        title: 'New Applicant',
        message: 'Aarav applied for Senior Frontend Architect.',
        actionUrl: '/recruiter/applications'
      });

      // Candidate view
      const candRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(candRes.status).toBe(200);
      expect(candRes.body.notifications.length).toBe(1);
      expect(candRes.body.notifications[0].title).toBe('Application Received');
      expect(candRes.body.unreadCount).toBe(1);

      // Recruiter view
      const recRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(recRes.status).toBe(200);
      expect(recRes.body.notifications.length).toBe(1);
      expect(recRes.body.notifications[0].title).toBe('New Applicant');
    });

    it('should support pagination (page and limit)', async () => {
      for (let i = 1; i <= 5; i++) {
        await Notification.create({
          recipient: candidateUser._id,
          type: 'system_announcement',
          title: `Announcement #${i}`,
          message: `Update number ${i}`
        });
      }

      const res = await request(app)
        .get('/api/notifications?page=1&limit=2')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.notifications.length).toBe(2);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(2);
      expect(res.body.pagination.totalCount).toBe(5);
      expect(res.body.pagination.totalPages).toBe(3);
    });
  });

  // ==========================================================================
  // 2. UNREAD COUNT, READ MUTATIONS & READ-ALL
  // ==========================================================================
  describe('2. Unread Count, Read State Mutations & Read-All', () => {
    let notif1 = null;
    let notif2 = null;

    beforeEach(async () => {
      notif1 = await Notification.create({
        recipient: candidateUser._id,
        type: 'application_status_changed',
        title: 'Status: Shortlisted',
        message: 'You have been shortlisted for an interview.'
      });
      notif2 = await Notification.create({
        recipient: candidateUser._id,
        type: 'interview_booked',
        title: 'Interview Confirmed',
        message: 'Your technical interview has been confirmed.'
      });
    });

    it('GET /api/notifications/unread-count should return correct count', async () => {
      const res = await request(app)
        .get('/api/notifications/unread-count')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.unreadCount).toBe(2);
    });

    it('PATCH /api/notifications/:id/read should mark single notification as read', async () => {
      const notifId = notif1._id ? notif1._id.toString() : notif1.id;

      const res = await request(app)
        .patch(`/api/notifications/${notifId}/read`)
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.notification.readAt).toBeDefined();
      expect(res.body.unreadCount).toBe(1);

      // Verify unread count endpoint updates
      const countRes = await request(app)
        .get('/api/notifications/unread-count')
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(countRes.body.unreadCount).toBe(1);
    });

    it('PATCH /api/notifications/:id/read should reject unauthorized user with 403', async () => {
      const notifId = notif1._id ? notif1._id.toString() : notif1.id;

      // candidate2 attempts to mark candidateUser's notification as read
      const res = await request(app)
        .patch(`/api/notifications/${notifId}/read`)
        .set('Authorization', `Bearer ${candidate2Token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/not authorized/i);
    });

    it('PATCH /api/notifications/read-all should mark all notifications as read', async () => {
      const res = await request(app)
        .patch('/api/notifications/read-all')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.unreadCount).toBe(0);

      // Verify listing reflects read state
      const listRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(listRes.body.unreadCount).toBe(0);
      expect(listRes.body.notifications.every(n => n.readAt !== null)).toBe(true);
    });
  });

  // ==========================================================================
  // 3. NOTIFICATION DISMISSAL & RETENTION
  // ==========================================================================
  describe('3. Notification Dismissal & Retention', () => {
    it('DELETE /api/notifications/:id should dismiss notification for authenticated user', async () => {
      const notif = await Notification.create({
        recipient: candidateUser._id,
        type: 'system_announcement',
        title: 'Platform Maintenance',
        message: 'Scheduled maintenance this Sunday.'
      });
      const notifId = notif._id ? notif._id.toString() : notif.id;

      const delRes = await request(app)
        .delete(`/api/notifications/${notifId}`)
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(delRes.status).toBe(200);
      expect(delRes.body.success).toBe(true);

      // Dismissed notification is omitted from user list
      const listRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(listRes.body.notifications.length).toBe(0);
    });

    it('DELETE /api/notifications/:id should reject unauthorized user with 403', async () => {
      const notif = await Notification.create({
        recipient: candidateUser._id,
        type: 'system_announcement',
        title: 'Platform Maintenance',
        message: 'Scheduled maintenance this Sunday.'
      });
      const notifId = notif._id ? notif._id.toString() : notif.id;

      const delRes = await request(app)
        .delete(`/api/notifications/${notifId}`)
        .set('Authorization', `Bearer ${candidate2Token}`);

      expect(delRes.status).toBe(403);
    });
  });

  // ==========================================================================
  // 4. DEDUPLICATION ENFORCEMENT
  // ==========================================================================
  describe('4. Deduplication Key Enforcement', () => {
    it('should suppress duplicate notifications sharing the same deduplicationKey', async () => {
      const dedupKey = 'unique_event:app-123:status_update';

      const firstNotif = await notificationService.createNotification({
        recipientId: candidateUser._id,
        type: 'application_status_changed',
        title: 'Status Update',
        message: 'Your application is now under review.',
        deduplicationKey: dedupKey
      });
      expect(firstNotif).toBeDefined();

      // Second identical event dispatch
      const secondNotif = await notificationService.createNotification({
        recipientId: candidateUser._id,
        type: 'application_status_changed',
        title: 'Status Update',
        message: 'Your application is now under review.',
        deduplicationKey: dedupKey
      });

      // Both point to the exact same notification document
      expect(secondNotif.id).toBe(firstNotif.id);

      // Total count in database remains exactly 1
      const count = await Notification.countDocuments({ recipient: candidateUser._id });
      expect(count).toBe(1);
    });
  });

  // ==========================================================================
  // 5. NOTIFICATION PREFERENCES MANAGEMENT
  // ==========================================================================
  describe('5. Notification Preferences Management (/api/notifications/preferences)', () => {
    it('should return default preferences for authenticated user', async () => {
      const res = await request(app)
        .get('/api/notifications/preferences')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.preferences.email.applicationStatus).toBe(true);
      expect(res.body.preferences.email.interviewBooked).toBe(true);
      expect(res.body.preferences.email.interviewReminders).toBe(true);
    });

    it('should allow user to update their email notification preferences', async () => {
      const updatePayload = {
        email: {
          applicationStatus: false,
          interviewReminders: true
        }
      };

      const res = await request(app)
        .put('/api/notifications/preferences')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send(updatePayload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.preferences.email.applicationStatus).toBe(false);
      expect(res.body.preferences.email.interviewReminders).toBe(true);
      // Preserved other preference fields
      expect(res.body.preferences.email.interviewBooked).toBe(true);
    });

    it('should skip email dispatch when user disabled the relevant email category', async () => {
      // Disable application status emails
      await request(app)
        .put('/api/notifications/preferences')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ email: { applicationStatus: false } });

      emailService.clearSentEmails();

      // Trigger application status change notification
      await notificationService.notifyApplicationStatusChanged({
        application: { _id: 'app-99', candidate: candidateUser._id },
        candidate: candidateUser,
        job: jobDoc,
        company: companyDoc,
        previousStatus: 'applied',
        newStatus: 'shortlisted'
      });

      // In-app notification must STILL be created
      const notifs = await Notification.find({ recipient: candidateUser._id });
      expect(notifs.length).toBe(1);
      expect(notifs[0].type).toBe('application_status_changed');

      // Email MUST NOT be sent
      expect(emailService.getSentEmails().length).toBe(0);
    });
  });

  // ==========================================================================
  // 6. TRANSACTIONAL OUTBOX & EXPONENTIAL BACKOFF RETRY
  // ==========================================================================
  describe('6. Transactional Outbox & Exponential Backoff Retry', () => {
    it('should create outbox entry and record sent status upon successful delivery', async () => {
      emailService.clearSentEmails();

      await notificationService.createNotification({
        recipientId: candidateUser._id,
        type: 'application_submitted',
        title: 'Application Confirmed',
        message: 'Your application was received.',
        deduplicationKey: 'outbox_test:app-1',
        emailOptions: {
          subject: 'Application Confirmed',
          html: '<p>Confirmed</p>',
          text: 'Confirmed'
        }
      });

      const outbox = await NotificationOutbox.findOne({ eventId: 'evt-outbox_test:app-1' });
      expect(outbox).toBeDefined();
      expect(outbox.status).toBe('sent');
      expect(outbox.sentAt).toBeDefined();
      expect(emailService.getSentEmails().length).toBe(1);
    });

    it('should schedule retry with backoff when email delivery fails', async () => {
      // Simulate failed outbox entry
      const outbox = await NotificationOutbox.create({
        eventId: 'evt-failure-test-1',
        eventType: 'interview_booked',
        recipient: 'test@example.com',
        subject: 'Interview Booked',
        htmlContent: '<p>Booked</p>',
        textContent: 'Booked',
        status: 'pending',
        attempts: 1,
        maxAttempts: 3
      });

      // Temporarily mock emailService to simulate delivery rejection
      const originalSend = emailService.sendEmail;
      emailService.sendEmail = async () => ({ success: false, error: 'SMTP connection timeout' });

      try {
        const result = await emailService.processPendingOutbox(10);
        expect(result.processed).toBe(1);
        expect(result.failed).toBe(1);

        const updated = await NotificationOutbox.findById(outbox._id || outbox.id);
        expect(updated.status).toBe('retry_scheduled');
        expect(updated.attempts).toBe(2);
        expect(updated.lastError).toContain('SMTP connection timeout');
        expect(new Date(updated.nextRetryAt).getTime()).toBeGreaterThan(Date.now());
      } finally {
        emailService.sendEmail = originalSend;
      }
    });

    it('should mark outbox as permanently failed after reaching maxAttempts', async () => {
      const outbox = await NotificationOutbox.create({
        eventId: 'evt-max-attempts-test',
        eventType: 'interview_booked',
        recipient: 'fail@example.com',
        subject: 'Interview Test',
        htmlContent: '<p>Test</p>',
        textContent: 'Test',
        status: 'pending',
        attempts: 4,
        maxAttempts: 5
      });

      const originalSend = emailService.sendEmail;
      emailService.sendEmail = async () => ({ success: false, error: 'Recipient address rejected' });

      try {
        await emailService.processPendingOutbox(10);
        const updated = await NotificationOutbox.findById(outbox._id || outbox.id);
        expect(updated.status).toBe('failed');
        expect(updated.attempts).toBe(5);
      } finally {
        emailService.sendEmail = originalSend;
      }
    });
  });

  // ==========================================================================
  // 7. BUSINESS EVENT: APPLICATION WORKFLOW NOTIFICATIONS
  // ==========================================================================
  describe('7. Business Event: Application Workflow Notifications', () => {
    it('submitting application should notify candidate and recruiter', async () => {
      emailService.clearSentEmails();

      const newApp = await applicationService.submitApplication(
        jobDoc._id || jobDoc.id,
        candidateUser,
        { coverLetter: 'Excited about Razorpay frontend!' }
      );

      expect(newApp).toBeDefined();

      // Verify Candidate In-App Notification
      const candNotifs = await Notification.find({ recipient: candidateUser._id });
      expect(candNotifs.length).toBe(1);
      expect(candNotifs[0].type).toBe('application_submitted');
      expect(candNotifs[0].title).toBe('Application Submitted');

      // Verify Recruiter In-App Notification
      const recNotifs = await Notification.find({ recipient: recruiterUser._id });
      expect(recNotifs.length).toBe(1);
      expect(recNotifs[0].type).toBe('new_applicant');
      expect(recNotifs[0].title).toBe('New Applicant Received');

      // Verify Emails
      const sentEmails = emailService.getSentEmails();
      expect(sentEmails.length).toBe(2);
      expect(sentEmails.some(e => e.to === candidateUser.email && e.subject.includes('Application Submitted'))).toBe(true);
      expect(sentEmails.some(e => e.to === recruiterUser.email && e.subject.includes('New Applicant'))).toBe(true);
    });

    it('updating application status should notify candidate of new status', async () => {
      const newApp = await applicationService.submitApplication(
        jobDoc._id || jobDoc.id,
        candidateUser,
        { coverLetter: 'Initial submission' }
      );

      Notification.__clearMemoryStore();
      emailService.clearSentEmails();

      // Recruiter shortlists candidate
      await applicationService.updateApplicationStatus(
        newApp._id || newApp.id,
        'shortlisted',
        recruiterUser,
        'Candidate has strong React expertise'
      );

      // Verify candidate notification
      const candNotifs = await Notification.find({ recipient: candidateUser._id });
      expect(candNotifs.length).toBe(1);
      expect(candNotifs[0].type).toBe('application_status_changed');
      expect(candNotifs[0].title).toContain('SHORTLISTED');

      // Verify candidate received email
      const sentEmails = emailService.getSentEmails();
      expect(sentEmails.length).toBe(1);
      expect(sentEmails[0].to).toBe(candidateUser.email);
      expect(sentEmails[0].subject).toContain('SHORTLISTED');
    });

    it('withdrawing application should notify recruiter', async () => {
      const newApp = await applicationService.submitApplication(
        jobDoc._id || jobDoc.id,
        candidateUser,
        { coverLetter: 'Initial submission' }
      );

      Notification.__clearMemoryStore();
      emailService.clearSentEmails();

      // Candidate withdraws application
      await applicationService.withdrawApplication(
        newApp._id || newApp.id,
        candidateUser,
        'Accepted another position'
      );

      // Verify recruiter notification
      const recNotifs = await Notification.find({ recipient: recruiterUser._id });
      expect(recNotifs.length).toBe(1);
      expect(recNotifs[0].type).toBe('application_withdrawn');
      expect(recNotifs[0].title).toBe('Application Withdrawn');
    });
  });

  // ==========================================================================
  // 8. BUSINESS EVENT: INTERVIEW SCHEDULING NOTIFICATIONS
  // ==========================================================================
  describe('8. Business Event: Interview Scheduling Notifications', () => {
    let testMeeting = null;

    it('booking interview should notify both candidate and recruiter with meeting details', async () => {
      emailService.clearSentEmails();

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      while (futureDate.getDay() === 0 || futureDate.getDay() === 6) futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = futureDate.toISOString().split('T')[0];

      const result = await schedulingService.bookMeeting(candidateUser, {
        recruiterId: recruiterUser._id || recruiterUser.id,
        date: dateStr,
        timeSlot: '11:00 AM - 11:30 AM',
        durationMinutes: 30,
        title: 'Technical Screen'
      });

      expect(result.success).toBe(true);
      testMeeting = result.meeting;

      // In-app notifications
      const candNotifs = await Notification.find({ recipient: candidateUser._id, type: 'interview_booked' });
      const recNotifs = await Notification.find({ recipient: recruiterUser._id, type: 'interview_booked' });
      expect(candNotifs.length).toBe(1);
      expect(recNotifs.length).toBe(1);

      // Emails
      const sentEmails = emailService.getSentEmails();
      expect(sentEmails.length).toBe(2);
      expect(sentEmails.some(e => e.to === candidateUser.email && e.subject.includes('Interview Confirmed'))).toBe(true);
      expect(sentEmails.some(e => e.to === recruiterUser.email && e.subject.includes('Interview Confirmed'))).toBe(true);
    });

    it('rescheduling interview should notify both participants with updated time', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 6);
      while (futureDate.getDay() === 0 || futureDate.getDay() === 6) futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = futureDate.toISOString().split('T')[0];

      const result = await schedulingService.bookMeeting(candidateUser, {
        recruiterId: recruiterUser._id || recruiterUser.id,
        date: dateStr,
        timeSlot: '10:00 AM - 10:30 AM',
        durationMinutes: 30,
        title: 'Initial Chat'
      });

      Notification.__clearMemoryStore();
      emailService.clearSentEmails();

      const newFutureDate = new Date(futureDate);
      newFutureDate.setDate(newFutureDate.getDate() + 2);
      while (newFutureDate.getDay() === 0 || newFutureDate.getDay() === 6) newFutureDate.setDate(newFutureDate.getDate() + 1);
      const newDateStr = newFutureDate.toISOString().split('T')[0];

      await schedulingService.rescheduleMeeting(result.meeting.id, candidateUser, {
        newDate: newDateStr,
        newSlot: '03:00 PM - 03:30 PM',
        reason: 'Shifted lecture schedule'
      });

      // Both receive reschedule notification
      const candNotifs = await Notification.find({ recipient: candidateUser._id, type: 'interview_rescheduled' });
      const recNotifs = await Notification.find({ recipient: recruiterUser._id, type: 'interview_rescheduled' });
      expect(candNotifs.length).toBe(1);
      expect(recNotifs.length).toBe(1);
      expect(candNotifs[0].title).toBe('Interview Rescheduled');
    });

    it('cancelling interview should notify both participants', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      while (futureDate.getDay() === 0 || futureDate.getDay() === 6) futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = futureDate.toISOString().split('T')[0];

      const result = await schedulingService.bookMeeting(candidateUser, {
        recruiterId: recruiterUser._id || recruiterUser.id,
        date: dateStr,
        timeSlot: '02:00 PM - 02:30 PM',
        durationMinutes: 30,
        title: 'System Design Round'
      });

      Notification.__clearMemoryStore();
      emailService.clearSentEmails();

      await schedulingService.cancelMeeting(result.meeting.id, candidateUser, 'Accepted competing offer');

      const candNotifs = await Notification.find({ recipient: candidateUser._id, type: 'interview_cancelled' });
      const recNotifs = await Notification.find({ recipient: recruiterUser._id, type: 'interview_cancelled' });
      expect(candNotifs.length).toBe(1);
      expect(recNotifs.length).toBe(1);
      expect(candNotifs[0].title).toBe('Interview Cancelled');
    });
  });

  // ==========================================================================
  // 9. INTERVIEW REMINDER SCHEDULER
  // ==========================================================================
  describe('9. Interview Reminder Scheduler', () => {
    it('should send reminder for meetings in approaching notice window and suppress duplicates', async () => {
      emailService.clearSentEmails();

      // Create a meeting starting in exactly 24 hours
      const now = new Date();
      const startAt24h = new Date(now.getTime() + 24 * 3600000);
      const endAt24h = new Date(startAt24h.getTime() + 30 * 60000);

      const meeting24h = await Meeting.create({
        recruiter: recruiterUser._id,
        candidate: candidateUser._id,
        title: 'Upcoming Tech Interview',
        startAt: startAt24h,
        endAt: endAt24h,
        durationMinutes: 30,
        timeZone: 'Asia/Kolkata',
        status: 'scheduled',
        meetingLink: 'https://meet.hireconnect.io/room-remind-1'
      });

      // Run reminder scheduler sweep
      const outcome = await reminderService.processUpcomingMeetingReminders();
      expect(outcome.remindersSent).toBeGreaterThanOrEqual(2); // 1 for candidate, 1 for recruiter

      // Notifications created
      const notifs = await Notification.find({ type: 'interview_reminder' });
      expect(notifs.length).toBe(2);

      // Running the sweep AGAIN must NOT send duplicate reminders (Idempotency check)
      const secondSweep = await reminderService.processUpcomingMeetingReminders();
      expect(secondSweep.remindersSent).toBe(0);
      const notifsAfter = await Notification.find({ type: 'interview_reminder' });
      expect(notifsAfter.length).toBe(2);
    });

    it('should skip reminders for cancelled meetings', async () => {
      Notification.__clearMemoryStore();
      emailService.clearSentEmails();

      const now = new Date();
      const startAt24h = new Date(now.getTime() + 24 * 3600000);
      const endAt24h = new Date(startAt24h.getTime() + 30 * 60000);

      await Meeting.create({
        recruiter: recruiterUser._id,
        candidate: candidateUser._id,
        title: 'Cancelled Meeting',
        startAt: startAt24h,
        endAt: endAt24h,
        durationMinutes: 30,
        timeZone: 'Asia/Kolkata',
        status: 'cancelled' // CANCELLED
      });

      const outcome = await reminderService.processUpcomingMeetingReminders();
      expect(outcome.remindersSent).toBe(0);

      const notifs = await Notification.find({ type: 'interview_reminder' });
      expect(notifs.length).toBe(0);
    });
  });
});
