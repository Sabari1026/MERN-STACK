/**
 * Recruiter Job Management Controller for HireConnect
 * Handles recruiter CRUD operations, publishing, closing, and organization listings.
 */

const jobService = require('../services/job.service');
const { createJobSchema, updateJobSchema } = require('../validators/job.validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const createJob = asyncHandler(async (req, res) => {
  const parsed = createJobSchema.parse(req.body);
  const newJob = await jobService.createJob(parsed, req.user);

  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    data: { job: newJob },
    job: newJob
  });
});

const getRecruiterJobs = asyncHandler(async (req, res) => {
  const result = await jobService.getRecruiterJobs(req.user, req.query);

  res.status(200).json({
    success: true,
    data: result,
    jobs: result.jobs,
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages
  });
});

const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await jobService.getJobByIdOrSlug(id, req.user);

  res.status(200).json({
    success: true,
    data: { job },
    job
  });
});

const updateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsed = updateJobSchema.parse(req.body);
  const updatedJob = await jobService.updateJob(id, parsed, req.user);

  res.status(200).json({
    success: true,
    message: 'Job updated successfully',
    data: { job: updatedJob },
    job: updatedJob
  });
});

const publishJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const publishedJob = await jobService.publishJob(id, req.user, req.body);

  res.status(200).json({
    success: true,
    message: 'Job published successfully and is now active on Find Jobs',
    data: { job: publishedJob },
    job: publishedJob
  });
});

const closeJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const closedJob = await jobService.closeJob(id, req.user);

  res.status(200).json({
    success: true,
    message: 'Job closed successfully',
    data: { job: closedJob },
    job: closedJob
  });
});

/**
 * Legacy compatibility handler for POST /api/jobs/:id/status
 */
const updateJobStatusLegacy = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const targetStatus = (req.body.status || '').toLowerCase();

  if (targetStatus === 'published' || targetStatus === 'active') {
    const job = await jobService.publishJob(id, req.user, req.body);
    return res.status(200).json({ success: true, job });
  }

  if (targetStatus === 'paused') {
    const job = await jobService.updateJob(id, { status: 'paused' }, req.user);
    return res.status(200).json({ success: true, job });
  }

  if (targetStatus === 'closed') {
    const job = await jobService.closeJob(id, req.user);
    return res.status(200).json({ success: true, job });
  }

  if (targetStatus === 'draft') {
    const job = await jobService.updateJob(id, { status: 'draft' }, req.user);
    return res.status(200).json({ success: true, job });
  }

  throw ApiError.badRequest(`Unsupported status: ${req.body.status}`);
});

module.exports = {
  createJob,
  getRecruiterJobs,
  getJobById,
  updateJob,
  publishJob,
  closeJob,
  updateJobStatusLegacy
};
