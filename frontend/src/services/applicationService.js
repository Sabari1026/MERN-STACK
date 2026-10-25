/**
 * Application Service for HireConnect Frontend
 * Communicates with /api/applications and /api/recruiter/applications
 */

import { apiClient } from './apiClient';

export const applicationService = {
  /**
   * Submit an application to a published job (Candidate only)
   */
  async applyForJob(applicationData) {
    return apiClient.post('/applications', applicationData);
  },

  /**
   * Fetch candidate's own submitted application history
   */
  async getMyApplications() {
    return apiClient.get('/applications/my');
  },

  /**
   * Fetch applications for a specific job (Recruiter only)
   */
  async getJobApplications(jobId, params = {}) {
    return apiClient.get(`/applications/job/${jobId}`, { params });
  },

  /**
   * Fetch all applications for recruiter's company (Recruiter only)
   */
  async getRecruiterApplications(params = {}) {
    return apiClient.get('/recruiter/applications', { params });
  },

  /**
   * Update applicant review status (Recruiter only)
   */
  async updateStatus(applicationId, status, notes = '') {
    return apiClient.patch(`/applications/${applicationId}/status`, { status, notes });
  },

  /**
   * Fetch application details
   */
  async getApplicationDetails(applicationId) {
    return apiClient.get(`/applications/${applicationId}`);
  }
};
