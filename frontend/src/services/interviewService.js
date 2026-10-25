/**
 * Interview Scheduler & Meeting Service for HireConnect Frontend
 * Communicates with /api meeting and availability routes
 */

import { apiClient } from './apiClient';

export const interviewService = {
  /**
   * Fetch recruiter's configured weekly availability
   */
  async getRecruiterAvailability() {
    return apiClient.get('/recruiter/availability');
  },

  /**
   * Update recruiter's weekly schedule & timezone
   */
  async updateRecruiterAvailability(availabilityData) {
    return apiClient.put('/recruiter/availability', availabilityData);
  },

  /**
   * Discover available bookable time slots for a recruiter
   */
  async getAvailableSlots(recruiterId, date) {
    return apiClient.get(`/recruiters/${recruiterId}/slots`, {
      params: { date }
    });
  },

  /**
   * Book an interview slot (Candidate)
   */
  async bookInterview(bookingData) {
    return apiClient.post('/meetings/book', bookingData);
  },

  /**
   * Fetch current user's meetings list (Candidate or Recruiter)
   */
  async getMyInterviews() {
    return apiClient.get('/meetings/my');
  },

  /**
   * Reschedule an existing interview
   */
  async rescheduleInterview(meetingId, data) {
    return apiClient.post(`/meetings/${meetingId}/reschedule`, data);
  },

  /**
   * Cancel an existing interview
   */
  async cancelInterview(meetingId, reason = '') {
    return apiClient.post(`/meetings/${meetingId}/cancel`, { reason });
  }
};
