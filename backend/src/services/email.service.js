/**
 * Centralized Email Service for HireConnect
 * Genuine SMTP delivery via Nodemailer (e.g. Gmail SMTP, custom SMTP),
 * dynamic authenticated recipient routing, zero sandbox redirection,
 * and reliable transactional outbox processing.
 */

const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const NotificationOutbox = require('../models/notificationOutbox.model');

// Basic RFC 5322 compliant email regex for runtime safety
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.sentEmails = []; // In-memory audit trail for testing and inspection
    this.hasWarnedUnconfigured = false;

    this.initTransporter();
  }

  /**
   * Initialize Nodemailer transport using standard SMTP environment variables
   */
  initTransporter() {
    // In automated test mode (vitest / jest), use test adapter to prevent network calls
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
          return { messageId, accepted: [options.to], rejected: [], response: '250 OK: Mock message queued' };
        },
        verify: async () => true
      };
      return;
    }

    const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '465', 10);
    const secure = process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === 'true'
      : port === 465;
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.EMAIL_PASS;

    if (user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: { user, pass },
          connectionTimeout: 15000,
          greetingTimeout: 10000,
          socketTimeout: 20000,
          tls: {
            rejectUnauthorized: process.env.NODE_ENV === 'production'
          }
        });
        this.isConfigured = true;
        logger.info(`[EmailService] Configured SMTP transporter via ${host}:${port} (secure: ${secure})`);
      } catch (err) {
        logger.error(`[EmailService] Failed to initialize SMTP transport: ${err.message}`);
        this.isConfigured = false;
      }
    } else {
      this.isConfigured = false;
      if (!this.hasWarnedUnconfigured) {
        logger.warn(
          '[EmailService] SMTP credentials (SMTP_USER / SMTP_PASS) not configured in environment. Outgoing transactional emails will be recorded to outbox without blocking user actions.'
        );
        this.hasWarnedUnconfigured = true;
      }
    }
  }

  /**
   * Verify SMTP connection and credentials with the upstream mail server
   * @returns {Promise<{ success: boolean, message: string, code?: string }>}
   */
  async verifyConnection() {
    if (process.env.NODE_ENV === 'test') {
      return {
        success: true,
        message: 'SMTP transport is using an active test/mock adapter.'
      };
    }

    if (!this.isConfigured || !this.transporter) {
      return {
        success: false,
        message: 'SMTP transport is not configured in the environment (missing SMTP_USER or SMTP_PASS).'
      };
    }

    try {
      await this.transporter.verify();
      logger.info('[EmailService] SMTP server connection and credentials verified successfully.');
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
   * Get safe configuration status (never leaks passwords or credentials)
   */
  getStatus() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    const user = process.env.SMTP_USER || null;
    return {
      configured: this.isConfigured,
      host,
      port,
      secure: process.env.SMTP_SECURE === 'true' || port === 465,
      userConfigured: Boolean(user),
      userMasked: user ? `${user.substring(0, 3)}***@${user.split('@')[1] || ''}` : null,
      fromAddress: process.env.EMAIL_FROM || (user ? `HireConnect <${user}>` : 'HireConnect <noreply@hireconnect.io>')
    };
  }

  /**
   * Sends a transactional email strictly to the dynamic intended recipient
   * Never redirects to a developer or fallback inbox
   * @param {object} mailOptions { to, subject, html, text, from }
   * @returns {Promise<{ success: boolean, messageId?: string, error?: string, code?: string }>}
   */
  async sendEmail({ to, subject, html, text, from }) {
    const defaultUser = process.env.SMTP_USER;
    const fromAddress = from || process.env.EMAIL_FROM || (defaultUser ? `HireConnect <${defaultUser}>` : 'HireConnect <noreply@hireconnect.io>');

    // 1. Validate required fields
    if (!to || !subject || (!html && !text)) {
      return {
        success: false,
        error: 'Recipient (to), subject, and content (html/text) are required.'
      };
    }

    // 2. Validate recipient email format
    const cleanTo = String(to).trim();
    if (!cleanTo || !EMAIL_REGEX.test(cleanTo)) {
      const err = `Invalid recipient email address format: "${cleanTo}"`;
      logger.warn(`[EmailService] ${err}`);
      return { success: false, error: err, code: 'INVALID_RECIPIENT' };
    }

    // 3. Automated test mode: record and return immediately
    if (process.env.NODE_ENV === 'test') {
      const messageId = `<test-${Date.now()}@hireconnect.io>`;
      this.sentEmails.push({
        to: cleanTo,
        from: fromAddress,
        subject,
        html,
        text,
        messageId,
        sentAt: new Date()
      });
      return { success: true, messageId, accepted: [cleanTo], rejected: [] };
    }

    // 4. Safe fallback when SMTP is unconfigured in development
    if (!this.isConfigured || !this.transporter) {
      logger.info(`[EmailService:Unconfigured] Outgoing email to ${cleanTo}: "${subject}" (Simulated - SMTP unconfigured)`);
      this.sentEmails.push({
        to: cleanTo,
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

    // 5. Genuine SMTP transmission via Nodemailer strictly to the specified recipient
    try {
      const info = await this.transporter.sendMail({
        from: fromAddress,
        to: cleanTo,
        subject,
        html,
        text
      });

      this.sentEmails.push({
        to: cleanTo,
        from: fromAddress,
        subject,
        messageId: info.messageId,
        sentAt: new Date()
      });

      logger.info(`[EmailService] Successfully sent email to ${cleanTo} (MessageId: ${info.messageId})`);
      return {
        success: true,
        messageId: info.messageId,
        accepted: info.accepted || [cleanTo],
        rejected: info.rejected || []
      };
    } catch (err) {
      // Redact any connection strings or sensitive tokens from error message
      const safeErrMsg = logger.redactConnectionString(err.message || 'SMTP transmission error');
      logger.error(`[EmailService] SMTP delivery failed to ${cleanTo}: ${safeErrMsg}`);

      // STRICT REQUIREMENT: Zero fallback redirection. Report failure cleanly.
      return {
        success: false,
        error: safeErrMsg,
        code: err.code || 'SMTP_ERROR'
      };
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
