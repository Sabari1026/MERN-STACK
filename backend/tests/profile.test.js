/**
 * Automated Profile Management & Resume Storage Test Suite for HireConnect (Phase 3)
 * Covers: Candidate Profile, Recruiter Profile, Completeness Scoring, Avatar Uploads,
 * Magic Byte Verification, Resume Document Storage, Private Streaming, and Privacy Settings.
 */

const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const CandidateProfile = require('../src/models/candidateProfile.model');
const RecruiterProfile = require('../src/models/recruiterProfile.model');
const ResumeAsset = require('../src/models/resumeAsset.model');
const storageService = require('../src/services/storage.service');

// Binary fixtures for signature validation
const VALID_JPEG_BUFFER = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00]);
const VALID_PNG_BUFFER = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00]);
const VALID_WEBP_BUFFER = Buffer.concat([
  Buffer.from('RIFF'),
  Buffer.from([0x00, 0x00, 0x00, 0x00]),
  Buffer.from('WEBPVP8 ')
]);
const FAKE_TEXT_BUFFER = Buffer.from('This is a plain text file pretending to be something else.');
const VALID_PDF_BUFFER = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Title (Resume) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF');
const VALID_DOCX_BUFFER = Buffer.concat([
  Buffer.from([0x50, 0x4b, 0x03, 0x04]),
  Buffer.from('docx_content_data_inside_zip_archive')
]);

