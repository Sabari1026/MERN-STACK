/**
 * Application & Saved Job Input Validators for HireConnect
 * Built with Zod to enforce schema integrity, prevent injection, and protect status workflows.
 */

const { z } = require('zod');

const applyJobSchema = z.object({
  jobId: z.string().trim().optional(),
  coverLetter: z.string().trim().max(5000, 'Cover letter cannot exceed 5000 characters').optional().default(''),
  coverNote: z.string().trim().max(5000, 'Cover note cannot exceed 5000 characters').optional(),
  answers: z
    .array(
      z.object({
        question: z.string().trim().max(500),
        answer: z.string().trim().max(2000)
      })
    )
    .optional()
    .default([]),
  resumeId: z.string().trim().optional()
});

const updateStatusSchema = z.object({
  status: z.preprocess(
    (val) => (val === 'interviewing' ? 'interview' : val),
    z.enum(
      ['applied', 'under_review', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'],
      { required_error: 'Status is required' }
    )
  ),
  reason: z.string().trim().max(500, 'Reason cannot exceed 500 characters').optional().default(''),
  note: z.string().trim().max(1000, 'Internal note cannot exceed 1000 characters').optional()
});

const addNoteSchema = z.object({
  text: z.string({ required_error: 'Note text is required' }).trim().min(1, 'Note cannot be empty').max(2000)
});

const searchApplicationsSchema = z.object({
  status: z.string().trim().optional().default('all'),
  search: z.string().trim().optional().default(''),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  sort: z.enum(['newest', 'oldest', 'status_updated']).optional().default('newest')
});

module.exports = {
  applyJobSchema,
  updateStatusSchema,
  addNoteSchema,
  searchApplicationsSchema
};
