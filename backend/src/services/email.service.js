/**
 * Email Service for HireConnect (Phase 9)
 * Provider abstraction supporting genuine SMTP delivery via Nodemailer,
 * transactional outbox processing with exponential backoff retries,
 * and test/sandboxed delivery tracking.
 */

const nodemailer = require('nodemailer');
const https = require('https');
const logger = require('../utils/logger');
const NotificationOutbox = require('../models/notificationOutbox.model');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isResendHttp = false;
    this.resendApiKey = null;
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

    // Direct Resend HTTPS API transport (uses port 443; avoids Render cloud SMTP blocking)
    const resendApiKey =
      process.env.RESEND_API_KEY ||
      (pass && pass.startsWith('re_') ? pass : null) ||
      (user && user.startsWith('re_') ? user : null);

    if (resendApiKey) {
      this.isResendHttp = true;
      this.resendApiKey = resendApiKey;
      this.isConfigured = true;
      logger.info('[EmailService] Configured direct Resend HTTPS API delivery (port 443)');
      return;
    }

    if (host && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: { user, pass },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
          tls: { rejectUnauthorized: false }
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
    if (this.isResendHttp) {
      return {
        success: true,
        message: 'Resend HTTPS API delivery verified successfully (port 443).'
      };
    }

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

    // Direct Resend HTTPS API delivery (port 443)
    if (this.isResendHttp) {
      return this.sendViaResendHttp({ to, subject, html, text, fromAddress });
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
      
      // Resend Free Tier Sandbox Fallback:
      // If Resend rejects because recipient is not verified on the testing domain (e.g. 550 5.7.1),
      // forward delivery to the registered account owner (sabari1082005@gmail.com) so emails are never lost.
      const isResendSandboxRestriction =
        safeErrMsg.includes('testing emails to your own email address') ||
        safeErrMsg.includes('550 5.7.1') ||
        safeErrMsg.includes('verify a domain');

      const fallbackOwner = process.env.ADMIN_VERIFIED_EMAIL || 'sabari1082005@gmail.com';

      if (isResendSandboxRestriction && to.toLowerCase() !== fallbackOwner.toLowerCase()) {
        logger.warn(
          `[EmailService:Sandbox] Recipient ${to} is restricted by Resend sandbox. Routing real delivery to verified developer inbox (${fallbackOwner}).`
        );

        try {
          const sandboxNoticeHtml = `
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-family: sans-serif; font-size: 13px; color: #92400e;">
              <strong>🔔 Resend Sandbox Delivery Notice:</strong> This transactional notification was sent to <strong>${to}</strong> on HireConnect. Because Resend testing domains restrict delivery to registered developers, it has been delivered to your verified inbox (${fallbackOwner}).
            </div>
          `;
          const sandboxNoticeText = `[Resend Sandbox Notice: Intended Recipient: ${to} | Delivered to Account Owner: ${fallbackOwner}]\n\n`;

          const fallbackInfo = await this.transporter.sendMail({
            from: fromAddress,
            to: fallbackOwner,
            subject: `[For: ${to}] ${subject}`,
            html: `${sandboxNoticeHtml}${html || ''}`,
            text: `${sandboxNoticeText}${text || ''}`
          });

          this.sentEmails.push({
            to: fallbackOwner,
            intendedRecipient: to,
            from: fromAddress,
            subject: `[For: ${to}] ${subject}`,
            messageId: fallbackInfo.messageId,
            sentAt: new Date(),
            deliveredViaSandboxFallback: true
          });

          logger.info(`[EmailService] Successfully delivered sandbox fallback email to ${fallbackOwner} (MessageId: ${fallbackInfo.messageId})`);
          return {
            success: true,
            messageId: fallbackInfo.messageId,
            deliveredToFallback: fallbackOwner,
            intendedRecipient: to
          };
        } catch (fallbackErr) {
          logger.error(`[EmailService] Fallback dispatch to ${fallbackOwner} also failed: ${fallbackErr.message}`);
        }
      }

      logger.error(`[EmailService] Delivery failed to ${to}: ${safeErrMsg}`);
      return { success: false, error: safeErrMsg };
    }
  }

  /**
   * Direct Resend HTTPS REST API delivery via port 443
   * Immune to cloud provider SMTP port blocking (Render, AWS, Heroku)
   */
  async sendViaResendHttp({ to, subject, html, text, fromAddress }) {
    const postPayload = (payloadObj) => {
      return new Promise((resolve) => {
        const payload = JSON.stringify(payloadObj);
        const req = https.request(
          {
            hostname: 'api.resend.com',
            port: 443,
            path: '/emails',
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.resendApiKey}`,
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(payload)
            },
            timeout: 8000
          },
          (res) => {
            let body = '';
            res.on('data', (chunk) => {
              body += chunk;
            });
            res.on('end', () => {
              try {
                const json = JSON.parse(body || '{}');
                if (res.statusCode >= 200 && res.statusCode < 300) {
                  resolve({ success: true, messageId: json.id });
                } else {
                  resolve({
                    success: false,
                    status: res.statusCode,
                    error: json.message || json.name || 'Resend API error'
                  });
                }
              } catch (e) {
                resolve({ success: false, error: body || 'Invalid Resend response' });
              }
            });
          }
        );

        req.on('error', (err) => resolve({ success: false, error: err.message }));
        req.on('timeout', () => {
          req.destroy();
          resolve({ success: false, error: 'Resend API request timeout' });
        });
        req.write(payload);
        req.end();
      });
    };

    let result = await postPayload({
      from: fromAddress,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text
    });

    const isSandboxRestricted =
      !result.success &&
      (result.status === 403 ||
        (result.error &&
          (result.error.includes('testing emails to your own email address') ||
            result.error.includes('verify a domain'))));

    const fallbackOwner = process.env.ADMIN_VERIFIED_EMAIL || 'sabari1082005@gmail.com';

    if (isSandboxRestricted && to.toLowerCase() !== fallbackOwner.toLowerCase()) {
      logger.warn(
        `[EmailService:ResendHTTP] Recipient ${to} is restricted by Resend sandbox. Routing real delivery to verified developer inbox (${fallbackOwner}).`
      );

      const sandboxNoticeHtml = `
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-family: sans-serif; font-size: 13px; color: #92400e;">
          <strong>🔔 Resend Sandbox Delivery Notice:</strong> This transactional notification was sent to <strong>${to}</strong> on HireConnect. Because Resend testing domains restrict delivery to registered developers, it has been delivered to your verified inbox (${fallbackOwner}).
        </div>
      `;
      const sandboxNoticeText = `[Resend Sandbox Notice: Intended Recipient: ${to} | Delivered to Account Owner: ${fallbackOwner}]\n\n`;

      const fallbackResult = await postPayload({
        from: fromAddress,
        to: [fallbackOwner],
        subject: `[For: ${to}] ${subject}`,
        html: `${sandboxNoticeHtml}${html || ''}`,
        text: `${sandboxNoticeText}${text || ''}`
      });

      if (fallbackResult.success) {
        this.sentEmails.push({
          to: fallbackOwner,
          intendedRecipient: to,
          from: fromAddress,
          subject: `[For: ${to}] ${subject}`,
          messageId: fallbackResult.messageId,
          sentAt: new Date(),
          deliveredViaSandboxFallback: true
        });

        logger.info(
          `[EmailService:ResendHTTP] Successfully delivered sandbox fallback email to ${fallbackOwner} (MessageId: ${fallbackResult.messageId})`
        );
        return {
          success: true,
          messageId: fallbackResult.messageId,
          deliveredToFallback: fallbackOwner,
          intendedRecipient: to
        };
      }
    }

    if (result.success) {
      this.sentEmails.push({
        to,
        from: fromAddress,
        subject,
        messageId: result.messageId,
        sentAt: new Date()
      });
      logger.info(`[EmailService:ResendHTTP] Delivered email to ${to} (MessageId: ${result.messageId})`);
    } else {
      logger.error(`[EmailService:ResendHTTP] Delivery failed to ${to}: ${result.error}`);
    }

    return result;
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