describe('HireConnect Phase 3: Profile Management & Storage', () => {
  let candidateToken = '';
  let candidateUser = null;
  let recruiterToken = '';
  let recruiterUser = null;

  beforeEach(async () => {
    User.__clearMemoryStore();
    CandidateProfile.__clearMemoryStore();
    RecruiterProfile.__clearMemoryStore();
    ResumeAsset.__clearMemoryStore();
    storageService.clearMockStorage();
    await User.__seedMemoryDefaults();

    // Authenticate candidate
    const candLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'candidate@hireconnect.io', password: 'Candidate@123', role: 'candidate' });
    candidateToken = candLogin.body.token;
    candidateUser = candLogin.body.user;

    // Authenticate recruiter
    const recLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'recruiter@hireconnect.io', password: 'Recruiter@123', role: 'recruiter' });
    recruiterToken = recLogin.body.token;
    recruiterUser = recLogin.body.user;
  });

  // 1. Candidate Profile Operations
  describe('Candidate Profile: GET /api/candidates/me & PATCH /api/candidates/me', () => {
    it('1. should retrieve current candidate profile with default values', async () => {
      const res = await request(app)
        .get('/api/candidates/me')
        .set('Authorization', `Bearer ${candidateToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.profile).toBeDefined();
      expect(res.body.data.profile.headline).toBe('Software Engineer');
      expect(res.body.data.completeness).toBeDefined();
    });

    it('2. should reject unauthenticated profile requests with 401', async () => {
      await request(app)
        .get('/api/candidates/me')
        .expect(401);
    });

    it('3. should reject recruiter attempting to access candidate-only endpoint with 403', async () => {
      await request(app)
        .get('/api/candidates/me')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .expect(403);
    });

    it('4. should update candidate profile fields using PATCH semantics (preserving unedited fields)', async () => {
      const patchData = {
        headline: 'Staff Full Stack Architect',
        location: 'Hyderabad, Telangana',
        summary: 'Experienced distributed systems engineer specializing in high-throughput microservices.',
        skills: [
          { name: 'Node.js', level: 'Expert', category: 'Backend' },
          { name: 'TypeScript', level: 'Expert', category: 'Language' },
          { name: 'PostgreSQL', level: 'Advanced', category: 'Database' }
        ]
      };

      const res = await request(app)
        .patch('/api/candidates/me')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send(patchData)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.profile.headline).toBe('Staff Full Stack Architect');
      expect(res.body.data.profile.location).toBe('Hyderabad, Telangana');
      expect(res.body.data.profile.skills.length).toBe(3);
      // Unedited preferredWorkModes should be preserved
      expect(res.body.data.profile.preferredWorkModes).toBeDefined();
    });

    it('5. should reject invalid education dates where end date is earlier than start date', async () => {
      const badEducation = {
        education: [
          {
            institution: 'IIT Bombay',
            qualification: 'B.Tech',
            fieldOfStudy: 'Computer Science',
            startDate: '2024-01-01',
            endDate: '2020-01-01', // Earlier than start date
            isCurrent: false
          }
        ]
      };

      const res = await request(app)
        .patch('/api/candidates/me')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send(badEducation)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('6. should reject invalid work experience dates where end date is earlier than start date', async () => {
      const badExp = {
        experience: [
          {
            employer: 'Google',
            jobTitle: 'Software Engineer',
            startDate: '2025-01-01',
            endDate: '2022-01-01',
            isCurrent: false
          }
        ]
      };

      const res = await request(app)
        .patch('/api/candidates/me')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send(badExp)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('7. should calculate completeness percentage deterministically', async () => {
      const comprehensiveData = {
        headline: 'Lead Cloud Architect',
        summary: 'Over a decade of hands-on experience designing and operating multi-region cloud infrastructure.',
        skills: [
          { name: 'Kubernetes', level: 'Expert' },
          { name: 'Go', level: 'Advanced' },
          { name: 'Terraform', level: 'Expert' }
        ],
        experience: [
          {
            employer: 'Razorpay',
            jobTitle: 'Tech Lead',
            startDate: '2020-01-01',
            isCurrent: true,
            description: 'Led payments gateway architecture.'
          }
        ],
        education: [
          {
            institution: 'BITS Pilani',
            qualification: 'M.Sc',
            startDate: '2015-01-01',
            endDate: '2019-01-01'
          }
        ]
      };

      const res = await request(app)
        .patch('/api/candidates/me')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send(comprehensiveData)
        .expect(200);

      // Score breakdown: headline(15) + summary(15) + skills(20) + experience(20) + education(15) = 85 (resume missing)
      expect(res.body.data.completeness.completionPercentage).toBe(85);
      expect(res.body.data.completeness.completedFields).toContain('skills');
      expect(res.body.data.completeness.completedFields).toContain('experience');
      expect(res.body.data.completeness.incompleteRecommendedFields).toContain('resume');
    });
  });

  // 2. Recruiter Profile Operations
  describe('Recruiter Profile: GET /api/recruiters/me & PATCH /api/recruiters/me', () => {
    it('8. should retrieve recruiter profile for authenticated recruiter', async () => {
      const res = await request(app)
        .get('/api/recruiters/me')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.profile).toBeDefined();
      expect(res.body.data.profile.jobTitle).toBe('Technical Recruiter');
    });

    it('9. should reject candidate attempting to access recruiter profile endpoint with 403', async () => {
      await request(app)
        .get('/api/recruiters/me')
        .set('Authorization', `Bearer ${candidateToken}`)
        .expect(403);
    });

    it('10. should allow recruiter to update permitted profile fields', async () => {
      const patchData = {
        jobTitle: 'Director of Talent Acquisition',
        department: 'Engineering Hiring',
        professionalSummary: 'Building world-class high-scale teams across India and remote hubs.',
        linkedinUrl: 'https://linkedin.com/in/priyamehta-talent'
      };

      const res = await request(app)
        .patch('/api/recruiters/me')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send(patchData)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.profile.jobTitle).toBe('Director of Talent Acquisition');
      expect(res.body.data.profile.department).toBe('Engineering Hiring');
    });

    it('11. should prevent recruiters from modifying company ownership or verification status', async () => {
      const maliciousPayload = {
        jobTitle: 'Hiring Lead',
        company: '507f1f77bcf86cd799439011',
        isVerified: true,
        companyName: 'Stolen Enterprise'
      };

      const res = await request(app)
        .patch('/api/recruiters/me')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send(maliciousPayload)
        .expect(200);

      // Verify company reference and verification were not compromised
      expect(res.body.data.profile.company).toBeNull();
    });
  });

  // 3. Avatar Upload & Image Management
  describe('Avatar Upload & Management: POST /api/users/me/avatar', () => {
    it('12. should upload authentic JPEG avatar and update user and candidate profile', async () => {
      const res = await request(app)
        .post('/api/users/me/avatar')
        .set('Authorization', `Bearer ${candidateToken}`)
        .attach('avatar', VALID_JPEG_BUFFER, 'profile.jpg')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.avatarUrl).toMatch(/^\/api\/users\/avatar\//);

      // Verify User document was updated
      const userRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${candidateToken}`)
        .expect(200);

      expect(userRes.body.user.avatarUrl).toBe(res.body.data.avatarUrl);
    });

    it('13. should upload authentic PNG avatar', async () => {
      const res = await request(app)
        .post('/api/users/me/avatar')
        .set('Authorization', `Bearer ${candidateToken}`)
        .attach('avatar', VALID_PNG_BUFFER, 'photo.png')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.avatarUrl).toBeDefined();
    });

    it('14. should reject fake image file using magic byte signature inspection', async () => {
      const res = await request(app)
        .post('/api/users/me/avatar')
        .set('Authorization', `Bearer ${candidateToken}`)
        .attach('avatar', FAKE_TEXT_BUFFER, 'fake_image.jpg')
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Unsupported image format/i);
    });

    it('15. should delete avatar and restore initials fallback', async () => {
      // First upload
      await request(app)
        .post('/api/users/me/avatar')
        .set('Authorization', `Bearer ${candidateToken}`)
        .attach('avatar', VALID_JPEG_BUFFER, 'profile.jpg');

      // Then delete
      const deleteRes = await request(app)
        .delete('/api/users/me/avatar')
        .set('Authorization', `Bearer ${candidateToken}`)
        .expect(200);

      expect(deleteRes.body.success).toBe(true);
      expect(deleteRes.body.data.avatarUrl).toBeNull();

      // Verify me endpoint reflects null avatar
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(meRes.body.user.avatarUrl).toBeNull();
    });
  });

  // 4. Resume Management
  describe('Resume Management: POST, GET, DOWNLOAD & DELETE /api/candidates/me/resume', () => {
    it('16. should upload valid PDF resume and persist ResumeAsset metadata', async () => {
      const res = await request(app)
        .post('/api/candidates/me/resume')
        .set('Authorization', `Bearer ${candidateToken}`)
        .attach('resume', VALID_PDF_BUFFER, 'Aarav_Sharma_Resume.pdf')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.resume).toBeDefined();
      expect(res.body.data.resume.originalFilename).toBe('Aarav_Sharma_Resume.pdf');
      expect(res.body.data.resume.mimeType).toBe('application/pdf');
      expect(res.body.data.resume.isCurrent).toBe(true);
    });

    it('17. should upload valid DOCX resume', async () => {
      const res = await request(app)
        .post('/api/candidates/me/resume')
        .set('Authorization', `Bearer ${candidateToken}`)
        .attach('resume', VALID_DOCX_BUFFER, 'Candidate_Resume.docx')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.resume.originalFilename).toBe('Candidate_Resume.docx');
    });

    it('18. should reject invalid/corrupted resume document using signature inspection', async () => {
      const res = await request(app)
        .post('/api/candidates/me/resume')
        .set('Authorization', `Bearer ${candidateToken}`)
        .attach('resume', FAKE_TEXT_BUFFER, 'corrupted.pdf')
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Unsupported document format/i);
    });

    it('19. should allow candidate to download their own private resume document', async () => {
      // Upload resume
      await request(app)
        .post('/api/candidates/me/resume')
        .set('Authorization', `Bearer ${candidateToken}`)
        .attach('resume', VALID_PDF_BUFFER, 'Official_Resume.pdf');

      // Download
      const res = await request(app)
        .get('/api/candidates/me/resume/download')
        .set('Authorization', `Bearer ${candidateToken}`)
        .expect(200);

      expect(res.headers['content-type']).toBe('application/pdf');
      expect(res.headers['content-disposition']).toMatch(/Official_Resume.pdf/);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('20. should reject another candidate attempting to download private resume with 403', async () => {
      // Candidate 1 uploads resume
      await request(app)
        .post('/api/candidates/me/resume')
        .set('Authorization', `Bearer ${candidateToken}`)
        .attach('resume', VALID_PDF_BUFFER, 'Secret_Resume.pdf');

      // Register Candidate 2
      const cand2Res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Other Candidate',
          email: 'other.candidate@example.com',
          password: 'Password@123',
          role: 'candidate'
        });
      const cand2Token = cand2Res.body.token;

      // Candidate 2 attempts to download Candidate 1's resume
      const cand1Id = candidateUser.id;
      const res = await request(app)
        .get(`/api/profile/resume/download/${cand1Id}`)
        .set('Authorization', `Bearer ${cand2Token}`)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('21. should safely delete resume and update candidate profile reference', async () => {
      // Upload resume
      await request(app)
        .post('/api/candidates/me/resume')
        .set('Authorization', `Bearer ${candidateToken}`)
        .attach('resume', VALID_PDF_BUFFER, 'ToDelete_Resume.pdf');

      // Delete resume
      const delRes = await request(app)
        .delete('/api/candidates/me/resume')
        .set('Authorization', `Bearer ${candidateToken}`)
        .expect(200);

      expect(delRes.body.success).toBe(true);

      // Verify resume is no longer attached
      const meRes = await request(app)
        .get('/api/candidates/me')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(meRes.body.data.profile.resume).toBeNull();
    });
  });

  // 5. Privacy, Discoverability, and Public Profile Access
  describe('Privacy & Discoverability: GET /api/profiles/:userId', () => {
    it('22. should verify discoverability defaults to false', async () => {
      const res = await request(app)
        .get('/api/candidates/me')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.body.data.profile.discoverability).toBe(false);
      expect(res.body.data.profile.resumeVisibility).toBe('private');
    });

    it('23. should reject public view when candidate has discoverability disabled', async () => {
      const candId = candidateUser.id;

      // Unauthenticated request to private candidate profile
      const res = await request(app)
        .get(`/api/profiles/${candId}`)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('24. should allow public view when candidate opts in to discoverability', async () => {
      // Opt into discoverability
      await request(app)
        .patch('/api/candidates/me')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ discoverability: true });

      const candId = candidateUser.id;
      const res = await request(app)
        .get(`/api/profiles/${candId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.profile.headline).toBeDefined();
    });

    it('25. should redact phone and contact email from public profile when hideContactInfo is true', async () => {
      // Candidate enables discoverability and contact masking
      await request(app)
        .patch('/api/candidates/me')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          discoverability: true,
          hideContactInfo: true,
          phone: '+91 99999 11111',
          contactEmail: 'confidential@candidate.com'
        });

      const candId = candidateUser.id;
      // Recruiter or public viewing profile
      const res = await request(app)
        .get(`/api/profiles/${candId}`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .expect(200);

      expect(res.body.data.profile.phone).toBeUndefined();
      expect(res.body.data.profile.contactEmail).toBeUndefined();
    });

    it('26. should support legacy /api/profile/candidate PUT endpoint', async () => {
      const res = await request(app)
        .put('/api/profile/candidate')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          headline: 'Full Stack Ninja',
          location: 'Pune, Maharashtra'
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.profile.headline).toBe('Full Stack Ninja');
    });

    it('27. should support legacy /api/profile/recruiter PUT endpoint', async () => {
      const res = await request(app)
        .put('/api/profile/recruiter')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          jobTitle: 'VP of Global Talent'
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.profile.jobTitle).toBe('VP of Global Talent');
    });
  });
});
