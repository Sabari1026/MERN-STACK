# HireConnect — Backend Architecture, Authentication, Profiles, Company Management, Jobs, Applications, Talent Match, Scheduling, Notifications, Admin & Analytics (Phases 1–11)

Production-ready MERN backend foundation, authentication & authorization system, candidate & recruiter profile management, corporate organization management with authoritative verification workflows, database-backed job management & Find Jobs search engine, complete application tracking & bookmarking system, explainable 6-factor Talent Match recommendation engine, real-time interview booking and scheduling engine, multi-channel transactional notifications & email outbox dispatcher, centralized administrative command center, and comprehensive real-time analytics & reporting for the **HireConnect** platform. Built with Express.js, MongoDB/Mongoose, Helmet security headers, CORS protection, Zod schema validation, bcrypt password hashing, JWT access tokens, HttpOnly refresh cookies with rotation, rate limiting, binary magic-byte verification, private local file storage, authoritative multi-faceted job search indexing, immutable resume/candidate snapshots, status audit trails, deterministic heuristic scoring, append-only administrative audit logging, spreadsheet formula injection neutralization, and strict RBAC authorization.

---

## 1. Required Software & Prerequisites

- **Node.js**: `v18.0.0` or higher (verified on Node `v24.14.1`).
- **npm**: `v9.0.0` or higher (verified on npm `11.11.0`).
- **MongoDB**:
  - **Local installation**: MongoDB Community Server 6.0+ listening on `mongodb://127.0.0.1:27017`
  - **Hosted cluster**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) M0+ free cluster (`mongodb+srv://...`)
  - **Zero-Dependency In-Memory Fallback**: When MongoDB is disconnected in local development or test suites, the models automatically activate an in-memory document adapter with real bcrypt password hashing, token generation, profile CRUD operations, and company verification workflows.

---

## 2. Architecture & Directory Structure

The backend follows a modular, domain-driven structure allowing profiles, companies, jobs, applications, Talent Match, and meeting bookings to be added without restructuring:

```
backend/
├── src/
│   ├── config/
│   │   ├── env.js                         # Zod-validated environment config with credential redactor
│   │   └── database.js                    # Mongoose connection manager, lifecycle events & state inspection
│   ├── controllers/
│   │   ├── admin.controller.js            # Platform dashboard metrics, user governance, moderation & audit
│   │   ├── adminCompany.controller.js     # Admin verification queue, review decisions & audit logging
│   │   ├── analytics.controller.js        # Analytics overview, recruitment funnels, and CSV reports
│   │   ├── application.controller.js      # Candidate applications, withdrawal, recruiter review & notes
│   │   ├── auth.controller.js             # Register, Login, Refresh, Logout, Password Recovery, Settings
│   │   ├── candidate.controller.js        # Candidate profile GET, PATCH, resume upload/replace/delete/download
│   │   ├── company.controller.js          # Company registration, public discovery, PATCH, logos, members
│   │   ├── health.controller.js           # Handlers for /health, /health/live, /health/ready
│   │   ├── job.controller.js              # Public job discovery & search with multi-faceted filtering
│   │   ├── matching.controller.js         # Candidate job recommendations, recruiter matching, save & shortlist
│   │   ├── recruiter.controller.js        # Recruiter profile GET, PATCH, team & company linking
│   │   ├── recruiterJob.controller.js     # Recruiter job CRUD, lifecycle publishing & closure
│   │   ├── savedJob.controller.js         # Candidate job bookmarking, listing, unsaving & checks
│   │   └── user.controller.js             # Avatar upload, deletion, and public image streaming
│   ├── middleware/
│   │   ├── auth.js                        # JWT session verification (authenticate) & role check (requireRole)
│   │   ├── companyAuth.middleware.js      # requireCompanyMembership & requireVerifiedCompanyForPublishing
│   │   ├── errorHandler.js                # Centralized error handler, sanitizing production leaks
│   │   ├── notFound.js                    # Consistent 404 handler for unknown routes
│   │   ├── requestLogger.js               # Structured request logger with UUID correlation IDs
│   │   └── upload.middleware.js           # Multer memory storage with file size & field limits
│   ├── models/
│   │   ├── adminAuditLog.model.js         # Append-only immutable administrative audit log schema
│   │   ├── application.model.js           # Mongoose Application schema with compound uniqueness & snapshots
│   │   ├── candidateProfile.model.js      # Candidate profile schema with completeness scoring
│   │   ├── company.model.js               # Company schema with safe slug generation & verified state
│   │   ├── companyAudit.model.js          # Immutable audit log for corporate & membership lifecycle events
│   │   ├── companyInvitation.model.js     # Expiring single-use hashed membership invitations
│   │   ├── companyMembership.model.js     # Recruiter-company membership with role permissions
│   │   ├── companyVerification.model.js   # Corporate verification submissions & evidence review states
│   │   ├── job.model.js                   # Mongoose Job schema with lifecycle states & in-memory fallback
│   │   ├── recruiterProfile.model.js      # Recruiter profile schema with company linking & metrics
│   │   ├── resumeAsset.model.js           # Secure resume metadata & version tracking
│   │   ├── savedJob.model.js              # Mongoose SavedJob schema with candidate bookmark uniqueness
│   │   └── user.model.js                  # Mongoose User model with bcrypt hashing & safe serialization
│   ├── routes/
│   │   ├── admin.routes.js                # Privileged platform administration & governance endpoints
│   │   ├── adminCompany.routes.js         # Protected admin verification review endpoints
│   │   ├── analytics.routes.js            # Platform, recruiter, company, and candidate analytics routes
│   │   ├── application.routes.js          # Candidate apply, history, withdraw & recruiter applicants/notes
│   │   ├── auth.routes.js                 # Authentication & authorization route definitions + rate limiting
│   │   ├── candidate.routes.js            # Candidate profile, discovery & resume management endpoints
│   │   ├── company.routes.js              # Public discovery, company creation, PATCH, logos, members
│   │   ├── health.routes.js               # Health probe declarations
│   │   ├── index.js                       # Central router mounting all /api modules
│   │   ├── job.routes.js                  # Public job discovery, candidate apply/save & legacy routes
│   │   ├── matching.routes.js             # Talent match endpoints (/jobs, /candidates, /save-job, /shortlist)
│   │   ├── profile.routes.js              # Public profile endpoints and legacy frontend aliases
│   │   ├── recruiter.routes.js            # Recruiter profile management endpoints
│   │   ├── recruiterJob.routes.js         # Recruiter job management & applicant listing routes
│   │   ├── savedJob.routes.js             # Candidate saved jobs bookmarking & listing endpoints
│   │   └── user.routes.js                 # Avatar upload, delete, and streaming routes
│   ├── services/
│   │   ├── analytics.service.js           # Platform, recruiter, company, and candidate analytics & CSV export
│   │   ├── application.service.js         # Application workflow, status transitions, snapshots & checks
│   │   ├── candidate.service.js           # Candidate profile business logic & completeness scoring
│   │   ├── company.service.js             # Company creation, search, verification, logo & membership logic
│   │   ├── job.service.js                 # Job discovery, filters, recruiter CRUD, lifecycle & seeder
│   │   ├── matching.service.js            # 6-factor deterministic heuristic matching algorithm & scoring
│   │   ├── recruiter.service.js           # Recruiter profile business logic & company lookup
│   │   ├── savedJob.service.js            # Saved jobs bookmarking, uniqueness & active listing availability
│   │   └── storage.service.js             # Local secure filesystem storage with UUID keys & streaming
│   ├── utils/
│   │   ├── ApiError.js                    # Standardized HTTP error class
│   │   ├── ApiResponse.js                 # Standardized JSON response helper
│   │   ├── asyncHandler.js                # Async controller wrapper catching rejections
│   │   ├── fileValidation.js              # Magic byte binary inspection & filename sanitization
│   │   ├── logger.js                      # Structured logger with credential redaction
│   │   └── token.js                       # JWT signing, refresh token rotation, cookie management
│   ├── validators/
│   │   ├── application.validator.js       # Zod schemas for application submission, status, and notes
│   │   ├── auth.validator.js              # Zod schemas for registration, login, and passwords
│   │   ├── candidate.validator.js         # Zod schemas for candidate profile updates & URLs
│   │   ├── company.validator.js           # Zod schemas for company creation, update, review & invites
│   │   ├── job.validator.js               # Zod schemas for job creation, update, query & URL safety
│   │   ├── matching.validator.js          # Zod schemas for candidate recommendations & recruiter matching
│   │   └── recruiter.validator.js         # Zod schemas for recruiter profile updates
│   ├── app.js                             # Express application pipeline with Helmet, CORS, CookieParser
│   └── server.js                          # Server entrypoint with graceful shutdown handlers
├── tests/
│   ├── applications.test.js               # Complete 34-test suite for Phase 6 applications & saved jobs
│   ├── auth.test.js                       # Complete 27-test suite for authentication & authorization
│   ├── company.test.js                    # Complete 27-test suite for Phase 4 company & verification features
│   ├── database.test.js                   # Database state & failure tests
│   ├── env.test.js                        # Environment validation & redaction tests
│   ├── health.test.js                     # Health, liveness, and readiness probe tests
│   ├── jobs.test.js                       # Complete 27-test suite for Phase 5 job management & search
│   ├── matching.test.js                   # Complete 27-test suite for Phase 7 Talent Match engine
│   ├── middleware.test.js                 # 404, malformed JSON, CORS, and error sanitization tests
│   └── profile.test.js                    # Complete 27-test suite for Phase 3 profile & storage features
├── uploads/                               # Default local private storage directory (outside web root)
│   ├── avatars/                           # Sanitized avatar & company logo images stored by UUID
│   └── resumes/                           # Sanitized resume files stored by UUID
├── .env.example                           # Example backend environment configuration
├── .gitignore                             # Ignored files (node_modules, .env, coverage, uploads)
├── package.json                           # Dependencies & npm scripts
├── vitest.config.mjs                      # Vitest runner configuration
└── README.md                              # Backend documentation
```

