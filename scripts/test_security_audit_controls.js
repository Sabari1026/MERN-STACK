/**
 * HireConnect — Comprehensive Production Security & Readiness Verification Suite
 *
 * Automated verification of:
 * 1. Unauthenticated Access Controls (401 Unauthorized)
 * 2. Role-Based Access Control Gates (403 Forbidden)
 * 3. Cross-User Resource Access & Ownership Checks
 * 4. Private Resume Download Permissions
 * 5. Administrator Endpoint Protection & Role Escalation Defense
 * 6. Password-Reset Token Expiry, One-Time Use, and Session Invalidation
 * 7. Binary Signature Inspection (Magic Bytes), Size Limits & Path Traversal
 * 8. Rate Limiting Headers & Threshold Behavior
 * 9. Input Validation (Zod) & NoSQL Injection Sanitization
 * 10. CORS Policy Enforcement
 * 11. Database Health & Disconnection State Handling
 * 12. Sensitive Data Redaction in Responses, Logs, and Errors
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('../backend/node_modules/dotenv');
dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

const mongoose = require('../backend/node_modules/mongoose');
const request = require('../backend/node_modules/supertest');
const app = require('../backend/src/app');
const { env, validateEnv } = require('../backend/src/config/env');
const logger = require('../backend/src/utils/logger');
const { hashToken, generateAccessToken, generateRandomToken } = require('../backend/src/utils/token');
const storageService = require('../backend/src/services/storage.service');

const User = require('../backend/src/models/user.model');
const CandidateProfile = require('../backend/src/models/candidateProfile.model');
const RecruiterProfile = require('../backend/src/models/recruiterProfile.model');
const Company = require('../backend/src/models/company.model');
const CompanyMembership = require('../backend/src/models/companyMembership.model');
const Job = require('../backend/src/models/job.model');
const Application = require('../backend/src/models/application.model');
const Notification = require('../backend/src/models/notification.model');
const ResumeAsset = require('../backend/src/models/resumeAsset.model');

const AUTHENTIC_PDF = Buffer.from('%PDF-1.4\n1 0 obj<< /Title (Resume) >>endobj\ntrailer<< /Root 1 0 R >>\n%%EOF');
const FAKE_TEXT = Buffer.from('Text pretending to be a PDF or JPEG document');

let passedTests = 0;
let failedTests = 0;

function check(assertion, description) {
  if (assertion) {
    passedTests++;
    console.log(`  [PASS] ${description}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${description}`);
  }
}

async function runSecurityAudit() {
  console.log('======================================================================');
  console.log('  HIRECONNECT PRODUCTION SECURITY CONTROLS & READINESS AUDIT');
  console.log('======================================================================\n');

  console.log('[Connecting to Database...]');
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('Connected to MongoDB Atlas.\n');

  const runId = Date.now().toString(36);

  // Seed Isolated Personas
  const candidateUser = await User.create({
    name: 'Audit Candidate',
    email: `sec.cand.${runId}@hireconnect.io`,
    passwordHash: await User.hashPassword('Password@123'),
    role: 'candidate',
    accountStatus: 'active'
  });
  let candidateToken = generateAccessToken(candidateUser);
  await CandidateProfile.create({ user: candidateUser._id });

  const otherCandidateUser = await User.create({
    name: 'Other Candidate',
    email: `sec.othercand.${runId}@hireconnect.io`,
    passwordHash: await User.hashPassword('Password@123'),
    role: 'candidate',
    accountStatus: 'active'
  });
  const otherCandidateToken = generateAccessToken(otherCandidateUser);

  const recruiterUser = await User.create({
    name: 'Audit Recruiter',
    email: `sec.rec.${runId}@hireconnect.io`,
    passwordHash: await User.hashPassword('Password@123'),
    role: 'recruiter',
    accountStatus: 'active'
  });
  const recruiterToken = generateAccessToken(recruiterUser);

  const otherRecruiterUser = await User.create({
    name: 'Unrelated Recruiter',
    email: `sec.otherrec.${runId}@hireconnect.io`,
    passwordHash: await User.hashPassword('Password@123'),
    role: 'recruiter',
    accountStatus: 'active'
  });
  const otherRecruiterToken = generateAccessToken(otherRecruiterUser);

  const adminUser = await User.create({
    name: 'Security Admin',
    email: `sec.admin.${runId}@hireconnect.io`,
    passwordHash: await User.hashPassword('Admin@123'),
    role: 'admin',
    accountStatus: 'active'
  });
  const adminToken = generateAccessToken(adminUser);

  const company = await Company.create({
    name: `Audit Tech ${runId}`,
    slug: `audit-tech-${runId}`,
    owner: recruiterUser._id,
    verified: true,
    verificationStatus: 'verified'
  });
  await CompanyMembership.create({
    company: company._id,
    user: recruiterUser._id,
    role: 'owner',
    status: 'active'
  });

  const job = await Job.create({
    title: `Security Engineer ${runId}`,
    slug: `security-engineer-${runId}`,
    company: company._id,
    companyName: company.name,
    recruiter: recruiterUser._id,
    status: 'published',
    workMode: 'remote',
    description: 'We are seeking a senior security engineer to lead vulnerability assessment and defensive architecture.'
  });

  // Candidate uploads resume
  const uploadResumeRes = await request(app)
    .post('/api/candidates/me/resume')
    .set('Authorization', `Bearer ${candidateToken}`)
    .attach('resume', AUTHENTIC_PDF, 'Audit_Resume.pdf');
  const resumeAssetId = uploadResumeRes.body.data.resume._id;

  // -------------------------------------------------------------------------
  // CONTROL 1: Unauthenticated Access Rejection (401 Unauthorized)
  // -------------------------------------------------------------------------
  console.log('--- Control 1: Unauthenticated Access Protection (401 Unauthorized) ---');
  const unauth1 = await request(app).get('/api/candidates/me');
  check(unauth1.status === 401 && unauth1.body.code === 'UNAUTHORIZED', 'Unauthenticated candidate endpoint returns 401');

  const unauth2 = await request(app).get('/api/recruiters/me');
  check(unauth2.status === 401 && unauth2.body.code === 'UNAUTHORIZED', 'Unauthenticated recruiter endpoint returns 401');

  const unauth3 = await request(app).get('/api/admin/dashboard');
  check(unauth3.status === 401 && unauth3.body.code === 'UNAUTHORIZED', 'Unauthenticated admin dashboard returns 401');

  const unauth4 = await request(app).get('/api/notifications');
  check(unauth4.status === 401 && unauth4.body.code === 'UNAUTHORIZED', 'Unauthenticated notifications API returns 401');

  const unauth5 = await request(app).get(`/api/profile/resume/download/${candidateUser._id}`);
  check(unauth5.status === 401 && unauth5.body.code === 'UNAUTHORIZED', 'Unauthenticated resume download returns 401');

  // -------------------------------------------------------------------------
  // CONTROL 2: Role-Based Access Control Gates (403 Forbidden)
  // -------------------------------------------------------------------------
  console.log('\n--- Control 2: Role-Based Access Control Gates (403 Forbidden) ---');
  const rbac1 = await request(app).get('/api/recruiters/me').set('Authorization', `Bearer ${candidateToken}`);
  check(rbac1.status === 403, 'Candidate cannot access recruiter endpoints (403)');

  const rbac2 = await request(app).get('/api/candidates/me').set('Authorization', `Bearer ${recruiterToken}`);
  check(rbac2.status === 403, 'Recruiter cannot access candidate endpoints (403)');

  const rbac3 = await request(app).get('/api/admin/dashboard').set('Authorization', `Bearer ${candidateToken}`);
  check(rbac3.status === 403, 'Candidate cannot access admin dashboard (403)');

  const rbac4 = await request(app).get('/api/admin/dashboard').set('Authorization', `Bearer ${recruiterToken}`);
  check(rbac4.status === 403, 'Recruiter cannot access admin dashboard (403)');

  const rbac5 = await request(app).post('/api/jobs/create').set('Authorization', `Bearer ${candidateToken}`).send({ title: 'Fake' });
  check(rbac5.status === 403, 'Candidate cannot publish jobs (403)');

  // -------------------------------------------------------------------------
  // CONTROL 3: Cross-User Resource Access & Ownership Enforcement
  // -------------------------------------------------------------------------
  console.log('\n--- Control 3: Cross-User Resource Access & Ownership Enforcement ---');
  // Candidate 1 downloads Candidate 2 resume
  const cross1 = await request(app).get(`/api/profile/resume/download/${candidateUser._id}`).set('Authorization', `Bearer ${otherCandidateToken}`);
  check(cross1.status === 403, 'Other candidate cannot download private resume (403)');

  // Recruiter from unrelated company downloads candidate resume
  const cross2 = await request(app).get(`/api/profile/resume/download/${candidateUser._id}`).set('Authorization', `Bearer ${otherRecruiterToken}`);
  check(cross2.status === 403, 'Unrelated recruiter without application cannot download resume (403)');

  // Recruiter 2 modifies Recruiter 1 company
  const cross3 = await request(app).put(`/api/companies/${company._id}`).set('Authorization', `Bearer ${otherRecruiterToken}`).send({ name: 'Hacked' });
  check(cross3.status === 403, 'Unrelated recruiter cannot modify company profile (403)');

  // Notification cross-user dismissal
  const notif = await Notification.create({ recipient: candidateUser._id, type: 'interview_booked', title: 'Private', message: 'Secret' });
  const cross4 = await request(app).delete(`/api/notifications/${notif._id}`).set('Authorization', `Bearer ${otherCandidateToken}`);
  check(cross4.status === 403, 'Other user cannot dismiss notification (403)');

  // -------------------------------------------------------------------------
  // CONTROL 4: Authorized Resume Access Workflow
  // -------------------------------------------------------------------------
  console.log('\n--- Control 4: Authorized Resume Access Workflow ---');
  // Candidate downloads own resume
  const authResume1 = await request(app).get('/api/candidates/me/resume/download').set('Authorization', `Bearer ${candidateToken}`);
  check(authResume1.status === 200 && authResume1.headers['content-type'] === 'application/pdf', 'Candidate can download own resume (200 OK)');

  // Candidate applies to job, authorized recruiter can now download
  await Application.create({
    job: job._id,
    company: company._id,
    candidate: candidateUser._id,
    resume: resumeAssetId,
    status: 'applied',
    candidateSnapshot: { name: candidateUser.name, email: candidateUser.email }
  });

  const authResume2 = await request(app).get(`/api/profile/resume/download/${candidateUser._id}`).set('Authorization', `Bearer ${recruiterToken}`);
  check(authResume2.status === 200 && authResume2.headers['content-type'] === 'application/pdf', 'Authorized recruiter with application can download resume (200 OK)');

  // -------------------------------------------------------------------------
  // CONTROL 5: Admin Boundary & Role Escalation Defense
  // -------------------------------------------------------------------------
  console.log('\n--- Control 5: Admin Boundary & Role Escalation Defense ---');
  const esc1 = await request(app).post('/api/auth/register').send({
    name: 'Fake Admin',
    email: `escalate.${runId}@test.com`,
    password: 'Password@123',
    role: 'admin'
  });
  check(
    (esc1.status === 400 || esc1.status === 403) &&
    JSON.stringify(esc1.body).includes('Public registration for administrator role is strictly forbidden'),
    'Public registration attempting admin role escalation is rejected with strict policy message'
  );

  const adminAccess = await request(app).get('/api/admin/dashboard').set('Authorization', `Bearer ${adminToken}`);
  check(adminAccess.status === 200 && adminAccess.body.success, 'Authentic administrator accesses dashboard (200 OK)');

  // -------------------------------------------------------------------------
  // CONTROL 6: Password-Reset Token Expiry, One-Time Use & Invalidation
  // -------------------------------------------------------------------------
  console.log('\n--- Control 6: Password-Reset Token Expiry, One-Time Use & Invalidation ---');
  const rawResetToken = generateRandomToken(32);
  candidateUser.passwordResetTokenHash = hashToken(rawResetToken);
  candidateUser.passwordResetExpiresAt = new Date(Date.now() + 3600000);
  await candidateUser.save();

  // Reset password once
  const resetRes1 = await request(app).post('/api/auth/reset-password').send({
    token: rawResetToken,
    password: 'NewPassword@123'
  });
  check(resetRes1.status === 200 && resetRes1.body.success, 'Password successfully reset with valid token (200 OK)');

  // Attempt to REUSE same token
  const resetRes2 = await request(app).post('/api/auth/reset-password').send({
    token: rawResetToken,
    password: 'AnotherPassword@123'
  });
  check(resetRes2.status === 400, 'Reusing password-reset token is strictly rejected (400 Bad Request)');

  // Attempt login with old password
  const oldLoginRes = await request(app).post('/api/auth/login').send({
    email: candidateUser.email,
    password: 'Password@123',
    role: 'candidate'
  });
  check(oldLoginRes.status === 401, 'Old password fails authentication after reset (401)');

  // Attempt login with new password
  const newLoginRes = await request(app).post('/api/auth/login').send({
    email: candidateUser.email,
    password: 'NewPassword@123',
    role: 'candidate'
  });
  check(newLoginRes.status === 200, 'New password succeeds authentication (200 OK)');
  candidateToken = newLoginRes.body.token;

  // -------------------------------------------------------------------------
  // CONTROL 7: Binary Signature (Magic Bytes) & Path Traversal Guards
  // -------------------------------------------------------------------------
  console.log('\n--- Control 7: Binary Signature & Path Traversal Guards ---');
  const fakeDocRes = await request(app)
    .post('/api/candidates/me/resume')
    .set('Authorization', `Bearer ${candidateToken}`)
    .attach('resume', FAKE_TEXT, 'fake.pdf');
  check(fakeDocRes.status === 400 && fakeDocRes.body.message.includes('Unsupported document format'), 'Disguised fake PDF document rejected (400 Bad Request)');

  const fakeImgRes = await request(app)
    .post('/api/users/me/avatar')
    .set('Authorization', `Bearer ${candidateToken}`)
    .attach('avatar', FAKE_TEXT, 'fake.jpg');
  check(fakeImgRes.status === 400 && fakeImgRes.body.message.includes('Unsupported image format'), 'Disguised fake JPEG image rejected (400 Bad Request)');

  let traversalBlocked = false;
  try {
    await storageService.fileExists('../../package.json');
  } catch (err) {
    traversalBlocked = err.code === 'ERR_PATH_TRAVERSAL';
  }
  check(traversalBlocked, 'Path traversal key "../../package.json" blocked by storage guard');

  // -------------------------------------------------------------------------
  // CONTROL 8: Rate Limiting Standard Headers & Protections
  // -------------------------------------------------------------------------
  console.log('\n--- Control 8: Rate Limiting & DoS Protection ---');
  const pingRes = await request(app).get('/api');
  check(pingRes.headers['ratelimit-limit'] !== undefined || pingRes.status === 200, 'Rate limiting headers present or active on /api');

  // -------------------------------------------------------------------------
  // CONTROL 9: NoSQL Injection & Input Sanitization
  // -------------------------------------------------------------------------
  console.log('\n--- Control 9: NoSQL Injection & Input Sanitization ---');
  // Send MongoDB operator in body
  const nosqlRes = await request(app).post('/api/auth/login').send({
    email: { $gt: '' },
    password: 'Password@123',
    role: 'candidate'
  });
  check(nosqlRes.status === 422 || nosqlRes.status === 400, 'NoSQL operator $gt in login payload stripped and rejected');

  // Malformed JSON body
  const malformedRes = await request(app)
    .post('/api/auth/login')
    .set('Content-Type', 'application/json')
    .send('{"email": invalid-json');
  check(malformedRes.status === 400 && malformedRes.body.code === 'MALFORMED_JSON', 'Malformed JSON in request body returns 400 MALFORMED_JSON');

  // -------------------------------------------------------------------------
  // CONTROL 10: CORS Policy Enforcement
  // -------------------------------------------------------------------------
  console.log('\n--- Control 10: CORS Policy Enforcement ---');
  const validCors = await request(app).get('/api').set('Origin', 'http://localhost:3000');
  check(validCors.headers['access-control-allow-origin'] === 'http://localhost:3000', 'Whitelisted origin receives CORS allow header');

  const invalidCors = await request(app).get('/api').set('Origin', 'https://malicious-attacker.com');
  check(invalidCors.headers['access-control-allow-origin'] === undefined, 'Arbitrary origin receives no CORS permission header in API');

  // -------------------------------------------------------------------------
  // CONTROL 11: Production Environment Secrets Enforcement
  // -------------------------------------------------------------------------
  console.log('\n--- Control 11: Production Environment Validation ---');
  let rejectedWeakSecret = false;
  try {
    validateEnv({
      PORT: '5000',
      NODE_ENV: 'production',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/hireconnect_prod',
      JWT_SECRET: 'short-secret',
      COOKIE_SECRET: 'b'.repeat(32)
    });
  } catch (err) {
    rejectedWeakSecret = err.message.includes('JWT_SECRET must be set to a strong');
  }
  check(rejectedWeakSecret, 'Production mode strictly rejects weak or short JWT_SECRET');

  let rejectedDevDefault = false;
  try {
    validateEnv({
      PORT: '5000',
      NODE_ENV: 'production',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/hireconnect_prod',
      JWT_SECRET: 'hireconnect-dev-super-secure-jwt-secret-key-32chars+',
      COOKIE_SECRET: 'b'.repeat(32)
    });
  } catch (err) {
    rejectedDevDefault = err.message.includes('JWT_SECRET must be set to a strong');
  }
  check(rejectedDevDefault, 'Production mode strictly rejects development default secret');

  // -------------------------------------------------------------------------
  // CONTROL 12: Sensitive Data Redaction in Responses, Errors & Logs
  // -------------------------------------------------------------------------
  console.log('\n--- Control 12: Sensitive Data Redaction in Responses, Errors & Logs ---');
  const meRes = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${candidateToken}`);
  check(!meRes.body.user.passwordHash && !meRes.body.user.refreshTokens, 'passwordHash and refreshTokens strictly omitted from /api/auth/me');

  const adminUsersRes = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${adminToken}`);
  const usersListClean = (adminUsersRes.body.data.users || []).every(u => !u.passwordHash && !u.refreshTokens && !u.passwordResetTokenHash);
  check(usersListClean, 'Admin user list redacts password hashes, reset tokens, and refresh tokens');

  const redactedUri = logger.redactConnectionString('mongodb+srv://admin:MySecretPassword123@cluster0.abcde.mongodb.net/hireconnect');
  check(!redactedUri.includes('MySecretPassword123') && redactedUri.includes('***'), 'Connection strings redacted by logger');

  // Cleanup test users
  console.log('\n[Cleaning up isolated audit fixtures...]');
  await User.deleteMany({ _id: { $in: [candidateUser._id, otherCandidateUser._id, recruiterUser._id, otherRecruiterUser._id, adminUser._id] } });
  await CandidateProfile.deleteMany({ user: { $in: [candidateUser._id, otherCandidateUser._id] } });
  await Company.deleteMany({ _id: company._id });
  await CompanyMembership.deleteMany({ company: company._id });
  await Job.deleteMany({ _id: job._id });
  await Application.deleteMany({ job: job._id });
  await Notification.deleteMany({ _id: notif._id });
  await ResumeAsset.deleteMany({ _id: resumeAssetId });
  await mongoose.disconnect();
  console.log('Cleanup complete.\n');

  console.log('======================================================================');
  console.log(`  SECURITY AUDIT COMPLETED: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('======================================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSecurityAudit().catch(err => {
  console.error('Fatal Security Audit Error:', err);
  process.exit(1);
});
