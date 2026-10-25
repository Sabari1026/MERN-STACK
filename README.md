# HireConnect — Modern MERN-Stack Recruitment Platform

HireConnect is a full-stack, enterprise-grade recruitment platform connecting candidates, recruiters, and companies with verified database-backed workflows: candidate job discovery, multi-faceted filtering, application tracking, intelligent 6-factor talent matching, real-time interview scheduling with atomic concurrency control, transactional Resend SMTP notifications, administrative governance, and platform analytics.

The repository is organized into a clean, separated MERN-stack architecture:
- **Frontend (`frontend/`)**: React 18, Vite, React Router v6, Axios, custom modular CSS (strictly no Tailwind), responsive rem-scaling, and original Saans/Saans Mono typography.
- **Backend (`backend/`)**: Node.js, Express.js, Mongoose ODM, MongoDB Atlas live cluster connection, Resend SMTP integration, and local persistent disk storage with path traversal protection.
- **Automated Verification (`scripts/`)**: End-to-end acceptance tests (105 scenarios), production security audit (35 controls), live user persistence, and storage integrity suites.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Repository Directory Layout](#2-repository-directory-layout)
3. [Prerequisites](#3-prerequisites)
4. [Environment Configuration](#4-environment-configuration)
5. [Installation & Setup](#5-installation--setup)
6. [Running the Application (Development)](#6-running-the-application-development)
7. [Building for Production](#7-building-for-production)
8. [Automated Testing Suite](#8-automated-testing-suite)
9. [Database & Indexes](#9-database--indexes)
10. [Admin Bootstrap & Background Workers](#10-admin-bootstrap--background-workers)
11. [Security & Storage Architecture](#11-security--storage-architecture)
12. [API Reference & Client Services](#12-api-reference--client-services)

---

## 1. Architecture Overview

### Frontend
- **Framework**: React 18 (`react`, `react-dom`, `react-router-dom` v6).
- **Build Tool**: Vite 6 with `@vitejs/plugin-react`.
- **Styling**: Pure semantic CSS with CSS custom properties (`variables.css`, `typography.css`, `layout.css`, `global.css`, `responsive.css`).
  - Viewport-scaled typography with the Saans and Saans Mono font families.
  - Dark-mode primary palette (`#101216` canvas, `#1b1b1b` surfaces, `#242424` borders, `#8942e4` brand accent).
  - Strictly **NO Tailwind CSS** and no runtime styling overhead.
- **State & Context**:
  - `AuthContext`: Centralized session restoration, JWT tokens in storage, auto-logout on 401.
  - `NotificationContext`: In-app notification polling and read tracking.
  - `ToastContext`: Universal user feedback notifications.
- **API Client**: Centralized Axios client (`frontend/src/services/apiClient.js`) featuring Bearer token injection, request correlation IDs (`X-Request-ID`), `withCredentials: true`, and automatic 401 token refresh queue.

### Backend
- **Runtime**: Node.js 18+ / Express.js.
- **Database**: MongoDB Atlas M0+ cluster via Mongoose 8.
- **Email Delivery**: Genuine Resend SMTP integration (`smtp.resend.com:465` with SSL/TLS).
- **File Storage**: Local persistent disk storage with strictly enforced private access, MIME type validation, binary magic-byte inspection, and path traversal protection.
- **Security Middleware**: Helmet, CORS with strict origin validation, express-mongo-sanitize, express-rate-limit, cookie-parser, and centralized sanitizing error handlers.

---

## 2. Repository Directory Layout

```
hireconnect/
├── .env.example                       # Root environment reference
├── .gitignore                          # Root git ignore (node_modules, .env, dist, uploads)
├── package.json                        # Monorepo root automation scripts
├── package-lock.json                   # Root package lock
├── README.md                           # Master documentation
│
├── backend/                            # Genuine Node.js + Express + Mongoose Backend
│   ├── .env                            # Backend environment secrets (ignored)
│   ├── .env.example                    # Backend environment template
│   ├── package.json                    # Backend dependencies & test scripts
│   ├── src/
│   │   ├── app.js                      # Express application setup & middleware stack
│   │   ├── server.js                   # HTTP server entry point & graceful shutdown
│   │   ├── config/
│   │   │   ├── database.js             # Mongoose connection & reconnection lifecycle
│   │   │   └── env.js                  # Strict Joi environment validation
│   │   ├── controllers/                # 14 REST API controllers
│   │   ├── data/
│   │   │   ├── jobsData.js             # Verified seed jobs dataset
│   │   │   └── hireconnect_db.json     # Organization and company seed fallback
│   │   ├── middleware/                 # Auth, RBAC, Rate Limiting, Sanitization, Uploads
│   │   ├── models/                     # 16 Mongoose models (Users, Jobs, Meetings, etc.)
│   │   ├── routes/                     # Modular Express routers mounted at /api/*
│   │   ├── scripts/
│   │   │   ├── bootstrapAdmin.js       # CLI administrator seeding
│   │   │   └── ensureIndexes.js        # MongoDB production compound index sync
│   │   ├── services/                   # Business logic (Matching, Scheduling, Storage, Email)
│   │   ├── templates/                  # Responsive transactional HTML email templates
│   │   └── utils/                      # ApiError, ApiResponse, Logger, Tokens, Encryption
│   ├── tests/                          # 15 backend Vitest unit/integration test suites
│   └── uploads/                        # Protected storage (avatars, resumes, temp)
│
├── frontend/                           # React 18 + Vite Modern Frontend
│   ├── index.html                      # HTML5 entry point with Saans font preloading
│   ├── package.json                    # Frontend dependencies (React, Vite, Vitest)
│   ├── vite.config.js                  # Vite configuration with API & uploads proxy
│   ├── public/                         # Public static assets
│   │   ├── fonts/                      # Saans & Saans-Mono WOFF2 fonts
│   │   ├── blueprint.cdn.prismic.io/   # Technology and company brand vector logos
│   │   ├── images.prismic.io/          # Case studies and hero visual photography
│   │   ├── favicon.svg, favicon.ico    # Platform brand icons
│   │   ├── robots.txt, sitemap.xml     # SEO crawlers metadata
│   │   └── print.svg, print-static.svg # Vector printer icons
│   └── src/
│       ├── main.jsx                    # React DOM root render
│       ├── App.jsx                     # Root application wrapper with ToastContainer
│       ├── app/
│       │   ├── providers.jsx           # Combined Context Providers (Toast, Auth, Notif)
│       │   └── router.jsx              # React Router v6 tree with ProtectedRoute
│       ├── components/                 # Reusable UI components
│       │   ├── layout/                 # Navbar, Footer
│       │   ├── navigation/             # AccountMenuDropdown, RoleSwitch
│       │   ├── notifications/          # NotificationDropdown
│       │   ├── jobs/                   # JobCard, JobFilterPanel, ApplyModal
│       │   ├── companies/              # CompanyCard
│       │   └── interviews/             # InterviewBookingModal
│       ├── context/                    # AuthContext, NotificationContext, ToastContext
│       ├── hooks/                      # Custom React hooks (useAuth, useNotifications)
│       ├── pages/                      # 19 Full-featured React page views
│       ├── services/                   # apiClient & 9 feature services
│       ├── styles/                     # Pure CSS Design System (NO Tailwind)
│       └── tests/                      # Frontend Vitest suites (App, Auth, Jobs, Navbar)
│
└── scripts/                            # Operational & Verification Scripts
    ├── run_acceptance_tests.js         # 105 end-to-end acceptance test scenarios
    ├── test_security_audit_controls.js # 35 production security controls test suite
    ├── test_user_persistence.js        # Live MongoDB Atlas user signup/re-login test
    ├── test_storage_persistence.js     # Physical disk storage & path traversal test
    ├── test_resend_email_workflows.js  # Resend SMTP transactional delivery test
    ├── test_atlas_crud_persistence.js  # MongoDB Atlas CRUD verification
    └── send_email_verification.js      # One-shot transactional email verification
```

---

## 3. Prerequisites

- **Node.js**: `v18.0.0` or higher (tested on Node `v20.x LTS` and `v24.x`).
- **npm**: `v9.0.0` or higher.
- **MongoDB**: MongoDB Atlas M0+ cluster or local MongoDB 6.0+.

---

## 4. Environment Configuration

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and configure your credentials:

```bash
# Server & Environment
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# MongoDB Atlas Database
MONGODB_URI=mongodb+srv://<username>:<password>@hireconnect.qxdwa8s.mongodb.net/hireconnect?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your-secure-random-32-byte-hex-secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-secure-refresh-32-byte-hex-secret
JWT_REFRESH_EXPIRES_IN=30d

# Resend SMTP Email Delivery
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=resend
SMTP_PASS=re_your_resend_api_key
EMAIL_FROM="HireConnect <onboarding@resend.dev>"

# File Storage Configuration
STORAGE_PROVIDER=local
STORAGE_LOCAL_DIR=./uploads
STORAGE_MAX_FILE_SIZE_MB=5
```

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 5. Installation & Setup

Install dependencies for all workspaces:

```bash
# 1. Install root dependencies
npm install

# 2. Install backend dependencies
cd backend && npm install && cd ..

# 3. Install frontend dependencies
cd frontend && npm install && cd ..
```

---

## 6. Running the Application (Development)

Run the backend and frontend development servers concurrently:

### Option A: Using Root npm Scripts

Terminal 1 (Backend API):
```bash
npm run dev:backend
```
Backend starts on **http://localhost:5000**.

Terminal 2 (Frontend Dev Server):
```bash
npm run dev:frontend
```
Frontend starts on **http://localhost:5173** (with automatic `/api` and `/uploads` proxy to port 5000).

### Option B: Running Directly in Workspaces

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## 7. Building for Production

Compile the React 18 frontend into production-ready static assets:

```bash
npm run build
```

This invokes Vite to build optimized bundles into `frontend/dist/`.

To start the production backend server:
```bash
npm start
```

---

## 8. Automated Testing Suite

HireConnect features comprehensive multi-layered automated test coverage.

### Run All Unit & Integration Tests (Backend + Frontend)
```bash
npm test
```

### Run Backend Unit Tests (313 Tests across 15 Suites)
```bash
npm run test:backend
```

### Run Frontend Component & Router Tests (9 Tests across 4 Suites)
```bash
npm run test:frontend
```

### Run End-to-End Acceptance Tests (105 Scenarios)
```bash
npm run test:acceptance
```
Validates the complete 28-scenario lifecycle against the live running API: private profiles, resume download permissions, company verification gates, job pause/close consistency, 6-factor talent matching, recruiter availability discovery, interview booking with atomic conflict prevention, notifications, admin moderation, and analytics CSV exports.

### Run Production Security Audit (35 Controls)
```bash
npm run test:security
```
Validates 401 unauthenticated protection, 403 RBAC boundaries, magic-byte binary inspection, path traversal protection, NoSQL injection neutralization, CORS enforcement, and sensitive credential omission.

### Run Live User Persistence Test
```bash
npm run test:persistence
```
Registers live candidate and recruiter accounts in MongoDB Atlas, updates profiles, uploads resumes, applies to jobs, bookmarks openings, wipes sessions, and verifies 100% data restoration upon re-login.

### Run File Storage & Cold Restart Verification
```bash
npm run test:storage
```
Tests avatar and resume disk persistence, binary validation, path traversal guards, and cold backend restarts.

---

## 9. Database & Indexes

To ensure high-performance queries and enforce uniqueness constraints across MongoDB Atlas:

```bash
npm run db:indexes
```

This synchronizes compound indexes across all 16 collections:
- `users`: `{ email: 1 }`, `{ role: 1 }`
- `jobs`: `{ status: 1, createdAt: -1 }`, `{ slug: 1 }`, `{ company: 1 }`, text index on `{ title, description, skills }`
- `meetings`: `{ recruiter: 1, startAt: 1 }`, `{ candidate: 1, startAt: 1 }`, `{ reference: 1 }`
- `applications`: `{ candidate: 1, job: 1 }`, `{ status: 1 }`
- `notifications`: `{ user: 1, isRead: 1, createdAt: -1 }`

---

## 10. Admin Bootstrap & Background Workers

### Bootstrap Initial Platform Administrator
```bash
npm run bootstrap:admin
```
Prompts or seeds the primary platform administrator (`admin@hireconnect.io`) with privileged access to the Administrative Command Center.

### Background Interview Reminder Worker
```bash
npm run worker:reminders
```
Runs the automated background reminder service that checks upcoming interviews, delivers 24-hour and 1-hour transactional reminder emails via Resend SMTP, and records notification outbox records.

---

## 11. Security & Storage Architecture

- **Private Resumes**: Stored outside public web roots in `backend/uploads/resumes/`. Download requests require active JWT authentication and ownership validation (candidate owner or recruiter with an active application review).
- **Public Avatars**: Stored in `backend/uploads/avatars/` and served via sanitized HTTP streams with long-lived client caching headers (`Cache-Control: public, max-age=86400`).
- **Binary Signature Inspection**: Uploads are inspected using magic-byte headers to reject renamed executables or malicious payloads disguised as PDFs or images.
- **Path Traversal Defense**: All storage keys are strictly validated with `path.relative` boundaries to prevent directory escape attacks.
- **Zero Secret Leakage**: Database connection strings, SMTP passwords, and JWT secrets are never logged or exposed to client bundles.

---

## 12. API Reference & Client Services

The React frontend interacts with the backend through modular services located in `frontend/src/services/`:

| Service | File | Key Endpoints | Description |
| :--- | :--- | :--- | :--- |
| `authService` | `authService.js` | `/api/auth/*` | Login, Registration, Logout, Current User, Password Reset |
| `jobService` | `jobService.js` | `/api/jobs/*`, `/api/recruiter/jobs/*` | Public discovery, filtering, CRUD lifecycle, draft/publish |
| `applicationService` | `applicationService.js` | `/api/applications/*`, `/api/saved-jobs/*` | Direct apply, candidate tracking, recruiter review, bookmarks |
| `profileService` | `profileService.js` | `/api/candidates/*`, `/api/recruiters/*` | Candidate/Recruiter profiles, avatar upload, resume upload/download |
| `companyService` | `companyService.js` | `/api/companies/*` | Company directory, public profiles, recruiter organization setup |
| `matchingService` | `matchingService.js` | `/api/matching/*` | 6-factor candidate match recommendations and recruiter talent match |
| `interviewService` | `interviewService.js` | `/api/meetings/*`, `/api/recruiters/:id/availability` | Availability slots, booking with conflict prevention, reschedule, cancel |
| `notificationService` | `notificationService.js` | `/api/notifications/*` | In-app alerts, unread counts, mark-as-read, email preferences |
| `analyticsService` | `analyticsService.js` | `/api/admin/analytics/*`, `/api/analytics/*` | Platform metrics, funnel conversion, CSV export, candidate activity |

---

## License

This project is proprietary and confidential. Built for HireConnect.