---

## 3. Environment Configuration

Copy `.env.example` to `.env` in the `backend/` directory:

```powershell
Copy-Item backend\.env.example backend\.env
```

### Environment Variables

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | No | `5000` | Port for the Express HTTP server |
| `NODE_ENV` | No | `development` | Environment (`development`, `production`, `test`) |
| `MONGODB_URI` | Yes in Prod | `mongodb://127.0.0.1:27017/hireconnect` | MongoDB connection string |
| `FRONTEND_URL` | No | `http://localhost:5173,http://localhost:3000` | Allowed origins for CORS (comma-separated) |
| `JWT_SECRET` | No (Dev Default) | `hireconnect-dev-super-secure-jwt-...` | Secret key for signing JWT access tokens (32+ chars in prod) |
| `JWT_EXPIRES_IN` | No | `15m` | Lifetime of access tokens |
| `REFRESH_TOKEN_EXPIRES_IN` | No | `7d` | Lifetime of refresh token sessions |
| `COOKIE_SECRET` | No (Dev Default) | `hireconnect-dev-cookie-secret-...` | Secret for signed cookies |
| `UPLOAD_DIR` | No | `./uploads` | Base local storage directory (outside web root) |
| `STORAGE_PROVIDER` | No | `local` | Storage provider (`local`) |
| `GOOGLE_CLIENT_ID` | Optional | `""` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Optional | `""` | Google OAuth Client Secret |

---

## 4. Account Roles and Permissions

HireConnect enforces three account roles:
1. **Candidate (`candidate`)**:
   - Register and sign in via Job Seeker tab.
   - Access candidate dashboards, profile, resume, and application tracking.
   - Strictly forbidden from accessing recruiter management, company creation, or administrative operations.
2. **Recruiter (`recruiter`)**:
   - Register and sign in via Recruiter / Employer tab.
   - Register companies, submit verification evidence, manage company profile and invite team members.
   - Post and manage job openings for authorized verified companies.
3. **Administrator (`admin`)**:
   - Platform governance and system auditing.
   - Review corporate verification requests (approve, reject, suspend).
   - Admin accounts can only be provisioned through server-side CLI scripting or an explicitly authorized administrative operation.

---

## 5. Company Membership Roles & Permissions

Company membership is decoupled from platform roles. Recruiters belong to organizations through authoritative `CompanyMembership` records:

