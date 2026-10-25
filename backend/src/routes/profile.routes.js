/**
 * Profile & Public Profile Routes for HireConnect
 * Handles public profile access and provides compatibility aliases for legacy frontend routes.
 */

const express = require('express');
const candidateController = require('../controllers/candidate.controller');
const recruiterController = require('../controllers/recruiter.controller');
const { authenticate, requireRole, optionalAuth } = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimiter');
const { handleResumeUpload } = require('../middleware/upload.middleware');
const { updateCandidateProfileSchema } = require('../validators/candidate.validator');
const { updateRecruiterProfileSchema } = require('../validators/recruiter.validator');
const { validateBody } = require('../validators/auth.validator');

const router = express.Router();

// Compatibility aliases for frontend profile engine
router.put(
  '/candidate',
  authenticate,
  requireRole('candidate'),
  validateBody(updateCandidateProfileSchema),
  candidateController.updateMyProfile
);

router.put(
  '/recruiter',
  authenticate,
  requireRole('recruiter'),
  validateBody(updateRecruiterProfileSchema),
  recruiterController.updateMyProfile
);

router.post(
  '/resume/upload',
  authenticate,
  requireRole('candidate'),
  uploadLimiter,
  handleResumeUpload,
  candidateController.uploadResume
);

router.delete(
  '/resume',
  authenticate,
  requireRole('candidate'),
  candidateController.deleteResume
);

router.get(
  '/resume/download/:userId',
  authenticate,
  candidateController.downloadResumeByUser
);

// Public profile retrieval endpoints
router.get('/recruiter/:userId', optionalAuth, recruiterController.getPublicProfile);
router.get('/:userId', optionalAuth, candidateController.getPublicProfile);

module.exports = router;
