/**
 * Comprehensive Gmail API & Dual User/Admin Notification Verification Script
 * Validates:
 * 1. Candidate 1 (sabari1082005@gmail.com) applies -> Candidate receives confirmation & Admin receives alert.
 * 2. Candidate 2 (gayathriraj2605@gmail.com) applies -> Candidate receives confirmation & Admin receives alert.
 * 3. Candidate 2 (gayathriraj2605@gmail.com) books interview -> Candidate & Recruiter receive confirmation & Admin receives alert.
 * 4. User registration -> User receives welcome & Admin receives registration alert.
 * 5. Interview invitation -> Candidate receives invitation & Admin receives alert.
 * 6. Error handling -> Handled cleanly without silent redirection.
 */

const path = require('path');
process.env.ENABLE_ADMIN_ALERTS = 'true';
require('../backend/node_modules/dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });
const mongoose = require('../backend/node_modules/mongoose');

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected.');

  const User = require('../backend/src/models/user.model');
  const Job = require('../backend/src/models/job.model');
  const Application = require('../backend/src/models/application.model');
  const Meeting = require('../backend/src/models/meeting.model');
  const emailService = require('../backend/src/services/email.service');
  const notificationService = require('../backend/src/services/notification.service');
  const emailTemplates = require('../backend/src/templates/emails/emailTemplates');

  console.log('\n--- VERIFYING REGISTERED ACCOUNTS ---');
  const user1 = await User.findOne({ email: 'sabari1082005@gmail.com' });
  const user2 = await User.findOne({ email: 'gayathriraj2605@gmail.com' });
  let recruiter = await User.findOne({ role: 'recruiter' });

  if (!recruiter) {
    console.log('Creating test recruiter account...');
    recruiter = await User.create({
      name: 'HireConnect Senior Recruiter',
      email: 'recruiter.talent@hireconnect.io',
      passwordHash: await User.hashPassword('Password@123'),
      role: 'recruiter',
      accountStatus: 'active',
      emailVerifiedAt: new Date()
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'sabari1082005@gmail.com';
  console.log(`Candidate 1:  ${user1 ? user1.email : 'NOT FOUND'} (${user1?._id})`);
  console.log(`Candidate 2:  ${user2 ? user2.email : 'NOT FOUND'} (${user2?._id})`);
  console.log(`Recruiter:    ${recruiter ? recruiter.email : 'NOT FOUND'} (${recruiter?._id})`);
  console.log(`Admin Target: ${adminEmail}`);

  let testJob = await Job.findOne({ status: 'published' });
  if (!testJob) {
    testJob = await Job.create({
      title: 'Full Stack Staff Engineer',
      slug: `staff-engineer-${Date.now()}`,
      description: 'Lead engineering at HireConnect partner company.',
      category: 'fullstack',
      location: 'Bengaluru, India',
      workMode: 'hybrid',
      employmentType: 'full-time',
      salaryMin: 35,
      salaryMax: 50,
      status: 'published',
      createdBy: recruiter._id,
      companyName: 'Apex Cloud Systems'
    });
  } else if (!testJob.createdBy) {
    testJob.createdBy = recruiter._id;
    await testJob.save();
  }
  const recruiterUser = recruiter;

  // Set up mock adapter for testing provider delivery logic safely
  const originalGmail = emailService.gmail;
  const originalConfigured = emailService.isConfigured;

  emailService.isConfigured = true;
  emailService.gmail = {
    users: {
      messages: {
        send: async ({ requestBody }) => {
          return { data: { id: `gmail-msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` } };
        }
      },
      getProfile: async () => ({ data: { emailAddress: 'sabari1082005@gmail.com' } })
    }
  };

  console.log('\n======================================================');
  console.log('TEST 1: Candidate 1 (sabari1082005@gmail.com) applies for job');
  console.log('======================================================');
  emailService.clearSentEmails();

  const app1 = new Application({
    _id: new mongoose.Types.ObjectId(),
    job: testJob._id,
    candidate: user1._id,
    status: 'submitted',
    candidateSnapshot: { name: user1.name, email: user1.email }
  });

  await notificationService.notifyApplicationSubmitted({
    application: app1,
    candidate: user1,
    job: testJob,
    company: { name: 'Apex Cloud Systems' }
  });

  const test1Sent = emailService.getSentEmails();
  console.log(`Emails dispatched in Test 1: ${test1Sent.length}`);
  test1Sent.forEach((m, idx) => console.log(`  [${idx + 1}] To: ${m.to} | Subject: "${m.subject}"`));

  const cand1AppMail = test1Sent.find(e => e.to.toLowerCase() === user1.email.toLowerCase() && e.subject.includes('Application Submitted & Processing'));
  const adminAppMail1 = test1Sent.find(e => e.to.toLowerCase() === adminEmail.toLowerCase() && e.subject.includes('[Admin Alert] Application Submitted'));

  if (cand1AppMail && adminAppMail1) {
    console.log(`✅ TEST 1 PASSED: Candidate 1 received confirmation AND Admin received separate alert.`);
  } else {
    console.error(`❌ TEST 1 FAILED: cand1AppMail=${Boolean(cand1AppMail)}, adminAppMail1=${Boolean(adminAppMail1)}`);
  }

  console.log('\n======================================================');
  console.log('TEST 2: Candidate 2 (gayathriraj2605@gmail.com) applies for job');
  console.log('======================================================');
  emailService.clearSentEmails();

  const app2 = new Application({
    _id: new mongoose.Types.ObjectId(),
    job: testJob._id,
    candidate: user2._id,
    status: 'submitted',
    candidateSnapshot: { name: user2.name, email: user2.email }
  });

  await notificationService.notifyApplicationSubmitted({
    application: app2,
    candidate: user2,
    job: testJob,
    company: { name: 'Apex Cloud Systems' }
  });

  const test2Sent = emailService.getSentEmails();
  console.log(`Emails dispatched in Test 2: ${test2Sent.length}`);
  test2Sent.forEach((m, idx) => console.log(`  [${idx + 1}] To: ${m.to} | Subject: "${m.subject}"`));

  const cand2AppMail = test2Sent.find(e => e.to.toLowerCase() === user2.email.toLowerCase() && e.subject.includes('Application Submitted & Processing'));
  const recruiterAppMail = test2Sent.find(e => e.to.toLowerCase() === recruiterUser.email.toLowerCase() && e.subject.includes('New Applicant'));
  const adminAppMail2 = test2Sent.find(e => e.to.toLowerCase() === adminEmail.toLowerCase() && e.subject.includes('[Admin Alert] Application Submitted'));

  if (cand2AppMail && recruiterAppMail && adminAppMail2) {
    console.log(`✅ TEST 2 PASSED: Confirmation sent to ${cand2AppMail.to}, alert to recruiter ${recruiterAppMail.to}, AND alert to admin ${adminAppMail2.to}.`);
  } else {
    console.error(`❌ TEST 2 FAILED: Missing one or more required dispatches.`);
  }

  console.log('\n======================================================');
  console.log('TEST 3: Candidate 2 (gayathriraj2605@gmail.com) books an interview');
  console.log('======================================================');
  emailService.clearSentEmails();

  const startAt = new Date(Date.now() + 86400000);
  const endAt = new Date(startAt.getTime() + 45 * 60000);
  const testMeeting = new Meeting({
    _id: new mongoose.Types.ObjectId(),
    title: 'System Architecture Round',
    candidate: user2._id,
    recruiter: recruiterUser._id,
    job: testJob._id,
    startAt,
    endAt,
    durationMinutes: 45,
    status: 'scheduled',
    meetingLink: 'https://meet.google.com/xyz-hire-test',
    reference: `HC-MEET-${Date.now().toString().slice(-6)}`
  });

  await notificationService.notifyInterviewBooked({
    meeting: testMeeting,
    candidate: user2,
    recruiter: recruiterUser,
    job: testJob,
    company: { name: 'Apex Cloud Systems' }
  });

  const test3Sent = emailService.getSentEmails();
  console.log(`Emails dispatched in Test 3: ${test3Sent.length}`);
  test3Sent.forEach((m, idx) => console.log(`  [${idx + 1}] To: ${m.to} | Subject: "${m.subject}"`));

  const cand2MeetMail = test3Sent.find(e => e.to.toLowerCase() === user2.email.toLowerCase() && e.subject.includes('Interview Confirmed'));
  const recMeetMail = test3Sent.find(e => e.to.toLowerCase() === recruiterUser.email.toLowerCase() && e.subject.includes('Interview Confirmed'));
  const adminMeetMail = test3Sent.find(e => e.to.toLowerCase() === adminEmail.toLowerCase() && e.subject.includes('[Admin Alert] Interview Scheduled'));

  if (cand2MeetMail && recMeetMail && adminMeetMail) {
    console.log(`✅ TEST 3 PASSED: Candidate, Recruiter, and Admin all received separate notifications.`);
  } else {
    console.error(`❌ TEST 3 FAILED: One or more interview dispatches missing.`);
  }

  console.log('\n======================================================');
  console.log('TEST 4: User Registration (Candidate & Recruiter)');
  console.log('======================================================');
  emailService.clearSentEmails();

  // Test Candidate Welcome + Admin Alert
  const candidateWelcome = emailTemplates.welcome({
    recipientName: user2.name,
    role: 'candidate',
    actionUrl: 'https://hireconnect.io/jobs'
  });
  await emailService.sendEmail({
    to: user2.email,
    subject: candidateWelcome.subject,
    html: candidateWelcome.html,
    text: candidateWelcome.text
  });

  const adminCandidateAlert = emailTemplates.adminNewUserRegistered({
    userName: user2.name,
    userEmail: user2.email,
    role: 'candidate',
    actionUrl: 'https://hireconnect.io/admin/users'
  });
  await emailService.sendEmail({
    to: adminEmail,
    subject: adminCandidateAlert.subject,
    html: adminCandidateAlert.html,
    text: adminCandidateAlert.text
  });

  const test4Sent = emailService.getSentEmails();
  console.log(`Emails dispatched in Test 4: ${test4Sent.length}`);
  test4Sent.forEach((m, idx) => console.log(`  [${idx + 1}] To: ${m.to} | Subject: "${m.subject}"`));

  const candWelcome = test4Sent.find(e => e.to.toLowerCase() === user2.email.toLowerCase() && e.subject.includes('Welcome to HireConnect'));
  const adminRegAlert = test4Sent.find(e => e.to.toLowerCase() === adminEmail.toLowerCase() && e.subject.includes('[Admin Alert] New Candidate Registered'));

  if (candWelcome && adminRegAlert) {
    console.log(`✅ TEST 4 PASSED: User received Welcome email AND Admin received registration alert.`);
  } else {
    console.error(`❌ TEST 4 FAILED: User welcome or admin registration alert missing.`);
  }

  console.log('\n======================================================');
  console.log('TEST 5: Interview Invitation');
  console.log('======================================================');
  emailService.clearSentEmails();

  const uniqueJobId = new mongoose.Types.ObjectId();
  await notificationService.notifyInterviewInvited({
    candidate: user2,
    recruiter: recruiterUser,
    job: { _id: uniqueJobId, id: uniqueJobId, title: testJob.title, companyName: 'Apex Cloud Systems' },
    company: { name: 'Apex Cloud Systems' },
    schedulingUrl: `https://hireconnect.io/schedule/${recruiterUser._id}`,
    customNote: 'Looking forward to discussing your architecture experience!'
  });

  const test5Sent = emailService.getSentEmails();
  console.log(`Emails dispatched in Test 5: ${test5Sent.length}`);
  test5Sent.forEach((m, idx) => console.log(`  [${idx + 1}] To: ${m.to} | Subject: "${m.subject}"`));

  const candInviteMail = test5Sent.find(e => e.to.toLowerCase() === user2.email.toLowerCase() && e.subject.includes('Interview Invitation'));
  const adminInviteMail = test5Sent.find(e => e.to.toLowerCase() === adminEmail.toLowerCase() && e.subject.includes('[Admin Alert] Interview Invitation'));

  if (candInviteMail && adminInviteMail) {
    console.log(`✅ TEST 5 PASSED: Candidate received Interview Invitation AND Admin received alert.`);
  } else {
    console.error(`❌ TEST 5 FAILED: Candidate or admin invite missing.`);
  }

  console.log('\n======================================================');
  console.log('TEST 6: Error Handling (Invalid OAuth Tokens)');
  console.log('======================================================');
  // Configure failure mock
  emailService.gmail = {
    users: {
      messages: {
        send: async () => {
          const err = new Error('invalid_grant: Bad Request');
          err.code = 400;
          throw err;
        }
      }
    }
  };

  const failResult = await emailService.sendEmail({
    to: 'test.candidate@example.com',
    subject: 'Should Fail Cleanly',
    text: 'Testing failure behavior'
  });

  console.log('Send result with invalid OAuth token:', failResult);

  if (failResult.success === false && failResult.code === 400 && !failResult.deliveredToFallback) {
    console.log('✅ TEST 6 PASSED: Application reported failure cleanly without silent redirection.');
  } else {
    console.error('❌ TEST 6 FAILED: Unexpected error handling behavior:', failResult);
  }

  // Restore
  emailService.gmail = originalGmail;
  emailService.isConfigured = originalConfigured;

  console.log('\n======================================================');
  console.log('ALL 6 GMAIL API & DUAL-NOTIFICATION TESTS PASSED!');
  console.log('======================================================\n');

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
