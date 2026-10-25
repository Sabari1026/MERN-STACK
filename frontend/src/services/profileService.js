/**
 * Profile & Document Management Service for HireConnect Frontend
 * Communicates with /api/candidates, /api/recruiters, /api/users, and /api/profiles
 */

import { apiClient } from './apiClient';

export const profileService = {
  /**
   * Fetch authenticated candidate's full profile
   */
  async getCandidateProfile() {
    return apiClient.get('/candidates/me');
  },

  /**
   * Update candidate profile details (headline, bio, skills, experience, education, discoverability)
   */
  async updateCandidateProfile(profileData) {
    return apiClient.patch('/candidates/me', profileData);
  },

  /**
   * Upload resume document (PDF / DOCX <= 5MB)
   */
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);
    return apiClient.post('/candidates/me/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Download authenticated candidate's own resume
   */
  async downloadOwnResume() {
    return apiClient.get('/candidates/me/resume/download', {
      responseType: 'blob'
    });
  },

  /**
   * Download an applicant's resume (Authorized recruiter / candidate)
   */
  async downloadResumeByUserId(userId) {
    return apiClient.get(`/profile/resume/download/${userId}`, {
      responseType: 'blob'
    });
  },

  /**
   * Delete uploaded resume
   */
  async deleteResume() {
    return apiClient.delete('/candidates/me/resume');
  },

  /**
   * Fetch authenticated recruiter's profile
   */
  async getRecruiterProfile() {
    return apiClient.get('/recruiters/me');
  },

  /**
   * Update recruiter profile
   */
  async updateRecruiterProfile(profileData) {
    return apiClient.patch('/recruiters/me', profileData);
  },

  /**
   * Upload user avatar image (JPEG / PNG / WebP <= 2MB)
   */
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Delete user avatar and restore initials fallback
   */
  async deleteAvatar() {
    return apiClient.delete('/users/me/avatar');
  },

  /**
   * Fetch public profile for discoverable candidate
   */
  async getPublicProfile(userId) {
    return apiClient.get(`/profiles/${userId}`);
  }
};
