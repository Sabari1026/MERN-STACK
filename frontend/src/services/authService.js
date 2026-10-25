/**
 * Authentication Service for HireConnect Frontend
 * Communicates with /api/auth routes
 */

import { apiClient } from './apiClient';

export const authService = {
  /**
   * Register a new Candidate or Recruiter account
   */
  async register(data) {
    return apiClient.post('/auth/register', data);
  },

  /**
   * Sign in to existing account
   */
  async login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },

  /**
   * End current authenticated session
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('hc_token');
        window.sessionStorage.removeItem('hc_token');
        window.localStorage.removeItem('hireconnect_token');
      }
    }
  },

  /**
   * Fetch current session profile and user data
   */
  async getCurrentUser() {
    return apiClient.get('/auth/me');
  },

  /**
   * Trigger password reset link to email
   */
  async forgotPassword(email) {
    return apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Complete password reset using token
   */
  async resetPassword(token, password) {
    return apiClient.post('/auth/reset-password', { token, password });
  },

  /**
   * Change current account password
   */
  async changePassword(currentPassword, newPassword) {
    return apiClient.patch('/auth/change-password', { currentPassword, newPassword });
  },

  /**
   * Permanently delete account
   */
  async deleteAccount(password) {
    return apiClient.delete('/auth/delete-account', { data: { password } });
  }
};
