/**
 * Automated Admin Dashboard & Platform Management Test Suite for HireConnect (Phase 10)
 *
 * Covers:
 * 1. Admin Security & Role Authorization Gates (401, 403, public admin registration denial)
 * 2. Real-Time Platform Dashboard Metrics (/api/admin/dashboard)
 * 3. User Governance, Account Suspension, Reactivation & Session Invalidation (/api/admin/users)
 * 4. Self-Suspension & Last-Admin Demotion Safeguards
 * 5. Company Administration & Verification Review Workflow (/api/admin/companies)
 * 6. Job Moderation, Listing Removal & Historical Application Preservation (/api/admin/jobs)
 * 7. Administrative Audit Logging & Filterable Activity Trail (/api/admin/audit-logs)
 * 8. Notification & Transactional Email Integration for Administrative Actions
 */

const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const CandidateProfile = require('../src/models/candidateProfile.model');
const Company = require('../src/models/company.model');
const CompanyVerificationRequest = require('../src/models/companyVerification.model');
const Job = require('../src/models/job.model');
const Application = require('../src/models/application.model');
const Meeting = require('../src/models/meeting.model');
const Notification = require('../src/models/notification.model');
const NotificationOutbox = require('../src/models/notificationOutbox.model');
const AdminAuditLog = require('../src/models/adminAuditLog.model');
const emailService = require('../src/services/email.service');
const { generateAccessToken } = require('../src/utils/token');

