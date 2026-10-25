/**
 * Job Management Service for HireConnect
 * Handles job creation, lifecycle transitions (draft, published, closed),
 * full-text search, multi-faceted filtering, company ownership authorization,
 * and seed data synchronization.
 */

const path = require('path');
const Job = require('../models/job.model');
const Company = require('../models/company.model');
const CompanyMembership = require('../models/companyMembership.model');
const RecruiterProfile = require('../models/recruiterProfile.model');
const notificationService = require('./notification.service');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

class JobService {
  /**
   * Automatically seeds verified job listings if the Job database is empty.
   */
  async seedJobsIfEmpty() {
    try {
      const existingCount = await Job.countDocuments({});
      const threshold = process.env.NODE_ENV === 'test' ? 1 : 20;
      if (existingCount >= threshold) {
        return existingCount;
      }

      logger.info('Initializing Job database with verified employer listings...');
      
      let jobsSource = [];
      try {
        const jobsPath = path.resolve(__dirname, '../data/jobsData.js');
        const jobsModule = require(jobsPath);
        if (Array.isArray(jobsModule.JOBS)) {
          jobsSource = jobsModule.JOBS;
        }
      } catch (e) {
        try {
          const fallbackPath = path.resolve(process.cwd(), 'jobsData.js');
          const fallbackModule = require(fallbackPath);
          if (Array.isArray(fallbackModule.JOBS)) {
            jobsSource = fallbackModule.JOBS;
          }
        } catch (e2) {
          logger.warn('Could not load jobsData.js directly, checking hireconnect_db.json fallback...');
        }
        try {
          const internalDbPath = path.join(__dirname, '..', 'data', 'hireconnect_db.json');
          const rootDbPath = path.resolve(process.cwd(), 'data/hireconnect_db.json');
          const dbPath = fs.existsSync(internalDbPath) ? internalDbPath : rootDbPath;
          const db = require(dbPath);
          if (Array.isArray(db.jobs)) {
            jobsSource = db.jobs;
          }
        } catch (dbErr) {
          logger.warn('No seed jobs found in data/hireconnect_db.json');
        }
      }

      if (!jobsSource.length) {
        logger.info('No seed jobs to import.');
        return 0;
      }

      // Map company names to their Company documents in DB
      const companies = await Company.find({});
      const companyMap = new Map();
      for (const comp of companies) {
        if (comp.name) companyMap.set(comp.name.toLowerCase().trim(), comp);
        if (comp.slug) companyMap.set(comp.slug.toLowerCase().trim(), comp);
      }

      let insertedCount = 0;
      for (const raw of jobsSource) {
        const rawCompName = (raw.company || raw.companyName || 'HireConnect Partner').trim();
        let matchedCompany = companyMap.get(rawCompName.toLowerCase());

        // If company not found, try finding or creating a verified company placeholder
        if (!matchedCompany) {
          const escapedName = rawCompName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          matchedCompany = await Company.findOne({
            $or: [
              { name: new RegExp(`^${escapedName}$`, 'i') },
              { slug: rawCompName.toLowerCase().replace(/[^\w-]/g, '') }
            ]
          });
        }

        if (!matchedCompany) {
          // Auto-create company for seed listing
          matchedCompany = await Company.create({
            name: rawCompName,
            slug: rawCompName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
            industry: raw.companyCategory || 'Technology',
            description: `${rawCompName} is a premier technology employer on HireConnect.`,
            verificationStatus: 'verified',
            verifiedAt: new Date(),
            logoUrl: raw.companyLogo || null,
            headquarters: {
              city: raw.city || 'Bengaluru',
              state: raw.state || 'Karnataka',
              country: 'India'
            }
          });
          companyMap.set(rawCompName.toLowerCase(), matchedCompany);
        }

        const compId = matchedCompany._id || matchedCompany.id;

        // Parse min/max experience
        let expMin = raw.salaryMin != null ? 0 : 0;
        let expMax = null;
        if (raw.experience) {
          const parts = String(raw.experience).match(/(\d+)\s*[-to]*\s*(\d*)/i);
          if (parts) {
            expMin = parseInt(parts[1], 10) || 0;
            expMax = parts[2] ? parseInt(parts[2], 10) : null;
          }
        }

        const jobDoc = {
          id: raw.id || `job-seed-${insertedCount + 1}`,
          title: raw.title,
          slug: Job.generateUniqueSlug ? await Job.generateUniqueSlug(raw.title) : undefined,
          company: compId,
          companyName: matchedCompany.name,
          companyLogo: matchedCompany.logoUrl || raw.companyLogo || null,
          companyCategory: matchedCompany.industry || raw.companyCategory || 'Technology',
          createdBy: matchedCompany.createdBy || null,
          department: raw.department || 'Engineering',
          category: (raw.category || 'fullstack').toLowerCase(),
          employmentType: (raw.employmentType || 'full-time').toLowerCase().replace('full-time', 'full-time'),
          workMode: (raw.workMode || 'hybrid').toLowerCase().replace('on-site', 'onsite'),
          location: raw.location || 'Bengaluru, Karnataka',
          city: raw.city || 'Bengaluru',
          state: raw.state || 'Karnataka',
          country: 'India',
          experienceMin: raw.experienceMin != null ? Number(raw.experienceMin) : expMin,
          experienceMax: raw.experienceMax != null ? Number(raw.experienceMax) : expMax,
          experienceLevel: raw.experienceLevel || (expMin >= 5 ? 'senior' : expMin >= 2 ? 'mid' : 'entry'),
          experience: raw.experience || `${expMin} - ${expMax || expMin + 3} Years`,
          salaryMin: raw.salaryMin != null ? Number(raw.salaryMin) : null,
          salaryMax: raw.salaryMax != null ? Number(raw.salaryMax) : null,
          salaryCurrency: 'INR',
          salaryPeriod: 'annual',
          salaryDisclosure: raw.salaryDisclosed === false ? 'undisclosed' : 'disclosed',
          salary: raw.salary || (raw.salaryMin && raw.salaryMax ? `₹${raw.salaryMin} - ${raw.salaryMax} LPA` : 'Competitive'),
          description: raw.description || `Exciting opportunity to join ${matchedCompany.name} as a ${raw.title}.`,
          shortDescription: raw.description ? raw.description.slice(0, 160) : '',
          skills: Array.isArray(raw.skills) ? raw.skills : [],
          requiredSkills: Array.isArray(raw.skills) ? raw.skills : [],
          preferredSkills: [],
          responsibilities: Array.isArray(raw.responsibilities) ? raw.responsibilities : [],
          requirements: Array.isArray(raw.requirements) ? raw.requirements : [],
          perks: Array.isArray(raw.perks) ? raw.perks : [],
          benefits: Array.isArray(raw.perks) ? raw.perks : [],
          applicationMethod: raw.applyUrl ? 'external' : 'internal',
          externalApplicationUrl: raw.applyUrl || null,
          applyUrl: raw.applyUrl || null,
          source: raw.source || 'HireConnect Verified Employer',
          status: 'published',
          publishedAt: raw.postedDate ? new Date(raw.postedDate) : new Date(),
          openingsCount: raw.openingsCount || 1,
          applicantCount: raw.applicantCount || 0,
          viewsCount: 0
        };

        await Job.create(jobDoc);
        insertedCount++;
      }

      // Sync activeJobsCount across all companies
      for (const comp of companyMap.values()) {
        const cId = comp._id || comp.id;
        const activeCount = await Job.countDocuments({ company: cId, status: 'published' });
        await Company.findByIdAndUpdate(cId, { activeJobsCount: activeCount });
      }

      logger.info(`Successfully seeded ${insertedCount} verified jobs.`);
      return insertedCount;
    } catch (err) {
      logger.error('Error during job seeding:', err);
      return 0;
    }
  }

