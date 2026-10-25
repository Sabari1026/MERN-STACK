/**
 * Analytics & Platform Governance Service for HireConnect Frontend
 * Communicates with /api/analytics and /api/admin
 */

import { apiClient } from './apiClient';

export const analyticsService = {
  /**
   * Fetch candidate personal activity analytics
   */
  async getCandidateOverview() {
    return apiClient.get('/candidate/analytics/overview');
  },

  /**
   * Fetch recruiter scoped recruitment metrics
   */
  async getRecruiterOverview() {
    return apiClient.get('/recruiter/analytics/overview');
  },

  /**
   * Fetch recruiter job performance table
   */
  async getRecruiterJobsAnalytics() {
    return apiClient.get('/recruiter/analytics/jobs');
  },

  /**
   * Fetch single job recruitment funnel
   */
  async getJobFunnel(jobId) {
    return apiClient.get(`/recruiter/analytics/jobs/${jobId}/funnel`);
  },

  /**
   * Export recruiter job performance report as CSV
   */
  async exportRecruiterJobsReport() {
    return apiClient.get('/recruiter/analytics/jobs/export', {
      responseType: 'blob'
    });
  },

  /**
   * Fetch platform administrator overview dashboard
   */
  async getAdminDashboard() {
    return apiClient.get('/admin/dashboard');
  },

  /**
   * Fetch admin analytics 30-day time-series and aggregate metrics
   */
  async getAdminAnalyticsOverview() {
    return apiClient.get('/admin/analytics/overview');
  },

  /**
   * Fetch platform-wide recruitment conversion funnel
   */
  async getAdminFunnel() {
    return apiClient.get('/admin/analytics/funnel');
  },

  /**
   * Export admin platform metrics report as CSV
   */
  async exportAdminCsvReport() {
    return apiClient.get('/admin/analytics/export', {
      responseType: 'blob'
    });
  },

  /**
   * Fetch paginated users list for governance
   */
  async getAdminUsers(params = {}) {
    return apiClient.get('/admin/users', { params });
  },

  /**
   * Suspend or reactivate user account
   */
  async updateAdminUserStatus(userId, status, reason = '') {
    return apiClient.patch(`/admin/users/${userId}/status`, { status, reason });
  },

  /**
   * Fetch company verification requests
   */
  async getCompanyVerificationRequests() {
    return apiClient.get('/admin/company-verification-requests');
  },

  /**
   * Approve company verification
   */
  async approveCompanyVerification(requestId) {
    return apiClient.post(`/admin/company-verification-requests/${requestId}/approve`);
  },

  /**
   * Reject company verification
   */
  async rejectCompanyVerification(requestId, reason = '') {
    return apiClient.post(`/admin/company-verification-requests/${requestId}/reject`, { reason });
  },

  /**
   * Fetch jobs for administrator moderation review
   */
  async getAdminJobs(params = {}) {
    return apiClient.get('/admin/jobs', { params });
  },

  /**
   * Flag / moderate job opening
   */
  async moderateJob(jobId, reason) {
    return apiClient.post(`/admin/jobs/${jobId}/moderate`, { reason });
  },

  /**
   * Restore moderated job opening
   */
  async restoreJob(jobId) {
    return apiClient.post(`/admin/jobs/${jobId}/restore`);
  },

  /**
   * Fetch immutable audit log stream
   */
  async getAuditLogs(params = {}) {
    return apiClient.get('/admin/audit-logs', { params });
  }
};
