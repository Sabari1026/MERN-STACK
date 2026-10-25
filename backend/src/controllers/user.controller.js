/**
 * User Profile & Avatar Controller for HireConnect
 * Handles avatar image uploads, signature verification, safe streaming, and deletion.
 */

const path = require('path');
const User = require('../models/user.model');
const CandidateProfile = require('../models/candidateProfile.model');
const RecruiterProfile = require('../models/recruiterProfile.model');
const storageService = require('../services/storage.service');
const { validateImageBuffer, sanitizeFilename } = require('../utils/fileValidation');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

/**
 * Upload profile photo avatar
 * POST /api/users/me/avatar
 */
const uploadAvatar = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  let avatarUrl = '';

  if (req.file) {
    // 1. Signature & magic byte validation
    const validation = validateImageBuffer(req.file.buffer, 5 * 1024 * 1024);
    if (!validation.valid) {
      throw ApiError.badRequest(validation.error || 'Invalid image file.');
    }

    const sanitizedName = sanitizeFilename(req.file.originalname || `avatar.${validation.format}`);

    // 2. Persist to storage
    const stored = await storageService.saveFile({
      buffer: req.file.buffer,
      originalFilename: sanitizedName,
      mimeType: validation.mimeType,
      folder: 'avatars'
    });

    const key = path.basename(stored.storageKey);
    avatarUrl = `/api/users/avatar/${key}`;
  } else if (req.body && req.body.avatarUrl) {
    // Allow URL string input
    const urlStr = req.body.avatarUrl.trim();
    if (!/^https?:\/\/.+/i.test(urlStr)) {
      throw ApiError.badRequest('Avatar URL must be a valid http:// or https:// URL.');
    }
    avatarUrl = urlStr;
  } else {
    throw ApiError.badRequest('No image file or avatar URL was provided.');
  }

  // 3. Update User document
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found.');

  // Clean up old avatar if it was locally stored
  if (user.avatarUrl && user.avatarUrl.startsWith('/api/users/avatar/')) {
    const oldKey = 'avatars/' + path.basename(user.avatarUrl);
    await storageService.deleteFile(oldKey);
  }

  user.avatarUrl = avatarUrl;
  await user.save();

  // 4. Update corresponding profile
  if (user.role === 'candidate') {
    const candProfile = await CandidateProfile.findOne({ user: userId });
    if (candProfile) {
      candProfile.avatarUrl = avatarUrl;
      await candProfile.save();
    }
  } else if (user.role === 'recruiter') {
    const recProfile = await RecruiterProfile.findOne({ user: userId });
    if (recProfile) {
      recProfile.avatarUrl = avatarUrl;
      await recProfile.save();
    }
  }

  logger.info(`[Avatar] Updated avatar for user ${user.email}: ${avatarUrl}`);

  return res.status(200).json({
    success: true,
    message: 'Profile photo updated successfully',
    data: {
      avatarUrl,
      user: user.toSafeObject()
    }
  });
});

/**
 * Delete profile avatar and restore initials fallback
 * DELETE /api/users/me/avatar
 */
const deleteAvatar = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found.');

  if (user.avatarUrl && user.avatarUrl.startsWith('/api/users/avatar/')) {
    const oldKey = 'avatars/' + path.basename(user.avatarUrl);
    await storageService.deleteFile(oldKey);
  }

  user.avatarUrl = null;
  await user.save();

  // Update profile
  if (user.role === 'candidate') {
    const candProfile = await CandidateProfile.findOne({ user: userId });
    if (candProfile) {
      candProfile.avatarUrl = null;
      await candProfile.save();
    }
  } else if (user.role === 'recruiter') {
    const recProfile = await RecruiterProfile.findOne({ user: userId });
    if (recProfile) {
      recProfile.avatarUrl = null;
      await recProfile.save();
    }
  }

  logger.info(`[Avatar] Removed avatar for user ${user.email}`);

  return res.status(200).json({
    success: true,
    message: 'Profile photo removed successfully',
    data: {
      avatarUrl: null,
      user: user.toSafeObject()
    }
  });
});

/**
 * Stream/serve uploaded avatar image
 * GET /api/users/avatar/:key
 */
const serveAvatar = asyncHandler(async (req, res) => {
  const rawKey = req.params.key;
  const cleanKey = path.basename(rawKey); // Prevent path traversal
  const storageKey = `avatars/${cleanKey}`;

  const exists = await storageService.fileExists(storageKey);
  if (!exists) {
    throw ApiError.notFound('Avatar image not found.');
  }

  const ext = path.extname(cleanKey).toLowerCase();
  let mimeType = 'image/jpeg';
  if (ext === '.png') mimeType = 'image/png';
  else if (ext === '.webp') mimeType = 'image/webp';

  res.setHeader('Content-Type', mimeType);
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

  const stream = storageService.getFileStream(storageKey);
  stream.pipe(res);
});

module.exports = {
  uploadAvatar,
  deleteAvatar,
  serveAvatar
};
