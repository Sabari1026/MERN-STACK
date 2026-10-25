/**
 * Automated Real-Time Meeting Scheduler & Interview Booking Test Suite for HireConnect (Phase 8)
 * Covers:
 * 1. Recruiter Working Hours & Availability Configuration API (/api/recruiter/availability)
 * 2. Availability Exceptions Management (/api/recruiter/availability/exceptions)
 * 3. Candidate / Public Bookable Slot Discovery (/api/recruiters/:recruiterId/available-slots)
 * 4. Meeting Booking & Atomic Double-Booking Prevention (/api/meetings)
 * 5. Concurrent Booking Mutex Locking
 * 6. Meeting Retrieval, Participant Scoping & Private Note Redaction (/api/meetings/me, /api/meetings/:id)
 * 7. Rescheduling & Slot Replacement (/api/meetings/:id/reschedule)
 * 8. Cancellation & Slot Release (/api/meetings/:id/cancel)
 * 9. Legacy /api/bookings Route Compatibility
 */

const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const CandidateProfile = require('../src/models/candidateProfile.model');
const Company = require('../src/models/company.model');
const Job = require('../src/models/job.model');
const Application = require('../src/models/application.model');
const Meeting = require('../src/models/meeting.model');
const RecruiterAvailability = require('../src/models/recruiterAvailability.model');
const AvailabilityException = require('../src/models/availabilityException.model');
const { generateAccessToken } = require('../src/utils/token');
const { zonedTimeToUtc, formatTimeSlotLabel } = require('../src/utils/timeZone');

function getFutureWeekday(daysAhead = 3) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