  /**
   * Helper to resolve company and verify recruiter membership.
   */
  async resolveAuthorizedCompany(user, requestedCompanyId = null) {
    let company = null;

    if (requestedCompanyId) {
      company = await Company.findById(requestedCompanyId);
      if (!company) {
        company = await Company.findOne({ slug: requestedCompanyId });
      }
      if (!company && requestedCompanyId.startsWith('comp-')) {
        const cleanSlug = requestedCompanyId.replace(/^comp-/, '');
        company = await Company.findOne({ slug: cleanSlug });
      }
    } else {
      // Find company associated with user's active membership
      const membership = await CompanyMembership.findOne({
        user: user._id || user.id,
        status: 'active'
      });
      if (membership && membership.company) {
        company = await Company.findById(membership.company);
      } else {
        // Fallback to recruiter profile company
        const recProfile = await RecruiterProfile.findOne({ user: user._id || user.id });
        if (recProfile && recProfile.company) {
          company = await Company.findById(recProfile.company);
        } else if (user.email === 'recruiter@hireconnect.io' || user.name?.includes('Priya')) {
          // Razorpay seed recruiter mapping
          company = await Company.findOne({ slug: 'razorpay' });
          if (!company) company = await Company.findOne({ name: /razorpay/i });
        }
      }
    }

    if (!company) {
      throw ApiError.badRequest('No associated company found. Please select or join an organization first.');
    }

    // Auto-create membership for seed recruiter if missing
    if (user.role === 'recruiter') {
      const isMember = await CompanyMembership.findOne({
        company: company._id || company.id,
        user: user._id || user.id,
        status: 'active'
      });
      if (!isMember) {
        if (user.email === 'recruiter@hireconnect.io' || user.name?.includes('Priya')) {
          await CompanyMembership.create({
            company: company._id || company.id,
            user: user._id || user.id,
            membershipRole: 'owner',
            status: 'active'
          });
        } else {
          throw ApiError.forbidden('You are not an active member of this organization.');
        }
      }
    }

    return company;
  }

