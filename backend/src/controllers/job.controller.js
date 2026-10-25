/**
 * Public Job Discovery Controller for HireConnect
 * Exposes verified job search, multi-faceted filtering, and detailed job views.
 */

const jobService = require('../services/job.service');
const { searchJobsSchema } = require('../validators/job.validator');
const asyncHandler = require('../utils/asyncHandler');

const getJobs = asyncHandler(async (req, res) => {
  const filters = searchJobsSchema.parse(req.query);
  const result = await jobService.getJobs(filters);

  // Return dual format for 100% compatibility with find-jobs-engine.js and standard REST clients
  res.status(200).json({
    success: true,
    data: result,
    jobs: result.jobs,
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
    hasMore: result.hasMore
  });
});

const getJobByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const job = await jobService.getJobByIdOrSlug(idOrSlug, req.user);

  res.status(200).json({
    success: true,
    data: { job },
    job
  });
});

module.exports = {
  getJobs,
  getJobByIdOrSlug
};
