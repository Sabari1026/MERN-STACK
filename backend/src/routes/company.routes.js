/**
 * Company Routes for HireConnect
 * Exposes endpoints for company registration, public discovery, profile edits, memberships, and branding assets.
 */

const express = require('express');
const companyController = require('../controllers/company.controller');
const { authenticate, requireRole } = require('../middleware/auth');
const { requireCompanyMembership } = require('../middleware/companyAuth.middleware');
const { uploadLimiter } = require('../middleware/rateLimiter');
const { handleAvatarUpload } = require('../middleware/upload.middleware');
const storageService = require('../services/storage.service');
const ApiError = require('../utils/ApiError');

const router = express.Router();

// ============================================================================
// PUBLIC DISCOVERY & STATIC STREAMING
// ============================================================================
router.get('/', companyController.getCompanies);

// Public company logo streaming with caching
router.get('/logo/:key', (req, res, next) => {
  try {
    const { key } = req.params;
    if (!key || !/^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/.test(key)) {
      throw ApiError.badRequest('Invalid logo key format.');
    }

    const stream = storageService.createReadStream(key, 'avatars');
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    if (key.endsWith('.png')) res.setHeader('Content-Type', 'image/png');
    else if (key.endsWith('.webp')) res.setHeader('Content-Type', 'image/webp');
    else res.setHeader('Content-Type', 'image/jpeg');

    stream.on('error', (err) => {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ success: false, message: 'Logo not found' });
      }
      next(err);
    });

    stream.pipe(res);
  } catch (err) {
    next(err);
  }
});

const analyticsController = require('../controllers/analytics.controller');

// Accept membership invitation (authenticated user)
router.post('/invitations/accept', authenticate, companyController.acceptInvitation);

// Company registration (Recruiter or Admin only)
router.post('/', authenticate, requireRole('recruiter', 'admin'), companyController.createCompany);
router.post('/register', authenticate, requireRole('recruiter', 'admin'), companyController.createCompany);

// Phase 11: Company Analytics
router.get('/:companyId/analytics', authenticate, analyticsController.getCompanyAnalytics);

// Public company details by slug or ID
router.get('/:slugOrId', companyController.getCompanyDetails);

// ============================================================================
// PROTECTED COMPANY OPERATIONS (Requires Company Membership)
// ============================================================================

// Update company profile (Owner or Admin)
router.patch('/:id', authenticate, requireCompanyMembership(['owner', 'admin']), companyController.updateCompany);
router.put('/:id', authenticate, requireCompanyMembership(['owner', 'admin']), companyController.updateCompany);

// Internal management view (Owner or Admin)
router.get('/:id/manage', authenticate, requireCompanyMembership(['owner', 'admin']), companyController.getCompanyManage);

// Verification request submission (Owner or Admin)
router.post('/:id/verification-request', authenticate, requireCompanyMembership(['owner', 'admin']), companyController.submitVerification);

// Company logo upload & deletion (Owner or Admin, rate-limited)
router.post('/:id/logo', authenticate, requireCompanyMembership(['owner', 'admin']), uploadLimiter, handleAvatarUpload, companyController.uploadLogo);
router.delete('/:id/logo', authenticate, requireCompanyMembership(['owner', 'admin']), companyController.deleteLogo);

// Members management
router.get('/:id/members', authenticate, requireCompanyMembership(['owner', 'admin', 'recruiter']), companyController.listMembers);
router.post('/:id/invitations', authenticate, requireCompanyMembership(['owner', 'admin']), companyController.inviteMember);
router.patch('/:id/members/:userId', authenticate, requireCompanyMembership(['owner']), companyController.updateMemberRole);
router.delete('/:id/members/:userId', authenticate, requireCompanyMembership(['owner', 'admin']), companyController.removeMember);

module.exports = router;
