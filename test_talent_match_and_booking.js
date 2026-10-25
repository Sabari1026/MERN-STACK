const http = require('http');
const fs = require('fs');
const path = require('path');

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data,
          json
        });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('   HIRECONNECT COMPREHENSIVE VERIFICATION SUITE     ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Static HTML File Checks: Zero "For Employers", Only "Talent Match"
  console.log('--- 1. Static HTML & Navigation Checks ---');
  const htmlFiles = [
    'index.html',
    'about/index.html',
    'approach/index.html',
    'cases/index.html',
    'contact/index.html',
    'privacy/index.html',
    'profile/index.html',
    'services/index.html',
    'settings/index.html',
    'signup/index.html',
    'terms/index.html'
  ];

  for (const f of htmlFiles) {
    const filePath = path.join(__dirname, f);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const hasForEmployers = /For Employers/i.test(content);
      assert(!hasForEmployers, `No "For Employers" in ${f}`);
      const hasTalentMatch = /Talent Match/i.test(content);
      assert(hasTalentMatch, `Has "Talent Match" in ${f}`);
    }
  }

  // 2. Authentication: Candidate & Recruiter
  console.log('\n--- 2. Auth Flow ---');
  const candLogin = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'candidate@hireconnect.io', password: 'Candidate@123', role: 'employee' });

  assert(candLogin.statusCode === 200 && candLogin.json.token, 'Candidate login succeeds');
  const candToken = candLogin.json.token;
  const candUser = candLogin.json.user;

  const recLogin = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'recruiter@hireconnect.io', password: 'Recruiter@123', role: 'recruiter' });

  assert(recLogin.statusCode === 200 && recLogin.json.token, 'Recruiter login succeeds');
  const recToken = recLogin.json.token;
  const recUser = recLogin.json.user;

  // 3. Candidate Talent Match Endpoint
  console.log('\n--- 3. Candidate Talent Match Engine ---');
  const candMatchesRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/talent-match/jobs',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + candToken }
  });

  assert(candMatchesRes.statusCode === 200, 'GET /api/talent-match/jobs returns HTTP 200');
  const candMatches = candMatchesRes.json.matches;
  assert(candMatches && candMatches.length > 0, `Returned ${candMatches ? candMatches.length : 0} matching jobs for candidate`);
  if (candMatches && candMatches.length > 0) {
    const topMatch = candMatches[0];
    assert(topMatch.matchScore >= 70, `Top match score is ${topMatch.matchScore}%`);
    assert(topMatch.matchedSkills && topMatch.matchedSkills.length > 0, `Matched skills identified: ${topMatch.matchedSkills.join(', ')}`);
    assert(topMatch.reasons && topMatch.reasons.length > 0, `Transparent reasons provided: "${topMatch.reasons[0]}"`);

    // Test Save Job
    const saveJobRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/talent-match/save-job',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + candToken
      }
    }, { jobId: topMatch.job.id });

    assert(saveJobRes.statusCode === 200 && saveJobRes.json.success, `Saved job toggle for ${topMatch.job.id} (isSaved: ${saveJobRes.json.isSaved})`);

    // Ensure it's in saved state for getSavedJobs check
    if (!saveJobRes.json.isSaved) {
      await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/talent-match/save-job',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + candToken
        }
      }, { jobId: topMatch.job.id });
    }

    const getSavedRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/talent-match/saved-jobs',
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + candToken }
    });
    assert(getSavedRes.statusCode === 200 && getSavedRes.json.jobs.some(j => j.id === topMatch.job.id), 'Saved jobs list contains the bookmarked job');
  }

  // 4. Recruiter Talent Match & Candidate Privacy
  console.log('\n--- 4. Recruiter Talent Match & Privacy Filtering ---');
  const recJobsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/recruiter/jobs',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + recToken }
  });
  assert(recJobsRes.statusCode === 200 && recJobsRes.json.jobs.length > 0, `Recruiter has ${recJobsRes.json.jobs ? recJobsRes.json.jobs.length : 0} active jobs`);

  const activeJob = recJobsRes.json.jobs[0];
  const recCandMatchesRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/talent-match/candidates?jobId=${activeJob.id}`,
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + recToken }
  });

  assert(recCandMatchesRes.statusCode === 200, `GET /api/talent-match/candidates?jobId=${activeJob.id} returns HTTP 200`);
  const candList = recCandMatchesRes.json.matches || [];
  assert(candList.length > 0, `Found ${candList.length} candidate matches for job ${activeJob.title}`);

  // STRICT PRIVACY CHECK: Rahul Verma has privacy.isDiscoverable: false and must NOT be in recruiter matches!
  const hasPrivateCandidate = candList.some(c => c.name.toLowerCase().includes('rahul verma'));
  assert(!hasPrivateCandidate, 'Candidate Privacy Enforced: Private candidates (Rahul Verma) excluded from recruiter discovery');

  // Shortlist Candidate
  if (candList.length > 0) {
    const topCand = candList[0];
    const shortlistRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/talent-match/shortlist',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + recToken
      }
    }, { candidateId: topCand.candidateId, jobId: activeJob.id });

    assert(shortlistRes.statusCode === 200 && shortlistRes.json.success, `Shortlisted candidate ${topCand.name} (isShortlisted: ${shortlistRes.json.isShortlisted})`);
  }

  // 5. Real Meeting Booking System
  console.log('\n--- 5. Real Meeting Booking System ---');
  // Weekend check
  const weekendRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/bookings/availability?date=2026-10-25', // Sunday
    method: 'GET'
  });
  assert(weekendRes.json && weekendRes.json.available === false, 'Weekend booking correctly blocked (available: false)');

  // Weekday availability check & host assignment
  const weekday = '2026-10-28'; // Wednesday
  const availRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/bookings/availability?date=${weekday}&purpose=${encodeURIComponent('Talent Match demonstration')}`,
    method: 'GET'
  });

  assert(availRes.statusCode === 200 && availRes.json.available === true, `Weekday ${weekday} has available slots (${availRes.json.slots.length} slots)`);
  assert(availRes.json.assignedHost.name === 'Neeraj Deshmukh', 'Host Neeraj Deshmukh correctly assigned for Talent Match demo');

  const testSlot = availRes.json.slots[0];
  const bookingRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/bookings',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Suresh Menon',
    email: 'suresh.menon@swiggy.in',
    phone: '+91 99887 76655',
    company: 'Swiggy Engineering',
    purpose: 'Talent Match demonstration',
    date: weekday,
    timeSlot: testSlot,
    timezone: 'Asia/Kolkata',
    format: 'Video Call (Google Meet)',
    agenda: 'Demo of AI talent scoring for senior backend staffing'
  });

  assert(bookingRes.statusCode === 201 && bookingRes.json.success, `Meeting booked with reference: ${bookingRes.json.meeting ? bookingRes.json.meeting.reference : 'N/A'}`);
  assert(bookingRes.json.meeting.videoUrl.startsWith('https://meet.hireconnect.io/room-'), `Instant video URL generated: ${bookingRes.json.meeting ? bookingRes.json.meeting.videoUrl : ''}`);

  // Test Double Booking Conflict (HTTP 409)
  const conflictRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/bookings',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Another User',
    email: 'another@domain.com',
    purpose: 'Talent Match demonstration',
    date: weekday,
    timeSlot: testSlot,
    timezone: 'Asia/Kolkata'
  });

  assert(conflictRes.statusCode === 409, `Double booking rejected with HTTP 409 Conflict: "${conflictRes.json ? conflictRes.json.message : ''}"`);

  // Email delivery tracking check
  const emailLogDir = path.join(__dirname, 'data', 'email_logs');
  const emailLogsExist = fs.existsSync(emailLogDir) && fs.readdirSync(emailLogDir).length > 0;
  assert(emailLogsExist, 'Transactional email dispatch logged in data/email_logs/ directory');

  // 6. Route Alias & Page Serving
  console.log('\n--- 6. Routing & Aliases ---');
  const casesPage = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/cases/',
    method: 'GET'
  });
  assert(casesPage.statusCode === 200 && casesPage.data.includes('hc-talent-match-app'), 'GET /cases/ serves Talent Match page');

  const tmAliasPage = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/talent-match/',
    method: 'GET'
  });
  assert(tmAliasPage.statusCode === 200 && tmAliasPage.data.includes('hc-talent-match-app'), 'GET /talent-match/ aliases to Talent Match page');

  console.log('\n====================================================');
  console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
