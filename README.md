# HireConnect — Production-Ready MERN Job & Recruitment Platform

HireConnect is a full-stack recruitment platform connecting candidates, recruiters, and companies with real database-backed workflows: candidate job discovery, multi-faceted filtering, application tracking, intelligent 6-factor talent matching, real-time interview scheduling with atomic conflict prevention, transactional notifications, administrative governance, and platform analytics.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Repository Structure](#2-repository-structure)
3. [Installing Dependencies](#3-installing-dependencies)
4. [Configuring Environment Variables](#4-configuring-environment-variables)
5. [Starting MongoDB or Development Database](#5-starting-mongodb-or-development-database)
6. [Running the Application](#6-running-the-application)
7. [Running Automated Tests](#7-running-automated-tests)
8. [Frontend Build & Asset Verification](#8-frontend-build--asset-verification)
9. [Configuring Production Database (MongoDB Atlas)](#9-configuring-production-database-mongodb-atlas)
10. [Database Indexes & Production Synchronization](#10-database-indexes--production-synchronization)
11. [Private File Storage & Resume Security](#11-private-file-storage--resume-security)
12. [Transactional Email Delivery](#12-transactional-email-delivery)
13. [Secure Administrator Bootstrap](#13-secure-administrator-bootstrap)
14. [Production Deployment Architecture](#14-production-deployment-architecture)
15. [Domain Names, CORS, and Cookie Configuration](#15-domain-names-cors-and-cookie-configuration)
16. [Background Workers & Scheduled Tasks](#16-background-workers--scheduled-tasks)
17. [Health & Readiness Verification](#17-health--readiness-verification)
18. [Database Backup & Restore Procedures](#18-database-backup--restore-procedures)
19. [Release Rollback & Recovery Procedures](#19-release-rollback--recovery-procedures)
20. [Troubleshooting Common Issues](#20-troubleshooting-common-issues)

---

## 1. Prerequisites

- **Node.js**: `v18.0.0` or higher (tested on Node `v24.x` and `v20.x LTS`).
- **npm**: `v9.0.0` or higher.
- **MongoDB**:
  - Local: MongoDB Community Server 6.0+ on `mongodb://127.0.0.1:27017`
  - Production: MongoDB Atlas M0+ cluster (`mongodb+srv://...`)
  - *Zero-Dependency Fallback*: Models include an automatic in-memory document adapter for rapid local development and automated CI testing when no MongoDB daemon is active.

---

## 2. Repository Structure

```
├── .env.example                       # Frontend environment template
├── .gitignore                          # Root git ignore (credentials, uploads, logs)
├── package.json                        # Root package manifest & automation scripts
├── server.js                           # Node.js production HTTP server & reverse proxy
├── index.html                          # Landing page & Find Jobs interface
├── admin/index.html                    # Administrative Command Center
├── cases/index.html                    # Intelligent Talent Match interface
├── profile/index.html                  # Candidate & Recruiter Dashboards
├── services/index.html                 # Companies Discovery page
├── settings/index.html                 # User Account & Privacy Settings
├── signup/index.html                   # Authentication Portal (Sign In / Sign Up)
├── _nuxt/                              # Bundled scripts, styles, Saans typography & assets
├── backend/
│   ├── .env.example                    # Backend environment configuration template
│   ├── package.json                    # Backend dependencies & test configuration
│   ├── vitest.config.mjs               # Vitest configuration
│   ├── src/
│   │   ├── app.js                      # Express application, security headers & routing
│   │   ├── server.js                   # Backend standalone HTTP server & graceful shutdown
│   │   ├── config/                     # Environment validation (env.js) & database (database.js)
│   │   ├── controllers/                # Request handlers (auth, jobs, apps, admin, analytics)
│   │   ├── middleware/                 # Auth, RBAC, error handling, rate limiting, sanitization
│   │   ├── models/                     # Mongoose schemas with compound indexes & memory fallback
│   │   ├── routes/                     # Domain route definitions (auth, candidate, job, etc.)
│   │   ├── scripts/                    # CLI scripts (bootstrapAdmin.js, ensureIndexes.js)
│   │   ├── services/                   # Business logic (matching, scheduling, analytics, storage)
│   │   ├── templates/                  # Transactional email templates
│   │   ├── utils/                      # Standardized response, error classes, tokens, logger
│   │   ├── validators/                 # Zod schema validation
│   │   └── workers/                    # Standalone background workers (reminderWorker.js)
│   └── tests/                          # Automated Vitest test suites (15 suites, 313 tests)
```

---

## 3. Installing Dependencies

Install both root and backend dependencies:

```bash
# Install root dependencies
npm install

# Install backend dependencies
npm --prefix backend install
```

---

## 4. Configuring Environment Variables

### Frontend (`.env`)

Copy `.env.example` in the project root:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|:---|:---|:---|
| `VITE_API_BASE_URL` | Base URL for API requests. Use `/api` for same-origin or reverse proxies. | `/api` |

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

**Generate strong cryptographic secrets before running in production:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Essential Backend Variables:

| Variable | Description | Required in Prod |
|:---|:---|:---|
| `NODE_ENV` | Application environment (`development` / `production` / `test`) | Yes |
| `PORT` | HTTP listener port (e.g. `5000` or `3000`) | Yes |
| `MONGODB_URI` | MongoDB connection URI (`mongodb+srv://...`) | Yes |
| `FRONTEND_URL` | Comma-separated allowed CORS origins | Yes |
| `JWT_SECRET` | Cryptographic secret for signing JWT access tokens (min 32 chars) | Yes |
| `COOKIE_SECRET` | Secret for cookie parsing and tamper protection (min 32 chars) | Yes |
| `COOKIE_SAME_SITE` | Cookie SameSite attribute (`lax` / `strict` / `none`) | Default: `lax` |
| `ENABLE_BACKGROUND_WORKER` | Toggle internal interview reminder worker (`true` / `false`) | Default: `true` |
| `STORAGE_PROVIDER` | Storage backend (`local` or S3-compatible) | Default: `local` |
| `SMTP_HOST` | Transactional email SMTP host (e.g. `smtp.resend.com`) | For email |
| `SMTP_PORT` | SMTP port (`587` or `465`) | For email |
| `SMTP_USER` | SMTP username | For email |
| `SMTP_PASS` | SMTP password / API token | For email |
| `ADMIN_BOOTSTRAP_PASSWORD` | Strong password for initial admin CLI bootstrap | For setup |

---

## 5. Starting MongoDB or Development Database

- **Local MongoDB**: Ensure the MongoDB daemon is active:
  ```bash
  mongod --dbpath /data/db
  ```
- **MongoDB Atlas**: Ensure your IP address is allowlisted in Network Access and the user credentials have `readWrite` permissions on the `hireconnect` database.
- **In-Memory Development**: If MongoDB is not present, the application automatically boots using the built-in in-memory document store.

---

## 6. Running the Application

### Development / Local Server (Full Stack)

Start the combined static server with Express API integration on port 3000:

```bash
npm start
```

Access the interface in your browser:
- Landing Page & Find Jobs: `http://localhost:3000/`
- Companies Discovery: `http://localhost:3000/services/`
- Talent Match Recommendations: `http://localhost:3000/cases/` (or `/talent-match`)
- User Profile Dashboard: `http://localhost:3000/profile/`
- Administrative Command Center: `http://localhost:3000/admin/`
- Sign In / Sign Up: `http://localhost:3000/signup/`

### Dedicated Backend Service

To run only the standalone Express API service on port 5000:

```bash
npm run backend:start
```

---

## 7. Running Automated Tests

Run the full automated Vitest test suite (15 test files, 313 unit and integration tests):

```bash
npm test
```

Run end-to-end acceptance tests against the running server (28 scenarios, 105 assertions):

```bash
node run_acceptance_tests.js
```

---

## 8. Frontend Build & Asset Verification

Verify that all bundled ES modules and application engines are intact:

```bash
npm run build
```

---

## 9. Configuring Production Database (MongoDB Atlas)

1. Create a MongoDB Atlas cluster (M0 free tier or dedicated cluster).
2. Create a database user with `readWrite` privileges restricted to the `hireconnect` database. Avoid using administrative `atlasAdmin` roles for application connections.
3. Configure **Network Access**:
   - For container or cloud deployments (e.g. AWS, Render, Heroku), add the server IP addresses or enable secure VPC peering.
4. Copy the SRV connection string:
   ```env
   MONGODB_URI=mongodb+srv://<db_user>:<db_password>@cluster0.abcde.mongodb.net/hireconnect?retryWrites=true&w=majority
   ```

---

## 10. Database Indexes & Production Synchronization

In production, automatic index creation at boot is disabled (`autoIndex: false`) to avoid startup latency. Synchronize all compound, text, and unique indexes using the dedicated CLI command:

```bash
npm run db:indexes
```

Indexes built:
- `User`: `{ email: 1 }` (unique), `{ role: 1, accountStatus: 1 }`
- `Job`: Text index (`title`, `description`, `skills`, `companyName`), `{ status: 1, publishedAt: -1 }`, `{ recruiter: 1, status: 1 }`
- `Application`: `{ job: 1, candidate: 1 }` (unique), `{ job: 1, status: 1 }`, `{ candidate: 1, submittedAt: -1 }`
- `Meeting`: `{ recruiter: 1, status: 1, startAt: 1, endAt: 1 }`, `{ candidate: 1, startAt: 1 }`
- `Notification`: `{ recipient: 1, createdAt: -1 }`, `{ deduplicationKey: 1 }` (sparse)
- `SavedJob`: `{ candidate: 1, job: 1 }` (unique)
- `CompanyMembership`: `{ company: 1, user: 1 }` (unique)

---

## 11. Private File Storage & Resume Security

- Candidate resumes and user profile photos are stored outside the public document root in `backend/uploads/`.
- Resumes are stored using random UUID storage keys (`crypto.randomUUID()`) to prevent predictable URL access.
- Resumes are never served statically. Access is mediated through authenticated streaming endpoints (`GET /api/profile/resume/download/:userId`) enforcing:
  - Candidates can only download their own resumes.
  - Recruiters can only download resumes for candidates who applied to their jobs or opted into discoverability.
- Uploads enforce strict 5MB (photo) and 10MB (resume) size limits and validate file headers (PDF magic bytes `%PDF-`, JPEG `\xFF\xD8\xFF`, PNG `\x89PNG`).

---

## 12. Transactional Email Delivery

HireConnect uses Nodemailer with genuine SMTP transport for delivery of:
- Application status changes.
- New applicant notifications for recruiters.
- Interview booking confirmations, calendar invites, and rescheduling notices.
- 24-hour and 1-hour interview reminder notices.
- Password reset instructions with expiring cryptographic tokens.

Configure your SMTP credentials in `backend/.env`:
```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=resend
SMTP_PASS=re_your_api_key_here
EMAIL_FROM=notifications@hireconnect.io
```

When credentials are not configured, the system logs email transactions to structured console logs without failing API requests or dropping notifications.

---

## 13. Secure Administrator Bootstrap

Public registration for administrative accounts is strictly prohibited. To safely initialize the platform administrator:

1. Configure administrative credentials in `backend/.env`:
   ```env
   ADMIN_BOOTSTRAP_EMAIL=admin@hireconnect.io
   ADMIN_BOOTSTRAP_PASSWORD=YourStrongUniquePassword123!
   ADMIN_BOOTSTRAP_NAME="Platform Administrator"
   ```
2. Execute the bootstrap CLI script:
   ```bash
   npm run bootstrap:admin
   ```
3. The script is idempotent: it initializes the administrator if missing or updates role permissions without duplicating accounts.

---

## 14. Production Deployment Architecture

```
                          [ Client Browser ]
                                  │
                                  ▼
                     [ Reverse Proxy / HTTPS ]
                    (Nginx / Cloudflare / Caddy)
                                  │
                 ┌────────────────┴────────────────┐
                 ▼                                 ▼
         [ Static Assets ]                 [ API & Node.js ]
      (HTML, CSS, JS, Fonts)            (server.js / backendApp)
                                                   │
                                ┌──────────────────┴──────────────────┐
                                ▼                                     ▼
                      [ MongoDB Atlas ]                      [ Private Storage ]
                     (Primary Database)                       (backend/uploads)
```

### Option A: Single Node / Container (Render, Railway, DigitalOcean, VM)
Run the root server which serves static assets and proxies API calls:
```bash
npm install
npm run build
npm start
```

### Option B: Decoupled Deployment
- **Frontend**: Host HTML/JS/CSS on Vercel, Netlify, or AWS S3/CloudFront with `VITE_API_BASE_URL=https://api.hireconnect.io/api`.
- **Backend**: Host `backend/src/server.js` on Render, Fly.io, Heroku, or AWS ECS with `FRONTEND_URL=https://hireconnect.io`.
- **Background Worker**: Run `npm run worker:reminders` as an independent background worker process.

---

## 15. Domain Names, CORS, and Cookie Configuration

1. Set `FRONTEND_URL` in `backend/.env` to the exact production domain(s):
   ```env
   FRONTEND_URL=https://hireconnect.io,https://www.hireconnect.io
   ```
2. Cookies are configured with:
   - `httpOnly: true` (prevents XSS cookie theft)
   - `secure: true` (enforces HTTPS delivery in production)
   - `sameSite: 'lax'` (or `'none'` for decoupled cross-domain setups)

---

## 16. Background Workers & Scheduled Tasks

The interview reminder worker scans for meetings entering 24-hour and 1-hour notice windows and dispatches notifications and emails with atomic deduplication keys (`reminder:meeting:<id>:user:<id>:interval:<key>`).

- **Single Instance**: Set `ENABLE_BACKGROUND_WORKER=true` (enabled by default).
- **Multi-Instance (Clustered)**: Set `ENABLE_BACKGROUND_WORKER=false` on web nodes to prevent redundant database polling, and run a dedicated worker instance:
  ```bash
  npm run worker:reminders
  ```

---

## 17. Health & Readiness Verification

Monitoring endpoints for Docker, Kubernetes, or load balancer health checks:

- **Liveness Probe**: `GET /api/health/live`
  - Returns `200 OK` if the process is alive, including uptime and memory usage.
- **Readiness Probe**: `GET /api/health/ready`
  - Returns `200 OK` when the database connection is active and ready to process transactions.
  - Returns `503 Service Unavailable` if MongoDB is disconnecting or offline.
- **Standard Health**: `GET /api/health`

```bash
curl -i http://localhost:3000/api/health/ready
```

---

## 18. Database Backup & Restore Procedures

### Automated Atlas Backups
Enable continuous cloud backups in MongoDB Atlas with daily point-in-time recovery.

### Manual CLI Backup (`mongodump`)
```bash
mongodump --uri="mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/hireconnect" --archive=backup_$(date +%Y%m%d).archive --gzip
```

### Manual CLI Restore (`mongorestore`)
```bash
mongorestore --uri="mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/hireconnect" --archive=backup_20261025.archive --gzip --drop
```

---

## 19. Release Rollback & Recovery Procedures

1. **Code Rollback**:
   - Revert git commit to previous verified release tag: `git checkout <release-tag>`.
   - Re-run `npm install` and `npm run build`.
   - Restart the server process using your process manager (`pm2 restart hireconnect` or container restart).
2. **Schema Compatibility**:
   - Models use flexible schema definitions with safe defaults (`default: null` or `default: false`), ensuring backwards and forwards compatibility between releases.
3. **Storage Preservation**:
   - The `uploads/` directory must reside on a persistent volume across container deployments. Ensure backups include persistent volumes.

---

## 20. Troubleshooting Common Issues

| Issue | Cause | Resolution |
|:---|:---|:---|
| `[Configuration Error] In production mode, JWT_SECRET must be set...` | Default development secret used in production. | Run secret generator and set a unique string (min 32 chars) in `.env`. |
| `503 Service Unavailable: database is disconnected` | MongoDB is unreachable. | Verify `MONGODB_URI` string and Atlas IP allowlist. |
| `CORS Error: Origin not permitted` | Browser origin not listed in `FRONTEND_URL`. | Add origin to `FRONTEND_URL` in `backend/.env`. |
| `SLOT_CONFLICT (409 Conflict)` | Attempted to book an occupied interview slot. | Candidate should pick another time slot from available slots. |
| `413 Payload Too Large` | Uploaded resume or avatar exceeds size limit. | Ensure file is <= 10MB for resumes or <= 5MB for photos. |

---

## License

Proprietary © HireConnect Inc. All rights reserved.
