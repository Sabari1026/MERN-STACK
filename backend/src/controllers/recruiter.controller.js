/**
 * Recruiter Profile Controller for HireConnect
 * Handles recruiter profile retrieval, updates, and corporate verification status.
 */

const recruiterService = require('../services/recruiter.service');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Get current authenticated recruiter profile
 * GET /api/recruiters/me
 */
const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await recruiterService.getOrCreateProfile(req.user.id || req.user._id, req.user);

  return res.status(200).json({
    success: true,
    data: {
      profile: profile.toJSON()
    }
  });
});

/**
 * Update current authenticated recruiter profile
 * PATCH /api/recruiters/me & PUT /api/profile/recruiter
 */
const updateMyProfile = asyncHandler(async (req, res) => {
  const updated = await recruiterService.updateProfile(req.user.id || req.user._id, req.body);

  return res.status(200).json({
    success: true,
    message: 'Recruiter profile updated successfully',
    data: {
      profile: updated.toJSON()
    }
  });
});

/**
 * Get public recruiter profile
 * GET /api/profiles/recruiter/:userId
 */
const getPublicProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const safeProfile = await recruiterService.getPublicProfile(userId);

  return res.status(200).json({
    success: true,
    data: {
      profile: safeProfile
    }
  });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  getPublicProfile
};