| Company Role | Edit Profile | Manage Logo | Submit Verification | Invite Members | Change Roles | Remove Sole Owner |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`owner`** | Yes | Yes | Yes | Yes | Yes | **Blocked** |
| **`admin`** | Yes | Yes | Yes | Yes | No | **Blocked** |
| **`recruiter`** | No | No | No | No | No | **Blocked** |
| **`hiring_manager`** | No | No | No | No | No | **Blocked** |

### Sole Owner Protection Rule
The system strictly prevents removing or demoting the last `owner` of an organization. Ownership must be transferred or another member promoted to owner prior to departure.

---

## 6. Verification Statuses & State Transitions

Verification badges reflect authentic administrative decisions. Unverified companies are never marked verified automatically.

```
       [Registration]
             │
             ▼
         [pending] ◄───────────────────┐
             │                         │
             ▼                         │
      [under_review] (Verification)    │
       ├───► [verified]                │
       │         │ (Suspension)        │
       │         ▼                     │
       │    [suspended] ───────────────┘
       │
       └───► [rejected] ───────────────┘
```

- Allowed Transitions:
  - `pending` $\to$ `under_review`, `verified`, `rejected`
  - `under_review` $\to$ `verified`, `rejected`
  - `verified` $\to$ `suspended`
  - `suspended` $\to$ `under_review`, `verified`
  - `rejected` $\to$ `under_review`, `pending`

---

## 7. API Endpoints Specification

### Company Discovery & Management (`/api/companies`)

| Method | Endpoint | Auth Required | Permissions | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/companies` | No | Public | Search & list companies (`q`, `industry`, `location`, `verified`, pagination) |
| `GET` | `/api/companies/:slugOrId` | No | Public | View public company details (excludes private contact/notes) |
| `GET` | `/api/companies/logo/:key` | No | Public | Stream company logo with caching headers |
| `POST` | `/api/companies` | Yes | `recruiter`, `admin` | Register company (creates initial membership as `owner`, status `pending`) |
| `POST` | `/api/companies/register`| Yes | `recruiter`, `admin` | Alias for frontend company registration |
| `PATCH`| `/api/companies/:id` | Yes | `owner`, `admin` | Update permitted profile fields (protected fields strictly blocked) |
| `GET` | `/api/companies/:id/manage`| Yes | `owner`, `admin` | View internal management data and membership roster |
| `POST` | `/api/companies/:id/verification-request` | Yes | `owner`, `admin` | Submit corporate verification evidence |
| `POST` | `/api/companies/:id/logo` | Yes | `owner`, `admin` | Upload company logo (JPEG/PNG/WebP $\le$ 5MB) |
| `DELETE`| `/api/companies/:id/logo`| Yes | `owner`, `admin` | Remove company logo |
| `GET` | `/api/companies/:id/members`| Yes | `owner`, `admin`, `recruiter` | List active company members |
| `POST` | `/api/companies/:id/invitations` | Yes | `owner`, `admin` | Generate expiring single-use member invitation token |
| `POST` | `/api/companies/invitations/accept` | Yes | Authenticated | Accept invitation token and receive active membership |
| `PATCH`| `/api/companies/:id/members/:userId` | Yes | `owner` | Update member role (protects sole owner) |
| `DELETE`| `/api/companies/:id/members/:userId`| Yes | `owner`, `admin` | Remove member (protects sole owner) |

### Administrative Verification Queue (`/api/admin/company-verification-requests`)

| Method | Endpoint | Auth Required | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/admin/company-verification-requests` | Yes | `admin` | List pending and under-review verification requests |
| `GET` | `/api/admin/company-verification-requests/:id`| Yes | `admin` | Inspect verification submission details & evidence |
| `PATCH`| `/api/admin/company-verification-requests/:id`| Yes | `admin` | Approve, reject, or suspend company verification |

### Public Job Discovery (`/api/jobs`)

| Method | Endpoint | Auth Required | Permissions | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/jobs` | No | Public | Search verified jobs (`q`, `location`, `workMode`, `employmentType`, `category`, `experience`, `salaryMin`, `salaryMax`, `sort`, `page`, `limit`) |
| `GET` | `/api/jobs/:idOrSlug` | Optional | Public / Recruiter | View job details with populated authoritative company details (drafts hidden unless owning recruiter or admin) |
| `POST` | `/api/jobs/create` | Yes | `recruiter`, `admin` | Legacy frontend compatibility alias for job creation |
| `POST` | `/api/jobs/:id/status`| Yes | `recruiter`, `admin` | Legacy frontend compatibility alias to publish, pause, or close job |
| `PUT` | `/api/jobs/:id` | Yes | `recruiter`, `admin` | Legacy frontend compatibility alias for updating job details |

### Recruiter Job Management (`/api/recruiter/jobs`)

| Method | Endpoint | Auth Required | Permissions | Description |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/api/recruiter/jobs` | Yes | `recruiter`, `admin` | Create job listing (defaults to `draft`; publishing requires verified company) |
| `GET` | `/api/recruiter/jobs` | Yes | `recruiter`, `admin` | List organization jobs across all statuses (`draft`, `published`, `paused`, `closed`) |
| `GET` | `/api/recruiter/jobs/:id` | Yes | `recruiter`, `admin` | Retrieve job details for editing |
| `PATCH`| `/api/recruiter/jobs/:id` | Yes | `recruiter`, `admin` | Update allowed job fields (cannot modify company or creator) |
| `PATCH`| `/api/recruiter/jobs/:id/publish` | Yes | `recruiter`, `admin` | Publish job (enforces company verification, sets `publishedAt`, syncs active count) |
| `PATCH`| `/api/recruiter/jobs/:id/close` | Yes | `recruiter`, `admin` | Close job listing (sets `closedAt`, decrements company active jobs count) |

### Candidate Application Workflow & History (`/api/applications`, `/api/jobs/:jobId/apply`)

