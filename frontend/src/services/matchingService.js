/**
 * Talent Match & Intelligent Scoring Service for HireConnect Frontend
 * Communicates with /api/matching and /api/talent-match
 */

import { apiClient } from './apiClient';

export const matchingService = {
  /**
   * Fetch AI job match recommendations for authenticated candidate
   */
  async getCandidateMatches() {
    return apiClient.get('/matching/candidate');
  },

  /**
   * Fetch ranked candidate matches for a recruiter's job opening
   */
  async getJobCandidateMatches(jobId) {
    return apiClient.get(`/matching/job/${jobId}`);
  }
};
