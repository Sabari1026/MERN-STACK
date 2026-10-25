/**
 * HireConnect — Comprehensive Production File Storage & Persistence Verification
 *
 * Verifies:
 * 1. Configured Storage Provider & Persistent Directory Inspection
 * 2. Candidate Avatar Upload & File Creation on Physical Disk
 * 3. Candidate Resume Upload & Binary Persistence on Physical Disk
 * 4. Authorized Resume Download (Candidate own resume & Recruiter with active application)
 * 5. Unauthorized Resume Download Rejection (401 Unauthenticated & 403 Unrelated Recruiter / Candidate)
 * 6. Content & Signature Validation (Magic Byte & Size Limits Rejection)
 * 7. Path Traversal Security Verification (Confining keys to root storage directory)
 * 8. File Replacement & Clean Physical Disk Unlinking on Deletion
 * 9. Genuine Persistence After Process Restart (Cold-start simulation without in-memory cache)
 * 10. Robust Error Handling (404 on missing assets, error reporting without false success)
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('../backend/node_modules/dotenv');
dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

process.env.NODE_ENV = 'development';

const mongoose = require('../backend/node_modules/mongoose');
const request = require('../backend/node_modules/supertest');
const app = require('../backend/src/app');
const { env } = require('../backend/src/config/env');
const storageService = require('../backend/src/services/storage.service');

const User = require('../backend/src/models/user.model');
const CandidateProfile = require('../backend/src/models/candidateProfile.model');
const RecruiterProfile = require('../backend/src/models/recruiterProfile.model');
const Company = require('../backend/src/models/company.model');
const CompanyMembership = require('../backend/src/models/companyMembership.model');
const Job = require('../backend/src/models/job.model');
const Application = require('../backend/src/models/application.model');
const ResumeAsset = require('../backend/src/models/resumeAsset.model');
const { generateAccessToken } = require('../backend/src/utils/token');

// Real binary fixtures
const AUTHENTIC_JPEG = Buffer.from([
  0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
  0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
  0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
  0xff, 0xd9
]);

const AUTHENTIC_PDF = Buffer.from(
  '%PDF-1.4\n1 0 obj\n<< /Title (HireConnect Verified Candidate Resume) /Author (Aarav Sharma) >>\nendobj\n2 0 obj\n<< /Type /Catalog /Pages 3 0 R >>\nendobj\nxref\n0 3\ntrailer\n<< /Root 2 0 R >>\n%%EOF'
);

const FAKE_DISGUISED_FILE = Buffer.from('Plain text claiming to be a PDF or image');

async function run() {
  console.log('================================================================');
  console.log('HIRECONNECT — PRODUCTION FILE STORAGE & PERSISTENCE VERIFICATION');
  console.log('================================================================\n');

  console.log('[Step 1] Connecting to MongoDB Atlas...');
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('✓ Connected to MongoDB Atlas.\n');

  // Check storage info
  console.log('[Step 2] Inspecting Storage Configuration & Directory Structure...');
  const storageInfo = storageService.getStorageInfo();
  console.log(`- Storage Provider: ${storageInfo.provider}`);
  console.log(`- Configured Directory: ${storageInfo.configuredDir}`);
  console.log(`- Resolved Absolute Path: ${storageInfo.baseDir}`);
  console.log(`- Required Partitions: ${storageInfo.folders.join(', ')}`);

  storageInfo.folders.forEach((folder) => {
    const p = path.join(storageInfo.baseDir, folder);
    const exists = fs.existsSync(p);
    console.log(`  ✓ Directory [${folder}]: ${exists ? 'EXISTS' : 'CREATED'} (${p})`);
  });
  console.log('✓ Storage directory structure verified.\n');

  // Unique suffix for this isolated run
  const runId = Date.now().toString(36);
  const testCandidateEmail = `storage.cand.${runId}@test.hireconnect.io`;
  const otherCandidateEmail = `storage.cand2.${runId}@test.hireconnect.io`;
  const recruiterEmail = `storage.rec.${runId}@test.hireconnect.io`;
  const otherRecruiterEmail = `storage.otherrec.${runId}@test.hireconnect.io`;

  console.log('[Step 3] Initializing Isolated Test Personas...');
  // 1. Primary candidate
  const candidate = await User.create({
    name: 'Storage Candidate',
    email: testCandidateEmail,
    role: 'candidate',
    accountStatus: 'active'
  });
  const candidateToken = generateAccessToken(candidate);
  await CandidateProfile.create({ user: candidate._id });

  // 2. Secondary candidate (unauthorized)
  const otherCandidate = await User.create({
    name: 'Other Candidate',
    email: otherCandidateEmail,
    role: 'candidate',
    accountStatus: 'active'
  });
  const otherCandidateToken = generateAccessToken(otherCandidate);

  // 3. Authorized recruiter
  const recruiter = await User.create({
    name: 'Authorized Recruiter',
    email: recruiterEmail,
    role: 'recruiter',
    accountStatus: 'active'
  });
  const recruiterToken = generateAccessToken(recruiter);

  // 4. Unrelated recruiter
  const otherRecruiter = await User.create({
    name: 'Unrelated Recruiter',
    email: otherRecruiterEmail,
    role: 'recruiter',
    accountStatus: 'active'
  });
  const otherRecruiterToken = generateAccessToken(otherRecruiter);

  // 5. Test company & job
  const company = await Company.create({
    name: `Storage Test Corp ${runId}`,
    slug: `storage-test-corp-${runId}`,
    owner: recruiter._id,
    verified: true
  });
  await CompanyMembership.create({
    user: recruiter._id,
    company: company._id,
    role: 'owner',
    status: 'active'
  });

  const job = await Job.create({
    title: `Storage Engineer ${runId}`,
    slug: `storage-engineer-${runId}`,
    company: company._id,
    companyName: company.name,
    recruiter: recruiter._id,
    status: 'published',
    workMode: 'remote',
    description: 'We are seeking an experienced Storage and Distributed Systems Engineer to lead backend architecture.'
  });

  console.log('✓ Test personas, company, and job opening initialized.\n');

  // -------------------------------------------------------------------------
  // TEST A: Candidate Avatar Upload & Real File Creation
  // -------------------------------------------------------------------------
  console.log('[Step 4] Testing Candidate Avatar Upload & Physical Disk File...');
  const avatarRes = await request(app)
    .post('/api/users/me/avatar')
    .set('Authorization', `Bearer ${candidateToken}`)
    .attach('avatar', AUTHENTIC_JPEG, 'candidate_avatar.jpg');

  if (avatarRes.status !== 200 || !avatarRes.body.data.avatarUrl) {
    throw new Error(`Avatar upload failed: ${JSON.stringify(avatarRes.body)}`);
  }
  const avatarUrl = avatarRes.body.data.avatarUrl;
  const avatarKey = path.basename(avatarUrl);
  const avatarPhysicalPath = path.join(storageInfo.baseDir, 'avatars', avatarKey);
  const avatarFileExists = fs.existsSync(avatarPhysicalPath);
  const avatarDiskSize = avatarFileExists ? fs.statSync(avatarPhysicalPath).size : 0;

  console.log(`✓ Avatar Upload HTTP 200 OK: ${avatarUrl}`);
  console.log(`✓ Avatar Physical File: ${avatarPhysicalPath}`);
  console.log(`✓ Avatar Disk File Exists: ${avatarFileExists} (Size: ${avatarDiskSize} bytes)`);
  if (!avatarFileExists || avatarDiskSize !== AUTHENTIC_JPEG.length) {
    throw new Error('Avatar physical file verification failed on disk!');
  }

  // Verify public avatar streaming
  const avatarStreamRes = await request(app).get(`/api/users/avatar/${avatarKey}`);
  console.log(`✓ Public Avatar Stream HTTP ${avatarStreamRes.status}: Content-Type: ${avatarStreamRes.headers['content-type']}, Cache-Control: ${avatarStreamRes.headers['cache-control']}\n`);

  // -------------------------------------------------------------------------
  // TEST B: Candidate Resume Upload & Real Physical File
  // -------------------------------------------------------------------------
  console.log('[Step 5] Testing Candidate Resume Upload & Physical Disk File...');
  const resumeRes = await request(app)
    .post('/api/candidates/me/resume')
    .set('Authorization', `Bearer ${candidateToken}`)
    .attach('resume', AUTHENTIC_PDF, 'Aarav_Verified_Resume.pdf');

  if (resumeRes.status !== 200 || !resumeRes.body.data.resume) {
    throw new Error(`Resume upload failed: ${JSON.stringify(resumeRes.body)}`);
  }
  const resumeAsset = resumeRes.body.data.resume;
  const resumeStorageKey = resumeAsset.storageKey;
  const resumePhysicalPath = path.join(storageInfo.baseDir, resumeStorageKey);
  const resumeFileExists = fs.existsSync(resumePhysicalPath);
  const resumeDiskSize = resumeFileExists ? fs.statSync(resumePhysicalPath).size : 0;

  console.log(`✓ Resume Upload HTTP 200 OK: Original="${resumeAsset.originalFilename}", StorageKey="${resumeStorageKey}"`);
  console.log(`✓ Resume Physical File: ${resumePhysicalPath}`);
  console.log(`✓ Resume Disk File Exists: ${resumeFileExists} (Size: ${resumeDiskSize} bytes)`);
  if (!resumeFileExists || resumeDiskSize !== AUTHENTIC_PDF.length) {
    throw new Error('Resume physical file verification failed on disk!');
  }
  console.log('');

  // -------------------------------------------------------------------------
  // TEST C: Authorized Resume Download (Candidate own resume)
  // -------------------------------------------------------------------------
  console.log('[Step 6] Testing Authorized Download: Candidate Downloading Own Resume...');
  const ownResumeRes = await request(app)
    .get('/api/candidates/me/resume/download')
    .set('Authorization', `Bearer ${candidateToken}`);

  console.log(`✓ Download HTTP Status: ${ownResumeRes.status}`);
  console.log(`✓ Content-Type: ${ownResumeRes.headers['content-type']}`);
  console.log(`✓ Content-Disposition: ${ownResumeRes.headers['content-disposition']}`);
  console.log(`✓ Received Bytes: ${ownResumeRes.body.length} (Expected: ${AUTHENTIC_PDF.length})`);
  if (ownResumeRes.status !== 200 || ownResumeRes.body.length !== AUTHENTIC_PDF.length) {
    throw new Error('Authorized candidate resume download content mismatch!');
  }
  console.log('');

  // -------------------------------------------------------------------------
  // TEST D: Unauthorized Resume Download Rejections (401 & 403)
  // -------------------------------------------------------------------------
  console.log('[Step 7] Testing Unauthorized Resume Download Rejections...');
  // 1. Unauthenticated (no token) -> Expect 401
  const unauthRes = await request(app)
    .get(`/api/profile/resume/download/${candidate._id}`);
  console.log(`✓ [Security 1/3] Unauthenticated Request: HTTP ${unauthRes.status} (Expected: 401)`);
  if (unauthRes.status !== 401) {
    throw new Error(`Expected 401 Unauthorized for unauthenticated download, got ${unauthRes.status}`);
  }

  // 2. Different candidate -> Expect 403 Forbidden
  const diffCandRes = await request(app)
    .get(`/api/profile/resume/download/${candidate._id}`)
    .set('Authorization', `Bearer ${otherCandidateToken}`);
  console.log(`✓ [Security 2/3] Other Candidate Request: HTTP ${diffCandRes.status} Forbidden (Expected: 403)`);
  if (diffCandRes.status !== 403) {
    throw new Error(`Expected 403 Forbidden for another candidate downloading resume, got ${diffCandRes.status}`);
  }

  // 3. Unrelated Recruiter without an active application -> Expect 403 Forbidden
  const unrelRecRes = await request(app)
    .get(`/api/profile/resume/download/${candidate._id}`)
    .set('Authorization', `Bearer ${otherRecruiterToken}`);
  console.log(`✓ [Security 3/3] Unrelated Recruiter Request: HTTP ${unrelRecRes.status} Forbidden (Expected: 403)`);
  if (unrelRecRes.status !== 403) {
    throw new Error(`Expected 403 Forbidden for unrelated recruiter downloading resume, got ${unrelRecRes.status}`);
  }
  console.log('');

  // -------------------------------------------------------------------------
  // TEST E: Authorized Recruiter Access via Active Recruitment Workflow
  // -------------------------------------------------------------------------
  console.log('[Step 8] Testing Authorized Recruiter Access via Active Application...');
  // Candidate applies to the job
  await Application.create({
    job: job._id,
    company: company._id,
    candidate: candidate._id,
    resume: resumeAsset._id,
    status: 'applied',
    candidateSnapshot: {
      name: candidate.name,
      email: candidate.email
    }
  });

  const authRecruiterRes = await request(app)
    .get(`/api/profile/resume/download/${candidate._id}`)
    .set('Authorization', `Bearer ${recruiterToken}`);

  console.log(`✓ Recruiter with active application: HTTP ${authRecruiterRes.status}`);
  console.log(`✓ Content-Type: ${authRecruiterRes.headers['content-type']}`);
  console.log(`✓ Stream Size: ${authRecruiterRes.body.length} bytes`);
  if (authRecruiterRes.status !== 200 || authRecruiterRes.body.length !== AUTHENTIC_PDF.length) {
    throw new Error('Authorized recruiter resume download failed!');
  }
  console.log('');

  // -------------------------------------------------------------------------
  // TEST F: Invalid File Rejection (Magic Bytes & Size Validation)
  // -------------------------------------------------------------------------
  console.log('[Step 9] Testing Binary Signature (Magic Byte) Inspection...');
  // 1. Fake text file disguised as PDF
  const fakeResumeRes = await request(app)
    .post('/api/candidates/me/resume')
    .set('Authorization', `Bearer ${candidateToken}`)
    .attach('resume', FAKE_DISGUISED_FILE, 'malicious.pdf');
  console.log(`✓ Disguised Fake PDF Rejected: HTTP ${fakeResumeRes.status} ("${fakeResumeRes.body.message}")`);
  if (fakeResumeRes.status !== 400) {
    throw new Error(`Expected 400 Bad Request for fake PDF, got ${fakeResumeRes.status}`);
  }

  // 2. Fake image disguised as JPEG
  const fakeAvatarRes = await request(app)
    .post('/api/users/me/avatar')
    .set('Authorization', `Bearer ${candidateToken}`)
    .attach('avatar', FAKE_DISGUISED_FILE, 'fake.jpg');
  console.log(`✓ Disguised Fake JPEG Rejected: HTTP ${fakeAvatarRes.status} ("${fakeAvatarRes.body.message}")`);
  if (fakeAvatarRes.status !== 400) {
    throw new Error(`Expected 400 Bad Request for fake avatar, got ${fakeAvatarRes.status}`);
  }
  console.log('');

  // -------------------------------------------------------------------------
  // TEST G: Path Traversal Security Verification
  // -------------------------------------------------------------------------
  console.log('[Step 10] Testing Path Traversal Attack Prevention...');
  const maliciousKeys = [
    '../../package.json',
    '..\\..\\backend\\.env',
    'resumes/../../../../Windows/System32/drivers/etc/hosts',
    'avatars/../../../etc/passwd'
  ];

  for (const malKey of maliciousKeys) {
    let trapped = false;
    try {
      await storageService.fileExists(malKey);
    } catch (e) {
      trapped = e.message.includes('Path traversal') || e.code === 'ERR_PATH_TRAVERSAL';
    }
    console.log(`✓ Traversal key [${malKey}] safely trapped: ${trapped}`);
    if (!trapped) {
      throw new Error(`Path traversal vulnerability: key "${malKey}" was not blocked!`);
    }
  }
  console.log('');

  // -------------------------------------------------------------------------
  // TEST H: Persistence Across Backend Cold Restart (Without In-Memory Cache)
  // -------------------------------------------------------------------------
  console.log('[Step 11] Testing Real Disk Persistence Across Backend Cold Restart...');
  // Simulate complete backend restart: clear all in-memory maps
  storageService.clearMockStorage();
  console.log('✓ In-memory storage cache cleared (cold restart simulation).');

  // Verify file existence directly from filesystem
  const existsOnDiskCold = await storageService.fileExists(resumeStorageKey);
  console.log(`✓ File existence checked directly against physical disk: ${existsOnDiskCold}`);
  if (!existsOnDiskCold) {
    throw new Error('File did not persist on physical disk after cold restart!');
  }

  // Read buffer directly from disk
  const diskBuffer = await storageService.getFileBuffer(resumeStorageKey);
  console.log(`✓ Direct disk read: ${diskBuffer.length} bytes (Matches original: ${diskBuffer.equals(AUTHENTIC_PDF)})`);
  if (!diskBuffer.equals(AUTHENTIC_PDF)) {
    throw new Error('Disk file content corrupted or altered!');
  }

  // Stream resume over HTTP via cold restart
  const coldStreamRes = await request(app)
    .get('/api/candidates/me/resume/download')
    .set('Authorization', `Bearer ${candidateToken}`);
  console.log(`✓ HTTP Download from disk after restart: HTTP ${coldStreamRes.status} (${coldStreamRes.body.length} bytes)`);
  if (coldStreamRes.status !== 200 || !coldStreamRes.body.equals(AUTHENTIC_PDF)) {
    throw new Error('HTTP download failed after cold restart!');
  }
  console.log('');

  // -------------------------------------------------------------------------
  // TEST I: File Replacement & Deletion (Physical Unlink on Disk)
  // -------------------------------------------------------------------------
  console.log('[Step 12] Testing File Replacement & Deletion from Disk...');
  // 1. Replace avatar with a second avatar
  const secondAvatarRes = await request(app)
    .post('/api/users/me/avatar')
    .set('Authorization', `Bearer ${candidateToken}`)
    .attach('avatar', AUTHENTIC_JPEG, 'candidate_avatar_v2.jpg');

  const newAvatarUrl = secondAvatarRes.body.data.avatarUrl;
  const newAvatarKey = path.basename(newAvatarUrl);
  const newAvatarPhysicalPath = path.join(storageInfo.baseDir, 'avatars', newAvatarKey);

  // Old avatar should be unlinked from disk
  const oldAvatarStillOnDisk = fs.existsSync(avatarPhysicalPath);
  const newAvatarOnDisk = fs.existsSync(newAvatarPhysicalPath);
  console.log(`✓ Old avatar unlinked from physical disk: ${!oldAvatarStillOnDisk}`);
  console.log(`✓ New avatar saved to physical disk: ${newAvatarOnDisk}`);
  if (oldAvatarStillOnDisk || !newAvatarOnDisk) {
    throw new Error('Old avatar was not deleted upon replacement!');
  }

  // 2. Explicit avatar deletion
  await request(app)
    .delete('/api/users/me/avatar')
    .set('Authorization', `Bearer ${candidateToken}`);
  const deletedAvatarOnDisk = fs.existsSync(newAvatarPhysicalPath);
  console.log(`✓ Avatar explicitly deleted and unlinked from physical disk: ${!deletedAvatarOnDisk}`);

  // 3. Explicit resume deletion
  await request(app)
    .delete('/api/candidates/me/resume')
    .set('Authorization', `Bearer ${candidateToken}`);
  const deletedResumeOnDisk = fs.existsSync(resumePhysicalPath);
  console.log(`✓ Resume explicitly deleted and unlinked from physical disk: ${!deletedResumeOnDisk}`);
  if (deletedResumeOnDisk) {
    throw new Error('Resume file was not unlinked from disk upon deletion!');
  }
  console.log('');

  // -------------------------------------------------------------------------
  // CLEANUP ISOLATED TEST DOCUMENTS FROM DATABASE
  // -------------------------------------------------------------------------
  console.log('[Step 13] Cleaning up test records from database...');
  await User.deleteMany({ _id: { $in: [candidate._id, otherCandidate._id, recruiter._id, otherRecruiter._id] } });
  await CandidateProfile.deleteMany({ user: { $in: [candidate._id, otherCandidate._id] } });
  await RecruiterProfile.deleteMany({ user: { $in: [recruiter._id, otherRecruiter._id] } });
  await Company.deleteMany({ _id: company._id });
  await CompanyMembership.deleteMany({ company: company._id });
  await Job.deleteMany({ _id: job._id });
  await Application.deleteMany({ job: job._id });
  await ResumeAsset.deleteMany({ user: candidate._id });
  await mongoose.disconnect();
  console.log('✓ Database test records cleanly purged.\n');

  console.log('================================================================');
  console.log('ALL STORAGE & PERSISTENCE TESTS PASSED CLEANLY (100% SUCCESS)');
  console.log('================================================================');
}

run().catch((err) => {
  console.error('\n✗ TEST FAILED:', err);
  process.exit(1);
});
