/**
 * Central Notification Service for HireConnect (Phase 9)
 * Manages persistent in-app notifications, user preferences, deduplication,
 * and reliable transactional email triggering.
 */

const Notification = require('../models/notification.model');
const NotificationOutbox = require('../models/notificationOutbox.model');
const User = require('../models/user.model');
const emailService = require('./email.service');
const emailTemplates = require('../templates/emails/emailTemplates');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

// Map notification types to user email preference categories
const TYPE_TO_PREFERENCE_CATEGORY = {
  application_submitted: 'applicationStatus',
  application_status_changed: 'applicationStatus',
  application_withdrawn: 'newApplicant',
  new_applicant: 'newApplicant',
  interview_booked: 'interviewBooked',
  interview_rescheduled: 'interviewBooked',
  interview_cancelled: 'interviewBooked',
  interview_reminder: 'interviewReminders',
  job_published: 'jobUpdates',
  job_closed: 'jobUpdates',
  company_verification_updated: 'companyVerification'
};

class NotificationService {
  /**
   * Internal frontend base URL getter
   */
  getFrontendUrl() {
    const urls = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',')[0].trim() : 'http://localhost:3000';
    return urls.replace(/\/+$/, '');
  }

  /**
   * Core notification dispatcher: creates persistent in-app notification
   * and conditionally queues/sends email if preferences allow.
   */
  async createNotification({
    recipientId,
    type,
    title,
    message,
    resourceType = 'system',
    resourceId = null,
    actionUrl = '/',
    deduplicationKey = null,
    metadata = {},
    emailOptions = null
  }) {
    if (!recipientId) {
      logger.warn('[NotificationService] Missing recipientId for notification creation.');
      return null;
    }

    const rId = recipientId._id ? recipientId._id.toString() : recipientId.toString();

    // 1. Deduplication Check
    if (deduplicationKey) {
      const existing = await Notification.findOne({
        recipient: rId,
        deduplicationKey
      });
      if (existing) {
        logger.info(`[NotificationService] Duplicate notification suppressed for key: ${deduplicationKey}`);
        const duplicate = existing.toObject ? existing.toObject() : { ...existing };
        duplicate.isDuplicate = true;
        duplicate.id = existing._id ? existing._id.toString() : existing.id;
        return duplicate;
      }
    }

    // 2. Persist In-App Notification
    let notification;
    try {
      notification = await Notification.create({
        recipient: rId,
        type,
        title,
        message,
        resourceType,
        resourceId: resourceId ? resourceId.toString() : null,
        actionUrl,
        deduplicationKey,
        metadata
      });
    } catch (err) {
      logger.error(`[NotificationService] Failed to persist in-app notification: ${err.message}`);
      return null;
    }

    // 3. Evaluate User Email Preferences
    try {
      const recipientUser = await User.findById(rId);
      if (recipientUser && recipientUser.email) {
        const category = TYPE_TO_PREFERENCE_CATEGORY[type];
        const prefs = recipientUser.notificationPreferences?.email;

        // If category is configured and explicitly set to false, skip email
        const isEmailAllowed = !category || !prefs || prefs[category] !== false;

        if (isEmailAllowed && emailOptions) {
          await this.queueAndDispatchEmail({
            recipientEmail: recipientUser.email,
            recipientId: rId,
            type,
            deduplicationKey,
            emailOptions
          });
        }
      }
    } catch (emailErr) {
      // Email failure MUST NEVER crash or corrupt the primary business workflow
      logger.error(`[NotificationService] Error evaluating/dispatching email for notif ${notification.id}: ${emailErr.message}`);
    }

    return notification;
  }

  /**
   * Queues an email into the NotificationOutbox and attempts delivery
   */
  async queueAndDispatchEmail({ recipientEmail, recipientId, type, deduplicationKey, emailOptions }) {
    const eventId = `evt-${deduplicationKey || `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`}`;

    // Check if outbox event already exists
    let outboxEntry = await NotificationOutbox.findOne({ eventId });
    if (!outboxEntry) {
      outboxEntry = await NotificationOutbox.create({
        eventId,
        eventType: type,
        recipient: recipientEmail,
        recipientId,
        subject: emailOptions.subject,
        htmlContent: emailOptions.html,
        textContent: emailOptions.text,
        status: 'pending'
      });
    }

    // Attempt direct dispatch
    try {
      const result = await emailService.sendEmail({
        to: recipientEmail,
        subject: emailOptions.subject,
        html: emailOptions.html,
        text: emailOptions.text
      });

      if (result.success) {
        outboxEntry.status = 'sent';
        outboxEntry.sentAt = new Date();
        outboxEntry.lastError = null;
        await outboxEntry.save();
      } else {
        outboxEntry.attempts += 1;
        outboxEntry.lastError = result.error || 'Delivery failed';
        outboxEntry.status = outboxEntry.attempts >= outboxEntry.maxAttempts ? 'failed' : 'retry_scheduled';
        outboxEntry.nextRetryAt = new Date(Date.now() + 60000); // Retry in 1 min
        await outboxEntry.save();
      }
    } catch (dispatchErr) {
      outboxEntry.attempts += 1;
      outboxEntry.lastError = dispatchErr.message;
      outboxEntry.status = 'retry_scheduled';
      outboxEntry.nextRetryAt = new Date(Date.now() + 60000);
      await outboxEntry.save();
    }
  }

  // ==========================================================================
  // BUSINESS WORKFLOW EVENT HELPERS
  // ==========================================================================

  /**
   * Triggered when a candidate submits an application
   */
  async notifyApplicationSubmitted({ application, candidate, job, company }) {
    const candidateId = candidate._id || candidate.id;
    const jobId = job._id || job.id;
    const appId = application._id || application.id;
    const jobTitle = job.title || 'Job Opening';
    const companyName = company?.name || 'HireConnect Partner';
    const baseUrl = this.getFrontendUrl();
    const actionUrl = `/applications/${appId}`;

    // 1. Candidate in-app & email notification
    const candidateEmail = emailTemplates.applicationSubmitted({
      candidateName: candidate.name,
      jobTitle,
      companyName,
      actionUrl: `${baseUrl}${actionUrl}`
    });

    await this.createNotification({
      recipientId: candidateId,
      type: 'application_submitted',
      title: 'Application Submitted',
      message: `Your application for ${jobTitle} at ${companyName} has been submitted successfully.`,
      resourceType: 'application',
      resourceId: appId,
      actionUrl,
      deduplicationKey: `app_sub:${appId}:${candidateId}`,
      metadata: { jobTitle, companyName, jobId },
      emailOptions: candidateEmail
    });

    // 2. Recruiter in-app & email notification
    const recruiterId = job.recruiter?._id || job.recruiter || job.createdBy?._id || job.createdBy;
    if (recruiterId) {
      const recruiterEmail = emailTemplates.newApplicant({
        recruiterName: 'Hiring Team',
        candidateName: candidate.name,
        jobTitle,
        companyName,
        actionUrl: `${baseUrl}/applications/job/${jobId}`
      });

      await this.createNotification({
        recipientId: recruiterId,
        type: 'new_applicant',
        title: 'New Applicant Received',
        message: `${candidate.name} applied for your job opening: ${jobTitle}.`,
        resourceType: 'application',
        resourceId: appId,
        actionUrl: `/applications/job/${jobId}`,
        deduplicationKey: `new_app:${appId}:${recruiterId}`,
        metadata: { candidateName: candidate.name, jobTitle, companyName },
        emailOptions: recruiterEmail
      });
    }
  }

  /**
   * Triggered when recruiter updates an application's status
   */
  async notifyApplicationStatusChanged({ application, candidate, job, company, previousStatus, newStatus }) {
    if (previousStatus === newStatus) return; // Ignore no-op updates

    const candidateId = candidate._id || candidate.id || application.candidate;
    const appId = application._id || application.id;
    const jobTitle = job?.title || 'Job Opening';
    const companyName = company?.name || 'HireConnect Partner';
    const baseUrl = this.getFrontendUrl();
    const actionUrl = `/applications/${appId}`;
    const statusLabel = newStatus.replace(/_/g, ' ');

    const email = emailTemplates.applicationStatusChanged({
      candidateName: candidate?.name || 'Candidate',
      jobTitle,
      companyName,
      newStatus,
      actionUrl: `${baseUrl}${actionUrl}`
    });

    await this.createNotification({
      recipientId: candidateId,
      type: 'application_status_changed',
      title: `Application Status: ${statusLabel.toUpperCase()}`,
      message: `Your application for ${jobTitle} at ${companyName} has been updated to "${statusLabel}".`,
      resourceType: 'application',
      resourceId: appId,
      actionUrl,
      deduplicationKey: `app_status:${appId}:${newStatus}`,
      metadata: { jobTitle, companyName, previousStatus, newStatus },
      emailOptions: email
    });
  }

  /**
   * Triggered when a candidate withdraws an application
   */
  async notifyApplicationWithdrawn({ application, candidate, job, company }) {
    const recruiterId = job?.recruiter?._id || job?.recruiter || job?.createdBy?._id || job?.createdBy;
    if (!recruiterId) return;

    const appId = application._id || application.id;
    const candidateName = candidate?.name || 'Candidate';
    const jobTitle = job?.title || 'Job Opening';
    const companyName = company?.name || 'HireConnect Partner';
    const baseUrl = this.getFrontendUrl();
    const actionUrl = `/applications/job/${job._id || job.id}`;

    const email = emailTemplates.applicationWithdrawn({
      recruiterName: 'Hiring Team',
      candidateName,
      jobTitle,
      companyName,
      actionUrl: `${baseUrl}${actionUrl}`
    });

    await this.createNotification({
      recipientId: recruiterId,
      type: 'application_withdrawn',
      title: 'Application Withdrawn',
      message: `${candidateName} has withdrawn their application for ${jobTitle}.`,
      resourceType: 'application',
      resourceId: appId,
      actionUrl,
      deduplicationKey: `app_withdraw:${appId}:${recruiterId}`,
      metadata: { candidateName, jobTitle, companyName },
      emailOptions: email
    });
  }

  /**
   * Triggered when an interview is booked
   */
  async notifyInterviewBooked({ meeting, candidate, recruiter, job, company }) {
    const candId = candidate._id || candidate.id;
    const recId = recruiter._id || recruiter.id;
    const mId = meeting._id || meeting.id;
    const meetingTitle = meeting.title || 'HireConnect Interview';
    const dateStr = meeting.startAt ? new Date(meeting.startAt).toISOString().split('T')[0] : '';
    const timeZone = meeting.timeZone || 'Asia/Kolkata';
    const timeSlotStr = `${new Date(meeting.startAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone })} - ${new Date(meeting.endAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone })}`;
    const baseUrl = this.getFrontendUrl();
    const actionUrl = `/meetings/${mId}`;

    // 1. Notify Candidate
    const candEmail = emailTemplates.interviewBooked({
      recipientName: candidate.name,
      otherParticipantName: recruiter.name || 'Recruiter',
      role: 'candidate',
      meetingTitle,
      dateStr,
      timeSlotStr,
      timeZone,
      videoUrl: meeting.meetingLink,
      actionUrl: `${baseUrl}${actionUrl}`
    });

    await this.createNotification({
      recipientId: candId,
      type: 'interview_booked',
      title: 'Interview Scheduled',
      message: `Your interview "${meetingTitle}" with ${recruiter.name || 'the recruiter'} is confirmed for ${dateStr}.`,
      resourceType: 'meeting',
      resourceId: mId,
      actionUrl,
      deduplicationKey: `interview_booked:${mId}:${candId}`,
      metadata: { meetingTitle, dateStr, timeSlotStr, timeZone, videoUrl: meeting.meetingLink },
      emailOptions: candEmail
    });

    // 2. Notify Recruiter
    const recEmail = emailTemplates.interviewBooked({
      recipientName: recruiter.name,
      otherParticipantName: candidate.name || 'Candidate',
      role: 'recruiter',
      meetingTitle,
      dateStr,
      timeSlotStr,
      timeZone,
      videoUrl: meeting.meetingLink,
      actionUrl: `${baseUrl}${actionUrl}`
    });

    await this.createNotification({
      recipientId: recId,
      type: 'interview_booked',
      title: 'New Interview Booked',
      message: `${candidate.name || 'A candidate'} booked "${meetingTitle}" for ${dateStr} at ${timeSlotStr}.`,
      resourceType: 'meeting',
      resourceId: mId,
      actionUrl,
      deduplicationKey: `interview_booked:${mId}:${recId}`,
      metadata: { meetingTitle, dateStr, timeSlotStr, timeZone, videoUrl: meeting.meetingLink },
      emailOptions: recEmail
    });
  }

  /**
   * Triggered when an interview is rescheduled
   */
  async notifyInterviewRescheduled({ meeting, candidate, recruiter, previousStartAt, reason }) {
    const candId = candidate._id || candidate.id;
    const recId = recruiter._id || recruiter.id;
    const mId = meeting._id || meeting.id;
    const meetingTitle = meeting.title || 'HireConnect Interview';
    const dateStr = meeting.startAt ? new Date(meeting.startAt).toISOString().split('T')[0] : '';
    const timeZone = meeting.timeZone || 'Asia/Kolkata';
    const timeSlotStr = `${new Date(meeting.startAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone })} - ${new Date(meeting.endAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone })}`;
    const baseUrl = this.getFrontendUrl();
    const actionUrl = `/meetings/${mId}`;

    const candEmail = emailTemplates.interviewRescheduled({
      recipientName: candidate.name,
      otherParticipantName: recruiter.name || 'Recruiter',
      meetingTitle,
      newDateStr: dateStr,
      newTimeSlotStr: timeSlotStr,
      timeZone,
      videoUrl: meeting.meetingLink,
      reason,
      actionUrl: `${baseUrl}${actionUrl}`
    });

    await this.createNotification({
      recipientId: candId,
      type: 'interview_rescheduled',
      title: 'Interview Rescheduled',
      message: `Your interview "${meetingTitle}" has been rescheduled to ${dateStr} at ${timeSlotStr}.`,
      resourceType: 'meeting',
      resourceId: mId,
      actionUrl,
      deduplicationKey: `interview_resched:${mId}:${new Date(meeting.startAt).getTime()}:${candId}`,
      metadata: { meetingTitle, newDateStr: dateStr, newTimeSlotStr: timeSlotStr, reason },
      emailOptions: candEmail
    });

    const recEmail = emailTemplates.interviewRescheduled({
      recipientName: recruiter.name,
      otherParticipantName: candidate.name || 'Candidate',
      meetingTitle,
      newDateStr: dateStr,
      newTimeSlotStr: timeSlotStr,
      timeZone,
      videoUrl: meeting.meetingLink,
      reason,
      actionUrl: `${baseUrl}${actionUrl}`
    });

    await this.createNotification({
      recipientId: recId,
      type: 'interview_rescheduled',
      title: 'Interview Rescheduled',
      message: `Interview "${meetingTitle}" with ${candidate.name} has been rescheduled to ${dateStr} at ${timeSlotStr}.`,
      resourceType: 'meeting',
      resourceId: mId,
      actionUrl,
      deduplicationKey: `interview_resched:${mId}:${new Date(meeting.startAt).getTime()}:${recId}`,
      metadata: { meetingTitle, newDateStr: dateStr, newTimeSlotStr: timeSlotStr, reason },
      emailOptions: recEmail
    });
  }

  /**
   * Triggered when an interview is cancelled
   */
  async notifyInterviewCancelled({ meeting, candidate, recruiter, actor, reason }) {
    const candId = candidate._id || candidate.id;
    const recId = recruiter._id || recruiter.id;
    const mId = meeting._id || meeting.id;
    const meetingTitle = meeting.title || 'HireConnect Interview';
    const dateStr = meeting.startAt ? new Date(meeting.startAt).toISOString().split('T')[0] : '';
    const timeZone = meeting.timeZone || 'Asia/Kolkata';
    const timeSlotStr = `${new Date(meeting.startAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone })} - ${new Date(meeting.endAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone })}`;
    const baseUrl = this.getFrontendUrl();
    const actionUrl = '/meetings';

    const candEmail = emailTemplates.interviewCancelled({
      recipientName: candidate.name,
      otherParticipantName: recruiter.name || 'Recruiter',
      meetingTitle,
      dateStr,
      timeSlotStr,
      reason,
      actionUrl: `${baseUrl}${actionUrl}`
    });

    await this.createNotification({
      recipientId: candId,
      type: 'interview_cancelled',
      title: 'Interview Cancelled',
      message: `Your interview "${meetingTitle}" for ${dateStr} has been cancelled.`,
      resourceType: 'meeting',
      resourceId: mId,
      actionUrl,
      deduplicationKey: `interview_cancelled:${mId}:${candId}`,
      metadata: { meetingTitle, dateStr, timeSlotStr, reason },
      emailOptions: candEmail
    });

    const recEmail = emailTemplates.interviewCancelled({
      recipientName: recruiter.name,
      otherParticipantName: candidate.name || 'Candidate',
      meetingTitle,
      dateStr,
      timeSlotStr,
      reason,
      actionUrl: `${baseUrl}${actionUrl}`
    });

    await this.createNotification({
      recipientId: recId,
      type: 'interview_cancelled',
      title: 'Interview Cancelled',
      message: `Interview "${meetingTitle}" with ${candidate.name} for ${dateStr} has been cancelled.`,
      resourceType: 'meeting',
      resourceId: mId,
      actionUrl,
      deduplicationKey: `interview_cancelled:${mId}:${recId}`,
      metadata: { meetingTitle, dateStr, timeSlotStr, reason },
      emailOptions: recEmail
    });
  }

  /**
   * Triggered when company verification status is updated by an admin
   */
  async notifyCompanyVerificationUpdated({ company, owner, status, reviewNotes }) {
    if (!owner) return;
    const ownerId = owner._id || owner.id;
    const companyId = company._id || company.id;
    const companyName = company.name;
    const baseUrl = this.getFrontendUrl();
    const actionUrl = `/companies/${company.slug || companyId}`;

    const email = emailTemplates.companyVerificationResult({
      ownerName: owner.name,
      companyName,
      status,
      reviewNotes,
      actionUrl: `${baseUrl}${actionUrl}`
    });

    await this.createNotification({
      recipientId: ownerId,
      type: 'company_verification_updated',
      title: `Company Verification: ${status.toUpperCase()}`,
      message: `Your corporate verification request for ${companyName} has been ${status}.`,
      resourceType: 'company',
      resourceId: companyId,
      actionUrl,
      deduplicationKey: `corp_verify:${companyId}:${status}`,
      metadata: { companyName, status, reviewNotes },
      emailOptions: email
    });
  }

  /**
   * Triggered when a job is published or closed
   */
  async notifyJobStatusChanged({ job, recruiter, status }) {
    if (!recruiter) return;
    const recId = recruiter._id || recruiter.id;
    const jobId = job._id || job.id;
    const jobTitle = job.title;
    const actionUrl = `/recruiter/jobs/${jobId}`;

    await this.createNotification({
      recipientId: recId,
      type: status === 'published' ? 'job_published' : 'job_closed',
      title: `Job ${status === 'published' ? 'Published' : 'Closed'}`,
      message: `Your job listing "${jobTitle}" has been ${status}.`,
      resourceType: 'job',
      resourceId: jobId,
      actionUrl,
      deduplicationKey: `job_status:${jobId}:${status}`,
      metadata: { jobTitle, status }
    });
  }

  /**
   * Triggered when an administrator changes a user's account status (suspend / reactivate)
   */
  async notifyUserStatusChanged({ user, status, reason }) {
    if (!user) return;
    const userId = user._id || user.id;
    const baseUrl = this.getFrontendUrl();
    const actionUrl = '/about/';

    const email = emailTemplates.accountStatusChanged({
      userName: user.name,
      status,
      reason,
      actionUrl: `${baseUrl}${actionUrl}`
    });

    await this.createNotification({
      recipientId: userId,
      type: status === 'suspended' ? 'account_suspended' : 'account_reactivated',
      title: `Account Notice: ${status.toUpperCase()}`,
      message: `Your account status is now ${status}.${reason ? ` Reason: ${reason}` : ''}`,
      resourceType: 'user',
      resourceId: userId,
      actionUrl,
      deduplicationKey: `user_status:${userId}:${status}:${Date.now()}`,
      metadata: { status, reason },
      emailOptions: email
    });
  }

  /**
   * Triggered when an administrator moderates a job (remove from listings / restore)
   */
  async notifyJobModerated({ job, recruiter, action, reason }) {
    if (!recruiter) return;
    const recId = recruiter._id || recruiter.id;
    const jobId = job._id || job.id;
    const jobTitle = job.title;
    const baseUrl = this.getFrontendUrl();
    const actionUrl = `/approach/?tab=jobs`;

    const email = emailTemplates.jobModerated({
      recruiterName: recruiter.name,
      jobTitle,
      action,
      reason,
      actionUrl: `${baseUrl}${actionUrl}`
    });

    await this.createNotification({
      recipientId: recId,
      type: action === 'remove' ? 'job_moderation_removed' : 'job_moderation_restored',
      title: `Job Notice: ${action === 'remove' ? 'Removed from Listings' : 'Restored'}`,
      message: `Your job "${jobTitle}" has been ${action === 'remove' ? 'removed from public discovery' : 'restored to active listings'}.${reason ? ` Note: ${reason}` : ''}`,
      resourceType: 'job',
      resourceId: jobId,
      actionUrl,
      deduplicationKey: `job_mod:${jobId}:${action}:${Date.now()}`,
      metadata: { jobTitle, action, reason },
      emailOptions: email
    });
  }

  // ==========================================================================
  // USER NOTIFICATION MANAGEMENT API
  // ==========================================================================

  /**
   * Retrieves paginated notifications for the authenticated user
   */
  async getUserNotifications(userId, options = {}) {
    const page = Math.max(1, parseInt(options.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(options.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const query = {
      recipient: userId,
      isDismissed: false
    };

    if (options.read === 'true') {
      query.readAt = { $ne: null };
    } else if (options.read === 'false') {
      query.readAt = null;
    }

    const [notifications, totalCount, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments(query),
      Notification.countDocuments({ recipient: userId, isDismissed: false, readAt: null })
    ]);

    return {
      success: true,
      notifications: notifications.map((n) => (n.toJSON ? n.toJSON() : n)),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1
      },
      unreadCount
    };
  }

  /**
   * Returns unread notification count for authenticated user
   */
  async getUnreadCount(userId) {
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isDismissed: false,
      readAt: null
    });
    return { success: true, unreadCount };
  }

  /**
   * Marks a specific notification as read, enforcing user ownership
   */
  async markAsRead(userId, notificationId) {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw ApiError.notFound('Notification not found.');
    }

    const recId = notification.recipient?._id ? notification.recipient._id.toString() : notification.recipient.toString();
    if (recId !== userId.toString()) {
      throw ApiError.forbidden('You are not authorized to access this notification.');
    }

    if (!notification.readAt) {
      notification.readAt = new Date();
      await notification.save();
    }

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isDismissed: false,
      readAt: null
    });

    return {
      success: true,
      message: 'Notification marked as read.',
      notification: notification.toJSON ? notification.toJSON() : notification,
      unreadCount
    };
  }

  /**
   * Marks all notifications belonging to the authenticated user as read
   */
  async markAllAsRead(userId) {
    await Notification.updateMany(
      { recipient: userId, isDismissed: false, readAt: null },
      { $set: { readAt: new Date() } }
    );

    return {
      success: true,
      message: 'All notifications marked as read.',
      unreadCount: 0
    };
  }

  /**
   * Dismisses/archives a notification belonging to the authenticated user
   */
  async dismissNotification(userId, notificationId) {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw ApiError.notFound('Notification not found.');
    }

    const recId = notification.recipient?._id ? notification.recipient._id.toString() : notification.recipient.toString();
    if (recId !== userId.toString()) {
      throw ApiError.forbidden('You are not authorized to modify this notification.');
    }

    notification.isDismissed = true;
    await notification.save();

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isDismissed: false,
      readAt: null
    });

    return {
      success: true,
      message: 'Notification dismissed successfully.',
      unreadCount
    };
  }

  /**
   * Retrieves notification preferences for authenticated user
   */
  async getUserPreferences(userId) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found.');

    const defaultPreferences = {
      email: {
        applicationStatus: true,
        newApplicant: true,
        interviewBooked: true,
        interviewReminders: true,
        jobUpdates: true,
        companyVerification: true
      },
      inApp: {
        all: true
      }
    };

    return {
      success: true,
      preferences: user.notificationPreferences || defaultPreferences
    };
  }

  /**
   * Updates notification preferences for authenticated user
   */
  async updateUserPreferences(userId, updates = {}) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found.');

    const current = user.notificationPreferences || {
      email: {
        applicationStatus: true,
        newApplicant: true,
        interviewBooked: true,
        interviewReminders: true,
        jobUpdates: true,
        companyVerification: true
      },
      inApp: {
        all: true
      }
    };

    if (updates.email) {
      current.email = {
        ...current.email,
        ...(typeof updates.email.applicationStatus === 'boolean' && { applicationStatus: updates.email.applicationStatus }),
        ...(typeof updates.email.newApplicant === 'boolean' && { newApplicant: updates.email.newApplicant }),
        ...(typeof updates.email.interviewBooked === 'boolean' && { interviewBooked: updates.email.interviewBooked }),
        ...(typeof updates.email.interviewReminders === 'boolean' && { interviewReminders: updates.email.interviewReminders }),
        ...(typeof updates.email.jobUpdates === 'boolean' && { jobUpdates: updates.email.jobUpdates }),
        ...(typeof updates.email.companyVerification === 'boolean' && { companyVerification: updates.email.companyVerification })
      };
    }

    if (updates.inApp) {
      current.inApp = {
        ...current.inApp,
        ...(typeof updates.inApp.all === 'boolean' && { all: updates.inApp.all })
      };
    }

    user.notificationPreferences = current;
    await user.save();

    return {
      success: true,
      message: 'Notification preferences updated successfully.',
      preferences: current
    };
  }
}

module.exports = new NotificationService();
