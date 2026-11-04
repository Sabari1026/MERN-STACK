/**
 * Centralized Email Service for HireConnect
 * Supports:
 * 1. Direct HTTPS REST API delivery via port 443 (e.g. Resend) — immune to cloud provider SMTP port blocking (Render, AWS, GCP free tiers).
 * 2. Genuine SMTP delivery via Nodemailer (e.g. Gmail SMTP, custom SMTP) for local and unblocked cloud environments.
 * 3. Strictly dynamic recipient routing — ZERO fallback redirection to developer inboxes.
 * 4. Reliable transactional outbox processing with exponential backoff.
 */

const https = require('https');
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const NotificationOutbox = require('../models/notificationOutbox.model');

// Basic RFC 5322 compliant email regex for runtime safety
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

class EmailService {
  constructor() {
    this.transporter = null;
    this.isResendHttp = false;
    this.resendApiKey = null;
    this.isConfigured = false;
    this.sentEmails = []; // In-memory audit trail for testing and inspection
    this.hasWarnedUnconfigured = false;

    this.initTransporter();
  }

  /**
   * Initialize email provider from environment variables
   */
  initTransporter() {
    // 1. Automated test mode (vitest / jest): mock adapter to prevent network calls
    if (process.env.NODE_ENV === 'test') {
      this.isConfigured = true;
      this.isResendHttp = false;
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

    const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
    const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '465', 10);
    const secure = process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === 'true'
      : port === 465;
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.EMAIL_PASS;

    // 2. Direct Resend HTTPS REST API (Port 443)
    // Used when an active Resend API key is detected or host is smtp.resend.com.
    // Operates over port 443 (HTTPS) to prevent cloud hosting SMTP port timeouts on Render/AWS.
    const resendApiKey =
      process.env.RESEND_API_KEY ||
      (pass && pass.startsWith('re_') ? pass : null) ||
      (user && user.startsWith('re_') ? user : null);

    if (resendApiKey) {
      this.isResendHttp = true;
      this.resendApiKey = resendApiKey;
      this.isConfigured = true;
      logger.info('[EmailService] Configured direct Resend HTTPS REST delivery (port 443 — immune to cloud SMTP blocks)');
      return;
    }

    // 3. Standard Nodemailer SMTP (e.g. Gmail SMTP, custom SMTP)
    if (host && user && pass) {
      try {
        this.isResendHttp = false;
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: { user, pass },
          connectionTimeout: 10000,
          greetingTimeout: 8000,
          socketTimeout: 15000,
          tls: {
            rejectUnauthorized: process.env.NODE_ENV === 'production'
          }
        });
        this.isConfigured = true;
        logger.info(`[EmailService] Configured Nodemailer SMTP via ${host}:${port} (secure: ${secure})`);
      } catch (err) {
        logger.error(`[EmailService] Failed to initialize SMTP transport: ${err.message}`);
        this.isConfigured = false;
      }
    } else {
      this.isConfigured = false;
      if (!this.hasWarnedUnconfigured) {
        logger.warn(
          '[EmailService] SMTP credentials not configured in environment. Outgoing transactional emails will be recorded to outbox safely.'
        );
        this.hasWarnedUnconfigured = true;
      }
    }
  }

  /**
   * Verify upstream connection and credentials
   * @returns {Promise<{ success: boolean, message: string, code?: string }>}
   */
  async verifyConnection() {
    if (process.env.NODE_ENV === 'test') {
      return {
        success: true,
        message: 'SMTP transport is using an active test/mock adapter.'
      };
    }

    if (!this.isConfigured) {
      return {
        success: false,
        message: 'Email service is not configured in the environment.'
      };
    }

    // A. Resend HTTPS REST Verification (Port 443)
    if (this.isResendHttp) {
      return new Promise((resolve) => {
        const req = https.request(
          {
            hostname: 'api.resend.com',
            port: 443,
            path: '/api-keys',
            method: 'GET',
            headers: {
              Authorization: `Bearer ${this.resendApiKey}`,
              'User-Agent': 'HireConnect-Backend/1.0'
            },
            timeout: 8000
          },
          (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
              logger.info('[EmailService] Resend HTTPS API credentials verified successfully (port 443).');
              resolve({
                success: true,
                message: 'Resend HTTPS API delivery verified successfully (port 443).'
              });
            } else if (res.statusCode === 401 || res.statusCode === 403) {
              const msg = 'Invalid or expired Resend API Key.';
              logger.warn(`[EmailService] Resend API verification failed: ${msg}`);
              resolve({ success: false, message: msg, code: 'INVALID_API_KEY' });
            } else {
              resolve({
                success: true,
                message: 'Resend HTTPS API endpoint accessible (port 443).'
              });
            }
          }
        );

        req.on('error', (err) => {
          logger.warn(`[EmailService] Resend HTTPS connection check error: ${err.message}`);
          resolve({ success: false, message: err.message, code: 'NETWORK_ERROR' });
        });

        req.on('timeout', () => {
          req.destroy();
          resolve({ success: false, message: 'Resend HTTPS request timeout', code: 'TIMEOUT' });
        });

        req.end();
      });
    }

    // B. Nodemailer SMTP Socket Verification
    if (!this.transporter) {
      return { success: false, message: 'SMTP transport is not initialized.' };
    }

    try {
      await this.transporter.verify();
      logger.info('[EmailService] SMTP server connection and credentials verified successfully.');
      return {
        success: true,
        message: 'SMTP server connection and credentials verified successfully.'
      };
    } catch (err) {
      const sanitized = logger.redactConnectionString(err.message || 'SMTP connection failed');
      const isTimeout = err.code === 'ETIMEDOUT' || sanitized.includes('timeout') || sanitized.includes('Connection timeout');

      if (isTimeout) {
        logger.warn(
          `[EmailService] SMTP port connection timed out: ${sanitized}. (Note: Cloud hosting like Render Free Tier blocks outbound raw TCP ports 25, 465, and 587. To send emails from Render free tier, use an HTTPS REST API on port 443 such as Resend, Brevo, or SendGrid).`
        );
      } else {
        logger.error(`[EmailService] SMTP verification failed: ${sanitized}`);
      }

      return {
        success: false,
        message: isTimeout
          ? 'SMTP connection timed out. Outbound SMTP ports (465/587) may be blocked by your hosting provider.'
          : sanitized,
        code: err.code || 'SMTP_VERIFICATION_FAILED'
      };
    }
  }

  /**
   * Get safe configuration status (never leaks passwords or API keys)
   */
  getStatus() {
    const host = process.env.SMTP_HOST || (this.isResendHttp ? 'api.resend.com (HTTPS Port 443)' : 'smtp.gmail.com');
    const port = this.isResendHttp ? 443 : parseInt(process.env.SMTP_PORT || '465', 10);
    const user = process.env.SMTP_USER || null;
    return {
      configured: this.isConfigured,
      mode: this.isResendHttp ? 'https-api' : 'smtp',
      host,
      port,
      secure: this.isResendHttp ? true : (process.env.SMTP_SECURE === 'true' || port === 465),
      fromAddress: process.env.EMAIL_FROM || (user ? `HireConnect <${user}>` : 'HireConnect <onboarding@resend.dev>')
    };
  }

  /**
   * Sends a transactional email strictly to the dynamic intended recipient
   * Never redirects to a developer or fallback inbox
   * @param {object} mailOptions { to, subject, html, text, from }
   * @returns {Promise<{ success: boolean, messageId?: string, error?: string, code?: string }>}
   */
  async sendEmail({ to, subject, html, text, from }) {
    const fromAddress = from || process.env.EMAIL_FROM || 'HireConnect <onboarding@resend.dev>';

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

    // 3. Automated test mode: record in-memory and return immediately
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

    // 4. Safe fallback when email provider is unconfigured in development
    if (!this.isConfigured) {
      logger.info(`[EmailService:Unconfigured] Outgoing email to ${cleanTo}: "${subject}" (Simulated - provider unconfigured)`);
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
        error: 'Email provider unconfigured. Logged to outbox safely.',
        unconfigured: true
      };
    }

    // 5. Option A: Direct Resend HTTPS REST API Delivery (Port 443)
    if (this.isResendHttp) {
      return this.sendViaResendHttp({ to: cleanTo, subject, html, text, fromAddress });
    }

    // 6. Option B: Genuine Nodemailer SMTP Delivery (Port 465 / 587)
    if (!this.transporter) {
      return { success: false, error: 'SMTP transport not initialized.', code: 'SMTP_UNAVAILABLE' };
    }

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

      logger.info(`[EmailService:SMTP] Delivered email to ${cleanTo} (MessageId: ${info.messageId})`);
      return {
        success: true,
        messageId: info.messageId,
        accepted: info.accepted || [cleanTo],
        rejected: info.rejected || []
      };
    } catch (err) {
      const safeErrMsg = logger.redactConnectionString(err.message || 'SMTP transmission error');
      logger.error(`[EmailService:SMTP] Delivery failed to ${cleanTo}: ${safeErrMsg}`);

      // STRICT REQUIREMENT: Zero fallback redirection. Report failure cleanly to caller.
      return {
        success: false,
        error: safeErrMsg,
        code: err.code || 'SMTP_ERROR'
      };
    }
  }

  /**
   * Direct Resend HTTPS REST API delivery via port 443
   * Immune to cloud provider SMTP port blocking (Render, AWS, Heroku)
   * Strictly delivers to `to` — NEVER redirects to developer fallback
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
            timeout: 10000
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
                    error: json.message || json.name || `Resend HTTP ${res.statusCode}`
                  });
                }
              } catch (e) {
                resolve({ success: false, error: body || 'Invalid Resend API response' });
              }
            });
          }
        );

        req.on('error', (err) => resolve({ success: false, error: err.message }));
        req.on('timeout', () => {
          req.destroy();
          resolve({ success: false, error: 'Resend HTTPS API request timeout' });
        });
        req.write(payload);
        req.end();
      });
    };

    const result = await postPayload({
      from: fromAddress,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text
    });

    if (result.success) {
      this.sentEmails.push({
        to,
        from: fromAddress,
        subject,
        messageId: result.messageId,
        sentAt: new Date()
      });
      logger.info(`[EmailService:ResendHTTP] Delivered email to ${to} (MessageId: ${result.messageId})`);
      return { success: true, messageId: result.messageId };
    }

    // STRICT REQUIREMENT: Report provider error cleanly. Never redirect to personal inbox.
    logger.error(`[EmailService:ResendHTTP] Delivery failed to ${to}: ${result.error}`);
    return {
      success: false,
      error: result.error,
      statusCode: result.status,
      code: result.status === 403 ? 'PROVIDER_SANDBOX_RESTRICTION' : 'PROVIDER_ERROR'
    };
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
