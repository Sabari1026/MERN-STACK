/**
 * Company Service for HireConnect
 * Handles company creation, search & filtering, verification workflows, membership management, and branding assets.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Company = require('../models/company.model');
const CompanyMembership = require('../models/companyMembership.model');
const CompanyInvitation = require('../models/companyInvitation.model');
const CompanyVerificationRequest = require('../models/companyVerification.model');
const CompanyAuditLog = require('../models/companyAudit.model');
const RecruiterProfile = require('../models/recruiterProfile.model');
const User = require('../models/user.model');
const notificationService = require('./notification.service');
const storageService = require('./storage.service');
const { validateImageBuffer, sanitizeFilename } = require('../utils/fileValidation');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

// Load seed data if empty
async function seedCompaniesIfEmpty() {
  try {
    const count = await Company.countDocuments();
    if (count > 0) return;

    const internalSeedPath = path.join(__dirname, '..', 'data', 'hireconnect_db.json');
    const rootSeedPath = path.join(__dirname, '..', '..', '..', 'data', 'hireconnect_db.json');
    const seedPath = fs.existsSync(internalSeedPath) ? internalSeedPath : rootSeedPath;
    let seedCompanies = [];
    if (fs.existsSync(seedPath)) {
      const raw = fs.readFileSync(seedPath, 'utf8');
      const parsed = JSON.parse(raw);
      seedCompanies = parsed.companies || [];
    }

    if (seedCompanies.length === 0) {
      // Fallback minimal seed
      seedCompanies = [
        {
          name: 'Razorpay',
          industry: 'FinTech',
          category: 'FinTech & Payments',
          website: 'https://razorpay.com',
          locations: ['Bengaluru, Karnataka', 'Remote - India'],
          description: 'Razorpay is India\'s leading full-stack financial solutions company.',
          verified: true,
          techStack: ['Go', 'Python', 'React', 'Kubernetes']
        },
        {
          name: 'Zerodha',
          industry: 'FinTech',
          category: 'FinTech & Stock Trading',
          website: 'https://zerodha.com',
          locations: ['Bengaluru, Karnataka', 'Remote - India'],
          description: 'Zerodha is India\'s largest retail stockbroker.',
          verified: true,
          techStack: ['Go', 'Python', 'PostgreSQL', 'Vue.js']
        }
      ];
    }

    for (const item of seedCompanies) {
      const slug = item.slug || Company.slugify(item.name);
      await Company.create({
        _id: item.id || undefined,
        id: item.id || undefined,
        name: item.name,
        slug,
        description: item.description || '',
        culture: item.culture || '',
        website: item.website || '',
        industry: item.industry || item.category || 'Technology',
        category: item.category || item.industry || 'Technology',
        companySize: item.teamSize || item.companySize || '500+ employees',
        teamSize: item.teamSize || item.companySize || '500+ employees',
        foundedYear: item.foundedYear || '',
        locations: Array.isArray(item.locations) ? item.locations : ['Bengaluru, Karnataka'],
        workModes: Array.isArray(item.workModes) ? item.workModes : ['Hybrid'],
        logoUrl: item.logoUrl || '',
        benefits: Array.isArray(item.benefits) ? item.benefits : [],
        techStack: Array.isArray(item.techStack) ? item.techStack : [],
        activeJobsCount: item.activeJobsCount || 0,
        verificationStatus: item.verified ? 'verified' : 'pending',
        verified: !!item.verified,
        verificationMethod: item.verified ? 'manual_audit' : null,
        verifiedAt: item.verified ? new Date() : null,
        createdBy: null
      });
    }
    logger.info(`[CompanyService] Successfully seeded initial company database with ${seedCompanies.length} records.`);
  } catch (err) {
    logger.warn('[CompanyService] Seed load warning:', err.message);
  }
}

// Automatically trigger seed check on initialization
seedCompaniesIfEmpty();

class CompanyService {
  /**
   * Register a new company and assign the creator as owner.
   */
  async createCompany(data, user) {
    if (!user || (user.role !== 'recruiter' && user.role !== 'admin')) {
      throw ApiError.forbidden('Only recruiters or administrators can register new companies.');
    }

    const normalized = data.name.toLowerCase().trim();
    const existing = await Company.findOne({ normalizedName: normalized });
    if (existing) {
      throw ApiError.conflict(
        `A company named "${data.name}" already exists on HireConnect. You can request membership from an existing administrator or contact support.`
      );
    }

    const slug = await Company.generateUniqueSlug(data.name);

    const companyData = {
      ...data,
      slug,
      verificationStatus: 'pending',
      verified: false,
      verifiedAt: null,
      verifiedBy: null,
      verificationMethod: null,
      createdBy: user._id || user.id
    };

    const company = await Company.create(companyData);

    // Create owner membership for creator
    const membership = await CompanyMembership.create({
      company: company._id || company.id,
      user: user._id || user.id,
      membershipRole: 'owner',
      status: 'active'
    });

    // Update recruiter profile association if recruiter
    if (user.role === 'recruiter') {
      try {
        const recruiterProfile = await RecruiterProfile.findOne({ user: user._id || user.id });
        if (recruiterProfile) {
          recruiterProfile.company = company._id || company.id;
          recruiterProfile.companyName = company.name;
          if (company.website) recruiterProfile.website = company.website;
          await recruiterProfile.save();
        }
      } catch (e) {
        logger.warn('[CompanyService] Failed to auto-link company to recruiter profile:', e.message);
      }
    }

    // Record audit event
    await CompanyAuditLog.create({
      eventType: 'COMPANY_CREATED',
      company: company._id || company.id,
      actorId: user._id || user.id,
      actorEmail: user.email,
      actorRole: user.role,
      metadata: { name: company.name, slug: company.slug },
      outcome: 'success'
    });

    return { company, membership };
  }

  /**
   * Search and list companies with filters, sorting, and pagination.
   */
  async getCompanies({ search, q, industry, location, companySize, verified, page = 1, limit = 12, sort = '-createdAt' }) {
    const queryTerm = (search || q || '').toLowerCase().trim();
    const cleanPage = Math.max(1, parseInt(page, 10) || 1);
    const cleanLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));

    // Fetch candidate records
    const all = await Company.find();
    let filtered = all.filter((comp) => {
      // Search term
      if (queryTerm) {
        const matchesName = (comp.name || '').toLowerCase().includes(queryTerm);
        const matchesCat = (comp.category || '').toLowerCase().includes(queryTerm) ||
                           (comp.industry || '').toLowerCase().includes(queryTerm);
        const matchesDesc = (comp.description || '').toLowerCase().includes(queryTerm);
        const matchesTech = Array.isArray(comp.techStack) && comp.techStack.some((t) => t.toLowerCase().includes(queryTerm));
        const matchesLoc = Array.isArray(comp.locations) && comp.locations.some((l) => l.toLowerCase().includes(queryTerm));
        if (!matchesName && !matchesCat && !matchesDesc && !matchesTech && !matchesLoc) return false;
      }

      // Industry filter
      if (industry && industry !== 'all') {
        const cleanInd = industry.toLowerCase();
        const matchesInd = (comp.industry && comp.industry.toLowerCase().includes(cleanInd)) ||
                           (comp.category && comp.category.toLowerCase().includes(cleanInd));
        if (!matchesInd) return false;
      }

      // Location filter
      if (location && location !== 'all') {
        const cleanLoc = location.toLowerCase();
        const matchesLoc = Array.isArray(comp.locations) && comp.locations.some((l) => l.toLowerCase().includes(cleanLoc));
        if (!matchesLoc) return false;
      }

      // Company size filter
      if (companySize && companySize !== 'all') {
        if (comp.companySize !== companySize && comp.teamSize !== companySize) return false;
      }

      // Verified filter
      if (verified === true || verified === 'true') {
        if (comp.verificationStatus !== 'verified') return false;
      }

      return true;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / cleanLimit) || 1;
    const startIndex = (cleanPage - 1) * cleanLimit;
    const paginated = filtered.slice(startIndex, startIndex + cleanLimit);

    const safeCompanies = paginated.map((c) => (c.toPublicJSON ? c.toPublicJSON() : c));

    return {
      companies: safeCompanies,
      total,
      page: cleanPage,
      limit: cleanLimit,
      totalPages,
      verifiedCount: filtered.filter((c) => c.verificationStatus === 'verified').length
    };
  }

  /**
   * Retrieve company details by slug or database ID.
   */
  async getCompanyBySlugOrId(identifier) {
    if (!identifier) return null;
    const idStr = identifier.toString();

    let company = await Company.findOne({ slug: idStr.toLowerCase() });
    if (!company) {
      company = await Company.findById(idStr);
    }
    if (!company && idStr.startsWith('comp-')) {
      const cleanSlug = idStr.replace(/^comp-/, '');
      company = await Company.findOne({ slug: cleanSlug });
    }

    if (!company) return null;
    return company.toPublicJSON ? company.toPublicJSON() : company;
  }

  /**
   * Update permitted company fields.
   */
  async updateCompany(companyId, updateData, user) {
    const company = await Company.findById(companyId);
    if (!company) {
      throw ApiError.notFound('Company not found.');
    }

    // Apply allowed fields safely
    Object.keys(updateData).forEach((field) => {
      company[field] = updateData[field];
    });

    await company.save();

    await CompanyAuditLog.create({
      eventType: 'COMPANY_UPDATED',
      company: company._id || company.id,
      actorId: user._id || user.id,
      actorEmail: user.email,
      actorRole: user.role,
      metadata: { updatedFields: Object.keys(updateData) },
      outcome: 'success'
    });

    return company.toPublicJSON ? company.toPublicJSON() : company;
  }

  /**
   * Retrieve internal management data for authorized company members.
   */
  async getCompanyManageData(companyId, user) {
    const company = await Company.findById(companyId);
    if (!company) throw ApiError.notFound('Company not found.');

    const memberships = await CompanyMembership.find({ company: company._id || company.id });
    const membersWithUsers = [];

    for (const mem of memberships) {
      const u = await User.findById(mem.user);
      membersWithUsers.push({
        id: mem.id,
        user: {
          id: mem.user,
          name: u ? u.name : 'Team Member',
          email: u ? u.email : '',
          role: u ? u.role : ''
        },
        membershipRole: mem.membershipRole,
        status: mem.status,
        createdAt: mem.createdAt
      });
    }

    const verificationRequest = await CompanyVerificationRequest.findOne({ company: company._id || company.id });

    return {
      company: company.toJSON ? company.toJSON() : company,
      members: membersWithUsers,
      verificationRequest: verificationRequest || null
    };
  }

  /**
   * Submit a company verification request.
   */
  async submitVerificationRequest(companyId, data, user) {
    const company = await Company.findById(companyId);
    if (!company) throw ApiError.notFound('Company not found.');

    if (company.verificationStatus === 'verified') {
      throw ApiError.badRequest('This company is already verified.');
    }

    const pendingRequest = await CompanyVerificationRequest.findOne({
      company: company._id || company.id,
      status: { $in: ['pending', 'under_review'] }
    });

    if (pendingRequest) {
      throw ApiError.badRequest('A verification request for this organization is already pending review.');
    }

    const request = await CompanyVerificationRequest.create({
      company: company._id || company.id,
      requestedBy: user._id || user.id,
      officialEmail: data.officialEmail,
      website: data.website || company.website,
      businessRegistrationNumber: data.businessRegistrationNumber || '',
      contactPhone: data.contactPhone || '',
      status: 'pending'
    });

    company.verificationStatus = 'under_review';
    await company.save();

    await CompanyAuditLog.create({
      eventType: 'VERIFICATION_REQUESTED',
      company: company._id || company.id,
      actorId: user._id || user.id,
      actorEmail: user.email,
      actorRole: user.role,
      metadata: { officialEmail: data.officialEmail },
      outcome: 'success'
    });

    return request;
  }

  /**
   * Administrative review of a company verification request.
   */
  async reviewVerificationRequest(requestId, { status, reviewerNotes, verificationMethod }, adminUser) {
    const request = await CompanyVerificationRequest.findById(requestId);
    if (!request) throw ApiError.notFound('Verification request not found.');

    const company = await Company.findById(request.company);
    if (!company) throw ApiError.notFound('Associated company record not found.');

    // Allowed status transitions
    const validTransitions = {
      pending: ['under_review', 'verified', 'rejected'],
      under_review: ['verified', 'rejected'],
      verified: ['suspended'],
      suspended: ['under_review', 'verified'],
      rejected: ['under_review', 'pending']
    };

    const allowed = validTransitions[request.status] || [];
    if (!allowed.includes(status)) {
      throw ApiError.badRequest(`Cannot transition verification request from ${request.status} to ${status}.`);
    }

    request.status = status;
    request.reviewerNotes = reviewerNotes || '';
    request.reviewedBy = adminUser._id || adminUser.id;
    request.reviewedAt = new Date();
    await request.save();

    company.verificationStatus = status;
    company.verified = status === 'verified';
    if (status === 'verified') {
      company.verifiedAt = new Date();
      company.verifiedBy = adminUser._id || adminUser.id;
      company.verificationMethod = verificationMethod || 'manual_audit';
    } else if (status === 'rejected' || status === 'suspended') {
      company.verified = false;
      company.verifiedAt = null;
    }
    await company.save();

    const eventType =
      status === 'verified'
        ? 'VERIFICATION_APPROVED'
        : status === 'rejected'
        ? 'VERIFICATION_REJECTED'
        : 'VERIFICATION_SUSPENDED';

    await CompanyAuditLog.create({
      eventType,
      company: company._id || company.id,
      actorId: adminUser._id || adminUser.id,
      actorEmail: adminUser.email,
      actorRole: adminUser.role,
      metadata: { status, notes: reviewerNotes },
      outcome: 'success'
    });

    // Dispatch verification outcome notification (Phase 9)
    const ownerId = request.requestedBy || company.createdBy;
    if (ownerId) {
      User.findById(ownerId).then((ownerUser) => {
        if (ownerUser) {
          notificationService.notifyCompanyVerificationUpdated({
            company,
            owner: ownerUser,
            status,
            reviewNotes: reviewerNotes
          }).catch((e) => logger.warn(`[CompanyService] Verification notification error: ${e.message}`));
        }
      }).catch(() => {});
    }

    return { request, company: company.toPublicJSON ? company.toPublicJSON() : company };
  }

  /**
   * Upload and link company logo.
   */
  async uploadLogo(companyId, file, user) {
    const company = await Company.findById(companyId);
    if (!company) throw ApiError.notFound('Company not found.');

    const validation = validateImageBuffer(file.buffer, 5 * 1024 * 1024);
    if (!validation.valid) {
      throw ApiError.badRequest(validation.error || 'Invalid image file.', 'VALIDATION_ERROR');
    }

    const sanitizedName = sanitizeFilename(file.originalname || `logo.${validation.format}`);

    const stored = await storageService.saveFile({
      buffer: file.buffer,
      originalFilename: sanitizedName,
      mimeType: validation.mimeType,
      folder: 'avatars'
    });

    const key = path.basename(stored.storageKey);
    const logoUrl = `/api/users/avatar/${key}`;

    // Remove old logo if key exists
    if (company.logoStorageKey) {
      await storageService.deleteFile(company.logoStorageKey, 'avatars');
    }

    company.logoStorageKey = stored.storageKey;
    company.logoUrl = logoUrl;
    await company.save();

    await CompanyAuditLog.create({
      eventType: 'LOGO_UPLOADED',
      company: company._id || company.id,
      actorId: user._id || user.id,
      actorEmail: user.email,
      actorRole: user.role,
      metadata: { storageKey: stored.storageKey, sizeBytes: file.buffer.length },
      outcome: 'success'
    });

    return { logoUrl: company.logoUrl };
  }

  /**
   * Remove company logo.
   */
  async deleteLogo(companyId, user) {
    const company = await Company.findById(companyId);
    if (!company) throw ApiError.notFound('Company not found.');

    if (company.logoStorageKey) {
      await storageService.deleteFile(company.logoStorageKey, 'avatars');
    }

    company.logoStorageKey = null;
    company.logoUrl = '';
    await company.save();

    await CompanyAuditLog.create({
      eventType: 'LOGO_DELETED',
      company: company._id || company.id,
      actorId: user._id || user.id,
      actorEmail: user.email,
      actorRole: user.role,
      outcome: 'success'
    });

    return { success: true, message: 'Company logo removed.' };
  }

  /**
   * Invite a new member to join the company.
   */
  async inviteMember(companyId, { email, role }, user) {
    const company = await Company.findById(companyId);
    if (!company) throw ApiError.notFound('Company not found.');

    const cleanEmail = email.toLowerCase().trim();

    // Check if user is already an active member
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      const activeMem = await CompanyMembership.findOne({
        company: company._id || company.id,
        user: existingUser._id || existingUser.id,
        status: 'active'
      });
      if (activeMem) {
        throw ApiError.badRequest('This user is already an active member of this organization.');
      }
    }

    // Generate secure unpredictable single-use invitation token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = CompanyInvitation.hashToken(rawToken);

    const invitation = await CompanyInvitation.create({
      company: company._id || company.id,
      email: cleanEmail,
      role: role || 'recruiter',
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      invitedBy: user._id || user.id,
      status: 'pending'
    });

    await CompanyAuditLog.create({
      eventType: 'MEMBERSHIP_INVITED',
      company: company._id || company.id,
      actorId: user._id || user.id,
      actorEmail: user.email,
      actorRole: user.role,
      metadata: { inviteeEmail: cleanEmail, role },
      outcome: 'success'
    });

    return {
      invitation,
      invitationToken: rawToken
    };
  }

  /**
   * Accept a company invitation using the verification token.
   */
  async acceptInvitation(rawToken, user) {
    if (!user) throw ApiError.unauthorized('Authentication required.');

    const tokenHash = CompanyInvitation.hashToken(rawToken);
    const invitation = await CompanyInvitation.findOne({ tokenHash, status: 'pending' });

    if (!invitation) {
      throw ApiError.badRequest('Invalid, consumed, or expired invitation token.');
    }

    if (new Date() > new Date(invitation.expiresAt)) {
      invitation.status = 'expired';
      await invitation.save();
      throw ApiError.badRequest('This invitation has expired.');
    }

    if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      throw ApiError.forbidden('This invitation was addressed to a different email address.');
    }

    invitation.status = 'accepted';
    await invitation.save();

    let membership = await CompanyMembership.findOne({
      company: invitation.company,
      user: user._id || user.id
    });

    if (membership) {
      membership.membershipRole = invitation.role;
      membership.status = 'active';
      await membership.save();
    } else {
      membership = await CompanyMembership.create({
        company: invitation.company,
        user: user._id || user.id,
        membershipRole: invitation.role,
        status: 'active',
        invitedBy: invitation.invitedBy
      });
    }

    await CompanyAuditLog.create({
      eventType: 'MEMBERSHIP_ACCEPTED',
      company: invitation.company,
      actorId: user._id || user.id,
      actorEmail: user.email,
      actorRole: user.role,
      metadata: { role: invitation.role },
      outcome: 'success'
    });

    return membership;
  }

  /**
   * Update a member's role (owner-only operation, protects last owner).
   */
  async updateMemberRole(companyId, targetUserId, newRole, actorUser) {
    const membership = await CompanyMembership.findOne({ company: companyId, user: targetUserId });
    if (!membership) throw ApiError.notFound('Membership not found.');

    // If demoting an owner, verify there is at least one other active owner
    if (membership.membershipRole === 'owner' && newRole !== 'owner') {
      const ownerCount = await CompanyMembership.countDocuments({
        company: companyId,
        membershipRole: 'owner',
        status: 'active'
      });
      if (ownerCount <= 1) {
        throw ApiError.badRequest('Cannot demote the last owner. Transfer ownership or promote another owner first.');
      }
    }

    const previousRole = membership.membershipRole;
    membership.membershipRole = newRole;
    await membership.save();

    await CompanyAuditLog.create({
      eventType: 'MEMBERSHIP_ROLE_CHANGED',
      company: companyId,
      actorId: actorUser._id || actorUser.id,
      actorEmail: actorUser.email,
      actorRole: actorUser.role,
      metadata: { targetUserId, previousRole, newRole },
      outcome: 'success'
    });

    return membership;
  }

  /**
   * Revoke or remove a company member (protects last owner).
   */
  async removeMember(companyId, targetUserId, actorUser) {
    const membership = await CompanyMembership.findOne({ company: companyId, user: targetUserId });
    if (!membership) throw ApiError.notFound('Membership not found.');

    // Prevent removing the last owner
    if (membership.membershipRole === 'owner') {
      const ownerCount = await CompanyMembership.countDocuments({
        company: companyId,
        membershipRole: 'owner',
        status: 'active'
      });
      if (ownerCount <= 1) {
        throw ApiError.badRequest('Cannot remove the sole owner of the organization.');
      }
    }

    await CompanyMembership.deleteOne({ _id: membership._id || membership.id });

    await CompanyAuditLog.create({
      eventType: 'MEMBERSHIP_REVOKED',
      company: companyId,
      actorId: actorUser._id || actorUser.id,
      actorEmail: actorUser.email,
      actorRole: actorUser.role,
      metadata: { targetUserId, removedRole: membership.membershipRole },
      outcome: 'success'
    });

    return { success: true, message: 'Member successfully removed.' };
  }
}

module.exports = new CompanyService();