describe('HireConnect Phase 8: Real-Time Meeting Scheduler & Interview Booking System', () => {
  let recruiterUser = null;
  let recruiterToken = '';
  let otherRecruiterUser = null;
  let otherRecruiterToken = '';
  let candidateUser = null;
  let candidateToken = '';
  let candidate2User = null;
  let candidate2Token = '';
  let companyDoc = null;
  let jobDoc = null;
  let applicationDoc = null;

  beforeEach(async () => {
    User.__clearMemoryStore();
    CandidateProfile.__clearMemoryStore();
    Company.__clearMemoryStore();
    Job.__clearMemoryStore();
    Application.__clearMemoryStore();
    Meeting.__clearMemoryStore();
    RecruiterAvailability.__clearMemoryStore();
    AvailabilityException.__clearMemoryStore();

    // 1. Recruiter User
    recruiterUser = await User.create({
      name: 'Neil Bhargava',
      email: 'neil.bhargava@hireconnect.io',
      role: 'recruiter',
      isEmailVerified: true
    });
    recruiterToken = generateAccessToken(recruiterUser);

    // 2. Second Recruiter User
    otherRecruiterUser = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@talentconnect.io',
      role: 'recruiter',
      isEmailVerified: true
    });
    otherRecruiterToken = generateAccessToken(otherRecruiterUser);

    // 3. Primary Candidate
    candidateUser = await User.create({
      name: 'Aarav Patel',
      email: 'aarav.patel@gmail.com',
      role: 'candidate',
      isEmailVerified: true
    });
    candidateToken = generateAccessToken(candidateUser);

    // 4. Secondary Candidate
    candidate2User = await User.create({
      name: 'Rohan Verma',
      email: 'rohan.verma@gmail.com',
      role: 'candidate',
      isEmailVerified: true
    });
    candidate2Token = generateAccessToken(candidate2User);

    // 5. Company & Job & Application
    companyDoc = await Company.create({
      name: 'Stripe Payments India',
      slug: 'stripe-india',
      industry: 'FinTech',
      verificationStatus: 'verified'
    });

    jobDoc = await Job.create({
      company: companyDoc._id,
      recruiter: recruiterUser._id,
      title: 'Senior Backend Engineer',
      status: 'published'
    });

    applicationDoc = await Application.create({
      job: jobDoc._id,
      candidate: candidateUser._id,
      company: companyDoc._id,
      status: 'shortlisted'
    });
  });

  // ==========================================================================
  // 1. RECRUITER AVAILABILITY CONFIGURATION
  // ==========================================================================
  describe('1. Recruiter Availability Configuration (/api/recruiter/availability)', () => {
    it('should reject unauthenticated access with 401', async () => {
      const res = await request(app).get('/api/recruiter/availability');
      expect(res.status).toBe(401);
    });

    it('should reject candidate access with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/recruiter/availability')
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(res.status).toBe(403);
    });

    it('should auto-seed and return default availability for recruiter', async () => {
      const res = await request(app)
        .get('/api/recruiter/availability')
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.availability).toBeDefined();
      expect(res.body.availability.timeZone).toBe('Asia/Kolkata');
      expect(res.body.availability.weeklyRules.length).toBe(5); // Mon-Fri
      expect(res.body.availability.slotDurations).toContain(15);
      expect(res.body.availability.slotDurations).toContain(30);
    });

    it('should update recruiter working hours and booking constraints', async () => {
      const updatePayload = {
        timeZone: 'Asia/Kolkata',
        bufferBeforeMinutes: 10,
        bufferAfterMinutes: 10,
        minimumNoticeMinutes: 120,
        maximumBookingDaysAhead: 14,
        slotDurations: [15, 30, 45, 60],
        weeklyRules: [
          { weekday: 'monday', startTime: '10:00', endTime: '16:00' },
          { weekday: 'wednesday', startTime: '10:00', endTime: '16:00' },
          { weekday: 'friday', startTime: '10:00', endTime: '15:00' }
        ]
      };

      const res = await request(app)
        .put('/api/recruiter/availability')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send(updatePayload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.availability.bufferBeforeMinutes).toBe(10);
      expect(res.body.availability.minimumNoticeMinutes).toBe(120);
      expect(res.body.availability.weeklyRules.length).toBe(3);
    });

    it('should reject invalid time formats and start >= end rules with 400', async () => {
      const invalidPayload = {
        weeklyRules: [
          { weekday: 'monday', startTime: '17:00', endTime: '09:00' } // start after end
        ]
      };

      const res = await request(app)
        .put('/api/recruiter/availability')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send(invalidPayload);

      expect([400, 422]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });
  });

  // ==========================================================================
  // 2. AVAILABILITY EXCEPTIONS (Time Off / Custom Blocks)
  // ==========================================================================
  describe('2. Recruiter Availability Exceptions (/api/recruiter/availability/exceptions)', () => {
    it('should create an unavailable exception block', async () => {
      const startAt = new Date(Date.now() + 86400000 * 2).toISOString();
      const endAt = new Date(Date.now() + 86400000 * 2 + 7200000).toISOString();

      const res = await request(app)
        .post('/api/recruiter/availability/exceptions')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          startAt,
          endAt,
          type: 'unavailable',
          reason: 'Company All-Hands Meeting'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.exception.reason).toBe('Company All-Hands Meeting');
      expect(res.body.exception.type).toBe('unavailable');
    });

    it('should list recruiter exceptions', async () => {
      const startAt = new Date(Date.now() + 86400000 * 3).toISOString();
      const endAt = new Date(Date.now() + 86400000 * 3 + 3600000).toISOString();

      await AvailabilityException.create({
        recruiter: recruiterUser._id,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        type: 'unavailable',
        reason: 'Dentist appointment'
      });

      const res = await request(app)
        .get('/api/recruiter/availability/exceptions')
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.exceptions.length).toBeGreaterThanOrEqual(1);
      expect(res.body.exceptions[0].reason).toBe('Dentist appointment');
    });

    it('should delete an existing exception', async () => {
      const exc = await AvailabilityException.create({
        recruiter: recruiterUser._id,
        startAt: new Date(Date.now() + 86400000 * 4),
        endAt: new Date(Date.now() + 86400000 * 4 + 3600000),
        type: 'unavailable',
        reason: 'Temporary block'
      });

      const excId = exc._id ? exc._id.toString() : exc.id;

      const delRes = await request(app)
        .delete(`/api/recruiter/availability/exceptions/${excId}`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(delRes.status).toBe(200);
      expect(delRes.body.success).toBe(true);

      const found = await AvailabilityException.findById(excId);
      expect(found).toBeNull();
    });

    it('should prevent deleting another recruiter\'s exception', async () => {
      const exc = await AvailabilityException.create({
        recruiter: recruiterUser._id,
        startAt: new Date(Date.now() + 86400000 * 4),
        endAt: new Date(Date.now() + 86400000 * 4 + 3600000),
        type: 'unavailable',
        reason: 'Neil\'s private block'
      });

      const excId = exc._id ? exc._id.toString() : exc.id;

      const delRes = await request(app)
        .delete(`/api/recruiter/availability/exceptions/${excId}`)
        .set('Authorization', `Bearer ${otherRecruiterToken}`);

      expect(delRes.status).toBe(403);
    });
  });

  // ==========================================================================
  // 3. CANDIDATE AVAILABLE SLOTS DISCOVERY
  // ==========================================================================
  describe('3. Candidate / Public Slot Discovery (/api/recruiters/:recruiterId/available-slots)', () => {
    it('should generate available time slots for a valid future weekday', async () => {
      const targetDate = getFutureWeekday(5);
      const recId = recruiterUser._id ? recruiterUser._id.toString() : recruiterUser.id;

      const res = await request(app)
        .get(`/api/recruiters/${recId}/available-slots?date=${targetDate}&duration=30`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.available).toBe(true);
      expect(res.body.slots.length).toBeGreaterThan(0);
      expect(res.body.assignedHost.name).toBe('Neil Bhargava');
      expect(res.body.timezone).toBe('Asia/Kolkata');
    });

    it('should respect requested slot duration (15, 30, 45, 60 min)', async () => {
      const targetDate = getFutureWeekday(5);
      const recId = recruiterUser._id ? recruiterUser._id.toString() : recruiterUser.id;

      const res15 = await request(app)
        .get(`/api/recruiters/${recId}/available-slots?date=${targetDate}&duration=15`);
      const res30 = await request(app)
        .get(`/api/recruiters/${recId}/available-slots?date=${targetDate}&duration=30`);

      expect(res15.status).toBe(200);
      expect(res30.status).toBe(200);
      // 15-minute slots generate roughly double the count of 30-minute slots
      expect(res15.body.slots.length).toBeGreaterThan(res30.body.slots.length);
    });

    it('should reject dates beyond maximum booking horizon', async () => {
      const farFuture = new Date();
      farFuture.setDate(farFuture.getDate() + 100);
      const farFutureStr = farFuture.toISOString().split('T')[0];
      const recId = recruiterUser._id ? recruiterUser._id.toString() : recruiterUser.id;

      const res = await request(app)
        .get(`/api/recruiters/${recId}/available-slots?date=${farFutureStr}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/maximum booking window/i);
    });

    it('should exclude slots overlapping an unavailable exception', async () => {
      const targetDate = getFutureWeekday(6);
      const recId = recruiterUser._id ? recruiterUser._id.toString() : recruiterUser.id;

      // Create an unavailable exception for the whole morning (09:00 to 13:00 IST)
      const morningStart = zonedTimeToUtc(targetDate, '09:00', 'Asia/Kolkata');
      const morningEnd = zonedTimeToUtc(targetDate, '13:00', 'Asia/Kolkata');

      await AvailabilityException.create({
        recruiter: recruiterUser._id,
        startAt: morningStart,
        endAt: morningEnd,
        type: 'unavailable',
        reason: 'Recruiter Training Morning'
      });

      const res = await request(app)
        .get(`/api/recruiters/${recId}/available-slots?date=${targetDate}&duration=30`);

      expect(res.status).toBe(200);
      // Morning slots like 09:00 AM or 10:00 AM must NOT be present
      const morningSlots = res.body.slots.filter(s => s.startsWith('09:') || s.startsWith('10:') || s.startsWith('11:') || s.startsWith('12:'));
      expect(morningSlots.length).toBe(0);
      // Afternoon slots must still be present
      const afternoonSlots = res.body.slots.filter(s => s.includes('PM'));
      expect(afternoonSlots.length).toBeGreaterThan(0);
    });

    it('should exclude slots overlapping already scheduled meetings', async () => {
      const targetDate = getFutureWeekday(7);
      const recId = recruiterUser._id ? recruiterUser._id.toString() : recruiterUser.id;

      // Existing meeting at 14:00 - 14:30 IST
      const meetStart = zonedTimeToUtc(targetDate, '14:00', 'Asia/Kolkata');
      const meetEnd = zonedTimeToUtc(targetDate, '14:30', 'Asia/Kolkata');

      await Meeting.create({
        recruiter: recruiterUser._id,
        candidate: candidateUser._id,
        startAt: meetStart,
        endAt: meetEnd,
        durationMinutes: 30,
        timeZone: 'Asia/Kolkata',
        status: 'scheduled'
      });

      const res = await request(app)
        .get(`/api/recruiters/${recId}/available-slots?date=${targetDate}&duration=30`);

      expect(res.status).toBe(200);
      const slot2pm = res.body.slots.find(s => s.startsWith('02:00 PM'));
      expect(slot2pm).toBeUndefined();
      expect(res.body.bookedSlots).toContain('02:00 PM - 02:30 PM');
    });

    it('should ignore cancelled meetings so that freed slots are bookable again', async () => {
      const targetDate = getFutureWeekday(8);
      const recId = recruiterUser._id ? recruiterUser._id.toString() : recruiterUser.id;

      const meetStart = zonedTimeToUtc(targetDate, '15:00', 'Asia/Kolkata');
      const meetEnd = zonedTimeToUtc(targetDate, '15:30', 'Asia/Kolkata');

      await Meeting.create({
        recruiter: recruiterUser._id,
        candidate: candidateUser._id,
        startAt: meetStart,
        endAt: meetEnd,
        durationMinutes: 30,
        timeZone: 'Asia/Kolkata',
        status: 'cancelled',
        cancellationReason: 'Cancelled by candidate earlier'
      });

      const res = await request(app)
        .get(`/api/recruiters/${recId}/available-slots?date=${targetDate}&duration=30`);

      expect(res.status).toBe(200);
      const slot3pm = res.body.slots.find(s => s.includes('03:00 PM'));
      expect(slot3pm).toBeDefined();
    });
  });

  // ==========================================================================
  // 4. MEETING BOOKING & ATOMIC DOUBLE-BOOKING PREVENTION
  // ==========================================================================
  describe('4. Meeting Booking & Double-Booking Prevention (/api/meetings)', () => {
    it('should successfully book an interview using UTC startAt', async () => {
      const targetDate = getFutureWeekday(9);
      const recId = recruiterUser._id ? recruiterUser._id.toString() : recruiterUser.id;
      const startAt = zonedTimeToUtc(targetDate, '11:00', 'Asia/Kolkata');

      const payload = {
        recruiterId: recId,
        startAt: startAt.toISOString(),
        durationMinutes: 30,
        title: 'Initial Screening Interview',
        meetingType: 'screening',
        candidateNotes: 'Looking forward to learning more about the role.'
      };

      const res = await request(app)
        .post('/api/meetings')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.meeting.reference).toMatch(/^HC-MEET-/);
      expect(res.body.meeting.meetingLink).toMatch(/https:\/\/meet\.hireconnect\.io\/room-/);
      expect(res.body.meeting.status).toBe('scheduled');
      expect(res.body.meeting.durationMinutes).toBe(30);
    });

    it('should successfully book using date + timeSlot format', async () => {
      const targetDate = getFutureWeekday(10);
      const recId = recruiterUser._id ? recruiterUser._id.toString() : recruiterUser.id;

      const payload = {
        recruiterId: recId,
        date: targetDate,
        timeSlot: '03:00 PM - 03:30 PM',
        durationMinutes: 30,
        title: 'Technical Discussion',
        timezone: 'Asia/Kolkata'
      };

      const res = await request(app)
        .post('/api/meetings')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.meeting.status).toBe('scheduled');
      expect(res.body.meeting.date).toBe(targetDate);
    });

    it('should reject booking a slot outside recruiter working hours', async () => {
      const targetDate = getFutureWeekday(11);
      const recId = recruiterUser._id ? recruiterUser._id.toString() : recruiterUser.id;
      // 06:00 AM IST is outside 09:00-17:00
      const earlyMorning = zonedTimeToUtc(targetDate, '06:00', 'Asia/Kolkata');

      const res = await request(app)
        .post('/api/meetings')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          recruiterId: recId,
          startAt: earlyMorning.toISOString(),
          durationMinutes: 30
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/outside recruiter's working hours/i);
    });

    it('should prevent double-booking: returns 409 Conflict if slot is already taken', async () => {
      const targetDate = getFutureWeekday(12);
      const recId = recruiterUser._id ? recruiterUser._id.toString() : recruiterUser.id;
      const startAt = zonedTimeToUtc(targetDate, '14:00', 'Asia/Kolkata');

      // First booking succeeds
      const firstRes = await request(app)
        .post('/api/meetings')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          recruiterId: recId,
          startAt: startAt.toISOString(),
          durationMinutes: 30
        });
      expect(firstRes.status).toBe(201);

      // Second booking for the exact same slot must be rejected with 409 Conflict
      const secondRes = await request(app)
        .post('/api/meetings')
        .set('Authorization', `Bearer ${candidate2Token}`)
        .send({
          recruiterId: recId,
          startAt: startAt.toISOString(),
          durationMinutes: 30
        });
      expect(secondRes.status).toBe(409);
      expect(secondRes.body.success).toBe(false);
      expect(secondRes.body.message).toMatch(/already booked|no longer available/i);
    });

    it('should prevent concurrent double-booking via in-process mutex', async () => {
      const targetDate = getFutureWeekday(13);
      const recId = recruiterUser._id ? recruiterUser._id.toString() : recruiterUser.id;
      const startAt = zonedTimeToUtc(targetDate, '10:00', 'Asia/Kolkata');

      // Dispatch 2 concurrent booking requests simultaneously
      const [res1, res2] = await Promise.all([
        request(app)
          .post('/api/meetings')
          .set('Authorization', `Bearer ${candidateToken}`)
          .send({
            recruiterId: recId,
            startAt: startAt.toISOString(),
            durationMinutes: 30
          }),
        request(app)
          .post('/api/meetings')
          .set('Authorization', `Bearer ${candidate2Token}`)
          .send({
            recruiterId: recId,
            startAt: startAt.toISOString(),
            durationMinutes: 30
          })
      ]);

      const statuses = [res1.status, res2.status].sort();
      expect(statuses).toEqual([201, 409]); // Exactly one 201 Created and one 409 Conflict
    });

    it('should validate application ownership when linking an application', async () => {
      const targetDate = getFutureWeekday(14);
      const recId = recruiterUser._id ? recruiterUser._id.toString() : recruiterUser.id;
      const startAt = zonedTimeToUtc(targetDate, '16:00', 'Asia/Kolkata');
      const appId = applicationDoc._id ? applicationDoc._id.toString() : applicationDoc.id;

      // candidate2 attempts to link candidateUser's application
      const res = await request(app)
        .post('/api/meetings')
        .set('Authorization', `Bearer ${candidate2Token}`)
        .send({
          recruiterId: recId,
          startAt: startAt.toISOString(),
          applicationId: appId,
          durationMinutes: 30
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/only book interviews for applications you own/i);
    });
  });

  // ==========================================================================
  // 5. MEETING RETRIEVAL & ROLE-BASED PRIVACY CONTROLS
  // ==========================================================================
  describe('5. Meeting Retrieval & Role-Based Privacy Controls', () => {
    let testMeeting = null;

    beforeEach(async () => {
      const targetDate = getFutureWeekday(15);
      const startAt = zonedTimeToUtc(targetDate, '11:00', 'Asia/Kolkata');
      const endAt = zonedTimeToUtc(targetDate, '11:30', 'Asia/Kolkata');

      testMeeting = await Meeting.create({
        recruiter: recruiterUser._id,
        candidate: candidateUser._id,
        reference: 'HC-MEET-771122',
        title: 'Backend Systems Round',
        startAt,
        endAt,
        durationMinutes: 30,
        timeZone: 'Asia/Kolkata',
        status: 'scheduled',
        candidateNotes: 'Candidate note: excited about microservices.',
        recruiterNotes: 'CONFIDENTIAL: strong candidate, look out for system design depth.'
      });
    });

    it('should list candidate meetings and redact recruiterNotes', async () => {
      const res = await request(app)
        .get('/api/meetings/me')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.meetings.length).toBeGreaterThanOrEqual(1);

      const found = res.body.meetings.find(m => m.reference === 'HC-MEET-771122');
      expect(found).toBeDefined();
      expect(found.candidateNotes).toBe('Candidate note: excited about microservices.');
      // CONFIDENTIAL recruiter notes must be stripped
      expect(found.recruiterNotes).toBeUndefined();
    });

    it('should list recruiter meetings and preserve recruiterNotes', async () => {
      const res = await request(app)
        .get('/api/meetings/me')
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const found = res.body.meetings.find(m => m.reference === 'HC-MEET-771122');
      expect(found).toBeDefined();
      expect(found.recruiterNotes).toContain('CONFIDENTIAL: strong candidate');
    });

    it('should allow attendee to fetch meeting details by ID', async () => {
      const mId = testMeeting._id ? testMeeting._id.toString() : testMeeting.id;

      const res = await request(app)
        .get(`/api/meetings/${mId}`)
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.meeting.reference).toBe('HC-MEET-771122');
      expect(res.body.meeting.recruiterNotes).toBeUndefined();
    });

    it('should reject non-attendee fetching meeting by ID with 403 Forbidden', async () => {
      const mId = testMeeting._id ? testMeeting._id.toString() : testMeeting.id;

      const res = await request(app)
        .get(`/api/meetings/${mId}`)
        .set('Authorization', `Bearer ${candidate2Token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/not authorized/i);
    });
  });

  // ==========================================================================
  // 6. MEETING RESCHEDULING & CANCELLATION
  // ==========================================================================
  describe('6. Meeting Rescheduling & Cancellation', () => {
    let meetingToManage = null;

    beforeEach(async () => {
      const targetDate = getFutureWeekday(16);
      const startAt = zonedTimeToUtc(targetDate, '10:00', 'Asia/Kolkata');
      const endAt = zonedTimeToUtc(targetDate, '10:30', 'Asia/Kolkata');

      meetingToManage = await Meeting.create({
        recruiter: recruiterUser._id,
        candidate: candidateUser._id,
        reference: 'HC-MEET-990011',
        title: 'Architecture Screening',
        startAt,
        endAt,
        durationMinutes: 30,
        timeZone: 'Asia/Kolkata',
        status: 'scheduled'
      });
    });

    it('should allow attendee to reschedule to a new available slot', async () => {
      const newTargetDate = getFutureWeekday(17);
      const newStartAt = zonedTimeToUtc(newTargetDate, '15:00', 'Asia/Kolkata');
      const mId = meetingToManage._id ? meetingToManage._id.toString() : meetingToManage.id;

      const res = await request(app)
        .patch(`/api/meetings/${mId}/reschedule`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          newStartAt: newStartAt.toISOString(),
          reason: 'Need to shift due to college lecture'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(new Date(res.body.meeting.startAt).getTime()).toBe(newStartAt.getTime());

      // Verify audit history
      const updated = await Meeting.findById(mId);
      const reschedEvent = updated.history.find(h => h.event === 'rescheduled');
      expect(reschedEvent).toBeDefined();
      expect(reschedEvent.reason).toBe('Need to shift due to college lecture');
    });

    it('should reject rescheduling if the new slot conflicts with another meeting', async () => {
      const busyDate = getFutureWeekday(18);
      const busyStart = zonedTimeToUtc(busyDate, '14:00', 'Asia/Kolkata');
      const busyEnd = zonedTimeToUtc(busyDate, '14:30', 'Asia/Kolkata');

      // Another meeting occupies 14:00 - 14:30
      await Meeting.create({
        recruiter: recruiterUser._id,
        candidate: candidate2User._id,
        startAt: busyStart,
        endAt: busyEnd,
        durationMinutes: 30,
        timeZone: 'Asia/Kolkata',
        status: 'scheduled'
      });

      const mId = meetingToManage._id ? meetingToManage._id.toString() : meetingToManage.id;

      const res = await request(app)
        .patch(`/api/meetings/${mId}/reschedule`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          newStartAt: busyStart.toISOString(),
          reason: 'Attempting to shift into an already occupied slot'
        });

      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/already booked|no longer available/i);
    });

    it('should allow attendee to cancel a meeting and release the slot', async () => {
      const mId = meetingToManage._id ? meetingToManage._id.toString() : meetingToManage.id;

      const res = await request(app)
        .patch(`/api/meetings/${mId}/cancel`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          reason: 'Accepted another offer'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.meeting.status).toBe('cancelled');

      const updated = await Meeting.findById(mId);
      expect(updated.status).toBe('cancelled');
      expect(updated.cancellationReason).toBe('Accepted another offer');
      expect(updated.cancelledAt).toBeDefined();
    });

    it('should reject cancelling an already cancelled meeting', async () => {
      const mId = meetingToManage._id ? meetingToManage._id.toString() : meetingToManage.id;

      await request(app)
        .patch(`/api/meetings/${mId}/cancel`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ reason: 'Initial cancel' });

      const secondCancel = await request(app)
        .patch(`/api/meetings/${mId}/cancel`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ reason: 'Second cancel attempt' });

      expect(secondCancel.status).toBe(400);
      expect(secondCancel.body.message).toMatch(/already been cancelled/i);
    });
  });

  // ==========================================================================
  // 7. LEGACY /api/bookings COMPATIBILITY ROUTES
  // ==========================================================================
  describe('7. Legacy /api/bookings Compatibility Routes', () => {
    it('GET /api/bookings/availability should return slots and assigned host', async () => {
      const targetDate = getFutureWeekday(19);

      const res = await request(app)
        .get(`/api/bookings/availability?date=${targetDate}&timezone=Asia/Kolkata`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.slots).toBeDefined();
      expect(Array.isArray(res.body.slots)).toBe(true);
      expect(res.body.assignedHost).toBeDefined();
    });

    it('POST /api/bookings should support guest/visitor booking with email', async () => {
      const targetDate = getFutureWeekday(20);

      const res = await request(app)
        .post('/api/bookings')
        .send({
          name: 'Mira Nair',
          email: 'mira.nair@sample.io',
          date: targetDate,
          timeSlot: '11:00 AM - 11:30 AM',
          timezone: 'Asia/Kolkata',
          purpose: 'Platform Demo'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.meeting.reference).toMatch(/^HC-MEET-/);
      expect(res.body.meeting.hostName).toBeDefined();
      expect(res.body.meeting.videoUrl).toBeDefined();
    });

    it('POST /api/bookings/reschedule should reschedule by reference', async () => {
      const targetDate = getFutureWeekday(21);
      const newTargetDate = getFutureWeekday(22);
      const startAt = zonedTimeToUtc(targetDate, '10:00', 'Asia/Kolkata');
      const endAt = zonedTimeToUtc(targetDate, '10:30', 'Asia/Kolkata');

      const meet = await Meeting.create({
        recruiter: recruiterUser._id,
        candidate: candidateUser._id,
        reference: 'HC-MEET-123456',
        title: 'Legacy Booking Test',
        startAt,
        endAt,
        durationMinutes: 30,
        timeZone: 'Asia/Kolkata',
        status: 'scheduled'
      });

      const res = await request(app)
        .post('/api/bookings/reschedule')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          reference: 'HC-MEET-123456',
          newDate: newTargetDate,
          newSlot: '02:00 PM - 02:30 PM',
          reason: 'Need afternoon slot'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.meeting.reference).toBe('HC-MEET-123456');
    });

    it('POST /api/bookings/cancel should cancel by reference', async () => {
      const targetDate = getFutureWeekday(23);
      const startAt = zonedTimeToUtc(targetDate, '10:00', 'Asia/Kolkata');
      const endAt = zonedTimeToUtc(targetDate, '10:30', 'Asia/Kolkata');

      await Meeting.create({
        recruiter: recruiterUser._id,
        candidate: candidateUser._id,
        reference: 'HC-MEET-654321',
        title: 'Legacy Cancel Test',
        startAt,
        endAt,
        durationMinutes: 30,
        timeZone: 'Asia/Kolkata',
        status: 'scheduled'
      });

      const res = await request(app)
        .post('/api/bookings/cancel')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          reference: 'HC-MEET-654321',
          reason: 'Schedule conflict'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.meeting.status).toBe('cancelled');
    });
  });
});
