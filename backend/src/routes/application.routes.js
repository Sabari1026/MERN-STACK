/**
 * Application Routes for HireConnect
 * Exposes candidate application submission, history, status updates, and recruiter review.
 */

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { authenticate, requireRole } = require('../middleware/auth');

// All application routes require authentication
router.use(authenticate);

// Candidate application submission & history
router.post(['/', '/apply'], requireRole('candidate', 'employee'), applicationController.applyToJob);

// Recruiter pipeline applications (all applications across recruiter's organization)
router.get('/recruiter', requireRole('recruiter', 'admin'), applicationController.getRecruiterApplications);

// Role-aware root listing: recruiters get organizational pipeline, candidates get their own applications
router.get(['/', '/me', '/my'], (req, res, next) => {
  if (req.user?.role === 'recruiter' || req.baseUrl.includes('recruiter')) {
    return applicationController.getRecruiterApplications(req, res, next);
  }
  return applicationController.getMyApplications(req, res, next);
});

// Recruiter applicant listing for a specific job
router.get('/job/:jobId', requireRole('recruiter', 'admin'), applicationController.getJobApplications);

// Application details
router.get('/:id', applicationController.getApplicationById);

// Candidate withdraw
router.patch('/:id/withdraw', requireRole('candidate', 'employee'), applicationController.withdrawApplication);

// Recruiter status updates (PATCH and PUT for legacy compatibility)
router.patch('/:id/status', requireRole('recruiter', 'admin'), applicationController.updateApplicationStatus);
router.put('/:id/status', requireRole('recruiter', 'admin'), applicationController.updateApplicationStatus);

// Recruiter notes
router.post('/:id/notes', requireRole('recruiter', 'admin'), applicationController.addNote);

module.exports = router;
