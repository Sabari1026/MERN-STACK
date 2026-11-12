import React from 'react';
import { Link } from 'react-router-dom';

export function PrivacyPolicyPage() {
  const lastUpdated = 'November 12, 2026';
  const effectiveDate = 'November 12, 2026';

  const sections = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'information-we-collect', title: '2. Information We Collect' },
    { id: 'candidate-information', title: '3. Candidate Information' },
    { id: 'recruiter-company-information', title: '4. Recruiter & Company Information' },
    { id: 'job-applications-recruitment-data', title: '5. Job Applications & Recruitment Data' },
    { id: 'gmail-api-notifications', title: '6. Gmail API & Email Notifications' },
    { id: 'how-we-use-information', title: '7. How We Use Information' },
    { id: 'data-security', title: '8. Data Security' },
    { id: 'data-retention', title: '9. Data Retention' },
    { id: 'third-party-services', title: '10. Third-Party Services' },
    { id: 'user-rights', title: '11. User Rights' },
    { id: 'contact-information', title: '12. Contact Information' }
  ];

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const elem = document.getElementById(id);
    if (elem) {
      const navOffset = 90;
      const elementPosition = elem.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="site-container-narrow" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Header Section */}
          <div style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span
                style={{
                  fontFamily: 'Saans Mono, monospace',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-accent-purple-light)',
                  backgroundColor: 'var(--color-accent-purple-bg)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontWeight: 600
                }}
              >
                Legal & Transparency
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Platform Policy</span>
            </div>

            <h1
              className="h1"
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
                marginBottom: '16px',
                lineHeight: 1.15
              }}
            >
              Privacy Policy
            </h1>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <span><strong>Effective Date:</strong> {effectiveDate}</span>
              <span>•</span>
              <span><strong>Last Updated:</strong> {lastUpdated}</span>
              <span>•</span>
              <span><strong>Platform:</strong> HireConnect Recruitment Platform</span>
            </div>
          </div>

          {/* Table of Contents Quick Nav */}
          <div
            className="surface-card"
            style={{
              padding: '20px 24px',
              marginBottom: '36px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <span
              style={{
                fontFamily: 'Saans Mono, monospace',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'block',
                marginBottom: '12px'
              }}
            >
              Table of Contents
            </span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '8px 16px'
              }}
            >
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => scrollToSection(e, s.id)}
                  style={{
                    color: 'var(--color-accent-purple-light)',
                    fontSize: '13px',
                    textDecoration: 'none',
                    display: 'inline-block',
                    padding: '2px 0',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-accent-purple-light)')}
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>

          {/* Privacy Commitments Highlight Box */}
          <div
            style={{
              padding: '20px 24px',
              backgroundColor: 'rgba(137, 66, 228, 0.08)',
              border: '1px solid rgba(137, 66, 228, 0.25)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '40px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ color: 'var(--color-accent-mint)', fontSize: '16px' }}>✓</span>
              <strong style={{ color: 'var(--text-primary)', fontSize: '15px' }}>Our Core Privacy Commitments</strong>
            </div>
            <ul style={{ margin: '0', paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              <li><strong>Zero Data Selling:</strong> We do not sell, rent, license, or monetize your personal information to third-party data brokers or advertisers.</li>
              <li><strong>Send-Only Gmail API:</strong> We only request send-only permissions (`https://www.googleapis.com/auth/gmail.send`) to deliver platform notifications. We never access, read, search, or index your personal inboxes.</li>
              <li><strong>Private Resume Storage:</strong> Resumes and uploaded credentials remain private and are never exposed to public search engines.</li>
            </ul>
          </div>

          {/* Main Content Body */}
          <div
            className="surface-card"
            style={{
              padding: 'clamp(24px, 4vw, 44px)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              lineHeight: 1.7,
              fontSize: '15px',
              color: 'var(--text-secondary)'
            }}
          >

            {/* 1. Introduction */}
            <section id="introduction" style={{ marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '14px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                1. Introduction
              </h2>
              <p style={{ marginBottom: '14px' }}>
                Welcome to <strong>HireConnect</strong> ("HireConnect," "we," "us," or "our"). HireConnect is a modern MERN stack recruitment platform engineered to connect job candidates with employers and talent recruiters through verified listings, intelligent skill matching, and interview scheduling workflows.
              </p>
              <p style={{ marginBottom: '14px' }}>
                This Privacy Policy describes how we collect, store, process, and protect your personal information when you access our website (located at <a href="https://mern-stack-9192.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-purple-light)' }}>https://mern-stack-9192.vercel.app</a>) and our application programming interfaces (APIs).
              </p>
              <p>
                By creating an account, browsing job listings, submitting applications, or posting vacancies on HireConnect, you acknowledge that you understand the data handling practices described in this policy.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section id="information-we-collect" style={{ marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '14px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                2. Information We Collect
              </h2>
              <p style={{ marginBottom: '14px' }}>
                We collect personal information directly from you when you register an account, complete your profile, submit documents, post jobs, or schedule interviews. The categories of information collected depend upon your role:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Account Credentials:</strong> Full name, verified email address, encrypted password hash (bcrypt), and account role (Candidate, Recruiter, or Administrator).
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Authentication Data:</strong> Secure JSON Web Tokens (JWT), session cookies, and login timestamps used strictly to maintain secure authenticated sessions.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Technical & Device Data:</strong> IP address, browser user-agent, operating system details, and system request logs collected automatically by our cloud infrastructure (Render and Vercel) for rate limiting, DDoS defense, and operational telemetry.
                </li>
              </ul>
            </section>

            {/* 3. Candidate Information */}
            <section id="candidate-information" style={{ marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '14px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                3. Candidate Information
              </h2>
              <p style={{ marginBottom: '14px' }}>
                When you register or maintain a Candidate account on HireConnect, we process data that you choose to provide in your career profile:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Professional Summary & Bio:</strong> Professional headline, personal summary, years of experience, preferred location, and work mode preference (Remote, Onsite, or Hybrid).
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Skills & Competencies:</strong> Self-reported primary technical skills, proficiency levels, and industry tags used for algorithmic talent matching against active job requirements.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Employment & Educational History:</strong> Previous job titles, employers, employment date ranges, degrees, institutions, and certifications.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Resume & Curriculum Vitae (CV):</strong> Uploaded documents in PDF or DOCX formats. Resumes undergo server-side file signature verification (magic byte inspection) and are stored in private, isolated file storage.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Privacy & Discoverability Controls:</strong> Candidates maintain granular control over profile visibility. When discoverability is disabled, your profile is shielded from recruiter search queries and remains visible only to employers whose jobs you specifically apply for.
                </li>
              </ul>
            </section>

            {/* 4. Recruiter and Company Information */}
            <section id="recruiter-company-information" style={{ marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '14px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                4. Recruiter and Company Information
              </h2>
              <p style={{ marginBottom: '14px' }}>
                To enable corporate hiring on HireConnect, we collect organizational details from verified hiring managers and recruitment partners:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Corporate Profile:</strong> Company legal name, trade name, corporate website URL, industry sector, headquarters location, employee head-count bracket, and corporate description.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Recruiter Identification:</strong> Work email address, job title, and team permissions within the company organization.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Corporate Verification Records:</strong> Company verification status (pending, verified, or rejected) evaluated by platform administrators to prevent impersonation and fraudulent recruitment postings.
                </li>
              </ul>
            </section>

            {/* 5. Job Applications and Recruitment Data */}
            <section id="job-applications-recruitment-data" style={{ marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '14px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                5. Job Applications and Recruitment Data
              </h2>
              <p style={{ marginBottom: '14px' }}>
                When candidate interactions and hiring workflows take place on HireConnect:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Job Applications:</strong> Candidate application submissions, application snapshots, screening question answers, cover notes, and submission timestamps.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Hiring Pipeline Statuses:</strong> Status transitions across the recruitment lifecycle (e.g., Submitted, Under Review, Shortlisted, Interviewing, Offered, Rejected, Withdrawn).
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Recruiter Notes:</strong> Internal evaluation notes authored by recruiters. These notes are restricted to the authorized hiring organization and are never shared with candidates.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Interview Schedules:</strong> Booked interview time slots, meeting references, recruiter availability blocks, timezones, and video conferencing links.
                </li>
              </ul>
            </section>

            {/* 6. Gmail API and Email Notifications */}
            <section id="gmail-api-notifications" style={{ marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '14px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                6. Gmail API and Email Notifications
              </h2>
              <div
                style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px 20px',
                  marginBottom: '18px'
                }}
              >
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                  Google API Limited Use Disclosure
                </strong>
                <p style={{ fontSize: '14px', margin: 0, color: 'var(--text-secondary)' }}>
                  HireConnect's use and transfer of information received from Google APIs adheres strictly to the{' '}
                  <a
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--color-info)', textDecoration: 'underline' }}
                  >
                    Google API Services User Data Policy
                  </a>
                  , including the Limited Use requirements.
                </p>
              </div>
              <p style={{ marginBottom: '14px' }}>
                HireConnect uses the official <strong>Google Gmail REST API</strong> over secure HTTPS (Port 443) via OAuth 2.0 to dispatch essential transactional platform emails. Specifically:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Send-Only Scope:</strong> We strictly request the minimum required send-only OAuth permission:
                  <code style={{ display: 'block', margin: '6px 0', padding: '4px 8px', backgroundColor: 'var(--bg-input)', borderRadius: '4px', fontSize: '13px', color: 'var(--color-accent-mint)' }}>
                    https://www.googleapis.com/auth/gmail.send
                  </code>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>No Inbox Reading or Scanning:</strong> Our backend never requests or utilizes <code style={{ fontSize: '13px', color: 'var(--text-muted)' }}>gmail.readonly</code>, <code style={{ fontSize: '13px', color: 'var(--text-muted)' }}>gmail.modify</code>, or mailbox management permissions. We cannot read, scan, index, or analyze your personal emails, drafts, or inbox history.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Transactional Delivery Only:</strong> The Gmail API integration is used exclusively to deliver automated, service-critical transactional notifications, including:
                  <ul style={{ marginTop: '6px', paddingLeft: '20px' }}>
                    <li>Candidate and Recruiter account welcome notifications.</li>
                    <li>Job application receipt confirmations to candidates.</li>
                    <li>New applicant alerts to hiring teams.</li>
                    <li>Recruitment pipeline status updates (e.g., Shortlisted, Interviewing).</li>
                    <li>Interview booking confirmations, reschedulings, and calendar reminders.</li>
                    <li>Job publishing confirmations and administrative audit alerts.</li>
                    <li>Password reset authentication links.</li>
                  </ul>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Recipient Privacy:</strong> All transactional notifications are routed strictly to the registered user's MongoDB email address. We never redirect emails to unauthorized third-party mailboxes.
                </li>
              </ul>
            </section>

            {/* 7. How We Use Information */}
            <section id="how-we-use-information" style={{ marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '14px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                7. How We Use Information
              </h2>
              <p style={{ marginBottom: '14px' }}>
                We use the information we collect solely for genuine recruitment and platform operations:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>To authenticate and maintain candidate and recruiter user sessions.</li>
                <li style={{ marginBottom: '8px' }}>To enable candidates to search, filter, and apply for published job openings.</li>
                <li style={{ marginBottom: '8px' }}>To calculate algorithmic Talent Match scores comparing job requirement skills against candidate skill profiles.</li>
                <li style={{ marginBottom: '8px' }}>To allow recruiters to manage job listings, review applicant submissions, and schedule interviews.</li>
                <li style={{ marginBottom: '8px' }}>To deliver transactional emails and in-app notification alerts regarding application updates.</li>
                <li style={{ marginBottom: '8px' }}>To enforce role-based access boundaries (candidate, recruiter, administrator) and prevent unauthorized privilege escalation.</li>
              </ul>
            </section>

            {/* 8. Data Security */}
            <section id="data-security" style={{ marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '14px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                8. Data Security
              </h2>
              <p style={{ marginBottom: '14px' }}>
                HireConnect implements industry-standard technical safeguards across our application layer and database architecture:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Password Hashing:</strong> Passwords are never stored in plaintext. Passwords are salted and hashed using bcrypt (10 rounds) prior to storage in the database.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Encrypted Transmission (TLS/SSL):</strong> All communication between your browser and our servers, as well as connections to MongoDB Atlas and Google Cloud APIs, is encrypted in transit using Transport Layer Security (TLS 1.2+).
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Stateless JWT & HTTP-Only Cookies:</strong> Authentication tokens are signed using high-entropy secrets and transported in secure, HTTP-only, SameSite cookies to protect against Cross-Site Scripting (XSS) and unauthorized token theft.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Role-Based Access Control (RBAC):</strong> Server-side middleware verifies user role identity on every protected route. Candidates cannot access recruiter candidate review pipelines, and recruiters cannot access administrator dashboards.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Upload Validation & Private Isolation:</strong> Uploaded resumes are inspected for genuine MIME types via magic byte signatures to prevent malicious script execution, and are stored in isolated private directories.
                </li>
              </ul>
            </section>

            {/* 9. Data Retention */}
            <section id="data-retention" style={{ marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '14px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                9. Data Retention
              </h2>
              <p style={{ marginBottom: '14px' }}>
                We retain personal information for as long as your account remains active on HireConnect, or as necessary to fulfill the recruitment purposes outlined in this policy:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Active Profiles:</strong> Profile information, resumes, and job listings are retained for the duration of your active account membership.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Application History:</strong> Job applications and status histories are maintained so that candidates can review their active and past applications, and recruiters can manage hiring audits.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Notification Outbox:</strong> Delivery logs and transactional email records in our notification outbox are retained for system reliability, retry scheduling, and debugging purposes.
                </li>
              </ul>
            </section>

            {/* 10. Third-Party Services */}
            <section id="third-party-services" style={{ marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '14px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                10. Third-Party Services
              </h2>
              <p style={{ marginBottom: '14px' }}>
                HireConnect relies on trusted third-party cloud infrastructure to run our platform. We share only the minimum data necessary for these services to perform their respective technical functions:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>MongoDB Atlas:</strong> Managed database hosting providing encrypted data storage and backup infrastructure.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Render:</strong> Cloud application platform hosting our Node.js and Express backend REST API services.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Vercel:</strong> Cloud edge network delivering our React frontend user interface.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Google Cloud Platform (Gmail API):</strong> Secure OAuth 2.0 HTTPS infrastructure utilized exclusively for transactional email delivery.
                </li>
              </ul>
            </section>

            {/* 11. User Rights */}
            <section id="user-rights" style={{ marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '14px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                11. User Rights
              </h2>
              <p style={{ marginBottom: '14px' }}>
                Depending on your jurisdiction, you have important rights regarding your personal data:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Access & Update:</strong> You may review, edit, or update your profile details, work history, and contact information at any time via your Account Settings and Profile pages.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Resume Management:</strong> You can upload a new resume or delete your existing resume document directly from your Candidate Profile.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Privacy Preferences:</strong> You can toggle candidate discoverability to hide your profile from recruiter searches, and configure email notification preferences in your settings.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Account Deletion:</strong> You may request the deletion of your account and associated personal data by contacting our team at the email address below.
                </li>
              </ul>
            </section>

            {/* 12. Contact Information */}
            <section id="contact-information">
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '14px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                12. Contact Information
              </h2>
              <p style={{ marginBottom: '14px' }}>
                If you have any questions, feedback, or requests regarding this Privacy Policy or our data handling practices, please contact us:
              </p>
              <div
                style={{
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '18px 22px',
                  fontSize: '14px'
                }}
              >
                <p style={{ margin: '4px 0' }}><strong>Platform:</strong> HireConnect Recruitment Platform</p>
                <p style={{ margin: '4px 0' }}><strong>Official Inquiries:</strong> <a href="mailto:contact@hireconnect.io" style={{ color: 'var(--color-accent-purple-light)' }}>contact@hireconnect.io</a></p>
                <p style={{ margin: '4px 0' }}><strong>Administrator Email:</strong> <a href="mailto:sabari1082005@gmail.com" style={{ color: 'var(--color-accent-purple-light)' }}>sabari1082005@gmail.com</a></p>
                <p style={{ margin: '4px 0' }}><strong>Website:</strong> <a href="https://mern-stack-9192.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-purple-light)' }}>https://mern-stack-9192.vercel.app</a></p>
              </div>
            </section>

          </div>

          {/* Bottom Navigation Links */}
          <div
            style={{
              marginTop: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '14px',
              color: 'var(--text-muted)'
            }}
          >
            <Link to="/" style={{ color: 'var(--color-accent-purple-light)', textDecoration: 'none' }}>
              ← Return to Home
            </Link>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link to="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Terms & Conditions
              </Link>
              <Link to="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Contact Support
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default PrivacyPolicyPage;
