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

module.exports = {
  getHealth,
  getLiveness,
  getReadiness
};
