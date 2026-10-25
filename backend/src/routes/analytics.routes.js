/**
 * Analytics Routes for HireConnect (Phase 11)
 * Mounts endpoints for platform administration, recruiter analytics,
 * company-level insights, and candidate activity stats.
 */

const express = require('express');
const analyticsController = require('../controllers/analytics.controller');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// ============================================================================
// ADMIN ANALYTICS (Platform Scope)
// ============================================================================
router.get(
  '/admin/overview',
  authenticate,
  requireRole('admin'),
  analyticsController.getAdminOverview
);

router.get(
  '/admin/recruitment-funnel',
  authenticate,
  requireRole('admin'),
  analyticsController.getAdminRecruitmentFunnel
);

router.get(
  '/admin/export',
  authenticate,
  requireRole('admin'),
  analyticsController.exportAdminReport
);

// ============================================================================
// RECRUITER ANALYTICS (Scoped to Authorized Jobs)
// ============================================================================
router.get(
  '/recruiter/overview',
  authenticate,
  requireRole('recruiter'),
  analyticsController.getRecruiterOverview
);

router.get(
  '/recruiter/jobs',
  authenticate,
  requireRole('recruiter'),
  analyticsController.getRecruiterJobsAnalytics
);

router.get(
  '/recruiter/jobs/:jobId/funnel',
  authenticate,
  requireRole('recruiter'),
  analyticsController.getRecruiterJobFunnel
);

router.get(
  '/recruiter/jobs/export',
  authenticate,
  requireRole('recruiter'),
  analyticsController.exportRecruiterJobsReport
);

// ============================================================================
// COMPANY ANALYTICS (Scoped to Company Members)
// ============================================================================
router.get(
  '/companies/:companyId',
  authenticate,
  analyticsController.getCompanyAnalytics
);

// ============================================================================
// CANDIDATE ANALYTICS (Personal Scope)
// ============================================================================
router.get(
  '/candidate/overview',
  authenticate,
  requireRole('candidate'),
  analyticsController.getCandidateOverview
);

module.exports = router;
