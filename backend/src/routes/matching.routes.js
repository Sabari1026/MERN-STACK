/**
 * Matching & Talent Match Routes for HireConnect (Phase 7)
 * Exposes candidate job recommendations and recruiter candidate discovery.
 */

const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matching.controller');
const { authenticate, requireRole } = require('../middleware/auth');

// Candidate job matching (supporting REST, feature service, and legacy paths)
router.get(
  ['/jobs', '/candidate', '/candidate/recommendations'],
  authenticate,
  requireRole('candidate', 'employee'),
  matchingController.getCandidateJobMatches
);

// Recruiter candidate discovery (supporting REST, feature service, and legacy paths)
router.get(
  ['/candidates', '/job/:jobId', '/recruiter/jobs/:jobId/candidates'],
  authenticate,
  requireRole('recruiter', 'admin'),
  matchingController.getRecruiterJobMatches
);

// Interactive UI actions (saving jobs & shortlisting candidates from Talent Match)
router.post(
  '/save-job',
  authenticate,
  requireRole('candidate', 'employee'),
  matchingController.toggleSaveJob
);

router.post(
  '/shortlist',
  authenticate,
  requireRole('recruiter', 'admin'),
  matchingController.toggleShortlistCandidate
);

module.exports = router;
