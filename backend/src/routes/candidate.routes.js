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

// Candidate operations for /me and sub-routes (supports candidates, employees, and admins)
router.get('/me', authenticate, requireRole('candidate', 'employee', 'admin'), candidateController.getMyProfile);
router.patch('/me', authenticate, requireRole('candidate', 'employee', 'admin'), validateBody(updateCandidateProfileSchema), candidateController.updateMyProfile);

// Phase 11: Candidate Activity Analytics
router.get('/me/analytics', authenticate, requireRole('candidate', 'employee', 'admin'), analyticsController.getCandidateOverview);
router.get('/analytics/overview', authenticate, requireRole('candidate', 'employee', 'admin'), analyticsController.getCandidateOverview);

// Resume asset endpoints (rate-limited)
router.post('/me/resume', authenticate, requireRole('candidate', 'employee', 'admin'), uploadLimiter, handleResumeUpload, candidateController.uploadResume);
router.get('/me/resume', authenticate, requireRole('candidate', 'employee', 'admin'), candidateController.getMyResume);
router.get('/me/resume/download', authenticate, requireRole('candidate', 'employee', 'admin'), candidateController.downloadMyResume);
router.delete('/me/resume', authenticate, requireRole('candidate', 'employee', 'admin'), candidateController.deleteResume);

// Public/Recruiter candidate profile inspection (honoring discoverability & privacy)
router.get('/:userId', optionalAuth, candidateController.getPublicProfile);

module.exports = router;
