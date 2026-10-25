const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgeExe = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const artifactDir = 'C:\\Users\\sabari kumar\\.gemini\\antigravity\\brain\\4425d598-8dfa-4c28-bb42-dffc673d98be';

async function main() {
  // 1. Get Candidate Token
  const candRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'candidate@hireconnect.io', password: 'Candidate@123', role: 'employee' })
  });
  const candToken = (await candRes.json()).token;

  // 2. Get Recruiter Token
  const recRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'recruiter@hireconnect.io', password: 'Recruiter@123', role: 'recruiter' })
  });
  const recToken = (await recRes.json()).token;

  console.log('Candidate token:', candToken ? 'OK' : 'FAIL');
  console.log('Recruiter token:', recToken ? 'OK' : 'FAIL');

  const captures = [
    // 1. Candidate Talent Match view
    {
      url: `http://localhost:3000/cases/?auth_token=${candToken}`,
      name: 'talent_match_candidate_view.png',
      width: 1440,
      height: 900
    },
    // 2. Recruiter Talent Match view
    {
      url: `http://localhost:3000/cases/?auth_token=${recToken}`,
      name: 'talent_match_recruiter_view.png',
      width: 1440,
      height: 900
    },
    // 3. Dropdown for Candidate (showing My Profile, Update Resume, My Applications, Saved Jobs, Talent Match, Settings, Sign Out)
    {
      url: `http://localhost:3000/profile/?auth_token=${candToken}&open_menu=1`,
      name: 'dropdown_candidate_talent_match.png',
      width: 1440,
      height: 900
    },
    // 4. Dropdown for Recruiter (showing My Profile, Recruiter Dashboard, Company Profile, Post a Job, Manage Jobs, Talent Match, Settings, Sign Out)
    {
      url: `http://localhost:3000/profile/?auth_token=${recToken}&open_menu=1`,
      name: 'dropdown_recruiter_talent_match.png',
      width: 1440,
      height: 900
    },
    // 5. Dropdown for Signed Out Visitor (showing Sign In, Create Account)
    {
      url: `http://localhost:3000/services/?open_menu=1`,
      name: 'dropdown_signedout_open.png',
      width: 1440,
      height: 900
    },
    // 6. Meeting Booking Modal with time slots and host card
    {
      url: `http://localhost:3000/cases/?auth_token=${candToken}&open_booking=1`,
      name: 'meeting_booking_modal.png',
      width: 1440,
      height: 900
    },
    // 7. Meeting Confirmed Modal with reference code and video link
    {
      url: `http://localhost:3000/cases/?auth_token=${candToken}&open_booking_confirmed=1`,
      name: 'meeting_confirmed_modal.png',
      width: 1440,
      height: 900
    }
  ];

  for (const c of captures) {
    const dest = path.join(artifactDir, c.name);
    try {
      const cmd = `${edgeExe} --headless --disable-gpu --virtual-time-budget=2000 --window-size=${c.width},${c.height} --screenshot="${dest}" "${c.url}"`;
      execSync(cmd, { stdio: 'pipe' });
      if (fs.existsSync(dest)) {
        console.log(`[SAVED] ${c.name} (${fs.statSync(dest).size} bytes)`);
      }
    } catch (err) {
      console.error(`[ERROR] ${c.name}:`, err.message);
    }
  }
}

main().catch(console.error);
