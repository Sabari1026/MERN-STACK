/**
 * Health, Liveness, and Readiness probes controller
 */

const database = require('../config/database');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Basic API health probe
 * GET /api/health
 */
const getHealth = (req, res) => {
  return ApiResponse.success(res, {
    message: 'HireConnect API is running',
    data: {
      status: 'healthy',
      environment: process.env.NODE_ENV || 'development'
    }
  });
};

/**
 * Liveness probe for orchestration and process monitoring
 * GET /api/health/live
 */
const getLiveness = (req, res) => {
  return ApiResponse.success(res, {
    message: 'HireConnect API is alive',
    data: {
      status: 'alive',
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsage: {
        rssBytes: process.memoryUsage().rss,
        heapUsedBytes: process.memoryUsage().heapUsed
      }
    }
  });
};

/**
 * Readiness probe inspecting MongoDB connection state
 * GET /api/health/ready
 */
const getReadiness = (req, res) => {
  const dbState = database.getConnectionState();

  if (dbState.isConnected) {
    return ApiResponse.success(res, {
      statusCode: 200,
      message: 'HireConnect API is ready to accept requests',
      data: {
        status: 'ready',
        database: {
          status: dbState.status,
          readyState: dbState.readyState
        }
      }
    });
  }

  // Database is not connected: return 503 Service Unavailable
  return res.status(503).json({
    success: false,
    message: `HireConnect API is not ready: database is ${dbState.status}`,
    code: 'DATABASE_NOT_READY',
    requestId: req.id || 'unknown',
    timestamp: new Date().toISOString(),
    data: {
      status: 'not_ready',
      database: {
        status: dbState.status,
        readyState: dbState.readyState
      }
    }
  });
};

/**
 * Email Service Health & Gmail API OAuth 2.0 Connection Probe
 * GET /api/health/email
 */
const getEmailHealth = async (req, res) => {
  const emailService = require('../services/email.service');
  const safeStatus = emailService.getStatus();
  const verification = await emailService.verifyConnection();

  return ApiResponse.success(res, {
    statusCode: verification.success ? 200 : 503,
    message: verification.message,
    data: {
      status: verification.success ? 'connected' : 'disconnected',
      provider: safeStatus.provider,
      sender: safeStatus.sender,
      adminRecipient: safeStatus.adminRecipient,
      providerDetails: safeStatus,
      verificationResult: verification
    }
  });
};

/**
 * Send controlled test email probe
 * POST /api/health/email/test
 */
const sendTestEmail = async (req, res) => {
  const emailService = require('../services/email.service');
  const recipient = req.body?.to || process.env.ADMIN_EMAIL || process.env.GMAIL_USER || 'sabari1082005@gmail.com';

  const result = await emailService.sendTestEmail(recipient);
  return res.status(result.success ? 200 : 500).json({
    success: result.success,
    message: result.success
      ? `Test email delivered successfully to ${recipient}`
      : `Failed to deliver test email: ${result.error}`,
    data: result
  });
};

module.exports = {
  getHealth,
  getLiveness,
  getReadiness,
  getEmailHealth,
  sendTestEmail
};
