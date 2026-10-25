/**
 * Notification Request Validators for HireConnect (Phase 9)
 */

const { z } = require('zod');

const getNotificationsQuerySchema = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 20)),
  read: z.enum(['true', 'false', 'all']).optional()
});

const updatePreferencesSchema = z.object({
  email: z
    .object({
      applicationStatus: z.boolean().optional(),
      newApplicant: z.boolean().optional(),
      interviewBooked: z.boolean().optional(),
      interviewReminders: z.boolean().optional(),
      jobUpdates: z.boolean().optional(),
      companyVerification: z.boolean().optional()
    })
    .optional(),
  inApp: z
    .object({
      all: z.boolean().optional()
    })
    .optional()
});

module.exports = {
  getNotificationsQuerySchema,
  updatePreferencesSchema
};
