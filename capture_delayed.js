const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const edgeExe = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const artifactDir = 'C:\\Users\\sabari kumar\\.gemini\\antigravity\\brain\\4425d598-8dfa-4c28-bb42-dffc673d98be';

function login(email, password, role) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email, password, role });
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json.token);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function capture() {
  const token = await login('candidate@hireconnect.io', 'Candidate@123', 'employee');
  console.log('Obtained candidate token:', token);

  const targets = [
    { url: 'http://localhost:3000/signup/', name: 'signup_page_verified.png' },
    { url: `http://localhost:3000/profile/?auth_token=${token}`, name: 'profile_page_verified.png' },
    { url: `http://localhost:3000/settings/?auth_token=${token}`, name: 'settings_page_verified.png' }
  ];

  for (const t of targets) {
    const dest = path.join(artifactDir, t.name);
    const cmd = `${edgeExe} --headless --disable-gpu --window-size=1440,900 --virtual-time-budget=3000 --screenshot="${dest}" "${t.url}"`;
    try {
      execSync(cmd, { stdio: 'pipe' });
      console.log(`Captured ${t.name} (${fs.statSync(dest).size} bytes)`);
    } catch (e) {
      console.error(`Failed ${t.name}:`, e.message);
    }
  }
}

capture();
