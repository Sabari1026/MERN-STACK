/**
 * Centralized error handling middleware
 * Guarantees standard JSON error format, logs errors safely, and redacts internal details in production.
 */

const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  let error = err;

  // Handle SyntaxError from malformed JSON body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = ApiError.badRequest('Malformed JSON in request body', 'MALFORMED_JSON');
  }

  // Handle Zod validation errors
  else if (err.name === 'ZodError') {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    error = ApiError.unprocessable('Validation failed', formattedErrors, 'VALIDATION_ERROR');
  }

  // Handle Mongoose CastError (invalid ObjectId, etc.)
  else if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid resource identifier for field: ${err.path}`, 'INVALID_IDENTIFIER');
  }

  // Handle Mongoose ValidationError
  else if (err.name === 'ValidationError') {
    const formattedErrors = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message
    }));
    error = ApiError.unprocessable('Database validation failed', formattedErrors, 'VALIDATION_ERROR');
  }

  // Handle MongoDB duplicate key error (code 11000)
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = ApiError.conflict(`Duplicate value entered for ${field}`, 'DUPLICATE_VALUE');
  }

  // Handle CORS blocked origin
  else if (err.message && err.message.includes('CORS policy')) {
    error = ApiError.forbidden(err.message, 'CORS_NOT_ALLOWED');
  }

  // Fallback for general unhandled errors
  else if (!(error instanceof ApiError)) {
    const isProduction = process.env.NODE_ENV === 'production';
    const message = isProduction ? 'An unexpected internal server error occurred' : (err.message || 'Internal Server Error');
    error = new ApiError(500, message, 'INTERNAL_SERVER_ERROR', null, false);
  }

  const statusCode = error.statusCode || 500;
  const requestId = req.id || req.headers['x-request-id'] || 'unknown';

  // Structured logging of the error
  const logDetails = {
    requestId,
    code: error.code,
    statusCode,
    url: req.originalUrl || req.url,
    method: req.method,
    message: error.message
  };

  if (statusCode >= 500) {
    logger.error(`Internal Exception: ${error.message}`, {
      ...logDetails,
      stack: err.stack
    });
  } else {
    logger.warn(`Handled Client Error: ${error.message}`, logDetails);
  }

  const responseBody = {
    success: false,
    message: error.message,
    code: error.code || 'ERROR',
    requestId,
    timestamp: new Date().toISOString()
  };

  if (error.errors) {
    responseBody.errors = error.errors;
  }

  // Expose stack trace only in non-production environments for diagnostic purposes
  if (process.env.NODE_ENV !== 'production' && err.stack && !error.isOperational) {
    responseBody.stack = err.stack;
  }

  res.status(statusCode).json(responseBody);
}

module.exports = errorHandler;
