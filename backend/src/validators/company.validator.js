/**
 * Company Management & Verification Input Validators for HireConnect
 * Built with Zod to enforce strict schema integrity, URL hygiene, and protect against mass-assignment.
 */

const { z } = require('zod');

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((val) => !val || /^https?:\/\/.+/i.test(val), {
    message: 'Must be a valid URL starting with http:// or https://'
  });

const headquartersSchema = z.union([
  z.string().trim().max(120),
  z.object({
    city: z.string().trim().max(100).optional().default(''),
    state: z.string().trim().max(100).optional().default(''),
    country: z.string().trim().max(100).optional().default('India')
  })
]);

const socialLinksSchema = z
  .object({
    linkedin: optionalUrl,
    twitter: optionalUrl,
    github: optionalUrl,
    youtube: optionalUrl
  })
  .optional();

const createCompanySchema = z.object({
  name: z.string({ required_error: 'Company name is required' }).trim().min(2, 'Name must be at least 2 characters').max(120),
  website: optionalUrl,
  industry: z.string().trim().max(100).optional().default('Technology'),
  category: z.string().trim().max(100).optional(),
  description: z.string().trim().max(3000).optional().default(''),
  culture: z.string().trim().max(2000).optional().default(''),
  companySize: z.string().trim().max(50).optional().default('51-200 employees'),
  teamSize: z.string().trim().max(50).optional(),
  foundedYear: z.string().trim().max(10).optional().default(''),
  headquarters: headquartersSchema.optional(),
  locations: z.array(z.string().trim().max(100)).max(20).optional().default(['Bengaluru, Karnataka']),
  workModes: z.array(z.string().trim().max(30)).max(10).optional().default(['Hybrid']),
  techStack: z.array(z.string().trim().max(60)).max(30).optional().default([]),
  benefits: z.array(z.string().trim().max(150)).max(30).optional().default([]),
  contactEmail: z.string().trim().email('Invalid contact email').optional(),
  publicContactEmail: z.string().trim().email('Invalid public email').optional(),
  publicPhone: z.string().trim().max(30).optional(),
  socialLinks: socialLinksSchema
});

// Update Company: STRICT ALLOWLIST. Cannot update verificationStatus, verifiedBy, or ownership fields.
const updateCompanySchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    description: z.string().trim().max(3000).optional(),
    culture: z.string().trim().max(2000).optional(),
    website: optionalUrl,
    industry: z.string().trim().max(100).optional(),
    category: z.string().trim().max(100).optional(),
    companySize: z.string().trim().max(50).optional(),
    teamSize: z.string().trim().max(50).optional(),
    foundedYear: z.string().trim().max(10).optional(),
    headquarters: headquartersSchema.optional(),
    locations: z.array(z.string().trim().max(100)).max(20).optional(),
    workModes: z.array(z.string().trim().max(30)).max(10).optional(),
    techStack: z.array(z.string().trim().max(60)).max(30).optional(),
    benefits: z.array(z.string().trim().max(150)).max(30).optional(),
    publicContactEmail: z.string().trim().email('Invalid email').or(z.literal('')).optional(),
    publicPhone: z.string().trim().max(30).optional(),
    socialLinks: socialLinksSchema
  })
  .strict();

const verificationRequestSchema = z.object({
  officialEmail: z.string({ required_error: 'Official corporate email is required' }).trim().email('Must be a valid corporate email'),
  website: optionalUrl,
  businessRegistrationNumber: z.string().trim().max(60).optional().default(''),
  contactPhone: z.string().trim().max(30).optional().default('')
});

const reviewVerificationSchema = z.object({
  status: z.enum(['under_review', 'verified', 'rejected', 'suspended'], {
    required_error: 'Review status is required'
  }),
  reviewerNotes: z.string().trim().max(1000).optional().default(''),
  verificationMethod: z.enum(['domain_email', 'business_registration', 'manual_audit', 'admin_override']).optional().default('manual_audit')
});

const inviteMemberSchema = z.object({
  email: z.string({ required_error: 'Member email is required' }).trim().email('Invalid email address'),
  role: z.enum(['admin', 'recruiter', 'hiring_manager'], {
    required_error: 'Membership role is required'
  }).default('recruiter')
});

const updateMemberRoleSchema = z.object({
  membershipRole: z.enum(['owner', 'admin', 'recruiter', 'hiring_manager'], {
    required_error: 'Valid membership role is required'
  })
});

module.exports = {
  createCompanySchema,
  updateCompanySchema,
  verificationRequestSchema,
  reviewVerificationSchema,
  inviteMemberSchema,
  updateMemberRoleSchema
};
