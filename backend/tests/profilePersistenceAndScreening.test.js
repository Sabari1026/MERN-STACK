/**
 * Dedicated Test Suite for HireConnect Bio Persistence, Discoverability Settings,
 * and Application Screening Questions
 */

const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const CandidateProfile = require('../src/models/candidateProfile.model');
const RecruiterProfile = require('../src/models/recruiterProfile.model');
const Company = require('../src/models/company.model');
const Job = require('../src/models/job.model');
const Application = require('../src/models/application.model');
const ResumeAsset = require('../src/models/resumeAsset.model');
const storageService = require('../src/services/storage.service');

describe('HireConnect: Bio Persistence, Discoverability & Screening Questions', () => {
  let candidateToken = '';
  let candidateUser = null;
  let recruiterToken = '';
  let recruiterUser = null;
  let testCompany = null;
  let testJob = null;

  beforeEach(async () => {
    User.__clearMemoryStore();
    CandidateProfile.__clearMemoryStore();
    RecruiterProfile.__clearMemoryStore();
    ResumeAsset.__clearMemoryStore();
    storageService.clearMockStorage();
    await User.__seedMemoryDefaults();

    // Authenticate Candidate
    const candLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'candidate@hireconnect.io', password: 'Candidate@123', role: 'candidate' });
    candidateToken = candLogin.body.token;
    candidateUser = candLogin.body.user;

    // Authenticate Recruiter
    const recLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'recruiter@hireconnect.io', password: 'Recruiter@123', role: 'recruiter' });
    recruiterToken = recLogin.body.token;
    recruiterUser = recLogin.body.user;

    // Create Company & Job for Application testing
    testCompany = await Company.create({
      name: 'InnovateTech Solutions',
      slug: `innovatetech-${Date.now()}`,
      industry: 'Technology',
      verificationStatus: 'verified',
      createdBy: recruiterUser.id
    });

    testJob = await Job.create({
      title: 'Full Stack Staff Engineer',
      slug: `full-stack-staff-engineer-${Date.now()}`,
      description: 'Building resilient microservices and reactive interfaces with MongoDB and Node.',
      company: testCompany._id,
      createdBy: recruiterUser.id,
      status: 'published',
      location: 'Bengaluru, Karnataka',
      workMode: 'hybrid',
      skills: ['Node.js', 'React', 'MongoDB'],
      screeningQuestions: [
        {
          id: 'q1',
          question: 'Do you have at least 3 years of production experience with MongoDB?',
          required: true,
          type: 'yes_no'
        },
        {
          id: 'q2',
          question: 'What is your notice period?',
          required: false,
          type: 'text'
        }
      ]
    });
  });

  describe('1. Candidate Bio Persistence', () => {
    it('should save candidate bio when frontend sends bio and map it to summary', async () => {
      const bioText = 'Senior Full Stack Architect specializing in high-throughput distributed systems and MongoDB optimization.';

      // Candidate updates profile sending bio
      const updateRes = await request(app)
        .patch('/api/candidates/me')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          headline: 'Principal Engineer',
          bio: bioText
        })
        .expect(200);

      expect(updateRes.body.success).toBe(true);
      expect(updateRes.body.data.profile.bio).toBe(bioText);
      expect(updateRes.body.data.profile.summary).toBe(bioText);

      // Verify that reopening profile returns the saved bio
      const getRes = await request(app)
        .get('/api/candidates/me')
        .set('Authorization', `Bearer ${candidateToken}`)
        .expect(200);

      expect(getRes.body.success).toBe(true);
      expect(getRes.body.data.profile.bio).toBe(bioText);
      expect(getRes.body.data.profile.summary).toBe(bioText);
    });

    it('should support legacy PUT /api/profile/candidate with bio payload', async () => {
      const bioText = 'Passionate developer with expertise in cloud native applications and event architecture.';

      const putRes = await request(app)
        .put('/api/profile/candidate')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          headline: 'Cloud Engineer',
          bio: bioText
        })
        .expect(200);

      expect(putRes.body.success).toBe(true);
      expect(putRes.body.data.profile.bio).toBe(bioText);
      expect(putRes.body.data.profile.summary).toBe(bioText);
    });
  });

  describe('2. Candidate Discoverability Settings & Recruiter Privacy', () => {
    it('should normalize root-level isDiscoverable and persist setting', async () => {
      // 1. Enable discoverability with root-level isDiscoverable
      const enableRes = await request(app)
        .patch('/api/candidates/me')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ isDiscoverable: true })
        .expect(200);

      expect(enableRes.body.data.profile.isDiscoverable).toBe(true);
      expect(enableRes.body.data.profile.discoverability).toBe(true);
      expect(enableRes.body.data.profile.privacy.isDiscoverable).toBe(true);

      // Verify profile is now visible in recruiter discovery
      const discRes1 = await request(app)
        .get('/api/candidates/discover')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .expect(200);

      const foundCandidate = discRes1.body.candidates.find(
        (c) => c.userId === candidateUser.id || c.name === candidateUser.name
      );
      expect(foundCandidate).toBeDefined();

      // 2. Disable discoverability with root-level isDiscoverable: false
      const disableRes = await request(app)
        .patch('/api/candidates/me')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ isDiscoverable: false })
        .expect(200);

      expect(disableRes.body.data.profile.isDiscoverable).toBe(false);
      expect(disableRes.body.data.profile.discoverability).toBe(false);
      expect(disableRes.body.data.profile.privacy.isDiscoverable).toBe(false);

      // Verify profile is EXCLUDED from recruiter candidate discovery
      const discRes2 = await request(app)
        .get('/api/candidates/discover')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .expect(200);

      const notFoundCandidate = discRes2.body.candidates.find(
        (c) => c.userId === candidateUser.id || c.name === candidateUser.name
      );
      expect(notFoundCandidate).toBeUndefined();

      // Verify unapplied recruiter direct access to profile returns 403 Forbidden
      await request(app)
        .get(`/api/candidates/${candidateUser.id}`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .expect(403);

      await request(app)
        .get(`/api/profiles/${candidateUser.id}`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .expect(403);
    });
  });

  describe('3. Application Screening Questions', () => {
    it('should reject application if required screening question is missing', async () => {
      // Missing required question 'q1'
      const res = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          jobId: testJob._id.toString(),
          coverLetter: 'Interested in this role.',
          answers: [
            { question: 'What is your notice period?', answer: '30 Days' }
          ]
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Screening question.*requires an answer/i);
    });

    it('should successfully submit application with answers matching schema', async () => {
      const answersPayload = [
        {
          question: 'Do you have at least 3 years of production experience with MongoDB?',
          answer: 'Yes'
        },
        {
          question: 'What is your notice period?',
          answer: 'Immediate'
        }
      ];

      const res = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          jobId: testJob._id.toString(),
          coverLetter: 'Strong production MongoDB experience and microservice background.',
          answers: answersPayload
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      const appDoc = res.body.data.application;
      expect(appDoc.answers).toHaveLength(2);
      expect(appDoc.answers[0].question).toBe(answersPayload[0].question);
      expect(appDoc.answers[0].answer).toBe('Yes');
      expect(appDoc.answers[1].answer).toBe('Immediate');
      expect(appDoc.coverLetter).toBe('Strong production MongoDB experience and microservice background.');

      // Verify retrieval of application answers
      const getAppRes = await request(app)
        .get(`/api/applications/${appDoc.id || appDoc._id}`)
        .set('Authorization', `Bearer ${candidateToken}`)
        .expect(200);

      expect(getAppRes.body.data.application.answers).toHaveLength(2);
      expect(getAppRes.body.data.application.answers[0].answer).toBe('Yes');
    });

    it('should succeed when job has no screening questions without requiring answers', async () => {
      // Create job without screening questions
      const simpleJob = await Job.create({
        title: 'Backend Engineer (Standard)',
        slug: `backend-eng-standard-${Date.now()}`,
        description: 'Standard software engineering opening without custom screening questions.',
        company: testCompany._id,
        createdBy: recruiterUser.id,
        status: 'published',
        screeningQuestions: []
      });

      const res = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          jobId: simpleJob._id.toString(),
          coverLetter: 'Applying for standard job.'
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.application.answers).toEqual([]);
      expect(res.body.data.application.coverLetter).toBe('Applying for standard job.');
    });
  });
});
