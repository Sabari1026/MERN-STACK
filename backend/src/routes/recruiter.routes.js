/**
 * Recruiter Profile Routes for HireConnect
 * Endpoints for recruiter profile management and corporate verification.
 */

const express = require('express');
const recruiterController = require('../controllers/recruiter.controller');
const analyticsController = require('../controllers/analytics.controller');
const { authenticate, requireRole } = require('../middleware/auth');
const { updateRecruiterProfileSchema } = require('../validators/recruiter.validator');
const { validateBody } = require('../validators/auth.validator');

const router = express.Router();

// Recruiter profile endpoints require recruiter role
router.get('/me', authenticate, requireRole('recruiter'), recruiterController.getMyProfile);
router.patch('/me', authenticate, requireRole('recruiter'), validateBody(updateRecruiterProfileSchema), recruiterController.updateMyProfile);

// Phase 11: Recruiter Analytics & Job Performance
router.get('/analytics/overview', authenticate, requireRole('recruiter'), analyticsController.getRecruiterOverview);
router.get('/analytics/jobs', authenticate, requireRole('recruiter'), analyticsController.getRecruiterJobsAnalytics);
router.get('/analytics/jobs/:jobId/funnel', authenticate, requireRole('recruiter'), analyticsController.getRecruiterJobFunnel);
router.get('/analytics/jobs/export', authenticate, requireRole('recruiter'), analyticsController.exportRecruiterJobsReport);

module.exports = router;