| Method | Endpoint | Auth Required | Permissions | Description |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/api/jobs/:jobId/apply` | Yes | `candidate` | Submit direct application with resume and candidate snapshot |
| `POST` | `/api/applications/apply` | Yes | `candidate` | Alternative apply endpoint accepting `jobId` in JSON payload |
| `GET` | `/api/applications/me` | Yes | `candidate` | View candidate's own application history (internal recruiter notes redacted) |
| `GET` | `/api/applications/my` | Yes | `candidate` | Legacy compatibility alias for `/api/applications/me` |
| `GET` | `/api/applications/:id` | Yes | `candidate`, `recruiter` | Retrieve single application details (scoped to owner candidate or job's hiring team) |
| `PATCH`| `/api/applications/:id/withdraw` | Yes | `candidate` | Candidate withdraws active application (status changes to `withdrawn`) |

### Recruiter Applicant Review & Evaluation (`/api/recruiter/jobs/:jobId/applications`, `/api/applications/:id`)

| Method | Endpoint | Auth Required | Permissions | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/recruiter/jobs/:jobId/applications` | Yes | `recruiter`, `admin` | List all applicants for organization's job listing |
| `GET` | `/api/applications/job/:jobId` | Yes | `recruiter`, `admin` | Compatibility alias for job applicants listing |
| `PATCH`| `/api/recruiter/applications/:id/status` | Yes | `recruiter`, `admin` | Update applicant status (`under_review`, `shortlisted`, `interview`, `offered`, `rejected`) |
| `PUT` | `/api/applications/:id/status` | Yes | `recruiter`, `admin` | Compatibility alias for status updates (normalizes `interviewing` -> `interview`) |
| `POST` | `/api/recruiter/applications/:id/notes` | Yes | `recruiter`, `admin` | Add internal recruiter evaluation note (redacted from candidate) |
| `GET` | `/api/profile/resume/download/:userId` | Yes | `candidate`, `recruiter` | Download resume (recruiter permitted only if candidate has active application) |

### Candidate Saved Jobs / Bookmarks (`/api/saved-jobs`, `/api/jobs/:jobId/save`)

| Method | Endpoint | Auth Required | Permissions | Description |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/api/jobs/:jobId/save` | Yes | `candidate` | Bookmark / save a published job (compound unique, idempotent) |
| `POST` | `/api/saved-jobs/:jobId` | Yes | `candidate` | Alternative saved job endpoint |
| `DELETE`| `/api/jobs/:jobId/save` | Yes | `candidate` | Remove job from saved bookmarks |
| `DELETE`| `/api/saved-jobs/:jobId` | Yes | `candidate` | Alternative unsave endpoint |
| `GET` | `/api/saved-jobs` | Yes | `candidate` | Retrieve candidate's bookmarked jobs with live listing details & availability |
| `GET` | `/api/jobs/:jobId/saved` | Yes | `candidate` | Check if specific job is bookmarked (`{ success: true, isSaved: boolean }`) |
| `GET` | `/api/saved-jobs/:jobId/check` | Yes | `candidate` | Check bookmark state via saved-jobs route group |

### Phase 7: Talent Match & Intelligent Job Matching Engine (`/api/matching`, `/api/talent-match`)

| Method | Endpoint | Auth Required | Permissions | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/matching/jobs` | Yes | `candidate` | Candidate personalized job recommendations ranked by 6-factor match score |
| `GET` | `/api/talent-match/jobs` | Yes | `candidate` | Compatibility alias for candidate job recommendations |
| `GET` | `/api/recruiter/jobs/:jobId/matches` | Yes | `recruiter` | Recruiter candidate matches for authorized company opening |
| `GET` | `/api/talent-match/candidates` | Yes | `recruiter` | Compatibility alias for recruiter candidate discovery (`?jobId=...`) |
| `POST` | `/api/matching/save-job` | Yes | `candidate` | Toggle bookmark status for recommended job |
| `POST` | `/api/talent-match/save-job` | Yes | `candidate` | Compatibility alias for saving jobs from Talent Match UI |
| `POST` | `/api/matching/shortlist` | Yes | `recruiter` | Toggle shortlisted status for candidate on specific opening |
| `POST` | `/api/talent-match/shortlist` | Yes | `recruiter` | Compatibility alias for shortlisting candidate from Talent Match UI |

#### Matching Engine Architecture & 6-Factor Algorithm

The matching engine is 100% deterministic, explainable, and heuristic-based. No simulated LLM scores or opaque black-box magic are used:

| Factor | Weight | Evaluation Method & Logic |
| :--- | :---: | :--- |
| **Technical & Core Skills** | **40%** | Normalized skill overlap using `SKILL_ALIASES` (e.g. `reactjs` -> `react`, `node.js` -> `nodejs`, `k8s` -> `kubernetes`). 80% weight on required skills, 20% weight on preferred skills. |
| **Relevant Experience** | **20%** | Calculated from non-overlapping career intervals to prevent double-counting concurrent roles. Compares candidate tenure against job's min/max experience range. |
| **Location & Work-Mode** | **15%** | 100% match for Remote openings matching candidate remote preferences; evaluates candidate city & preferred locations (Bengaluru, Pune, Mumbai, Delhi NCR, Hyderabad, etc.) against job location. |
| **Employment Preferences** | **10%** | Compares candidate preferred employment types (`full-time`, `part-time`, `contract`, `internship`) against job employment type. |
| **Education & Qualifications**| **10%** | Evaluates candidate degrees and field of study without unfairly penalizing candidates when optional criteria are omitted. |
| **Career & Domain Alignment** | **5%** | Analyzes overlap between candidate desired job titles, professional headline, and job category/title domain. |

- **Data Completeness**: Sum of weights of factors where candidate profile and job have known evidence (0–100%).
- **Limited Data Flag**: If `dataCompleteness < 60%`, `limitedData: true` is flagged to inform candidates and recruiters that match accuracy is limited.
- **Normalization Formula**: `normalizedScore = Math.round((sum(score_i * weight_i) / knownWeightSum) * 100)` strictly bounded between `0` and `100`.
- **Presentation Categories**:
  - `85–100%`: **Excellent match**
  - `70–84%`: **Strong match**
  - `50–69%`: **Moderate match**
  - `<50%`: **Lower match**

#### Recruiter Authorization & Candidate Privacy Rules
- **Recruiter Company Authorization**: Recruiters can only discover candidates for jobs published by companies where they are active members (`requireCompanyMembership`).
- **Candidate Discoverability Gating**: Only candidates with `discoverability: true` (or `isDiscoverable: true`) are included in candidate discovery search. Candidates with `discoverability: false` are strictly omitted.
- **Contact Info & Resume Redaction**: Private phone numbers, contact emails, and direct resume file paths are protected in the discovery pool until candidate applies or recruiter requests contact access.

