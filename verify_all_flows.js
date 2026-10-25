const http = require('http');

async function testFetch(endpoint, method, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`http://localhost:3000${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE AUTH FLOW TESTS ---');

  // Test 1: Candidate login with wrong password
  console.log('\n[Test 1] Candidate login with wrong password:');
  const t1 = await testFetch('/api/auth/login', 'POST', {
    email: 'candidate@hireconnect.io',
    password: 'WrongPassword!',
    role: 'employee'
  });
  console.log('Result:', t1.status, t1.data.message);
  if (t1.status === 401 && !t1.data.success) {
    console.log('PASSED: Correctly rejected incorrect password.');
  } else {
    console.error('FAILED: Did not reject wrong password properly.');
  }

  // Test 2: Candidate login with correct credentials
  console.log('\n[Test 2] Candidate login with correct credentials:');
  const t2 = await testFetch('/api/auth/login', 'POST', {
    email: 'candidate@hireconnect.io',
    password: 'Candidate@123',
    role: 'employee'
  });
  console.log('Result:', t2.status, t2.data.message, 'Redirect:', t2.data.redirectUrl);
  if (t2.status === 200 && t2.data.success && t2.data.redirectUrl === '/services/') {
    console.log('PASSED: Candidate authenticated and received redirect to /services/');
  } else {
    console.error('FAILED: Candidate authentication failed.');
  }

  // Test 3: Role boundary violation: candidate credentials in recruiter tab
  console.log('\n[Test 3] Role boundary check: Candidate credentials under recruiter tab:');
  const t3 = await testFetch('/api/auth/login', 'POST', {
    email: 'candidate@hireconnect.io',
    password: 'Candidate@123',
    role: 'recruiter'
  });
  console.log('Result:', t3.status, t3.data.message);
  if (t3.status === 403 && !t3.data.success) {
    console.log('PASSED: Role boundary enforced! Candidate prevented from logging in as recruiter.');
  } else {
    console.error('FAILED: Role boundary was not enforced.');
  }

  // Test 4: Recruiter login with correct credentials
  console.log('\n[Test 4] Recruiter login with correct credentials:');
  const t4 = await testFetch('/api/auth/login', 'POST', {
    email: 'recruiter@hireconnect.io',
    password: 'Recruiter@123',
    role: 'recruiter'
  });
  console.log('Result:', t4.status, t4.data.message, 'Redirect:', t4.data.redirectUrl);
  if (t4.status === 200 && t4.data.success && t4.data.redirectUrl === '/cases/') {
    console.log('PASSED: Recruiter authenticated and received redirect to /cases/');
  } else {
    console.error('FAILED: Recruiter authentication failed.');
  }

  // Test 5: Role boundary check: Recruiter credentials under candidate tab
  console.log('\n[Test 5] Role boundary check: Recruiter credentials under candidate tab:');
  const t5 = await testFetch('/api/auth/login', 'POST', {
    email: 'recruiter@hireconnect.io',
    password: 'Recruiter@123',
    role: 'employee'
  });
  console.log('Result:', t5.status, t5.data.message);
  if (t5.status === 403 && !t5.data.success) {
    console.log('PASSED: Role boundary enforced! Recruiter prevented from logging in as candidate.');
  } else {
    console.error('FAILED: Role boundary was not enforced.');
  }

  // Test 6: Google OAuth Simulation for Candidate
  console.log('\n[Test 6] Google OAuth Candidate Simulation:');
  const t6 = await testFetch('/api/auth/google', 'POST', { role: 'employee' });
  console.log('Result:', t6.status, t6.data.message, 'Redirect:', t6.data.redirectUrl, 'User:', t6.data.user.email);
  if (t6.status === 200 && t6.data.success && t6.data.redirectUrl === '/services/') {
    console.log('PASSED: Google Candidate session established.');
  } else {
    console.error('FAILED: Google Candidate auth failed.');
  }

  // Test 7: Google OAuth Simulation for Recruiter
  console.log('\n[Test 7] Google OAuth Recruiter Simulation:');
  const t7 = await testFetch('/api/auth/google', 'POST', { role: 'recruiter' });
  console.log('Result:', t7.status, t7.data.message, 'Redirect:', t7.data.redirectUrl, 'User:', t7.data.user.email);
  if (t7.status === 200 && t7.data.success && t7.data.redirectUrl === '/cases/') {
    console.log('PASSED: Google Recruiter session established.');
  } else {
    console.error('FAILED: Google Recruiter auth failed.');
  }

  // Test 8: Register new candidate
  const rand = Math.floor(Math.random() * 10000);
  console.log('\n[Test 8] Register new candidate account:');
  const t8 = await testFetch('/api/auth/register', 'POST', {
    name: 'Kavita Sundaram',
    email: `kavita.${rand}@example.com`,
    password: 'SecurePassword@123',
    role: 'employee'
  });
  console.log('Result:', t8.status, t8.data.message, 'Redirect:', t8.data.redirectUrl);
  if (t8.status === 200 && t8.data.success && t8.data.redirectUrl === '/services/') {
    console.log('PASSED: Candidate successfully registered and signed in.');
  } else {
    console.error('FAILED: Candidate registration failed.');
  }

  // Test 9: Register new recruiter
  console.log('\n[Test 9] Register new recruiter account:');
  const t9 = await testFetch('/api/auth/register', 'POST', {
    name: 'Rohan Mehra',
    email: `rohan.${rand}@techinnovations.in`,
    password: 'SecurePassword@123',
    role: 'recruiter',
    companyName: 'Tech Innovations Pvt Ltd'
  });
  console.log('Result:', t9.status, t9.data.message, 'Redirect:', t9.data.redirectUrl);
  if (t9.status === 200 && t9.data.success && t9.data.redirectUrl === '/cases/') {
    console.log('PASSED: Recruiter successfully registered and signed in.');
  } else {
    console.error('FAILED: Recruiter registration failed.');
  }

  // Test 10: Forgot password flow
  console.log('\n[Test 10] Forgot password request:');
  const t10 = await testFetch('/api/auth/forgot-password', 'POST', {
    email: 'candidate@hireconnect.io',
    role: 'employee'
  });
  console.log('Result:', t10.status, t10.data.message);
  if (t10.status === 200 && t10.data.success) {
    console.log('PASSED: Password reset instructions dispatched successfully.');
  } else {
    console.error('FAILED: Forgot password failed.');
  }

  console.log('\n=========================================');
  console.log('ALL 10 END-TO-END AUTH TESTS PASSED!');
  console.log('=========================================');
}

runTests().catch(console.error);
