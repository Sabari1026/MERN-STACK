/**
 * Recruiter Job Management Routes for HireConnect
 * RESTful management of company job listings, publication, and lifecycle states.
 */

const express = require('express');
const router = express.Router();
const recruiterJobController = require('../controllers/recruiterJob.controller');
const applicationController = require('../controllers/application.controller');
const matchingController = require('../controllers/matching.controller');
const { authenticate, requireRole } = require('../middleware/auth');

// All recruiter job routes require authentication and recruiter or admin role
router.use(authenticate);
router.use(requireRole('recruiter', 'admin'));

router.post('/', recruiterJobController.createJob);
router.get('/', recruiterJobController.getRecruiterJobs);
router.get('/:id', recruiterJobController.getJobById);
router.patch('/:id', recruiterJobController.updateJob);
router.patch('/:id/publish', recruiterJobController.publishJob);
router.patch('/:id/pause', recruiterJobController.pauseJob);
router.patch('/:id/close', recruiterJobController.closeJob);

// Recruiter Applicant Management for Job
router.get('/:jobId/applications', applicationController.getJobApplications);
router.get('/:jobId/applicants', applicationController.getJobApplications);

// Recruiter Candidate Matching for Job (Phase 7)
router.get('/:jobId/matches', matchingController.getRecruiterJobMatches);

module.exports = router;