---

### Phase 8: Real-Time Meeting Scheduler & Interview Booking System (`/api/meetings`, `/api/recruiter/availability`, `/api/bookings`)

| Method | Endpoint | Auth Required | Permissions | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/recruiter/availability` | Yes | `recruiter`, `admin` | Retrieve recruiter working hours, buffers, slot durations, and notice periods (auto-seeds Mon-Fri 09:00-17:00 IST) |
| `PUT` | `/api/recruiter/availability` | Yes | `recruiter`, `admin` | Update working hours, buffers, slot durations, and booking horizons |
| `GET` | `/api/recruiter/availability/exceptions` | Yes | `recruiter`, `admin` | List recruiter's scheduled time off and unavailable exception periods |
| `POST` | `/api/recruiter/availability/exceptions` | Yes | `recruiter`, `admin` | Create unavailable period / calendar block (`startAt`, `endAt`, `reason`) |
| `DELETE`| `/api/recruiter/availability/exceptions/:exceptionId` | Yes | `recruiter`, `admin` | Delete availability exception |
| `GET` | `/api/recruiters/:recruiterId/available-slots` | No | Public / Candidate | Discover bookable slots for recruiter (`date`, `duration`, `timeZone`) |
| `GET` | `/api/bookings/availability` | No | Public / Candidate | Compatibility slot discovery alias |
| `POST` | `/api/meetings` | Yes | `candidate`, `recruiter` | Book interview slot (enforces atomic locking and working hour verification) |
| `POST` | `/api/bookings` | Optional | Authenticated / Visitor | Compatibility booking route supporting guest email and existing UI payload |
| `GET` | `/api/meetings/me` | Yes | Authenticated | List participant meetings (redacts `recruiterNotes` for candidate) |
| `GET` | `/api/bookings/my` | Yes | Authenticated | Compatibility meeting list alias |
| `GET` | `/api/meetings/:meetingId` | Yes | Attendee / Admin | Retrieve meeting details by ID or booking reference |
| `PATCH`| `/api/meetings/:meetingId/reschedule` | Yes | Attendee / Admin | Reschedule meeting to a new free slot (atomic conflict check) |
| `POST` | `/api/bookings/reschedule` | Yes | Attendee / Admin | Compatibility reschedule route accepting reference and new slot |
| `PATCH`| `/api/meetings/:meetingId/cancel` | Yes | Attendee / Admin | Cancel scheduled meeting with audit reason and release time slot |
| `POST` | `/api/bookings/cancel` | Yes | Attendee / Admin | Compatibility cancel route accepting reference and cancellation reason |

#### Scheduling Algorithm & Atomic Double-Booking Prevention
1. **Working Hours & Timezone Resolution**: Recruiter working hours are defined in IANA timezones (e.g. `Asia/Kolkata`) using native zero-dependency `Intl.DateTimeFormat`.
2. **Buffer Times**: Configurable buffers before (`bufferBeforeMinutes`) and after (`bufferAfterMinutes`) are enforced to ensure recruiters have transition time between interviews.
3. **Advance Notice & Horizon**: Minimum notice (`minimumNoticeMinutes`, default 60 min) prevents instant bookings; maximum horizon (`maximumBookingDaysAhead`, default 30 days) prevents far future bookings.
4. **Exception Handling**: Slots overlapping any `unavailable` `AvailabilityException` are dynamically excluded.
5. **Double-Booking Prevention**: Concurrency-safe, mutex-locked atomic check (`recruiterLocks`) ensures simultaneous requests cannot book the same slot. Overlapping active meetings trigger HTTP 409 Conflict.
6. **Role-Based Privacy**: Candidates cannot view confidential interview notes (`recruiterNotes` stripped via `toCandidateJSON()`).

---

### Phase 9: Real-Time Notifications & Email Integration (`/api/notifications`)

| Method | Endpoint | Auth Required | Permissions | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/notifications` | Yes | Authenticated | Retrieve paginated notifications belonging exclusively to the authenticated user (`page`, `limit`, `status`, `type`) |
| `GET` | `/api/notifications/unread-count` | Yes | Authenticated | High-performance unread badge count for navbar bell indicator |
| `PATCH` | `/api/notifications/:id/read` | Yes | Authenticated | Mark a single notification as read (strictly validates recipient ownership with 403 Forbidden on mismatch) |
| `PATCH` | `/api/notifications/read-all` | Yes | Authenticated | Mark all notifications belonging to the authenticated user as read |
| `DELETE`| `/api/notifications/:id` | Yes | Authenticated | Soft-dismiss / delete a notification (owner-scoped) |
| `GET` | `/api/notifications/preferences` | Yes | Authenticated | Retrieve user's granular email notification toggles |
| `PUT` | `/api/notifications/preferences` | Yes | Authenticated | Update granular notification preferences (`applicationStatus`, `newApplicant`, `interviewBooked`, `interviewReminders`, `jobUpdates`, `companyVerification`) |

