/**
 * Saved Jobs Routes for HireConnect
 * Exposes candidate bookmarking, listing, and unsaving operations.
 */

const express = require('express');
const router = express.Router();
const savedJobController = require('../controllers/savedJob.controller');
const { authenticate, requireRole } = require('../middleware/auth');

// All saved job routes require candidate authentication
router.use(authenticate);
router.use(requireRole('candidate', 'employee'));

router.get('/', savedJobController.getSavedJobs);
router.post('/', savedJobController.saveJob);
router.delete('/', savedJobController.unsaveJob);
router.post('/:jobId', savedJobController.saveJob);
router.delete('/:jobId', savedJobController.unsaveJob);
router.get('/:jobId/check', savedJobController.checkSaved);

module.exports = router;
