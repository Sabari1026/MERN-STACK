/**
 * Authentication Controller for HireConnect
 * Implements registration, login, session inspection, logout, token rotation,
 * password recovery, and role separation.
 */

const User = require('../models/user.model');
const {
  hashToken,
  generateRandomToken,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies
} = require('../utils/token');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');
const { env } = require('../config/env');

/**
 * Register a new Candidate or Recruiter account
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'candidate', rememberMe = false } = req.body;

  // Normalized role check: strictly block admin escalation
  if (role === 'admin') {
    throw ApiError.forbidden('Public registration for administrator role is strictly forbidden.');
  }

  // Ensure unique email
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw ApiError.conflict('An account with this email address already exists. Please sign in instead.');
  }

  // Hash password
  const passwordHash = await User.hashPassword(password);

  // Generate initial refresh session
  const { rawToken, tokenHash, expiresAt } = generateRefreshToken(rememberMe);

  // Create user
  const user = new User({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    accountStatus: 'active',
    emailVerifiedAt: new Date(), // Active immediately
    lastLoginAt: new Date(),
    refreshTokens: [
      {
        tokenHash,
        expiresAt,
        userAgent: req.headers['user-agent'] || '',
        ip: req.ip || ''
      }
    ]
  });

  await user.save();

  // Initialize and persist profile in MongoDB Atlas
  let profile = null;
  let company = null;
  try {
    if (role === 'candidate') {
      const candidateService = require('../services/candidate.service');
      const candProfile = await candidateService.getOrCreateProfile(user._id, user);
      profile = candProfile.toJSON ? candProfile.toJSON() : candProfile;
    } else if (role === 'recruiter') {
      const recruiterService = require('../services/recruiter.service');
      const recProfile = await recruiterService.getOrCreateProfile(user._id, user);

      const compName = (req.body.companyName || req.body.company || '').trim();
      if (compName) {
        const Company = require('../models/company.model');
        const CompanyMembership = require('../models/companyMembership.model');

        let compDoc = await Company.findOne({
          $or: [
            { normalizedName: compName.toLowerCase() },
            { name: new RegExp(`^${compName}$`, 'i') }
          ]
        });

        if (!compDoc) {
          const slug = Company.generateUniqueSlug
            ? await Company.generateUniqueSlug(compName)
            : compName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
          compDoc = await Company.create({
            name: compName,
            slug,
            website: req.body.website || '',
            createdBy: user._id,
            verificationStatus: 'verified'
          });
        }

        await CompanyMembership.create({
          company: compDoc._id,
          user: user._id,
          membershipRole: 'owner',
          status: 'active'
        });

        recProfile.company = compDoc._id;
        recProfile.companyName = compDoc.name;
        if (req.body.title || req.body.jobTitle) {
          recProfile.jobTitle = (req.body.title || req.body.jobTitle).trim();
        }
        await recProfile.save();
        company = compDoc.toJSON ? compDoc.toJSON() : compDoc;
      }
      profile = recProfile.toJSON ? recProfile.toJSON() : recProfile;
    }
  } catch (initErr) {
    logger.warn('[Auth] Error auto-initializing profile on register: ' + initErr.message);
  }

  // Generate access token & set cookies
  const accessToken = generateAccessToken(user);
  setAuthCookies(res, { accessToken, refreshToken: rawToken, rememberMe });

  const safeUser = user.toSafeObject();

  logger.info(`[Auth] Registered new ${role} account: ${user.email} (ID: ${user._id})`);

  return res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token: accessToken,
    refreshToken: rawToken,
    user: safeUser,
    profile,
    company,
    data: {
      user: safeUser,
      profile,
      company,
      token: accessToken,
      refreshToken: rawToken
    }
  });
});

/**
 * Authenticate existing user with email and password
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password, role: requestedRole, rememberMe = false } = req.body;

  // Find user by normalized email including hidden passwordHash and refreshTokens
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+passwordHash +refreshTokens'
  );

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  // Check account standing
  if (user.accountStatus !== 'active') {
    throw ApiError.forbidden(
      `Your account is currently ${user.accountStatus.replace('_', ' ')}. Please contact support.`
    );
  }

  // Role validation: ensure user doesn't log into candidate tab with recruiter account or vice versa
  if (requestedRole) {
    const normalizedReqRole = requestedRole.toLowerCase() === 'employee' ? 'candidate' : requestedRole.toLowerCase();
    if (user.role !== normalizedReqRole) {
      if (user.role === 'recruiter') {
        throw ApiError.forbidden(
          'This account is registered as a Recruiter / Employer. Please select the Recruiter tab to sign in.'
        );
      } else if (user.role === 'candidate') {
        throw ApiError.forbidden(
          'This account is registered as a Job Seeker / Candidate. Please select the Job Seeker tab to sign in.'
        );
      } else {
        throw ApiError.forbidden('Account role mismatch. Please select the appropriate sign-in category.');
      }
    }
  }

  // Refresh token session handling
  const { rawToken, tokenHash, expiresAt } = generateRefreshToken(rememberMe);

  // Prune expired sessions, retain last 4, add new session
  const now = new Date();
  const validTokens = (user.refreshTokens || []).filter((t) => t.expiresAt > now).slice(-4);
  validTokens.push({
    tokenHash,
    expiresAt,
    userAgent: req.headers['user-agent'] || '',
    ip: req.ip || ''
  });

  user.refreshTokens = validTokens;
  user.lastLoginAt = now;
  await user.save();

  // Generate access token & set cookies
  const accessToken = generateAccessToken(user);
  setAuthCookies(res, { accessToken, refreshToken: rawToken, rememberMe });

  const safeUser = user.toSafeObject();

  // Retrieve user's stored profile and company from MongoDB Atlas
  let profile = null;
  let company = null;
  try {
    const userId = safeUser.id || (safeUser._id ? safeUser._id.toString() : '');
    if (user.role === 'candidate') {
      const candidateService = require('../services/candidate.service');
      const candProfile = await candidateService.getOrCreateProfile(userId, user);
      profile = candProfile.toJSON ? candProfile.toJSON() : candProfile;
    } else if (user.role === 'recruiter') {
      const recruiterService = require('../services/recruiter.service');
      const recProfile = await recruiterService.getOrCreateProfile(userId, user);
      profile = recProfile.toJSON ? recProfile.toJSON() : recProfile;

      const CompanyMembership = require('../models/companyMembership.model');
      const Company = require('../models/company.model');

      const membership = await CompanyMembership.findOne({
        user: userId,
        status: 'active'
      }).populate('company');

      if (membership && membership.company) {
        company = membership.company.toJSON ? membership.company.toJSON() : membership.company;
      } else if (recProfile.company) {
        const compDoc = await Company.findById(recProfile.company);
        if (compDoc) company = compDoc.toJSON ? compDoc.toJSON() : compDoc;
      } else {
        const createdComp = await Company.findOne({ createdBy: userId });
        if (createdComp) company = createdComp.toJSON ? createdComp.toJSON() : createdComp;
      }
    }
  } catch (profErr) {
    logger.warn('[Auth] Error fetching profile during login: ' + profErr.message);
  }

  logger.info(`[Auth] User signed in: ${user.email} (${user.role})`);

  return res.status(200).json({
    success: true,
    message: 'Signed in successfully',
    token: accessToken,
    refreshToken: rawToken,
    user: safeUser,
    profile,
    company,
    data: {
      user: safeUser,
      profile,
      company,
      token: accessToken,
      refreshToken: rawToken
    }
  });
});

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
const getMe = asyncHandler(async (req, res) => {
  const safeUser = req.user.toSafeObject();

  let profile = null;
  let company = null;
  try {
    const userId = safeUser.id || (safeUser._id ? safeUser._id.toString() : '');
    if (safeUser.role === 'candidate') {
      const candidateService = require('../services/candidate.service');
      const candProfile = await candidateService.getOrCreateProfile(userId, req.user);
      profile = candProfile.toJSON ? candProfile.toJSON() : candProfile;
    } else if (safeUser.role === 'recruiter') {
      const recruiterService = require('../services/recruiter.service');
      const recProfile = await recruiterService.getOrCreateProfile(userId, req.user);
      profile = recProfile.toJSON ? recProfile.toJSON() : recProfile;

      const CompanyMembership = require('../models/companyMembership.model');
      const Company = require('../models/company.model');

      const membership = await CompanyMembership.findOne({
        user: userId,
        status: 'active'
      }).populate('company');

      if (membership && membership.company) {
        company = membership.company.toJSON ? membership.company.toJSON() : membership.company;
      } else if (recProfile.company) {
        const compDoc = await Company.findById(recProfile.company);
        if (compDoc) company = compDoc.toJSON ? compDoc.toJSON() : compDoc;
      } else {
        const createdComp = await Company.findOne({ createdBy: userId });
        if (createdComp) company = createdComp.toJSON ? createdComp.toJSON() : createdComp;
      }
    }
  } catch (e) {
    // Fall back if profile service lookup fails
  }

  return res.status(200).json({
    success: true,
    user: safeUser,
    profile,
    company,
    data: {
      user: safeUser,
      profile,
      company
    }
  });
});

/**
 * Sign out current session
 * POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  const rawRefreshToken =
    (req.cookies && req.cookies.hireconnect_refresh_token) ||
    req.body.refreshToken;

  if (rawRefreshToken) {
    const tokenHash = hashToken(rawRefreshToken);
    // Revoke token session in MongoDB
    await User.updateOne(
      { 'refreshTokens.tokenHash': tokenHash },
      { $pull: { refreshTokens: { tokenHash } } }
    );
  }

  // Clear HTTP-only auth cookies
  clearAuthCookies(res);

  return res.status(200).json({
    success: true,
    message: 'Signed out successfully'
  });
});

/**
 * Refresh access token using active refresh token session
 * POST /api/auth/refresh
 */
