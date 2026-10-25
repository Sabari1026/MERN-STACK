/**
 * Automated Application Management & Saved Jobs Test Suite for HireConnect (Phase 6)
 * Covers:
 * 1. Application Submission (Candidate direct apply, validations, duplicate protection, external jobs)
 * 2. Candidate Application Retrieval & Tracking (history, single view, note redaction)
 * 3. Candidate Application Withdrawal (state transitions, authorization, business rules)
 * 4. Recruiter Application Review & Actions (job applicants, status transitions, evaluation notes)
 * 5. Saved Jobs Management (bookmarking, idempotency, listing, unsaving, availability)
 * 6. Secure Resume Access Authorization (linkage via hasActiveApplication)
 */

const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const CandidateProfile = require('../src/models/candidateProfile.model');
const Company = require('../src/models/company.model');
const CompanyMembership = require('../src/models/companyMembership.model');
const Job = require('../src/models/job.model');
const Application = require('../src/models/application.model');
const SavedJob = require('../src/models/savedJob.model');
const ResumeAsset = require('../src/models/resumeAsset.model');
const storageService = require('../src/services/storage.service');
const { generateAccessToken } = require('../src/utils/token');

describe('HireConnect Phase 6: Application Management, Saved Jobs & Application Tracking', () => {
  let verifiedCompany = null;
  let otherCompany = null;
  let recruiterUser = null;
  let recruiterToken = '';
  let otherRecruiterUser = null;
  let otherRecruiterToken = '';
  let candidateUser = null;
  let candidateToken = '';
  let candidate2User = null;
  let candidate2Token = '';
  let internalJob = null;
  let externalJob = null;
  let closedJob = null;

  beforeEach(async () => {
    User.__clearMemoryStore();
    CandidateProfile.__clearMemoryStore();
    Company.__clearMemoryStore();
    CompanyMembership.__clearMemoryStore();
    Job.__clearMemoryStore();
    Application.__clearMemoryStore();
    SavedJob.__clearMemoryStore();
    ResumeAsset.__clearMemoryStore();

    // 1. Companies
    verifiedCompany = await Company.create({
      name: 'PhonePe Technologies',
      slug: 'phonepe',
      industry: 'FinTech',
      verificationStatus: 'verified',
      verifiedAt: new Date(),
      headquarters: { city: 'Bengaluru', state: 'Karnataka', country: 'India' }
    });

    otherCompany = await Company.create({
      name: 'Swiggy Delivery',
      slug: 'swiggy',
      industry: 'FoodTech',
      verificationStatus: 'verified',
      verifiedAt: new Date(),
      headquarters: { city: 'Bengaluru', state: 'Karnataka', country: 'India' }
    });

    // 2. Recruiters
    recruiterUser = await User.create({
      name: 'Neha Recruiter',
      email: 'neha@phonepe.com',
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

    otherRecruiterUser = await User.create({
      name: 'Karan Recruiter',
      email: 'karan@swiggy.in',
      passwordHash: 'hash',
      role: 'recruiter',
      accountStatus: 'active'
    });
    otherRecruiterToken = generateAccessToken(otherRecruiterUser);

    await CompanyMembership.create({
      company: otherCompany._id || otherCompany.id,
      user: otherRecruiterUser._id || otherRecruiterUser.id,
      membershipRole: 'owner',
      status: 'active'
    });

    // 3. Candidates
    candidateUser = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      passwordHash: 'hash',
      role: 'candidate',
      accountStatus: 'active'
    });
    candidateToken = generateAccessToken(candidateUser);

    storageService.clearMockStorage();
    const stored = await storageService.saveFile({
      buffer: Buffer.from('%PDF-1.4\n%Mock Aarav Resume\n%%EOF'),
      originalFilename: 'Aarav_Sharma_Resume.pdf',
      mimeType: 'application/pdf',
      folder: 'resumes'
    });

    const resumeAsset = await ResumeAsset.create({
      user: candidateUser._id || candidateUser.id,
      storageKey: stored.storageKey,
      originalFilename: 'Aarav_Sharma_Resume.pdf',
      mimeType: 'application/pdf',
      sizeBytes: stored.sizeBytes,
      isCurrent: true,
      status: 'active'
    });

    await CandidateProfile.create({
      user: candidateUser._id || candidateUser.id,
      headline: 'Senior Full Stack Engineer (React / Node.js)',
      location: 'Bengaluru, Karnataka',
      phone: '+91 98765 43210',
      skills: [{ name: 'React' }, { name: 'Node.js' }, { name: 'MongoDB' }, { name: 'TypeScript' }],
      resume: resumeAsset._id || resumeAsset.id,
      discoverability: false
    });

    candidate2User = await User.create({
      name: 'Pooja Patel',
      email: 'pooja.patel@gmail.com',
      passwordHash: 'hash',
      role: 'candidate',
      accountStatus: 'active'
    });
    candidate2Token = generateAccessToken(candidate2User);

    await CandidateProfile.create({
      user: candidate2User._id || candidate2User.id,
      headline: 'Backend Engineer (Go / Distributed Systems)',
      location: 'Pune, Maharashtra',
      phone: '+91 98111 22233',
      skills: [{ name: 'Go' }, { name: 'Kubernetes' }, { name: 'PostgreSQL' }],
      discoverability: false
    });

    // 4. Jobs
    internalJob = await Job.create({
      title: 'Senior Backend Engineer',
      slug: 'senior-backend-engineer',
      company: verifiedCompany._id || verifiedCompany.id,
      companyName: verifiedCompany.name,
      createdBy: recruiterUser._id || recruiterUser.id,
      description: 'Design and build high-throughput payment systems at PhonePe.',
      status: 'published',
      publishedAt: new Date(),
      location: 'Bengaluru, Karnataka',
      workMode: 'Hybrid',
      employmentType: 'Full-time',
      experience: '4-7 yrs',
      experienceMin: 4,
      experienceMax: 7,
      category: 'Backend',
      skills: ['Node.js', 'MongoDB', 'System Design'],
      salary: '₹28 - 38 LPA',
      applicationMethod: 'internal'
    });

    externalJob = await Job.create({
      title: 'Staff Platform Architect',
      slug: 'staff-platform-architect',
      company: verifiedCompany._id || verifiedCompany.id,
      companyName: verifiedCompany.name,
      createdBy: recruiterUser._id || recruiterUser.id,
      description: 'Lead architecture for PhonePe core ledger.',
      status: 'published',
      publishedAt: new Date(),
      location: 'Bengaluru, Karnataka',
      workMode: 'On-site',
      employmentType: 'Full-time',
      experience: '8-12 yrs',
      category: 'Backend',
      skills: ['Architecture', 'Kubernetes', 'Distributed Systems'],
      salary: '₹55 - 75 LPA',
      applicationMethod: 'external',
      externalApplicationUrl: 'https://careers.phonepe.com/jobs/staff-architect',
      applyUrl: 'https://careers.phonepe.com/jobs/staff-architect'
    });

    closedJob = await Job.create({
      title: 'Junior QA Engineer',
      slug: 'junior-qa-engineer',
      company: verifiedCompany._id || verifiedCompany.id,
      companyName: verifiedCompany.name,
      createdBy: recruiterUser._id || recruiterUser.id,
      description: 'QA role that is currently closed.',
      status: 'closed',
      location: 'Bengaluru, Karnataka',
      workMode: 'Hybrid',
      employmentType: 'Full-time',
      category: 'QA',
      salary: '₹8 - 12 LPA',
      applicationMethod: 'internal'
    });
  });

  // ==========================================================================
  // 1. CANDIDATE APPLICATION SUBMISSION
  // ==========================================================================
  describe('Candidate Application Submission', () => {
    it('1. Candidate applies directly to published internal job with 201 Created and snapshots', async () => {
      const res = await request(app)
        .post(`/api/jobs/${internalJob._id || internalJob.id}/apply`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          coverLetter: 'I have 5 years building scalable Node.js microservices.',
          coverNote: 'I have 5 years building scalable Node.js microservices.'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.application).toBeDefined();
      expect(res.body.application.status).toBe('applied');
      expect(res.body.application.candidateSnapshot).toBeDefined();
      expect(res.body.application.candidateSnapshot.name).toBe('Aarav Sharma');
      expect(res.body.application.resumeSnapshot).toBeDefined();
      expect(res.body.application.resumeSnapshot.fileName).toBe('Aarav_Sharma_Resume.pdf');
    });

    it('2. Candidate can also apply via POST /api/applications/apply with jobId in body', async () => {
      const res = await request(app)
        .post('/api/applications/apply')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          jobId: internalJob._id || internalJob.id,
          coverNote: 'Direct application through /api/applications/apply.'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.application.status).toBe('applied');
    });

    it('3. Duplicate application by same candidate to same job is blocked with 409 Conflict', async () => {
      // First application
      await request(app)
        .post(`/api/jobs/${internalJob._id || internalJob.id}/apply`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ coverNote: 'First application' });

      // Duplicate attempt
      const res = await request(app)
        .post(`/api/jobs/${internalJob._id || internalJob.id}/apply`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ coverNote: 'Duplicate application' });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already submitted|already applied/i);
    });

    it('4. Candidate cannot apply to closed or unpublished job (400 Bad Request)', async () => {
      const res = await request(app)
        .post(`/api/jobs/${closedJob._id || closedJob.id}/apply`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ coverNote: 'Trying to apply to closed job' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/accepting applications|not active/i);
    });

    it('5. External application job returns 200 with redirect URL and does NOT create internal record', async () => {
      const res = await request(app)
        .post(`/api/jobs/${externalJob._id || externalJob.id}/apply`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isExternal).toBe(true);
      expect(res.body.applyUrl).toBe('https://careers.phonepe.com/jobs/staff-architect');

      // Verify no internal application was saved
      const appCount = await Application.countDocuments({ job: externalJob._id || externalJob.id });
      expect(appCount).toBe(0);
    });

    it('6. Recruiter cannot apply to jobs as candidate (403 Forbidden)', async () => {
      const res = await request(app)
        .post(`/api/jobs/${internalJob._id || internalJob.id}/apply`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ coverNote: 'Recruiter applying' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('7. Unauthenticated user cannot apply to jobs (401 Unauthorized)', async () => {
      const res = await request(app)
        .post(`/api/jobs/${internalJob._id || internalJob.id}/apply`)
        .send({ coverNote: 'Anonymous applying' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // ==========================================================================
  // 2. CANDIDATE APPLICATION RETRIEVAL & TRACKING
  // ==========================================================================
  describe('Candidate Application Retrieval & Tracking', () => {
    let app1 = null;

    beforeEach(async () => {
      const res = await request(app)
        .post(`/api/jobs/${internalJob._id || internalJob.id}/apply`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ coverNote: 'Candidate application tracking test' });
      app1 = res.body.application;
    });

    it('8. Candidate retrieves their own application history via GET /api/applications/me', async () => {
      const res = await request(app)
        .get('/api/applications/me')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.applications).toBeInstanceOf(Array);
      expect(res.body.applications.length).toBe(1);
      expect(res.body.applications[0].jobTitle).toBe('Senior Backend Engineer');
      expect(res.body.applications[0].companyName).toBe('PhonePe Technologies');
      expect(res.body.applications[0].status).toBe('applied');
    });

    it('9. Candidate retrieves their history via legacy alias GET /api/applications/my', async () => {
      const res = await request(app)
        .get('/api/applications/my')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.applications.length).toBe(1);
    });

    it('10. Candidate retrieves single application detail by ID', async () => {
      const res = await request(app)
        .get(`/api/applications/${app1.id || app1._id}`)
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.application.id).toBe(app1.id || app1._id);
      expect(res.body.application.status).toBe('applied');
    });

    it('11. Candidate view redacts internal recruiter notes', async () => {
      // Add an internal note as recruiter first
      await request(app)
        .post(`/api/recruiter/applications/${app1.id || app1._id}/notes`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ text: 'Strong candidate, scheduled for technical screening.' });

      // View as candidate
      const res = await request(app)
        .get(`/api/applications/${app1.id || app1._id}`)
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.application.notes).toBeUndefined();
    });

    it('12. Candidate cannot view another candidate\'s application (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/applications/${app1.id || app1._id}`)
        .set('Authorization', `Bearer ${candidate2Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  // ==========================================================================
  // 3. CANDIDATE APPLICATION WITHDRAWAL
  // ==========================================================================
  describe('Candidate Application Withdrawal', () => {
    let appRecord = null;

    beforeEach(async () => {
      const res = await request(app)
        .post(`/api/jobs/${internalJob._id || internalJob.id}/apply`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ coverNote: 'Will withdraw this application' });
      appRecord = res.body.application;
    });

    it('13. Candidate withdraws active application with 200 OK and status updated to withdrawn', async () => {
      const res = await request(app)
        .patch(`/api/applications/${appRecord.id || appRecord._id}/withdraw`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ reason: 'Accepted another offer' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.application.status).toBe('withdrawn');
    });

    it('14. Cannot withdraw already withdrawn application (400 Bad Request)', async () => {
      // First withdrawal
      await request(app)
        .patch(`/api/applications/${appRecord.id || appRecord._id}/withdraw`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ reason: 'Accepted another offer' });

      // Second withdrawal attempt
      const res = await request(app)
        .patch(`/api/applications/${appRecord.id || appRecord._id}/withdraw`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ reason: 'Trying again' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already withdrawn/i);
    });

    it('15. Candidate cannot withdraw another candidate\'s application (403 Forbidden)', async () => {
      const res = await request(app)
        .patch(`/api/applications/${appRecord.id || appRecord._id}/withdraw`)
        .set('Authorization', `Bearer ${candidate2Token}`)
        .send({ reason: 'Malicious withdraw' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('16. Cannot withdraw application that concluded with offered or rejected (400 Bad Request)', async () => {
      // Recruiter sets status to rejected
      await request(app)
        .patch(`/api/recruiter/applications/${appRecord.id || appRecord._id}/status`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ status: 'rejected', reason: 'Position filled' });

      // Candidate attempts to withdraw
      const res = await request(app)
        .patch(`/api/applications/${appRecord.id || appRecord._id}/withdraw`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ reason: 'Candidate withdrawing' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/cannot withdraw/i);
    });
  });

  // ==========================================================================
  // 4. RECRUITER APPLICATION REVIEW & LIFECYCLE ACTIONS
  // ==========================================================================
  describe('Recruiter Application Review & Lifecycle Actions', () => {
    let app1 = null;
    let app2 = null;

    beforeEach(async () => {
      const res1 = await request(app)
        .post(`/api/jobs/${internalJob._id || internalJob.id}/apply`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ coverNote: 'Aarav application for PhonePe' });
      app1 = res1.body.application;

      const res2 = await request(app)
        .post(`/api/jobs/${internalJob._id || internalJob.id}/apply`)
        .set('Authorization', `Bearer ${candidate2Token}`)
        .send({ coverNote: 'Pooja application for PhonePe' });
      app2 = res2.body.application;
    });

    it('17. Recruiter lists applicants for their company job via /api/recruiter/jobs/:jobId/applications', async () => {
      const res = await request(app)
        .get(`/api/recruiter/jobs/${internalJob._id || internalJob.id}/applications`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.applications).toBeInstanceOf(Array);
      expect(res.body.applications.length).toBe(2);
      expect(res.body.total).toBe(2);
    });

    it('18. Recruiter lists applicants via legacy alias /api/applications/job/:jobId', async () => {
      const res = await request(app)
        .get(`/api/applications/job/${internalJob._id || internalJob.id}`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.applications.length).toBe(2);
    });

    it('19. Unauthorized recruiter from a different company receives 403 Forbidden', async () => {
      const res = await request(app)
        .get(`/api/recruiter/jobs/${internalJob._id || internalJob.id}/applications`)
        .set('Authorization', `Bearer ${otherRecruiterToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('20. Recruiter views full applicant details including candidate snapshot', async () => {
      const res = await request(app)
        .get(`/api/applications/${app1.id || app1._id}`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.application.candidateName).toBe('Aarav Sharma');
      expect(res.body.application.candidateHeadline).toContain('Senior Full Stack Engineer');
    });

    it('21. Recruiter updates application status through valid lifecycle: under_review -> shortlisted -> interview', async () => {
      // 1. under_review
      const res1 = await request(app)
        .patch(`/api/recruiter/applications/${app1.id || app1._id}/status`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ status: 'under_review', reason: 'Reviewing technical profile' });
      expect(res1.status).toBe(200);
      expect(res1.body.application.status).toBe('under_review');

      // 2. shortlisted
      const res2 = await request(app)
        .patch(`/api/recruiter/applications/${app1.id || app1._id}/status`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ status: 'shortlisted', reason: 'Shortlisted for hiring manager interview' });
      expect(res2.status).toBe(200);
      expect(res2.body.application.status).toBe('shortlisted');

      // 3. interview (also accepts 'interviewing' and normalizes)
      const res3 = await request(app)
        .put(`/api/applications/${app1.id || app1._id}/status`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ status: 'interviewing', reason: 'Round 1 scheduled' });
      expect(res3.status).toBe(200);
      expect(res3.body.application.status).toBe('interview');
    });

    it('22. Recruiter adds internal evaluation note, visible to recruiter but hidden from candidate', async () => {
      const noteRes = await request(app)
        .post(`/api/recruiter/applications/${app1.id || app1._id}/notes`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ text: 'Strong system design skills, recommend offering ₹35 LPA.' });

      expect(noteRes.status).toBe(200);
      expect(noteRes.body.success).toBe(true);

      // Verify recruiter sees the note
      const recView = await request(app)
        .get(`/api/applications/${app1.id || app1._id}`)
        .set('Authorization', `Bearer ${recruiterToken}`);
      expect(recView.body.application.notes).toBeInstanceOf(Array);
      expect(recView.body.application.notes.length).toBeGreaterThan(0);
      expect(recView.body.application.notes[0].text).toContain('Strong system design');

      // Verify candidate DOES NOT see the note
      const candView = await request(app)
        .get(`/api/applications/${app1.id || app1._id}`)
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(candView.body.application.notes).toBeUndefined();
    });

    it('23. Recruiter cannot withdraw an application via status update (400 Bad Request)', async () => {
      const res = await request(app)
        .patch(`/api/recruiter/applications/${app1.id || app1._id}/status`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ status: 'withdrawn' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/candidate/i);
    });

    it('24. Recruiter cannot update status of already withdrawn application (400 Bad Request)', async () => {
      // Candidate withdraws
      await request(app)
        .patch(`/api/applications/${app1.id || app1._id}/withdraw`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ reason: 'Withdrawing' });

      // Recruiter attempts status update
      const res = await request(app)
        .patch(`/api/recruiter/applications/${app1.id || app1._id}/status`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ status: 'shortlisted' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/withdrawn/i);
    });
  });

  // ==========================================================================
  // 5. SAVED JOBS (BOOKMARKS) MANAGEMENT
  // ==========================================================================
  describe('Saved Jobs (Bookmarks) Management', () => {
    it('25. Candidate saves a published job with 200 OK via POST /api/jobs/:jobId/save', async () => {
      const res = await request(app)
        .post(`/api/jobs/${internalJob._id || internalJob.id}/save`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isSaved).toBe(true);
    });

    it('26. Candidate saves a published job via POST /api/saved-jobs/:jobId', async () => {
      const res = await request(app)
        .post(`/api/saved-jobs/${internalJob._id || internalJob.id}`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isSaved).toBe(true);
    });

    it('27. Saving an already saved job is idempotent (returns 200 and isSaved: true)', async () => {
      await request(app)
        .post(`/api/jobs/${internalJob._id || internalJob.id}/save`)
        .set('Authorization', `Bearer ${candidateToken}`);

      const res = await request(app)
        .post(`/api/jobs/${internalJob._id || internalJob.id}/save`)
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isSaved).toBe(true);
    });

    it('28. Candidate cannot save a closed or unpublished job (400 Bad Request)', async () => {
      const res = await request(app)
        .post(`/api/jobs/${closedJob._id || closedJob.id}/save`)
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/inactive or unpublished/i);
    });

    it('29. Recruiter cannot save jobs (403 Forbidden)', async () => {
      const res = await request(app)
        .post(`/api/jobs/${internalJob._id || internalJob.id}/save`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('30. Candidate checks if a job is saved via GET /api/jobs/:jobId/saved and /api/saved-jobs/:jobId/check', async () => {
      // Check before saving
      const resBefore = await request(app)
        .get(`/api/jobs/${internalJob._id || internalJob.id}/saved`)
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(resBefore.status).toBe(200);
      expect(resBefore.body.isSaved).toBe(false);

      // Save job
      await request(app)
        .post(`/api/jobs/${internalJob._id || internalJob.id}/save`)
        .set('Authorization', `Bearer ${candidateToken}`);

      // Check after saving
      const resAfter = await request(app)
        .get(`/api/saved-jobs/${internalJob._id || internalJob.id}/check`)
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(resAfter.status).toBe(200);
      expect(resAfter.body.isSaved).toBe(true);
    });

    it('31. Candidate retrieves their saved jobs list via GET /api/saved-jobs', async () => {
      await request(app)
        .post(`/api/jobs/${internalJob._id || internalJob.id}/save`)
        .set('Authorization', `Bearer ${candidateToken}`);

      const res = await request(app)
        .get('/api/saved-jobs')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.savedJobs).toBeInstanceOf(Array);
      expect(res.body.savedJobs.length).toBe(1);
      expect(res.body.savedJobs[0].job.title).toBe('Senior Backend Engineer');
    });

    it('32. Candidate unsaves a job via DELETE /api/jobs/:jobId/save', async () => {
      // Save first
      await request(app)
        .post(`/api/jobs/${internalJob._id || internalJob.id}/save`)
        .set('Authorization', `Bearer ${candidateToken}`);

      // Unsave
      const res = await request(app)
        .delete(`/api/jobs/${internalJob._id || internalJob.id}/save`)
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isSaved).toBe(false);

      // Verify list is now empty
      const listRes = await request(app)
        .get('/api/saved-jobs')
        .set('Authorization', `Bearer ${candidateToken}`);
      expect(listRes.body.savedJobs.length).toBe(0);
    });
  });

  // ==========================================================================
  // 6. SECURE RESUME ACCESS AUTHORIZATION (hasActiveApplication)
  // ==========================================================================
  describe('Secure Resume Access Authorization', () => {
    beforeEach(async () => {
      // Aarav applies to PhonePe's internal job
      await request(app)
        .post(`/api/jobs/${internalJob._id || internalJob.id}/apply`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ coverNote: 'Active application for resume check' });
    });

    it('33. Recruiter at PhonePe can access applicant Aarav\'s resume stream because of active application', async () => {
      const res = await request(app)
        .get(`/api/profile/resume/download/${candidateUser._id || candidateUser.id}`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      // Returns 200 or binary PDF stream
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('application/pdf');
    });

    it('34. Recruiter at Swiggy (unrelated company) cannot access Aarav\'s resume (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/profile/resume/download/${candidateUser._id || candidateUser.id}`)
        .set('Authorization', `Bearer ${otherRecruiterToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not applied|not authorized|access denied/i);
    });
  });
});
