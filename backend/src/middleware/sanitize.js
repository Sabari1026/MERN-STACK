/**
 * NoSQL Injection Sanitizer Middleware for HireConnect
 * Recursively removes MongoDB operator keys (keys starting with '$' or containing '.')
 * from request body, query parameters, and route parameters to prevent query injection attacks.
 */

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else {
      obj[key] = sanitizeObject(obj[key]);
    }
  }

  return obj;
}

function mongoSanitize(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    sanitizeObject(req.params);
  }
  next();
}

module.exports = {
  mongoSanitize,
  sanitizeObject
};
