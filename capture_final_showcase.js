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
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
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

async function run() {
  const candidateToken = await login('candidate@hireconnect.io', 'Candidate@123', 'employee');
  const recruiterToken = await login('recruiter@hireconnect.io', 'Recruiter@123', 'recruiter');

  const targets = [
    {
      url: `http://localhost:3000/profile/?auth_token=${candidateToken}&open_menu=1`,
      name: 'dropdown_candidate_open.png'
    },
    {
      url: `http://localhost:3000/profile/?auth_token=${recruiterToken}&open_menu=1`,
      name: 'dropdown_recruiter_open.png'
    },
    {
      url: `http://localhost:3000/profile/?open_menu=1`,
      name: 'dropdown_signedout_open.png'
    }
  ];

  for (const t of targets) {
    const dest = path.join(artifactDir, t.name);
    const cmd = `${edgeExe} --headless --disable-gpu --window-size=1440,900 --virtual-time-budget=2000 --screenshot="${dest}" "${t.url}"`;
    try {
      execSync(cmd, { stdio: 'pipe' });
      console.log(`Captured ${t.name} (${fs.statSync(dest).size} bytes)`);
    } catch (e) {
      console.error(`Failed ${t.name}:`, e.message);
    }
  }
}

run();
