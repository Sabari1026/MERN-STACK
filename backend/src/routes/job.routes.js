/**
 * Public Job Discovery & Legacy Compatibility Routes for HireConnect
 * Exposes search, filters, and job details, plus legacy /api/jobs/* recruiter endpoints.
 */

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const recruiterJobController = require('../controllers/recruiterJob.controller');
const applicationController = require('../controllers/application.controller');
const savedJobController = require('../controllers/savedJob.controller');
const { authenticate, optionalAuth, requireRole } = require('../middleware/auth');

// Legacy compatibility routes (must precede /:idOrSlug)
// Legacy endpoints expect 403 when unauthenticated or unauthorized
function legacyRecruiterAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const cookie = req.cookies && req.cookies.hireconnect_access_token;
  if (!authHeader && !cookie) {
    return res.status(403).json({ success: false, message: 'Forbidden: Only authenticated recruiters can publish jobs.' });
  }
  return authenticate(req, res, next);
}

router.post('/create', legacyRecruiterAuth, requireRole('recruiter', 'admin'), recruiterJobController.createJob);
router.post('/:id/status', legacyRecruiterAuth, requireRole('recruiter', 'admin'), recruiterJobController.updateJobStatusLegacy);
router.put('/:id', legacyRecruiterAuth, requireRole('recruiter', 'admin'), recruiterJobController.updateJob);

// Candidate Actions on Specific Job
router.post('/:jobId/apply', authenticate, requireRole('candidate', 'employee'), applicationController.applyToJob);
router.post('/:jobId/save', authenticate, requireRole('candidate', 'employee'), savedJobController.saveJob);
router.delete('/:jobId/save', authenticate, requireRole('candidate', 'employee'), savedJobController.unsaveJob);
router.get('/:jobId/saved', authenticate, requireRole('candidate', 'employee'), savedJobController.checkSaved);

// Public Job Discovery routes
router.get('/', optionalAuth, jobController.getJobs);
router.get('/:idOrSlug', optionalAuth, jobController.getJobByIdOrSlug);

module.exports = router;
