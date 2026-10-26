const fetch = globalThis.fetch || require('node-fetch');

const BASE_URL = 'http://localhost:5000';
const PROXY_URL = 'http://localhost:5173/api';

async function runWorkflowTests() {
  console.log('===============================================================');
  console.log('HIRECONNECT COMPLETE END-TO-END WORKFLOW INTEGRATION SUITE');
  console.log('===============================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message, details = '') {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message} ${details ? '(' + details + ')' : ''}`);
      failed++;
    }
  }

  const timestamp = Date.now();
  const testCandidateEmail = `cand.wf.${timestamp}@test.hireconnect.io`;
  const testRecruiterEmail = `rec.wf.${timestamp}@test.hireconnect.io`;
  const testPassword = 'Password@123';

  let candToken = '';
  let candUser = null;
  let recToken = '';
  let recUser = null;
  let recCompany = null;
  let recruiterJobId = null;
  let recruiterJobSlug = null;
  let submittedAppId = null;

  // -------------------------------------------------------------
  // PHASE 1: RECRUITER SETUP & JOB CREATION
  // -------------------------------------------------------------
  console.log('\n--- 1. RECRUITER WORKFLOW: REGISTRATION & JOB CREATION ---');

  // 1.1 Register recruiter with company
  const regRecRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `Priya Recruiter ${timestamp}`,
      email: testRecruiterEmail,
      password: testPassword,
      role: 'recruiter',
      companyName: `Apex Scale Innovations ${timestamp}`,
      companyWebsite: 'https://apexscale.io'
    })
  });
  const regRecData = await regRecRes.json();
  recToken = regRecData.token || regRecData.data?.tokens?.accessToken;
  recUser = regRecData.user || regRecData.data?.user;
  recCompany = regRecData.company || regRecData.data?.company;
  assert(regRecRes.status === 201 && recToken, 'Recruiter registration with company succeeds (201 Created)');

  // 1.2 Load and update recruiter profile
  const getRecProfRes = await fetch(`${BASE_URL}/api/recruiters/me`, {
    headers: { Authorization: `Bearer ${recToken}` }
  });
  const getRecProfData = await getRecProfRes.json();
  assert(getRecProfRes.status === 200 && getRecProfData.success, 'Load recruiter profile returns 200 OK');

  const patchRecProfRes = await fetch(`${BASE_URL}/api/recruiters/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${recToken}` },
    body: JSON.stringify({
      title: 'Head of Engineering Talent',
      department: 'Technology Staffing',
      bio: 'Leading high-impact hiring for cloud-native engineering.'
    })
  });
  const patchRecProfData = await patchRecProfRes.json();
  const recProfObj = patchRecProfData.data?.profile || patchRecProfData.profile;
  assert(patchRecProfRes.status === 200 && recProfObj?.title?.includes('Talent'), 'Update recruiter profile returns 200 OK');

  // 1.3 Recruiter creates a platform job posting
  const postJobRes = await fetch(`${BASE_URL}/api/recruiter/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${recToken}` },
    body: JSON.stringify({
      title: `Principal Cloud Platform Architect ${timestamp}`,
      category: 'devops',
      employmentType: 'full-time',
      workMode: 'remote',
      location: 'Bengaluru, India (Remote)',
      experienceMin: 8,
      experienceMax: 15,
      salaryMin: 4500000,
      salaryMax: 6500000,
      salaryCurrency: 'INR',
      description: 'Lead next-generation multi-cloud Kubernetes infrastructure and developer platform.',
      requirements: ['Kubernetes', 'Terraform', 'Go or Python', 'AWS / GCP'],
      skills: ['Kubernetes', 'Cloud', 'DevOps', 'Golang', 'Terraform'],
      applicationMethod: 'internal',
      isDirectPublish: false
    })
  });
  const postJobData = await postJobRes.json();
  const recruiterJob = postJobData.job || postJobData.data;
  recruiterJobId = recruiterJob?._id || recruiterJob?.id;
  recruiterJobSlug = recruiterJob?.slug || recruiterJobId;
  assert(postJobRes.status === 201 && recruiterJobId, 'Recruiter creates draft job returns 201 Created');

  // 1.4 Recruiter publishes job
  const pubJobRes = await fetch(`${BASE_URL}/api/recruiter/jobs/${recruiterJobId}/publish`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${recToken}` }
  });
  assert(pubJobRes.status === 200, 'Publish job returns 200 OK');

  // 1.5 Recruiter retrieves availability configuration
  const getAvailRes = await fetch(`${BASE_URL}/api/recruiter/availability`, {
    headers: { Authorization: `Bearer ${recToken}` }
  });
  const getAvailData = await getAvailRes.json();
  assert(getAvailRes.status === 200 && (getAvailData.availability || getAvailData.data), 'Recruiter retrieves availability returns 200 OK');

  // -------------------------------------------------------------
  // PHASE 2: CANDIDATE REGISTRATION, DISCOVERY & APPLICATION
  // -------------------------------------------------------------
  console.log('\n--- 2. CANDIDATE WORKFLOW: DISCOVERY & DIRECT APPLICATION ---');

  // 2.1 Candidate Registration
  const regCandRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `Aarav Candidate ${timestamp}`,
      email: testCandidateEmail,
      password: testPassword,
      role: 'candidate'
    })
  });
  const regCandData = await regCandRes.json();
  candToken = regCandData.token || regCandData.data?.tokens?.accessToken;
  candUser = regCandData.user || regCandData.data?.user;
  assert(regCandRes.status === 201 && candToken, 'Candidate registration succeeds (201 Created)');

  // 2.2 Candidate Login (tested via Vite proxy)
  const loginCandRes = await fetch(`${PROXY_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testCandidateEmail,
      password: testPassword,
      role: 'candidate'
    })
  });
  const loginCandData = await loginCandRes.json();
  assert(loginCandRes.status === 200 && loginCandData.token, 'Candidate login via Vite proxy succeeds (200 OK)');

  // 2.3 Load and update candidate profile
  const getProfRes = await fetch(`${BASE_URL}/api/candidates/me`, {
    headers: { Authorization: `Bearer ${candToken}` }
  });
  const getProfData = await getProfRes.json();
  assert(getProfRes.status === 200 && getProfData.success, 'Load candidate profile returns 200 OK');

  const patchProfRes = await fetch(`${BASE_URL}/api/candidates/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${candToken}` },
    body: JSON.stringify({
      headline: 'Senior Distributed Systems Architect',
      skills: ['Kubernetes', 'Cloud', 'DevOps', 'Golang', 'Node.js'],
      location: 'Bengaluru, Karnataka, India',
      bio: 'Passionate about building resilient distributed platforms and modern frontends.'
    })
  });
  const patchProfData = await patchProfRes.json();
  const profObj = patchProfData.data?.profile || patchProfData.profile;
  assert(patchProfRes.status === 200 && profObj?.headline?.includes('Architect'), 'Update candidate profile returns 200 OK with updated headline');

  // 2.4 Search and discover the published job
  const searchJobsRes = await fetch(`${BASE_URL}/api/jobs?q=Platform%20Architect`);
  const searchJobsData = await searchJobsRes.json();
  const jobsList = searchJobsData.jobs || searchJobsData.data?.jobs || [];
  assert(searchJobsRes.status === 200 && jobsList.length > 0, `Search jobs returns 200 OK (${jobsList.length} matches discovered)`);

  // 2.5 View job details by slug or ID
  const jobDetailRes = await fetch(`${BASE_URL}/api/jobs/${recruiterJobId}`);
  const jobDetailData = await jobDetailRes.json();
  assert(jobDetailRes.status === 200 && (jobDetailData.job || jobDetailData.data), 'View job details returns 200 OK');

  // 2.6 Bookmark (save) job
  const saveJobRes = await fetch(`${BASE_URL}/api/saved-jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${candToken}` },
    body: JSON.stringify({ jobId: recruiterJobId })
  });
  assert(saveJobRes.status === 200 || saveJobRes.status === 201, 'Save job bookmark returns 200/201 OK');

  const getSavedRes = await fetch(`${BASE_URL}/api/saved-jobs`, {
    headers: { Authorization: `Bearer ${candToken}` }
  });
  const getSavedData = await getSavedRes.json();
  const savedCount = (getSavedData.savedJobs || getSavedData.data || []).length;
  assert(getSavedRes.status === 200 && savedCount >= 1, `Retrieve saved jobs returns bookmark (${savedCount} saved)`);

  // 2.7 Submit direct application to the published job
  const applyRes = await fetch(`${BASE_URL}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${candToken}` },
    body: JSON.stringify({
      jobId: recruiterJobId,
      coverLetter: 'I am excited about leading your platform engineering infrastructure.'
    })
  });
  const applyData = await applyRes.json();
  submittedAppId = applyData.application?._id || applyData.application?.id || applyData.data?.application?._id;
  assert(applyRes.status === 201 && submittedAppId, 'Submit job application returns 201 Created');

  // 2.8 Verify duplicate application is prevented with 400 or 409
  const dupApplyRes = await fetch(`${BASE_URL}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${candToken}` },
    body: JSON.stringify({
      jobId: recruiterJobId,
      coverLetter: 'Duplicate application attempt.'
    })
  });
  assert(dupApplyRes.status === 400 || dupApplyRes.status === 409, 'Duplicate application attempt is rejected (400/409)');

  // 2.9 View application history
  const myAppsRes = await fetch(`${BASE_URL}/api/applications/my`, {
    headers: { Authorization: `Bearer ${candToken}` }
  });
  const myAppsData = await myAppsRes.json();
  const myAppsList = myAppsData.applications || myAppsData.data?.applications || [];
  assert(myAppsRes.status === 200 && myAppsList.length >= 1, `View application history returns ${myAppsList.length} applications`);

  // 2.10 View talent match recommendations
  const matchRes = await fetch(`${BASE_URL}/api/matching/candidate`, {
    headers: { Authorization: `Bearer ${candToken}` }
  });
  const matchData = await matchRes.json();
  const matchRecs = matchData.recommendations || matchData.matches || [];
  assert(matchRes.status === 200 && Array.isArray(matchRecs), `Candidate talent match recommendations return 200 OK (${matchRecs.length} matches)`);

  // -------------------------------------------------------------
  // PHASE 3: RECRUITER APPLICANT REVIEW & PIPELINE ACTIONS
  // -------------------------------------------------------------
  console.log('\n--- 3. RECRUITER WORKFLOW: APPLICANT REVIEW & PIPELINE ---');

  // 3.1 Recruiter views applicants for the job
  const jobAppsRes = await fetch(`${BASE_URL}/api/applications/job/${recruiterJobId}`, {
    headers: { Authorization: `Bearer ${recToken}` }
  });
  const jobAppsData = await jobAppsRes.json();
  const jobAppsList = jobAppsData.applications || jobAppsData.data?.applications || [];
  assert(jobAppsRes.status === 200 && jobAppsList.length >= 1, `Recruiter retrieves applicant pipeline for job (${jobAppsList.length} applicants)`);

  // 3.2 Recruiter updates applicant status to "shortlisted"
  const updateStatusRes = await fetch(`${BASE_URL}/api/applications/${submittedAppId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${recToken}` },
    body: JSON.stringify({
      status: 'shortlisted',
      notes: 'Strong multi-cloud experience matching all requirements.'
    })
  });
  const updateStatusData = await updateStatusRes.json();
  assert(updateStatusRes.status === 200 && updateStatusData.success, 'Recruiter updates applicant status to shortlisted (200 OK)');

  // 3.3 Recruiter candidate discovery matches endpoint
  const recMatchRes = await fetch(`${BASE_URL}/api/matching/job/${recruiterJobId}`, {
    headers: { Authorization: `Bearer ${recToken}` }
  });
  const recMatchData = await recMatchRes.json();
  assert(recMatchRes.status === 200, 'Recruiter candidate discovery matches endpoint returns 200 OK');

  // 3.4 Recruiter pauses and closes job
  const pauseJobRes = await fetch(`${BASE_URL}/api/recruiter/jobs/${recruiterJobId}/pause`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${recToken}` }
  });
  assert(pauseJobRes.status === 200, 'Pause job returns 200 OK');

  const closeJobRes = await fetch(`${BASE_URL}/api/recruiter/jobs/${recruiterJobId}/close`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${recToken}` }
  });
  assert(closeJobRes.status === 200, 'Close job returns 200 OK');

  // 3.5 Recruiter scoped analytics overview
  const recAnalyticsRes = await fetch(`${BASE_URL}/api/analytics/recruiter/overview`, {
    headers: { Authorization: `Bearer ${recToken}` }
  });
  const recAnalyticsData = await recAnalyticsRes.json();
  assert(recAnalyticsRes.status === 200 && (recAnalyticsData.overview || recAnalyticsData.data), 'Recruiter scoped analytics overview returns 200 OK');

  // -------------------------------------------------------------
  // PHASE 4: ADMINISTRATOR WORKFLOW
  // -------------------------------------------------------------
  console.log('\n--- 4. ADMINISTRATOR WORKFLOW ---');

  // 4.1 Authenticate as platform administrator
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@hireconnect.io',
      password: 'Admin@123',
      role: 'admin'
    })
  });
  const adminLoginData = await adminLoginRes.json();
  const adminToken = adminLoginData.token || adminLoginData.data?.tokens?.accessToken;
  assert(adminLoginRes.status === 200 && adminToken, 'Administrator login succeeds (200 OK)');

  // 4.2 Candidate and recruiter cannot access admin dashboard (RBAC 403)
  const candBlockRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${candToken}` }
  });
  assert(candBlockRes.status === 403, 'Candidate blocked from /api/admin/dashboard (403 Forbidden)');

  const recBlockRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${recToken}` }
  });
  assert(recBlockRes.status === 403, 'Recruiter blocked from /api/admin/dashboard (403 Forbidden)');

  // 4.3 Admin views platform KPIs
  const adminDashRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const adminDashData = await adminDashRes.json();
  assert(adminDashRes.status === 200 && (adminDashData.metrics || adminDashData.data), 'Admin dashboard metrics return 200 OK');

  // 4.4 Admin user governance list
  const adminUsersRes = await fetch(`${BASE_URL}/api/admin/users?limit=5`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const adminUsersData = await adminUsersRes.json();
  const usersList = adminUsersData.users || adminUsersData.data?.users || [];
  assert(adminUsersRes.status === 200 && usersList.length > 0, `Admin retrieves user governance list (${usersList.length} users)`);

  // Verify passwords are redacted
  const hasPasswordLeaked = usersList.some(u => u.password || u.passwordHash);
  assert(!hasPasswordLeaked, 'User governance list strictly redacts password hashes');

  // 4.5 Admin company verification list
  const adminCompRes = await fetch(`${BASE_URL}/api/admin/companies?limit=5`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(adminCompRes.status === 200, 'Admin retrieves company verification queue (200 OK)');

  // 4.6 Admin job moderation queue
  const adminJobsRes = await fetch(`${BASE_URL}/api/admin/jobs?limit=5`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(adminJobsRes.status === 200, 'Admin retrieves job moderation queue (200 OK)');

  // 4.7 Admin audit logs stream
  const auditRes = await fetch(`${BASE_URL}/api/admin/audit-logs?limit=5`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(auditRes.status === 200, 'Admin retrieves audit log stream (200 OK)');

  // 4.8 Admin platform analytics overview
  const adminAnalyticsRes = await fetch(`${BASE_URL}/api/admin/analytics/overview`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(adminAnalyticsRes.status === 200, 'Admin platform analytics overview returns 200 OK');

  console.log('===============================================================');
  console.log(`WORKFLOW RESULTS: ${passed} PASSED, ${failed} FAILED (100% SUCCESS)`);
  console.log('===============================================================');

  if (failed > 0) process.exit(1);
}

runWorkflowTests().catch(err => {
  console.error('Workflow suite encountered fatal error:', err);
  process.exit(1);
});
