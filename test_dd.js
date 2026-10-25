const { execSync } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgeExe = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const artifactDir = 'C:\\Users\\sabari kumar\\.gemini\\antigravity\\brain\\4425d598-8dfa-4c28-bb42-dffc673d98be';

const data = JSON.stringify({ email: 'candidate@hireconnect.io', password: 'Candidate@123', role: 'employee' });
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
    const token = JSON.parse(body).token;
    const dest = path.join(artifactDir, 'test_dropdown_profile.png');
    const url = `http://localhost:3000/profile/?auth_token=${token}&open_menu=1`;
    const cmd = `${edgeExe} --headless --disable-gpu --window-size=1440,900 --virtual-time-budget=2000 --screenshot="${dest}" "${url}"`;
    execSync(cmd, { stdio: 'pipe' });
    console.log('Captured test_dropdown_profile.png, size:', fs.statSync(dest).size);
  });
});
req.write(data);
req.end();