#### Notification Architecture, Email Delivery & Outbox Reliability
1. **In-App Persistent Notifications**: Stored in the MongoDB `Notification` collection with compound indexing on `(recipient, isDismissed, createdAt)` and sparse indexing on `deduplicationKey`. Supports virtual `isRead` and safe resource linking (`actionUrl`, `resourceType`, `resourceId`).
2. **Transactional Outbox Pattern**: Asynchronous emails are written to `NotificationOutbox` (`pending`, `sent`, `failed`, `retrying`). A background queue dispatcher processes pending items with bounded exponential backoff retries (`nextAttemptAt`, `attempts`, `maxAttempts: 4`).
3. **Provider-Agnostic Nodemailer Integration**: Configurable via SMTP environment variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`). In unconfigured environments, falls back gracefully to a non-blocking console logger without disrupting primary business actions. Includes a sandboxed in-memory transport for automated test suites (`emailService.getSentEmails()`).
4. **9 Branded Responsive HTML Templates**: High-conversion, dark/light compatible email templates with fallback plain-text rendering for:
   - Application Submitted (Candidate) & New Applicant Received (Recruiter)
   - Application Status Changed (Candidate) & Application Withdrawn (Recruiter)
   - Interview Scheduled, Rescheduled, and Cancelled (Both Candidate & Recruiter)
   - Approaching Interview Reminders (24 Hours and 1 Hour)
   - Company Verification Status Updated (Recruiter)
5. **Idempotency & Deduplication Engine**: Deterministic keys (e.g., `notif_rem_24h:<meetingId>:<recipientId>`) ensure duplicate triggers never produce duplicate in-app items or duplicate emails.
6. **Background Reminder Worker**: Automatic periodic scanner (`reminderService`) identifies upcoming active interviews in `24-hour` and `1-hour` lookahead windows, filters out cancelled meetings, and dispatches reminders idempotently.

---

### Phase 10: Admin Dashboard & Platform Management (`/api/admin`)

| Method | Endpoint | Auth Required | Permissions | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/admin/dashboard` | Yes | `admin` | Real-time aggregated platform metrics (users, companies, jobs, applications, interviews, pending actions) |
| `GET` | `/api/admin/users` | Yes | `admin` | Paginated user governance list with role, status, and text search (sensitive credentials omitted) |
| `GET` | `/api/admin/users/:userId` | Yes | `admin` | User account inspection including candidate/recruiter profile references and job/application metrics |
| `PATCH` | `/api/admin/users/:userId/status` | Yes | `admin` | Suspend or reactivate user account; invalidates sessions on suspension; blocks self-suspension and last admin lockout |
| `PATCH` | `/api/admin/users/:userId/role` | Yes | `admin` | Change user role (`candidate`, `recruiter`, `admin`); prevents demoting the last active administrator |
| `GET` | `/api/admin/companies` | Yes | `admin` | Paginated company listing with verification status filters (`verified`, `pending`, `rejected`, `suspended`) |
| `GET` | `/api/admin/companies/:companyId` | Yes | `admin` | Company governance inspection including recruiter members and verification submission history |
| `GET` | `/api/admin/companies/verification-requests` | Yes | `admin` | Verification review queue containing pending verification submissions |
| `PATCH` | `/api/admin/companies/:companyId/verification` | Yes | `admin` | Approve, reject, or suspend company verification; logs audit note and notifies recruiter |
| `GET` | `/api/admin/jobs` | Yes | `admin` | Moderation job listing supporting moderation status filters (`all`, `active`, `flagged`, `removed`) |
| `GET` | `/api/admin/jobs/:jobId` | Yes | `admin` | Job moderation inspection with company, applicant count, and moderation history |
| `PATCH` | `/api/admin/jobs/:jobId/moderation` | Yes | `admin` | Moderate job (`remove`, `restore`, `flag`); preserves applications and candidate history while hiding from public search |
| `POST` | `/api/admin/jobs/:jobId/close` | Yes | `admin` | Administratively close a job posting with reason and audit log |
| `GET` | `/api/admin/audit-logs` | Yes | `admin` | Paginated append-only administrative audit log trail with action, resource, actor, and date filters |

#### Administrative Governance & Audit Architecture
1. **Strict Role-Based Access Control**: All `/api/admin/*` routes are guarded by `authenticate` and `requireRole('admin')`. Non-admin requests immediately return HTTP 403 Forbidden.
2. **Lockout & Self-Destruction Safeguards**: Administrators cannot suspend or demote their own account. The system dynamically counts active administrators and strictly prohibits demoting or suspending the platform's last remaining active admin.
3. **Session Invalidation**: When an administrator suspends a user, all active refresh tokens for that user are immediately purged (`refreshTokens = []`), terminating all active device sessions.
4. **Data Integrity & Application Preservation**: Moderating a job (`action: 'remove'`) hides the job from public candidate search (`/api/jobs`) and blocks new applications, but **strictly preserves all existing applications, candidate records, and recruiter review notes**.
5. **Append-Only Audit Logging**: All mutations (user status changes, role updates, company verification decisions, job moderation actions) automatically write an immutable record to `AdminAuditLog` capturing actor ID, action type, resource ID, before-and-after snapshots, IP address, user agent, and timestamp.
6. **Administrator CLI Bootstrap**: Secure offline administrator creation via `npm run bootstrap:admin -- --email <email> --password <pass>` with idempotency and secure bcrypt hashing.

---

### Phase 11: Analytics, Reporting & Real-Time Dashboard Statistics (`/api/analytics`)

| Method | Endpoint | Auth Required | Permissions | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/admin/analytics/overview` | Yes | `admin` | Real-time platform analytics overview, growth rates, and daily time series (`period`: `7d`, `30d`, `90d`, `custom`) |
| `GET` | `/api/admin/analytics/recruitment-funnel` | Yes | `admin` | Stage-by-stage recruitment funnel (Applied -> Reviewed -> Shortlisted -> Interview -> Offered), dropouts, and time-to-first-review |
| `GET` | `/api/admin/analytics/export` | Yes | `admin` | Export administrative reports as secure CSV with formula injection protection (`type`: `platform_summary`, `jobs_summary`, `applications_funnel`, `users_summary`) |
| `GET` | `/api/recruiter/analytics/overview` | Yes | `recruiter` | Recruiter dashboard analytics scoped strictly to authorized jobs and companies |
| `GET` | `/api/recruiter/analytics/jobs` | Yes | `recruiter` | Paginated job performance comparison table with application status distributions and sorting |
| `GET` | `/api/recruiter/analytics/jobs/:jobId/funnel` | Yes | `recruiter` | Single-job recruitment funnel with conversion percentages (enforces job ownership; rejects unauthorized jobs with 403) |
| `GET` | `/api/recruiter/analytics/jobs/export` | Yes | `recruiter` | Export authorized recruiter job performance report as secure CSV |
| `GET` | `/api/companies/:companyId/analytics` | Yes | Member / Admin | Company-level analytics scoped to corporate jobs and applications; requires active membership or admin |
| `GET` | `/api/candidate/analytics/overview` | Yes | `candidate` | Candidate personal activity analytics (applications submitted, status breakdown, saved jobs, upcoming interviews) |

#### Analytics Architecture & Security Principles
1. **Real Database Metrics**: Every statistic, conversion rate, and chart coordinate is computed directly from live MongoDB records. Synthetic, hardcoded, or fabricated chart values are strictly prohibited.
2. **Current State vs. Period Event Distinction**: Accurately separates current state counts (e.g. total published jobs today) from cohort events occurring during a date range (e.g. applications submitted between `startDate` and `endDate`).
3. **UTC Date Normalization & Continuous Buckets**: Time boundaries are evaluated in UTC with inclusive start-of-day (`00:00:00.000Z`) and end-of-day (`23:59:59.999Z`). Time-series arrays guarantee continuous, gap-free daily buckets (`YYYY-MM-DD`).
4. **Honest Baseline Comparisons**: Percentage changes vs previous periods handle zero baselines mathematically (`null` when baseline is 0 and current > 0; `0%` when both are 0).
5. **Spreadsheet Formula Injection Neutralization**: All CSV export cells starting with `=`, `+`, `-`, or `@` are safely prefixed with `'` to prevent remote code or formula execution in Excel/Google Sheets.
6. **Strict RBAC & Data Minimization**: Recruiters can never access other recruiters' private jobs or candidate data; candidates can only access their own records; sensitive personal credentials and resumes are excluded from analytics aggregates.

