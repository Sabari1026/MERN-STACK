/**
 * Central API router for HireConnect
 * Mounts modular route groups for health, authentication, candidates, recruiters, profiles, companies, etc.
 */

const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const candidateRoutes = require('./candidate.routes');
const recruiterRoutes = require('./recruiter.routes');
const userRoutes = require('./user.routes');
const profileRoutes = require('./profile.routes');
const companyRoutes = require('./company.routes');
const adminCompanyRoutes = require('./adminCompany.routes');
const adminRoutes = require('./admin.routes');
const jobRoutes = require('./job.routes');
const recruiterJobRoutes = require('./recruiterJob.routes');
const applicationRoutes = require('./application.routes');
const savedJobRoutes = require('./savedJob.routes');
const matchingRoutes = require('./matching.routes');
const meetingRoutes = require('./meeting.routes');
const notificationRoutes = require('./notification.routes');
const analyticsRoutes = require('./analytics.routes');
const analyticsController = require('../controllers/analytics.controller');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Mount health check endpoints under /api/health
router.use('/health', healthRoutes);

// Mount authentication endpoints under /api/auth
router.use('/auth', authRoutes);

// Mount Candidate profile endpoints under /api/candidates
router.use('/candidates', candidateRoutes);

// Mount Recruiter profile endpoints under /api/recruiters
router.use('/recruiters', recruiterRoutes);

// Mount User & Avatar endpoints under /api/users
router.use('/users', userRoutes);

// Mount Profile & Legacy Compatibility endpoints under /api/profiles and /api/profile
router.use('/profiles', profileRoutes);
router.use('/profile', profileRoutes);

// Mount Company management & discovery endpoints under /api/companies
router.use('/companies', companyRoutes);

// Mount Platform Administration endpoints under /api/admin (Phase 10)
router.use('/admin', adminRoutes);

// Mount Legacy Admin Company Verification queue under /api/admin/company-verification-requests
router.use('/admin/company-verification-requests', adminCompanyRoutes);

// Mount Public Job Discovery & Legacy Compatibility routes under /api/jobs
router.use('/jobs', jobRoutes);

// Mount Recruiter Job Management routes under /api/recruiter/jobs
router.use('/recruiter/jobs', recruiterJobRoutes);

// Mount Application Management routes under /api/applications and /api/recruiter/applications
router.use('/applications', applicationRoutes);
router.use('/recruiter/applications', applicationRoutes);

// Mount Saved Jobs routes under /api/saved-jobs
router.use('/saved-jobs', savedJobRoutes);

// Mount Talent Match & Intelligent Matching routes under /api/matching and /api/talent-match
router.use('/matching', matchingRoutes);
router.use('/talent-match', matchingRoutes);

// Mount Meeting & Real-Time Scheduler routes under /api (Phase 8)
router.use('/', meetingRoutes);

// Mount Notification routes under /api/notifications (Phase 9)
router.use('/notifications', notificationRoutes);

// Mount Analytics routes under /api/analytics (Phase 11)
router.use('/analytics', analyticsRoutes);

// Direct aliases for candidate and recruiter analytics
router.get('/candidate/analytics/overview', authenticate, requireRole('candidate'), analyticsController.getCandidateOverview);
router.get('/recruiter/analytics/overview', authenticate, requireRole('recruiter'), analyticsController.getRecruiterOverview);
router.get('/recruiter/analytics/jobs', authenticate, requireRole('recruiter'), analyticsController.getRecruiterJobsAnalytics);
router.get('/recruiter/analytics/jobs/:jobId/funnel', authenticate, requireRole('recruiter'), analyticsController.getRecruiterJobFunnel);
router.get('/recruiter/analytics/jobs/export', authenticate, requireRole('recruiter'), analyticsController.exportRecruiterJobsReport);

// Convenience root API ping
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to HireConnect Recruitment Platform API',
    version: '1.0.0',
    documentation: '/api/health',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
