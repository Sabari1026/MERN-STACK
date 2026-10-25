/**
 * Interview Reminder Scheduler Service for HireConnect (Phase 9)
 * Scans upcoming scheduled meetings approaching 24-hour and 1-hour notice intervals,
 * verifies participant eligibility, and triggers idempotent notifications and emails.
 */

const Meeting = require('../models/meeting.model');
const User = require('../models/user.model');
const notificationService = require('./notification.service');
const emailTemplates = require('../templates/emails/emailTemplates');
const logger = require('../utils/logger');

class ReminderService {
  constructor() {
    this.intervalHandle = null;
    this.isProcessing = false;
  }

  /**
   * Starts background reminder polling loop
   * @param {number} checkIntervalMs Poll frequency (default 5 minutes)
   */
  startScheduler(checkIntervalMs = 300000) {
    if (this.intervalHandle) return;

    logger.info('[ReminderService] Starting background interview reminder worker...');
    // Initial sweep shortly after boot
    setTimeout(() => this.processUpcomingMeetingReminders(), 5000);

    this.intervalHandle = setInterval(() => {
      this.processUpcomingMeetingReminders();
    }, checkIntervalMs);

    // Ensure timer doesn't prevent Node process termination
    if (this.intervalHandle.unref) {
      this.intervalHandle.unref();
    }
  }

  /**
   * Stops background reminder worker
   */
  stopScheduler() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
      logger.info('[ReminderService] Stopped interview reminder worker.');
    }
  }

  /**
   * Core reminder processor
   * Evaluates scheduled meetings in approaching 24h and 1h windows
   */
  async processUpcomingMeetingReminders() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const now = new Date();
      // Lookahead window: from now up to 26 hours ahead
      const horizonEnd = new Date(now.getTime() + 26 * 3600000);

      const meetings = await Meeting.find({
        status: 'scheduled',
        startAt: { $gt: now, $lte: horizonEnd }
      });

      if (!meetings || meetings.length === 0) {
        return { processed: 0, remindersSent: 0 };
      }

      let remindersSent = 0;

      for (const meeting of meetings) {
        const meetingId = meeting._id ? meeting._id.toString() : meeting.id;
        const meetingStart = new Date(meeting.startAt).getTime();
        const diffMs = meetingStart - now.getTime();
        const diffHours = diffMs / 3600000;
        const diffMinutes = diffMs / 60000;

        // Determine if meeting falls in 24-hour window (23.5 to 24.5 hours)
        const is24hWindow = diffHours >= 23.5 && diffHours <= 24.5;
        // Determine if meeting falls in 1-hour window (45 to 65 minutes)
        const is1hWindow = diffMinutes >= 45 && diffMinutes <= 65;

        if (!is24hWindow && !is1hWindow) {
          continue;
        }

        const intervalKey = is1hWindow ? '1h' : '24h';
        const intervalText = is1hWindow ? '1 hour' : '24 hours';

        // Load participants
        const [candidateUser, recruiterUser] = await Promise.all([
          User.findById(meeting.candidate?._id || meeting.candidate),
          User.findById(meeting.recruiter?._id || meeting.recruiter)
        ]);

        if (!candidateUser || !recruiterUser) continue;

        const dateStr = new Date(meeting.startAt).toISOString().split('T')[0];
        const timeZone = meeting.timeZone || 'Asia/Kolkata';
        const timeSlotStr = `${new Date(meeting.startAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone })} - ${new Date(meeting.endAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone })}`;
        const meetingTitle = meeting.title || 'HireConnect Interview';
        const videoUrl = meeting.meetingLink;
        const baseUrl = notificationService.getFrontendUrl();
        const actionUrl = `/meetings/${meetingId}`;

        // 1. Dispatch Candidate Reminder
        const candUserId = (candidateUser._id || candidateUser.id).toString();
        const candDedup = `reminder:meeting:${meetingId}:user:${candUserId}:interval:${intervalKey}`;
        const candEmail = emailTemplates.interviewReminder({
          recipientName: candidateUser.name,
          otherParticipantName: recruiterUser.name || 'Recruiter',
          meetingTitle,
          dateStr,
          timeSlotStr,
          timeZone,
          videoUrl,
          intervalText,
          actionUrl: `${baseUrl}${actionUrl}`
        });

        const notif1 = await notificationService.createNotification({
          recipientId: candUserId,
          type: 'interview_reminder',
          title: `Interview Reminder (${intervalText})`,
          message: `Your interview "${meetingTitle}" with ${recruiterUser.name} starts in ${intervalText}.`,
          resourceType: 'meeting',
          resourceId: meetingId,
          actionUrl,
          deduplicationKey: candDedup,
          metadata: { meetingTitle, dateStr, timeSlotStr, intervalText, videoUrl },
          emailOptions: candEmail
        });
        if (notif1 && !notif1.isDuplicate) remindersSent++;

        // 2. Dispatch Recruiter Reminder
        const recUserId = (recruiterUser._id || recruiterUser.id).toString();
        const recDedup = `reminder:meeting:${meetingId}:user:${recUserId}:interval:${intervalKey}`;
        const recEmail = emailTemplates.interviewReminder({
          recipientName: recruiterUser.name,
          otherParticipantName: candidateUser.name || 'Candidate',
          meetingTitle,
          dateStr,
          timeSlotStr,
          timeZone,
          videoUrl,
          intervalText,
          actionUrl: `${baseUrl}${actionUrl}`
        });

        const notif2 = await notificationService.createNotification({
          recipientId: recUserId,
          type: 'interview_reminder',
          title: `Interview Reminder (${intervalText})`,
          message: `Interview "${meetingTitle}" with ${candidateUser.name} starts in ${intervalText}.`,
          resourceType: 'meeting',
          resourceId: meetingId,
          actionUrl,
          deduplicationKey: recDedup,
          metadata: { meetingTitle, dateStr, timeSlotStr, intervalText, videoUrl },
          emailOptions: recEmail
        });
        if (notif2 && !notif2.isDuplicate) remindersSent++;
      }

      return { processed: meetings.length, remindersSent };
    } catch (err) {
      logger.error(`[ReminderService] Error processing meeting reminders: ${err.message}`);
      return { processed: 0, remindersSent: 0, error: err.message };
    } finally {
      this.isProcessing = false;
    }
  }
}

module.exports = new ReminderService();
