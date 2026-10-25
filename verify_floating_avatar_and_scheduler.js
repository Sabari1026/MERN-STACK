const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const edgeExe = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const artifactDir = 'C:\\Users\\sabari kumar\\.gemini\\antigravity\\brain\\4425d598-8dfa-4c28-bb42-dffc673d98be';
const tempProfileDir = path.join(os.tmpdir(), 'edge_verify_profile_' + Date.now());

async function main() {
  console.log('--- Step 1: Obtain Auth Tokens for Candidate & Recruiter ---');
  const candRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'candidate@hireconnect.io', password: 'Candidate@123', role: 'employee' })
  });
  const candToken = (await candRes.json()).token;

  const recRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'recruiter@hireconnect.io', password: 'Recruiter@123', role: 'recruiter' })
  });
  const recToken = (await recRes.json()).token;

  console.log('Candidate token:', candToken ? 'OK' : 'FAIL');
  console.log('Recruiter token:', recToken ? 'OK' : 'FAIL');

  const captures = [
    // 1. Desktop: Landing Page with Independent Floating Avatar and Clean Centered Navbar
    {
      url: `http://localhost:3000/`,
      name: 'floating_avatar_desktop.png',
      width: 1440,
      height: 900,
      budget: 2500
    },
    // 2. Mobile: Landing Page showing Independent Floating Avatar anchored at top right
    {
      url: `http://localhost:3000/`,
      name: 'floating_avatar_mobile.png',
      width: 390,
      height: 844,
      budget: 2500
    },
    // 3. Guest Floating Dropdown Menu
    {
      url: `http://localhost:3000/?open_menu=1`,
      name: 'dropdown_floating_guest.png',
      width: 1440,
      height: 900,
      budget: 2500
    },
    // 4. Candidate Floating Dropdown Menu
    {
      url: `http://localhost:3000/cases/?auth_token=${candToken}&open_menu=1`,
      name: 'dropdown_floating_candidate.png',
      width: 1440,
      height: 900,
      budget: 2500
    },
    // 5. Recruiter Floating Dropdown Menu
    {
      url: `http://localhost:3000/cases/?auth_token=${recToken}&open_menu=1`,
      name: 'dropdown_floating_recruiter.png',
      width: 1440,
      height: 900,
      budget: 2500
    },
    // 6. Premium Recruiter Meeting Scheduler - Calendar & Recruiter Profile View (Replicating Screenshot)
    {
      url: `http://localhost:3000/?open_booking=1`,
      name: 'meeting_scheduler_calendar_view.png',
      width: 1440,
      height: 950,
      budget: 3000
    },
    // 7. Meeting Scheduler - Slot Selected View with Summary Banner & Visitor Details Form
    {
      url: `http://localhost:3000/?open_booking_slot=1`,
      name: 'meeting_scheduler_slots_selected.png',
      width: 1440,
      height: 1050,
      budget: 3500
    },
    // 8. Meeting Scheduler - Confirmed View with Actions (Add to Calendar, Reschedule, Cancel, Close)
    {
      url: `http://localhost:3000/?open_booking_confirmed=1`,
      name: 'meeting_scheduler_confirmed_view.png',
      width: 1440,
      height: 950,
      budget: 3000
    }
  ];

  console.log('\n--- Step 2: Capturing Screenshots via Headless Edge ---');
  for (const c of captures) {
    const dest = path.join(artifactDir, c.name);
    try {
      const cmd = `${edgeExe} --headless --disable-gpu --no-first-run --no-default-browser-check --user-data-dir="${tempProfileDir}" --virtual-time-budget=${c.budget} --window-size=${c.width},${c.height} --screenshot="${dest}" "${c.url}"`;
      execSync(cmd, { stdio: 'pipe' });
      if (fs.existsSync(dest)) {
        console.log(`  [SAVED] ${c.name} (${fs.statSync(dest).size} bytes)`);
      }
    } catch (err) {
      console.error(`  [ERROR] ${c.name}:`, err.message);
    }
  }

  try {
    fs.rmSync(tempProfileDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('\n--- Step 3: Verification Completed ---');
}

main().catch(console.error);
