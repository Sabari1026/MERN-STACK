/**
 * Input Validators for Talent Match & Matching Engine
 * Built with Zod to enforce query integrity and prevent injection.
 */

const { z } = require('zod');

const candidateJobMatchQuerySchema = z.object({
  workMode: z.string().trim().optional().default('all'),
  location: z.string().trim().optional().default('all'),
  employmentType: z.string().trim().optional().default('all'),
  minScore: z.string().trim().optional().default('0'),
  savedOnly: z.preprocess((val) => val === true || val === 'true', z.boolean().optional().default(false)),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12)
});

const recruiterCandidateMatchQuerySchema = z.object({
  jobId: z.string().trim().optional(),
  minScore: z.string().trim().optional().default('0'),
  shortlistedOnly: z.preprocess((val) => val === true || val === 'true', z.boolean().optional().default(false)),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12)
});

module.exports = {
  candidateJobMatchQuerySchema,
  recruiterCandidateMatchQuerySchema
};
