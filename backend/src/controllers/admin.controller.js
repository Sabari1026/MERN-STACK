/**
 * Admin Controller for HireConnect (Phase 10)
 * Request handlers for administrative dashboard, user management, company verification,
 * job moderation, and audit logs.
 */

const adminService = require('../services/admin.service');
const adminAuditService = require('../services/adminAudit.service');
const {
  listUsersQuerySchema,
  updateUserStatusSchema,
  updateUserRoleSchema,
  listCompaniesQuerySchema,
  reviewCompanyVerificationSchema,
  listJobsQuerySchema,
  moderateJobSchema,
  adminCloseJobSchema,
  listAuditLogsQuerySchema
} = require('../validators/admin.validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

/**
 * GET /api/admin/dashboard
 * Aggregated platform metrics
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const metrics = await adminService.getDashboardMetrics();
  return ApiResponse.success(res, {
    data: metrics,
    message: 'Platform metrics retrieved successfully.'
  });
});

/**
 * GET /api/admin/users
 * Search and list users with pagination and filtering
 */
const listUsers = asyncHandler(async (req, res) => {
  const validatedQuery = listUsersQuerySchema.parse(req.query);
  const result = await adminService.listUsers(validatedQuery);
  return ApiResponse.success(res, {
    data: result,
    message: 'Users list retrieved successfully.'
  });
});

/**
 * GET /api/admin/users/:userId
 * Get user profile and account inspection
 */
const getUserDetails = asyncHandler(async (req, res) => {
  const result = await adminService.getUserDetails(req.params.userId);
  return ApiResponse.success(res, {
    data: result,
    message: 'User details retrieved successfully.'
  });
});

/**
 * PATCH /api/admin/users/:userId/status
 * Suspend or reactivate a user account
 */
const updateUserStatus = asyncHandler(async (req, res) => {
  const validatedData = updateUserStatusSchema.parse(req.body);
  const result = await adminService.updateUserStatus(
    req.params.userId,
    validatedData.status,
    validatedData.reason,
    req.user,
    req
  );
  return ApiResponse.success(res, {
    data: result,
    message: `User account ${validatedData.status} successfully.`
  });
});

/**
 * PATCH /api/admin/users/:userId/role
 * Change a user's role (Privileged)
 */
const updateUserRole = asyncHandler(async (req, res) => {
  const validatedData = updateUserRoleSchema.parse(req.body);
  const result = await adminService.updateUserRole(
    req.params.userId,
    validatedData.role,
    validatedData.reason,
    req.user,
    req
  );
  return ApiResponse.success(res, {
    data: result,
    message: `User role changed to ${validatedData.role} successfully.`
  });
});

/**
 * GET /api/admin/companies
 * List companies with verification filters
 */
const listCompanies = asyncHandler(async (req, res) => {
  const validatedQuery = listCompaniesQuerySchema.parse(req.query);
  const result = await adminService.listCompanies(validatedQuery);
  return ApiResponse.success(res, {
    data: result,
    message: 'Companies list retrieved successfully.'
  });
});

/**
 * GET /api/admin/companies/:companyId
 * Get detailed company inspection
 */
const getCompanyDetails = asyncHandler(async (req, res) => {
  const result = await adminService.getCompanyDetails(req.params.companyId);
  return ApiResponse.success(res, {
    data: result,
    message: 'Company details retrieved successfully.'
  });
});

/**
 * GET /api/admin/companies/verification-requests
 * Review verification requests queue
 */
const listVerificationRequests = asyncHandler(async (req, res) => {
  const validatedQuery = listCompaniesQuerySchema.parse(req.query);
  const result = await adminService.listVerificationRequests(validatedQuery);
  return ApiResponse.success(res, {
    data: result,
    message: 'Verification review queue retrieved successfully.'
  });
});

/**
 * PATCH /api/admin/companies/:companyId/verification
 * Approve, reject, or suspend company verification
 */
const reviewCompanyVerification = asyncHandler(async (req, res) => {
  const validatedData = reviewCompanyVerificationSchema.parse(req.body);
  const result = await adminService.reviewCompanyVerification(
    req.params.companyId,
    validatedData.status,
    validatedData.reason,
    validatedData.notes,
    req.user,
    req
  );
  return ApiResponse.success(res, {
    data: result,
    message: `Company verification status updated to ${validatedData.status}.`
  });
});

/**
 * GET /api/admin/jobs
 * List and review jobs
 */
const listJobs = asyncHandler(async (req, res) => {
  const validatedQuery = listJobsQuerySchema.parse(req.query);
  const result = await adminService.listJobs(validatedQuery);
  return ApiResponse.success(res, {
    data: result,
    message: 'Jobs retrieved successfully.'
  });
});

/**
 * GET /api/admin/jobs/:jobId
 * Inspect single job
 */
const getJobDetails = asyncHandler(async (req, res) => {
  const result = await adminService.getJobDetails(req.params.jobId);
  return ApiResponse.success(res, {
    data: result,
    message: 'Job details retrieved successfully.'
  });
});

/**
 * PATCH /api/admin/jobs/:jobId/moderation
 * Moderate a job (remove from listings, restore, flag)
 */
const moderateJob = asyncHandler(async (req, res) => {
  const validatedData = moderateJobSchema.parse(req.body);
  const result = await adminService.moderateJob(
    req.params.jobId,
    validatedData.action,
    validatedData.reason,
    req.user,
    req
  );
  return ApiResponse.success(res, {
    data: result,
    message: `Job moderation action "${validatedData.action}" completed successfully.`
  });
});

/**
 * POST /api/admin/jobs/:jobId/close
 * Administratively close a job
 */
const closeJob = asyncHandler(async (req, res) => {
  const validatedData = adminCloseJobSchema.parse(req.body);
  const result = await adminService.closeJob(
    req.params.jobId,
    validatedData.reason,
    req.user,
    req
  );
  return ApiResponse.success(res, {
    data: result,
    message: 'Job closed administratively.'
  });
});

/**
 * GET /api/admin/audit-logs
 * Read administrative audit history
 */
const listAuditLogs = asyncHandler(async (req, res) => {
  const validatedQuery = listAuditLogsQuerySchema.parse(req.query);
  const result = await adminAuditService.listLogs(validatedQuery);
  return ApiResponse.success(res, {
    data: result,
    message: 'Administrative audit logs retrieved successfully.'
  });
});

module.exports = {
  getDashboardStats,
  listUsers,
  getUserDetails,
  updateUserStatus,
  updateUserRole,
  listCompanies,
  getCompanyDetails,
  listVerificationRequests,
  reviewCompanyVerification,
  listJobs,
  getJobDetails,
  moderateJob,
  closeJob,
  listAuditLogs
};
