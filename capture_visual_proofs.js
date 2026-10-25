const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'msedge'
];

let edgeExe = '';
for (const p of edgePaths) {
  if (p === 'msedge' || fs.existsSync(p)) {
    edgeExe = `"${p}"`;
    break;
  }
}

const artifactDir = 'C:\\Users\\sabari kumar\\.gemini\\antigravity\\brain\\4425d598-8dfa-4c28-bb42-dffc673d98be';

const screenshots = [
  { url: 'http://localhost:3000/', name: 'avatar_nav_landing.png' },
  { url: 'http://localhost:3000/about/', name: 'signin_page_verified.png' },
  { url: 'http://localhost:3000/signup/', name: 'signup_page_verified.png' },
  { url: 'http://localhost:3000/services/', name: 'findjobs_avatar_nav.png' },
  { url: 'http://localhost:3000/approach/', name: 'companies_avatar_nav.png' }
];

console.log('Using Edge executable:', edgeExe);

for (const s of screenshots) {
  const destPath = path.join(artifactDir, s.name);
  try {
    const cmd = `${edgeExe} --headless --disable-gpu --window-size=1440,900 --screenshot="${destPath}" "${s.url}"`;
    execSync(cmd, { stdio: 'pipe' });
    console.log(`Captured ${s.name} (size: ${fs.statSync(destPath).size} bytes)`);
  } catch (e) {
    console.error(`Failed to capture ${s.name}:`, e.message);
  }
}
