const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgeExe = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const artifactDir = path.join('C:', 'Users', 'sabari kumar', '.gemini', 'antigravity', 'brain', 'e1f6989c-b435-48a3-bb48-fc055f6d7357');

const dest = path.join(artifactDir, 'talent_match_navbar_check.png');
const cmd = `${edgeExe} --headless --disable-gpu --window-size=1440,900 --screenshot="${dest}" "http://localhost:3000/cases/"`;

try {
  execSync(cmd, { stdio: 'pipe' });
  console.log('Saved:', dest, fs.statSync(dest).size, 'bytes');
} catch (e) {
  console.error('Failed:', e.message);
}
