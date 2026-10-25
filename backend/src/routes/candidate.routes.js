/**
 * Candidate Profile Routes for HireConnect
 * Endpoints for candidate profile inspection, updates, discovery, and resume document management.
 */

const express = require('express');
const candidateController = require('../controllers/candidate.controller');
const analyticsController = require('../controllers/analytics.controller');
const { authenticate, requireRole } = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimiter');
const { handleResumeUpload } = require('../middleware/upload.middleware');
const { updateCandidateProfileSchema } = require('../validators/candidate.validator');
const { validateBody } = require('../validators/auth.validator');

const router = express.Router();

// Candidate discovery for recruiters & authenticated users
router.get('/discover', authenticate, candidateController.discoverCandidates);

// Candidate-only operations below
router.use(authenticate, requireRole('candidate'));

router.get('/me', candidateController.getMyProfile);
router.patch('/me', validateBody(updateCandidateProfileSchema), candidateController.updateMyProfile);

// Phase 11: Candidate Activity Analytics
router.get('/me/analytics', analyticsController.getCandidateOverview);
router.get('/analytics/overview', analyticsController.getCandidateOverview);

// Resume asset endpoints (rate-limited)
router.post('/me/resume', uploadLimiter, handleResumeUpload, candidateController.uploadResume);
router.get('/me/resume', candidateController.getMyResume);
router.get('/me/resume/download', candidateController.downloadMyResume);
router.delete('/me/resume', candidateController.deleteResume);

module.exports = router;
