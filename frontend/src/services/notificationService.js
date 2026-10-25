/**
 * In-App & Email Notification Service for HireConnect Frontend
 * Communicates with /api/notifications
 */

import { apiClient } from './apiClient';

export const notificationService = {
  /**
   * Fetch current user's notifications list
   */
  async getNotifications(params = {}) {
    return apiClient.get('/notifications', { params });
  },

  /**
   * Fetch unread notification count
   */
  async getUnreadCount() {
    return apiClient.get('/notifications/unread-count');
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(id) {
    return apiClient.patch(`/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    return apiClient.patch('/notifications/read-all');
  },

  /**
   * Dismiss/delete a notification
   */
  async deleteNotification(id) {
    return apiClient.delete(`/notifications/${id}`);
  },

  /**
   * Fetch notification delivery preferences
   */
  async getPreferences() {
    return apiClient.get('/notifications/preferences');
  },

  /**
   * Update notification delivery preferences
   */
  async updatePreferences(preferences) {
    return apiClient.put('/notifications/preferences', preferences);
  }
};
