/**
 * Matching Controller for HireConnect (Phase 7)
 * Exposes candidate personalized job matching and recruiter candidate discovery.
 */

const matchingService = require('../services/matching.service');
const savedJobService = require('../services/savedJob.service');
const applicationService = require('../services/application.service');
const User = require('../models/user.model');
const Job = require('../models/job.model');
const Application = require('../models/application.model');
const {
  candidateJobMatchQuerySchema,
  recruiterCandidateMatchQuerySchema
} = require('../validators/matching.validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * Candidate retrieves recommended jobs ranked by explainable compatibility
 * GET /api/matching/jobs & GET /api/talent-match/jobs
 */
const getCandidateJobMatches = asyncHandler(async (req, res) => {
  const parsed = candidateJobMatchQuerySchema.parse(req.query);
  const result = await matchingService.getCandidateJobMatches(req.user, parsed);

  return res.status(200).json(result);
});

/**
 * Recruiter discovers eligible candidates for an authorized job listing
 * GET /api/recruiter/jobs/:jobId/matches & GET /api/talent-match/candidates
 */
const getRecruiterJobMatches = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId || req.query.jobId;
  if (!jobId) {
    throw ApiError.badRequest('Job identifier is required to discover matching candidates.');
  }

  const parsed = recruiterCandidateMatchQuerySchema.parse(req.query);
  const result = await matchingService.getJobCandidateMatches(jobId, req.user, parsed);

  return res.status(200).json(result);
});

/**
 * Compatibility alias for toggling job bookmark directly from Talent Match UI
 * POST /api/talent-match/save-job
 */
const toggleSaveJob = asyncHandler(async (req, res) => {
  const jobId = req.body.jobId;
  if (!jobId) {
    throw ApiError.badRequest('jobId is required.');
  }

  const isAlreadySaved = await savedJobService.isJobSaved(jobId, req.user);
  if (isAlreadySaved) {
    await savedJobService.unsaveJob(jobId, req.user);
    return res.status(200).json({
      success: true,
      isSaved: false,
      message: 'Job removed from saved list.'
    });
  } else {
    await savedJobService.saveJob(jobId, req.user);
    return res.status(200).json({
      success: true,
      isSaved: true,
      message: 'Job added to your saved list!'
    });
  }
});

/**
 * Compatibility alias for shortlisting a candidate from Talent Match UI
 * POST /api/talent-match/shortlist
 */
const toggleShortlistCandidate = asyncHandler(async (req, res) => {
  const { candidateId, jobId } = req.body;
  if (!candidateId || !jobId) {
    throw ApiError.badRequest('candidateId and jobId are required.');
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw ApiError.notFound('Job opening not found.');
  }

  // Check if candidate already has an application for this job
  let app = await Application.findOne({
    job: jobId,
    candidate: candidateId
  });

  if (app) {
    const newStatus = app.status === 'shortlisted' ? 'under_review' : 'shortlisted';
    await applicationService.updateApplicationStatus(
      app._id || app.id,
      newStatus,
      req.user,
      `Updated from Talent Match discovery`
    );
    return res.status(200).json({
      success: true,
      isShortlisted: newStatus === 'shortlisted',
      status: newStatus,
      message: `Candidate ${newStatus === 'shortlisted' ? 'shortlisted' : 'un-shortlisted'} for this opening.`
    });
  } else {
    // If candidate has not applied yet, create an initial application record with status 'shortlisted'
    const candidateUser = await User.findById(candidateId);
    app = await Application.create({
      job: job._id || job.id,
      candidate: candidateId,
      company: job.company?._id || job.company,
      status: 'shortlisted',
      candidateSnapshot: {
        name: candidateUser ? candidateUser.name : 'Shortlisted Candidate',
        email: candidateUser ? candidateUser.email : 'candidate@hireconnect.dev'
      }
    });
    return res.status(200).json({
      success: true,
      isShortlisted: true,
      status: 'shortlisted',
      message: 'Candidate added to talent shortlist.'
    });
  }
});

module.exports = {
  getCandidateJobMatches,
  getRecruiterJobMatches,
  toggleSaveJob,
  toggleShortlistCandidate
};
