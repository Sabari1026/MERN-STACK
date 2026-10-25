/**
 * Standalone MongoDB Atlas CRUD and Persistence Verification Script
 * Tests real Create, Read, Update, Delete and Session Persistence across core collections.
 */

const mongoose = require('./backend/node_modules/mongoose');
const { env } = require('./backend/src/config/env');

const User = require('./backend/src/models/user.model');
const CandidateProfile = require('./backend/src/models/candidateProfile.model');
const RecruiterProfile = require('./backend/src/models/recruiterProfile.model');
const Company = require('./backend/src/models/company.model');
const CompanyMembership = require('./backend/src/models/companyMembership.model');
const Job = require('./backend/src/models/job.model');
const Application = require('./backend/src/models/application.model');
const SavedJob = require('./backend/src/models/savedJob.model');
const Meeting = require('./backend/src/models/meeting.model');
const Notification = require('./backend/src/models/notification.model');
const AdminAuditLog = require('./backend/src/models/adminAuditLog.model');
const ResumeAsset = require('./backend/src/models/resumeAsset.model');

async function testCrudAndPersistence() {
  console.log('Connecting to MongoDB Atlas at', env.MONGODB_URI.replace(/:([^@]+)@/, ':***@'));
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('✓ Connected successfully. Starting CRUD assertions.\n');

  const ts = Date.now();

  // 1. CREATE: User & Company
  console.log('[1/5] Testing CREATE operations...');
  const testCandidate = await User.create({
    name: `Atlas Test Candidate ${ts}`,
    email: `crud_candidate_${ts}@atlas-test.io`,
    passwordHash: 'hashed_password_for_testing_123',
    role: 'candidate',
    status: 'active'
  });
  console.log('  ✓ User created with _id:', testCandidate._id.toString());

  const testCompany = await Company.create({
    name: `Atlas Test Corp ${ts}`,
    slug: `atlas-test-corp-${ts}`,
    website: 'https://atlastest.io',
    industry: 'Technology',
    createdBy: testCandidate._id,
    verificationStatus: 'verified'
  });
  console.log('  ✓ Company created with slug:', testCompany.slug);

  const testJob = await Job.create({
    title: `Staff Cloud Database Engineer ${ts}`,
    slug: `staff-cloud-db-engineer-${ts}`,
    description: 'Architecting distributed database systems and high-throughput pipelines.',
    company: testCompany._id,
    createdBy: testCandidate._id,
    location: 'Remote - India',
    workMode: 'remote',
    employmentType: 'full-time',
    category: 'Engineering',
    status: 'published',
    skills: ['MongoDB', 'Node.js', 'Distributed Systems'],
    experienceLevel: 'senior',
    salaryMin: 4000000,
    salaryMax: 6000000,
    currency: 'INR'
  });
  console.log('  ✓ Job created with title:', testJob.title);

  const testResume = await ResumeAsset.create({
    user: testCandidate._id,
    storageKey: `resumes/test_resume_${ts}.pdf`,
    originalFilename: `Atlas_Test_Resume_${ts}.pdf`,
    mimeType: 'application/pdf',
    sizeBytes: 154200,
    isCurrent: true,
    status: 'active'
  });
  console.log('  ✓ ResumeAsset created with storageKey:', testResume.storageKey);

  const testProfile = await CandidateProfile.create({
    user: testCandidate._id,
    headline: 'Staff Database Architect | MongoDB Clustering',
    location: 'Bengaluru, India',
    contactEmail: testCandidate.email,
    resume: testResume._id,
    skills: [{ name: 'MongoDB', level: 'Expert', category: 'Database' }]
  });
  console.log('  ✓ CandidateProfile created with headline:', testProfile.headline);

  const testApplication = await Application.create({
    candidate: testCandidate._id,
    job: testJob._id,
    company: testCompany._id,
    status: 'applied',
    coverLetter: 'Applying for Staff Database Engineer role.',
    resumeSnapshot: {
      assetId: testResume._id.toString(),
      fileName: testResume.originalFilename,
      fileSize: testResume.sizeBytes,
      fileUrl: `/api/profile/resume/download/${testCandidate._id}`
    }
  });
  console.log('  ✓ Application created with ID:', testApplication._id.toString());

  // 2. READ: Queries with Projections & Populations
  console.log('\n[2/5] Testing READ operations (with populate)...');
  const readJob = await Job.findById(testJob._id).populate('company');
  if (!readJob || !readJob.company || readJob.company.name !== testCompany.name) {
    throw new Error('READ failed: Job company population mismatch');
  }
  console.log(`  ✓ Populated Job -> Company: "${readJob.company.name}"`);

  const readApp = await Application.findById(testApplication._id).populate('candidate').populate('job');
  if (!readApp || readApp.candidate.email !== testCandidate.email || readApp.job.title !== testJob.title) {
    throw new Error('READ failed: Application population mismatch');
  }
  console.log(`  ✓ Populated Application -> Candidate: "${readApp.candidate.email}", Job: "${readApp.job.title}"`);

  // 3. UPDATE: Atomic mutations & status transitions
  console.log('\n[3/5] Testing UPDATE operations...');
  await CandidateProfile.updateOne(
    { _id: testProfile._id },
    {
      $set: { headline: 'Principal Database Architect | MongoDB Distributed Systems' },
      $push: { skills: { name: 'Mongoose', level: 'Expert', category: 'Database' } }
    }
  );
  const updatedProfile = await CandidateProfile.findById(testProfile._id);
  if (updatedProfile.skills.length !== 2) {
    throw new Error('UPDATE failed: Skills array push not persisted');
  }
  console.log('  ✓ CandidateProfile atomically updated ($set headline + $push skill).');

  await Application.updateOne(
    { _id: testApplication._id },
    {
      $set: { status: 'shortlisted' },
      $push: {
        statusHistory: {
          fromStatus: 'applied',
          toStatus: 'shortlisted',
          changedBy: testCandidate._id,
          changedByName: 'Recruiter Lead',
          changedAt: new Date(),
          reason: 'Strong MongoDB Atlas clustering background'
        }
      }
    }
  );
  const updatedApp = await Application.findById(testApplication._id);
  if (updatedApp.status !== 'shortlisted' || updatedApp.statusHistory.length < 1) {
    throw new Error('UPDATE failed: Application status update not persisted');
  }
  console.log('  ✓ Application status updated to "shortlisted" with audit history.');

  // 4. DISCONNECT & RECONNECT (Verify Persistence across cold restart)
  console.log('\n[4/5] Testing PERSISTENCE ACROSS DISCONNECT / COLD RECONNECT...');
  console.log('  Closing initial connection...');
  await mongoose.disconnect();
  console.log('  Disconnected. Connecting fresh Mongoose session to Atlas...');
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('  Fresh connection established.');

  const coldProfile = await CandidateProfile.findById(testProfile._id).populate('resume');
  if (!coldProfile || !coldProfile.headline.includes('Principal Database Architect')) {
    throw new Error('Cold persistence check failed for CandidateProfile!');
  }
  console.log(`  ✓ Persisted Profile retrieved from Atlas: "${coldProfile.headline}"`);

  const coldApp = await Application.findById(testApplication._id);
  if (!coldApp || coldApp.status !== 'shortlisted') {
    throw new Error('Cold persistence check failed for Application!');
  }
  console.log(`  ✓ Persisted Application status retrieved from Atlas: "${coldApp.status}"`);

  // 5. DELETE & CLEANUP
  console.log('\n[5/5] Testing DELETE & cleanup...');
  await Application.deleteOne({ _id: testApplication._id });
  await Job.deleteOne({ _id: testJob._id });
  await Company.deleteOne({ _id: testCompany._id });
  await ResumeAsset.deleteOne({ _id: testResume._id });
  await CandidateProfile.deleteOne({ _id: testProfile._id });
  await User.deleteOne({ _id: testCandidate._id });

  const verifyDeleted = await User.findById(testCandidate._id);
  if (verifyDeleted) {
    throw new Error('DELETE cleanup failed: Test user still found');
  }
  console.log('  ✓ All test documents cleaned up cleanly from MongoDB Atlas.');

  await mongoose.disconnect();
  console.log('\n======================================================');
  console.log('ALL MONGODB ATLAS CRUD & PERSISTENCE TESTS PASSED (100%)');
  console.log('======================================================');
}

testCrudAndPersistence().catch((err) => {
  console.error('\n❌ CRUD test failed:', err);
  process.exit(1);
});