  /**
   * Create a new job listing.
   */
  async createJob(data, user) {
    const company = await this.resolveAuthorizedCompany(user, data.companyId || data.company);

    const isPublishedRequested = data.status === 'published';
    if (isPublishedRequested && company.verificationStatus !== 'verified') {
      throw ApiError.forbidden(
        'Company is not verified. Authoritative job publishing requires an approved verification status. Save as draft instead.'
      );
    }

    const jobData = {
      ...data,
      company: company._id || company.id,
      companyName: company.name,
      companyLogo: company.logoUrl || null,
      companyCategory: company.industry || 'Technology',
      createdBy: user._id || user.id,
      slug: data.slug || (Job.generateUniqueSlug ? await Job.generateUniqueSlug(data.title) : undefined),
      status: isPublishedRequested ? 'published' : (data.status || 'draft'),
      publishedAt: isPublishedRequested ? new Date() : null
    };

    // Format experience string if not explicitly given
    if (!jobData.experience) {
      if (jobData.experienceMin != null && jobData.experienceMax != null) {
        jobData.experience = `${jobData.experienceMin} - ${jobData.experienceMax} Years`;
      } else if (jobData.experienceMin != null) {
        jobData.experience = `${jobData.experienceMin}+ Years`;
      }
    }

    // Format salary string if not explicitly given
    if (!jobData.salary) {
      if (jobData.salaryDisclosure === 'undisclosed') {
        jobData.salary = 'Competitive';
      } else if (jobData.salaryMin != null && jobData.salaryMax != null) {
        jobData.salary = `₹${jobData.salaryMin} - ${jobData.salaryMax} LPA`;
      } else if (jobData.salaryMin != null) {
        jobData.salary = `₹${jobData.salaryMin}+ LPA`;
      } else {
        jobData.salary = 'Competitive';
      }
    }

    const newJob = await Job.create(jobData);

    // If published, update company activeJobsCount
    if (newJob.status === 'published') {
      await this.syncCompanyActiveJobs(company._id || company.id);
    }

    return newJob;
  }

