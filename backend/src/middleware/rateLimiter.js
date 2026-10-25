/**
 * Centralized Rate Limiting Middleware for HireConnect
 * Protects public and authenticated endpoints against credential stuffing, brute force, and scraping.
 * Automatically bypassed in test mode to support automated testing.
 */

const rateLimit = require('express-rate-limit');
const { env } = require('../config/env');

const isTestEnv = env.NODE_ENV === 'test';

/**
 * Standard API rate limiter for general /api requests
 * Allows up to 600 requests per 15 minutes per IP
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTestEnv ? 10000 : 600,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTestEnv,
  message: {
    success: false,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests from this IP. Please slow down and try again later.'
  }
});

/**
 * Authentication rate limiter for login, register, and OAuth callbacks
 * Allows up to 30 attempts per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTestEnv ? 10000 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTestEnv,
  message: {
    success: false,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

/**
 * Password recovery rate limiter for forgot-password and reset-password
 * Allows up to 10 requests per 1 hour per IP
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isTestEnv ? 10000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTestEnv,
  message: {
    success: false,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many password reset requests. Please try again after 1 hour.'
  }
});

/**
 * Upload rate limiter for avatar and resume uploads
 * Allows up to 60 uploads per 15 minutes per IP
 */
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTestEnv ? 10000 : 60,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTestEnv,
  message: {
    success: false,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many upload requests. Please try again later.'
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  uploadLimiter
};
