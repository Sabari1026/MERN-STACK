/**
 * Validation Schemas for Administrative Endpoints (Phase 10)
 * Uses Zod to validate administrative queries, actions, status transitions, and filters.
 */

const { z } = require('zod');

// Query schema for user listing
const listUsersQuerySchema = z.object({
  page: z.string().optional().default('1').transform(v => Math.max(1, parseInt(v, 10) || 1)),
  limit: z.string().optional().default('20').transform(v => Math.min(100, Math.max(1, parseInt(v, 10) || 20))),
  role: z.enum(['candidate', 'recruiter', 'admin', 'all']).optional(),
  status: z.enum(['active', 'suspended', 'pending_verification', 'deactivated', 'all']).optional(),
  search: z.string().trim().max(100).optional(),
  sortBy: z.enum(['createdAt', 'name', 'email', 'lastLoginAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

// Update user status
const updateUserStatusSchema = z.object({
  status: z.enum(['active', 'suspended'], {
    required_error: 'Status must be specified as active or suspended.'
  }),
  reason: z.string().trim().max(500).optional().default('')
});

// Update user role
const updateUserRoleSchema = z.object({
  role: z.enum(['candidate', 'recruiter', 'admin'], {
    required_error: 'Role must be candidate, recruiter, or admin.'
  }),
  reason: z.string().trim().max(500).optional().default('')
});

// Query schema for company listing
const listCompaniesQuerySchema = z.object({
  page: z.string().optional().default('1').transform(v => Math.max(1, parseInt(v, 10) || 1)),
  limit: z.string().optional().default('20').transform(v => Math.min(100, Math.max(1, parseInt(v, 10) || 20))),
  verificationStatus: z.enum(['pending', 'under_review', 'verified', 'rejected', 'suspended', 'all']).optional(),
  search: z.string().trim().max(100).optional(),
  industry: z.string().trim().max(100).optional()
});

// Review company verification
const reviewCompanyVerificationSchema = z.object({
  status: z.enum(['verified', 'rejected', 'suspended', 'under_review'], {
    required_error: 'Status must be verified, rejected, suspended, or under_review.'
  }),
  reason: z.string().trim().max(1000).optional().default(''),
  notes: z.string().trim().max(1000).optional().default('')
});

// Query schema for job listing
const listJobsQuerySchema = z.object({
  page: z.string().optional().default('1').transform(v => Math.max(1, parseInt(v, 10) || 1)),
  limit: z.string().optional().default('20').transform(v => Math.min(100, Math.max(1, parseInt(v, 10) || 20))),
  status: z.enum(['draft', 'published', 'closed', 'paused', 'all']).optional(),
  moderationStatus: z.enum(['approved', 'flagged', 'removed', 'all']).optional(),
  search: z.string().trim().max(100).optional(),
  companyId: z.string().trim().optional()
});

// Moderate job
const moderateJobSchema = z.object({
  action: z.enum(['remove', 'restore', 'flag'], {
    required_error: 'Moderation action must be remove, restore, or flag.'
  }),
  reason: z.string().trim().min(3, 'A clear moderation reason of at least 3 characters is required.').max(1000)
});

// Close job administratively
const adminCloseJobSchema = z.object({
  reason: z.string().trim().max(500).optional().default('Administratively closed by platform management.')
});

// Query schema for audit logs
const listAuditLogsQuerySchema = z.object({
  page: z.string().optional().default('1').transform(v => Math.max(1, parseInt(v, 10) || 1)),
  limit: z.string().optional().default('20').transform(v => Math.min(100, Math.max(1, parseInt(v, 10) || 20))),
  action: z.string().trim().optional(),
  resourceType: z.enum(['user', 'company', 'job', 'verification_request', 'report', 'system']).optional(),
  actorId: z.string().trim().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

module.exports = {
  listUsersQuerySchema,
  updateUserStatusSchema,
  updateUserRoleSchema,
  listCompaniesQuerySchema,
  reviewCompanyVerificationSchema,
  listJobsQuerySchema,
  moderateJobSchema,
  adminCloseJobSchema,
  listAuditLogsQuerySchema
};
