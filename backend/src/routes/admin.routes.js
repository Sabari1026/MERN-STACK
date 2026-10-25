/**
 * Administrative Routes for HireConnect (Phase 10)
 * Mounts secure admin endpoints under /api/admin
 * Every endpoint strictly requires authentication and the 'admin' role.
 */

const express = require('express');
const adminController = require('../controllers/admin.controller');
const analyticsController = require('../controllers/analytics.controller');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Enforce strict administrative authorization boundary
router.use(authenticate, requireRole('admin'));

// 1. Dashboard Metrics
router.get('/dashboard', adminController.getDashboardStats);

// Phase 11: Analytics & Reports
router.get('/analytics/overview', analyticsController.getAdminOverview);
router.get('/analytics/recruitment-funnel', analyticsController.getAdminRecruitmentFunnel);
router.get('/analytics/export', analyticsController.exportAdminReport);

// 2. User Management
router.get('/users', adminController.listUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.patch('/users/:userId/status', adminController.updateUserStatus);
router.patch('/users/:userId/role', adminController.updateUserRole);

// 3. Company Governance & Verification
router.get('/companies', adminController.listCompanies);
router.get('/companies/verification-requests', adminController.listVerificationRequests);
router.get('/companies/:companyId', adminController.getCompanyDetails);
router.patch('/companies/:companyId/verification', adminController.reviewCompanyVerification);

// 4. Job Moderation
router.get('/jobs', adminController.listJobs);
router.get('/jobs/:jobId', adminController.getJobDetails);
router.patch('/jobs/:jobId/moderation', adminController.moderateJob);
router.post('/jobs/:jobId/close', adminController.closeJob);

// 5. Audit Logging
router.get('/audit-logs', adminController.listAuditLogs);

module.exports = router;
