/**
 * Company Authorization Middleware for HireConnect
 * Enforces company membership, role hierarchies, and publication prerequisites.
 */

const Company = require('../models/company.model');
const CompanyMembership = require('../models/companyMembership.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Ensures the authenticated user is an active member of the target company
 * with one of the allowed membership roles.
 */
function requireCompanyMembership(allowedRoles = []) {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required.');
    }

    const companyId = req.params.id || req.params.companyId || req.body.companyId;
    if (!companyId) {
      throw ApiError.badRequest('Company identifier is required.');
    }

    let company = null;
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(companyId)) {
      company = await Company.findById(companyId);
    }
    if (!company) {
      company = await Company.findOne({
        $or: [
          { slug: companyId },
          { slug: String(companyId).replace(/^comp-/, '') },
          { id: companyId }
        ]
      });
    }

    if (!company) {
      throw ApiError.notFound('Company not found.');
    }
    req.company = company;

    // Platform administrators bypass company-specific membership checks
    if (req.user.role === 'admin') {
      req.companyMembership = {
        company: company._id || company.id,
        user: req.user._id || req.user.id,
        membershipRole: 'owner',
        status: 'active'
      };
      return next();
    }

    const membership = await CompanyMembership.findOne({
      company: company._id || company.id,
      user: req.user._id || req.user.id,
      status: 'active'
    });

    if (!membership) {
      throw ApiError.forbidden('You are not an active member of this organization.');
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(membership.membershipRole)) {
      throw ApiError.forbidden(`Operation requires one of the following company roles: ${allowedRoles.join(', ')}.`);
    }

    req.companyMembership = membership;
    next();
  });
}

/**
 * Ensures the company has achieved authoritative verified status.
 * Required for Phase 5 job publishing.
 */
function requireVerifiedCompanyForPublishing() {
  return asyncHandler(async (req, res, next) => {
    const company = req.company || (await Company.findById(req.params.id || req.params.companyId));
    if (!company) {
      throw ApiError.notFound('Company not found.');
    }

    if (company.verificationStatus !== 'verified') {
      throw ApiError.forbidden(
        'Company is not verified. Authoritative job publishing requires an approved verification status.'
      );
    }

    next();
  });
}

module.exports = {
  requireCompanyMembership,
  requireVerifiedCompanyForPublishing
};
