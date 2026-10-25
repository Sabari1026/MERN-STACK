/**
 * Analytics Controller for HireConnect (Phase 11)
 * Handles HTTP requests for platform-level, recruiter-scoped, company-scoped,
 * and candidate-specific analytics, recruitment funnels, and CSV reports.
 */

const analyticsService = require('../services/analytics.service');
const {
  analyticsDateRangeSchema,
  recruitmentFunnelQuerySchema,
  adminExportQuerySchema,
  recruiterJobsAnalyticsQuerySchema,
  recruiterExportQuerySchema
} = require('../validators/analytics.validator');
const Company = require('../models/company.model');
const CompanyMembership = require('../models/companyMembership.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

// ============================================================================
// PART B: ADMIN ANALYTICS
// ============================================================================

/**
 * GET /api/admin/analytics/overview
 * Platform-wide aggregated metrics, growth comparisons, and daily time series
 */
const getAdminOverview = asyncHandler(async (req, res) => {
  const validatedQuery = analyticsDateRangeSchema.parse(req.query);
  const data = await analyticsService.getAdminOverview(validatedQuery);
  return ApiResponse.success(res, {
    data,
    message: 'Platform analytics overview retrieved successfully.'
  });
});

/**
 * GET /api/admin/analytics/recruitment-funnel
 * Stage-by-stage recruitment funnel, drop-off rates, and conversion metrics
 */
const getAdminRecruitmentFunnel = asyncHandler(async (req, res) => {
  const validatedQuery = recruitmentFunnelQuerySchema.parse(req.query);
  const data = await analyticsService.getAdminRecruitmentFunnel(validatedQuery);
  return ApiResponse.success(res, {
    data,
    message: 'Platform recruitment funnel retrieved successfully.'
  });
});

/**
 * GET /api/admin/analytics/export
 * Download platform analytics as a secure CSV file
 */
const exportAdminReport = asyncHandler(async (req, res) => {
  const validatedQuery = adminExportQuerySchema.parse(req.query);
  const csvContent = await analyticsService.exportAdminReport(validatedQuery);
  const filename = `hireconnect_admin_${validatedQuery.type}_${Date.now()}.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.status(200).send(csvContent);
});

// ============================================================================
// PART C: RECRUITER ANALYTICS
// ============================================================================

/**
 * GET /api/recruiter/analytics/overview
 * Recruiter dashboard overview scoped to authorized jobs
 */
const getRecruiterOverview = asyncHandler(async (req, res) => {
  const validatedQuery = analyticsDateRangeSchema.parse(req.query);
  const data = await analyticsService.getRecruiterOverview(req.user, validatedQuery);
  return ApiResponse.success(res, {
    data,
    message: 'Recruiter analytics overview retrieved successfully.'
  });
});

/**
 * GET /api/recruiter/analytics/jobs
 * Job performance comparison table with pagination and sorting
 */
const getRecruiterJobsAnalytics = asyncHandler(async (req, res) => {
  const validatedQuery = recruiterJobsAnalyticsQuerySchema.parse(req.query);
  const data = await analyticsService.getRecruiterJobsAnalytics(req.user, validatedQuery);
  return ApiResponse.success(res, {
    data,
    message: 'Recruiter job performance analytics retrieved successfully.'
  });
});

/**
 * GET /api/recruiter/analytics/jobs/:jobId/funnel
 * Single job recruitment funnel with stage drop-off analysis
 */
const getRecruiterJobFunnel = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const data = await analyticsService.getRecruiterJobFunnel(req.user, jobId);
  return ApiResponse.success(res, {
    data,
    message: 'Job recruitment funnel retrieved successfully.'
  });
});

/**
 * GET /api/recruiter/analytics/jobs/export
 * Export recruiter jobs performance as CSV
 */
const exportRecruiterJobsReport = asyncHandler(async (req, res) => {
  const validatedQuery = recruiterExportQuerySchema.parse(req.query);
  const csvContent = await analyticsService.exportRecruiterJobsReport(req.user, validatedQuery);
  const filename = `hireconnect_recruiter_jobs_${Date.now()}.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.status(200).send(csvContent);
});

// ============================================================================
// PART D: COMPANY ANALYTICS
// ============================================================================

/**
 * GET /api/companies/:companyId/analytics
 * Company-scoped metrics accessible only by authorized company members or admins
 */
const getCompanyAnalytics = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  const userId = (req.user._id || req.user.id).toString();

  // Authorization check: Must be an admin OR an active member of this company
  if (req.user.role !== 'admin') {
    if (req.user.role === 'candidate' || req.user.role === 'employee') {
      throw ApiError.forbidden('Forbidden: Candidates cannot access company analytics.');
    }

    const company = await Company.findById(companyId);
    if (!company) {
      throw ApiError.notFound('Company not found.');
    }

    const realCompanyId = company._id || company.id;
    const membership = await CompanyMembership.findOne({
      company: realCompanyId,
      user: userId,
      status: 'active'
    });

    if (!membership) {
      const isCreator = company.createdBy && (company.createdBy._id || company.createdBy).toString() === userId;
      if (!isCreator) {
        throw ApiError.forbidden('Forbidden: You are not an active member of this company.');
      }
    }
  }

  const validatedQuery = analyticsDateRangeSchema.parse(req.query);
  const data = await analyticsService.getCompanyAnalytics(companyId, validatedQuery);
  return ApiResponse.success(res, {
    data,
    message: 'Company analytics retrieved successfully.'
  });
});

// ============================================================================
// PART E: CANDIDATE ACTIVITY ANALYTICS
// ============================================================================

/**
 * GET /api/candidate/analytics/overview
 * (and /api/candidates/me/analytics alias)
 * Candidate personal recruitment statistics scoped exclusively to the requester
 */
const getCandidateOverview = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const data = await analyticsService.getCandidateOverview(userId);
  return ApiResponse.success(res, {
    data,
    message: 'Candidate personal activity analytics retrieved successfully.'
  });
});

module.exports = {
  getAdminOverview,
  getAdminRecruitmentFunnel,
  exportAdminReport,
  getRecruiterOverview,
  getRecruiterJobsAnalytics,
  getRecruiterJobFunnel,
  exportRecruiterJobsReport,
  getCompanyAnalytics,
  getCandidateOverview
};
