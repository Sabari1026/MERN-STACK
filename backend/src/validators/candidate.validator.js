/**
 * Candidate Profile Input Validators for HireConnect
 * Built with Zod to enforce strict schema integrity, safe URLs, and date logic.
 */

const { z } = require('zod');

// Helper for optional or empty URL string
const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((val) => !val || /^https?:\/\/.+/i.test(val), {
    message: 'Must be a valid URL starting with http:// or https://'
  });

// Skill entry schema (accepts either simple strings or structured skill objects)
const skillItemSchema = z.union([
  z.string().trim().min(1).max(60).transform((name) => ({ name, level: 'Advanced', category: 'General' })),
  z.object({
    name: z.string({ required_error: 'Skill name is required' }).trim().min(1).max(60),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).default('Advanced'),
    category: z.string().trim().max(60).optional().default('General')
  })
]);

// Education entry schema
const educationItemSchema = z.preprocess(
  (val) => {
    if (val && typeof val === 'object') {
      const qualification = val.qualification || val.degree || 'Degree';
      return {
        ...val,
        qualification,
        degree: val.degree || qualification
      };
    }
    return val;
  },
  z.object({
    institution: z.string({ required_error: 'Institution name is required' }).trim().min(1).max(120),
    qualification: z.string().trim().max(100).optional().default(''),
    degree: z.string().trim().optional(),
    fieldOfStudy: z.string().trim().max(100).optional().default(''),
    year: z.string().or(z.number()).optional(),
    startDate: z.string().or(z.date()).optional(),
    endDate: z.string().or(z.date()).optional(),
    isCurrent: z.boolean().optional().default(false),
    grade: z.string().trim().max(50).optional().default('')
  })
).refine(
  (data) => {
    if (data.startDate && data.endDate && !data.isCurrent) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (!isNaN(start) && !isNaN(end)) {
        return end >= start;
      }
    }
    return true;
  },
  {
    message: 'Education end date cannot be earlier than start date.'
  }
);

// Experience entry schema
const experienceItemSchema = z.preprocess(
  (val) => {
    if (val && typeof val === 'object') {
      const employer = val.employer || val.company || 'Company';
      const jobTitle = val.jobTitle || val.title || 'Role';
      let startDate = val.startDate;
      if (!startDate) {
        startDate = val.dates ? val.dates.split('—')[0].trim() : '2023-01-01';
      }
      return {
        ...val,
        employer,
        company: val.company || employer,
        jobTitle,
        title: val.title || jobTitle,
        startDate
      };
    }
    return val;
  },
  z.object({
    employer: z.string().trim().min(1).max(120).optional().default('Company'),
    company: z.string().trim().optional(),
    jobTitle: z.string().trim().min(1).max(100).optional().default('Role'),
    title: z.string().trim().optional(),
    employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']).default('full-time'),
    location: z.string().trim().max(100).optional().default(''),
    startDate: z.string().or(z.date()).optional().default('2023-01-01'),
    endDate: z.string().or(z.date()).optional(),
    current: z.boolean().optional(),
    isCurrent: z.boolean().optional().default(false),
    description: z.string().trim().max(2000).optional().default('')
  })
).refine(
  (data) => {
    if (data.startDate && data.endDate && !data.isCurrent && !data.current) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (!isNaN(start) && !isNaN(end)) {
        return end >= start;
      }
    }
    return true;
  },
  {
    message: 'Work experience end date cannot be earlier than start date.'
  }
);

// Project entry schema
const projectItemSchema = z.object({
  title: z.string({ required_error: 'Project title is required' }).trim().min(1).max(120),
  description: z.string().trim().max(2000).optional().default(''),
  technologies: z.array(z.string().trim()).max(20).optional().default([]),
  projectUrl: optionalUrl,
  githubUrl: optionalUrl,
  liveUrl: optionalUrl
});

// Certification entry schema
const certificationItemSchema = z.object({
  name: z.string({ required_error: 'Certificate name is required' }).trim().min(1).max(120),
  issuer: z.string().trim().max(120).optional().default(''),
  date: z.string().trim().max(60).optional().default(''),
  credentialId: z.string().trim().max(100).optional().default(''),
  credentialUrl: optionalUrl
});

// Privacy settings schema
const privacySchema = z.object({
  isDiscoverable: z.boolean().optional(),
  allowResumeDownload: z.boolean().optional(),
  hideContactInfo: z.boolean().optional()
});

// Main candidate profile update schema (PATCH semantics)
const updateCandidateProfileSchema = z.object({
  headline: z.string().trim().max(200).optional(),
  summary: z.string().trim().max(2000).optional(),
  name: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().max(30).optional(),
  contactEmail: z.string().trim().email().optional().or(z.literal('')),
  location: z.string().trim().max(100).optional(),
  preferredLocations: z.array(z.string().trim()).max(20).optional(),
  preferredWorkModes: z.array(z.enum(['remote', 'hybrid', 'onsite'])).max(3).optional(),
  preferredEmploymentTypes: z.array(z.enum(['full-time', 'part-time', 'contract', 'internship'])).max(4).optional(),
  desiredTitles: z.array(z.string().trim()).max(10).optional(),
  expectedSalary: z.string().trim().max(60).optional(),
  noticePeriod: z.enum(['Immediate', '15 Days', '30 Days', '60 Days', '90 Days']).optional(),
  skills: z.array(skillItemSchema).max(50).optional(),
  education: z.array(educationItemSchema).max(20).optional(),
  experience: z.array(experienceItemSchema).max(30).optional(),
  projects: z.array(projectItemSchema).max(30).optional(),
  certifications: z.array(certificationItemSchema).max(30).optional(),
  portfolioUrl: optionalUrl,
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  avatarUrl: optionalUrl.or(z.literal('')),
  resumeVisibility: z.enum(['private', 'verified_recruiters', 'public']).optional(),
  discoverability: z.boolean().optional(),
  profileVisibility: z.enum(['private', 'verified_recruiters', 'public']).optional(),
  hideContactInfo: z.boolean().optional(),
  privacy: privacySchema.optional()
});

module.exports = {
  updateCandidateProfileSchema,
  skillItemSchema,
  educationItemSchema,
  experienceItemSchema,
  projectItemSchema,
  certificationItemSchema
};
