/**
 * Dedicated Matching Service for HireConnect (Phase 7)
 * Implements a transparent, deterministic, explainable 6-factor weighted algorithm:
 * 1. Required and preferred skills: 40%
 * 2. Relevant experience: 20%
 * 3. Location and work-mode compatibility: 15%
 * 4. Employment type and work preferences: 10%
 * 5. Education and qualifications: 10%
 * 6. Candidate career preferences and job alignment: 5%
 * Total: 100%
 */

const Job = require('../models/job.model');
const CandidateProfile = require('../models/candidateProfile.model');
const RecruiterProfile = require('../models/recruiterProfile.model');
const Company = require('../models/company.model');
const CompanyMembership = require('../models/companyMembership.model');
const SavedJob = require('../models/savedJob.model');
const Application = require('../models/application.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

// Central configurable matching factor weights (Sum = 100%)
const DEFAULT_WEIGHTS = {
  skills: 40,
  experience: 20,
  locationWorkMode: 15,
  employmentPreferences: 10,
  education: 10,
  careerAlignment: 5
};

// Skill aliases map for standardizing common tech stack terminology
const SKILL_ALIASES = {
  'js': 'javascript',
  'ts': 'typescript',
  'es6': 'javascript',
  'react': 'react',
  'reactjs': 'react',
  'react.js': 'react',
  'node': 'nodejs',
  'nodejs': 'nodejs',
  'node.js': 'nodejs',
  'express': 'expressjs',
  'expressjs': 'expressjs',
  'express.js': 'expressjs',
  'mongo': 'mongodb',
  'mongodb': 'mongodb',
  'postgres': 'postgresql',
  'postgresql': 'postgresql',
  'psql': 'postgresql',
  'k8s': 'kubernetes',
  'kubernetes': 'kubernetes',
  'docker': 'docker',
  'py': 'python',
  'python': 'python',
  'golang': 'go',
  'go': 'go',
  'aws': 'aws',
  'amazon web services': 'aws',
  'gcp': 'gcp',
  'google cloud': 'gcp',
  'azure': 'azure',
  'microsoft azure': 'azure',
  'html': 'html',
  'html5': 'html',
  'css': 'css',
  'css3': 'css',
  'vue': 'vue',
  'vuejs': 'vue',
  'vue.js': 'vue',
  'angular': 'angular',
  'angularjs': 'angular',
  'next': 'nextjs',
  'nextjs': 'nextjs',
  'next.js': 'nextjs',
  'graphql': 'graphql',
  'rest': 'rest api',
  'restful': 'rest api',
  'rest api': 'rest api',
  'ci/cd': 'cicd',
  'cicd': 'cicd',
  'system design': 'system design',
  'microservices': 'microservices',
  'distributed systems': 'distributed systems',
  'tailwind': 'tailwindcss',
  'tailwindcss': 'tailwindcss',
  'redux': 'redux',
  'kafka': 'apache kafka',
  'apache kafka': 'apache kafka',
  'redis': 'redis',
  'sql': 'sql',
  'nosql': 'nosql'
};

class MatchingService {
  constructor(weights = DEFAULT_WEIGHTS) {
    this.weights = { ...weights };
  }

  /**
   * Normalize skill string for accurate canonical comparison
   */
  normalizeSkill(skill) {
    if (!skill || typeof skill !== 'string') return '';
    const clean = skill
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');
    return SKILL_ALIASES[clean] || clean;
  }

  /**
   * Extract flat array of candidate skills from string or object representations
   */
  extractCandidateSkills(profile) {
    if (!profile || !profile.skills || !Array.isArray(profile.skills)) return [];
    return profile.skills
      .map(s => {
        if (typeof s === 'string') return s;
        if (s && typeof s === 'object' && s.name) return s.name;
        return '';
      })
      .filter(Boolean);
  }

  /**
   * Calculate non-overlapping cumulative years of work experience
   */
  calculateExperienceYears(profile) {
    if (typeof profile.experienceYears === 'number' && profile.experienceYears >= 0) {
      return profile.experienceYears;
    }

    if (!profile.experience || !Array.isArray(profile.experience) || profile.experience.length === 0) {
      return null;
    }

    // Merge overlapping intervals to avoid double-counting concurrent roles
    const intervals = [];
    for (const exp of profile.experience) {
      if (!exp.startDate) continue;
      const start = new Date(exp.startDate).getTime();
      const end = exp.endDate ? new Date(exp.endDate).getTime() : Date.now();
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        intervals.push([start, end]);
      }
    }

    if (intervals.length === 0) return null;

    intervals.sort((a, b) => a[0] - b[0]);

    const merged = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
      const current = intervals[i];
      const last = merged[merged.length - 1];
      if (current[0] <= last[1]) {
        last[1] = Math.max(last[1], current[1]);
      } else {
        merged.push(current);
      }
    }

    let totalMs = 0;
    for (const [start, end] of merged) {
      totalMs += (end - start);
    }

    // Convert milliseconds to years rounded to 1 decimal place
    const years = totalMs / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, Math.round(years * 10) / 10);
  }

  /**
   * Deterministic Evaluation of 6 Matching Factors between a Candidate and a Job
   */
  evaluateCandidateJobMatch(profile, job, options = {}) {
    if (!profile || !job) {
      throw new Error('Profile and Job objects are required to compute matching score.');
    }

    const candidateSkillsRaw = this.extractCandidateSkills(profile);
    const candidateSkillsNorm = new Set(candidateSkillsRaw.map(s => this.normalizeSkill(s)));

    // Job skills
    const rawRequired = (job.requiredSkills && job.requiredSkills.length > 0)
      ? job.requiredSkills
      : (job.skills || []);
    const rawPreferred = job.preferredSkills || [];

    // Factor 1: Technical & Core Skills (40%)
    let skillsScore = 0;
    let skillsEvidence = false;
    let matchedRequired = [];
    let missingRequired = [];
    let matchedPreferred = [];
    let skillsExplanation = '';

    if (rawRequired.length === 0 && rawPreferred.length === 0) {
      skillsEvidence = false;
      skillsScore = 0;
      skillsExplanation = 'No specific skill requirements specified in the job posting.';
    } else {
      skillsEvidence = true;

      // Evaluate required skills
      for (const skill of rawRequired) {
        const norm = this.normalizeSkill(skill);
        if (candidateSkillsNorm.has(norm)) {
          matchedRequired.push(skill);
        } else {
          missingRequired.push(skill);
        }
      }

      // Evaluate preferred skills
      for (const skill of rawPreferred) {
        const norm = this.normalizeSkill(skill);
        if (candidateSkillsNorm.has(norm)) {
          matchedPreferred.push(skill);
        }
      }

      const reqRatio = rawRequired.length > 0 ? (matchedRequired.length / rawRequired.length) : 1;
      const prefRatio = rawPreferred.length > 0 ? (matchedPreferred.length / rawPreferred.length) : 1;

      if (rawPreferred.length > 0) {
        // 80% weight on required, 20% on preferred
        skillsScore = Math.round(((reqRatio * 0.8) + (prefRatio * 0.2)) * 100);
      } else {
        skillsScore = Math.round(reqRatio * 100);
      }

      if (rawRequired.length > 0) {
        skillsExplanation = `Matches ${matchedRequired.length} of ${rawRequired.length} required skill${rawRequired.length === 1 ? '' : 's'}.`;
        if (matchedRequired.length > 0) {
          skillsExplanation += ` Core matches: ${matchedRequired.slice(0, 4).join(', ')}.`;
        }
        if (missingRequired.length > 0) {
          skillsExplanation += ` Missing: ${missingRequired.slice(0, 3).join(', ')}.`;
        }
      } else {
        skillsExplanation = `Matches ${matchedPreferred.length} of ${rawPreferred.length} preferred skills.`;
      }
    }

    // Factor 2: Relevant Experience (20%)
    let expScore = 0;
    let expEvidence = false;
    let expExplanation = '';

    const candidateExp = this.calculateExperienceYears(profile);

    // Parse job min and max experience
    let minExp = (typeof job.minExperienceYears === 'number')
      ? job.minExperienceYears
      : ((typeof job.experienceMin === 'number') ? job.experienceMin : null);
    let maxExp = (typeof job.maxExperienceYears === 'number')
      ? job.maxExperienceYears
      : ((typeof job.experienceMax === 'number') ? job.experienceMax : null);

    if (minExp === null && job.experience) {
      const matchRange = job.experience.match(/(\d+)\s*[-–]\s*(\d+)/);
      if (matchRange) {
        minExp = parseInt(matchRange[1], 10);
        maxExp = parseInt(matchRange[2], 10);
      } else {
        const matchPlus = job.experience.match(/(\d+)\s*\+/);
        if (matchPlus) {
          minExp = parseInt(matchPlus[1], 10);
        }
      }
    }

    if (candidateExp === null) {
      expEvidence = false;
      expScore = 0;
      expExplanation = 'Experience details not specified on candidate profile.';
    } else if (minExp === null && maxExp === null) {
      expEvidence = false;
      expScore = 0;
      expExplanation = 'No minimum experience requirement specified for this role.';
    } else {
      expEvidence = true;
      const targetMin = minExp !== null ? minExp : 0;
      const targetMax = maxExp !== null ? maxExp : targetMin + 4;

      if (candidateExp >= targetMin && candidateExp <= targetMax) {
        expScore = 100;
        expExplanation = `Your ${candidateExp} year${candidateExp === 1 ? '' : 's'} of experience fits the requested range (${targetMin}–${targetMax} yrs).`;
      } else if (candidateExp > targetMax) {
        expScore = 90;
        expExplanation = `Senior candidate (${candidateExp} yrs) exceeding requested experience level (${targetMin}–${targetMax} yrs).`;
      } else {
        // Candidate below minimum
        const diff = targetMin - candidateExp;
        if (diff <= 1) {
          expScore = 70;
          expExplanation = `Near experience requirement (${candidateExp} yrs vs ${targetMin}+ yrs requested).`;
        } else {
          expScore = 30;
          expExplanation = `Experience level (${candidateExp} yrs) is below requested minimum of ${targetMin} years.`;
        }
      }
    }

    // Factor 3: Location and Work-Mode Compatibility (15%)
    let locScore = 0;
    let locEvidence = false;
    let locExplanation = '';

    const candLoc = (profile.location || '').toLowerCase();
    const candPrefLocs = Array.isArray(profile.preferredLocations)
      ? profile.preferredLocations.map(l => l.toLowerCase())
      : [];
    const candModes = Array.isArray(profile.preferredWorkModes)
      ? profile.preferredWorkModes.map(m => m.toLowerCase())
      : [];
    const jobMode = (job.workMode || 'hybrid').toLowerCase();
    const jobLoc = (job.location || '').toLowerCase();

    if (!candLoc && candPrefLocs.length === 0 && candModes.length === 0) {
      locEvidence = false;
      locScore = 0;
      locExplanation = 'Location and work mode preferences incomplete on profile.';
    } else {
      locEvidence = true;

      if (jobMode === 'remote') {
        const prefersRemote = candModes.includes('remote') || candPrefLocs.some(l => l.includes('remote'));
        if (prefersRemote) {
          locScore = 100;
          locExplanation = 'Full remote opportunity matches your preferred remote work mode.';
        } else {
          locScore = 85;
          locExplanation = 'Remote role available to candidates across India.';
        }
      } else {
        // Hybrid or on-site role
        const modeMatch = (candModes.length === 0 || candModes.includes(jobMode)) ? 100 : 50;

        // Location match check
        let locMatch = 40; // Default base
        const cityKey = (job.city || jobLoc.split(',')[0] || '').trim();

        if (cityKey && (candLoc.includes(cityKey) || candPrefLocs.some(l => l.includes(cityKey)))) {
          locMatch = 100;
        } else if (candLoc.includes('bengaluru') && jobLoc.includes('bengaluru')) {
          locMatch = 100;
        } else if (candLoc.includes('pune') && jobLoc.includes('pune')) {
          locMatch = 100;
        } else if (candLoc.includes('mumbai') && jobLoc.includes('mumbai')) {
          locMatch = 100;
        } else if (candLoc.includes('delhi') && (jobLoc.includes('delhi') || jobLoc.includes('gurugram') || jobLoc.includes('noida'))) {
          locMatch = 100;
        } else if (candLoc.includes('hyderabad') && jobLoc.includes('hyderabad')) {
          locMatch = 100;
        }

        locScore = Math.round((modeMatch * 0.4) + (locMatch * 0.6));
        if (locScore >= 90) {
          locExplanation = `${job.workMode || 'Hybrid'} role in ${job.location || 'India'} directly matches your location preferences.`;
        } else {
          locExplanation = `${job.workMode || 'Hybrid'} role based in ${job.location || 'India'}. Relocation or local travel required.`;
        }
      }
    }

    // Factor 4: Employment Type and Work Preferences (10%)
    let empScore = 0;
    let empEvidence = false;
    let empExplanation = '';

    const candEmpTypes = Array.isArray(profile.preferredEmploymentTypes)
      ? profile.preferredEmploymentTypes.map(t => t.toLowerCase())
      : [];
    const jobEmpType = (job.employmentType || 'full-time').toLowerCase();

    if (candEmpTypes.length === 0) {
      empEvidence = false;
      empScore = 0;
      empExplanation = 'No preferred employment types selected on profile.';
    } else {
      empEvidence = true;
      if (candEmpTypes.includes(jobEmpType)) {
        empScore = 100;
        empExplanation = `Matches your preference for ${jobEmpType} opportunities.`;
      } else {
        empScore = 30;
        empExplanation = `Job is ${jobEmpType}, differing from your specified preferences (${candEmpTypes.join(', ')}).`;
      }
    }

    // Factor 5: Education and Qualifications (10%)
    let eduScore = 0;
    let eduEvidence = false;
    let eduExplanation = '';

    const hasEducationRecords = Array.isArray(profile.education) && profile.education.length > 0;
    const jobRequiresDegree = (job.requirements && job.requirements.some(r => /degree|b\.?e|b\.?tech|bs|ms|master|bachelor/i.test(r))) ||
      Boolean(job.educationRequirement);

    if (!jobRequiresDegree && !hasEducationRecords) {
      eduEvidence = false;
      eduScore = 0;
      eduExplanation = 'No explicit educational requirements specified for this position.';
    } else if (hasEducationRecords) {
      eduEvidence = true;
      eduScore = 100;
      const topEdu = profile.education[0];
      const degreeName = topEdu.qualification || topEdu.degree || topEdu.fieldOfStudy || 'Technical Degree';
      eduExplanation = `Your education (${degreeName}) satisfies professional qualifications.`;
    } else {
      // Job requires degree but candidate has not entered education
      eduEvidence = false;
      eduScore = 0;
      eduExplanation = 'Education details not completed on candidate profile.';
    }

    // Factor 6: Candidate Career Preferences and Job Alignment (5%)
    let careerScore = 0;
    let careerEvidence = false;
    let careerExplanation = '';

    const headline = (profile.headline || '').toLowerCase();
    const desiredTitles = Array.isArray(profile.desiredTitles)
      ? profile.desiredTitles.map(t => t.toLowerCase())
      : [];
    const jobTitle = (job.title || '').toLowerCase();
    const jobCat = (job.category || '').toLowerCase();

    if (!headline && desiredTitles.length === 0) {
      careerEvidence = false;
      careerScore = 0;
      careerExplanation = 'Career goals or headline not specified on profile.';
    } else {
      careerEvidence = true;

      // Check title overlap
      const jobWords = jobTitle.split(/[\s\-_/(),]+/).filter(w => w.length > 3);
      const hasTitleOverlap = desiredTitles.some(t => jobWords.some(w => t.includes(w))) ||
        jobWords.some(w => headline.includes(w)) ||
        (jobCat && (headline.includes(jobCat) || desiredTitles.some(t => t.includes(jobCat))));

      if (hasTitleOverlap) {
        careerScore = 100;
        careerExplanation = `Role domain aligns directly with your career focus as ${profile.headline || 'Engineer'}.`;
      } else {
        careerScore = 60;
        careerExplanation = `General alignment with engineering roles in ${job.category || 'Technology'}.`;
      }
    }

    // =========================================================================
    // Aggregate Weighted Score and Normalized Confidence Breakdown
    // =========================================================================
    const factors = [
      {
        id: 'skills',
        name: 'Technical & Core Skills',
        weight: this.weights.skills,
        score: skillsScore,
        hasEvidence: skillsEvidence,
        state: !skillsEvidence ? 'unknown' : (skillsScore >= 80 ? 'matched' : (skillsScore >= 50 ? 'partially_matched' : 'not_matched')),
        explanation: skillsExplanation
      },
      {
        id: 'experience',
        name: 'Relevant Experience',
        weight: this.weights.experience,
        score: expScore,
        hasEvidence: expEvidence,
        state: !expEvidence ? 'unknown' : (expScore >= 90 ? 'matched' : (expScore >= 70 ? 'partially_matched' : 'not_matched')),
        explanation: expExplanation
      },
      {
        id: 'locationWorkMode',
        name: 'Location & Work Mode',
        weight: this.weights.locationWorkMode,
        score: locScore,
        hasEvidence: locEvidence,
        state: !locEvidence ? 'unknown' : (locScore >= 80 ? 'matched' : (locScore >= 50 ? 'partially_matched' : 'not_matched')),
        explanation: locExplanation
      },
      {
        id: 'employmentPreferences',
        name: 'Employment Type Alignment',
        weight: this.weights.employmentPreferences,
        score: empScore,
        hasEvidence: empEvidence,
        state: !empEvidence ? 'unknown' : (empScore >= 80 ? 'matched' : 'not_matched'),
        explanation: empExplanation
      },
      {
        id: 'education',
        name: 'Education & Qualifications',
        weight: this.weights.education,
        score: eduScore,
        hasEvidence: eduEvidence,
        state: !eduEvidence ? 'unknown' : (eduScore >= 80 ? 'matched' : 'not_matched'),
        explanation: eduExplanation
      },
      {
        id: 'careerAlignment',
        name: 'Career & Domain Alignment',
        weight: this.weights.careerAlignment,
        score: careerScore,
        hasEvidence: careerEvidence,
        state: !careerEvidence ? 'unknown' : (careerScore >= 80 ? 'matched' : 'partially_matched'),
        explanation: careerExplanation
      }
    ];

    // Compute known evidence weight and normalize score
    let totalScoreSum = 0;
    let knownWeightSum = 0;

    for (const factor of factors) {
      if (factor.hasEvidence) {
        totalScoreSum += (factor.score * factor.weight) / 100;
        knownWeightSum += factor.weight;
      }
    }

    // Data completeness (0–100%)
    const dataCompleteness = Math.round(knownWeightSum);

    // Normalized match score scaled against known evidence weight
    let normalizedScore = 0;
    if (knownWeightSum > 0) {
      normalizedScore = Math.min(100, Math.max(0, Math.round((totalScoreSum / knownWeightSum) * 100)));
    }

    // Presentation category
    let category = 'Lower match';
    if (normalizedScore >= 85) {
      category = 'Excellent match';
    } else if (normalizedScore >= 70) {
      category = 'Strong match';
    } else if (normalizedScore >= 50) {
      category = 'Moderate match';
    }

    // Extract human-readable reasons
    const reasons = factors
      .filter(f => f.hasEvidence && f.score >= 50)
      .map(f => f.explanation);

    return {
      matchScore: normalizedScore,
      score: normalizedScore,
      dataCompleteness,
      category,
      matchCategory: category,
      limitedData: dataCompleteness < 60,
      factors,
      matchedSkills: matchedRequired.concat(matchedPreferred),
      missingSkills: missingRequired,
      reasons,
      summaryExplanation: reasons.length > 0 ? reasons[0] : 'Profile evidence evaluated.'
    };
  }

  /**
   * Candidate Workflow: Retrieve recommended jobs ranked by explainable compatibility
   */
  async getCandidateJobMatches(candidateUser, options = {}) {
    if (!candidateUser) throw ApiError.unauthorized('Authentication required.');

    const candidateId = (candidateUser._id || candidateUser.id).toString();

    // 1. Retrieve Candidate Profile
    let profile = await CandidateProfile.findOne({
      $or: [{ user: candidateId }, { userId: candidateId }]
    });

    if (!profile) {
      profile = {
        skills: [],
        experience: [],
        education: [],
        preferredWorkModes: ['hybrid', 'remote'],
        preferredLocations: ['Bengaluru, Karnataka'],
        preferredEmploymentTypes: ['full-time'],
        location: 'Bengaluru, Karnataka'
      };
    }

    // 2. Query published jobs from MongoDB
    const query = { status: 'published' };
    if (options.workMode && options.workMode !== 'all') {
      query.workMode = options.workMode.toLowerCase();
    }
    if (options.employmentType && options.employmentType !== 'all') {
      query.employmentType = options.employmentType.toLowerCase();
    }
    if (options.location && options.location !== 'all') {
      const escapedLoc = options.location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.location = { $regex: new RegExp(escapedLoc, 'i') };
    }

    const publishedJobs = await Job.find(query).populate('company');

    // 3. Batch check saved jobs & applications (avoiding N+1 queries)
    const savedJobRecords = await SavedJob.find({ candidate: candidateId });
    const savedJobIds = new Set(savedJobRecords.map(s => {
      const j = s.job;
      return (j && j._id ? j._id.toString() : (j && j.id ? j.id : (j ? j.toString() : s.jobId)));
    }));

    const applicationRecords = await Application.find({ candidate: candidateId });
    const appliedJobIds = new Set(applicationRecords.map(a => {
      const j = a.job;
      return (j && j._id ? j._id.toString() : (j && j.id ? j.id : (j ? j.toString() : a.jobId)));
    }));

    // 4. Compute deterministic matches for all eligible published jobs
    const scoredJobs = [];
    for (const job of publishedJobs) {
      const jobIdStr = (job._id || job.id).toString();
      const match = this.evaluateCandidateJobMatch(profile, job);

      const isSaved = savedJobIds.has(jobIdStr);
      const isApplied = appliedJobIds.has(jobIdStr);

      if (options.savedOnly && !isSaved) {
        continue;
      }

      if (options.minScore && options.minScore !== '0') {
        const minVal = parseInt(options.minScore, 10);
        if (!isNaN(minVal) && match.matchScore < minVal) {
          continue;
        }
      }

      scoredJobs.push({
        job: {
          id: jobIdStr,
          title: job.title,
          slug: job.slug,
          company: job.companyName || (job.company?.name || 'HireConnect Verified Partner'),
          companyLogo: job.companyLogo || (job.company?.logoUrl || null),
          location: job.location,
          workMode: job.workMode,
          employmentType: job.employmentType,
          salary: job.salary,
          salaryDisclosure: job.salaryDisclosure,
          category: job.category,
          skills: job.skills,
          requiredSkills: job.requiredSkills,
          preferredSkills: job.preferredSkills,
          publishedAt: job.publishedAt || job.createdAt,
          applyUrl: job.applyUrl || job.externalApplicationUrl,
          applicationMethod: job.applicationMethod || 'internal',
          isInternal: job.applicationMethod !== 'external'
        },
        matchScore: match.matchScore,
        score: match.score,
        dataCompleteness: match.dataCompleteness,
        category: match.category,
        matchCategory: match.matchCategory,
        limitedData: match.limitedData,
        factors: match.factors,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        reasons: match.reasons,
        summaryExplanation: match.summaryExplanation,
        isSaved,
        isApplied
      });
    }

    // 5. Stable sorting: matchScore desc, tiebreaker: publishedAt desc
    scoredJobs.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return new Date(b.job.publishedAt || 0) - new Date(a.job.publishedAt || 0);
    });

    const page = Math.max(1, parseInt(options.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(options.limit, 10) || 12));
    const total = scoredJobs.length;
    const startIndex = (page - 1) * limit;
    const paginatedMatches = scoredJobs.slice(startIndex, startIndex + limit);

    // Profile completeness recommendations
    const missingProfileFields = [];
    if (!profile.skills || profile.skills.length === 0) missingProfileFields.push('Technical Skills');
    if (!profile.experience || profile.experience.length === 0) missingProfileFields.push('Work Experience');
    if (!profile.education || profile.education.length === 0) missingProfileFields.push('Education');
    if (!profile.preferredWorkModes || profile.preferredWorkModes.length === 0) missingProfileFields.push('Work Mode Preferences');
    if (!profile.preferredLocations || profile.preferredLocations.length === 0) missingProfileFields.push('Preferred Locations');

    return {
      success: true,
      matches: paginatedMatches,
      jobs: paginatedMatches, // Compatibility alias
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      candidateProfileCompleteness: profile.completionPercentage || profile.completeness || 75,
      missingProfileFields,
      scoringMethodology: {
        weights: this.weights,
        description: 'Explainable heuristic matching signal based on available verified evidence.'
      }
    };
  }

  /**
   * Recruiter Workflow: Discover eligible candidates who match an authorized company job
   */
  async getJobCandidateMatches(jobId, recruiterUser, options = {}) {
    if (!jobId) throw ApiError.badRequest('Job ID is required.');
    if (!recruiterUser) throw ApiError.unauthorized('Authentication required.');

    // 1. Verify Job existence
    let job = await Job.findById(jobId);
    if (!job) job = await Job.findOne({ slug: jobId });
    if (!job) job = await Job.findOne({ id: jobId });
    if (!job) throw ApiError.notFound('Job listing not found.');

    // 2. Authorize recruiter company ownership or membership
    const targetCompanyId = (job.company?._id || job.company?.id || job.company).toString();
    const recruiterId = (recruiterUser._id || recruiterUser.id).toString();

    const isPlatformAdmin = recruiterUser.role === 'admin';
    let isAuthorized = isPlatformAdmin;

    if (!isAuthorized) {
      const membership = await CompanyMembership.findOne({
        company: targetCompanyId,
        user: recruiterId,
        status: 'active'
      });
      if (membership) isAuthorized = true;

      if (!isAuthorized) {
        const recruiterProfile = await RecruiterProfile.findOne({
          $or: [{ user: recruiterId }, { userId: recruiterId }]
        });
        if (recruiterProfile && recruiterProfile.company) {
          const recCompId = (recruiterProfile.company._id || recruiterProfile.company).toString();
          if (recCompId === targetCompanyId) isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      throw ApiError.forbidden('Forbidden: You do not have permission to review candidate matches for this company job.');
    }

    // 3. Query eligible discoverable candidate profiles
    // Respect Phase 3 discoverability setting: candidates with discoverability=false MUST NOT appear in general discovery!
    const candidateQuery = {
      $or: [
        { discoverability: true },
        { isDiscoverable: true }
      ]
    };

    const eligibleProfiles = await CandidateProfile.find(candidateQuery).populate('user');

    // 4. Batch check applications submitted for this specific job to show existing applicant state
    const jobApplications = await Application.find({ job: job._id || job.id });
    const appliedCandidateMap = new Map();
    for (const app of jobApplications) {
      const candIdStr = (app.candidate?._id || app.candidate?.id || app.candidate).toString();
      appliedCandidateMap.set(candIdStr, app.status);
    }

    // 5. Score all discoverable candidates against the target job
    const scoredCandidates = [];
    for (const prof of eligibleProfiles) {
      const userDoc = prof.user || {};
      const candidateIdStr = (userDoc._id || userDoc.id || prof.user || prof.userId).toString();

      // Avoid self-matching if recruiter is also a user
      if (candidateIdStr === recruiterId) continue;

      const match = this.evaluateCandidateJobMatch(prof, job);

      if (options.minScore && options.minScore !== '0') {
        const minVal = parseInt(options.minScore, 10);
        if (!isNaN(minVal) && match.matchScore < minVal) {
          continue;
        }
      }

      const existingStatus = appliedCandidateMap.get(candidateIdStr) || null;
      const isShortlisted = existingStatus === 'shortlisted';

      if (options.shortlistedOnly && !isShortlisted) {
        continue;
      }

      scoredCandidates.push({
        candidateId: candidateIdStr,
        name: userDoc.name || 'Candidate',
        headline: prof.headline || 'Software Engineer',
        location: prof.location || 'India',
        experienceYears: this.calculateExperienceYears(prof) || 0,
        skills: this.extractCandidateSkills(prof),
        preferredLocations: prof.preferredLocations || [],
        preferredModes: prof.preferredWorkModes || [],
        summary: prof.summary || '',
        matchScore: match.matchScore,
        score: match.score,
        dataCompleteness: match.dataCompleteness,
        category: match.category,
        matchCategory: match.matchCategory,
        limitedData: match.limitedData,
        factors: match.factors,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        reasons: match.reasons,
        summaryExplanation: match.summaryExplanation,
        applicationStatus: existingStatus,
        isShortlisted,
        contactProtected: prof.privacy ? Boolean(prof.privacy.hideContactInfo) : false
      });
    }

    // 6. Stable sort: matchScore desc
    scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);

    const page = Math.max(1, parseInt(options.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(options.limit, 10) || 12));
    const total = scoredCandidates.length;
    const startIndex = (page - 1) * limit;
    const paginatedMatches = scoredCandidates.slice(startIndex, startIndex + limit);

    return {
      success: true,
      job: {
        id: (job._id || job.id).toString(),
        title: job.title,
        company: job.companyName,
        location: job.location,
        workMode: job.workMode,
        requiredSkills: job.requiredSkills || job.skills || []
      },
      matches: paginatedMatches,
      candidates: paginatedMatches, // Compatibility alias
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    };
  }
}

module.exports = new MatchingService();
