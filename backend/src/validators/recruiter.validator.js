/**
 * Recruiter Profile Input Validators for HireConnect
 * Built with Zod to enforce strict schema integrity and protect company permissions.
 */

const { z } = require('zod');

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((val) => !val || /^https?:\/\/.+/i.test(val), {
    message: 'Must be a valid URL starting with http:// or https://'
  });

// Main recruiter profile update schema (PATCH semantics)
const updateRecruiterProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  jobTitle: z.string().trim().max(120).optional(),
  title: z.string().trim().max(120).optional(), // Alias for jobTitle
  department: z.string().trim().max(120).optional(),
  professionalSummary: z.string().trim().max(2000).optional(),
  bio: z.string().trim().max(2000).optional(), // Alias for professionalSummary
  phone: z.string().trim().max(30).optional(),
  location: z.string().trim().max(100).optional(),
  linkedinUrl: optionalUrl,
  linkedin: optionalUrl, // Alias for linkedinUrl
  avatarUrl: optionalUrl.or(z.literal(''))
});

module.exports = {
  updateRecruiterProfileSchema
};
