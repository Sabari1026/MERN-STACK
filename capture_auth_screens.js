const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgeExe = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const artifactDir = 'C:\\Users\\sabari kumar\\.gemini\\antigravity\\brain\\4425d598-8dfa-4c28-bb42-dffc673d98be';

async function captureAuthenticated() {
  // 1. Login as candidate to get token
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'candidate@hireconnect.io', password: 'Candidate@123', role: 'employee' })
  });
  const data = await res.json();
  const token = data.token;
  console.log('Obtained test token:', token);

  // URLs to capture with token in query param (?auth_token=...)
  const captures = [
    { url: `http://localhost:3000/profile/?auth_token=${token}`, name: 'profile_page_candidate.png' },
    { url: `http://localhost:3000/settings/?auth_token=${token}`, name: 'settings_page_verified.png' },
    { url: `http://localhost:3000/?auth_token=${token}`, name: 'avatar_nav_signedin.png' }
  ];

  for (const c of captures) {
    const dest = path.join(artifactDir, c.name);
    try {
      const cmd = `${edgeExe} --headless --disable-gpu --window-size=1440,900 --screenshot="${dest}" "${c.url}"`;
      execSync(cmd, { stdio: 'pipe' });
      console.log(`Captured ${c.name} (${fs.statSync(dest).size} bytes)`);
    } catch (e) {
      console.error(`Failed ${c.name}:`, e.message);
    }
  }
}

captureAuthenticated();