---

## 8. Running Automated Tests

Run the Vitest test suite covering Phases 1 through 11:

```powershell
# From repository root
npm.cmd test --prefix backend

# Or directly in backend directory
cd backend
npx.cmd vitest run
```

### Test Suite Summary (292 Tests Passing Across 14 Test Files)
- **`tests/analytics.test.js`** (22 tests): Complete Phase 11 suite covering admin authorization gates (`requireRole('admin')`), platform analytics overview (`GET /api/admin/analytics/overview`), preset date ranges (`7d`, `30d`, `90d`), custom date range validation (rejects inverted dates and ranges > 365 days with 422), growth percentage comparisons, continuous daily time series, outbox email delivery rates, recruitment funnel stages and conversion rates (`GET /api/admin/analytics/recruitment-funnel`), average time-to-first-review calculation from status history timestamps, admin CSV exports (`GET /api/admin/analytics/export`) with formula injection neutralization, recruiter analytics authorization and job ownership scoping (`GET /api/recruiter/analytics/overview`), paginated recruiter job performance table (`GET /api/recruiter/analytics/jobs`), single-job recruitment funnel (`GET /api/recruiter/analytics/jobs/:jobId/funnel`), unauthorized job access rejection (403), recruiter CSV export (`GET /api/recruiter/analytics/jobs/export`), company-level analytics access control (`GET /api/companies/:companyId/analytics`), candidate personal activity statistics (`GET /api/candidate/analytics/overview`), candidate privacy enforcement, and empty dataset zero-state handling.
- **`tests/admin.test.js`** (23 tests): Complete Phase 10 suite covering administrator authorization gates (`requireRole('admin')`), unauthenticated rejection (401), candidate & recruiter rejection (403), public registration specifying admin role rejection (400), database-backed platform metrics (`GET /api/admin/dashboard`), user governance & credential sanitization (`GET /api/admin/users`), role/status filtering, user details inspection (`GET /api/admin/users/:userId`), account suspension with session revocation (`PATCH /api/admin/users/:userId/status`), account reactivation, self-suspension prevention, last-admin lockout prevention, company administration & verification review (`GET /api/admin/companies`, `PATCH /api/admin/companies/:id/verification`), job moderation & public search exclusion (`GET /api/admin/jobs`, `PATCH /api/admin/jobs/:id/moderation`), application history preservation, administrative job closing (`POST /api/admin/jobs/:id/close`), and append-only audit trail filtering (`GET /api/admin/audit-logs`).
- **`tests/notifications.test.js`** (25 tests): Complete Phase 9 suite covering in-app notification retrieval, strict recipient isolation, unread badge count (`GET /api/notifications/unread-count`), pagination, single read mutation (`PATCH /api/notifications/:id/read`), read-all mutation (`PATCH /api/notifications/read-all`), dismissal & retention (`DELETE /api/notifications/:id`), cross-user authorization enforcement (403 Forbidden), deduplication key suppression, granular preference retrieval and updates (`GET`, `PUT /api/notifications/preferences`), preference-based email suppression, transactional outbox creation and status updates, retry scheduling with exponential backoff, max attempt failure capping, business event notifications (application submission, status transitions, withdrawal, interview booking, rescheduling, cancellation), and background reminder scheduling (24h/1h windows, cancellation exclusion, idempotency).
- **`tests/meetings.test.js`** (33 tests): Complete Phase 8 suite covering recruiter availability configuration (`GET /api/recruiter/availability`, `PUT /api/recruiter/availability`), default auto-seeding (Mon-Fri 09:00-17:00 IST), working hours and booking constraint updates, input validation (time format `HH:mm`, start < end rules, duration values), availability exceptions (`POST`, `GET`, `DELETE /api/recruiter/availability/exceptions`), cross-recruiter deletion denial with 403, candidate / public slot discovery (`GET /api/recruiters/:recruiterId/available-slots`), multi-duration slot splitting (`15`, `30`, `45`, `60`), minimum notice enforcement (`minimumNoticeMinutes`), maximum booking horizon enforcement (`maximumBookingDaysAhead`), unavailable exception exclusion, active meeting conflict exclusion with buffers, cancelled meeting slot release, interview booking (`POST /api/meetings`), ISO UTC `startAt` booking, date + timeSlot booking, out-of-working-hours rejection, atomic double-booking prevention (409 Conflict), in-process mutex concurrent booking protection (exactly 1 created, 1 conflict), application ownership verification, attendee meeting history listing (`GET /api/meetings/me`), confidential recruiter note redaction (`recruiterNotes` stripped for candidate, visible for recruiter), single meeting retrieval with unauthorized access rejection (403), rescheduling with slot conflict check (`PATCH /api/meetings/:id/reschedule`), cancellation with audit trail (`PATCH /api/meetings/:id/cancel`), and legacy `/api/bookings` compatibility routes (`/availability`, guest email booking, `/reschedule`, `/cancel`).
- **`tests/matching.test.js`** (27 tests): Complete Phase 7 suite covering 6-factor algorithm weights (100% match, zero match), missing data normalization, skill aliases, non-overlapping experience calculations, remote/hybrid location rules, employment preferences, education evaluations, determinism (100 iterations), score bounds (0-100), candidate recommendation endpoint (`GET /api/matching/jobs`), recruiter candidate discovery endpoint (`GET /api/recruiter/jobs/:jobId/matches`), candidate privacy & discoverability gating (`discoverability: false` excluded), contact redaction, cross-company access denial with 403, save job toggle, shortlist toggle, and zero-skill/empty profile edge cases.
- **`tests/applications.test.js`** (34 tests): Candidate application submission, immutable resume and candidate snapshots, duplicate application blocking with 409 Conflict, rejection of applications to closed/draft jobs with 400, external portal redirection without creating internal records, recruiter apply prevention with 403, candidate history retrieval (`/api/applications/me`, `/api/applications/my`), single application view with internal note redaction, cross-candidate access prevention with 403, candidate withdrawal state transitions (`withdrawn`), recruiter applicants listing for company jobs, cross-company applicant access blocking with 403, recruiter status lifecycle updates (`under_review`, `shortlisted`, `interview`, `offered`, `rejected`), status update validation (recruiter cannot withdraw; withdrawn cannot be reopened), internal evaluation notes (recruiter visible, candidate redacted), saved jobs bookmarking (compound uniqueness, idempotency, unpublished job rejection), unsaving, listing with availability status, bookmark checks, and recruiter resume access authorization verification (`hasActiveApplication`).
- **`tests/jobs.test.js`** (27 tests): Public job discovery, multi-faceted filtering (keyword, location, workMode, employmentType, experience range, salary thresholds, categories), sorting, pagination, detail views with populated company metadata, draft concealment from unauthorized candidates, recruiter job creation, company verification publishing gate (`requireVerifiedCompanyForPublishing`), recruiter organization listing, patch updates, cross-company access denial, publish/close lifecycle transitions, external application URL validation, and legacy endpoint compatibility (`/api/jobs/create`, `/api/jobs/:id/status`).
- **`tests/company.test.js`** (27 tests): Company registration, slug collision handling, public discovery, search by tech stack and category, location filtering, detail view redaction, permission enforcement, protected field rejection, verification request submission, admin review queue, verification approval/rejection transitions, logo upload/deletion, invitations, role update, sole-owner protection, and audit logging.
- **`tests/profile.test.js`** (27 tests): Candidate & Recruiter profiles, completeness calculation, avatar upload/delete, binary signature validation (magic byte rejection), resume upload/replace/download/delete, privacy and discoverability controls.
- **`tests/auth.test.js`** (27 tests): Candidate & Recruiter registration, admin rejection, duplicate emails, password hashing, role mismatch, `/me` session restoration, 401/403 access control, refresh token rotation, logout, password reset, and settings.
- **`tests/health.test.js`** (5 tests): Health, liveness, readiness, and decoupled routes.
- **`tests/middleware.test.js`** (6 tests): 404 handling, malformed JSON, CORS, and production error sanitization.
- **`tests/database.test.js`** (4 tests): MongoDB connection states, timeouts, and failure handling.
- **`tests/env.test.js`** (5 tests): Environment schema validation and sensitive credential redaction.

