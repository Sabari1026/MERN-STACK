/**
 * Recruiter Profile Service for HireConnect
 * Handles recruiter profile lifecycle, professional details, and company representation safeguards.
 */

const RecruiterProfile = require('../models/recruiterProfile.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const ALLOWED_RECRUITER_FIELDS = [
  'jobTitle',
  'title',
  'department',
  'professionalSummary',
  'bio',
  'phone',
  'location',
  'linkedinUrl',
  'linkedin',
  'avatarUrl'
];

class RecruiterService {
  /**
   * Retrieve or create a recruiter profile for a given user (idempotent)
   * @param {string} userId
   * @param {object} [userDoc]
   * @returns {Promise<RecruiterProfile>}
   */
  async getOrCreateProfile(userId, userDoc) {
    let profile = await RecruiterProfile.findOne({ user: userId });

    if (!profile) {
      const user = userDoc || (await User.findById(userId));
      profile = new RecruiterProfile({
        user: userId,
        jobTitle: 'Technical Recruiter',
        department: 'Talent Acquisition',
        location: 'Bengaluru, Karnataka',
        companyName: 'Partner Tech Company'
      });
      await profile.save();
      logger.info(`[Profile] Initialized default recruiter profile for user ${userId}`);
    }

    return profile;
  }

  /**
   * Update recruiter profile with whitelist validation (PATCH semantics)
   * @param {string} userId
   * @param {object} updateData
   * @returns {Promise<RecruiterProfile>}
   */
  async updateProfile(userId, updateData) {
    const profile = await this.getOrCreateProfile(userId);

    if (updateData.jobTitle !== undefined) profile.jobTitle = updateData.jobTitle;
    if (updateData.title !== undefined) profile.jobTitle = updateData.title;
    if (updateData.department !== undefined) profile.department = updateData.department;
    if (updateData.professionalSummary !== undefined) profile.professionalSummary = updateData.professionalSummary;
    if (updateData.bio !== undefined) profile.professionalSummary = updateData.bio;
    if (updateData.phone !== undefined) profile.phone = updateData.phone;
    if (updateData.location !== undefined) profile.location = updateData.location;
    if (updateData.linkedinUrl !== undefined) profile.linkedinUrl = updateData.linkedinUrl;
    if (updateData.linkedin !== undefined) profile.linkedinUrl = updateData.linkedin;
    if (updateData.avatarUrl !== undefined) profile.avatarUrl = updateData.avatarUrl;

    // Synchronize User model fields if provided
    if (updateData.name && typeof updateData.name === 'string') {
      await User.findByIdAndUpdate(userId, { name: updateData.name.trim() });
    }
    if (updateData.avatarUrl !== undefined) {
      await User.findByIdAndUpdate(userId, { avatarUrl: updateData.avatarUrl || null });
    }

    await profile.save();
    return RecruiterProfile.findOne({ user: userId });
  }

  /**
   * Get public recruiter profile
   * @param {string} targetUserId
   * @returns {Promise<object>}
   */
  async getPublicProfile(targetUserId) {
    const profile = await RecruiterProfile.findOne({ user: targetUserId });
    if (!profile) {
      throw ApiError.notFound('Recruiter profile not found.');
    }

    const safeObj = profile.toJSON();
    // Redact private direct contact details from public view
    safeObj.phone = undefined;

    return safeObj;
  }
}

module.exports = new RecruiterService();