const refreshToken = asyncHandler(async (req, res) => {
  const rawRefreshToken =
    (req.cookies && req.cookies.hireconnect_refresh_token) ||
    req.body.refreshToken;

  if (!rawRefreshToken) {
    throw ApiError.unauthorized('Refresh token is required to renew session.');
  }

  const incomingHash = hashToken(rawRefreshToken);

  const user = await User.findOne({
    'refreshTokens.tokenHash': incomingHash
  }).select('+refreshTokens');

  if (!user) {
    clearAuthCookies(res);
    throw ApiError.unauthorized('Invalid or expired refresh token. Please sign in again.');
  }

  const tokenRecord = user.refreshTokens.find((t) => t.tokenHash === incomingHash);
  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    // Remove expired token
    user.refreshTokens = user.refreshTokens.filter((t) => t.tokenHash !== incomingHash);
    await user.save();
    clearAuthCookies(res);
    throw ApiError.unauthorized('Session has expired. Please sign in again.');
  }

  // Refresh token rotation: replace used token with new token
  const nextRefresh = generateRefreshToken();
  user.refreshTokens = user.refreshTokens.filter((t) => t.tokenHash !== incomingHash);
  user.refreshTokens.push({
    tokenHash: nextRefresh.tokenHash,
    expiresAt: nextRefresh.expiresAt,
    userAgent: req.headers['user-agent'] || '',
    ip: req.ip || ''
  });

  await user.save();

  // Generate new access token
  const newAccessToken = generateAccessToken(user);
  setAuthCookies(res, {
    accessToken: newAccessToken,
    refreshToken: nextRefresh.rawToken
  });

  const safeUser = user.toSafeObject();

  return res.status(200).json({
    success: true,
    message: 'Session refreshed successfully',
    token: newAccessToken,
    refreshToken: nextRefresh.rawToken,
    user: safeUser,
    data: {
      token: newAccessToken,
      refreshToken: nextRefresh.rawToken,
      user: safeUser
    }
  });
});