  /**
   * Public Job Search and Discovery with multi-attribute filtering.
   */
  async getJobs(filters = {}) {
    // Ensure seed data is initialized
    await this.seedJobsIfEmpty();

    const page = Math.max(1, parseInt(filters.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(filters.limit, 10) || 9));
    const skip = (page - 1) * limit;

    const query = {
      status: 'published',
      moderationStatus: { $ne: 'removed' }
    };

    // Keyword search across title, description, companyName, skills
    const rawSearch = (filters.q || filters.keyword || '').trim();
    if (rawSearch) {
      const searchRegex = new RegExp(rawSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { companyName: searchRegex },
        { skills: searchRegex },
        { requiredSkills: searchRegex },
        { category: searchRegex }
      ];
    }

    // Location filter
    const loc = (filters.location || '').trim();
    if (loc && loc.toLowerCase() !== 'all' && loc.toLowerCase() !== 'all india') {
      if (loc.toLowerCase().includes('remote')) {
        query.$or = (query.$or || []).concat([
          { workMode: 'remote' },
          { location: /remote/i }
        ]);
      } else {
        const locRegex = new RegExp(loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        query.$or = (query.$or || []).concat([
          { location: locRegex },
          { city: locRegex },
          { state: locRegex }
        ]);
      }
    }

    // Work Mode filter
    const workMode = (filters.workMode || '').toLowerCase().trim();
    if (workMode && workMode !== 'all') {
      const normalizedMode = workMode === 'on-site' ? 'onsite' : workMode;
      query.workMode = normalizedMode;
    }

    // Employment Type filter
    const empType = (filters.employmentType || '').toLowerCase().trim();
    if (empType && empType !== 'all') {
      query.employmentType = empType;
    }

    // Category / Role filter
    const cat = (filters.category || '').toLowerCase().trim();
    if (cat && cat !== 'all') {
      query.category = cat;
    }

    // Company filter (escaped to prevent regex syntax injection and ReDoS)
    const compFilter = (filters.company || filters.companyId || '').trim();
    if (compFilter) {
      const escapedComp = compFilter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = (query.$or || []).concat([
        { company: compFilter },
        { companyName: new RegExp(escapedComp, 'i') }
      ]);
    }

    // Experience filter handling
    // Can be presets: '0-2', '3-5', '5-8', '8+', 'entry', 'mid', 'senior', 'lead'
    let expMinQuery = filters.experienceMin != null ? Number(filters.experienceMin) : null;
    let expMaxQuery = filters.experienceMax != null ? Number(filters.experienceMax) : null;

    const expPreset = (filters.experience || '').toLowerCase().trim();
    if (expPreset && expPreset !== 'all') {
      if (expPreset === '0-2' || expPreset === 'entry') {
        expMinQuery = 0;
        expMaxQuery = 2;
      } else if (expPreset === '2-5' || expPreset === '3-5' || expPreset === 'mid') {
        expMinQuery = 2;
        expMaxQuery = 5;
      } else if (expPreset === '5-8' || expPreset === 'senior') {
        expMinQuery = 5;
        expMaxQuery = 8;
      } else if (expPreset === '8+' || expPreset === 'lead') {
        expMinQuery = 8;
        expMaxQuery = null;
      } else {
        const parts = expPreset.match(/(\d+)\s*[-to]*\s*(\d*)/);
        if (parts) {
          expMinQuery = parseInt(parts[1], 10);
          expMaxQuery = parts[2] ? parseInt(parts[2], 10) : null;
        }
      }
    }

    if (expMinQuery != null || expMaxQuery != null) {
      if (expMinQuery != null && expMaxQuery != null) {
        query.experienceMin = { $gte: expMinQuery, $lte: expMaxQuery };
      } else if (expMinQuery != null) {
        query.experienceMin = { $gte: expMinQuery };
      } else if (expMaxQuery != null) {
        query.experienceMin = { $lte: expMaxQuery };
      }
    }

    // Salary filter handling
    if (filters.salaryMin != null) {
      query.salaryMax = { $gte: Number(filters.salaryMin) };
    }
    if (filters.salaryMax != null) {
      query.salaryMin = { $lte: Number(filters.salaryMax) };
    }

    // Sorting
    let sortObj = { publishedAt: -1, createdAt: -1 };
    const sort = filters.sort || 'newest';
    if (sort === 'salary_desc') {
      sortObj = { salaryMax: -1, salaryMin: -1 };
    } else if (sort === 'salary_asc') {
      sortObj = { salaryMin: 1, salaryMax: 1 };
    } else if (sort === 'experience_asc') {
      sortObj = { experienceMin: 1 };
    } else if (sort === 'title_asc') {
      sortObj = { title: 1 };
    }

    // Execute query
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query).sort(sortObj).skip(skip).limit(limit).populate('company');
    const totalPages = Math.ceil(total / limit) || 1;
    const hasMore = page < totalPages;

    return {
      jobs,
      total,
      page,
      limit,
      totalPages,
      hasMore
    };
  }

  /**
   * Get single job by ID or slug.
   */
  async getJobByIdOrSlug(idOrSlug, user = null) {
    let job = await Job.findById(idOrSlug).populate('company');
    if (!job) {
      job = await Job.findOne({ slug: idOrSlug }).populate('company');
    }
    if (!job) {
      job = await Job.findOne({ id: idOrSlug }).populate('company');
    }

    if (!job) {
      throw ApiError.notFound('Job listing not found.');
    }

    // If job is not published or administratively removed, only allow company recruiters or platform admins
    if (job.status !== 'published' || job.moderationStatus === 'removed') {
      if (!user) {
        throw ApiError.notFound('Job listing is not currently active.');
      }
      if (user.role !== 'admin') {
        const isMember = await CompanyMembership.findOne({
          company: job.company?._id || job.company?.id || job.company,
          user: user._id || user.id,
          status: 'active'
        });
        if (!isMember) {
          throw ApiError.notFound('Job listing is not currently active.');
        }
      }
    }

    // Increment views count non-blockingly
    Job.findByIdAndUpdate(job._id || job.id, { $inc: { viewsCount: 1 } }).catch(() => {});

    return job;
  }

