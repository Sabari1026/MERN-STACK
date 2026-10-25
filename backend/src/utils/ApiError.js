/**
 * Standardized API Error class for HireConnect backend
 */

class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - User-safe error description
   * @param {string} [code] - Stable uppercase machine code (e.g. 'NOT_FOUND')
   * @param {Array|object} [errors] - Optional validation details
   * @param {boolean} [isOperational=true] - Whether this is an expected application error
   */
  constructor(statusCode, message, code = 'INTERNAL_ERROR', errors = null, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', code = 'BAD_REQUEST', errors = null) {
    return new ApiError(400, message, code, errors);
  }

  static unauthorized(message = 'Unauthorized access', code = 'UNAUTHORIZED') {
    return new ApiError(401, message, code);
  }

  static forbidden(message = 'Forbidden action', code = 'FORBIDDEN') {
    return new ApiError(403, message, code);
  }

  static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
    return new ApiError(404, message, code);
  }

  static conflict(message = 'Resource conflict', code = 'CONFLICT') {
    return new ApiError(409, message, code);
  }

  static payloadTooLarge(message = 'Payload too large', code = 'PAYLOAD_TOO_LARGE') {
    return new ApiError(413, message, code);
  }

  static unsupportedMediaType(message = 'Unsupported media type', code = 'UNSUPPORTED_MEDIA_TYPE') {
    return new ApiError(415, message, code);
  }

  static unprocessable(message = 'Validation failed', errors = null, code = 'VALIDATION_ERROR') {
    return new ApiError(422, message, code, errors);
  }

  static tooManyRequests(message = 'Too many requests, please try again later', code = 'TOO_MANY_REQUESTS') {
    return new ApiError(429, message, code);
  }

  static internal(message = 'An unexpected internal error occurred', code = 'INTERNAL_SERVER_ERROR') {
    return new ApiError(500, message, code, null, false);
  }

  static serviceUnavailable(message = 'Service temporarily unavailable', code = 'SERVICE_UNAVAILABLE') {
    return new ApiError(503, message, code);
  }
}

module.exports = ApiError;
