/**
 * Authentication and Authorization Middleware for HireConnect
 * Validates JWT session tokens, verifies account standing, and enforces role-based access control.
 */

const User = require('../models/user.model');
const { verifyAccessToken } = require('../utils/token');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Extract token from HTTP-only cookie or Authorization header
 * @param {import('express').Request} req
 * @returns {string|null}
 */
function extractToken(req) {
  // Check signed or unsigned cookies
  if (req.cookies && req.cookies.hireconnect_access_token) {
    return req.cookies.hireconnect_access_token;
  }
  if (req.signedCookies && req.signedCookies.hireconnect_access_token) {
    return req.signedCookies.hireconnect_access_token;
  }

  // Check Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && typeof authHeader === 'string') {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      return parts[1];
    }
  }

  return null;
}

/**
 * Require valid authenticated user session
 */
const authenticate = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    throw ApiError.unauthorized('Authentication required. Please sign in to continue.');
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Your session has expired. Please sign in again.');
    }
    throw ApiError.unauthorized('Invalid authentication token. Please sign in again.');
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw ApiError.unauthorized('User account no longer exists.');
  }

  if (user.accountStatus !== 'active') {
    throw ApiError.forbidden(`Your account is currently ${user.accountStatus.replace('_', ' ')}.`);
  }

  // Verify token was not issued prior to a password change
  if (decoded.iat && user.isPasswordChangedAfter(decoded.iat)) {
    throw ApiError.unauthorized('Password was changed recently. Please sign in again.');
  }

  req.user = user;
  next();
});

/**
 * Require specific role(s) for the authenticated user
 * @param {...string} allowedRoles
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access denied. You do not have permission to view or manage this resource.`
        )
      );
    }

    next();
  };
}

/**
 * Optional authentication: attaches user if token is present and valid, but does not block if missing
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    if (user && user.accountStatus === 'active') {
      req.user = user;
    } else {
      req.user = null;
    }
  } catch {
    req.user = null;
  }

  next();
});

module.exports = {
  authenticate,
  requireRole,
  optionalAuth
};
