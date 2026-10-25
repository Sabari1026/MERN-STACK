/**
 * Admin Service for HireConnect (Phase 10)
 * Core business logic for dashboard metrics, user governance, company verification,
 * job moderation, and audit trail enforcement.
 */

const User = require('../models/user.model');
const Company = require('../models/company.model');
const Job = require('../models/job.model');
const Application = require('../models/application.model');
const Meeting = require('../models/meeting.model');
const CompanyVerificationRequest = require('../models/companyVerification.model');
const CandidateProfile = require('../models/candidateProfile.model');
const RecruiterProfile = require('../models/recruiterProfile.model');
const adminAuditService = require('./adminAudit.service');
const notificationService = require('./notification.service');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

class AdminService {
  /**
   * Calculate real, database-backed platform metrics across all modules
   */
  async getDashboardMetrics() {
    const now = new Date();

    // 1. User Metrics
    const [
      totalUsers,
      candidatesCount,
      recruitersCount,
      adminsCount,
      activeUsers,
      suspendedUsers
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: 'candidate' }),
      User.countDocuments({ role: 'recruiter' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ accountStatus: 'active' }),
      User.countDocuments({ accountStatus: 'suspended' })
    ]);

    // 2. Company Metrics
    const [
      totalCompanies,
      verifiedCompanies,
      pendingVerifications,
      suspendedCompanies
    ] = await Promise.all([
      Company.countDocuments({}),
      Company.countDocuments({ verificationStatus: 'verified' }),
      Company.countDocuments({ verificationStatus: { $in: ['pending', 'under_review'] } }),
      Company.countDocuments({ verificationStatus: 'suspended' })
    ]);

    // 3. Job Metrics (distinguishing ordinary status from moderation)
    const [
      totalJobs,
      publishedJobs,
      draftJobs,
      closedJobs,
      pausedJobs,
      moderatedJobs
    ] = await Promise.all([
      Job.countDocuments({}),
      Job.countDocuments({ status: 'published', moderationStatus: { $ne: 'removed' } }),
      Job.countDocuments({ status: 'draft' }),
      Job.countDocuments({ status: 'closed' }),
      Job.countDocuments({ status: 'paused' }),
      Job.countDocuments({ moderationStatus: 'removed' })
    ]);

    // 4. Applications Metrics
    const totalApplications = await Application.countDocuments({});

    // 5. Meetings / Interview Metrics (Phase 8)
    const [
      totalMeetings,
      upcomingInterviews,
      completedMeetings
    ] = await Promise.all([
      Meeting.countDocuments({}),
      Meeting.countDocuments({ status: 'scheduled', startAt: { $gte: now } }),
      Meeting.countDocuments({ status: 'completed' })
    ]);

    // 6. Actionable Queue Counts
    const pendingVerificationRequests = await CompanyVerificationRequest.countDocuments({
      status: { $in: ['pending', 'under_review'] }
    });
    const flaggedJobs = await Job.countDocuments({ moderationStatus: 'flagged' });

    return {
      users: {
        total: totalUsers,
        candidates: candidatesCount,
        recruiters: recruitersCount,
        admins: adminsCount,
        active: activeUsers,
        suspended: suspendedUsers
      },
      companies: {
        total: totalCompanies,
        verified: verifiedCompanies,
        pendingVerification: pendingVerifications,
        suspended: suspendedCompanies
      },
      jobs: {
        total: totalJobs,
        published: publishedJobs,
        draft: draftJobs,
        closed: closedJobs,
        paused: pausedJobs,
        moderated: moderatedJobs
      },
      applications: {
        total: totalApplications
      },
      interviews: {
        total: totalMeetings,
        upcoming: upcomingInterviews,
        completed: completedMeetings
      },
      pendingActions: {
        verificationRequests: pendingVerificationRequests,
        flaggedJobs
      },
      timestamp: now.toISOString()
    };
  }

  /**
   * User Management: List users with pagination, role/status filtering, and search
   */
  async listUsers(filters = {}) {
    const page = Math.max(1, parseInt(filters.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(filters.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const query = {};
    if (filters.role && filters.role !== 'all') {
      query.role = filters.role;
    }
    if (filters.status && filters.status !== 'all') {
      query.accountStatus = filters.status;
    }

    if (filters.search) {
      const searchRegex = new RegExp(filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const sortObj = {};
    const sortField = filters.sortBy || 'createdAt';
    const sortDir = filters.sortOrder === 'asc' ? 1 : -1;
    sortObj[sortField] = sortDir;

    const total = await User.countDocuments(query);
    const users = await User.find(query).sort(sortObj).skip(skip).limit(limit);

    // Sanitize user records (strictly exclude password hashes, tokens, auth secrets)
    const sanitizedUsers = users.map(u => ({
      id: u._id ? u._id.toString() : u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      accountStatus: u.accountStatus,
      avatarUrl: u.avatarUrl,
      emailVerifiedAt: u.emailVerifiedAt,
      lastLoginAt: u.lastLoginAt,
      createdAt: u.createdAt
    }));

    return {
      users: sanitizedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasMore: page < (Math.ceil(total / limit) || 1)
      }
    };
  }

  /**
   * User Management: Get detailed user profile inspection
   */
  async getUserDetails(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User account not found.');
    }

    let profile = null;
    let applicationsCount = 0;
    let company = null;

    if (user.role === 'candidate') {
      profile = await CandidateProfile.findOne({ user: user._id || user.id });
      applicationsCount = await Application.countDocuments({ candidate: user._id || user.id });
    } else if (user.role === 'recruiter') {
      profile = await RecruiterProfile.findOne({ user: user._id || user.id });
      if (profile?.company) {
        company = await Company.findById(profile.company);
      }
    }

    return {
      user: {
        id: user._id ? user._id.toString() : user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        avatarUrl: user.avatarUrl,
        emailVerifiedAt: user.emailVerifiedAt,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      profile: profile ? (profile.toObject ? profile.toObject() : profile) : null,
      company: company ? {
        id: company._id || company.id,
        name: company.name,
        slug: company.slug,
        verificationStatus: company.verificationStatus
      } : null,
      applicationsCount
    };
  }

  /**
   * User Management: Suspend or reactivate user account
   */
  async updateUserStatus(userId, status, reason = '', actorUser, req = null) {
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      throw ApiError.notFound('User account not found.');
    }

    const actorId = actorUser._id ? actorUser._id.toString() : actorUser.id.toString();
    const targetId = targetUser._id ? targetUser._id.toString() : targetUser.id.toString();

    // Safeguard 1: Administrator cannot suspend themselves
    if (actorId === targetId && status === 'suspended') {
      throw ApiError.badRequest('Administrators cannot suspend their own account.');
    }

    // Safeguard 2: Prevent locking out the last active administrator
    if (targetUser.role === 'admin' && status === 'suspended') {
      const activeAdminCount = await User.countDocuments({ role: 'admin', accountStatus: 'active' });
      if (activeAdminCount <= 1) {
        throw ApiError.badRequest('Cannot suspend the last remaining active administrator account.');
      }
    }

    const previousStatus = targetUser.accountStatus;
    targetUser.accountStatus = status;

    // When suspending, revoke all refresh tokens immediately to terminate existing sessions
    if (status === 'suspended') {
      targetUser.refreshTokens = [];
    }

    await targetUser.save();

    // Record persistent audit log
    await adminAuditService.record({
      actor: actorUser,
      action: status === 'suspended' ? 'user_suspended' : 'user_reactivated',
      resourceType: 'user',
      resourceId: targetId,
      previousState: { accountStatus: previousStatus },
      newState: { accountStatus: status },
      reason,
      req
    });

    // Dispatch Phase 9 Notification & Email
    try {
      await notificationService.notifyUserStatusChanged({
        user: targetUser,
        status,
        reason
      });
    } catch (notifErr) {
      logger.warn(`[AdminService] Notification error on status change: ${notifErr.message}`);
    }

    return {
      id: targetId,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      accountStatus: targetUser.accountStatus,
      updatedAt: targetUser.updatedAt
    };
  }

  /**
   * User Management: Update user role (Privileged operation)
   */
  async updateUserRole(userId, newRole, reason = '', actorUser, req = null) {
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      throw ApiError.notFound('User account not found.');
    }

    const actorId = actorUser._id ? actorUser._id.toString() : actorUser.id.toString();
    const targetId = targetUser._id ? targetUser._id.toString() : targetUser.id.toString();

    // Safeguard: Prevent demoting the last active administrator
    if (targetUser.role === 'admin' && newRole !== 'admin') {
      const activeAdminCount = await User.countDocuments({ role: 'admin', accountStatus: 'active' });
      if (activeAdminCount <= 1) {
        throw ApiError.badRequest('Cannot demote the last remaining active administrator account.');
      }
      if (actorId === targetId) {
        throw ApiError.badRequest('Administrators cannot demote their own account.');
      }
    }

    const previousRole = targetUser.role;
    targetUser.role = newRole;
    await targetUser.save();

    // Record audit log
    await adminAuditService.record({
      actor: actorUser,
      action: 'user_role_changed',
      resourceType: 'user',
      resourceId: targetId,
      previousState: { role: previousRole },
      newState: { role: newRole },
      reason,
      req
    });

    return {
      id: targetId,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role
    };
  }

  /**
   * Company Management: List companies with verification filters
   */
  async listCompanies(filters = {}) {
    const page = Math.max(1, parseInt(filters.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(filters.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const query = {};
    if (filters.verificationStatus && filters.verificationStatus !== 'all') {
      query.verificationStatus = filters.verificationStatus;
    }
    if (filters.industry && filters.industry !== 'all') {
      query.industry = filters.industry;
    }
    if (filters.search) {
      const searchRegex = new RegExp(filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ name: searchRegex }, { slug: searchRegex }];
    }

    const total = await Company.countDocuments(query);
    const companies = await Company.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    return {
      companies: companies.map(c => ({
        id: c._id ? c._id.toString() : c.id,
        name: c.name,
        slug: c.slug,
        industry: c.industry,
        verificationStatus: c.verificationStatus,
        verified: Boolean(c.verified),
        verifiedAt: c.verifiedAt,
        activeJobsCount: c.activeJobsCount || 0,
        createdAt: c.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasMore: page < (Math.ceil(total / limit) || 1)
      }
    };
  }

  /**
   * Company Management: Get detailed company inspection
   */
  async getCompanyDetails(companyId) {
    let company = await Company.findById(companyId);
    if (!company) {
      company = await Company.findOne({ slug: companyId });
    }
    if (!company) {
      throw ApiError.notFound('Company record not found.');
    }

    const compId = company._id || company.id;
    const verificationRequest = await CompanyVerificationRequest.findOne({ company: compId });
    const jobsCount = await Job.countDocuments({ company: compId });
    const verifiedBy = company.verifiedBy ? await User.findById(company.verifiedBy) : null;

    return {
      company: {
        id: compId.toString(),
        name: company.name,
        slug: company.slug,
        description: company.description,
        website: company.website,
        industry: company.industry,
        verificationStatus: company.verificationStatus,
        verified: Boolean(company.verified),
        verifiedAt: company.verifiedAt,
        verifiedBy: verifiedBy ? { id: verifiedBy._id, name: verifiedBy.name, email: verifiedBy.email } : null,
        verificationNotes: company.verificationNotes || '',
        activeJobsCount: company.activeJobsCount || 0,
        createdAt: company.createdAt
      },
      verificationRequest: verificationRequest ? (verificationRequest.toObject ? verificationRequest.toObject() : verificationRequest) : null,
      jobsCount
    };
  }

  /**
   * Company Verification: List verification review requests
   */
  async listVerificationRequests(filters = {}) {
    const page = Math.max(1, parseInt(filters.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(filters.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const query = {};
    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }

    const total = await CompanyVerificationRequest.countDocuments(query);
    const requests = await CompanyVerificationRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const detailedRequests = [];
    for (const r of requests) {
      const comp = await Company.findById(r.company);
      const requester = await User.findById(r.requestedBy);
      detailedRequests.push({
        id: r._id ? r._id.toString() : r.id,
        status: r.status,
        officialEmail: r.officialEmail,
        website: r.website,
        businessRegistrationNumber: r.businessRegistrationNumber,
        contactPhone: r.contactPhone,
        documents: r.documents || [],
        reviewerNotes: r.reviewerNotes || '',
        createdAt: r.createdAt,
        company: comp ? {
          id: comp._id || comp.id,
          name: comp.name,
          slug: comp.slug,
          industry: comp.industry,
          verificationStatus: comp.verificationStatus
        } : null,
        requester: requester ? {
          id: requester._id || requester.id,
          name: requester.name,
          email: requester.email
        } : null
      });
    }

    return {
      requests: detailedRequests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasMore: page < (Math.ceil(total / limit) || 1)
      }
    };
  }

  /**
   * Company Verification: Review, approve, reject, or suspend company
   */
  async reviewCompanyVerification(companyId, status, reason = '', notes = '', actorUser, req = null) {
    let company = await Company.findById(companyId);
    if (!company) {
      company = await Company.findOne({ slug: companyId });
    }
    if (!company) {
      throw ApiError.notFound('Company not found.');
    }

    const compId = company._id || company.id;
    const previousStatus = company.verificationStatus;
    const actorId = actorUser._id || actorUser.id;

    // Apply verification state transitions
    company.verificationStatus = status;
    company.verificationNotes = notes || reason || '';

    if (status === 'verified') {
      company.verified = true;
      company.verifiedAt = new Date();
      company.verifiedBy = actorId;
      company.verificationMethod = 'manual_audit';
    } else if (status === 'rejected') {
      company.verified = false;
      company.verifiedAt = null;
      company.verifiedBy = actorId;
    } else if (status === 'suspended') {
      company.verified = false;
    }

    await company.save();

    // Update associated verification request if present
    const vReq = await CompanyVerificationRequest.findOne({ company: compId });
    if (vReq) {
      vReq.status = status;
      vReq.reviewerNotes = notes || reason || '';
      vReq.reviewedBy = actorId;
      vReq.reviewedAt = new Date();
      await vReq.save();
    }

    // Record persistent audit log
    let auditAction = 'company_verification_updated';
    if (status === 'verified') auditAction = 'company_verified';
    else if (status === 'rejected') auditAction = 'company_verification_rejected';
    else if (status === 'suspended') auditAction = 'company_suspended';

    await adminAuditService.record({
      actor: actorUser,
      action: auditAction,
      resourceType: 'company',
      resourceId: compId.toString(),
      previousState: { verificationStatus: previousStatus },
      newState: { verificationStatus: status, verified: company.verified },
      reason: notes || reason,
      req
    });

    // Dispatch Phase 9 Notification & Email to company creator/owner
    try {
      const owner = await User.findById(company.createdBy);
      if (owner) {
        await notificationService.notifyCompanyVerificationUpdated({
          company,
          owner,
          status,
          reviewNotes: notes || reason
        });
      }
    } catch (notifErr) {
      logger.warn(`[AdminService] Notification error on company verification: ${notifErr.message}`);
    }

    return {
      id: compId.toString(),
      name: company.name,
      slug: company.slug,
      verificationStatus: company.verificationStatus,
      verified: Boolean(company.verified),
      verifiedAt: company.verifiedAt
    };
  }

  /**
   * Job Moderation: List all jobs with moderation and status filters
   */
  async listJobs(filters = {}) {
    const page = Math.max(1, parseInt(filters.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(filters.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const query = {};
    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }
    if (filters.moderationStatus && filters.moderationStatus !== 'all') {
      query.moderationStatus = filters.moderationStatus;
    }
    if (filters.companyId) {
      query.company = filters.companyId;
    }
    if (filters.search) {
      const searchRegex = new RegExp(filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ title: searchRegex }, { companyName: searchRegex }];
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('company');

    return {
      jobs: jobs.map(j => ({
        id: j._id ? j._id.toString() : j.id,
        title: j.title,
        slug: j.slug,
        company: j.company ? {
          id: j.company._id || j.company.id,
          name: j.company.name,
          slug: j.company.slug,
          verificationStatus: j.company.verificationStatus
        } : null,
        companyName: j.companyName,
        status: j.status,
        moderationStatus: j.moderationStatus || 'approved',
        isModerated: Boolean(j.isModerated),
        moderationReason: j.moderationReason || '',
        applicantCount: j.applicantCount || 0,
        publishedAt: j.publishedAt,
        closedAt: j.closedAt,
        createdAt: j.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasMore: page < (Math.ceil(total / limit) || 1)
      }
    };
  }

  /**
   * Job Moderation: Inspect single job details
   */
  async getJobDetails(jobId) {
    let job = await Job.findById(jobId).populate('company');
    if (!job) {
      job = await Job.findOne({ slug: jobId }).populate('company');
    }
    if (!job) {
      throw ApiError.notFound('Job opening not found.');
    }

    const applicationsCount = await Application.countDocuments({ job: job._id || job.id });
    const creator = await User.findById(job.createdBy || job.recruiter);

    return {
      job: {
        id: job._id ? job._id.toString() : job.id,
        title: job.title,
        slug: job.slug,
        company: job.company ? (job.company.toObject ? job.company.toObject() : job.company) : null,
        companyName: job.companyName,
        department: job.department,
        category: job.category,
        employmentType: job.employmentType,
        workMode: job.workMode,
        location: job.location,
        experience: job.experience,
        salary: job.salary,
        description: job.description,
        skills: job.skills || [],
        status: job.status,
        moderationStatus: job.moderationStatus || 'approved',
        isModerated: Boolean(job.isModerated),
        moderationReason: job.moderationReason || '',
        moderatedAt: job.moderatedAt,
        applicantCount: applicationsCount,
        publishedAt: job.publishedAt,
        closedAt: job.closedAt,
        createdAt: job.createdAt
      },
      creator: creator ? {
        id: creator._id || creator.id,
        name: creator.name,
        email: creator.email
      } : null,
      applicationsCount
    };
  }

  /**
   * Job Moderation: Moderates a job (remove from public listings, restore, or flag)
   * Critical: NEVER deletes applications or historical data!
   */
  async moderateJob(jobId, action, reason, actorUser, req = null) {
    let job = await Job.findById(jobId).populate('company');
    if (!job) {
      job = await Job.findOne({ slug: jobId }).populate('company');
    }
    if (!job) {
      throw ApiError.notFound('Job opening not found.');
    }

    const jId = job._id ? job._id.toString() : job.id.toString();
    const previousState = {
      moderationStatus: job.moderationStatus || 'approved',
      isModerated: Boolean(job.isModerated)
    };

    if (action === 'remove') {
      job.moderationStatus = 'removed';
      job.isModerated = true;
      job.moderationReason = reason;
      job.moderatedBy = actorUser._id || actorUser.id;
      job.moderatedAt = new Date();
    } else if (action === 'restore') {
      job.moderationStatus = 'approved';
      job.isModerated = false;
      job.moderationReason = reason;
      job.moderatedBy = actorUser._id || actorUser.id;
      job.moderatedAt = new Date();
    } else if (action === 'flag') {
      job.moderationStatus = 'flagged';
      job.moderationReason = reason;
    }

    await job.save();

    // Record persistent audit log
    await adminAuditService.record({
      actor: actorUser,
      action: action === 'remove' ? 'job_moderation_removed' : (action === 'restore' ? 'job_moderation_restored' : 'job_flagged'),
      resourceType: 'job',
      resourceId: jId,
      previousState,
      newState: { moderationStatus: job.moderationStatus, isModerated: job.isModerated },
      reason,
      req
    });

    // Dispatch Phase 9 Notification & Email to job creator/recruiter
    try {
      const recruiter = await User.findById(job.createdBy || job.recruiter);
      if (recruiter) {
        await notificationService.notifyJobModerated({
          job,
          recruiter,
          action,
          reason
        });
      }
    } catch (notifErr) {
      logger.warn(`[AdminService] Notification error on job moderation: ${notifErr.message}`);
    }

    return {
      id: jId,
      title: job.title,
      status: job.status,
      moderationStatus: job.moderationStatus,
      isModerated: job.isModerated,
      moderationReason: job.moderationReason
    };
  }

  /**
   * Job Moderation: Administratively close a job listing
   */
  async closeJob(jobId, reason = '', actorUser, req = null) {
    let job = await Job.findById(jobId);
    if (!job) {
      job = await Job.findOne({ slug: jobId });
    }
    if (!job) {
      throw ApiError.notFound('Job opening not found.');
    }

    const jId = job._id ? job._id.toString() : job.id.toString();
    const previousStatus = job.status;

    job.status = 'closed';
    job.closedAt = new Date();
    await job.save();

    // Record audit log
    await adminAuditService.record({
      actor: actorUser,
      action: 'job_admin_closed',
      resourceType: 'job',
      resourceId: jId,
      previousState: { status: previousStatus },
      newState: { status: 'closed' },
      reason,
      req
    });

    return {
      id: jId,
      title: job.title,
      status: job.status,
      closedAt: job.closedAt
    };
  }
}

module.exports = new AdminService();
