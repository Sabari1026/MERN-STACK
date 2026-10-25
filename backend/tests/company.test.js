/**
 * Automated Company Management & Verification Test Suite for HireConnect (Phase 4)
 * Covers: Company Creation, Slug Collision, Discovery & Search, Profile Updates,
 * Protected Verification Workflows, Admin Queue, Logo Uploads, and Recruiter Memberships.
 */

const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const Company = require('../src/models/company.model');
const CompanyMembership = require('../src/models/companyMembership.model');
const CompanyInvitation = require('../src/models/companyInvitation.model');
const CompanyVerificationRequest = require('../src/models/companyVerification.model');
const CompanyAuditLog = require('../src/models/companyAudit.model');
const storageService = require('../src/services/storage.service');
const { generateAccessToken } = require('../src/utils/token');

// Binary fixtures for signature validation
const VALID_JPEG_BUFFER = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00]);
const VALID_PNG_BUFFER = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00]);
const FAKE_TEXT_BUFFER = Buffer.from('This is a malicious text payload pretending to be an image.');

describe('HireConnect Phase 4: Company Management & Verification System', () => {
  let recruiterUser = null;
  let recruiterToken = '';
  let candidateUser = null;
  let candidateToken = '';
  let adminUser = null;
  let adminToken = '';
  let otherRecruiterUser = null;
  let otherRecruiterToken = '';

  beforeEach(async () => {
    User.__clearMemoryStore();
    Company.__clearMemoryStore();
    CompanyMembership.__clearMemoryStore();
    CompanyInvitation.__clearMemoryStore();
    CompanyVerificationRequest.__clearMemoryStore();
    CompanyAuditLog.__clearMemoryStore();
    storageService.clearMockStorage();

    // 1. Recruiter user
    recruiterUser = await User.create({
      name: 'Rohan Recruiter',
      email: 'rohan@techcorp.in',
      passwordHash: 'hash',
      role: 'recruiter',
      accountStatus: 'active'
    });
    recruiterToken = generateAccessToken(recruiterUser);

    // 2. Candidate user
    candidateUser = await User.create({
      name: 'Aarav Candidate',
      email: 'aarav@candidate.in',
      passwordHash: 'hash',
      role: 'candidate',
      accountStatus: 'active'
    });
    candidateToken = generateAccessToken(candidateUser);

    // 3. Admin user
    adminUser = await User.create({
      name: 'Platform Admin',
      email: 'admin@hireconnect.io',
      passwordHash: 'hash',
      role: 'admin',
      accountStatus: 'active'
    });
    adminToken = generateAccessToken(adminUser);

    // 4. Secondary recruiter user
    otherRecruiterUser = await User.create({
      name: 'Pooja Recruiter',
      email: 'pooja@othercorp.in',
      passwordHash: 'hash',
      role: 'recruiter',
      accountStatus: 'active'
    });
    otherRecruiterToken = generateAccessToken(otherRecruiterUser);
  });

  // ==========================================================================
  // SECTION 1: COMPANY CREATION & INITIAL MEMBERSHIP
  // ==========================================================================
  describe('Company Creation (POST /api/companies)', () => {
    it('1. should allow an authenticated recruiter to register a new company and assign them as owner', async () => {
      const res = await request(app)
        .post('/api/companies')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          name: 'Acme Cloud Technologies',
          website: 'https://acmecloud.io',
          industry: 'SaaS',
          description: 'High-throughput enterprise cloud solutions.',
          companySize: '100-500 employees',
          locations: ['Bengaluru, Karnataka', 'Hyderabad, Telangana'],
          techStack: ['Node.js', 'React', 'Go', 'AWS'],
          benefits: ['Medical Insurance', 'Remote Work Allowances']
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.company.name).toBe('Acme Cloud Technologies');
      expect(res.body.data.company.slug).toBe('acme-cloud-technologies');
      expect(res.body.data.company.verificationStatus).toBe('pending');
      expect(res.body.data.company.verified).toBe(false);
      expect(res.body.data.membership.membershipRole).toBe('owner');
      expect(res.body.data.membership.status).toBe('active');
    });

    it('2. should reject unauthenticated requests with 401 Unauthorized', async () => {
      const res = await request(app)
        .post('/api/companies')
        .send({ name: 'Stealth Startup', website: 'https://stealth.dev' });

      expect(res.status).toBe(401);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });

    it('3. should reject candidates attempting to register a company with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/companies')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ name: 'Candidate Venture', website: 'https://candidate.dev' });

      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('4. should reject duplicate exact company names with 409 Conflict', async () => {
      await request(app)
        .post('/api/companies')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ name: 'Unified Tech Labs', website: 'https://unified.dev' });

      const duplicateRes = await request(app)
        .post('/api/companies')
        .set('Authorization', `Bearer ${otherRecruiterToken}`)
        .send({ name: 'Unified Tech Labs', website: 'https://other-unified.dev' });

      expect(duplicateRes.status).toBe(409);
      expect(duplicateRes.body.code).toBe('CONFLICT');
    });

    it('5. should safely generate distinct slugs on collision without overwriting records', async () => {
      const c1 = await Company.create({
        name: 'Nexus Technologies',
        slug: 'nexus-technologies',
        createdBy: recruiterUser.id
      });
      expect(c1.slug).toBe('nexus-technologies');

      const nextSlug = await Company.generateUniqueSlug('Nexus Technologies');
      expect(nextSlug).toBe('nexus-technologies-1');
    });
  });

  // ==========================================================================
  // SECTION 2: PUBLIC COMPANY DISCOVERY & DETAIL
  // ==========================================================================
  describe('Company Discovery (GET /api/companies & /api/companies/:slugOrId)', () => {
    beforeEach(async () => {
      await Company.create({
        name: 'Razorpay Payments',
        slug: 'razorpay-payments',
        industry: 'FinTech',
        locations: ['Bengaluru, Karnataka'],
        techStack: ['Go', 'Python', 'React'],
        verificationStatus: 'verified',
        verified: true,
        contactEmail: 'private-razorpay@corp.internal',
        createdBy: recruiterUser.id
      });

      await Company.create({
        name: 'Zepto Groceries',
        slug: 'zepto-groceries',
        industry: 'Quick Commerce',
        locations: ['Mumbai, Maharashtra'],
        techStack: ['Node.js', 'React Native'],
        verificationStatus: 'pending',
        verified: false,
        contactEmail: 'private-zepto@corp.internal',
        createdBy: otherRecruiterUser.id
      });
    });

    it('6. should list public companies with pagination metadata', async () => {
      const res = await request(app).get('/api/companies?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.total).toBe(2);
      expect(res.body.companies.length).toBe(2);
      expect(res.body.page).toBe(1);
    });

    it('7. should filter companies by search query matching tech stack or name', async () => {
      const res = await request(app).get('/api/companies?search=Python');

      expect(res.status).toBe(200);
      expect(res.body.companies.length).toBe(1);
      expect(res.body.companies[0].name).toBe('Razorpay Payments');
    });

    it('8. should filter companies by industry category', async () => {
      const res = await request(app).get('/api/companies?industry=Quick%20Commerce');

      expect(res.status).toBe(200);
      expect(res.body.companies.length).toBe(1);
      expect(res.body.companies[0].name).toBe('Zepto Groceries');
    });

    it('9. should filter companies by verified status', async () => {
      const res = await request(app).get('/api/companies?verified=true');

      expect(res.status).toBe(200);
      expect(res.body.companies.length).toBe(1);
      expect(res.body.companies[0].name).toBe('Razorpay Payments');
      expect(res.body.companies[0].verified).toBe(true);
    });

    it('10. should return company details by slug and redact private contactEmail', async () => {
      const res = await request(app).get('/api/companies/razorpay-payments');

      expect(res.status).toBe(200);
      expect(res.body.company.name).toBe('Razorpay Payments');
      expect(res.body.company.contactEmail).toBeUndefined();
      expect(res.body.company.verificationNotes).toBeUndefined();
    });

    it('11. should return 404 for non-existent company slug', async () => {
      const res = await request(app).get('/api/companies/non-existent-startup-slug');

      expect(res.status).toBe(404);
      expect(res.body.code).toBe('NOT_FOUND');
    });
  });

  // ==========================================================================
  // SECTION 3: COMPANY PROFILE EDITING & PERMISSION GUARDS
  // ==========================================================================
  describe('Company Profile Updates (PATCH /api/companies/:id)', () => {
    let testCompany = null;

    beforeEach(async () => {
      testCompany = await Company.create({
        name: 'InnoTech Labs',
        slug: 'innotech-labs',
        industry: 'Technology',
        verificationStatus: 'pending',
        verified: false,
        createdBy: recruiterUser.id
      });

      await CompanyMembership.create({
        company: testCompany.id,
        user: recruiterUser.id,
        membershipRole: 'owner',
        status: 'active'
      });
    });

    it('12. should allow an authorized company owner to update permitted profile fields', async () => {
      const res = await request(app)
        .patch(`/api/companies/${testCompany.id}`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          description: 'Updated innovative enterprise research laboratories.',
          website: 'https://innotech.io',
          techStack: ['Rust', 'Python', 'TypeScript', 'Kubernetes'],
          benefits: ['Comprehensive Health Cover', 'Annual Tech Stipend']
        });

      expect(res.status).toBe(200);
      expect(res.body.company.description).toBe('Updated innovative enterprise research laboratories.');
      expect(res.body.company.techStack).toContain('Rust');
    });

    it('13. should reject non-member recruiter attempting to edit another company with 403 Forbidden', async () => {
      const res = await request(app)
        .patch(`/api/companies/${testCompany.id}`)
        .set('Authorization', `Bearer ${otherRecruiterToken}`)
        .send({ description: 'Malicious modification attempt' });

      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('14. should strictly block tampering with protected verification fields via PATCH', async () => {
      const res = await request(app)
        .patch(`/api/companies/${testCompany.id}`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          verificationStatus: 'verified',
          verified: true
        });

      expect([400, 422]).toContain(res.status);
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });

    it('15. should reject invalid website URL format with 400 Validation Error', async () => {
      const res = await request(app)
        .patch(`/api/companies/${testCompany.id}`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ website: 'ftp://not-a-valid-http-website' });

      expect([400, 422]).toContain(res.status);
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });
  });

  // ==========================================================================
  // SECTION 4: COMPANY VERIFICATION WORKFLOW & ADMIN REVIEW
  // ==========================================================================
  describe('Company Verification Workflow', () => {
    let targetCompany = null;

    beforeEach(async () => {
      targetCompany = await Company.create({
        name: 'ScaleEdge Technologies',
        slug: 'scaleedge-technologies',
        verificationStatus: 'pending',
        verified: false,
        createdBy: recruiterUser.id
      });

      await CompanyMembership.create({
        company: targetCompany.id,
        user: recruiterUser.id,
        membershipRole: 'owner',
        status: 'active'
      });
    });

    it('16. should allow company owner to submit a verification request', async () => {
      const res = await request(app)
        .post(`/api/companies/${targetCompany.id}/verification-request`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          officialEmail: 'compliance@scaleedge.com',
          website: 'https://scaleedge.com',
          businessRegistrationNumber: 'CIN-U72200KA2021PTC123456'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.request.status).toBe('pending');

      const updatedCompany = await Company.findById(targetCompany.id);
      expect(updatedCompany.verificationStatus).toBe('under_review');
    });

    it('17. should reject duplicate verification request when one is already pending', async () => {
      await request(app)
        .post(`/api/companies/${targetCompany.id}/verification-request`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ officialEmail: 'compliance@scaleedge.com' });

      const dupRes = await request(app)
        .post(`/api/companies/${targetCompany.id}/verification-request`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ officialEmail: 'compliance2@scaleedge.com' });

      expect(dupRes.status).toBe(400);
      expect(dupRes.body.message).toMatch(/already pending review/i);
    });

    it('18. should reject recruiter attempting to access admin verification queue with 403', async () => {
      const res = await request(app)
        .get('/api/admin/company-verification-requests')
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('19. should allow administrator to review and approve verification request', async () => {
      const subRes = await request(app)
        .post(`/api/companies/${targetCompany.id}/verification-request`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ officialEmail: 'verify@scaleedge.com', businessRegistrationNumber: 'REG-999' });

      const requestId = subRes.body.data.request.id;

      const reviewRes = await request(app)
        .patch(`/api/admin/company-verification-requests/${requestId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'verified',
          reviewerNotes: 'Verified via official corporate domain email and MCA registry.',
          verificationMethod: 'business_registration'
        });

      expect(reviewRes.status).toBe(200);
      expect(reviewRes.body.data.company.verified).toBe(true);
      expect(reviewRes.body.data.company.verificationStatus).toBe('verified');

      const dbCompany = await Company.findById(targetCompany.id);
      expect(dbCompany.verificationStatus).toBe('verified');
      expect(dbCompany.verified).toBe(true);
      expect(dbCompany.verifiedBy.toString()).toBe(adminUser.id);
    });

    it('20. should reject invalid verification status transitions with 400 Bad Request', async () => {
      const subRes = await request(app)
        .post(`/api/companies/${targetCompany.id}/verification-request`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ officialEmail: 'verify@scaleedge.com' });

      const requestId = subRes.body.data.request.id;

      // Pending cannot directly jump to suspended
      const invalidRes = await request(app)
        .patch(`/api/admin/company-verification-requests/${requestId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'suspended' });

      expect(invalidRes.status).toBe(400);
    });
  });

  // ==========================================================================
  // SECTION 5: LOGO UPLOAD & BRANDING ASSETS
  // ==========================================================================
  describe('Company Logo Management', () => {
    let company = null;

    beforeEach(async () => {
      company = await Company.create({
        name: 'Pixel Perfect Studios',
        slug: 'pixel-perfect-studios',
        createdBy: recruiterUser.id
      });

      await CompanyMembership.create({
        company: company.id,
        user: recruiterUser.id,
        membershipRole: 'owner',
        status: 'active'
      });
    });

    it('21. should allow company owner to upload a valid JPEG logo', async () => {
      const res = await request(app)
        .post(`/api/companies/${company.id}/logo`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .attach('avatar', VALID_JPEG_BUFFER, 'logo.jpg');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.logoUrl).toMatch(/\/api\/users\/avatar\/[a-f0-9-]+/);

      const updated = await Company.findById(company.id);
      expect(updated.logoStorageKey).toBeTruthy();
    });

    it('22. should reject upload with invalid magic bytes (spoofed file) with 400 Validation Error', async () => {
      const res = await request(app)
        .post(`/api/companies/${company.id}/logo`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .attach('avatar', FAKE_TEXT_BUFFER, 'fake_logo.png');

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });

    it('23. should allow company owner to delete an existing logo', async () => {
      await request(app)
        .post(`/api/companies/${company.id}/logo`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .attach('avatar', VALID_PNG_BUFFER, 'logo.png');

      const delRes = await request(app)
        .delete(`/api/companies/${company.id}/logo`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(delRes.status).toBe(200);

      const updated = await Company.findById(company.id);
      expect(updated.logoStorageKey).toBeNull();
      expect(updated.logoUrl).toBe('');
    });
  });

  // ==========================================================================
  // SECTION 6: MEMBERSHIP, INVITATIONS & OWNERSHIP RULES
  // ==========================================================================
  describe('Company Membership & Recruiter Onboarding', () => {
    let company = null;

    beforeEach(async () => {
      company = await Company.create({
        name: 'Collaborative Dynamics',
        slug: 'collaborative-dynamics',
        createdBy: recruiterUser.id
      });

      await CompanyMembership.create({
        company: company.id,
        user: recruiterUser.id,
        membershipRole: 'owner',
        status: 'active'
      });
    });

    it('24. should allow company owner to invite a recruiter to join their company', async () => {
      const res = await request(app)
        .post(`/api/companies/${company.id}/invitations`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ email: 'pooja@othercorp.in', role: 'recruiter' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.invitationToken).toBeTruthy();
      expect(res.body.data.invitation.status).toBe('pending');
    });

    it('25. should allow invitee to accept invitation and receive active company membership', async () => {
      const invRes = await request(app)
        .post(`/api/companies/${company.id}/invitations`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ email: 'pooja@othercorp.in', role: 'recruiter' });

      const rawToken = invRes.body.data.invitationToken;

      const acceptRes = await request(app)
        .post('/api/companies/invitations/accept')
        .set('Authorization', `Bearer ${otherRecruiterToken}`)
        .send({ token: rawToken });

      expect(acceptRes.status).toBe(200);
      expect(acceptRes.body.data.membership.membershipRole).toBe('recruiter');
      expect(acceptRes.body.data.membership.status).toBe('active');

      // Verify members list now has 2 members
      const membersRes = await request(app)
        .get(`/api/companies/${company.id}/members`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(membersRes.status).toBe(200);
      expect(membersRes.body.data.members.length).toBe(2);
    });

    it('26. should prevent removing the last owner of an organization', async () => {
      const res = await request(app)
        .delete(`/api/companies/${company.id}/members/${recruiterUser.id}`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/sole owner/i);
    });

    it('27. should verify audit log recording for sensitive company operations', async () => {
      await request(app)
        .patch(`/api/companies/${company.id}`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ description: 'Audited update description' });

      const logs = await CompanyAuditLog.find({ company: company.id, eventType: 'COMPANY_UPDATED' });
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].actorEmail).toBe(recruiterUser.email);
    });
  });
});
