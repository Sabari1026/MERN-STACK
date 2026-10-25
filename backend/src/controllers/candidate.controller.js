/**
 * Candidate Profile Controller for HireConnect
 * Handles candidate profile retrieval, updates, resume uploads, and private document streaming.
 */

const candidateService = require('../services/candidate.service');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Get current authenticated candidate profile
 * GET /api/candidates/me
 */
const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await candidateService.getOrCreateProfile(req.user.id || req.user._id, req.user);

  return res.status(200).json({
    success: true,
    data: {
      profile: profile.toJSON(),
      completeness: profile.calculateCompleteness()
    }
  });
});

/**
 * Update current authenticated candidate profile
 * PATCH /api/candidates/me & PUT /api/profile/candidate
 */
const updateMyProfile = asyncHandler(async (req, res) => {
  const updated = await candidateService.updateProfile(req.user.id || req.user._id, req.body);

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      profile: updated.toJSON(),
      completeness: updated.calculateCompleteness()
    }
  });
});

/**
 * Upload or replace candidate resume
 * POST /api/candidates/me/resume & POST /api/profile/resume/upload
 */
const uploadResume = asyncHandler(async (req, res) => {
  let fileData = req.file;

  // Support backward-compatible JSON payload if file was not passed via multipart
  if (!fileData && req.body && (req.body.fileName || req.body.originalFilename)) {
    const fileName = req.body.fileName || req.body.originalFilename || 'Resume.pdf';
    const fileSize = req.body.fileSize != null ? Number(req.body.fileSize) : 0;
    const fileType = req.body.fileType || 'application/pdf';

    // Extension validation
    if (!fileName.match(/\.(pdf|docx?)$/i) || fileType.includes('msdownload') || fileType.includes('executable')) {
      throw ApiError.badRequest('Invalid file format. Only PDF, DOC, and DOCX resumes are accepted.');
    }
    // Size limit (5MB)
    if (fileSize > 5 * 1024 * 1024) {
      throw ApiError.badRequest('File size exceeds the 5MB maximum limit.');
    }

    const contentText = req.body.contentText || `${req.user.name} - Resume`;
    fileData = {
      buffer: Buffer.from(`%PDF-1.4\n%HireConnect Resume\n${contentText}`),
      originalname: fileName,
      mimetype: fileType
    };
  }

  if (!fileData) {
    throw ApiError.badRequest('No resume file was uploaded.');
  }

  const result = await candidateService.uploadResume(req.user.id || req.user._id, fileData);

  return res.status(200).json({
    success: true,
    message: 'Resume uploaded and verified successfully',
    resume: {
      fileName: fileData.originalname || 'Resume.pdf',
      fileUrl: `/api/profile/resume/download/${req.user.id || req.user._id}`,
      fileType: fileData.mimetype || 'application/pdf',
      fileSize: fileData.buffer?.length || 420000,
      uploadedAt: new Date()
    },
    data: {
      resume: result.resume.toJSON ? result.resume.toJSON() : result.resume,
      profile: result.profile.toJSON ? result.profile.toJSON() : result.profile
    }
  });
});

/**
 * Get current resume metadata
 * GET /api/candidates/me/resume
 */
const getMyResume = asyncHandler(async (req, res) => {
  const profile = await candidateService.getOrCreateProfile(req.user.id || req.user._id, req.user);
  if (!profile.resume) {
    throw ApiError.notFound('No resume uploaded yet.');
  }

  return res.status(200).json({
    success: true,
    data: {
      resume: profile.resume.toJSON ? profile.resume.toJSON() : profile.resume
    }
  });
});

/**
 * Stream candidate's own private resume
 * GET /api/candidates/me/resume/download
 */
const downloadMyResume = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { stream, originalFilename, mimeType, sizeBytes } =
    await candidateService.getResumeStream(userId, req.user);

  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Length', sizeBytes);
  res.setHeader('Content-Disposition', `attachment; filename="${originalFilename}"`);

  stream.pipe(res);
});

/**
 * Stream candidate resume by target user ID (recruiter or candidate)
 * GET /api/profile/resume/download/:userId
 */
const downloadResumeByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { stream, originalFilename, mimeType, sizeBytes } =
    await candidateService.getResumeStream(userId, req.user);

  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Length', sizeBytes);
  res.setHeader('Content-Disposition', `attachment; filename="${originalFilename}"`);

  stream.pipe(res);
});

/**
 * Delete candidate's current resume
 * DELETE /api/candidates/me/resume & DELETE /api/profile/resume
 */
const deleteResume = asyncHandler(async (req, res) => {
  await candidateService.deleteResume(req.user.id || req.user._id);

  return res.status(200).json({
    success: true,
    message: 'Resume deleted successfully'
  });
});

/**
 * Get public profile by userId
 * GET /api/profiles/:userId
 */
const getPublicProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const safeProfile = await candidateService.getPublicProfile(userId, req.user);

  return res.status(200).json({
    success: true,
    data: {
      profile: safeProfile
    }
  });
});

/**
 * Discover candidates who have discoverability opted-in
 * GET /api/candidates/discover
 */
const discoverCandidates = asyncHandler(async (req, res) => {
  const { q, skills } = req.query;
  const candidates = await candidateService.discoverCandidates({ q, skills });

  return res.status(200).json({
    success: true,
    candidates,
    data: { candidates }
  });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  uploadResume,
  getMyResume,
  downloadMyResume,
  downloadResumeByUser,
  deleteResume,
  getPublicProfile,
  discoverCandidates
};