### Acceptance Test Verification (105 Passed, 0 Failed Across 28 Scenarios)

Run end-to-end acceptance tests across real running endpoints:

```powershell
node run_acceptance_tests.js
```

Covers:
- **Scenario 1**: Private Candidate Profile Privacy (2/2 assertions)
- **Scenario 2**: Resume Download Permission Enforcement (2/2 assertions)
- **Scenario 3**: Unauthorized Job Publishing Prevention (2/2 assertions)
- **Scenario 4**: Unauthorized Company Profile Modification (1/1 assertion)
- **Scenario 5**: Single Source of Truth Across Find Jobs & Companies (3/3 assertions)
- **Scenario 6**: Job Pause Consistency (3/3 assertions)
- **Scenario 7**: Job Close Consistency & Reopening (2/2 assertions)
- **Scenario 8**: Resume File Format & Size Validation (3/3 assertions)
- **Scenario 9**: Candidate Job Application Submission (4/4 assertions)
- **Scenario 10**: Recruiter Applicant Status Update (2/2 assertions)
- **Scenario 11**: Phase 7 Candidate Talent Match Job Recommendations & Save Job (6/6 assertions)
- **Scenario 12**: Phase 7 Recruiter Candidate Discovery, Discoverability Exclusion & Shortlist (5/5 assertions)
- **Scenario 13**: Phase 8 Recruiter Working Hours & Candidate Available Slots Discovery (4/4 assertions)
- **Scenario 14**: Phase 8 Interview Booking, Atomic Conflict Detection, Reschedule & Cancel (7/7 assertions)
- **Scenario 15**: Phase 9 In-App Notifications & Granular Preference Management (8/8 assertions)
- **Scenario 16**: Phase 9 Business Event Delivery, Single/Batch Read State & Dismissal (6/6 assertions)
- **Scenario 17**: Phase 10 Platform Administrator Access Gate & Dashboard Metrics (5/5 assertions)
- **Scenario 18**: Phase 10 User Governance, Credential Sanitization, Account Suspension & Reactivation (6/6 assertions)
- **Scenario 19**: Phase 10 Company Verification & Review Workflow (2/2 assertions)
- **Scenario 20**: Phase 10 Job Moderation, Public Search Exclusion & Application History Preservation (4/4 assertions)
- **Scenario 21**: Phase 10 Append-Only Administrative Audit Log Trail & Role Scoping (3/3 assertions)
- **Scenario 22**: Phase 11 Platform Administrator Analytics Overview & Continuous Time Series (5/5 assertions)
- **Scenario 23**: Phase 11 Administrator Recruitment Funnel & Conversion Tracking (3/3 assertions)
- **Scenario 24**: Phase 11 Administrator CSV Export with Formula Injection Protection (3/3 assertions)
- **Scenario 25**: Phase 11 Recruiter Scoped Analytics & Job Performance Table (6/6 assertions)
- **Scenario 26**: Phase 11 Recruiter Single Job Funnel & Cross-Company Denial (1/1 assertion)
- **Scenario 27**: Phase 11 Company-Level Analytics Access Control (2/2 assertions)
- **Scenario 28**: Phase 11 Candidate Personal Activity Analytics & Privacy Scoping (4/4 assertions)
