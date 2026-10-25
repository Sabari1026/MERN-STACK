/**
 * Saved Jobs Controller for HireConnect
 * Handles candidate job bookmarks, listing saved opportunities, and removal.
 */

const savedJobService = require('../services/savedJob.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const saveJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId || req.body.jobId;
  if (!jobId) {
    throw ApiError.badRequest('Job identifier is required.');
  }

  const result = await savedJobService.saveJob(jobId, req.user);

  return res.status(200).json({
    success: true,
    message: result.message,
    isSaved: result.isSaved,
    savedAt: result.savedAt
  });
});

const unsaveJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId || req.body.jobId;
  if (!jobId) {
    throw ApiError.badRequest('Job identifier is required.');
  }

  const result = await savedJobService.unsaveJob(jobId, req.user);

  return res.status(200).json({
    success: true,
    message: result.message,
    isSaved: result.isSaved
  });
});

const getSavedJobs = asyncHandler(async (req, res) => {
  const result = await savedJobService.getSavedJobs(req.user, req.query);

  return res.status(200).json({
    success: true,
    data: result,
    savedJobs: result.savedJobs,
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages
  });
});

const checkSaved = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const isSaved = await savedJobService.isJobSaved(jobId, req.user);

  return res.status(200).json({
    success: true,
    isSaved
  });
});

module.exports = {
  saveJob,
  unsaveJob,
  getSavedJobs,
  checkSaved
};
