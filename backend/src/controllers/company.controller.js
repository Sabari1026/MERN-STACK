/**
 * Company Controller for HireConnect
 * Handles company registration, public discovery, profile edits, memberships, and branding assets.
 */

const companyService = require('../services/company.service');
const {
  createCompanySchema,
  updateCompanySchema,
  verificationRequestSchema,
  inviteMemberSchema,
  updateMemberRoleSchema
} = require('../validators/company.validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

class CompanyController {
  /**
   * Register a new company.
   * POST /api/companies (and POST /api/companies/register)
   */
  createCompany = asyncHandler(async (req, res) => {
    const validatedData = createCompanySchema.parse(req.body);
    const { company, membership } = await companyService.createCompany(validatedData, req.user);

    return res.status(201).json({
      success: true,
      message: 'Company registered successfully and awaiting verification.',
      data: { company, membership },
      company
    });
  });

  /**
   * Public company discovery with search, filter, and pagination.
   * GET /api/companies
   */
  getCompanies = asyncHandler(async (req, res) => {
    const { search, q, industry, location, companySize, verified, page, limit, sort } = req.query;

    const result = await companyService.getCompanies({
      search,
      q,
      industry,
      location,
      companySize,
      verified,
      page,
      limit,
      sort
    });

    return res.status(200).json({
      success: true,
      message: 'Companies retrieved successfully',
      ...result,
      data: result
    });
  });

  /**
   * Get public company details by slug or ID.
   * GET /api/companies/:slugOrId
   */
  getCompanyDetails = asyncHandler(async (req, res) => {
    const { slugOrId } = req.params;
    const company = await companyService.getCompanyBySlugOrId(slugOrId);

    if (!company) {
      throw ApiError.notFound('Company not found.');
    }

    const Job = require('../models/job.model');
    const compId = company._id || company.id;
    const jobs = await Job.find({ company: compId, status: 'published' }).sort({ publishedAt: -1 }).limit(25);

    return res.status(200).json({
      success: true,
      company,
      jobs: jobs || [],
      data: { company, jobs: jobs || [] }
    });
  });

  /**
   * Update permitted company fields.
   * PATCH /api/companies/:id (and PUT /api/companies/:id)
   */
  updateCompany = asyncHandler(async (req, res) => {
    const validatedData = updateCompanySchema.parse(req.body);
    const updatedCompany = await companyService.updateCompany(req.params.id, validatedData, req.user);

    return res.status(200).json({
      success: true,
      message: 'Company profile updated successfully.',
      company: updatedCompany,
      data: { company: updatedCompany }
    });
  });

  /**
   * Retrieve authorized company management data.
   * GET /api/companies/:id/manage
   */
  getCompanyManage = asyncHandler(async (req, res) => {
    const manageData = await companyService.getCompanyManageData(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      message: 'Company management data loaded.',
      data: manageData
    });
  });

  /**
   * Submit verification request.
   * POST /api/companies/:id/verification-request
   */
  submitVerification = asyncHandler(async (req, res) => {
    const validatedData = verificationRequestSchema.parse(req.body);
    const request = await companyService.submitVerificationRequest(req.params.id, validatedData, req.user);

    return res.status(201).json({
      success: true,
      message: 'Company verification request submitted successfully and queued for administrative review.',
      data: { request }
    });
  });

  /**
   * Upload company logo.
   * POST /api/companies/:id/logo
   */
  uploadLogo = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw ApiError.badRequest('Logo image file is required.');
    }

    const result = await companyService.uploadLogo(req.params.id, req.file, req.user);

    return res.status(200).json({
      success: true,
      message: 'Company logo uploaded successfully.',
      data: result
    });
  });

  /**
   * Remove company logo.
   * DELETE /api/companies/:id/logo
   */
  deleteLogo = asyncHandler(async (req, res) => {
    const result = await companyService.deleteLogo(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result
    });
  });

  /**
   * List authorized company members.
   * GET /api/companies/:id/members
   */
  listMembers = asyncHandler(async (req, res) => {
    const manageData = await companyService.getCompanyManageData(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      message: 'Company members retrieved.',
      data: { members: manageData.members }
    });
  });

  /**
   * Create member invitation.
   * POST /api/companies/:id/invitations
   */
  inviteMember = asyncHandler(async (req, res) => {
    const validatedData = inviteMemberSchema.parse(req.body);
    const { invitation, invitationToken } = await companyService.inviteMember(
      req.params.id,
      validatedData,
      req.user
    );

    return res.status(201).json({
      success: true,
      message: 'Invitation created successfully.',
      data: {
        invitation,
        invitationToken,
        acceptUrl: `/companies/invitations/accept?token=${invitationToken}`
      }
    });
  });

  /**
   * Accept an invitation using token.
   * POST /api/companies/invitations/accept
   */
  acceptInvitation = asyncHandler(async (req, res) => {
    const token = req.body.token || req.query.token;
    if (!token) {
      throw ApiError.badRequest('Invitation token is required.');
    }

    const membership = await companyService.acceptInvitation(token, req.user);

    return res.status(200).json({
      success: true,
      message: 'Company invitation accepted successfully.',
      data: { membership }
    });
  });

  /**
   * Update member role.
   * PATCH /api/companies/:id/members/:userId
   */
  updateMemberRole = asyncHandler(async (req, res) => {
    const { membershipRole } = updateMemberRoleSchema.parse(req.body);
    const updatedMembership = await companyService.updateMemberRole(
      req.params.id,
      req.params.userId,
      membershipRole,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: 'Member role updated successfully.',
      data: { membership: updatedMembership }
    });
  });

  /**
   * Remove member.
   * DELETE /api/companies/:id/members/:userId
   */
  removeMember = asyncHandler(async (req, res) => {
    const result = await companyService.removeMember(req.params.id, req.params.userId, req.user);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result
    });
  });
}

module.exports = new CompanyController();
