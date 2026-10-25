/**
 * Email Service for HireConnect (Phase 9)
 * Provider abstraction supporting genuine SMTP delivery via Nodemailer,
 * transactional outbox processing with exponential backoff retries,
 * and test/sandboxed delivery tracking.
 */

const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const NotificationOutbox = require('../models/notificationOutbox.model');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.sentEmails = []; // In-memory history for testing and audit
    this.hasWarnedUnconfigured = false;

    this.initTransporter();
  }

  /**
   * Initialize Nodemailer transport from environment configuration
   */
  initTransporter() {
    const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.EMAIL_PASS;
    const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;

    // In automated test mode, use test/mock transport to prevent accidental network leaks
    if (process.env.NODE_ENV === 'test') {
      this.isConfigured = true;
      this.transporter = {
        sendMail: async (options) => {
          const messageId = `<mock-${Date.now()}-${Math.random().toString(36).substring(2, 7)}@hireconnect.io>`;
          this.sentEmails.push({
            ...options,
            messageId,
            sentAt: new Date()
          });
          return { messageId, accepted: [options.to], response: '250 OK: Mock message queued' };
        }
      };
      return;
    }

    if (host && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: { user, pass },
          pool: true,
          maxConnections: 5,
          maxMessages: 100
        });
        this.isConfigured = true;
        logger.info(`[EmailService] Configured genuine SMTP delivery via ${host}:${port}`);
      } catch (err) {
        logger.error(`[EmailService] Failed to initialize SMTP transport: ${err.message}`);
        this.isConfigured = false;
      }
    } else {
      this.isConfigured = false;
      if (!this.hasWarnedUnconfigured) {
        logger.warn('[EmailService] SMTP credentials not configured in environment. Outgoing transactional emails will be queued/logged safely. In-app notifications remain fully functional.');
        this.hasWarnedUnconfigured = true;
      }
    }
  }

  /**
   * Verify SMTP connection and credentials with the upstream provider
   * @returns {Promise<{ success: boolean, message: string, code?: string }>}
   */
  async verifyConnection() {
    if (!this.isConfigured || !this.transporter) {
      return {
        success: false,
        message: 'SMTP transport is not configured in the environment.'
      };
    }

    if (typeof this.transporter.verify !== 'function') {
      return {
        success: true,
        message: 'SMTP transport is using an active test/mock adapter.'
      };
    }

    try {
      await this.transporter.verify();
      return {
        success: true,
        message: 'SMTP server connection and credentials verified successfully.'
      };
    } catch (err) {
      const sanitizedMessage = logger.redactConnectionString(err.message || 'SMTP connection failed');
      logger.error(`[EmailService] SMTP verification failed: ${sanitizedMessage}`);
      return {
        success: false,
        message: sanitizedMessage,
        code: err.code || 'SMTP_VERIFICATION_FAILED'
      };
    }
  }

  /**
   * Sends a transactional email or logs to outbox if SMTP is unconfigured
   * @param {object} mailOptions { to, subject, html, text, from }
   * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
   */
  async sendEmail({ to, subject, html, text, from }) {
    const fromAddress = from || process.env.EMAIL_FROM || 'HireConnect <onboarding@resend.dev>';

    if (!to || !subject || (!html && !text)) {
      return { success: false, error: 'Recipient, subject, and content are required.' };
    }

    // In test mode, record and return success immediately
    if (process.env.NODE_ENV === 'test') {
      const messageId = `<test-${Date.now()}@hireconnect.io>`;
      this.sentEmails.push({ to, from: fromAddress, subject, html, text, messageId, sentAt: new Date() });
      return { success: true, messageId };
    }

    // If SMTP is not configured, track safely without throwing or breaking business flow
    if (!this.isConfigured || !this.transporter) {
      logger.info(`[EmailService:Unconfigured] Simulated email dispatch to ${to}: "${subject}"`);
      this.sentEmails.push({
        to,
        from: fromAddress,
        subject,
        html,
        text,
        simulated: true,
        sentAt: new Date()
      });
      return {
        success: false,
        error: 'SMTP provider unconfigured. Email logged to outbox.',
        unconfigured: true
      };
    }

    try {
      const info = await this.transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        html,
        text
      });

      this.sentEmails.push({
        to,
        from: fromAddress,
        subject,
        messageId: info.messageId,
        sentAt: new Date()
      });

      logger.info(`[EmailService] Delivered email to ${to} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      const safeErrMsg = logger.redactConnectionString(err.message || 'Delivery error');
      logger.error(`[EmailService] Delivery failed to ${to}: ${safeErrMsg}`);
      return { success: false, error: safeErrMsg };
    }
  }

  /**
   * Processes pending and retry-scheduled outbox emails with exponential backoff
   * @param {number} batchSize
   */
  async processPendingOutbox(batchSize = 10) {
    const now = new Date();
    const pendingItems = await NotificationOutbox.find({
      status: { $in: ['pending', 'retry_scheduled'] },
      nextRetryAt: { $lte: now }
    })
      .sort({ nextRetryAt: 1 })
      .limit(batchSize);

    if (pendingItems.length === 0) return { processed: 0, sent: 0, failed: 0 };

    let sent = 0;
    let failed = 0;

    for (const item of pendingItems) {
      item.status = 'processing';
      item.attempts += 1;
      await item.save();

      const result = await this.sendEmail({
        to: item.recipient,
        subject: item.subject,
        html: item.htmlContent,
        text: item.textContent
      });

      if (result.success) {
        item.status = 'sent';
        item.sentAt = new Date();
        item.lastError = null;
        await item.save();
        sent++;
      } else {
        item.lastError = result.error || 'Unknown delivery failure';
        if (item.attempts >= item.maxAttempts) {
          item.status = 'failed';
          logger.warn(`[EmailService] Outbox event ${item.eventId} reached max attempts (${item.maxAttempts}). Marked as permanently failed.`);
        } else {
          item.status = 'retry_scheduled';
          // Exponential backoff: 1m, 2m, 4m, 8m...
          const backoffMinutes = Math.pow(2, item.attempts - 1);
          item.nextRetryAt = new Date(Date.now() + backoffMinutes * 60000);
          logger.info(`[EmailService] Outbox event ${item.eventId} scheduled for retry #${item.attempts} in ${backoffMinutes} minute(s).`);
        }
        await item.save();
        failed++;
      }
    }

    return { processed: pendingItems.length, sent, failed };
  }

  /**
   * Retrieves sent emails history (for inspection and unit tests)
   */
  getSentEmails() {
    return [...this.sentEmails];
  }

  getLastSentEmail() {
    return this.sentEmails[this.sentEmails.length - 1] || null;
  }

  clearSentEmails() {
    this.sentEmails.length = 0;
  }
}

module.exports = new EmailService();
