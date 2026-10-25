/**
 * Automated Talent Match & Intelligent Job Matching Test Suite for HireConnect (Phase 7)
 * Covers:
 * 1. 6-Factor Deterministic Matching Algorithm Unit Tests (weights, normalization, aliases, intervals)
 * 2. Candidate Recommendations Endpoint: GET /api/matching/jobs
 * 3. Recruiter Candidate Discovery Endpoint: GET /api/recruiter/jobs/:jobId/matches
 * 4. Privacy, Discoverability & Authorization Controls
 * 5. Edge cases, Boundary Checks & Idempotency / Determinism
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
const matchingService = require('../src/services/matching.service');
const { generateAccessToken } = require('../src/utils/token');

describe('HireConnect Phase 7: Talent Match & Intelligent Matching Engine', () => {
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
  let publishedJob = null;
  let draftJob = null;
  let closedJob = null;

  beforeEach(async () => {
    User.__clearMemoryStore();
    CandidateProfile.__clearMemoryStore();
    Company.__clearMemoryStore();
    CompanyMembership.__clearMemoryStore();
    Job.__clearMemoryStore();
    Application.__clearMemoryStore();
    SavedJob.__clearMemoryStore();

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
      name: 'Zomato Media',
      slug: 'zomato',
      industry: 'FoodTech',
      verificationStatus: 'verified',
      verifiedAt: new Date(),
      headquarters: { city: 'Gurugram', state: 'Haryana', country: 'India' }
    });

    // 2. Recruiter User (PhonePe)
    recruiterUser = await User.create({
      name: 'Rohan Sharma',
      email: 'rohan.recruiter@phonepe.com',
      role: 'recruiter',
      isEmailVerified: true
    });
    await CompanyMembership.create({
      user: recruiterUser._id,
      company: verifiedCompany._id,
      role: 'admin',
      status: 'active'
    });
    recruiterToken = generateAccessToken(recruiterUser);

    // 3. Other Recruiter User (Zomato)
    otherRecruiterUser = await User.create({
      name: 'Anjali Verma',
      email: 'anjali@zomato.com',
      role: 'recruiter',
      isEmailVerified: true
    });
    await CompanyMembership.create({
      user: otherRecruiterUser._id,
      company: otherCompany._id,
      role: 'member',
      status: 'active'
    });
    otherRecruiterToken = generateAccessToken(otherRecruiterUser);

    // 4. Candidate 1 (Full profile, discoverable)
    candidateUser = await User.create({
      name: 'Sabari Kumar',
      email: 'sabari@example.com',
      role: 'candidate',
      isEmailVerified: true
    });
    candidateToken = generateAccessToken(candidateUser);

    await CandidateProfile.create({
      user: candidateUser._id,
      userId: candidateUser._id,
      headline: 'Senior Full Stack Engineer',
      summary: 'Experienced JavaScript, Node.js and React architect with 5 years building scalable systems.',
      location: 'Bengaluru, Karnataka',
      skills: [
        { name: 'JavaScript', level: 'Expert' },
        { name: 'React', level: 'Advanced' },
        { name: 'Node.js', level: 'Advanced' },
        { name: 'MongoDB', level: 'Intermediate' },
        { name: 'TypeScript', level: 'Intermediate' }
      ],
      experience: [
        {
          jobTitle: 'Senior Software Engineer',
          employer: 'Flipkart',
          startDate: new Date('2021-01-01'),
          endDate: new Date('2024-01-01'),
          isCurrent: false
        },
        {
          jobTitle: 'Software Engineer',
          employer: 'Swiggy',
          startDate: new Date('2019-01-01'),
          endDate: new Date('2020-12-31'),
          isCurrent: false
        }
      ],
      education: [
        {
          institution: 'National Institute of Technology',
          qualification: 'Bachelor of Technology',
          fieldOfStudy: 'Computer Science',
          startDate: new Date('2015-08-01'),
          endDate: new Date('2019-05-31')
        }
      ],
      preferredWorkModes: ['remote', 'hybrid'],
      preferredLocations: ['Bengaluru', 'Remote'],
      preferredEmploymentTypes: ['full-time'],
      desiredJobTitles: ['Senior Full Stack Engineer', 'Software Engineer'],
      discoverability: true,
      isDiscoverable: true,
      completionPercentage: 90,
      completeness: 90
    });

    // 5. Candidate 2 (Undiscoverable candidate)
    candidate2User = await User.create({
      name: 'Private Candidate',
      email: 'private@example.com',
      role: 'candidate',
      isEmailVerified: true
    });
    candidate2Token = generateAccessToken(candidate2User);

    await CandidateProfile.create({
      user: candidate2User._id,
      userId: candidate2User._id,
      headline: 'Backend Developer',
      location: 'Pune, Maharashtra',
      skills: [{ name: 'Python', level: 'Intermediate' }, { name: 'Django', level: 'Intermediate' }],
      experience: [],
      discoverability: false,
      isDiscoverable: false,
      completeness: 40
    });

    // 6. Published Job
    publishedJob = await Job.create({
      title: 'Senior Full Stack Engineer',
      slug: 'senior-full-stack-engineer-phonepe',
      company: verifiedCompany._id,
      companyName: 'PhonePe Technologies',
      postedBy: recruiterUser._id,
      category: 'Software Engineering',
      status: 'published',
      workMode: 'hybrid',
      employmentType: 'full-time',
      location: 'Bengaluru, Karnataka',
      experienceLevel: 'senior',
      minExperienceYears: 3,
      maxExperienceYears: 7,
      requiredSkills: ['JavaScript', 'Node.js', 'React'],
      preferredSkills: ['MongoDB', 'TypeScript', 'Docker'],
      skills: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'TypeScript'],
      salary: '₹28,00,000 - ₹38,00,000',
      publishedAt: new Date()
    });

    // 7. Draft and Closed Jobs
    draftJob = await Job.create({
      title: 'Draft ML Engineer',
      slug: 'draft-ml-engineer',
      company: verifiedCompany._id,
      companyName: 'PhonePe Technologies',
      postedBy: recruiterUser._id,
      category: 'Data Science',
      status: 'draft',
      workMode: 'remote',
      employmentType: 'full-time',
      location: 'Bengaluru',
      requiredSkills: ['Python', 'TensorFlow']
    });

    closedJob = await Job.create({
      title: 'Closed DevOps Role',
      slug: 'closed-devops-role',
      company: verifiedCompany._id,
      companyName: 'PhonePe Technologies',
      postedBy: recruiterUser._id,
      category: 'DevOps',
      status: 'closed',
      workMode: 'on-site',
      employmentType: 'full-time',
      location: 'Bengaluru',
      requiredSkills: ['AWS', 'Kubernetes']
    });
  });

  // ===========================================================================
  // SECTION 1: 6-Factor Algorithm Unit Tests
  // ===========================================================================
  describe('Matching Formula Unit Tests', () => {
    test('1. should calculate near 100% score when candidate matches all 6 criteria perfectly', () => {
      const candidate = {
        skills: [{ name: 'React' }, { name: 'Node.js' }, { name: 'MongoDB' }, { name: 'Docker' }],
        experience: [{ startDate: new Date('2019-01-01'), endDate: new Date('2024-01-01') }], // 5 years
        location: 'Bengaluru',
        preferredLocations: ['Bengaluru'],
        preferredWorkModes: ['hybrid'],
        preferredEmploymentTypes: ['full-time'],
        education: [{ qualification: 'B.Tech in Computer Science' }],
        headline: 'Full Stack Engineer',
        desiredJobTitles: ['Full Stack Engineer']
      };

      const job = {
        title: 'Full Stack Engineer',
        category: 'Engineering',
        workMode: 'hybrid',
        location: 'Bengaluru',
        employmentType: 'full-time',
        minExperienceYears: 3,
        maxExperienceYears: 6,
        requiredSkills: ['React', 'Node.js'],
        preferredSkills: ['MongoDB', 'Docker'],
        skills: ['React', 'Node.js', 'MongoDB', 'Docker'],
        educationRequirement: "Bachelor's"
      };

      const result = matchingService.evaluateCandidateJobMatch(candidate, job);
      expect(result.matchScore).toBeGreaterThanOrEqual(95);
      expect(result.matchScore).toBeLessThanOrEqual(100);
      expect(result.category).toBe('Excellent match');
      expect(result.dataCompleteness).toBe(100);
      expect(result.limitedData).toBe(false);
      expect(result.factors).toHaveLength(6);
    });

    test('2. should calculate low score when candidate has zero matching skills or criteria', () => {
      const candidate = {
        skills: [{ name: 'Graphic Design' }, { name: 'Photoshop' }],
        experience: [{ startDate: new Date('2023-01-01'), endDate: new Date('2023-06-01') }], // 0.5 yrs
        location: 'Kolkata',
        preferredLocations: ['Kolkata'],
        preferredWorkModes: ['on-site'],
        preferredEmploymentTypes: ['contract'],
        education: [{ qualification: 'Fine Arts' }],
        headline: 'Graphic Designer',
        desiredJobTitles: ['UI Designer']
      };

      const job = {
        title: 'DevOps Lead Engineer',
        category: 'DevOps',
        workMode: 'remote',
        location: 'Bengaluru',
        employmentType: 'full-time',
        minExperienceYears: 8,
        requiredSkills: ['Kubernetes', 'Terraform', 'Golang'],
        preferredSkills: ['AWS']
      };

      const result = matchingService.evaluateCandidateJobMatch(candidate, job);
      expect(result.matchScore).toBeLessThan(40);
      expect(result.category).toBe('Lower match');
      expect(result.missingSkills).toContain('Kubernetes');
    });

    test('3. should handle missing profile data gracefully with evidence weight normalization and limitedData flag', () => {
      const candidate = {
        // Only skills provided; no experience, location, education, etc.
        skills: [{ name: 'React' }, { name: 'Node.js' }]
      };

      const job = {
        title: 'React Developer',
        requiredSkills: ['React', 'Node.js']
      };

      const result = matchingService.evaluateCandidateJobMatch(candidate, job);
      // Skills matched (40% weight). Because only skills have evidence (40 weight), normalized score is 100
      expect(result.matchScore).toBe(100);
      expect(result.dataCompleteness).toBe(40); // 40% known evidence
      expect(result.limitedData).toBe(true); // completeness < 60%
    });

    test('4. should correctly normalize skill aliases (e.g. reactjs -> react, node.js -> nodejs)', () => {
      expect(matchingService.normalizeSkill('React.js')).toBe('react');
      expect(matchingService.normalizeSkill('reactjs')).toBe('react');
      expect(matchingService.normalizeSkill('Node.js')).toBe('nodejs');
      expect(matchingService.normalizeSkill('node')).toBe('nodejs');
      expect(matchingService.normalizeSkill('K8s')).toBe('kubernetes');
      expect(matchingService.normalizeSkill('AWS')).toBe('aws');
      expect(matchingService.normalizeSkill('Amazon Web Services')).toBe('aws');
    });

    test('5. should calculate non-overlapping experience intervals accurately without double-counting', () => {
      const candidate = {
        experience: [
          // Job A: 2020-01-01 to 2022-01-01 (2 years)
          { startDate: new Date('2020-01-01'), endDate: new Date('2022-01-01') },
          // Job B: 2021-01-01 to 2023-01-01 (overlapping 1 year with Job A, extends by 1 year)
          { startDate: new Date('2021-01-01'), endDate: new Date('2023-01-01') }
        ]
      };

      // Total union span should be 2020-01-01 to 2023-01-01 => 3.0 years, not 4.0 years!
      const years = matchingService.calculateExperienceYears(candidate);
      expect(years).toBe(3);
    });

    test('6. should evaluate location compatibility (remote job = 100% remote preference)', () => {
      const candidate = {
        location: 'Jaipur',
        preferredWorkModes: ['remote']
      };
      const remoteJob = {
        workMode: 'remote',
        location: 'Bengaluru'
      };

      const match = matchingService.evaluateCandidateJobMatch(candidate, remoteJob);
      const locFactor = match.factors.find(f => f.id === 'locationWorkMode');
      expect(locFactor.score).toBe(100);
      expect(locFactor.state).toBe('matched');
    });

    test('7. should evaluate employment type alignment', () => {
      const candidate = {
        preferredEmploymentTypes: ['full-time', 'contract']
      };
      const job = {
        employmentType: 'full-time'
      };

      const match = matchingService.evaluateCandidateJobMatch(candidate, job);
      const empFactor = match.factors.find(f => f.id === 'employmentPreferences');
      expect(empFactor.score).toBe(100);
    });

    test('8. should verify determinism: running the formula 100 times returns identical scores', () => {
      const candidate = {
        skills: [{ name: 'React' }, { name: 'TypeScript' }],
        experience: [{ startDate: new Date('2020-01-01'), endDate: new Date('2023-01-01') }],
        location: 'Bengaluru',
        preferredWorkModes: ['hybrid'],
        preferredEmploymentTypes: ['full-time'],
        headline: 'Frontend Engineer'
      };
      const job = {
        title: 'Frontend Engineer',
        workMode: 'hybrid',
        location: 'Bengaluru',
        employmentType: 'full-time',
        minExperienceYears: 2,
        requiredSkills: ['React'],
        preferredSkills: ['TypeScript']
      };

      const baseline = matchingService.evaluateCandidateJobMatch(candidate, job);
      for (let i = 0; i < 100; i++) {
        const rerun = matchingService.evaluateCandidateJobMatch(candidate, job);
        expect(rerun.matchScore).toBe(baseline.matchScore);
        expect(rerun.dataCompleteness).toBe(baseline.dataCompleteness);
      }
    });

    test('9. should ensure match scores are strictly bounded between 0 and 100', () => {
      const match1 = matchingService.evaluateCandidateJobMatch({}, {});
      expect(match1.matchScore).toBeGreaterThanOrEqual(0);
      expect(match1.matchScore).toBeLessThanOrEqual(100);

      const perfectProfile = {
        skills: [{ name: 'React' }, { name: 'Node' }, { name: 'Mongo' }],
        experience: [{ startDate: new Date('2015-01-01'), endDate: new Date('2024-01-01') }],
        location: 'Bengaluru',
        preferredLocations: ['Bengaluru'],
        preferredWorkModes: ['hybrid'],
        preferredEmploymentTypes: ['full-time'],
        education: [{ qualification: 'B.Tech' }],
        headline: 'Staff Software Engineer',
        desiredJobTitles: ['Staff Software Engineer']
      };
      const job = {
        title: 'Staff Software Engineer',
        category: 'Software Engineering',
        workMode: 'hybrid',
        location: 'Bengaluru',
        employmentType: 'full-time',
        minExperienceYears: 5,
        requiredSkills: ['React', 'Node'],
        preferredSkills: ['Mongo']
      };

      const match2 = matchingService.evaluateCandidateJobMatch(perfectProfile, job);
      expect(match2.matchScore).toBeGreaterThanOrEqual(0);
      expect(match2.matchScore).toBeLessThanOrEqual(100);
    });
  });

  // ===========================================================================
  // SECTION 2: Candidate Recommendation Endpoint (GET /api/matching/jobs)
  // ===========================================================================
  describe('Candidate Job Recommendations: GET /api/matching/jobs', () => {
    test('10. should allow authenticated candidate to retrieve personalized job recommendations', async () => {
      const res = await request(app)
        .get('/api/matching/jobs')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.matches)).toBe(true);
      expect(res.body.matches.length).toBeGreaterThan(0);

      const topMatch = res.body.matches[0];
      expect(topMatch.job).toBeDefined();
      expect(topMatch.job.id).toBe(publishedJob._id.toString());
      expect(topMatch.matchScore).toBeGreaterThanOrEqual(70);
      expect(topMatch.dataCompleteness).toBeGreaterThan(0);
      expect(topMatch.category).toBeDefined();
      expect(topMatch.factors).toHaveLength(6);
      expect(res.body.candidateProfileCompleteness).toBeGreaterThanOrEqual(80);
    });

    test('11. should reject unauthenticated requests with 401 Unauthorized', async () => {
      const res = await request(app).get('/api/matching/jobs');
      expect(res.status).toBe(401);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });

    test('12. should reject recruiter attempting to access candidate recommendations with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/matching/jobs')
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(403);
    });

    test('13. should exclude draft and closed jobs from recommendations', async () => {
      const res = await request(app)
        .get('/api/matching/jobs')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      const jobIds = res.body.matches.map(m => m.job.id);
      expect(jobIds).toContain(publishedJob._id.toString());
      expect(jobIds).not.toContain(draftJob._id.toString());
      expect(jobIds).not.toContain(closedJob._id.toString());
    });

    test('14. should accurately reflect batch isSaved and isApplied state', async () => {
      // 1. Candidate saves the published job
      await SavedJob.create({
        candidate: candidateUser._id,
        job: publishedJob._id
      });

      // 2. Candidate applies for the job
      await Application.create({
        job: publishedJob._id,
        candidate: candidateUser._id,
        candidateSnapshot: { fullName: 'Sabari Kumar', email: 'sabari@example.com' },
        jobSnapshot: { title: publishedJob.title, company: verifiedCompany.name },
        company: verifiedCompany._id,
        status: 'applied'
      });

      const res = await request(app)
        .get('/api/matching/jobs')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      const match = res.body.matches.find(m => m.job.id === publishedJob._id.toString());
      expect(match).toBeDefined();
      expect(match.isSaved).toBe(true);
      expect(match.isApplied).toBe(true);
    });

    test('15. should support filtering by minScore and workMode', async () => {
      const res = await request(app)
        .get('/api/matching/jobs?minScore=99&workMode=remote')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      // Our published job is hybrid, so remote filter should result in 0 matches
      expect(res.body.matches).toHaveLength(0);
    });

    test('16. should support alias route GET /api/talent-match/jobs', async () => {
      const res = await request(app)
        .get('/api/talent-match/jobs')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.matches.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // SECTION 3: Recruiter Candidate Matching Endpoint
  // ===========================================================================
  describe('Recruiter Candidate Matching: GET /api/recruiter/jobs/:jobId/matches', () => {
    test('17. should allow authorized company recruiter to discover matching candidates for published job', async () => {
      const res = await request(app)
        .get(`/api/recruiter/jobs/${publishedJob._id}/matches`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.job.id).toBe(publishedJob._id.toString());
      expect(Array.isArray(res.body.matches)).toBe(true);

      // Candidate 1 is discoverable; Candidate 2 is discoverability=false
      const candidate1Match = res.body.matches.find(m => m.candidateId === candidateUser._id.toString());
      expect(candidate1Match).toBeDefined();
      expect(candidate1Match.matchScore).toBeGreaterThan(60);
      expect(candidate1Match.experienceYears).toBeGreaterThan(0);
      expect(candidate1Match.matchedSkills).toContain('React');
    });

    test('18. should strictly exclude candidates who have discoverability=false', async () => {
      const res = await request(app)
        .get(`/api/recruiter/jobs/${publishedJob._id}/matches`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(200);
      const matchCandidateIds = res.body.matches.map(m => m.candidateId);
      expect(matchCandidateIds).toContain(candidateUser._id.toString());
      expect(matchCandidateIds).not.toContain(candidate2User._id.toString());
    });

    test('19. should protect candidate private contact information in discovery view', async () => {
      const res = await request(app)
        .get(`/api/recruiter/jobs/${publishedJob._id}/matches`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(200);
      const candidate1Match = res.body.matches.find(m => m.candidateId === candidateUser._id.toString());
      // Email, phone, resume direct paths must not be leaked in discovery response
      expect(candidate1Match.email).toBeUndefined();
      expect(candidate1Match.phone).toBeUndefined();
      expect(candidate1Match.resumeUrl).toBeUndefined();
    });

    test('20. should reject unauthorized recruiter from different company with 403 Forbidden', async () => {
      // otherRecruiterUser belongs to Zomato, while publishedJob belongs to PhonePe
      const res = await request(app)
        .get(`/api/recruiter/jobs/${publishedJob._id}/matches`)
        .set('Authorization', `Bearer ${otherRecruiterToken}`);

      expect(res.status).toBe(403);
    });

    test('21. should reject candidate attempting to access recruiter candidate matching with 403 Forbidden', async () => {
      const res = await request(app)
        .get(`/api/recruiter/jobs/${publishedJob._id}/matches`)
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(403);
    });

    test('22. should return 404 when matching against non-existent job ID', async () => {
      const res = await request(app)
        .get('/api/recruiter/jobs/666666666666666666666666/matches')
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(404);
    });

    test('23. should support alias route GET /api/talent-match/candidates?jobId=...', async () => {
      const res = await request(app)
        .get(`/api/talent-match/candidates?jobId=${publishedJob._id}`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.matches.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // SECTION 4: Saved Jobs & Shortlist Action Endpoints
  // ===========================================================================
  describe('Talent Match Actions (Save & Shortlist)', () => {
    test('24. should toggle save job state via POST /api/matching/save-job', async () => {
      // First call saves the job
      const res1 = await request(app)
        .post('/api/matching/save-job')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ jobId: publishedJob._id.toString() });

      expect(res1.status).toBe(200);
      expect(res1.body.isSaved).toBe(true);

      // Second call unsaves the job
      const res2 = await request(app)
        .post('/api/matching/save-job')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ jobId: publishedJob._id.toString() });

      expect(res2.status).toBe(200);
      expect(res2.body.isSaved).toBe(false);
    });

    test('25. should toggle candidate shortlist via POST /api/matching/shortlist', async () => {
      // Recruiter shortlists candidate
      const res1 = await request(app)
        .post('/api/matching/shortlist')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          jobId: publishedJob._id.toString(),
          candidateId: candidateUser._id.toString()
        });

      expect(res1.status).toBe(200);
      expect(res1.body.isShortlisted).toBe(true);

      // Recruiter toggles shortlist off
      const res2 = await request(app)
        .post('/api/matching/shortlist')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          jobId: publishedJob._id.toString(),
          candidateId: candidateUser._id.toString()
        });

      expect(res2.status).toBe(200);
      expect(res2.body.isShortlisted).toBe(false);
    });
  });

  // ===========================================================================
  // SECTION 5: Edge Cases & Resiliency
  // ===========================================================================
  describe('Edge Cases and Mathematical Resiliency', () => {
    test('26. should safely handle job with zero required skills without division by zero', () => {
      const jobWithNoSkills = {
        title: 'General Office Assistant',
        requiredSkills: [],
        preferredSkills: []
      };
      const candidate = {
        skills: [{ name: 'Typing' }]
      };

      const result = matchingService.evaluateCandidateJobMatch(candidate, jobWithNoSkills);
      expect(result.matchScore).toBeDefined();
      expect(isNaN(result.matchScore)).toBe(false);
      expect(result.matchScore).toBeGreaterThanOrEqual(0);
    });

    test('27. should handle empty candidate profile gracefully', () => {
      const result = matchingService.evaluateCandidateJobMatch({}, { title: 'Engineer' });
      expect(result.matchScore).toBe(0);
      expect(result.dataCompleteness).toBe(0);
      expect(result.limitedData).toBe(true);
      expect(result.category).toBe('Lower match');
    });
  });
});
