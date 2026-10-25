/**
 * Company Discovery & Organization Management Service for HireConnect Frontend
 * Communicates with /api/companies
 */

import { apiClient } from './apiClient';

export const companyService = {
  /**
   * Search and filter verified companies
   */
  async getCompanies(params = {}) {
    return apiClient.get('/companies', { params });
  },

  /**
   * Fetch company details by ID or slug
   */
  async getCompanyById(id) {
    return apiClient.get(`/companies/${id}`);
  },

  /**
   * Fetch active job openings for a company
   */
  async getCompanyJobs(companyId) {
    return apiClient.get(`/companies/${companyId}/jobs`);
  },

  /**
   * Register a new company organization (Recruiter only)
   */
  async createCompany(data) {
    return apiClient.post('/companies', data);
  },

  /**
   * Update company organization details (Owner / Admin recruiter only)
   */
  async updateCompany(companyId, data) {
    return apiClient.put(`/companies/${companyId}`, data);
  },

  /**
   * Upload company logo
   */
  async uploadLogo(companyId, file) {
    const formData = new FormData();
    formData.append('logo', file);
    return apiClient.post(`/companies/${companyId}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
