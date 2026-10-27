/**
 * Candidate Profile Routes for HireConnect
 * Endpoints for candidate profile inspection, updates, discovery, and resume document management.
 */

const express = require('express');
const candidateController = require('../controllers/candidate.controller');
const analyticsController = require('../controllers/analytics.controller');
const { authenticate, requireRole, optionalAuth } = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimiter');
const { handleResumeUpload } = require('../middleware/upload.middleware');
const { updateCandidateProfileSchema } = require('../validators/candidate.validator');
const { validateBody } = require('../validators/auth.validator');

const router = express.Router();

// Candidate discovery for recruiters & authenticated users
router.get('/discover', authenticate, candidateController.discoverCandidates);

// Candidate-only operations for /me and sub-routes
router.get('/me', authenticate, requireRole('candidate'), candidateController.getMyProfile);
router.patch('/me', authenticate, requireRole('candidate'), validateBody(updateCandidateProfileSchema), candidateController.updateMyProfile);

// Phase 11: Candidate Activity Analytics
router.get('/me/analytics', authenticate, requireRole('candidate'), analyticsController.getCandidateOverview);
router.get('/analytics/overview', authenticate, requireRole('candidate'), analyticsController.getCandidateOverview);

// Resume asset endpoints (rate-limited)
router.post('/me/resume', authenticate, requireRole('candidate'), uploadLimiter, handleResumeUpload, candidateController.uploadResume);
router.get('/me/resume', authenticate, requireRole('candidate'), candidateController.getMyResume);
router.get('/me/resume/download', authenticate, requireRole('candidate'), candidateController.downloadMyResume);
router.delete('/me/resume', authenticate, requireRole('candidate'), candidateController.deleteResume);

// Public/Recruiter candidate profile inspection (honoring discoverability & privacy)
router.get('/:userId', optionalAuth, candidateController.getPublicProfile);

module.exports = router;
