/**
 * Automated Analytics, Reporting & Real-Time Dashboard Statistics Test Suite
 * for HireConnect (Phase 11)
 *
 * Covers:
 * 1. Admin Authorization Gates & Role Restrictions
 * 2. Admin Platform Analytics Overview (/api/admin/analytics/overview)
 * 3. Date Range Validation, Boundaries & Period Comparisons (7d, 30d, 90d, custom)
 * 4. Admin Recruitment Funnel & Conversion Rates (/api/admin/analytics/recruitment-funnel)
 * 5. Admin CSV Export & Spreadsheet Formula Injection Protection (/api/admin/analytics/export)
 * 6. Recruiter Analytics Scoping & Job Ownership Enforcement (/api/recruiter/analytics/overview)
 * 7. Recruiter Job Performance Table & Sorting (/api/recruiter/analytics/jobs)
 * 8. Recruiter Single Job Funnel & Cross-Company Access Prevention (/api/recruiter/analytics/jobs/:id/funnel)
 * 9. Recruiter Jobs CSV Export (/api/recruiter/analytics/jobs/export)
 * 10. Company-Level Analytics & Membership Access Control (/api/companies/:companyId/analytics)
 * 11. Candidate Personal Activity Analytics & Data Minimization (/api/candidate/analytics/overview)
 * 12. Empty Datasets & Honest Zero-State Handling
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
const SavedJob = require('../src/models/savedJob.model');
const NotificationOutbox = require('../src/models/notificationOutbox.model');
const { generateAccessToken } = require('../src/utils/token');

describe('HireConnect Phase 11: Analytics, Reporting & Real-Time Statistics', () => {
  let adminUser;
  let adminToken;
  let recruiterUser1;
  let recruiterToken1;
  let recruiterUser2;
  let recruiterToken2;
  let candidateUser;
  let candidateToken;
  let company1;
  let company2;
  let job1;
  let job2;

  beforeEach(async () => {
    // Clear in-memory stores
    if (User.__clearMemoryStore) User.__clearMemoryStore();
    if (Company.__clearMemoryStore) Company.__clearMemoryStore();
    if (CompanyMembership.__clearMemoryStore) CompanyMembership.__clearMemoryStore();
    if (Job._jobs) Job._jobs.clear();
    if (Application._applications) Application._applications.clear();
    if (Meeting._meetings) Meeting._meetings.clear();
    if (SavedJob._savedJobs) SavedJob._savedJobs.clear();
    if (NotificationOutbox._outbox) NotificationOutbox._outbox.clear();

    // 1. Seed Administrator
    adminUser = await User.create({
      name: 'Super Administrator',
      email: 'admin@hireconnect.io',
      role: 'admin',
      accountStatus: 'active',
      isEmailVerified: true
    });
    adminToken = generateAccessToken(adminUser);

    // 2. Seed Recruiter 1 (Razorpay)
    recruiterUser1 = await User.create({
      name: 'Priya Mehta',
      email: 'priya@razorpay.com',
      role: 'recruiter',
      accountStatus: 'active',
      isEmailVerified: true
    });
    recruiterToken1 = generateAccessToken(recruiterUser1);

    company1 = await Company.create({
      name: 'Razorpay Software',
      slug: 'razorpay',
      industry: 'FinTech',
      verificationStatus: 'verified',
      verified: true,
      createdBy: recruiterUser1._id
    });

    await CompanyMembership.create({
      company: company1._id,
      user: recruiterUser1._id,
      membershipRole: 'owner',
      status: 'active'
    });

    // 3. Seed Recruiter 2 (Swiggy - Separate Company)
    recruiterUser2 = await User.create({
      name: 'Vikram Seth',
      email: 'vikram@swiggy.com',
      role: 'recruiter',
      accountStatus: 'active',
      isEmailVerified: true
    });
    recruiterToken2 = generateAccessToken(recruiterUser2);

    company2 = await Company.create({
      name: 'Swiggy Limited',
      slug: 'swiggy',
      industry: 'Food Delivery',
      verificationStatus: 'verified',
      verified: true,
      createdBy: recruiterUser2._id
    });

    await CompanyMembership.create({
      company: company2._id,
      user: recruiterUser2._id,
      membershipRole: 'owner',
      status: 'active'
    });

    // 4. Seed Candidate
    candidateUser = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav@hireconnect.io',
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

    // 5. Seed Jobs
    job1 = await Job.create({
      title: 'Senior Frontend Architect',
      company: company1._id,
      companyName: company1.name,
      recruiter: recruiterUser1._id,
      createdBy: recruiterUser1._id,
      status: 'published'
    });

    job2 = await Job.create({
      title: 'Backend Systems Tech Lead',
      company: company2._id,
      companyName: company2.name,
      recruiter: recruiterUser2._id,
      createdBy: recruiterUser2._id,
      status: 'published'
    });
  });

  // ==========================================================================
  // 1. ADMIN AUTHORIZATION GATES
  // ==========================================================================
  describe('1. Admin Authorization Gates', () => {
    it('should reject unauthenticated request to /api/admin/analytics/overview with 401', async () => {
      const res = await request(app).get('/api/admin/analytics/overview');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject candidate accessing /api/admin/analytics/overview with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/admin/analytics/overview')
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should reject recruiter accessing /api/admin/analytics/overview with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/admin/analytics/overview')
        .set('Authorization', `Bearer ${recruiterToken1}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should allow authorized administrator with 200 OK', async () => {
      const res = await request(app)
        .get('/api/admin/analytics/overview')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.summary).toBeDefined();
    });
  });

  // ==========================================================================
  // 2. ADMIN PLATFORM ANALYTICS OVERVIEW & TIME SERIES
  // ==========================================================================
  describe('2. Admin Platform Analytics Overview & Time Series', () => {
    it('should return real platform metrics, counts and daily time series', async () => {
      // Create applications
      await Application.create({
        candidate: candidateUser._id,
        job: job1._id,
        company: company1._id,
        status: 'applied'
      });

      const res = await request(app)
        .get('/api/admin/analytics/overview?period=30d')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      const { summary, timeSeries, metadata } = res.body.data;

      // Users
      expect(summary.users.total).toBe(4); // admin, rec1, rec2, cand
      expect(summary.users.candidates).toBe(1);
      expect(summary.users.recruiters).toBe(2);
      expect(summary.users.admins).toBe(1);

      // Companies
      expect(summary.companies.total).toBe(2);
      expect(summary.companies.verified).toBe(2);

      // Jobs
      expect(summary.jobs.total).toBe(2);
      expect(summary.jobs.published).toBe(2);

      // Applications
      expect(summary.applications.total).toBe(1);
      expect(summary.applications.statusDistribution.applied).toBe(1);

      // Time series: exactly 30 daily buckets
      expect(timeSeries.length).toBe(30);
      const totalAppsInSeries = timeSeries.reduce((acc, b) => acc + b.applications, 0);
      expect(totalAppsInSeries).toBe(1);

      expect(metadata.period).toBe('30d');
      expect(metadata.reportingTimeZone).toBe('UTC');
    });

    it('should support 7d and 90d presets', async () => {
      const res7d = await request(app)
        .get('/api/admin/analytics/overview?period=7d')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res7d.status).toBe(200);
      expect(res7d.body.data.timeSeries.length).toBe(7);

      const res90d = await request(app)
        .get('/api/admin/analytics/overview?period=90d')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res90d.status).toBe(200);
      expect(res90d.body.data.timeSeries.length).toBe(90);
    });

    it('should support validated custom date ranges and reject invalid ranges', async () => {
      const validRes = await request(app)
        .get('/api/admin/analytics/overview?period=custom&startDate=2026-01-01&endDate=2026-01-15')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(validRes.status).toBe(200);
      expect(validRes.body.data.timeSeries.length).toBe(15);

      // Start date after end date -> 422 Unprocessable Entity
      const invalidOrderRes = await request(app)
        .get('/api/admin/analytics/overview?period=custom&startDate=2026-05-15&endDate=2026-05-01')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(invalidOrderRes.status).toBe(422);

      // Range exceeding 365 days -> 422 Unprocessable Entity
      const excessRes = await request(app)
        .get('/api/admin/analytics/overview?period=custom&startDate=2024-01-01&endDate=2025-06-01')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(excessRes.status).toBe(422);
    });
  });

  // ==========================================================================
  // 3. ADMIN RECRUITMENT FUNNEL & CONVERSION RATES
  // ==========================================================================
  describe('3. Admin Recruitment Funnel & Conversion Rates', () => {
    it('should calculate recruitment stages, status distribution and conversion rates', async () => {
      const c1 = await User.create({ name: 'Candidate 1', email: 'c1@test.com', role: 'candidate' });
      const c2 = await User.create({ name: 'Candidate 2', email: 'c2@test.com', role: 'candidate' });
      const c3 = await User.create({ name: 'Candidate 3', email: 'c3@test.com', role: 'candidate' });
      const c4 = await User.create({ name: 'Candidate 4', email: 'c4@test.com', role: 'candidate' });

      // 1 Applied
      await Application.create({
        candidate: c1._id,
        job: job1._id,
        company: company1._id,
        status: 'applied'
      });

      // 1 Under Review
      await Application.create({
        candidate: c2._id,
        job: job1._id,
        company: company1._id,
        status: 'under_review'
      });

      // 1 Shortlisted
      await Application.create({
        candidate: c3._id,
        job: job1._id,
        company: company1._id,
        status: 'shortlisted'
      });

      // 1 Offered
      await Application.create({
        candidate: c4._id,
        job: job1._id,
        company: company1._id,
        status: 'offered'
      });

      const res = await request(app)
        .get('/api/admin/analytics/recruitment-funnel')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      const { totalApplications, currentStatusDistribution, funnelStages, conversionRates } = res.body.data;

      expect(totalApplications).toBe(4);
      expect(currentStatusDistribution.applied).toBe(1);
      expect(currentStatusDistribution.under_review).toBe(1);
      expect(currentStatusDistribution.shortlisted).toBe(1);
      expect(currentStatusDistribution.offered).toBe(1);

      // Applied stage includes all 4
      const appliedStage = funnelStages.find((s) => s.stage === 'Applied');
      expect(appliedStage.count).toBe(4);

      // Offered stage count is 1 (25% overall conversion)
      const offeredStage = funnelStages.find((s) => s.stage === 'Offered');
      expect(offeredStage.count).toBe(1);
      expect(conversionRates.overallConversion).toBe(25);
    });

    it('should calculate time to first review from status history when available', async () => {
      const now = Date.now();
      const pastCreated = new Date(now - 48 * 3600 * 1000); // 48h ago
      const reviewedAt = new Date(now - 24 * 3600 * 1000);  // 24h after creation

      await Application.create({
        candidate: candidateUser._id,
        job: job1._id,
        company: company1._id,
        status: 'shortlisted',
        createdAt: pastCreated,
        statusHistory: [
          {
            fromStatus: 'applied',
            toStatus: 'shortlisted',
            changedBy: recruiterUser1._id,
            changedAt: reviewedAt
          }
        ]
      });

      const res = await request(app)
        .get('/api/admin/analytics/recruitment-funnel')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.metrics.historicalHistoryAvailable).toBe(true);
      expect(res.body.data.metrics.avgTimeToFirstReviewHours).toBe(24);
      expect(res.body.data.metrics.avgTimeToFirstReviewDays).toBe(1);
    });
  });

  // ==========================================================================
  // 4. ADMIN CSV EXPORT & FORMULA INJECTION PROTECTION
  // ==========================================================================
  describe('4. Admin CSV Export & Formula Injection Protection', () => {
    it('should export platform summary CSV with formula injection neutralization', async () => {
      // Seed a user whose name starts with formula injection character
      await User.create({
        name: '=SUM(1+2)',
        email: 'malicious@test.com',
        role: 'candidate',
        accountStatus: 'active'
      });

      const res = await request(app)
        .get('/api/admin/analytics/export?type=platform_summary')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.headers['content-disposition']).toContain('attachment; filename=');

      // Now export users_summary and verify formula is neutralized
      const usersRes = await request(app)
        .get('/api/admin/analytics/export?type=users_summary')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(usersRes.status).toBe(200);
      const csvText = usersRes.text;

      // '=SUM(1+2)' must be sanitized to ''=SUM(1+2)'
      expect(csvText).toContain(`'=SUM(1+2)`);
    });

    it('should export jobs_summary and applications_funnel CSV', async () => {
      const jobsRes = await request(app)
        .get('/api/admin/analytics/export?type=jobs_summary')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(jobsRes.status).toBe(200);
      expect(jobsRes.text).toContain('Senior Frontend Architect');

      const funnelRes = await request(app)
        .get('/api/admin/analytics/export?type=applications_funnel')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(funnelRes.status).toBe(200);
      expect(funnelRes.text).toContain('Recruitment Funnel Stage');
    });
  });

  // ==========================================================================
  // 5. RECRUITER ANALYTICS & JOB SCOPING
  // ==========================================================================
  describe('5. Recruiter Analytics & Job Scoping', () => {
    it('should reject non-recruiters with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/recruiter/analytics/overview')
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(res.status).toBe(403);
    });

    it('should scope recruiter metrics strictly to jobs they manage', async () => {
      // Application to job1 (Priya / Razorpay)
      await Application.create({
        candidate: candidateUser._id,
        job: job1._id,
        company: company1._id,
        status: 'applied'
      });

      // Application to job2 (Vikram / Swiggy)
      await Application.create({
        candidate: candidateUser._id,
        job: job2._id,
        company: company2._id,
        status: 'applied'
      });

      // Recruiter 1 requests their analytics overview
      const res1 = await request(app)
        .get('/api/recruiter/analytics/overview')
        .set('Authorization', `Bearer ${recruiterToken1}`);

      expect(res1.status).toBe(200);
      // Recruiter 1 manages 1 job and has 1 application
      expect(res1.body.data.summary.jobsManaged).toBe(1);
      expect(res1.body.data.summary.totalApplications).toBe(1);

      // Recruiter 2 requests their analytics overview
      const res2 = await request(app)
        .get('/api/recruiter/analytics/overview')
        .set('Authorization', `Bearer ${recruiterToken2}`);

      expect(res2.status).toBe(200);
      // Recruiter 2 manages 1 job and has 1 application
      expect(res2.body.data.summary.jobsManaged).toBe(1);
      expect(res2.body.data.summary.totalApplications).toBe(1);
    });

    it('should return paginated job performance table (/api/recruiter/analytics/jobs)', async () => {
      const res = await request(app)
        .get('/api/recruiter/analytics/jobs?page=1&limit=10')
        .set('Authorization', `Bearer ${recruiterToken1}`);

      expect(res.status).toBe(200);
      expect(res.body.data.jobs.length).toBe(1);
      expect(res.body.data.jobs[0].title).toBe('Senior Frontend Architect');
      expect(res.body.data.jobs[0].statusBreakdown).toBeDefined();
    });

    it('should allow recruiter to view funnel for their job but reject viewing another recruiter job with 403', async () => {
      // Authorized job
      const okRes = await request(app)
        .get(`/api/recruiter/analytics/jobs/${job1._id}/funnel`)
        .set('Authorization', `Bearer ${recruiterToken1}`);
      expect(okRes.status).toBe(200);
      expect(okRes.body.data.job.title).toBe('Senior Frontend Architect');

      // Unauthorized job (job2 belongs to Swiggy/Vikram)
      const deniedRes = await request(app)
        .get(`/api/recruiter/analytics/jobs/${job2._id}/funnel`)
        .set('Authorization', `Bearer ${recruiterToken1}`);
      expect(deniedRes.status).toBe(403);
    });

    it('should export recruiter job performance CSV (/api/recruiter/analytics/jobs/export)', async () => {
      const res = await request(app)
        .get('/api/recruiter/analytics/jobs/export')
        .set('Authorization', `Bearer ${recruiterToken1}`);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.text).toContain('Senior Frontend Architect');
      // Must NOT contain job2 (Swiggy)
      expect(res.text).not.toContain('Backend Systems Tech Lead');
    });
  });

  // ==========================================================================
  // 6. COMPANY-LEVEL ANALYTICS ACCESS CONTROL
  // ==========================================================================
  describe('6. Company-Level Analytics Access Control (/api/companies/:companyId/analytics)', () => {
    it('should allow active company member to access company analytics', async () => {
      const res = await request(app)
        .get(`/api/companies/${company1._id}/analytics`)
        .set('Authorization', `Bearer ${recruiterToken1}`);

      expect(res.status).toBe(200);
      expect(res.body.data.company.name).toBe('Razorpay Software');
      expect(res.body.data.summary.totalJobs).toBe(1);
    });

    it('should reject recruiter from another company with 403 Forbidden', async () => {
      // Recruiter 2 attempts to view Company 1
      const res = await request(app)
        .get(`/api/companies/${company1._id}/analytics`)
        .set('Authorization', `Bearer ${recruiterToken2}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should allow platform administrator to view any company analytics', async () => {
      const res = await request(app)
        .get(`/api/companies/${company1._id}/analytics`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.company.name).toBe('Razorpay Software');
    });
  });

  // ==========================================================================
  // 7. CANDIDATE PERSONAL ACTIVITY ANALYTICS
  // ==========================================================================
  describe('7. Candidate Personal Activity Analytics (/api/candidate/analytics/overview)', () => {
    it('should return personal statistics strictly for the authenticated candidate', async () => {
      // Application submitted
      await Application.create({
        candidate: candidateUser._id,
        job: job1._id,
        company: company1._id,
        status: 'under_review'
      });

      // Saved job
      await SavedJob.create({
        candidate: candidateUser._id,
        job: job2._id
      });

      // Scheduled meeting
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2);
      await Meeting.create({
        candidateId: candidateUser._id,
        recruiterId: recruiterUser1._id,
        jobId: job1._id,
        title: 'Technical Discussion',
        startAt: futureDate,
        endAt: new Date(futureDate.getTime() + 30 * 60000),
        status: 'scheduled'
      });

      const res = await request(app)
        .get('/api/candidate/analytics/overview')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      const data = res.body.data;

      expect(data.totalApplicationsSubmitted).toBe(1);
      expect(data.underReview).toBe(1);
      expect(data.savedJobsCount).toBe(1);
      expect(data.upcomingInterviewsCount).toBe(1);
      expect(data.recentActivity.length).toBe(1);
      expect(data.recentActivity[0].jobTitle).toBe('Senior Frontend Architect');
    });

    it('should reject recruiters from accessing candidate analytics with 403', async () => {
      const res = await request(app)
        .get('/api/candidate/analytics/overview')
        .set('Authorization', `Bearer ${recruiterToken1}`);
      expect(res.status).toBe(403);
    });
  });

  // ==========================================================================
  // 8. EMPTY DATASETS & HONEST ZERO-STATE HANDLING
  // ==========================================================================
  describe('8. Empty Datasets & Honest Zero-State Handling', () => {
    it('should return honest zero values and empty arrays when database has zero records', async () => {
      // Fresh recruiter with no jobs
      const newRecruiter = await User.create({
        name: 'Empty Recruiter',
        email: 'empty@test.com',
        role: 'recruiter',
        accountStatus: 'active'
      });
      const emptyToken = generateAccessToken(newRecruiter);

      const res = await request(app)
        .get('/api/recruiter/analytics/overview')
        .set('Authorization', `Bearer ${emptyToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.summary.jobsManaged).toBe(0);
      expect(res.body.data.summary.totalApplications).toBe(0);
      expect(res.body.data.summary.applicationGrowthPercentage).toBe(0);
      expect(res.body.data.timeSeries.every((b) => b.applications === 0)).toBe(true);
    });
  });
});
