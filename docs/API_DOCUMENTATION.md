# HireConnect RESTful API Documentation

Comprehensive technical API documentation for the **HireConnect Recruitment & Talent Matching Platform**. This document covers all endpoints exposed by the Node.js/Express backend server mounted under `/api`.

- **Base URL (Local)**: `http://localhost:5000/api`
- **Base URL (Production)**: `https://hireconnect-backend-tdb0.onrender.com/api`
- **Standard Protocol**: HTTPS / REST JSON
- **Authentication**: JWT Bearer token in header (`Authorization: Bearer <token>`) or HttpOnly cookie (`hireconnect_access_token`).

---

## Table of Contents

1. [Standard Response & Error Formats](#1-standard-response--error-formats)
2. [Health & System Diagnostics](#2-health--system-diagnostics)
3. [Authentication & Session Management](#3-authentication--session-management)
4. [Candidate Profile & Resume Management](#4-candidate-profile--resume-management)
5. [Recruiter Profile Management](#5-recruiter-profile-management)
6. [User & Avatar Streaming](#6-user--avatar-streaming)
7. [Company Management & Governance](#7-company-management--governance)
8. [Job Management & Public Discovery](#8-job-management--public-discovery)
9. [Application Lifecycle & Review Pipeline](#9-application-lifecycle--review-pipeline)
10. [Saved Jobs (Candidate Bookmarks)](#10-saved-jobs-candidate-bookmarks)
11. [Talent Match & Intelligent Matching](#11-talent-match--intelligent-matching)
12. [Meeting Scheduler & Recruiter Availability](#12-meeting-scheduler--recruiter-availability)
13. [In-App Notifications & Preferences](#13-in-app-notifications--preferences)
14. [Recruitment & Platform Analytics](#14-recruitment--platform-analytics)
15. [Platform Administration & Moderation](#15-platform-administration--moderation)

---

## 1. Standard Response & Error Formats

### Success Response Envelope
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { ... }
}
```

### Error Response Envelope
```json
{
  "success": false,
  "message": "User-friendly error explanation.",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email address."
    }
  ]
}
```

### Common HTTP Status Codes
| Status Code | Meaning | Typical Usage |
| :--- | :--- | :--- |
| `200 OK` | Request succeeded | Standard read/update operations |
| `201 Created` | Resource created | Registrations, job creation, application submission |
| `204 No Content` | Action succeeded with no body | Account deletion, session revocation |
| `400 Bad Request` | Validation failure / invalid syntax | Missing required fields, schema validation failure |
| `401 Unauthorized` | Missing or invalid authentication token | Expired JWT, unauthenticated calls |
| `403 Forbidden` | Authenticated user lacks required role | Candidate trying to post a job |
| `404 Not Found` | Requested resource does not exist | Invalid job ID, user not found |
| `409 Conflict` | Unique constraint violation | Email already registered, slot already booked |
| `429 Too Many Requests` | Rate limit exceeded | Password reset brute-force defense |
| `500 Internal Server Error` | Unexpected server condition | Unhandled database or runtime exception |

---

## 2. Health & System Diagnostics

Base path: `/api/health`

### 2.1 Full Platform Health
- **URL**: `GET /api/health`
- **Auth**: None (Public)
- **Description**: Returns server uptime, memory usage, MongoDB connection state, and email subsystem status.
- **Success Response (200 OK)**:
```json
{
  "status": "healthy",
  "timestamp": "2026-11-06T12:00:00.000Z",
  "uptime": 1420.5,
  "database": {
    "status": "connected",
    "name": "hireconnect"
  },
  "email": {
    "provider": "gmail-api",
    "status": "connected"
  }
}
```

### 2.2 Container Liveness Probe
- **URL**: `GET /api/health/live`
- **Auth**: None (Public)
- **Description**: Lightweight Kubernetes/Docker liveness probe returning HTTP 200 if the Node.js process is responsive.
- **Success Response (200 OK)**:
```json
{ "status": "ok" }
```

### 2.3 Container Readiness Probe
- **URL**: `GET /api/health/ready`
- **Auth**: None (Public)
- **Description**: Readiness check verifying MongoDB replica set or standalone connection is alive.
- **Success Response (200 OK)**:
```json
{ "status": "ready", "dbState": 1 }
```

### 2.4 Email Service Health
- **URL**: `GET /api/health/email`
- **Auth**: None (Public)
- **Description**: Tests Google Gmail API OAuth 2.0 token freshness and transport readiness without sending an email.
- **Success Response (200 OK)**:
```json
{
  "status": "connected",
  "provider": "gmail-api",
  "verificationResult": {
    "success": true,
    "provider": "gmail-api",
    "sender": "sabari1082005@gmail.com",
    "scopes": ["https://www.googleapis.com/auth/gmail.send"]
  }
}
```

### 2.5 Send Diagnostic Test Email
- **URL**: `POST /api/health/email/test`
- **Auth**: None (Public)
- **Body**:
```json
{
  "to": "test-recipient@example.com"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Diagnostic email sent successfully via Gmail API.",
  "messageId": "18f9218d6a894a7e"
}
```

---

## 3. Authentication & Session Management

Base path: `/api/auth`

### 3.1 Register User
- **URL**: `POST /api/auth/register`
- **Auth**: None (Public)
- **Rate Limit**: 10 requests / 15 minutes
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "role": "candidate"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Account created successfully.",
  "user": {
    "id": "672b1234567890abcdef1001",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "candidate",
    "isEmailVerified": true,
    "avatarUrl": null
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```
- **Error Response (409 Conflict)**:
```json
{
  "success": false,
  "message": "An account with this email address already exists.",
  "code": "EMAIL_ALREADY_EXISTS"
}
```

### 3.2 Login User
- **URL**: `POST /api/auth/login`
- **Auth**: None (Public)
- **Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logged in successfully.",
  "user": {
    "id": "672b1234567890abcdef1001",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "candidate"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```
- **Error Response (401 Unauthorized)**:
```json
{
  "success": false,
  "message": "Invalid email or password.",
  "code": "INVALID_CREDENTIALS"
}
```

### 3.3 Google OAuth Authentication
- **URL**: `POST /api/auth/google`
- **Auth**: None (Public)
- **Body**:
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIs...",
  "role": "candidate"
}
```
- **Success Response (200 OK)**: Returns standard user profile and tokens.

### 3.4 Refresh Access Token
- **URL**: `POST /api/auth/refresh`
- **Auth**: None (Reads refresh token from body or HttpOnly cookie)
- **Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

### 3.5 Logout
- **URL**: `POST /api/auth/logout`
- **Auth**: Optional / Reads session token to invalidate in database.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Session terminated successfully."
}
```

### 3.6 Forgot Password
- **URL**: `POST /api/auth/forgot-password`
- **Auth**: None (Public)
- **Body**:
```json
{
  "email": "john.doe@example.com"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "If that email is registered, a password reset link has been dispatched."
}
```

### 3.7 Reset Password
- **URL**: `POST /api/auth/reset-password`
- **Auth**: None (Public)
- **Body**:
```json
{
  "token": "4a7b3c2e1f9a8d7e6c5b4a3...",
  "password": "NewStrongPassword456!"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Password updated successfully. Please log in with your new credentials."
}
```

### 3.8 Get Current User Session
- **URL**: `GET /api/auth/me`
- **Auth**: Required (`candidate`, `recruiter`, or `admin`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id": "672b1234567890abcdef1001",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "candidate",
    "isEmailVerified": true,
    "avatarUrl": null,
    "lastLoginAt": "2026-11-06T11:45:00.000Z"
  }
}
```

### 3.9 Change Password
- **URL**: `POST /api/auth/change-password`
- **Auth**: Required
- **Body**:
```json
{
  "currentPassword": "SecurePassword123!",
  "newPassword": "BrandNewPassword789!"
}
```
- **Success Response (200 OK)**:
```json
{ "success": true, "message": "Password changed successfully." }
```

### 3.10 List Active Sessions
- **URL**: `GET /api/auth/sessions`
- **Auth**: Required
- **Success Response (200 OK)**: Returns list of user's active device sessions with IP and user agent.

### 3.11 Revoke Other Sessions
- **URL**: `POST /api/auth/sessions/revoke-others`
- **Auth**: Required
- **Success Response (200 OK)**: Invalidation of all other refresh tokens for security.

### 3.12 Delete Account
- **URL**: `POST /api/auth/delete-account`
- **Auth**: Required
- **Body**:
```json
{ "password": "SecurePassword123!" }
```
- **Success Response (200 OK)**:
```json
{ "success": true, "message": "Account has been permanently deleted." }
```

---

## 4. Candidate Profile & Resume Management

Base path: `/api/candidates`

### 4.1 Get My Profile
- **URL**: `GET /api/candidates/me`
- **Auth**: Required (`candidate`, `employee`, `admin`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "profile": {
    "user": "672b1234567890abcdef1001",
    "headline": "Senior Full-Stack Engineer | React & Node.js",
    "location": "San Francisco, CA",
    "bio": "Passionate software architect with 6 years experience in distributed systems.",
    "skills": ["JavaScript", "React", "Node.js", "MongoDB", "Docker", "TypeScript"],
    "experienceYears": 6,
    "education": [
      {
        "institution": "University of California, Berkeley",
        "degree": "B.S. Computer Science",
        "startYear": 2016,
        "endYear": 2020
      }
    ],
    "workExperience": [
      {
        "company": "TechCorp",
        "title": "Software Engineer",
        "startDate": "2020-07-01T00:00:00.000Z",
        "isCurrent": true,
        "description": "Architected microservices handling 2M daily API requests."
      }
    ],
    "desiredRoles": ["Senior Full Stack Engineer", "Backend Architect"],
    "desiredSalary": {
      "min": 140000,
      "max": 180000,
      "currency": "USD"
    },
    "visibility": "public"
  }
}
```

### 4.2 Update My Profile
- **URL**: `PATCH /api/candidates/me` (also supports `PUT /api/profiles/candidate`)
- **Auth**: Required (`candidate`, `employee`, `admin`)
- **Body**: Partial candidate profile fields to update.
- **Success Response (200 OK)**: Returns updated profile object.

### 4.3 Upload Candidate Resume (PDF / DOCX)
- **URL**: `POST /api/candidates/me/resume`
- **Auth**: Required (`candidate`, `employee`, `admin`)
- **Content-Type**: `multipart/form-data` (Field: `resume`)
- **File Constraints**: Max 5 MB, extensions: `.pdf`, `.doc`, `.docx`.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Resume uploaded successfully.",
  "resume": {
    "assetId": "672b2234567890abcdef1002",
    "originalName": "John_Doe_Resume_2026.pdf",
    "mimeType": "application/pdf",
    "sizeBytes": 245120,
    "uploadedAt": "2026-11-06T12:05:00.000Z"
  }
}
```

### 4.4 Download Resume
- **URL**: `GET /api/candidates/me/resume/download`
- **Auth**: Required
- **Success Response (200 OK)**: Streams binary PDF/DOCX file with `Content-Disposition: attachment`.

### 4.5 Delete Resume
- **URL**: `DELETE /api/candidates/me/resume`
- **Auth**: Required
- **Success Response (200 OK)**:
```json
{ "success": true, "message": "Resume asset removed." }
```

### 4.6 Candidate Discovery (For Recruiters)
- **URL**: `GET /api/candidates/discover`
- **Auth**: Required (`recruiter`, `admin`)
- **Query Parameters**:
  - `query`: Keyword search (name, headline, bio)
  - `skills`: Comma-separated list of required skills
  - `experienceMin`: Minimum years of experience
  - `page`: Page index (default: `1`)
  - `limit`: Items per page (default: `20`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "candidates": [ ... ],
  "pagination": { "page": 1, "limit": 20, "total": 45, "pages": 3 }
}
```

### 4.7 View Public Candidate Profile
- **URL**: `GET /api/candidates/:userId` (also `/api/profiles/:userId`)
- **Auth**: Optional (Respects candidate visibility settings)
- **Success Response (200 OK)**: Public profile object with sanitized personal contact info.

---

## 5. Recruiter Profile Management

Base path: `/api/recruiters`

### 5.1 Get Recruiter Profile
- **URL**: `GET /api/recruiters/me`
- **Auth**: Required (`recruiter`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "profile": {
    "user": "672b3334567890abcdef1003",
    "company": {
      "_id": "672b4434567890abcdef1004",
      "name": "Stripe Technologies",
      "slug": "stripe-technologies",
      "logoUrl": "/api/companies/logo/stripe.png",
      "isVerified": true
    },
    "title": "Principal Talent Partner",
    "department": "Engineering Recruitment",
    "phone": "+1-415-555-0199",
    "hiringDisciplines": ["Full Stack", "Distributed Systems", "Data Science"],
    "bio": "Leading tech recruitment at Stripe."
  }
}
```

### 5.2 Update Recruiter Profile
- **URL**: `PATCH /api/recruiters/me` (also `PUT /api/profiles/recruiter`)
- **Auth**: Required (`recruiter`)
- **Body**: Partial update of title, department, phone, hiring disciplines, and bio.
- **Success Response (200 OK)**: Returns updated recruiter profile.

---

## 6. User & Avatar Streaming

Base path: `/api/users`

### 6.1 Upload Avatar Image
- **URL**: `POST /api/users/me/avatar`
- **Auth**: Required
- **Content-Type**: `multipart/form-data` (Field: `avatar`)
- **Constraints**: Max 2 MB, `.png`, `.jpg`, `.jpeg`, `.webp`.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Avatar uploaded successfully.",
  "avatarUrl": "/api/users/avatar/avatar-672b1234567890abcdef1001-1793800000000.png"
}
```

### 6.2 Stream Avatar Image
- **URL**: `GET /api/users/avatar/:key`
- **Auth**: None (Public CDN-style streaming)
- **Response**: Binary image stream with `Cache-Control: public, max-age=86400, immutable`.

### 6.3 Delete Avatar Image
- **URL**: `DELETE /api/users/me/avatar`
- **Auth**: Required
- **Success Response (200 OK)**: Resets user avatar to default placeholder.

---

## 7. Company Management & Governance

Base path: `/api/companies`

### 7.1 Discover Companies (Directory)
- **URL**: `GET /api/companies`
- **Auth**: None (Public)
- **Query Parameters**:
  - `search`: Company name search
  - `industry`: Industry filter (e.g. `Fintech`, `Healthcare`)
  - `verified`: Boolean (`true` for verified badges only)
  - `page`: Page index (default: `1`)
  - `limit`: Items per page (default: `12`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "companies": [
    {
      "id": "672b4434567890abcdef1004",
      "name": "Stripe Technologies",
      "slug": "stripe-technologies",
      "logoUrl": "/api/companies/logo/stripe.png",
      "industry": "Fintech & Payments",
      "headquarters": "San Francisco, CA",
      "isVerified": true,
      "activeJobsCount": 8
    }
  ],
  "pagination": { "page": 1, "limit": 12, "total": 1, "pages": 1 }
}
```

### 7.2 Get Company Details
- **URL**: `GET /api/companies/:slugOrId`
- **Auth**: None (Public)
- **Success Response (200 OK)**: Returns full company overview, culture, perks, and active job listings.

### 7.3 Create Company (Recruiter / Admin)
- **URL**: `POST /api/companies` (also `POST /api/companies/register`)
- **Auth**: Required (`recruiter`, `admin`)
- **Body**:
```json
{
  "name": "Acme Innovations",
  "website": "https://acme.io",
  "industry": "Cloud Infrastructure",
  "companySize": "51-200",
  "headquarters": "New York, NY",
  "description": "Building next-generation edge storage solutions."
}
```
- **Success Response (201 Created)**: Automatically creates company and binds creator as `owner`.

### 7.4 Update Company Profile
- **URL**: `PATCH /api/companies/:id` (also `PUT /api/companies/:id`)
- **Auth**: Required (User must be Company `owner` or `admin`)
- **Body**: Updates to description, website, perks, social links, or headquarters.
- **Success Response (200 OK)**: Returns updated company object.

### 7.5 Upload Company Logo
- **URL**: `POST /api/companies/:id/logo`
- **Auth**: Required (`owner` or `admin`)
- **Content-Type**: `multipart/form-data` (Field: `avatar`)
- **Success Response (200 OK)**: Returns `logoUrl`.

### 7.6 Stream Company Logo
- **URL**: `GET /api/companies/logo/:key`
- **Auth**: None (Public streaming with immutable browser caching).

### 7.7 Submit Company Verification Request
- **URL**: `POST /api/companies/:id/verification-request`
- **Auth**: Required (`owner` or `admin`)
- **Body**:
```json
{
  "businessRegistrationNumber": "US-DEL-98765432",
  "corporateEmailDomain": "acme.io",
  "documents": ["https://storage.hireconnect.io/docs/acme-cert.pdf"]
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Verification request submitted for administrative review.",
  "requestId": "672b5534567890abcdef1005"
}
```

### 7.8 Manage Company Members & Team Invitations
- `GET /api/companies/:id/members`: List team members and roles (`owner`, `admin`, `recruiter`).
- `POST /api/companies/:id/invitations`: Invite new recruiters to the company organization by email.
- `POST /api/companies/invitations/accept`: Accept invitation via token.
- `PATCH /api/companies/:id/members/:userId`: Promote or change member role.
- `DELETE /api/companies/:id/members/:userId`: Remove recruiter from company team.

---

## 8. Job Management & Public Discovery

Base paths:
- Public Job Discovery: `/api/jobs`
- Recruiter Job Management: `/api/recruiter/jobs`

### 8.1 Search & Filter Public Jobs
- **URL**: `GET /api/jobs`
- **Auth**: Optional
- **Query Parameters**:
  - `keyword`: Title or keyword match
  - `location`: City or region filter
  - `remote`: Boolean (`true` for remote jobs)
  - `jobType`: `Full-time`, `Part-time`, `Contract`, `Internship`
  - `experienceLevel`: `Entry-level`, `Mid-level`, `Senior-level`, `Lead`
  - `salaryMin`: Minimum base salary
  - `page`: Page index (default: `1`)
  - `limit`: Items per page (default: `12`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "jobs": [
    {
      "id": "672b6634567890abcdef1006",
      "title": "Senior Frontend Engineer",
      "slug": "senior-frontend-engineer-672b66",
      "company": {
        "name": "Stripe Technologies",
        "logoUrl": "/api/companies/logo/stripe.png",
        "isVerified": true
      },
      "location": "San Francisco, CA",
      "isRemote": true,
      "jobType": "Full-time",
      "experienceLevel": "Senior-level",
      "salaryRange": { "min": 150000, "max": 190000, "currency": "USD" },
      "requiredSkills": ["React", "TypeScript", "Tailwind CSS"],
      "publishedAt": "2026-11-06T10:00:00.000Z",
      "applicantsCount": 12
    }
  ],
  "pagination": { "page": 1, "limit": 12, "total": 24, "pages": 2 }
}
```

### 8.2 Get Job Details by ID or Slug
- **URL**: `GET /api/jobs/:idOrSlug`
- **Auth**: Optional
- **Success Response (200 OK)**: Full job specifications, responsibilities, benefits, and hiring team details.

### 8.3 Create Job Listing (Recruiter)
- **URL**: `POST /api/recruiter/jobs` (also `POST /api/jobs/create`)
- **Auth**: Required (`recruiter`, `admin`)
- **Body**:
```json
{
  "title": "Full Stack Engineer",
  "description": "Join our fast-growing engineering team building real-time applications.",
  "department": "Engineering",
  "location": "Remote",
  "isRemote": true,
  "jobType": "Full-time",
  "experienceLevel": "Mid-level",
  "requiredSkills": ["Node.js", "React", "MongoDB"],
  "preferredSkills": ["Docker", "GraphQL"],
  "salaryRange": {
    "min": 120000,
    "max": 150000,
    "currency": "USD"
  },
  "status": "published"
}
```
- **Success Response (201 Created)**: Returns created job object. Auto-triggers recruiter and admin email notifications when status is `published`.

### 8.4 Update Job Listing
- **URL**: `PATCH /api/recruiter/jobs/:id` (also `PUT /api/recruiter/jobs/:id`)
- **Auth**: Required (`recruiter`, `admin` belonging to posting company)
- **Body**: Fields to update.
- **Success Response (200 OK)**: Returns updated job.

### 8.5 Publish / Pause / Close Job
- `POST /api/recruiter/jobs/:id/publish` (or `PATCH`): Transitions job status to `published` and dispatches notification emails.
- `POST /api/recruiter/jobs/:id/pause` (or `PATCH`): Sets status to `paused`.
- `POST /api/recruiter/jobs/:id/close` (or `PATCH`): Sets status to `closed`.

---

## 9. Application Lifecycle & Review Pipeline

Base path: `/api/applications` and `/api/recruiter/applications`

### 9.1 Apply to a Job (Candidate)
- **URL**: `POST /api/applications` or `POST /api/jobs/:jobId/apply`
- **Auth**: Required (`candidate`, `employee`)
- **Body**:
```json
{
  "jobId": "672b6634567890abcdef1006",
  "coverLetter": "I am thrilled to apply for this Senior Frontend Engineer opening...",
  "portfolioLinks": ["https://github.com/johndoe", "https://johndoe.dev"],
  "phone": "+1-555-0144"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Application submitted successfully.",
  "application": {
    "id": "672b7734567890abcdef1007",
    "status": "applied",
    "appliedAt": "2026-11-06T12:30:00.000Z",
    "job": "672b6634567890abcdef1006"
  }
}
```
- **Triggers**: Dispatches dual confirmation emails to the candidate and recruiter/admin.
- **Error Response (409 Conflict)**:
```json
{
  "success": false,
  "message": "You have already submitted an active application for this position.",
  "code": "ALREADY_APPLIED"
}
```

### 9.2 Get Candidate's Applications
- **URL**: `GET /api/applications/me` (or `GET /api/applications` for candidates)
- **Auth**: Required (`candidate`)
- **Success Response (200 OK)**: Returns list of candidate's applications with populated job and company snapshots.

### 9.3 Get Recruiter Applicant Pipeline
- **URL**: `GET /api/recruiter/applications` or `GET /api/applications/recruiter`
- **Auth**: Required (`recruiter`, `admin`)
- **Query Parameters**:
  - `jobId`: Filter by specific job
  - `status`: `applied`, `screening`, `interviewing`, `offered`, `hired`, `rejected`
  - `search`: Applicant name or email
  - `page`: Page index (default: `1`)
  - `limit`: Items per page (default: `20`)
- **Success Response (200 OK)**: Returns paginated applicant records with candidate profile snapshots and match scores.

### 9.4 Update Application Status (Recruiter Review)
- **URL**: `PATCH /api/applications/:id/status`
- **Auth**: Required (`recruiter`, `admin`)
- **Body**:
```json
{
  "status": "interviewing",
  "feedback": "Resume strongly matches candidate criteria. Moving to technical round."
}
```
- **Success Response (200 OK)**: Updates status, appends to audit history, and dispatches in-app and email status notifications.

### 9.5 Add Recruiter Internal Note
- **URL**: `POST /api/applications/:id/notes`
- **Auth**: Required (`recruiter`, `admin`)
- **Body**:
```json
{
  "note": "Candidate completed initial coding challenge with 98% score."
}
```
- **Success Response (201 Created)**: Returns updated notes thread.

### 9.6 Candidate Withdraw Application
- **URL**: `PATCH /api/applications/:id/withdraw`
- **Auth**: Required (`candidate`)
- **Success Response (200 OK)**: Transitions status to `withdrawn`.

---

## 10. Saved Jobs (Candidate Bookmarks)

Base path: `/api/saved-jobs`

### 10.1 List Saved Jobs
- **URL**: `GET /api/saved-jobs`
- **Auth**: Required (`candidate`, `employee`)
- **Success Response (200 OK)**: Returns all bookmarked jobs with live salary and status indicators.

### 10.2 Save / Bookmark a Job
- **URL**: `POST /api/saved-jobs/:jobId` (or `POST /api/jobs/:jobId/save`)
- **Auth**: Required (`candidate`, `employee`)
- **Success Response (201 Created)**:
```json
{ "success": true, "message": "Job added to your saved bookmarks." }
```

### 10.3 Unsave / Remove Bookmark
- **URL**: `DELETE /api/saved-jobs/:jobId` (or `DELETE /api/jobs/:jobId/save`)
- **Auth**: Required (`candidate`, `employee`)
- **Success Response (200 OK)**:
```json
{ "success": true, "message": "Job removed from saved bookmarks." }
```

### 10.4 Check if Job is Saved
- **URL**: `GET /api/saved-jobs/:jobId/check`
- **Auth**: Required
- **Success Response (200 OK)**:
```json
{ "success": true, "isSaved": true }
```

---

## 11. Talent Match & Intelligent Matching

Base path: `/api/matching` and `/api/talent-match`

### 11.1 Candidate Recommended Jobs (AI Match)
- **URL**: `GET /api/matching/jobs` (or `/api/matching/candidate/recommendations`)
- **Auth**: Required (`candidate`, `employee`)
- **Algorithm**: 6-factor composite scoring engine:
  - Skill overlap (40%)
  - Experience level alignment (20%)
  - Salary expectation match (15%)
  - Remote/Location preference (10%)
  - Education compatibility (10%)
  - Profile completeness bonus (5%)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "matches": [
    {
      "job": {
        "id": "672b6634567890abcdef1006",
        "title": "Senior Frontend Engineer",
        "companyName": "Stripe Technologies",
        "location": "San Francisco, CA"
      },
      "matchScore": 94,
      "breakdown": {
        "skillsScore": 95,
        "experienceScore": 90,
        "salaryScore": 100,
        "locationScore": 100
      },
      "matchedSkills": ["React", "TypeScript", "Node.js"],
      "missingSkills": ["GraphQL"]
    }
  ]
}
```

### 11.2 Recruiter Candidate Recommendations for Job
- **URL**: `GET /api/matching/job/:jobId` (or `/api/recruiter/jobs/:jobId/matches`)
- **Auth**: Required (`recruiter`, `admin`)
- **Success Response (200 OK)**: Returns ranked list of top candidate profiles with 0-100% suitability match scores and skill highlights.

---

## 12. Meeting Scheduler & Recruiter Availability

Base paths:
- Availability: `/api/recruiter/availability`
- Meeting Management: `/api/meetings`
- Public Booking Slots: `/api/recruiters/:recruiterId/available-slots`

### 12.1 Get Recruiter Availability Schedule
- **URL**: `GET /api/recruiter/availability`
- **Auth**: Required (`recruiter`, `admin`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "availability": {
    "weeklySchedule": [
      {
        "day": "monday",
        "slots": [{ "startTime": "09:00", "endTime": "17:00" }]
      },
      {
        "day": "tuesday",
        "slots": [{ "startTime": "09:00", "endTime": "17:00" }]
      }
    ],
    "timezone": "America/Los_Angeles",
    "meetingDuration": 45,
    "bufferTime": 15,
    "bookingNoticeHours": 24
  }
}
```

### 12.2 Update Recruiter Availability Schedule
- **URL**: `PUT /api/recruiter/availability`
- **Auth**: Required (`recruiter`, `admin`)
- **Body**: Updated weekly schedule, duration, buffer times, and timezone.
- **Success Response (200 OK)**: Returns updated availability.

### 12.3 Recruiter Availability Exceptions (Overrides & Blackouts)
- `GET /api/recruiter/availability/exceptions`: List date overrides.
- `POST /api/recruiter/availability/exceptions`: Add date blackout (e.g. holiday or vacation).
- `DELETE /api/recruiter/availability/exceptions/:exceptionId`: Remove override.

### 12.4 Get Public Available Slots
- **URL**: `GET /api/recruiters/:recruiterId/available-slots`
- **Auth**: None (Public)
- **Query Parameters**:
  - `startDate`: `YYYY-MM-DD`
  - `endDate`: `YYYY-MM-DD`
- **Success Response (200 OK)**: Returns open interview slots with double-booking conflicts excluded.

### 12.5 Book an Interview Session
- **URL**: `POST /api/meetings` (also `POST /api/meetings/book`)
- **Auth**: Required (`candidate`)
- **Body**:
```json
{
  "recruiterId": "672b3334567890abcdef1003",
  "jobId": "672b6634567890abcdef1006",
  "applicationId": "672b7734567890abcdef1007",
  "title": "Technical Round: Senior Frontend Engineer",
  "startTime": "2026-11-12T15:00:00.000Z",
  "endTime": "2026-11-12T15:45:00.000Z",
  "timezone": "America/Los_Angeles",
  "notes": "Looking forward to discussing system architecture."
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Meeting scheduled successfully.",
  "meeting": {
    "id": "672b8834567890abcdef1008",
    "reference": "HC-MTG-883456",
    "status": "scheduled",
    "meetingUrl": "https://meet.jit.si/HireConnect-HC-MTG-883456",
    "startTime": "2026-11-12T15:00:00.000Z",
    "endTime": "2026-11-12T15:45:00.000Z"
  }
}
```
- **Concurrency Protection**: Atomic MongoDB queries guarantee that duplicate booking attempts return `409 Conflict`.

### 12.6 Get My Meetings
- **URL**: `GET /api/meetings` (also `/api/meetings/me`)
- **Auth**: Required
- **Success Response (200 OK)**: Returns list of upcoming and past meetings for the user.

### 12.7 Reschedule Meeting
- **URL**: `PATCH /api/meetings/:meetingId/reschedule`
- **Auth**: Required (Candidate or Recruiter participant)
- **Body**: New `startTime` and `endTime`.
- **Success Response (200 OK)**: Updates meeting time and notifies participants via email.

### 12.8 Cancel Meeting
- **URL**: `PATCH /api/meetings/:meetingId/cancel`
- **Auth**: Required
- **Body**: `{ "cancellationReason": "Conflict with university exam schedule." }`
- **Success Response (200 OK)**: Frees slot and updates status to `cancelled`.

---

## 13. In-App Notifications & Preferences

Base path: `/api/notifications`

### 13.1 Get User Notifications
- **URL**: `GET /api/notifications`
- **Auth**: Required
- **Query Parameters**:
  - `page`: Page index (default: `1`)
  - `limit`: Items per page (default: `20`)
  - `unreadOnly`: Filter unread items (`true`/`false`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "notifications": [
    {
      "id": "672b9934567890abcdef1009",
      "type": "interview_scheduled",
      "title": "Interview Scheduled",
      "message": "Your technical interview with Stripe Technologies is set for Nov 12, 3:00 PM.",
      "isRead": false,
      "link": "/dashboard/candidate/interviews",
      "createdAt": "2026-11-06T12:35:00.000Z"
    }
  ],
  "unreadCount": 1
}
```

### 13.2 Get Unread Notification Count
- **URL**: `GET /api/notifications/unread-count`
- **Auth**: Required
- **Success Response (200 OK)**:
```json
{ "success": true, "unreadCount": 1 }
```

### 13.3 Mark Single Notification Read
- **URL**: `PATCH /api/notifications/:notificationId/read`
- **Auth**: Required
- **Success Response (200 OK)**: `{ "success": true }`

### 13.4 Mark All Notifications Read
- **URL**: `PATCH /api/notifications/read-all`
- **Auth**: Required
- **Success Response (200 OK)**: `{ "success": true, "updatedCount": 5 }`

### 13.5 Dismiss / Delete Notification
- **URL**: `DELETE /api/notifications/:notificationId`
- **Auth**: Required
- **Success Response (200 OK)**: `{ "success": true }`

### 13.6 Notification Delivery Preferences
- `GET /api/notifications/preferences`: Get email and in-app alert flags.
- `PUT /api/notifications/preferences`: Update alert opt-ins.

---

## 14. Recruitment & Platform Analytics

Base path: `/api/analytics`

### 14.1 Candidate Activity Overview
- **URL**: `GET /api/analytics/candidate/overview`
- **Auth**: Required (`candidate`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "stats": {
    "totalApplications": 14,
    "interviewsScheduled": 3,
    "offersReceived": 1,
    "savedJobsCount": 8,
    "profileViews": 42
  }
}
```

### 14.2 Recruiter Performance Overview
- **URL**: `GET /api/analytics/recruiter/overview`
- **Auth**: Required (`recruiter`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "stats": {
    "activeJobsCount": 6,
    "totalApplicants": 128,
    "interviewsConducted": 19,
    "offersExtended": 4,
    "averageTimeToHireDays": 18
  }
}
```

### 14.3 Recruiter Job Funnel Analytics
- **URL**: `GET /api/analytics/recruiter/jobs/:jobId/funnel`
- **Auth**: Required (`recruiter`)
- **Success Response (200 OK)**: Returns drop-off funnel: Applied $\rightarrow$ Screened $\rightarrow$ Interviewed $\rightarrow$ Offered $\rightarrow$ Hired.

### 14.4 Recruiter CSV Export
- **URL**: `GET /api/analytics/recruiter/jobs/export`
- **Auth**: Required (`recruiter`)
- **Success Response (200 OK)**: Streams CSV file with applicant metrics for external reporting.

---

## 15. Platform Administration & Moderation

Base path: `/api/admin` (Strictly restricted to users with `role: "admin"`)

### 15.1 Admin Global Dashboard
- **URL**: `GET /api/admin/dashboard`
- **Auth**: Required (`admin`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "metrics": {
    "usersCount": 1240,
    "candidatesCount": 980,
    "recruitersCount": 260,
    "companiesCount": 85,
    "activeJobsCount": 192,
    "applicationsCount": 3410,
    "pendingCompanyVerifications": 4
  }
}
```

### 15.2 User Governance & Ban Management
- `GET /api/admin/users`: List users with role, status, and registration date filters.
- `GET /api/admin/users/:userId`: Detailed user profile, audit trail, and security logs.
- `PATCH /api/admin/users/:userId/status`: Suspend, ban, or reactivate user (`active`, `suspended`, `banned`).
- `PATCH /api/admin/users/:userId/role`: Elevate or modify role (`candidate`, `recruiter`, `admin`).

### 15.3 Company Verification Queue
- `GET /api/admin/companies/verification-requests`: List pending corporate verification submissions.
- `PATCH /api/admin/companies/:companyId/verification`: Approve or reject verification request with review notes. Sets `isVerified: true` and grants platform verified badge.

### 15.4 Job Moderation
- `GET /api/admin/jobs`: List all platform jobs across companies.
- `PATCH /api/admin/jobs/:jobId/moderation`: Approve, flag, or suppress job posting for policy violations.
- `POST /api/admin/jobs/:jobId/close`: Force-close abusive or expired job.

### 15.5 Platform Audit Logs
- **URL**: `GET /api/admin/audit-logs`
- **Auth**: Required (`admin`)
- **Query Parameters**: `actorId`, `targetType`, `action`, `page`, `limit`
- **Success Response (200 OK)**: Returns immutable platform security logs capturing IP, user agent, actor, target, and before/after payloads.

---

## 16. Summary of Routes & HTTP Methods

| Module | Route Endpoint | HTTP Methods | Auth Requirement |
| :--- | :--- | :--- | :--- |
| **Health** | `/api/health` | `GET` | Public |
| | `/api/health/live` | `GET` | Public |
| | `/api/health/ready` | `GET` | Public |
| | `/api/health/email` | `GET` | Public |
| | `/api/health/email/test` | `POST` | Public |
| **Auth** | `/api/auth/register` | `POST` | Public |
| | `/api/auth/login` | `POST` | Public |
| | `/api/auth/google` | `POST` | Public |
| | `/api/auth/refresh` | `POST` | Public |
| | `/api/auth/logout` | `POST` | Public / Token |
| | `/api/auth/me` | `GET` | Authenticated |
| | `/api/auth/change-password` | `POST` | Authenticated |
| | `/api/auth/sessions` | `GET` | Authenticated |
| | `/api/auth/sessions/revoke-others` | `POST` | Authenticated |
| | `/api/auth/delete-account` | `POST` | Authenticated |
| **Candidates** | `/api/candidates/me` | `GET`, `PATCH` | Candidate, Admin |
| | `/api/candidates/me/resume` | `POST`, `GET`, `DELETE` | Candidate, Admin |
| | `/api/candidates/me/resume/download`| `GET` | Candidate, Admin |
| | `/api/candidates/discover` | `GET` | Recruiter, Admin |
| | `/api/candidates/:userId` | `GET` | Public / Auth |
| **Recruiters** | `/api/recruiters/me` | `GET`, `PATCH` | Recruiter |
| **Users** | `/api/users/me/avatar` | `POST`, `DELETE` | Authenticated |
| | `/api/users/avatar/:key` | `GET` | Public Streaming |
| **Companies** | `/api/companies` | `GET`, `POST` | Public (GET), Recruiter (POST) |
| | `/api/companies/:slugOrId` | `GET` | Public |
| | `/api/companies/:id` | `PATCH`, `PUT` | Company Owner/Admin |
| | `/api/companies/:id/logo` | `POST`, `DELETE` | Company Owner/Admin |
| | `/api/companies/logo/:key` | `GET` | Public Streaming |
| | `/api/companies/:id/verification-request` | `POST` | Company Owner/Admin |
| | `/api/companies/:id/members` | `GET`, `POST` | Company Owner/Admin |
| **Jobs** | `/api/jobs` | `GET` | Public |
| | `/api/jobs/:idOrSlug` | `GET` | Public |
| | `/api/recruiter/jobs` | `GET`, `POST` | Recruiter, Admin |
| | `/api/recruiter/jobs/:id` | `GET`, `PATCH` | Recruiter, Admin |
| | `/api/recruiter/jobs/:id/publish`| `POST`, `PATCH` | Recruiter, Admin |
| | `/api/recruiter/jobs/:id/pause` | `POST`, `PATCH` | Recruiter, Admin |
| | `/api/recruiter/jobs/:id/close` | `POST`, `PATCH` | Recruiter, Admin |
| **Applications**| `/api/applications` | `POST` | Candidate |
| | `/api/applications/me` | `GET` | Candidate |
| | `/api/recruiter/applications` | `GET` | Recruiter, Admin |
| | `/api/applications/:id/status` | `PATCH`, `PUT` | Recruiter, Admin |
| | `/api/applications/:id/notes` | `POST` | Recruiter, Admin |
| | `/api/applications/:id/withdraw`| `PATCH` | Candidate |
| **Saved Jobs** | `/api/saved-jobs` | `GET`, `POST`, `DELETE` | Candidate |
| | `/api/saved-jobs/:jobId/check` | `GET` | Candidate |
| **Talent Match**| `/api/matching/jobs` | `GET` | Candidate |
| | `/api/matching/job/:jobId` | `GET` | Recruiter, Admin |
| **Meetings** | `/api/recruiter/availability` | `GET`, `PUT` | Recruiter, Admin |
| | `/api/recruiters/:recruiterId/available-slots` | `GET` | Public |
| | `/api/meetings` | `GET`, `POST` | Authenticated |
| | `/api/meetings/:meetingId/reschedule` | `PATCH`, `POST` | Authenticated |
| | `/api/meetings/:meetingId/cancel` | `PATCH`, `POST` | Authenticated |
| **Notifications**| `/api/notifications` | `GET` | Authenticated |
| | `/api/notifications/unread-count` | `GET` | Authenticated |
| | `/api/notifications/read-all` | `PATCH` | Authenticated |
| | `/api/notifications/:notificationId/read` | `PATCH` | Authenticated |
| **Analytics** | `/api/analytics/candidate/overview` | `GET` | Candidate |
| | `/api/analytics/recruiter/overview` | `GET` | Recruiter |
| | `/api/analytics/recruiter/jobs/:jobId/funnel` | `GET` | Recruiter |
| | `/api/analytics/admin/overview` | `GET` | Admin |
| **Admin** | `/api/admin/dashboard` | `GET` | Admin |
| | `/api/admin/users` | `GET` | Admin |
| | `/api/admin/users/:userId/status`| `PATCH` | Admin |
| | `/api/admin/companies/verification-requests` | `GET` | Admin |
| | `/api/admin/companies/:companyId/verification` | `PATCH` | Admin |
| | `/api/admin/jobs/:jobId/moderation` | `PATCH` | Admin |
| | `/api/admin/audit-logs` | `GET` | Admin |

---
*Generated for the HireConnect Academic Review (November 2026).*