  /**
   * Update an existing job listing.
   */
  async updateJob(jobId, updates, user) {
    const job = await Job.findById(jobId);
    if (!job) {
      throw ApiError.notFound('Job listing not found.');
    }

    // Validate recruiter is active member of job's company
    await this.resolveAuthorizedCompany(user, job.company);

    const oldStatus = job.status;

    // Disallow overriding company or createdBy
    delete updates.company;
    delete updates.companyId;
    delete updates.createdBy;
    delete updates._id;
    delete updates.id;

    // If changing to published, verify company is verified
    if (updates.status === 'published' && oldStatus !== 'published') {
      const company = await Company.findById(job.company);
      if (!company || company.verificationStatus !== 'verified') {
        throw ApiError.forbidden('Cannot publish job: Company must have an approved verification status.');
      }
      updates.publishedAt = new Date();
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, updates, { new: true });

    // Sync active jobs count if status changed
    if (updates.status && updates.status !== oldStatus) {
      await this.syncCompanyActiveJobs(job.company);
    }

    return updatedJob;
  }

  /**
   * Transition job to published state.
   */
  async publishJob(jobId, user, options = {}) {
    const job = await Job.findById(jobId);
    if (!job) {
      throw ApiError.notFound('Job listing not found.');
    }

    const company = await this.resolveAuthorizedCompany(user, job.company);

    if (company.verificationStatus !== 'verified') {
      throw ApiError.forbidden(
        'Cannot publish job listing: Organization verification is pending or unapproved. Complete company verification first.'
      );
    }

    if (options.applicationDeadline) {
      const deadlineDate = new Date(options.applicationDeadline);
      if (deadlineDate <= new Date()) {
        throw ApiError.badRequest('Application deadline must be a future date.');
      }
      job.applicationDeadline = deadlineDate;
    }

    job.status = 'published';
    job.publishedAt = new Date();
    await job.save();

    await this.syncCompanyActiveJobs(company._id || company.id);

    // Dispatch job published notification (Phase 9)
    notificationService.notifyJobStatusChanged({
      job,
      recruiter: user,
      status: 'published'
    }).catch((e) => logger.warn(`[JobService] Publish notification error: ${e.message}`));

    return job;
  }

  /**
   * Transition job to closed state.
   */
  async closeJob(jobId, user) {
    const job = await Job.findById(jobId);
    if (!job) {
      throw ApiError.notFound('Job listing not found.');
    }

    const company = await this.resolveAuthorizedCompany(user, job.company);

    job.status = 'closed';
    job.closedAt = new Date();
    await job.save();

    await this.syncCompanyActiveJobs(company._id || company.id);

    // Dispatch job closed notification (Phase 9)
    notificationService.notifyJobStatusChanged({
      job,
      recruiter: user,
      status: 'closed'
    }).catch((e) => logger.warn(`[JobService] Close notification error: ${e.message}`));

    return job;
  }

  /**
   * Recruiter jobs list: retrieves all jobs for recruiter's company (draft, published, closed).
   */
  async getRecruiterJobs(user, filters = {}) {
    const page = Math.max(1, parseInt(filters.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(filters.limit, 10) || 10));
    const skip = (page - 1) * limit;

    // Find companies recruiter belongs to
    let companyIds = [];
    if (user.role === 'admin') {
      if (filters.companyId) {
        companyIds = [filters.companyId];
      }
    } else {
      const memberships = await CompanyMembership.find({
        user: user._id || user.id,
        status: 'active'
      });
      companyIds = memberships.map((m) => (m.company?._id || m.company?.id || m.company).toString());

      if (!companyIds.length) {
        const recProfile = await RecruiterProfile.findOne({ user: user._id || user.id });
        if (recProfile && recProfile.company) {
          companyIds = [(recProfile.company?._id || recProfile.company).toString()];
        } else if (user.email === 'recruiter@hireconnect.io' || user.name?.includes('Priya')) {
          const comp = await Company.findOne({ slug: 'razorpay' });
          if (comp) companyIds = [(comp._id || comp.id).toString()];
        }
      }
    }

    const query = {};
    if (companyIds.length === 1) {
      query.company = companyIds[0];
    } else if (companyIds.length > 1) {
      query.company = { $in: companyIds };
    } else if (user.role !== 'admin') {
      // User has no company memberships
      return { jobs: [], total: 0, page, limit, totalPages: 0 };
    }

    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('company');
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      jobs,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Keep company activeJobsCount accurately synced with database.
   */
  async syncCompanyActiveJobs(companyId) {
    try {
      const activeCount = await Job.countDocuments({
        company: companyId,
        status: 'published'
      });
      await Company.findByIdAndUpdate(companyId, { activeJobsCount: activeCount });
    } catch (e) {
      logger.warn(`Could not sync activeJobsCount for company ${companyId}: ${e.message}`);
    }
  }
}

module.exports = new JobService();
