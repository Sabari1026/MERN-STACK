const assert = require('assert');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('======================================================================');
  console.log('   HIRECONNECT PROMPT 10 VERIFICATION SUITE');
  console.log('======================================================================\n');

  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ${name}: ${err.message}`);
    }
  }

  async function asyncTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ${name}: ${err.message}`);
    }
  }

  // 1. Visible Sign In navbar button removed across all pages
  console.log('--- 1. Visible Sign In Navbar Button Removal Across All Pages ---');
  const pages = [
    'index.html', 'services/index.html', 'approach/index.html', 'about/index.html',
    'cases/index.html', 'contact/index.html', 'privacy/index.html', 'terms/index.html',
    'signup/index.html', 'profile/index.html', 'settings/index.html'
  ];

  for (const page of pages) {
    test(`No visible Sign In button in navbar of ${page}`, () => {
      const html = fs.readFileSync(page, 'utf8');
      const hasNavSignIn = /<nav[\s\S]*?Sign In[\s\S]*?<\/nav>/i.test(html);
      assert.strictEqual(hasNavSignIn, false, `Found static Sign In in <nav> for ${page}`);
      assert.ok(html.includes('shared-account-menu.css'), `Missing shared-account-menu.css in ${page}`);
      assert.ok(html.includes('shared-account-menu.js'), `Missing shared-account-menu.js in ${page}`);
    });
  }

  // 2. Original Animated Image Collage Preserved on Sign In & Reused on Sign Up
  console.log('\n--- 2. Preservation of Animated Floating Image Collage & Styling ---');
  test('Sign In page preserves 23 floating images & centered text', () => {
    const signInHtml = fs.readFileSync('about/index.html', 'utf8');
    assert.ok(signInHtml.includes('Not just another job board'), 'Missing centered title');
    const collageStart = signInHtml.indexOf('_items_n3z96_95');
    const collageEnd = signInHtml.indexOf('<!--]--></div>', collageStart);
    const collageHtml = signInHtml.slice(collageStart, collageEnd);
    const imageCount = (collageHtml.match(/_item_n3z96_95/g) || []).length;
    assert.strictEqual(imageCount, 23, `Expected 23 floating collage images, found ${imageCount}`);
    assert.ok(signInHtml.includes('_items_n3z96_95'), 'Missing floating collage container');
  });

  test('Sign Up page reuses exact 23 floating images & centered text', () => {
    const signUpHtml = fs.readFileSync('signup/index.html', 'utf8');
    assert.ok(signUpHtml.includes('Not just another job board'), 'Missing centered title on Sign Up');
    const collageStart = signUpHtml.indexOf('_items_n3z96_95');
    const collageEnd = signUpHtml.indexOf('<!--]--></div>', collageStart);
    const collageHtml = signUpHtml.slice(collageStart, collageEnd);
    const imageCount = (collageHtml.match(/_item_n3z96_95/g) || []).length;
    assert.strictEqual(imageCount, 23, `Expected 23 floating collage images on Sign Up, found ${imageCount}`);
    assert.ok(signUpHtml.includes('_items_n3z96_95'), 'Missing floating collage container on Sign Up');
    assert.ok(signUpHtml.includes('hc-candidate-fields'), 'Missing candidate registration fields');
    assert.ok(signUpHtml.includes('hc-recruiter-fields'), 'Missing recruiter registration fields');
  });

  // 3. Employee and Recruiter Login Forms Work Independently
  console.log('\n--- 3. Independent Employee and Recruiter Authentication ---');
  await asyncTest('Candidate login succeeds with employee credentials', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'candidate@hireconnect.io', password: 'Candidate@123', role: 'employee' })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.role, 'employee');
    assert.ok(data.token);
  });

  await asyncTest('Candidate cannot sign in under recruiter role (strict role boundary)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'candidate@hireconnect.io', password: 'Candidate@123', role: 'recruiter' })
    });
    assert.strictEqual(res.status, 403);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  await asyncTest('Recruiter login succeeds with recruiter credentials', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'recruiter@hireconnect.io', password: 'Recruiter@123', role: 'recruiter' })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.role, 'recruiter');
    assert.ok(data.token);
  });

  // 4. Both Registration Flows Work Correctly
  console.log('\n--- 4. Job Seeker & Recruiter Registration Flows ---');
  const testCandidateEmail = `cand_${Date.now()}@test.io`;
  let newCandToken = '';

  await asyncTest('Job Seeker registration succeeds and creates authenticated profile', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rohan Mehta',
        email: testCandidateEmail,
        password: 'Password@123',
        role: 'employee'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.role, 'employee');
    newCandToken = data.token;
    assert.ok(newCandToken);
  });

  const testRecruiterEmail = `rec_${Date.now()}@testcompany.io`;
  let newRecToken = '';

  await asyncTest('Recruiter registration succeeds with company affiliation', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Ananya Deshmukh',
        email: testRecruiterEmail,
        password: 'Password@123',
        companyName: 'Zepto Labs',
        title: 'Lead Talent Partner',
        website: 'https://zepto.com',
        role: 'recruiter'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.role, 'recruiter');
    newRecToken = data.token;
    assert.ok(newRecToken);
  });

  // 5. Dedicated Profile Pages & Dynamic Updates
  console.log('\n--- 5. Dedicated Profile Features & Role Separation ---');
  await asyncTest('Candidate profile updates save education, projects, skills, preferences', async () => {
    const res = await fetch(`${BASE_URL}/api/profile/candidate`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + newCandToken },
      body: JSON.stringify({
        headline: 'Lead Cloud Architect | AWS • Kubernetes',
        location: 'Pune, Maharashtra',
        skills: [{ name: 'Go', level: 'Expert' }, { name: 'Kubernetes', level: 'Expert' }],
        projects: [{ title: 'Cloud Mesh', description: 'Zero-trust service mesh', githubUrl: 'https://github.com/test' }],
        education: [{ degree: 'B.Tech IT', institution: 'COEP', year: '2021', grade: '9.2 / 10' }],
        desiredTitles: ['Staff Cloud Engineer'],
        expectedSalary: '₹40–55 LPA',
        privacy: { isDiscoverable: false, allowResumeDownload: true, hideContactInfo: false }
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.profile.headline, 'Lead Cloud Architect | AWS • Kubernetes');
    assert.strictEqual(data.profile.education[0].institution, 'COEP');
    assert.strictEqual(data.profile.privacy.isDiscoverable, false);
  });

  await asyncTest('Recruiter profile fetches activity metrics', async () => {
    const res = await fetch(`${BASE_URL}/api/profile/recruiter`, {
      headers: { 'Authorization': 'Bearer ' + newRecToken }
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.profile.activity);
    assert.strictEqual(typeof data.profile.activity.totalJobsPosted, 'number');
  });

  // 6. Settings Pages & Security Controls
  console.log('\n--- 6. Settings Page: Passwords, Notifications, Sessions ---');
  await asyncTest('Password change endpoint validates current password and updates hash', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + newCandToken },
      body: JSON.stringify({
        currentPassword: 'Password@123',
        newPassword: 'NewSecurePassword@456'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);

    // Verify login works with new password
    const testLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testCandidateEmail, password: 'NewSecurePassword@456', role: 'employee' })
    });
    assert.strictEqual(testLogin.status, 200);
  });

  await asyncTest('Settings GET and PUT update notification & privacy preferences', async () => {
    const putRes = await fetch(`${BASE_URL}/api/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + newCandToken },
      body: JSON.stringify({
        notifications: { applicationUpdates: true, weeklyJobMatches: false },
        privacy: { profileDiscoverable: true, allowResumeDownload: true }
      })
    });
    const putData = await putRes.json();
    assert.strictEqual(putRes.status, 200);
    assert.strictEqual(putData.settings.notifications.weeklyJobMatches, false);
    assert.strictEqual(putData.settings.privacy.profileDiscoverable, true);
  });

  await asyncTest('Active session listing returns verified workstation session', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/sessions`, {
      headers: { 'Authorization': 'Bearer ' + newCandToken }
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(data.sessions));
    assert.ok(data.sessions.length >= 1);
  });

  // 7. Google OAuth Integration & Documentation
  console.log('\n--- 7. Google OAuth 2.0 Integration & Documentation ---');
  await asyncTest('Google auth config endpoint returns OAuth 2.0 production requirements', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/google/config`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.provider, 'google');
    assert.ok(data.clientId);
    assert.ok(data.authorizedRedirectUri);
    assert.ok(data.instructions);
  });

  await asyncTest('Google sign-in preserves candidate role selection', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        credential: { email: 'verified.candidate@gmail.com', name: 'Google Verified Candidate' },
        role: 'employee'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.user.role, 'employee');
    assert.ok(data.token);
  });

  await asyncTest('Google sign-in preserves recruiter role selection', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        credential: { email: 'verified.recruiter@gmail.com', name: 'Google Verified Recruiter' },
        role: 'recruiter'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.user.role, 'recruiter');
    assert.ok(data.token);
  });

  console.log('\n======================================================================');
  console.log(`  VERIFICATION RESULTS: ${passed} PASSED, ${total - passed} FAILED (Total: ${total})`);
  console.log('======================================================================');
}

runTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
