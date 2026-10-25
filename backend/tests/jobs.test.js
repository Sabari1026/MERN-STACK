/**
 * Automated Job Management and Find Jobs Test Suite for HireConnect (Phase 5)
 * Covers: Public Job Discovery, Multi-Faceted Filters, Job Lifecycle States,
 * Company Verification Publishing Gate, Recruiter Management, and Legacy Aliases.
 */

const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const Company = require('../src/models/company.model');
const CompanyMembership = require('../src/models/companyMembership.model');
const Job = require('../src/models/job.model');
const { generateAccessToken } = require('../src/utils/token');

describe('HireConnect Phase 5: Complete Job Management and Find Jobs Backend', () => {
  let verifiedCompany = null;
  let unverifiedCompany = null;
  let recruiterUser = null;
  let recruiterToken = '';
  let otherRecruiterUser = null;
  let otherRecruiterToken = '';
  let candidateUser = null;
  let candidateToken = '';
  let adminUser = null;
  let adminToken = '';

  beforeEach(async () => {
    User.__clearMemoryStore();
    Company.__clearMemoryStore();
    CompanyMembership.__clearMemoryStore();
    Job.__clearMemoryStore();

    // 1. Verified Company
    verifiedCompany = await Company.create({
      name: 'Razorpay Technologies',
      slug: 'razorpay',
      industry: 'FinTech & Payments',
      verificationStatus: 'verified',
      verifiedAt: new Date(),
      headquarters: { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
      locations: ['Bengaluru, Karnataka', 'Remote - India'],
      workModes: ['Hybrid', 'Remote']
    });

    // 2. Unverified Company
    unverifiedCompany = await Company.create({
      name: 'Unverified Startup Labs',
      slug: 'unverified-startup',
      industry: 'Technology',
      verificationStatus: 'pending',
      headquarters: { city: 'Pune', state: 'Maharashtra', country: 'India' }
    });

    // 3. Recruiter User associated with Verified Company
    recruiterUser = await User.create({
      name: 'Priya Recruiter',
      email: 'priya@razorpay.com',
      passwordHash: 'hash',
      role: 'recruiter',
      accountStatus: 'active'
    });
    recruiterToken = generateAccessToken(recruiterUser);

    await CompanyMembership.create({
      company: verifiedCompany._id || verifiedCompany.id,
      user: recruiterUser._id || recruiterUser.id,
      membershipRole: 'owner',
      status: 'active'
    });

    // 4. Other Recruiter User associated with Unverified Company
    otherRecruiterUser = await User.create({
      name: 'Vikram Recruiter',
      email: 'vikram@unverified.in',
      passwordHash: 'hash',
      role: 'recruiter',
      accountStatus: 'active'
    });
    otherRecruiterToken = generateAccessToken(otherRecruiterUser);

    await CompanyMembership.create({
      company: unverifiedCompany._id || unverifiedCompany.id,
      user: otherRecruiterUser._id || otherRecruiterUser.id,
      membershipRole: 'owner',
      status: 'active'
    });

    // 5. Candidate User
    candidateUser = await User.create({
      name: 'Aarav Candidate',
      email: 'aarav@candidate.in',
      passwordHash: 'hash',
      role: 'candidate',
      accountStatus: 'active'
    });
    candidateToken = generateAccessToken(candidateUser);

    // 6. Admin User
    adminUser = await User.create({
      name: 'Platform Admin',
      email: 'admin@hireconnect.internal',
      passwordHash: 'hash',
      role: 'admin',
      accountStatus: 'active'
    });
    adminToken = generateAccessToken(adminUser);
  });

  // ==========================================================================
  // 1. PUBLIC JOB DISCOVERY (GET /api/jobs)
  // ==========================================================================
  describe('Public Job Discovery: GET /api/jobs', () => {
    beforeEach(async () => {
      // Seed 3 published jobs and 1 draft job
      await Job.create({
        title: 'Senior Frontend Engineer (React / TypeScript)',
        slug: 'senior-frontend-engineer-react',
        company: verifiedCompany._id || verifiedCompany.id,
        companyName: verifiedCompany.name,
        createdBy: recruiterUser._id || recruiterUser.id,
        category: 'frontend',
        employmentType: 'full-time',
        workMode: 'hybrid',
        location: 'Bengaluru, Karnataka',
        city: 'Bengaluru',
        state: 'Karnataka',
        experienceMin: 3,
        experienceMax: 6,
        salaryMin: 28,
        salaryMax: 42,
        salaryDisclosure: 'disclosed',
        description: 'Architect next-generation merchant checkout experiences handling millions of payments.',
        skills: ['React', 'TypeScript', 'Redux', 'Next.js'],
        status: 'published',
        publishedAt: new Date(Date.now() - 3600000)
      });

      await Job.create({
        title: 'Lead Backend Engineer (Go / Distributed Systems)',
        slug: 'lead-backend-engineer-go',
        company: verifiedCompany._id || verifiedCompany.id,
        companyName: verifiedCompany.name,
        createdBy: recruiterUser._id || recruiterUser.id,
        category: 'backend',
        employmentType: 'full-time',
        workMode: 'onsite',
        location: 'Bengaluru, Karnataka',
        city: 'Bengaluru',
        state: 'Karnataka',
        experienceMin: 5,
        experienceMax: 8,
        salaryMin: 38,
        salaryMax: 56,
        salaryDisclosure: 'disclosed',
        description: 'Design distributed microservices processing thousands of transactions per minute.',
        skills: ['Golang', 'Kafka', 'PostgreSQL', 'Redis'],
        status: 'published',
        publishedAt: new Date()
      });

      await Job.create({
        title: 'Full Stack Engineer (Node.js & React)',
        slug: 'full-stack-engineer-remote',
        company: verifiedCompany._id || verifiedCompany.id,
        companyName: verifiedCompany.name,
        createdBy: recruiterUser._id || recruiterUser.id,
        category: 'fullstack',
        employmentType: 'full-time',
        workMode: 'remote',
        location: 'Remote - India',
        city: 'Remote',
        experienceMin: 2,
        experienceMax: 4,
        salaryMin: 18,
        salaryMax: 26,
        salaryDisclosure: 'disclosed',
        description: 'Build end-to-end features for internal and external developer portals.',
        skills: ['Node.js', 'React', 'MongoDB'],
        status: 'published',
        publishedAt: new Date(Date.now() - 7200000)
      });

      // Draft Job - must NEVER appear in public discovery
      await Job.create({
        title: 'Internal Confidential Product Lead',
        slug: 'confidential-product-lead',
        company: verifiedCompany._id || verifiedCompany.id,
        companyName: verifiedCompany.name,
        createdBy: recruiterUser._id || recruiterUser.id,
        category: 'product',
        employmentType: 'full-time',
        workMode: 'hybrid',
        description: 'Internal planning draft not ready for public eyes.',
        skills: ['Product Strategy'],
        status: 'draft'
      });
    });

    it('1. should return published jobs and exclude draft listings with pagination metadata', async () => {
      const res = await request(app).get('/api/jobs');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.jobs)).toBe(true);
      expect(res.body.jobs.length).toBe(3);
      expect(res.body.total).toBe(3);

      // Verify dual-format compatibility for find-jobs-engine.js and standard REST
      expect(res.body.data.jobs).toHaveLength(3);
      expect(res.body.hasMore).toBe(false);

      // Verify no draft jobs leaked
      const titles = res.body.jobs.map((j) => j.title);
      expect(titles).not.toContain('Internal Confidential Product Lead');
    });

    it('2. should filter jobs by keyword search across title, skills, and description', async () => {
      const res = await request(app).get('/api/jobs?q=TypeScript');

      expect(res.status).toBe(200);
      expect(res.body.jobs.length).toBe(1);
      expect(res.body.jobs[0].title).toContain('React / TypeScript');
    });

    it('3. should filter jobs by work mode (e.g. Remote)', async () => {
      const res = await request(app).get('/api/jobs?workMode=remote');

      expect(res.status).toBe(200);
      expect(res.body.jobs.length).toBe(1);
      expect(res.body.jobs[0].workMode).toBe('remote');
    });

    it('4. should filter jobs by category (e.g. backend)', async () => {
      const res = await request(app).get('/api/jobs?category=backend');

      expect(res.status).toBe(200);
      expect(res.body.jobs.length).toBe(1);
      expect(res.body.jobs[0].category).toBe('backend');
    });

    it('5. should filter jobs by experience range (e.g. 5-8 years)', async () => {
      const res = await request(app).get('/api/jobs?experience=5-8');

      expect(res.status).toBe(200);
      expect(res.body.jobs.length).toBe(1);
      expect(res.body.jobs[0].title).toContain('Lead Backend Engineer');
    });

    it('6. should filter jobs by minimum salary threshold', async () => {
      const res = await request(app).get('/api/jobs?salaryMin=30');

      expect(res.status).toBe(200);
      // Lead Backend (38-56) and Senior Frontend (28-42) both meet max >= 30
      expect(res.body.jobs.length).toBe(2);
    });

    it('7. should sort jobs by salary descending', async () => {
      const res = await request(app).get('/api/jobs?sort=salary_desc');

      expect(res.status).toBe(200);
      expect(res.body.jobs[0].title).toContain('Lead Backend Engineer'); // ₹56 LPA max
      expect(res.body.jobs[res.body.jobs.length - 1].title).toContain('Full Stack Engineer'); // ₹26 LPA max
    });

    it('8. should paginate jobs with page and limit parameters', async () => {
      const res = await request(app).get('/api/jobs?page=1&limit=2');

      expect(res.status).toBe(200);
      expect(res.body.jobs.length).toBe(2);
      expect(res.body.total).toBe(3);
      expect(res.body.totalPages).toBe(2);
      expect(res.body.hasMore).toBe(true);

      const page2 = await request(app).get('/api/jobs?page=2&limit=2');
      expect(page2.status).toBe(200);
      expect(page2.body.jobs.length).toBe(1);
      expect(page2.body.hasMore).toBe(false);
    });
  });

  // ==========================================================================
  // 2. PUBLIC & AUTHENTICATED JOB DETAILS (GET /api/jobs/:idOrSlug)
  // ==========================================================================
  describe('Job Details: GET /api/jobs/:idOrSlug', () => {
    let publishedJob = null;
    let draftJob = null;

    beforeEach(async () => {
      publishedJob = await Job.create({
        title: 'Staff Security Engineer',
        slug: 'staff-security-engineer',
        company: verifiedCompany._id || verifiedCompany.id,
        companyName: verifiedCompany.name,
        createdBy: recruiterUser._id || recruiterUser.id,
        description: 'Secure payment infrastructure and cloud boundaries across multi-region deployments.',
        skills: ['AppSec', 'Cryptography', 'Cloud Security'],
        status: 'published',
        publishedAt: new Date()
      });

      draftJob = await Job.create({
        title: 'Unpublished Draft DevOps Specialist',
        slug: 'draft-devops-specialist',
        company: verifiedCompany._id || verifiedCompany.id,
        companyName: verifiedCompany.name,
        createdBy: recruiterUser._id || recruiterUser.id,
        description: 'DevOps role draft for internal review.',
        skills: ['Kubernetes', 'Terraform'],
        status: 'draft'
      });
    });

    it('9. should retrieve public job details by slug and populate company metadata', async () => {
      const res = await request(app).get(`/api/jobs/${publishedJob.slug}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.job.title).toBe('Staff Security Engineer');
      expect(res.body.job.company).toBeDefined();
      expect(res.body.job.company.name).toBe('Razorpay Technologies');
    });

    it('10. should return 404 for a non-existent job slug or ID', async () => {
      const res = await request(app).get('/api/jobs/non-existent-job-identifier-xyz');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('11. should hide draft jobs from public / unauthenticated candidate requests with 404', async () => {
      const unauthRes = await request(app).get(`/api/jobs/${draftJob.slug}`);
      expect(unauthRes.status).toBe(404);

      const candidateRes = await request(app)
        .get(`/api/jobs/${draftJob.slug}`)
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(candidateRes.status).toBe(404);
    });

    it('12. should allow authorized recruiter of owning company to preview draft job', async () => {
      const res = await request(app)
        .get(`/api/jobs/${draftJob.slug}`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(200);
      expect(res.body.job.title).toBe('Unpublished Draft DevOps Specialist');
      expect(res.body.job.status).toBe('draft');
    });
  });

  // ==========================================================================
  // 3. RECRUITER JOB CREATION & VERIFICATION GATE
  // ==========================================================================
  describe('Recruiter Job Creation: POST /api/recruiter/jobs', () => {
    it('13. should allow recruiter to create a draft job listing for their organization', async () => {
      const res = await request(app)
        .post('/api/recruiter/jobs')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          title: 'Senior Site Reliability Engineer',
          companyId: verifiedCompany._id || verifiedCompany.id,
          description: 'Ensure 99.999% availability for India payment highway infrastructure.',
          workMode: 'Hybrid',
          employmentType: 'Full-time',
          experienceMin: 4,
          experienceMax: 7,
          salaryMin: 32,
          salaryMax: 48,
          skills: ['Kubernetes', 'Prometheus', 'Linux', 'Go']
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.job.title).toBe('Senior Site Reliability Engineer');
      expect(res.body.job.status).toBe('draft');
      expect(res.body.job.company.toString()).toBe((verifiedCompany._id || verifiedCompany.id).toString());
    });

    it('14. should reject unauthenticated requests with 401', async () => {
      const res = await request(app)
        .post('/api/recruiter/jobs')
        .send({
          title: 'Unauthorized Job Attempt',
          companyId: verifiedCompany._id || verifiedCompany.id,
          description: 'This attempt should fail due to missing authorization headers.'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('15. should reject candidate attempting to create a job listing with 403', async () => {
      const res = await request(app)
        .post('/api/recruiter/jobs')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          title: 'Candidate Posing As Recruiter',
          companyId: verifiedCompany._id || verifiedCompany.id,
          description: 'Candidate should not have permission to post jobs on the platform.'
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('16. should block direct publishing when company verification status is pending/unverified with 403', async () => {
      const res = await request(app)
        .post('/api/recruiter/jobs')
        .set('Authorization', `Bearer ${otherRecruiterToken}`)
        .send({
          title: 'Prematurely Published Job',
          companyId: unverifiedCompany._id || unverifiedCompany.id,
          description: 'Attempting to publish directly without approved company verification.',
          status: 'published'
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('verification');
    });

    it('17. should allow direct publishing when company is verified and increment activeJobsCount', async () => {
      const res = await request(app)
        .post('/api/recruiter/jobs')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          title: 'Principal Architect (Verified Direct Publish)',
          companyId: verifiedCompany._id || verifiedCompany.id,
          description: 'Lead technical strategy and architecture for scalable enterprise financial tools.',
          status: 'published',
          skills: ['Architecture', 'Distributed Systems']
        });

      expect(res.status).toBe(201);
      expect(res.body.job.status).toBe('published');
      expect(res.body.job.publishedAt).toBeDefined();

      // Verify company activeJobsCount updated
      const updatedComp = await Company.findById(verifiedCompany._id || verifiedCompany.id);
      expect(updatedComp.activeJobsCount).toBeGreaterThan(0);
    });
  });

  // ==========================================================================
  // 4. RECRUITER LIFECYCLE MANAGEMENT (PUBLISH, CLOSE, UPDATE, LIST)
  // ==========================================================================
  describe('Recruiter Job Lifecycle: PATCH /api/recruiter/jobs/:id/*', () => {
    let draftJob = null;

    beforeEach(async () => {
      draftJob = await Job.create({
        title: 'Draft Cloud Infrastructure Architect',
        slug: 'draft-cloud-infra-architect',
        company: verifiedCompany._id || verifiedCompany.id,
        companyName: verifiedCompany.name,
        createdBy: recruiterUser._id || recruiterUser.id,
        description: 'Design multi-region cloud topology with zero-trust networking architecture.',
        skills: ['AWS', 'Terraform', 'Security'],
        status: 'draft'
      });
    });

    it('18. should allow recruiter to retrieve all organization jobs (draft, published, closed)', async () => {
      const res = await request(app)
        .get('/api/recruiter/jobs')
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.jobs)).toBe(true);
      expect(res.body.jobs.length).toBeGreaterThan(0);
      expect(res.body.jobs.some((j) => j.status === 'draft')).toBe(true);
    });

    it('19. should publish draft job via PATCH /publish and record publishedAt timestamp', async () => {
      const res = await request(app)
        .patch(`/api/recruiter/jobs/${draftJob._id || draftJob.id}/publish`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.job.status).toBe('published');
      expect(res.body.job.publishedAt).toBeDefined();

      // Verify it now appears on public find jobs
      const publicSearch = await request(app).get('/api/jobs');
      const publicTitles = publicSearch.body.jobs.map((j) => j.title);
      expect(publicTitles).toContain('Draft Cloud Infrastructure Architect');
    });

    it('20. should block recruiter from publishing job if company is unverified', async () => {
      const unverifiedJob = await Job.create({
        title: 'Unverified Company Draft Job',
        slug: 'unverified-comp-draft-job',
        company: unverifiedCompany._id || unverifiedCompany.id,
        companyName: unverifiedCompany.name,
        createdBy: otherRecruiterUser._id || otherRecruiterUser.id,
        description: 'Attempting to publish while company verification is still pending.',
        status: 'draft'
      });

      const res = await request(app)
        .patch(`/api/recruiter/jobs/${unverifiedJob._id || unverifiedJob.id}/publish`)
        .set('Authorization', `Bearer ${otherRecruiterToken}`)
        .send({});

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('verification');
    });

    it('21. should close an active job via PATCH /close and remove it from public discovery', async () => {
      // First publish it
      await request(app)
        .patch(`/api/recruiter/jobs/${draftJob._id || draftJob.id}/publish`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      // Now close it
      const res = await request(app)
        .patch(`/api/recruiter/jobs/${draftJob._id || draftJob.id}/close`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(200);
      expect(res.body.job.status).toBe('closed');
      expect(res.body.job.closedAt).toBeDefined();

      // Verify it disappears from public search
      const publicSearch = await request(app).get('/api/jobs');
      const publicTitles = publicSearch.body.jobs.map((j) => j.title);
      expect(publicTitles).not.toContain('Draft Cloud Infrastructure Architect');
    });

    it('22. should allow recruiter to update job details (PATCH /api/recruiter/jobs/:id)', async () => {
      const res = await request(app)
        .patch(`/api/recruiter/jobs/${draftJob._id || draftJob.id}`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          title: 'Senior Cloud Architect (Updated Title)',
          experienceMin: 5,
          experienceMax: 9,
          salaryMin: 35,
          salaryMax: 50
        });

      expect(res.status).toBe(200);
      expect(res.body.job.title).toBe('Senior Cloud Architect (Updated Title)');
      expect(res.body.job.salaryMin).toBe(35);
      expect(res.body.job.salaryMax).toBe(50);
    });

    it('23. should prevent recruiter from editing jobs belonging to another company with 403/404', async () => {
      const res = await request(app)
        .patch(`/api/recruiter/jobs/${draftJob._id || draftJob.id}`)
        .set('Authorization', `Bearer ${otherRecruiterToken}`)
        .send({
          title: 'Malicious Cross-Organization Edit'
        });

      expect([403, 404]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });
  });

  // ==========================================================================
  // 5. APPLICATION METHOD & URL SECURITY
  // ==========================================================================
  describe('Application Method & URL Security', () => {
    it('24. should accept valid external application HTTP/HTTPS URL', async () => {
      const res = await request(app)
        .post('/api/recruiter/jobs')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          title: 'Engineering Director - Enterprise FinTech',
          companyId: verifiedCompany._id || verifiedCompany.id,
          description: 'Lead engineering divisions delivering high-availability financial infrastructure.',
          applicationMethod: 'external',
          externalApplicationUrl: 'https://razorpay.com/careers/engineering-director-123'
        });

      expect(res.status).toBe(201);
      expect(res.body.job.applicationMethod).toBe('external');
      expect(res.body.job.externalApplicationUrl).toBe('https://razorpay.com/careers/engineering-director-123');
    });

    it('25. should reject dangerous URL schemes (e.g. javascript:, data:) with 400 or 422', async () => {
      const res = await request(app)
        .post('/api/recruiter/jobs')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          title: 'Malicious Link Job Test',
          companyId: verifiedCompany._id || verifiedCompany.id,
          description: 'Job attempt containing malicious javascript pseudo-protocol link.',
          applicationMethod: 'external',
          externalApplicationUrl: 'javascript:alert(document.cookie)'
        });

      expect([400, 422]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });
  });

  // ==========================================================================
  // 6. LEGACY ROUTE COMPATIBILITY
  // ==========================================================================
  describe('Legacy Route Compatibility: /api/jobs/*', () => {
    it('26. should support legacy POST /api/jobs/create endpoint for recruiters', async () => {
      const res = await request(app)
        .post('/api/jobs/create')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          title: 'Legacy Route Created Job Listing',
          companyId: verifiedCompany._id || verifiedCompany.id,
          description: 'Job created via the legacy /api/jobs/create endpoint maintained for compatibility.'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.job.title).toBe('Legacy Route Created Job Listing');
    });

    it('27. should support legacy POST /api/jobs/:id/status endpoint to pause or close job', async () => {
      const testJob = await Job.create({
        title: 'Legacy Status Transition Test Job',
        slug: 'legacy-status-transition-job',
        company: verifiedCompany._id || verifiedCompany.id,
        companyName: verifiedCompany.name,
        createdBy: recruiterUser._id || recruiterUser.id,
        description: 'Testing legacy status endpoint to ensure backward compatibility.',
        status: 'published',
        publishedAt: new Date()
      });

      const res = await request(app)
        .post(`/api/jobs/${testJob._id || testJob.id}/status`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ status: 'closed' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.job.status).toBe('closed');
    });
  });
});