/**
 * Request password reset instructions
 * POST /api/auth/forgot-password
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    const rawResetToken = generateRandomToken(32);
    user.passwordResetTokenHash = hashToken(rawResetToken);
    user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity
    await user.save();

    if (env.NODE_ENV !== 'production') {
      logger.info(`[Auth] Password reset token generated for ${user.email}: ${rawResetToken}`);
      res.setHeader('X-Dev-Reset-Token', rawResetToken);
    } else {
      logger.info(`[Auth] Password reset token generated for ${user.email}`);
    }

    try {
      const emailService = require('../services/email.service');
      const emailTemplates = require('../templates/emails/emailTemplates');
      const baseUrl = (env.PASSWORD_RESET_URL || 'http://localhost:3000/reset-password').replace(/\/+$/, '');
      const resetUrl = `${baseUrl}?token=${encodeURIComponent(rawResetToken)}&email=${encodeURIComponent(user.email)}`;
      const template = emailTemplates.passwordReset({
        recipientName: user.name,
        resetUrl,
        expiresInMinutes: 60
      });

      await emailService.sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text
      });
    } catch (emailErr) {
      logger.warn(`[Auth] Error dispatching password reset email to ${user.email}: ${emailErr.message}`);
    }
  }

  // Uniform response to prevent email enumeration
  return res.status(200).json({
    success: true,
    message:
      'If an account exists with this email address, password reset instructions have been sent.'
  });
});

/**
 * Reset password with valid reset token
 * POST /api/auth/reset-password
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    passwordResetTokenHash: hashedToken,
    passwordResetExpiresAt: { $gt: new Date() }
  }).select('+passwordResetTokenHash +passwordResetExpiresAt +refreshTokens');

  if (!user) {
    throw ApiError.badRequest('Password reset token is invalid or has expired.');
  }

  // Update password & invalidate all existing sessions
  user.passwordHash = await User.hashPassword(password);
  user.passwordChangedAt = new Date();
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpiresAt = undefined;
  user.refreshTokens = []; // Revoke active sessions across all devices
  await user.save();

  // Clear any existing cookies
  clearAuthCookies(res);

  logger.info(`[Auth] Password reset successful for user ${user.email}`);

  return res.status(200).json({
    success: true,
    message: 'Password has been reset successfully. Please sign in with your new password.'
  });
});

/**
 * Google OAuth endpoint / graceful unconfigured boundary
 * POST /api/auth/google
 */
