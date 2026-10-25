/**
 * 404 Not Found handler for unmatched routes
 */

const ApiError = require('../utils/ApiError');

function notFound(req, res, next) {
  const message = `Route not found: ${req.method} ${req.originalUrl || req.url}`;
  next(ApiError.notFound(message, 'ROUTE_NOT_FOUND'));
}

module.exports = notFound;
