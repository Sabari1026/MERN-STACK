/**
 * Job Input Validators for HireConnect
 * Built with Zod to enforce strict schema integrity, URL hygiene, and lifecycle sanity.
 */

const { z } = require('zod');

// Safe HTTP/HTTPS URL validator blocking dangerous protocols (javascript:, data:, vbscript:, etc.)
const safeHttpUrl = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (!val) return true;
      try {
        const parsed = new URL(val);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch (e) {
        return false;
      }
    },
    {
      message: 'Must be a valid URL starting with http:// or https://'
    }
  );

const optionalSafeHttpUrl = z
  .string()
  .trim()
  .optional()
  .nullable()
  .refine(
    (val) => {
      if (!val) return true;
      try {
        const parsed = new URL(val);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch (e) {
        return false;
      }
    },
    {
      message: 'Must be a valid URL starting with http:// or https://'
    }
  );

const screeningQuestionItemSchema = z.union([
  z.string().trim().min(1).transform(q => ({ question: q, required: false, type: 'text', options: [] })),
  z.object({
    id: z.string().optional(),
    question: z.string().trim().min(1),
    required: z.boolean().optional().default(false),
    type: z.string().optional().default('text'),
    options: z.array(z.string().trim()).optional().default([])
  })
]);

const createJobSchema = z
  .object({
    title: z
      .string({ required_error: 'Job title is required' })
      .trim()
      .min(3, 'Job title must be at least 3 characters')
      .max(150, 'Job title cannot exceed 150 characters'),
    company: z.string().trim().optional(),
    companyId: z.string().trim().optional(),
    description: z
      .string()
      .trim()
      .optional()
      .default('Join our high-impact engineering team to build scalable, mission-critical products.')
      .refine((val) => !val || val.length >= 10, { message: 'Job description must be at least 10 characters' }),
    shortDescription: z.string().trim().max(300).optional().default(''),
    department: z.string().trim().max(100).optional().default('Engineering'),
    category: z.string().trim().max(50).optional().default('fullstack'),
    employmentType: z
      .string()
      .trim()
      .optional()
      .default('full-time')
      .transform((val) => (val || 'full-time').toLowerCase()),
    workMode: z
      .string()
      .trim()
      .optional()
      .default('hybrid')
      .transform((val) => {
        const lower = (val || 'hybrid').toLowerCase();
        if (lower === 'on-site') return 'onsite';
        return lower;
      }),
    location: z.string().trim().max(150).optional().default('Bengaluru, Karnataka'),
    city: z.string().trim().max(100).optional().default(''),
    state: z.string().trim().max(100).optional().default(''),
    country: z.string().trim().max(100).optional().default('India'),
    experienceMin: z.coerce.number().min(0, 'Minimum experience cannot be negative').optional().default(0),
    experienceMax: z.coerce.number().min(0, 'Maximum experience cannot be negative').optional().nullable(),
    experienceLevel: z
      .enum(['entry', 'junior', 'mid', 'senior', 'lead', 'executive'])
      .optional()
      .default('mid'),
    experience: z.string().trim().max(50).optional(),
    salaryMin: z.coerce.number().min(0, 'Minimum salary cannot be negative').optional().nullable(),
    salaryMax: z.coerce.number().min(0, 'Maximum salary cannot be negative').optional().nullable(),
    salaryCurrency: z.string().trim().max(10).optional().default('INR'),
    salaryPeriod: z.enum(['annual', 'monthly', 'hourly']).optional().default('annual'),
    salaryDisclosure: z.enum(['disclosed', 'undisclosed']).optional().default('disclosed'),
    salaryDisclosed: z.boolean().optional(),
    salary: z.string().trim().max(100).optional(),
    requiredSkills: z.array(z.string().trim().max(50)).optional().default([]),
    skills: z.array(z.string().trim().max(50)).optional().default([]),
    preferredSkills: z.array(z.string().trim().max(50)).optional().default([]),
    responsibilities: z.array(z.string().trim().max(500)).optional().default([]),
    requirements: z.array(z.string().trim().max(500)).optional().default([]),
    perks: z.array(z.string().trim().max(200)).optional().default([]),
    benefits: z.array(z.string().trim().max(200)).optional().default([]),
    screeningQuestions: z.array(screeningQuestionItemSchema).optional().default([]),
    applicationMethod: z.enum(['internal', 'external']).optional().default('internal'),
    externalApplicationUrl: optionalSafeHttpUrl,
    applyUrl: optionalSafeHttpUrl,
    source: z.string().trim().max(100).optional().default('HireConnect Verified Employer'),
    applicationDeadline: z.coerce.date().optional().nullable(),
    deadline: z.string().trim().optional().nullable(),
    openingsCount: z.coerce.number().int().min(1).optional().default(1),
    status: z.enum(['draft', 'published', 'closed', 'paused']).optional().default('draft')
  })
  .refine(
    (data) => {
      if (data.experienceMin != null && data.experienceMax != null) {
        return data.experienceMax >= data.experienceMin;
      }
      return true;
    },
    {
      message: 'Maximum experience must be greater than or equal to minimum experience',
      path: ['experienceMax']
    }
  )
  .refine(
    (data) => {
      if (data.salaryMin != null && data.salaryMax != null) {
        return data.salaryMax >= data.salaryMin;
      }
      return true;
    },
    {
      message: 'Maximum salary must be greater than or equal to minimum salary',
      path: ['salaryMax']
    }
  )
  .refine(
    (data) => {
      if (data.applicationMethod === 'external') {
        const url = data.externalApplicationUrl || data.applyUrl;
        return Boolean(url && url.length > 0);
      }
      return true;
    },
    {
      message: 'External application URL is required when application method is external',
      path: ['externalApplicationUrl']
    }
  );

// Update Job: Strict allowlist. Cannot overwrite company or createdBy.
const updateJobSchema = z
  .object({
    title: z.string().trim().min(3).max(150).optional(),
    description: z.string().trim().min(20).max(20000).optional(),
    shortDescription: z.string().trim().max(300).optional(),
    department: z.string().trim().max(100).optional(),
    category: z.string().trim().max(50).optional(),
    employmentType: z
      .string()
      .trim()
      .optional()
      .transform((val) => (val ? val.toLowerCase() : undefined)),
    workMode: z
      .string()
      .trim()
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        const lower = val.toLowerCase();
        if (lower === 'on-site') return 'onsite';
        return lower;
      }),
    location: z.string().trim().max(150).optional(),
    city: z.string().trim().max(100).optional(),
    state: z.string().trim().max(100).optional(),
    country: z.string().trim().max(100).optional(),
    experienceMin: z.coerce.number().min(0).optional(),
    experienceMax: z.coerce.number().min(0).optional().nullable(),
    experienceLevel: z.enum(['entry', 'junior', 'mid', 'senior', 'lead', 'executive']).optional(),
    experience: z.string().trim().max(50).optional(),
    salaryMin: z.coerce.number().min(0).optional().nullable(),
    salaryMax: z.coerce.number().min(0).optional().nullable(),
    salaryCurrency: z.string().trim().max(10).optional(),
    salaryPeriod: z.enum(['annual', 'monthly', 'hourly']).optional(),
    salaryDisclosure: z.enum(['disclosed', 'undisclosed']).optional(),
    salaryDisclosed: z.boolean().optional(),
    salary: z.string().trim().max(100).optional(),
    requiredSkills: z.array(z.string().trim().max(50)).optional(),
    skills: z.array(z.string().trim().max(50)).optional(),
    preferredSkills: z.array(z.string().trim().max(50)).optional(),
    responsibilities: z.array(z.string().trim().max(500)).optional(),
    requirements: z.array(z.string().trim().max(500)).optional(),
    perks: z.array(z.string().trim().max(200)).optional(),
    benefits: z.array(z.string().trim().max(200)).optional(),
    screeningQuestions: z.array(screeningQuestionItemSchema).optional(),
    applicationMethod: z.enum(['internal', 'external']).optional(),
    externalApplicationUrl: optionalSafeHttpUrl,
    applyUrl: optionalSafeHttpUrl,
    applicationDeadline: z.coerce.date().optional().nullable(),
    deadline: z.string().trim().optional().nullable(),
    openingsCount: z.coerce.number().int().min(1).optional(),
    status: z.enum(['draft', 'published', 'closed', 'paused']).optional()
  })
  .refine(
    (data) => {
      if (data.experienceMin != null && data.experienceMax != null) {
        return data.experienceMax >= data.experienceMin;
      }
      return true;
    },
    {
      message: 'Maximum experience must be greater than or equal to minimum experience',
      path: ['experienceMax']
    }
  )
  .refine(
    (data) => {
      if (data.salaryMin != null && data.salaryMax != null) {
        return data.salaryMax >= data.salaryMin;
      }
      return true;
    },
    {
      message: 'Maximum salary must be greater than or equal to minimum salary',
      path: ['salaryMax']
    }
  );

// Search Query Schema for Public Job Discovery
const searchJobsSchema = z.object({
  q: z.string().trim().max(100).optional().default(''),
  keyword: z.string().trim().max(100).optional(),
  location: z.string().trim().max(100).optional().default(''),
  workMode: z.string().trim().max(30).optional().default('all'),
  employmentType: z.string().trim().max(30).optional().default('all'),
  category: z.string().trim().max(50).optional().default('all'),
  experience: z.string().trim().max(50).optional().default('all'),
  experienceMin: z.coerce.number().min(0).optional(),
  experienceMax: z.coerce.number().min(0).optional(),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  company: z.string().trim().max(100).optional(),
  companyId: z.string().trim().max(100).optional(),
  sort: z.enum(['newest', 'salary_desc', 'salary_asc', 'experience_asc', 'title_asc']).optional().default('newest'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(9)
});

module.exports = {
  createJobSchema,
  updateJobSchema,
  searchJobsSchema,
  safeHttpUrl
};