const googleAuth = asyncHandler(async (req, res) => {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return res.status(501).json({
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message:
          'Google OAuth is not configured on this server. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env to activate Google Sign-In.'
      }
    });
  }

  // If credentials are configured in later production environment, integrate token verification here
  return res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Google OAuth verification provider is awaiting external credential activation.'
    }
  });
});

/**
 * Change account password for authenticated user
 * POST /api/auth/change-password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id || req.user.id).select(
    '+passwordHash +refreshTokens'
  );

  if (!user) {
    throw ApiError.unauthorized('User not found.');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw ApiError.badRequest('Current password is incorrect.');
  }

  user.passwordHash = await User.hashPassword(newPassword);
  user.passwordChangedAt = new Date();
  await user.save();

  logger.info(`[Auth] Password updated for user ${user.email}`);

  return res.status(200).json({
    success: true,
    message: 'Password updated successfully.'
  });
});

/**
 * List active sessions for authenticated user
 * GET /api/auth/sessions
 */
const getSessions = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id || req.user.id).select('+refreshTokens');

  const sessions = (user?.refreshTokens || []).map((t, idx, arr) => ({
    id: t.tokenHash ? t.tokenHash.substring(0, 10) : `session-${idx}`,
    ip: t.ip || '127.0.0.1',
    userAgent: t.userAgent || 'Web Browser',
    createdAt: t.createdAt,
    expiresAt: t.expiresAt,
    isCurrent: idx === arr.length - 1
  }));

  return res.status(200).json({
    success: true,
    sessions
  });
});

/**
 * Revoke other active sessions for authenticated user
 * POST /api/auth/sessions/revoke-others
 */
const revokeOtherSessions = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id || req.user.id).select('+refreshTokens');

  if (user && user.refreshTokens && user.refreshTokens.length > 1) {
    user.refreshTokens = user.refreshTokens.slice(-1);
    await user.save();
  }

  return res.status(200).json({
    success: true,
    message: 'All other sessions have been revoked.'
  });
});

/**
 * Delete / deactivate account for authenticated user
 * POST /api/auth/delete-account
 */
const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const user = await User.findById(req.user._id || req.user.id).select('+passwordHash +refreshTokens');
  if (!user) {
    throw ApiError.unauthorized('User not found.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.badRequest('Incorrect password. Account deletion aborted.');
  }

  user.accountStatus = 'deactivated';
  user.refreshTokens = [];
  await user.save();

  clearAuthCookies(res);

  logger.info(`[Auth] Account deactivated: ${user.email}`);

  return res.status(200).json({
    success: true,
    message: 'Your account has been deactivated successfully.'
  });
});

module.exports = {
  register,
  login,
  getMe,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  getSessions,
  revokeOtherSessions,
  deleteAccount,
  googleAuth
};
