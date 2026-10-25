/**
 * Admin Company Verification Controller for HireConnect
 * Manages administrative review queue, audit inspections, and company verification approvals.
 */

const CompanyVerificationRequest = require('../models/companyVerification.model');
const Company = require('../models/company.model');
const User = require('../models/user.model');
const companyService = require('../services/company.service');
const { reviewVerificationSchema } = require('../validators/company.validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

class AdminCompanyController {
  /**
   * List company verification requests.
   * GET /api/admin/company-verification-requests
   */
  listRequests = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const query = status ? { status } : {};
    const requests = await CompanyVerificationRequest.find(query);

    const detailedRequests = [];
    for (const r of requests) {
      const comp = await Company.findById(r.company);
      const requester = await User.findById(r.requestedBy);
      detailedRequests.push({
        id: r.id,
        status: r.status,
        officialEmail: r.officialEmail,
        website: r.website,
        businessRegistrationNumber: r.businessRegistrationNumber,
        contactPhone: r.contactPhone,
        reviewerNotes: r.reviewerNotes,
        createdAt: r.createdAt,
        company: comp
          ? {
              id: comp._id || comp.id,
              name: comp.name,
              slug: comp.slug,
              industry: comp.industry,
              verificationStatus: comp.verificationStatus
            }
          : null,
        requester: requester
          ? {
              id: requester._id || requester.id,
              name: requester.name,
              email: requester.email
            }
          : null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Verification requests retrieved successfully.',
      data: { requests: detailedRequests }
    });
  });

  /**
   * Get verification request by ID.
   * GET /api/admin/company-verification-requests/:id
   */
  getRequestDetails = asyncHandler(async (req, res) => {
    const request = await CompanyVerificationRequest.findById(req.params.id);
    if (!request) {
      throw ApiError.notFound('Verification request not found.');
    }

    const comp = await Company.findById(request.company);
    const requester = await User.findById(request.requestedBy);

    return res.status(200).json({
      success: true,
      message: 'Verification request details retrieved.',
      data: {
        request,
        company: comp ? (comp.toPublicJSON ? comp.toPublicJSON() : comp) : null,
        requester: requester
          ? {
              id: requester._id || requester.id,
              name: requester.name,
              email: requester.email
            }
          : null
      }
    });
  });

  /**
   * Review and decide on a company verification request.
   * PATCH /api/admin/company-verification-requests/:id
   */
  reviewRequest = asyncHandler(async (req, res) => {
    const validatedData = reviewVerificationSchema.parse(req.body);
    const result = await companyService.reviewVerificationRequest(
      req.params.id,
      validatedData,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: `Company verification status updated to ${validatedData.status}.`,
      data: result
    });
  });
}

module.exports = new AdminCompanyController();
