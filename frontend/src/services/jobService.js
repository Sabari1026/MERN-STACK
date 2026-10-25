/**
 * Job Service for HireConnect Frontend
 * Communicates with /api/jobs, /api/recruiter/jobs, and /api/saved-jobs
 */

import { apiClient } from './apiClient';

export const jobService = {
  /**
   * Search and filter public job openings
   */
  async getJobs(params = {}) {
    return apiClient.get('/jobs', { params });
  },

  /**
   * Fetch a single job opening by ID or slug
   */
  async getJobById(id) {
    return apiClient.get(`/jobs/${id}`);
  },

  /**
   * Fetch available job categories / departments
   */
  async getCategories() {
    return apiClient.get('/jobs/categories');
  },

  /**
   * Create a new job opening (Recruiter only)
   */
  async createJob(jobData) {
    return apiClient.post('/recruiter/jobs', jobData);
  },

  /**
   * Fetch jobs managed by the authenticated recruiter
   */
  async getRecruiterJobs(params = {}) {
    return apiClient.get('/recruiter/jobs', { params });
  },

  /**
   * Update an existing job opening (Recruiter only)
   */
  async updateJob(id, jobData) {
    return apiClient.patch(`/recruiter/jobs/${id}`, jobData);
  },

  /**
   * Pause job listing (Recruiter only)
   */
  async pauseJob(id) {
    return apiClient.post(`/recruiter/jobs/${id}/pause`);
  },

  /**
   * Publish / unpause job listing (Recruiter only)
   */
  async publishJob(id) {
    return apiClient.post(`/recruiter/jobs/${id}/publish`);
  },

  /**
   * Close job listing (Recruiter only)
   */
  async closeJob(id) {
    return apiClient.post(`/recruiter/jobs/${id}/close`);
  },

  /**
   * Delete job listing (Recruiter only)
   */
  async deleteJob(id) {
    return apiClient.delete(`/recruiter/jobs/${id}`);
  },

  /**
   * Fetch candidate's bookmarked / saved jobs
   */
  async getSavedJobs() {
    return apiClient.get('/saved-jobs');
  },

  /**
   * Toggle saved status for a job
   */
  async toggleSaveJob(jobId) {
    return apiClient.post(`/saved-jobs/${jobId}/toggle`);
  }
};
