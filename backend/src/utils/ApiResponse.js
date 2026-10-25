/**
 * Standardized API Success Response helper for HireConnect
 */

class ApiResponse {
  /**
   * Send a formatted JSON response
   * @param {import('express').Response} res
   * @param {object} options
   * @param {number} [options.statusCode=200]
   * @param {string} [options.message='Request completed successfully']
   * @param {*} [options.data=null]
   * @param {object} [options.meta=null]
   */
  static success(res, { statusCode = 200, message = 'Request completed successfully', data = null, meta = null } = {}) {
    const payload = {
      success: true,
      message,
      ...(data !== null && data !== undefined ? { data } : {}),
      ...(meta ? { meta } : {}),
      timestamp: new Date().toISOString()
    };

    return res.status(statusCode).json(payload);
  }

  static created(res, { message = 'Resource created successfully', data = null, meta = null } = {}) {
    return ApiResponse.success(res, { statusCode: 201, message, data, meta });
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;
