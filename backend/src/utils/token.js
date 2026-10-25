/**
 * Token and Cookie Management Utilities for HireConnect
 * Handles JWT creation, refresh token rotation, cryptographic hashing, and secure cookies.
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

/**
 * Hash raw token using SHA-256
 * @param {string} rawToken
 * @returns {string} hex-encoded hash
 */
function hashToken(rawToken) {
  if (!rawToken || typeof rawToken !== 'string') return '';
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/**
 * Generate a cryptographically random token string
 * @param {number} [bytes=32]
 * @returns {string} hex string
 */
function generateRandomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Generate signed JWT access token
 * @param {object} user - User document or safe object
 * @returns {string} JWT string
 */
function generateAccessToken(user) {
  const userId = user._id ? user._id.toString() : user.id;
  const payload = {
    id: userId,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
}

/**
 * Verify JWT access token
 * @param {string} token
 * @returns {object} decoded payload
 */
function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

/**
 * Generate opaque refresh token and its hash
 * @param {boolean} [rememberMe=false]
 * @returns {{ rawToken: string, tokenHash: string, expiresAt: Date }}
 */
function generateRefreshToken(rememberMe = false) {
  const rawToken = generateRandomToken(40);
  const tokenHash = hashToken(rawToken);

  // Expiration calculation: 30 days if rememberMe, otherwise 7 days
  const days = rememberMe ? 30 : 7;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  return {
    rawToken,
    tokenHash,
    expiresAt
  };
}

/**
 * Cookie configuration options
 * Note: Modern browsers require secure: true whenever sameSite is 'none'
 */
const isSecureCookie = env.NODE_ENV === 'production' || env.COOKIE_SAME_SITE === 'none';

const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isSecureCookie,
  sameSite: env.COOKIE_SAME_SITE || 'lax',
  path: '/'
};

/**
 * Set authentication cookies on Express response
 * @param {import('express').Response} res
 * @param {{ accessToken?: string, refreshToken?: string, rememberMe?: boolean }} options
 */
function setAuthCookies(res, { accessToken, refreshToken, rememberMe = false }) {
  if (accessToken) {
    res.cookie('hireconnect_access_token', accessToken, {
      ...BASE_COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
  }

  if (refreshToken) {
    const days = rememberMe ? 30 : 7;
    res.cookie('hireconnect_refresh_token', refreshToken, {
      ...BASE_COOKIE_OPTIONS,
      maxAge: days * 24 * 60 * 60 * 1000
    });
  }
}

/**
 * Clear authentication cookies on Express response
 * @param {import('express').Response} res
 */
function clearAuthCookies(res) {
  res.clearCookie('hireconnect_access_token', BASE_COOKIE_OPTIONS);
  res.clearCookie('hireconnect_refresh_token', BASE_COOKIE_OPTIONS);
}

module.exports = {
  hashToken,
  generateRandomToken,
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  BASE_COOKIE_OPTIONS
};
