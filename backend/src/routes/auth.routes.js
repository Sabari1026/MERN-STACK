/**
 * Authentication Routes for HireConnect
 * Endpoints for registration, login, session validation, logout, and token refresh.
 */

const express = require('express');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const authController = require('../controllers/auth.controller');
const { authenticate, requireRole } = require('../middleware/auth');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  deleteAccountSchema,
  googleAuthSchema,
  validateBody
} = require('../validators/auth.validator');
const { env } = require('../config/env');

const router = express.Router();

// Public authentication endpoints
router.post(
  '/register',
  authLimiter,
  validateBody(registerSchema),
  authController.register
);

router.post(
  '/login',
  authLimiter,
  validateBody(loginSchema),
  authController.login
);

router.post(
  '/forgot-password',
  passwordResetLimiter,
  validateBody(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  passwordResetLimiter,
  validateBody(resetPasswordSchema),
  authController.resetPassword
);

router.post(
  '/google',
  authLimiter,
  validateBody(googleAuthSchema),
  authController.googleAuth
);

router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

// Informational endpoints
router.get('/google/config', (req, res) => {
  res.json({
    success: true,
    provider: 'google',
    clientId: env.GOOGLE_CLIENT_ID || null,
    configured: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
    scopes: ['openid', 'email', 'profile'],
    instructions: 'Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env to activate Google OAuth.'
  });
});

router.get('/demo-credentials', (req, res) => {
  res.json({
    success: true,
    candidate: { email: 'candidate@hireconnect.io', role: 'candidate' },
    recruiter: { email: 'recruiter@hireconnect.io', role: 'recruiter' },
    note: 'Initial evaluation credentials use secure bcrypt hashing.'
  });
});

// Authenticated session endpoint
router.get('/me', authenticate, authController.getMe);

// Authenticated account settings endpoints
router.post(
  '/change-password',
  authenticate,
  validateBody(changePasswordSchema),
  authController.changePassword
);

router.get('/sessions', authenticate, authController.getSessions);

router.post('/sessions/revoke-others', authenticate, authController.revokeOtherSessions);

router.post(
  '/delete-account',
  authenticate,
  validateBody(deleteAccountSchema),
  authController.deleteAccount
);

// Role verification test endpoints for permission checks
router.get('/test/candidate', authenticate, requireRole('candidate'), (req, res) => {
  res.json({ success: true, message: 'Candidate authorization verified', role: req.user.role });
});

router.get('/test/recruiter', authenticate, requireRole('recruiter'), (req, res) => {
  res.json({ success: true, message: 'Recruiter authorization verified', role: req.user.role });
});

router.get('/test/admin', authenticate, requireRole('admin'), (req, res) => {
  res.json({ success: true, message: 'Admin authorization verified', role: req.user.role });
});

module.exports = router;
