/**
 * Analytics Request Validators for HireConnect (Phase 11)
 * Zod schemas for date ranges, periods, filters, sorting, and CSV export parameters.
 */

const { z } = require('zod');

const dateRangeRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;

/**
 * Validates date range parameters for analytics queries
 */
const analyticsDateRangeSchema = z
  .object({
    period: z.enum(['7d', '30d', '90d', 'custom']).optional().default('30d'),
    startDate: z
      .string()
      .regex(dateRangeRegex, { message: 'startDate must be a valid ISO-8601 date (YYYY-MM-DD)' })
      .optional(),
    endDate: z
      .string()
      .regex(dateRangeRegex, { message: 'endDate must be a valid ISO-8601 date (YYYY-MM-DD)' })
      .optional()
  })
  .refine(
    (data) => {
      if (data.period === 'custom') {
        if (!data.startDate || !data.endDate) return false;
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
        if (start > end) return false;
        // Maximum span 365 days
        const diffDays = (end - start) / (1000 * 60 * 60 * 24);
        if (diffDays > 365) return false;
      }
      return true;
    },
    {
      message: 'For custom period, both startDate and endDate are required, startDate must precede endDate, and range must not exceed 365 days.'
    }
  );

/**
 * Validates recruitment funnel query parameters
 */
const recruitmentFunnelQuerySchema = analyticsDateRangeSchema.and(
  z.object({
    jobId: z.string().trim().optional(),
    companyId: z.string().trim().optional()
  })
);

/**
 * Validates admin CSV export options
 */
const adminExportQuerySchema = analyticsDateRangeSchema.and(
  z.object({
    type: z.enum(['platform_summary', 'users_summary', 'jobs_summary', 'applications_funnel']).default('platform_summary')
  })
);

/**
 * Validates recruiter jobs analytics table query
 */
const recruiterJobsAnalyticsQuerySchema = analyticsDateRangeSchema.and(
  z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    sort: z.enum(['totalApplications:desc', 'totalApplications:asc', 'createdAt:desc', 'createdAt:asc', 'title:asc']).default('totalApplications:desc'),
    status: z.enum(['all', 'published', 'draft', 'closed', 'paused']).default('all')
  })
);

/**
 * Validates recruiter export options
 */
const recruiterExportQuerySchema = analyticsDateRangeSchema.and(
  z.object({
    type: z.enum(['jobs_performance', 'applications_summary']).default('jobs_performance')
  })
);

module.exports = {
  analyticsDateRangeSchema,
  recruitmentFunnelQuerySchema,
  adminExportQuerySchema,
  recruiterJobsAnalyticsQuerySchema,
  recruiterExportQuerySchema
};
