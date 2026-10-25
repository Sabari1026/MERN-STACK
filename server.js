const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { getJobs, getJobById } = require('./jobsData.js');
const authService = require('./authService.js');
const dbService = require('./dbService.js');
const backendApp = require('./backend/src/app.js');
const { verifyAccessToken } = require('./backend/src/utils/token.js');
const reminderService = require('./backend/src/services/reminder.service.js');
const { connectDatabase } = require('./backend/src/config/database.js');
const { env } = require('./backend/src/config/env.js');

function getAuthUser(req) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;

  try {
    const decoded = verifyAccessToken(token);
    return {
      userId: decoded.id,
      id: decoded.id,
      email: decoded.email,
      role: decoded.role === 'candidate' ? 'employee' : decoded.role
    };
  } catch (err) {
    return authService.getUserByToken(token);
  }
}

const PORT = 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Configuration harmonized with backend production policy
  const origin = req.headers.origin;
  const allowedOrigins = Array.isArray(env.FRONTEND_URL) ? env.FRONTEND_URL : [env.FRONTEND_URL];
  const isAllowedOrigin = !origin || allowedOrigins.includes(origin) || (env.NODE_ENV !== 'production' && (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)));

  if (origin && isAllowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  } else if (!origin && env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-Id, Accept');

  if (req.method === 'OPTIONS') {
    if (origin && !isAllowedOrigin && env.NODE_ENV === 'production') {
      res.writeHead(403);
      res.end(JSON.stringify({ success: false, message: 'Origin not permitted by CORS policy.' }));
      return;
    }
    res.writeHead(204);
    res.end();
    return;
  }

  const cleanPath = req.url.split('?')[0];

  // Auth, Profiles, Candidates, Recruiters, Companies, Admin, Jobs, Applications & Users Endpoints - Handled by Production Express Backend
  if (
    cleanPath.startsWith('/api/auth') ||
    cleanPath.startsWith('/api/health') ||
    cleanPath.startsWith('/api/candidates') ||
    cleanPath.startsWith('/api/candidate') ||
    cleanPath.startsWith('/api/recruiters') ||
    cleanPath.startsWith('/api/users') ||
    cleanPath.startsWith('/api/profiles') ||
    cleanPath.startsWith('/api/profile') ||
    cleanPath.startsWith('/api/companies') ||
    cleanPath.startsWith('/api/admin') ||
    cleanPath.startsWith('/api/jobs') ||
    cleanPath.startsWith('/api/recruiter') ||
    cleanPath.startsWith('/api/applications') ||
    cleanPath.startsWith('/api/saved-jobs') ||
    cleanPath.startsWith('/api/matching') ||
    cleanPath.startsWith('/api/talent-match') ||
    cleanPath.startsWith('/api/meetings') ||
    cleanPath.startsWith('/api/bookings') ||
    cleanPath.startsWith('/api/notifications') ||
    cleanPath.startsWith('/api/analytics') ||
    cleanPath === '/health'
  ) {
    return backendApp(req, res);
  }



  // ==================== USER SETTINGS API ====================
  if (cleanPath === '/api/settings') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      const user = getAuthUser(req);
      if (!user) {
        res.writeHead(401);
        res.end(JSON.stringify({ success: false, message: 'Authentication required' }));
        return;
      }

      if (req.method === 'GET') {
        const settings = dbService.getUserSettings(user.userId, user.role);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, settings }));
        return;
      }

      if (req.method === 'PUT') {
        const body = await readJsonBody(req);
        const settings = dbService.updateUserSettings(user.userId, body);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, settings }));
        return;
      }
    } catch (setErr) {
      res.writeHead(500);
      res.end(JSON.stringify({ success: false, message: setErr.message }));
      return;
    }
  }

  // ==================== CANDIDATE DISCOVERY API ====================
  if (cleanPath === '/api/candidates/discover' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      const user = getAuthUser(req);
      if (!user || user.role !== 'recruiter') {
        res.writeHead(403);
        res.end(JSON.stringify({ success: false, message: 'Forbidden: Only authenticated recruiters can access candidate discovery.' }));
        return;
      }

      const reqUrl = new URL(req.url, `http://localhost:${PORT}`);
      const options = {
        q: reqUrl.searchParams.get('q') || '',
        skills: reqUrl.searchParams.get('skills') || '',
        location: reqUrl.searchParams.get('location') || '',
        preferredMode: reqUrl.searchParams.get('preferredMode') || ''
      };

      const candidates = dbService.discoverCandidates(options, user.userId);
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, total: candidates.length, candidates }));
      return;
    } catch (discErr) {
      res.writeHead(500);
      res.end(JSON.stringify({ success: false, message: discErr.message }));
      return;
    }
  }

  if (cleanPath.startsWith('/api/candidates/') && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      const candId = cleanPath.slice('/api/candidates/'.length);
      const user = getAuthUser(req);
      const cand = dbService.getCandidateProfile(candId);
      if (!cand) {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, message: 'Candidate not found.' }));
        return;
      }

      // Principle A & Acceptance Test 1: Private candidate check
      const isSelf = user && (user.userId === cand.userId || user.userId === cand.id);
      const isDiscoverable = cand.privacy ? cand.privacy.isDiscoverable : false;
      if (!isDiscoverable && !isSelf) {
        res.writeHead(403);
        res.end(JSON.stringify({ success: false, message: 'Candidate profile is private.' }));
        return;
      }

      // If recruiter viewing discoverable candidate, mask contact if requested
      const hideContact = !isSelf && cand.privacy?.hideContactInfo;
      const sanitized = {
        ...cand,
        phone: hideContact ? 'Contact via Recruiter Request' : cand.phone,
        contactEmail: hideContact ? 'Contact via HireConnect Message' : cand.contactEmail
      };
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, candidate: sanitized }));
      return;
    } catch (candViewErr) {
      res.writeHead(500);
      res.end(JSON.stringify({ success: false, message: candViewErr.message }));
      return;
    }
  }

  // ==================== APPLICATIONS API ====================
  if (cleanPath === '/api/applications/apply' && req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      const user = getAuthUser(req);
      if (!user || user.role !== 'employee') {
        res.writeHead(401);
        res.end(JSON.stringify({ success: false, message: 'Candidate authentication required.' }));
        return;
      }
      const body = await readJsonBody(req);
      const app = dbService.applyToJob(body.jobId, user.userId, body);
      res.writeHead(201);
      res.end(JSON.stringify({ success: true, application: app }));
      return;
    } catch (appErr) {
      res.writeHead(400);
      res.end(JSON.stringify({ success: false, message: appErr.message }));
      return;
    }
  }

  if (cleanPath === '/api/applications/my' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      const user = getAuthUser(req);
      if (!user || user.role !== 'employee') {
        res.writeHead(401);
        res.end(JSON.stringify({ success: false, message: 'Candidate authentication required.' }));
        return;
      }
      const applications = dbService.getMyApplications(user.userId);
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, applications }));
      return;
    } catch (myAppErr) {
      res.writeHead(500);
      res.end(JSON.stringify({ success: false, message: myAppErr.message }));
      return;
    }
  }

  if (cleanPath.startsWith('/api/applications/job/') && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      const jobId = cleanPath.slice('/api/applications/job/'.length);
      const user = getAuthUser(req);
      if (!user || user.role !== 'recruiter') {
        res.writeHead(403);
        res.end(JSON.stringify({ success: false, message: 'Forbidden: Recruiter authentication required.' }));
        return;
      }
      const applications = dbService.getApplicationsForJob(jobId, user.userId);
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, applications }));
      return;
    } catch (jobAppErr) {
      const status = jobAppErr.status || 500;
      res.writeHead(status);
      res.end(JSON.stringify({ success: false, message: jobAppErr.message }));
      return;
    }
  }

  if (cleanPath.startsWith('/api/applications/') && cleanPath.endsWith('/status') && req.method === 'PUT') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      const appId = cleanPath.replace('/api/applications/', '').replace('/status', '');
      const user = getAuthUser(req);
      if (!user || user.role !== 'recruiter') {
        res.writeHead(403);
        res.end(JSON.stringify({ success: false, message: 'Forbidden: Recruiter authentication required.' }));
        return;
      }
      const body = await readJsonBody(req);
      const app = dbService.updateApplicationStatus(appId, body.status, user.userId);
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, application: app }));
      return;
    } catch (appStatusErr) {
      const status = appStatusErr.status || 500;
      res.writeHead(status);
      res.end(JSON.stringify({ success: false, message: appStatusErr.message }));
      return;
    }
  }

  // ==================== JOBS MANAGEMENT API ====================
  if (cleanPath === '/api/jobs/create' && req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      const user = getAuthUser(req);
      if (!user || user.role !== 'recruiter') {
        res.writeHead(403);
        res.end(JSON.stringify({ success: false, message: 'Forbidden: Only authenticated recruiters can publish jobs.' }));
        return;
      }
      const body = await readJsonBody(req);
      const newJob = dbService.createJob(body, user.userId);
      res.writeHead(201);
      res.end(JSON.stringify({ success: true, job: newJob }));
      return;
    } catch (jobCreateErr) {
      const status = jobCreateErr.status || 500;
      res.writeHead(status);
      res.end(JSON.stringify({ success: false, message: jobCreateErr.message }));
      return;
    }
  }

  if (cleanPath.startsWith('/api/jobs/') && cleanPath.endsWith('/status') && req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      const jobId = cleanPath.replace('/api/jobs/', '').replace('/status', '');
      const user = getAuthUser(req);
      if (!user || user.role !== 'recruiter') {
        res.writeHead(403);
        res.end(JSON.stringify({ success: false, message: 'Forbidden: Only authenticated recruiters can update job status.' }));
        return;
      }
      const body = await readJsonBody(req);
      const updatedJob = dbService.updateJobStatus(jobId, body.status, user.userId);
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, job: updatedJob }));
      return;
    } catch (jobStatErr) {
      const status = jobStatErr.status || 500;
      res.writeHead(status);
      res.end(JSON.stringify({ success: false, message: jobStatErr.message }));
      return;
    }
  }

  if (cleanPath.startsWith('/api/jobs/') && req.method === 'PUT') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      const jobId = cleanPath.slice('/api/jobs/'.length);
      const user = getAuthUser(req);
      if (!user || user.role !== 'recruiter') {
        res.writeHead(403);
        res.end(JSON.stringify({ success: false, message: 'Forbidden: Recruiter authentication required.' }));
        return;
      }
      const body = await readJsonBody(req);
      const updatedJob = dbService.updateJob(jobId, body, user.userId);
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, job: updatedJob }));
      return;
    } catch (jobPutErr) {
      const status = jobPutErr.status || 500;
      res.writeHead(status);
      res.end(JSON.stringify({ success: false, message: jobPutErr.message }));
      return;
    }
  }

  if (cleanPath === '/api/recruiter/jobs' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      const user = getAuthUser(req);
      if (!user || user.role !== 'recruiter') {
        res.writeHead(403);
        res.end(JSON.stringify({ success: false, message: 'Forbidden: Recruiter authentication required.' }));
        return;
      }
      const jobs = dbService.getRecruiterJobs(user.userId);
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, jobs }));
      return;
    } catch (recJobsErr) {
      const status = recJobsErr.status || 500;
      res.writeHead(status);
      res.end(JSON.stringify({ success: false, message: recJobsErr.message }));
      return;
    }
  }

  // ==================== PUBLIC JOBS SEARCH & DETAILS ====================
  if (cleanPath === '/api/jobs' || cleanPath.startsWith('/api/jobs/')) {
    try {
      if (cleanPath.startsWith('/api/jobs/') && cleanPath.length > '/api/jobs/'.length) {
        const id = cleanPath.slice('/api/jobs/'.length);
        const job = getJobById(id);
        if (!job) {
          res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, message: 'Job not found' }));
          return;
        }
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=60'
        });
        res.end(JSON.stringify({ success: true, job }));
        return;
      }

      // Query parameter parsing
      const reqUrl = new URL(req.url, `http://localhost:${PORT}`);
      const options = {
        q: reqUrl.searchParams.get('q') || reqUrl.searchParams.get('keyword') || '',
        location: reqUrl.searchParams.get('location') || '',
        workMode: reqUrl.searchParams.get('workMode') || 'all',
        experience: reqUrl.searchParams.get('experience') || 'all',
        category: reqUrl.searchParams.get('category') || 'all',
        employmentType: reqUrl.searchParams.get('employmentType') || 'all',
        sort: reqUrl.searchParams.get('sort') || 'newest',
        page: parseInt(reqUrl.searchParams.get('page'), 10) || 1,
        limit: parseInt(reqUrl.searchParams.get('limit'), 10) || 9
      };

      const result = getJobs(options);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=30'
      });
      res.end(JSON.stringify(result));
      return;
    } catch (apiErr) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, message: apiErr.message }));
      return;
    }
  }

  // ==================== TALENT MATCH API ENDPOINTS ====================
  if (cleanPath.startsWith('/api/talent-match/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    try {
      // 1. Candidate Job Matches
      if (cleanPath === '/api/talent-match/jobs' && req.method === 'GET') {
        const user = getAuthUser(req);
        if (!user) {
          res.writeHead(401);
          res.end(JSON.stringify({ success: false, message: 'Please sign in to access personalized Talent Match.' }));
          return;
        }
        if (user.role !== 'employee') {
          res.writeHead(403);
          res.end(JSON.stringify({ success: false, message: 'Forbidden: Candidate authentication required.' }));
          return;
        }

        const reqUrl = new URL(req.url, `http://${req.headers.host}`);
        const filters = {
          workMode: reqUrl.searchParams.get('workMode') || 'all',
          location: reqUrl.searchParams.get('location') || 'all',
          minScore: reqUrl.searchParams.get('minScore') || null,
          savedOnly: reqUrl.searchParams.get('savedOnly') === 'true'
        };

        const result = dbService.getJobMatchesForCandidate(user.userId, filters);
        res.writeHead(result.status || 200);
        res.end(JSON.stringify(result));
        return;
      }

      // 2. Recruiter Candidate Matches for a Job
      if (cleanPath === '/api/talent-match/candidates' && req.method === 'GET') {
        const user = getAuthUser(req);
        if (!user) {
          res.writeHead(401);
          res.end(JSON.stringify({ success: false, message: 'Please sign in to access Recruiter Talent Match.' }));
          return;
        }
        if (user.role !== 'recruiter') {
          res.writeHead(403);
          res.end(JSON.stringify({ success: false, message: 'Forbidden: Recruiter authentication required.' }));
          return;
        }

        const reqUrl = new URL(req.url, `http://${req.headers.host}`);
        const jobId = reqUrl.searchParams.get('jobId');
        if (!jobId) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Parameter jobId is required.' }));
          return;
        }

        const filters = {
          minScore: reqUrl.searchParams.get('minScore') || null,
          shortlistedOnly: reqUrl.searchParams.get('shortlistedOnly') === 'true'
        };

        const result = dbService.getCandidateMatchesForJob(jobId, user.userId, filters);
        res.writeHead(result.status || 200);
        res.end(JSON.stringify(result));
        return;
      }

      // 3. Save / Bookmark Job
      if (cleanPath === '/api/talent-match/save-job' && req.method === 'POST') {
        const user = getAuthUser(req);
        if (!user || user.role !== 'employee') {
          res.writeHead(401);
          res.end(JSON.stringify({ success: false, message: 'Please sign in as a Job Seeker to save jobs.' }));
          return;
        }
        const body = await readJsonBody(req);
        if (!body.jobId) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'jobId is required.' }));
          return;
        }
        const result = dbService.toggleSavedJob(user.userId, body.jobId);
        res.writeHead(200);
        res.end(JSON.stringify(result));
        return;
      }

      // 4. Get Saved Jobs
      if (cleanPath === '/api/talent-match/saved-jobs' && req.method === 'GET') {
        const user = getAuthUser(req);
        if (!user || user.role !== 'employee') {
          res.writeHead(401);
          res.end(JSON.stringify({ success: false, message: 'Please sign in to view saved jobs.' }));
          return;
        }
        const jobs = dbService.getSavedJobs(user.userId);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, jobs }));
        return;
      }

      // 5. Shortlist / Unshortlist Candidate
      if (cleanPath === '/api/talent-match/shortlist' && req.method === 'POST') {
        const user = getAuthUser(req);
        if (!user || user.role !== 'recruiter') {
          res.writeHead(401);
          res.end(JSON.stringify({ success: false, message: 'Please sign in as a Recruiter to shortlist candidates.' }));
          return;
        }
        const body = await readJsonBody(req);
        if (!body.candidateId || !body.jobId) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'candidateId and jobId are required.' }));
          return;
        }
        const result = dbService.toggleShortlistCandidate(user.userId, body.candidateId, body.jobId, body.notes);
        res.writeHead(200);
        res.end(JSON.stringify(result));
        return;
      }
    } catch (tmErr) {
      res.writeHead(500);
      res.end(JSON.stringify({ success: false, message: tmErr.message }));
      return;
    }
  }

  // ==================== MEETING BOOKING & CALENDAR ENDPOINTS ====================
  if (cleanPath.startsWith('/api/bookings')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    try {
      // 1. Get Available Slots for a given Date
      if (cleanPath === '/api/bookings/availability' && req.method === 'GET') {
        const reqUrl = new URL(req.url, `http://${req.headers.host}`);
        const date = reqUrl.searchParams.get('date');
        const timezone = reqUrl.searchParams.get('timezone') || 'Asia/Kolkata';
        const purpose = reqUrl.searchParams.get('purpose') || 'General HireConnect enquiry';

        const result = dbService.getAvailableSlots(date, timezone, purpose);
        res.writeHead(200);
        res.end(JSON.stringify(result));
        return;
      }

      // 2. Submit Meeting Booking
      if (cleanPath === '/api/bookings' && req.method === 'POST') {
        const body = await readJsonBody(req);
        const result = await dbService.createMeeting(body);
        res.writeHead(result.status || 200);
        res.end(JSON.stringify(result));
        return;
      }

      // 3. List Meetings (Admin / Recruiter or Attendee by email)
      if (cleanPath === '/api/bookings' && req.method === 'GET') {
        const reqUrl = new URL(req.url, `http://${req.headers.host}`);
        const user = getAuthUser(req);
        const email = reqUrl.searchParams.get('email');
        const status = reqUrl.searchParams.get('status');

        if (!user && !email) {
          res.writeHead(401);
          res.end(JSON.stringify({ success: false, message: 'Authentication or attendee email query is required.' }));
          return;
        }

        const filters = {};
        if (status) filters.status = status;
        if (email) filters.email = email;
        else if (user && user.role === 'employee') filters.email = user.email;

        const meetings = dbService.getMeetings(filters);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, meetings }));
        return;
      }

      // 4. Cancel Meeting
      if (cleanPath === '/api/bookings/cancel' && req.method === 'POST') {
        const body = await readJsonBody(req);
        if (!body.reference) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Booking reference is required.' }));
          return;
        }
        const result = dbService.cancelMeeting(body.reference, body.reason);
        res.writeHead(result.status || 200);
        res.end(JSON.stringify(result));
        return;
      }

      // 5. Reschedule Meeting
      if (cleanPath === '/api/bookings/reschedule' && req.method === 'POST') {
        const body = await readJsonBody(req);
        if (!body.reference || !body.newDate || !body.newSlot) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Booking reference, newDate, and newSlot are required.' }));
          return;
        }
        const result = dbService.rescheduleMeeting(body.reference, body.newDate, body.newSlot);
        res.writeHead(result.status || 200);
        res.end(JSON.stringify(result));
        return;
      }
    } catch (bookErr) {
      res.writeHead(500);
      res.end(JSON.stringify({ success: false, message: bookErr.message }));
      return;
    }
  }

  // Alias /talent-match and /talent-match/ directly to cases/index.html
  if (cleanPath === '/talent-match' || cleanPath === '/talent-match/' || (cleanPath.startsWith('/cases/') && cleanPath !== '/cases/')) {
    const talentMatchHtmlPath = path.join(ROOT_DIR, 'cases', 'index.html');
    fs.readFile(talentMatchHtmlPath, (readErr, data) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
    return;
  }

  let filePath = path.join(ROOT_DIR, decodeURIComponent(cleanPath));

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      if (!cleanPath.endsWith('/')) {
        res.writeHead(301, { Location: cleanPath + '/' });
        res.end();
        return;
      }
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, async () => {
  const url = `http://localhost:${PORT}`;
  console.log('='.repeat(60));
  console.log('  HireConnect Website Server Running (Node.js)');
  console.log(`  URL: ${url}`);
  console.log('  Press Ctrl+C to stop');
  console.log('='.repeat(60));

  if (env.MONGODB_URI) {
    try {
      await connectDatabase(env.MONGODB_URI);
      const User = require('./backend/src/models/user.model.js');
      await User.__seedDatabaseIfEmpty();
      const jobService = require('./backend/src/services/job.service.js');
      await jobService.seedJobsIfEmpty();
    } catch (err) {
      console.warn('MongoDB connection notice:', err.message);
    }
  }

  if (process.env.NODE_ENV !== 'test' && process.env.ENABLE_BACKGROUND_WORKER !== 'false') {
    reminderService.startScheduler();
  }
});

// Graceful shutdown handling
let isTerminating = false;
async function gracefulServerShutdown(signal) {
  if (isTerminating) return;
  isTerminating = true;
  console.log(`\n[Server] Received ${signal}. Closing gracefully...`);
  try {
    reminderService.stopScheduler();
    const { disconnectDatabase } = require('./backend/src/config/database');
    await disconnectDatabase();
    server.close(() => {
      console.log('[Server] HTTP server and database connections closed. Bye.');
      process.exit(0);
    });
  } catch (err) {
    process.exit(0);
  }
}

process.once('SIGINT', () => gracefulServerShutdown('SIGINT'));
process.once('SIGTERM', () => gracefulServerShutdown('SIGTERM'));
