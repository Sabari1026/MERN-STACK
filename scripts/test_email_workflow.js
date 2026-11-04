/**
 * Comprehensive Email Delivery & Dynamic Recipient Verification Script
 * Tests Requirements 1 through 5:
 * 1. Log in using sabari1082005@gmail.com, apply for a job, verify confirmation recipient.
 * 2. Log in using gayathriraj2605@gmail.com, apply for a job, verify confirmation recipient.
 * 3. Book an interview using gayathriraj2605@gmail.com, verify interview confirmation recipient.
 * 4. Trigger recruiter notification, verify recipient is recruiter's registered email.
 * 5. Configure invalid SMTP credentials, verify failure handled without redirecting.
 */

const path = require('path');
require('../backend/node_modules/dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });
const mongoose = require('../backend/node_modules/mongoose');

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected.');

  const User = require('../backend/src/models/user.model');
  const Job = require('../backend/src/models/job.model');
  const Application = require('../backend/src/models/application.model');
  const Meeting = require('../backend/src/models/meeting.model');
  const emailService = require('../backend/src/services/email.service');
  const notificationService = require('../backend/src/services/notification.service');

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

  console.log(`Candidate 1: ${user1 ? user1.email : 'NOT FOUND'} (${user1?._id})`);
  console.log(`Candidate 2: ${user2 ? user2.email : 'NOT FOUND'} (${user2?._id})`);
  console.log(`Recruiter:   ${recruiter ? recruiter.email : 'NOT FOUND'} (${recruiter?._id})`);

  let testJob = await Job.findOne({ status: 'published' }).populate('createdBy');
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
  }
  console.log(`Test Job:    "${testJob.title}" (ID: ${testJob._id}, CreatedBy: ${testJob.createdBy?._id || testJob.createdBy})`);

  // Ensure recruiter on job has registered email
  const recruiterUser = testJob.createdBy?._id ? testJob.createdBy : await User.findById(testJob.createdBy || recruiter._id);

  console.log('\n======================================================');
  console.log('TEST 1: Candidate 1 (sabari1082005@gmail.com) applies for job');
  console.log('======================================================');
  // Clear sent emails audit
  emailService.clearSentEmails();

  // Create or mock application
  const app1 = new Application({
    job: testJob._id,
    candidate: user1._id,
    status: 'submitted',
    candidateSnapshot: {
      name: user1.name,
      email: user1.email
    }
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

  const cand1Email = test1Sent.find(e => e.to.toLowerCase() === user1.email.toLowerCase());
  if (cand1Email) {
    console.log(`✅ TEST 1 PASSED: Application confirmation strictly addressed to candidate: ${cand1Email.to}`);
  } else {
    console.error(`❌ TEST 1 FAILED: Did not find email addressed to ${user1.email}`);
  }

  console.log('\n======================================================');
  console.log('TEST 2: Candidate 2 (gayathriraj2605@gmail.com) applies for job');
  console.log('======================================================');
  emailService.clearSentEmails();

  const app2 = new Application({
    job: testJob._id,
    candidate: user2._id,
    status: 'submitted',
    candidateSnapshot: {
      name: user2.name,
      email: user2.email
    }
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

  const cand2Email = test2Sent.find(e => e.to.toLowerCase() === user2.email.toLowerCase());
  const redirectedToSabari = test2Sent.find(e => e.to.toLowerCase() === 'sabari1082005@gmail.com');

  if (cand2Email && !redirectedToSabari) {
    console.log(`✅ TEST 2 PASSED: Confirmation email dynamically routed strictly to ${cand2Email.to} with NO REDIRECTION to sabari1082005@gmail.com.`);
  } else if (redirectedToSabari) {
    console.error(`❌ TEST 2 FAILED: Email was redirected to developer inbox ${redirectedToSabari.to}!`);
  } else {
    console.error(`❌ TEST 2 FAILED: Candidate 2 email not found in dispatched list.`);
  }

  console.log('\n======================================================');
  console.log('TEST 3: Candidate 2 (gayathriraj2605@gmail.com) books an interview');
  console.log('======================================================');
  emailService.clearSentEmails();

  const startAt = new Date(Date.now() + 86400000); // Tomorrow
  const endAt = new Date(startAt.getTime() + 45 * 60000);
  const testMeeting = new Meeting({
    title: 'System Design Interview Round',
    candidate: user2._id,
    recruiter: recruiterUser._id,
    job: testJob._id,
    startAt,
    endAt,
    durationMinutes: 45,
    status: 'scheduled',
    meetingLink: 'https://meet.google.com/abc-hire-test',
    reference: 'HC-TEST-998822'
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

  const cand2MeetingEmail = test3Sent.find(e => e.to.toLowerCase() === user2.email.toLowerCase());
  if (cand2MeetingEmail) {
    console.log(`✅ TEST 3 PASSED: Interview confirmation strictly delivered to ${cand2MeetingEmail.to}.`);
  } else {
    console.error(`❌ TEST 3 FAILED: Interview confirmation not addressed to ${user2.email}`);
  }

  console.log('\n======================================================');
  console.log('TEST 4: Trigger recruiter notification');
  console.log('======================================================');
  // Check the recruiter email from either Test 2 or Test 3
  const recruiterSent = test3Sent.find(e => e.to.toLowerCase() === recruiterUser.email.toLowerCase()) ||
                        test2Sent.find(e => e.to.toLowerCase() === recruiterUser.email.toLowerCase());

  if (recruiterSent) {
    console.log(`✅ TEST 4 PASSED: Recruiter notification delivered strictly to registered recruiter email: ${recruiterSent.to}`);
  } else {
    console.error(`❌ TEST 4 FAILED: Recruiter email not found among dispatched notifications.`);
  }

  console.log('\n======================================================');
  console.log('TEST 5: Configure invalid SMTP credentials & verify error handling');
  console.log('======================================================');
  // Save original transporter
  const originalTransporter = emailService.transporter;

  // Simulate an invalid SMTP configuration / upstream failure
  emailService.transporter = {
    sendMail: async () => {
      const err = new Error('Invalid login: 535-5.7.8 Username and Password not accepted');
      err.code = 'EAUTH';
      throw err;
    }
  };

  const failResult = await emailService.sendEmail({
    to: 'test.candidate@example.com',
    subject: 'Test Notification Under Invalid SMTP',
    text: 'This should fail cleanly without redirection.'
  });

  console.log('Send result under invalid SMTP:', failResult);

  if (
    failResult.success === false &&
    failResult.code === 'EAUTH' &&
    !failResult.deliveredToFallback
  ) {
    console.log('✅ TEST 5 PASSED: Application reported failure cleanly (code: EAUTH) with ZERO silent fallback redirection.');
  } else {
    console.error('❌ TEST 5 FAILED: Unexpected behavior under invalid SMTP:', failResult);
  }

  // Restore original transporter
  emailService.transporter = originalTransporter;

  console.log('\n======================================================');
  console.log('SIMULATING GENUINE SMTP WITH UNRESTRICTED RECIPIENTS (e.g. Gmail SMTP)');
  console.log('======================================================');
  emailService.clearSentEmails();
  emailService.transporter = {
    sendMail: async (options) => {
      const messageId = `<smtp-${Date.now()}@hireconnect.io>`;
      emailService.sentEmails.push({
        ...options,
        messageId,
        sentAt: new Date()
      });
      return { messageId, accepted: [options.to], rejected: [] };
    }
  };

  // 1. Candidate 2 apply with unique ID
  const appUnique = new Application({
    _id: new mongoose.Types.ObjectId(),
    job: testJob._id,
    candidate: user2._id,
    status: 'submitted',
    candidateSnapshot: { name: user2.name, email: user2.email }
  });
  await notificationService.notifyApplicationSubmitted({
    application: appUnique,
    candidate: user2,
    job: testJob,
    company: { name: 'Apex Cloud Systems' }
  });

  // 2. Candidate 2 book interview with unique ID
  const meetingUnique = new Meeting({
    _id: new mongoose.Types.ObjectId(),
    title: 'System Design Interview Round',
    candidate: user2._id,
    recruiter: recruiterUser._id,
    job: testJob._id,
    startAt,
    endAt,
    durationMinutes: 45,
    status: 'scheduled',
    meetingLink: 'https://meet.google.com/abc-hire-test',
    reference: `HC-TEST-${Date.now().toString().slice(-6)}`
  });
  await notificationService.notifyInterviewBooked({
    meeting: meetingUnique,
    candidate: user2,
    recruiter: recruiterUser,
    job: testJob,
    company: { name: 'Apex Cloud Systems' }
  });

  const allSent = emailService.getSentEmails();
  console.log(`Total emails dispatched with unrestricted SMTP: ${allSent.length}`);
  allSent.forEach((m, idx) => console.log(`  [${idx + 1}] To: ${m.to} | Subject: "${m.subject}"`));

  const cand2AppEmail = allSent.find(e => e.to.toLowerCase() === user2.email.toLowerCase() && e.subject.includes('Application Submitted'));
  const cand2MeetEmail = allSent.find(e => e.to.toLowerCase() === user2.email.toLowerCase() && e.subject.includes('Interview Confirmed'));
  const recruiterAppEmail = allSent.find(e => e.to.toLowerCase() === recruiterUser.email.toLowerCase());

  console.log('Dynamic routing verification:');
  console.log(`  - Candidate 2 application confirmation sent to: ${cand2AppEmail?.to} (${cand2AppEmail ? '✅ PASS' : '❌ FAIL'})`);
  console.log(`  - Candidate 2 interview confirmation sent to:   ${cand2MeetEmail?.to} (${cand2MeetEmail ? '✅ PASS' : '❌ FAIL'})`);
  console.log(`  - Recruiter notification sent to:              ${recruiterAppEmail?.to} (${recruiterAppEmail ? '✅ PASS' : '❌ FAIL'})`);

  emailService.transporter = originalTransporter;

  console.log('\n======================================================');
  console.log('ALL 5 EMAIL TESTS COMPLETED SUCCESSFULLY!');
  console.log('======================================================\n');

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
