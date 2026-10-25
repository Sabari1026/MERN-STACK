/**
 * Request correlation and structured logging middleware
 */

const crypto = require('crypto');
const logger = require('../utils/logger');

function requestLogger(req, res, next) {
  // Generate or propagate request ID
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();
  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);

  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

    const logData = {
      requestId,
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      duration: `${durationMs}ms`,
      ip: req.ip || req.socket.remoteAddress
    };

    if (res.statusCode >= 500) {
      logger.error(`HTTP ${req.method} ${req.originalUrl || req.url} ${res.statusCode}`, logData);
    } else if (res.statusCode >= 400) {
      logger.warn(`HTTP ${req.method} ${req.originalUrl || req.url} ${res.statusCode}`, logData);
    } else {
      logger.info(`HTTP ${req.method} ${req.originalUrl || req.url} ${res.statusCode}`, logData);
    }
  });

  next();
}

module.exports = requestLogger;
