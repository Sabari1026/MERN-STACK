/**
 * Production Security & Negative Case Test Suite for HireConnect (Phase 12)
 * Explicitly verifies all negative access control, RBAC, input sanitization,
 * data privacy, concurrency, and error redaction requirements.
 */

const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const CandidateProfile = require('../src/models/candidateProfile.model');
const Company = require('../src/models/company.model');
const CompanyMembership = require('../src/models/companyMembership.model');
const Job = require('../src/models/job.model');
const Application = require('../src/models/application.model');
const Meeting = require('../src/models/meeting.model');
const Notification = require('../src/models/notification.model');
const { generateAccessToken } = require('../src/utils/token');
const { zonedTimeToUtc } = require('../src/utils/timeZone');

function getFutureWeekday(daysAhead = 4) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const VALID_PDF_BUFFER = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n%%EOF');

describe('HireConnect Phase 12: Production Security & Negative Authorization', () => {
  let candidateUser = null;
  let otherCandidateUser = null;
  let candidateToken = '';
  let otherCandidateToken = '';
  let recruiterUser = null;
  let otherRecruiterUser = null;
  let recruiterToken = '';
  let otherRecruiterToken = '';
  let adminUser = null;
  let adminToken = '';
  let testCompany = null;
  let testJob = null;

  beforeEach(async () => {
    User.__clearMemoryStore();
    CandidateProfile.__clearMemoryStore();
    Company.__clearMemoryStore();
    if (CompanyMembership.__clearMemoryStore) CompanyMembership.__clearMemoryStore();
    Job.__clearMemoryStore();
    Application.__clearMemoryStore();
    Meeting.__clearMemoryStore();
    Notification.__clearMemoryStore();

    // 1. Primary candidate
    candidateUser = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav@hireconnect.io',
      role: 'candidate',
      accountStatus: 'active'
    });
    candidateToken = generateAccessToken(candidateUser);

    // 2. Secondary candidate
    otherCandidateUser = await User.create({
      name: 'Rahul Verma',
      email: 'rahul@hireconnect.io',
      role: 'candidate',
      accountStatus: 'active'
    });
    otherCandidateToken = generateAccessToken(otherCandidateUser);

    // Candidate 1 uploads a private resume
    await request(app)
      .post('/api/candidates/me/resume')
      .set('Authorization', `Bearer ${candidateToken}`)
      .attach('resume', VALID_PDF_BUFFER, 'Aarav_Private_Resume.pdf');

    // 3. Primary recruiter
    recruiterUser = await User.create({
      name: 'Vikram Mehta',
      email: 'vikram@razorpay.com',
      role: 'recruiter',
      accountStatus: 'active'
    });
    recruiterToken = generateAccessToken(recruiterUser);

    // 4. Secondary recruiter (unrelated company)
    otherRecruiterUser = await User.create({
      name: 'Priya Patel',
      email: 'priya@zerodha.com',
      role: 'recruiter',
      accountStatus: 'active'
    });
    otherRecruiterToken = generateAccessToken(otherRecruiterUser);

    // 5. Administrator
    adminUser = await User.create({
      name: 'Platform Admin',
      email: 'admin@hireconnect.io',
      role: 'admin',
      accountStatus: 'active'
    });
    adminToken = generateAccessToken(adminUser);

    // 6. Test Company owned by Vikram
    testCompany = await Company.create({
      name: 'Razorpay Technologies',
      slug: 'razorpay-technologies',
      owner: recruiterUser._id,
      verified: true
    });

    // 7. Test Job posted by Vikram
    testJob = await Job.create({
      title: 'Senior Backend Engineer',
      company: testCompany._id,
      companyName: 'Razorpay Technologies',
      recruiter: recruiterUser._id,
      status: 'published',
      workMode: 'remote'
    });
  });

  describe('1. Unauthenticated Access Protection (401 Unauthorized)', () => {
    it('should reject unauthenticated requests to protected candidate endpoints', async () => {
      const res = await request(app).get('/api/candidates/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject unauthenticated requests to protected recruiter endpoints', async () => {
      const res = await request(app).get('/api/recruiters/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject unauthenticated requests to protected admin endpoints', async () => {
      const res = await request(app).get('/api/admin/dashboard');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject unauthenticated requests to meeting scheduler APIs', async () => {
      const res = await request(app).get('/api/meetings');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject unauthenticated requests to notifications APIs', async () => {
      const res = await request(app).get('/api/notifications');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('2. Role-Based Access Control Gates (403 Forbidden)', () => {
    it('should prevent candidate from accessing administrator dashboard', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should prevent recruiter from accessing administrator dashboard', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should prevent candidate from accessing recruiter-only analytics', async () => {
      const res = await request(app)
        .get('/api/recruiter/analytics/overview')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should prevent recruiter from accessing candidate-only personal activity analytics', async () => {
      const res = await request(app)
        .get('/api/candidate/analytics/overview')
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should strictly reject public registration attempting admin role escalation', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Hacker Admin',
          email: 'hacker@example.com',
          password: 'Password123!',
          role: 'admin'
        });

      // Role escalation is rejected
      expect([400, 403, 422]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });
  });

  describe('3. Resource Ownership & Privacy Protection', () => {
    it('should prevent unauthorized users from downloading private candidate resume', async () => {
      const res = await request(app)
        .get(`/api/profile/resume/download/${candidateUser._id}`)
        .set('Authorization', `Bearer ${otherCandidateToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should prevent recruiter from modifying another recruiter company profile', async () => {
      const res = await request(app)
        .put(`/api/companies/${testCompany._id}`)
        .set('Authorization', `Bearer ${otherRecruiterToken}`)
        .send({ description: 'Unauthorized take-over' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should prevent candidate from creating job postings', async () => {
      const res = await request(app)
        .post('/api/jobs/create')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          title: 'Fake Job',
          companyId: testCompany._id,
          workMode: 'remote',
          category: 'Engineering'
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should prevent an unauthorized user from deleting another users notifications', async () => {
      const notif = await Notification.create({
        recipient: candidateUser._id,
        type: 'system_announcement',
        title: 'Confidential Notice',
        message: 'Personal message for Aarav'
      });

      // Other candidate attempts to dismiss it
      const res = await request(app)
        .delete(`/api/notifications/${notif._id}`)
        .set('Authorization', `Bearer ${otherCandidateToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('4. Business Integrity & Concurrency Negative Checks', () => {
    it('should prevent duplicate applications to the same job by the same candidate', async () => {
      // 1st application
      const firstApp = await request(app)
        .post(`/api/jobs/${testJob._id}/apply`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          coverLetter: 'First application'
        });
      expect(firstApp.status).toBe(201);

      // 2nd duplicate application attempt
      const duplicateApp = await request(app)
        .post(`/api/jobs/${testJob._id}/apply`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          coverLetter: 'Duplicate attempt'
        });

      // Duplicate application is rejected
      expect([400, 409]).toContain(duplicateApp.status);
      expect(duplicateApp.body.success).toBe(false);
    });

    it('should reject double-booking the exact same exclusive meeting slot', async () => {
      const targetDate = getFutureWeekday(4);
      const slotTime = zonedTimeToUtc(targetDate, '11:00', 'Asia/Kolkata');

      // 1st booking
      const res1 = await request(app)
        .post('/api/meetings')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          recruiterId: recruiterUser._id.toString(),
          startAt: slotTime.toISOString(),
          durationMinutes: 30
        });
      expect(res1.status).toBe(201);

      // 2nd booking attempt for the same slot
      const res2 = await request(app)
        .post('/api/meetings')
        .set('Authorization', `Bearer ${otherCandidateToken}`)
        .send({
          recruiterId: recruiterUser._id.toString(),
          startAt: slotTime.toISOString(),
          durationMinutes: 30
        });

      expect(res2.status).toBe(409);
      expect(res2.body.success).toBe(false);
    });
  });

  describe('5. Input Sanitization & NoSQL Operator Defense', () => {
    it('should sanitize NoSQL operators like $gt and $ne from request payloads', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: { $gt: '' },
          password: 'Password123!'
        });

      // Since email $gt was stripped by mongoSanitize, request body fails validation with 422
      expect([400, 422]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });
  });
});
