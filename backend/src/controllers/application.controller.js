/**
 * Application Controller for HireConnect
 * Exposes candidate application submission, application history, status tracking,
 * recruiter applicant review, and status lifecycle operations.
 */

const applicationService = require('../services/application.service');
const {
  applyJobSchema,
  updateStatusSchema,
  addNoteSchema,
  searchApplicationsSchema
} = require('../validators/application.validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const applyToJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId || req.body.jobId;
  if (!jobId) {
    throw ApiError.badRequest('Job identifier is required to submit an application.');
  }

  const parsed = applyJobSchema.parse(req.body);
  const result = await applicationService.applyToJob(jobId, req.user, parsed);

  if (result.isExternal) {
    return res.status(200).json({
      success: true,
      isExternal: true,
      applyUrl: result.applyUrl,
      message: result.message
    });
  }

  return res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: { application: result },
    application: result
  });
});

const getMyApplications = asyncHandler(async (req, res) => {
  const filters = searchApplicationsSchema.parse(req.query);
  const result = await applicationService.getMyApplications(req.user, filters);

  return res.status(200).json({
    success: true,
    data: result,
    applications: result.applications,
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages
  });
});

const getApplicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await applicationService.getApplicationById(id, req.user);

  return res.status(200).json({
    success: true,
    data: { application: result },
    application: result
  });
});

const withdrawApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await applicationService.withdrawApplication(id, req.user, req.body.reason);

  return res.status(200).json({
    success: true,
    message: 'Application withdrawn successfully',
    data: { application: result },
    application: result
  });
});

const getJobApplications = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId || req.params.id;
  const filters = searchApplicationsSchema.parse(req.query);
  const result = await applicationService.getJobApplications(jobId, req.user, filters);

  return res.status(200).json({
    success: true,
    data: result,
    applications: result.applications,
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages
  });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsed = updateStatusSchema.parse(req.body);
  const result = await applicationService.updateApplicationStatus(
    id,
    parsed.status,
    req.user,
    parsed.reason,
    parsed.note
  );

  return res.status(200).json({
    success: true,
    message: `Application status updated to ${parsed.status}`,
    data: { application: result },
    application: result
  });
});

const addNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsed = addNoteSchema.parse(req.body);
  const result = await applicationService.addRecruiterNote(id, parsed.text, req.user);

  return res.status(200).json({
    success: true,
    message: 'Internal evaluation note added successfully',
    data: { application: result },
    application: result
  });
});

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationById,
  withdrawApplication,
  getJobApplications,
  updateApplicationStatus,
  addNote
};