describe('HireConnect Phase 10: Admin Dashboard & Platform Management', () => {
  let adminUser = null;
  let adminToken = '';
  let candidateUser = null;
  let candidateToken = '';
  let recruiterUser = null;
  let recruiterToken = '';
  let companyDoc = null;
  let jobDoc = null;

  beforeEach(async () => {
    User.__clearMemoryStore();
    CandidateProfile.__clearMemoryStore();
    Company.__clearMemoryStore();
    Job.__clearMemoryStore();
    Application.__clearMemoryStore();
    Meeting.__clearMemoryStore();
    Notification.__clearMemoryStore();
    NotificationOutbox.__clearMemoryStore();
    AdminAuditLog.__clearMemoryStore();
    emailService.clearSentEmails();

    // 1. Seed Platform Administrator
    adminUser = await User.create({
      name: 'Super Administrator',
      email: 'admin@hireconnect.io',
      role: 'admin',
      accountStatus: 'active',
      isEmailVerified: true
    });
    adminToken = generateAccessToken(adminUser);

    // 2. Seed Candidate
    candidateUser = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav.sharma@hireconnect.io',
      role: 'candidate',
      accountStatus: 'active',
      isEmailVerified: true
    });
    candidateToken = generateAccessToken(candidateUser);

    await CandidateProfile.create({
      user: candidateUser._id,
      name: candidateUser.name,
      headline: 'Full Stack Engineer',
      isDiscoverable: true
    });

    // 3. Seed Recruiter
    recruiterUser = await User.create({
      name: 'Priya Mehta',
      email: 'priya.mehta@razorpay.com',
      role: 'recruiter',
      accountStatus: 'active',
      isEmailVerified: true
    });
    recruiterToken = generateAccessToken(recruiterUser);

    // 4. Seed Company & Job
    companyDoc = await Company.create({
      name: 'Razorpay Software',
      slug: 'razorpay',
      industry: 'FinTech',
      verificationStatus: 'pending',
      createdBy: recruiterUser._id
    });

    jobDoc = await Job.create({
      title: 'Senior Frontend Architect',
      company: companyDoc._id,
      createdBy: recruiterUser._id,
      recruiter: recruiterUser._id,
      status: 'published'
    });
  });

  // ==========================================================================
  // 1. ADMIN AUTHORIZATION GATES & REGISTRATION SAFEGUARDS
  // ==========================================================================
  describe('1. Admin Authorization Gates & Registration Safeguards', () => {
    it('should reject unauthenticated request to /api/admin/dashboard with 401', async () => {
      const res = await request(app).get('/api/admin/dashboard');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject candidate requesting /api/admin/dashboard with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should reject recruiter requesting /api/admin/dashboard with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${recruiterToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should allow authorized administrator to access /api/admin/dashboard with 200 OK', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });

    it('should strictly reject public registration attempting to specify admin role', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Hacker Admin',
          email: 'hacker@example.com',
          password: 'Password123!',
          role: 'admin'
        });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ==========================================================================
  // 2. REAL-TIME PLATFORM DASHBOARD METRICS (/api/admin/dashboard)
  // ==========================================================================
  describe('2. Real-Time Platform Dashboard Metrics (/api/admin/dashboard)', () => {
    it('should return accurate database-backed platform metrics', async () => {
      // Add an application and a scheduled meeting
      await Application.create({
        candidate: candidateUser._id,
        job: jobDoc._id,
        status: 'applied'
      });

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);
      await Meeting.create({
        recruiterId: recruiterUser._id,
        candidateId: candidateUser._id,
        title: 'Initial Technical Screen',
        startAt: futureDate,
        endAt: new Date(futureDate.getTime() + 30 * 60000),
        status: 'scheduled'
      });

      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      const metrics = res.body.data;

      // User counts
      expect(metrics.users.total).toBe(3);
      expect(metrics.users.candidates).toBe(1);
      expect(metrics.users.recruiters).toBe(1);
      expect(metrics.users.admins).toBe(1);
      expect(metrics.users.active).toBe(3);
      expect(metrics.users.suspended).toBe(0);

      // Company counts
      expect(metrics.companies.total).toBe(1);
      expect(metrics.companies.pendingVerification).toBe(1);

      // Job counts
      expect(metrics.jobs.total).toBe(1);
      expect(metrics.jobs.published).toBe(1);
      expect(metrics.jobs.moderated).toBe(0);

      // Application counts
      expect(metrics.applications.total).toBe(1);

      // Meeting counts
      expect(metrics.interviews.total).toBe(1);
      expect(metrics.interviews.upcoming).toBe(1);
    });
  });

  // ==========================================================================
  // 3. USER GOVERNANCE & ACCOUNT SUSPENSION (/api/admin/users)
  // ==========================================================================
  describe('3. User Governance & Account Suspension (/api/admin/users)', () => {
    it('GET /api/admin/users should return paginated list omitting sensitive credentials', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.users.length).toBe(3);

      // Verify passwordHash, tokens, refreshTokens are never returned
      for (const u of res.body.data.users) {
        expect(u.passwordHash).toBeUndefined();
        expect(u.refreshTokens).toBeUndefined();
        expect(u.passwordResetTokenHash).toBeUndefined();
      }
    });

    it('GET /api/admin/users should support role and status filtering', async () => {
      const res = await request(app)
        .get('/api/admin/users?role=candidate')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.users.length).toBe(1);
      expect(res.body.data.users[0].email).toBe('aarav.sharma@hireconnect.io');
    });

    it('GET /api/admin/users/:userId should return user details and applications count', async () => {
      const res = await request(app)
        .get(`/api/admin/users/${candidateUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe(candidateUser.email);
      expect(res.body.data.profile).toBeDefined();
    });

    it('PATCH /api/admin/users/:userId/status should suspend user and invalidate access', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${candidateUser._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'suspended', reason: 'Violation of platform terms' });

      expect(res.status).toBe(200);
      expect(res.body.data.accountStatus).toBe('suspended');

      // Attempting to access protected endpoints with suspended candidate token must return 403
      const protectedRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(protectedRes.status).toBe(403);
      expect(protectedRes.body.message).toContain('suspended');

      // Verify audit log created
      const auditLog = await AdminAuditLog.findOne({
        action: 'user_suspended',
        resourceId: candidateUser._id.toString()
      });
      expect(auditLog).toBeDefined();
      expect(auditLog.reason).toBe('Violation of platform terms');
      expect(auditLog.actor.toString()).toBe(adminUser._id.toString());
    });

    it('PATCH /api/admin/users/:userId/status should reactivate suspended user', async () => {
      // Suspend first
      await request(app)
        .patch(`/api/admin/users/${candidateUser._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'suspended' });

      // Reactivate
      const reactivateRes = await request(app)
        .patch(`/api/admin/users/${candidateUser._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'active', reason: 'Appeal approved' });

      expect(reactivateRes.status).toBe(200);
      expect(reactivateRes.body.data.accountStatus).toBe('active');

      // Candidate can now access protected endpoints again
      const testRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(testRes.status).toBe(200);
    });
  });

  // ==========================================================================
  // 4. SELF-SUSPENSION & LAST-ADMIN SAFEGUARDS
  // ==========================================================================
  describe('4. Self-Suspension & Last-Admin Safeguards', () => {
    it('should reject administrator attempting to suspend their own account with 400 Bad Request', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${adminUser._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'suspended', reason: 'Self-lockout attempt' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('cannot suspend their own account');
    });

    it('should reject demoting or suspending the last active administrator', async () => {
      const secondAdmin = await User.create({
        name: 'Second Admin',
        email: 'admin2@hireconnect.io',
        role: 'admin',
        accountStatus: 'active'
      });

      // Suspend one admin when 2 exist: should succeed
      const res1 = await request(app)
        .patch(`/api/admin/users/${secondAdmin._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'suspended', reason: 'Temporary offboard' });
      expect(res1.status).toBe(200);

      // Now only 1 active admin remains (adminUser)
      // Attempting to demote adminUser must be blocked
      const res2 = await request(app)
        .patch(`/api/admin/users/${adminUser._id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'candidate' });
      expect(res2.status).toBe(400);
      expect(res2.body.message).toContain('last remaining active administrator');
    });
  });

  // ==========================================================================
  // 5. COMPANY ADMINISTRATION & VERIFICATION REVIEW (/api/admin/companies)
  // ==========================================================================
  describe('5. Company Administration & Verification Review (/api/admin/companies)', () => {
    it('GET /api/admin/companies should list all companies', async () => {
      const res = await request(app)
        .get('/api/admin/companies')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.companies.length).toBe(1);
      expect(res.body.data.companies[0].name).toBe('Razorpay Software');
    });

    it('PATCH /api/admin/companies/:id/verification should approve company verification', async () => {
      const res = await request(app)
        .patch(`/api/admin/companies/${companyDoc._id}/verification`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'verified',
          notes: 'Corporate certificate and CIN verified against registry.'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.verified).toBe(true);
      expect(res.body.data.verificationStatus).toBe('verified');

      // Verify audit log recorded
      const auditLog = await AdminAuditLog.findOne({
        action: 'company_verified',
        resourceId: companyDoc._id.toString()
      });
      expect(auditLog).toBeDefined();

      // Verify notification sent to company creator
      const notifs = await Notification.find({ recipient: recruiterUser._id });
      expect(notifs.some(n => n.type === 'company_verification_updated')).toBe(true);
    });

    it('PATCH /api/admin/companies/:id/verification should reject company verification', async () => {
      const res = await request(app)
        .patch(`/api/admin/companies/${companyDoc._id}/verification`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'rejected',
          notes: 'Mismatched business registration documents.'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.verified).toBe(false);
      expect(res.body.data.verificationStatus).toBe('rejected');

      const auditLog = await AdminAuditLog.findOne({
        action: 'company_verification_rejected',
        resourceId: companyDoc._id.toString()
      });
      expect(auditLog).toBeDefined();
    });

    it('PATCH /api/admin/companies/:id/verification should suspend company', async () => {
      const res = await request(app)
        .patch(`/api/admin/companies/${companyDoc._id}/verification`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'suspended',
          notes: 'Fraud report confirmed.'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.verified).toBe(false);
      expect(res.body.data.verificationStatus).toBe('suspended');
    });
  });

  // ==========================================================================
  // 6. JOB MODERATION & APPLICATION PRESERVATION (/api/admin/jobs)
  // ==========================================================================
  describe('6. Job Moderation & Application Preservation (/api/admin/jobs)', () => {
    it('GET /api/admin/jobs should list all jobs with moderation states', async () => {
      const res = await request(app)
        .get('/api/admin/jobs')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.jobs.length).toBe(1);
      expect(res.body.data.jobs[0].title).toBe('Senior Frontend Architect');
    });

    it('PATCH /api/admin/jobs/:id/moderation with action:remove removes job from public listings', async () => {
      // First, candidate applies to the job
      const appDoc = await Application.create({
        candidate: candidateUser._id,
        job: jobDoc._id,
        status: 'applied'
      });

      // Admin removes the job for policy violation
      const res = await request(app)
        .patch(`/api/admin/jobs/${jobDoc._id}/moderation`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          action: 'remove',
          reason: 'Misleading compensation disclosures'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.moderationStatus).toBe('removed');
      expect(res.body.data.isModerated).toBe(true);

      // Public GET /api/jobs must NOT include the removed job
      const publicJobsRes = await request(app).get('/api/jobs');
      expect(publicJobsRes.body.data.jobs.some(j => j.id === jobDoc.id || j._id === jobDoc._id)).toBe(false);

      // Applications MUST be completely preserved!
      const candApps = await Application.find({ candidate: candidateUser._id });
      expect(candApps.length).toBe(1);
      expect(candApps[0]._id.toString()).toBe(appDoc._id.toString());

      // Audit log must be recorded
      const auditLog = await AdminAuditLog.findOne({
        action: 'job_moderation_removed',
        resourceId: jobDoc._id.toString()
      });
      expect(auditLog).toBeDefined();
      expect(auditLog.reason).toBe('Misleading compensation disclosures');
    });

    it('PATCH /api/admin/jobs/:id/moderation with action:restore restores job listing', async () => {
      // Remove first
      await request(app)
        .patch(`/api/admin/jobs/${jobDoc._id}/moderation`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ action: 'remove', reason: 'Under review' });

      // Restore
      const restoreRes = await request(app)
        .patch(`/api/admin/jobs/${jobDoc._id}/moderation`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ action: 'restore', reason: 'Employer verified compliance' });

      expect(restoreRes.status).toBe(200);
      expect(restoreRes.body.data.moderationStatus).toBe('approved');
      expect(restoreRes.body.data.isModerated).toBe(false);

      // Now job appears in public discovery again
      const publicJobsRes = await request(app).get('/api/jobs');
      expect(publicJobsRes.body.data.jobs.some(j => j.id === jobDoc.id || j._id === jobDoc._id)).toBe(true);
    });

    it('POST /api/admin/jobs/:id/close should administratively close a job', async () => {
      const res = await request(app)
        .post(`/api/admin/jobs/${jobDoc._id}/close`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: 'Position filled externally' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('closed');
      expect(res.body.data.closedAt).toBeDefined();

      const auditLog = await AdminAuditLog.findOne({
        action: 'job_admin_closed',
        resourceId: jobDoc._id.toString()
      });
      expect(auditLog).toBeDefined();
    });
  });

  // ==========================================================================
  // 7. ADMINISTRATIVE AUDIT LOGS (/api/admin/audit-logs)
  // ==========================================================================
  describe('7. Administrative Audit Logs (/api/admin/audit-logs)', () => {
    it('should reject candidate or recruiter attempting to view audit logs with 403 Forbidden', async () => {
      const candRes = await request(app)
        .get('/api/admin/audit-logs')
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(candRes.status).toBe(403);

      const recRes = await request(app)
        .get('/api/admin/audit-logs')
        .set('Authorization', `Bearer ${recruiterToken}`);
      expect(recRes.status).toBe(403);
    });

    it('should retrieve paginated audit logs with action and resource filtering', async () => {
      // Execute 2 admin operations to generate audit logs
      await request(app)
        .patch(`/api/admin/users/${candidateUser._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'suspended', reason: 'Audit test reason' });

      await request(app)
        .patch(`/api/admin/companies/${companyDoc._id}/verification`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'verified', notes: 'Audit verification test' });

      const res = await request(app)
        .get('/api/admin/audit-logs')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.logs.length).toBe(2);
      expect(res.body.data.logs[0].actorRole).toBe('admin');
      expect(res.body.data.logs[0].actorEmail).toBe(adminUser.email);

      // Filter by action
      const filterRes = await request(app)
        .get('/api/admin/audit-logs?action=user_suspended')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(filterRes.status).toBe(200);
      expect(filterRes.body.data.logs.length).toBe(1);
      expect(filterRes.body.data.logs[0].action).toBe('user_suspended');
    });
  });
});
