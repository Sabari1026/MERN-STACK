import React from 'react';
import { Link } from 'react-router-dom';

export function TermsPage() {
  const lastUpdated = 'November 12, 2026';
  const effectiveDate = 'November 12, 2026';

  const sections = [
    { id: 'introduction', title: '1. Introduction & Acceptance of Terms' },
    { id: 'eligibility', title: '2. Eligibility' },
    { id: 'user-accounts', title: '3. User Accounts & Responsibilities' },
    { id: 'candidate-responsibilities', title: '4. Candidate Responsibilities' },
    { id: 'recruiter-responsibilities', title: '5. Recruiter & Employer Responsibilities' },
    { id: 'job-listings-applications', title: '6. Job Listings & Applications' },
    { id: 'prohibited-activities', title: '7. Prohibited Activities' },
    { id: 'platform-availability', title: '8. Platform Availability' },
    { id: 'email-notifications', title: '9. Email Notifications' },
    { id: 'intellectual-property', title: '10. Intellectual Property' },
    { id: 'suspension-termination', title: '11. Account Suspension & Termination' },
    { id: 'limitation-of-liability', title: '12. Limitation of Liability' },
    { id: 'changes-to-terms', title: '13. Changes to Terms' },
    { id: 'contact-information', title: '14. Contact Information' }
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
                  color: 'var(--color-accent-mint)',
                  backgroundColor: 'var(--color-accent-mint-bg)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontWeight: 600
                }}
              >
                Platform Agreement
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Terms of Service</span>
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
              Terms of Service
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '8px 16px'
              }}
            >
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => scrollToSection(e, s.id)}
                  style={{
                    color: 'var(--color-accent-mint)',
                    fontSize: '13px',
                    textDecoration: 'none',
                    display: 'inline-block',
                    padding: '2px 0',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-accent-mint)')}
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>

          {/* Core Platform Principles Highlight Box */}
          <div
            style={{
              padding: '20px 24px',
              backgroundColor: 'rgba(52, 211, 153, 0.08)',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '40px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ color: 'var(--color-accent-mint)', fontSize: '16px' }}>✓</span>
              <strong style={{ color: 'var(--text-primary)', fontSize: '15px' }}>HireConnect Platform Standards</strong>
            </div>
            <ul style={{ margin: '0', paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              <li><strong>Authentic Roles & Profiles:</strong> Recruiters post genuine, funded jobs; candidates represent genuine, verified employment qualifications.</li>
              <li><strong>Zero Candidate Placement Fees:</strong> Candidates are never charged to apply for jobs or attend interviews.</li>
              <li><strong>Confidential Data Protection:</strong> Resumes and applicant submissions are restricted to authorized hiring teams and are never made publicly indexable.</li>
            </ul>
          </div>

          {/* Main Terms Content Body */}
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

            {/* 1. Introduction and Acceptance of Terms */}
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
                1. Introduction and Acceptance of Terms
              </h2>
              <p style={{ marginBottom: '14px' }}>
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and <strong>HireConnect</strong> ("HireConnect," "we," "us," or "our"), governing your access to and use of the HireConnect recruitment website (located at <a href="https://mern-stack-9192.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-mint)' }}>https://mern-stack-9192.vercel.app</a>), our backend services, and associated APIs.
              </p>
              <p style={{ marginBottom: '14px' }}>
                By creating an account, browsing job listings, submitting job applications, posting vacancies, or scheduling interviews through HireConnect, you acknowledge that you have read, understood, and agree to be bound by these Terms and our companion{' '}
                <Link to="/privacy-policy" style={{ color: 'var(--color-accent-mint)', textDecoration: 'underline' }}>
                  Privacy Policy
                </Link>. If you do not agree to these Terms, you must not access or use the platform.
              </p>
            </section>

            {/* 2. Eligibility */}
            <section id="eligibility" style={{ marginBottom: '40px' }}>
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
                2. Eligibility
              </h2>
              <p style={{ marginBottom: '14px' }}>
                To register an account or use HireConnect, you represent and warrant that:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  You are at least 18 years of age or the legal working age required in your jurisdiction to enter into binding employment agreements.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  You possess the legal authority and capacity to enter into these Terms on your own behalf or on behalf of the company or legal entity you represent.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  You are not barred from receiving services under applicable laws or sanctions.
                </li>
              </ul>
            </section>

            {/* 3. User Accounts and Responsibilities */}
            <section id="user-accounts" style={{ marginBottom: '40px' }}>
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
                3. User Accounts and Responsibilities
              </h2>
              <p style={{ marginBottom: '14px' }}>
                When creating an account on HireConnect, you choose a designated platform role: <strong>Candidate</strong> or <strong>Recruiter</strong>. You agree to:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  Provide accurate, current, and complete registration details, including your full legal name and an active, accessible email address.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Maintain the security and confidentiality of your login credentials. You are responsible for all activities conducted under your authenticated account session.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Notify us immediately at <a href="mailto:sabari1082005@gmail.com" style={{ color: 'var(--color-accent-mint)' }}>sabari1082005@gmail.com</a> if you suspect any unauthorized access, session breach, or compromise of your account.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Not register multiple duplicate accounts, create fraudulent identities, or transfer your account credentials to third parties.
                </li>
              </ul>
            </section>

            {/* 4. Candidate Responsibilities */}
            <section id="candidate-responsibilities" style={{ marginBottom: '40px' }}>
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
                4. Candidate Responsibilities
              </h2>
              <p style={{ marginBottom: '14px' }}>
                Candidates using HireConnect to discover employment opportunities, submit resumes, and participate in interview workflows agree to:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Truthful Career Profiles:</strong> Ensure that all employment records, technical skills, academic qualifications, and portfolio links accurately reflect genuine experience.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Legitimate Resume Uploads:</strong> Upload only authentic documents (PDF or DOCX) that you own and are authorized to share. Uploading corrupted files, executable code, or documents containing deceptive information is strictly prohibited.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Interview Professionalism:</strong> Honor confirmed interview bookings, arrive on time for scheduled video meetings, and provide reasonable advance notice through the platform if a session must be rescheduled or cancelled.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Direct Applications:</strong> Apply only for positions for which you have a bona fide interest and relevant qualifications.
                </li>
              </ul>
            </section>

            {/* 5. Recruiter and Employer Responsibilities */}
            <section id="recruiter-responsibilities" style={{ marginBottom: '40px' }}>
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
                5. Recruiter and Employer Responsibilities
              </h2>
              <p style={{ marginBottom: '14px' }}>
                Recruiters and corporate hiring partners registered on HireConnect agree to uphold fair, legal, and transparent hiring standards:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Authentic Job Openings:</strong> Post only active, genuine, and funded job vacancies that correspond to legitimate employment opportunities within your organization.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Zero Candidate Fees:</strong> Never solicit, demand, or accept application fees, testing charges, interview costs, equipment deposits, or placement fees from job applicants.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Equal Opportunity & Non-Discrimination:</strong> Comply with all applicable labor, employment, and anti-discrimination laws. Job listings must not discriminate based on race, gender, religion, national origin, age, sexual orientation, disability, or any other legally protected status.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Confidential Handling of Candidate Data:</strong> Treat all candidate resumes, contact details, and application materials as strictly confidential. Recruiter accounts must not export, sell, or redistribute candidate data outside the scope of authorized hiring evaluations.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Transparent Communications:</strong> Maintain professional, timely status communication with applicants throughout the hiring pipeline (e.g., Shortlisted, Interviewing, Offered, or Rejected).
                </li>
              </ul>
            </section>

            {/* 6. Job Listings and Applications */}
            <section id="job-listings-applications" style={{ marginBottom: '40px' }}>
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
                6. Job Listings and Applications
              </h2>
              <p style={{ marginBottom: '14px' }}>
                HireConnect provides the technical infrastructure to host job listings, calculate skill matching scores, and route applications between candidates and recruiters:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Facilitation Only:</strong> HireConnect is an online recruitment technology platform, not an employer, employment agency, or staffing firm. We do not participate in employment negotiations, wage agreements, or candidate hiring determinations.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Listing Accuracy:</strong> Employers are solely responsible for the content, compensation details, requirements, and compliance of their job listings.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Application Discretion:</strong> Employers retain full discretion regarding candidate evaluations, interview invitations, and hiring offers. HireConnect does not guarantee that candidates will receive responses or employment offers.
                </li>
              </ul>
            </section>

            {/* 7. Prohibited Activities */}
            <section id="prohibited-activities" style={{ marginBottom: '40px' }}>
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
                7. Prohibited Activities
              </h2>
              <p style={{ marginBottom: '14px' }}>
                You agree not to engage in any of the following prohibited behaviors:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Automated Scraping & Harvesting:</strong> Systematic collection, crawling, scraping, or extraction of resumes, candidate directories, or job postings using bots, spiders, or scripts without prior written consent.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Security Tampering:</strong> Attempting to probe, scan, or breach authentication gates, exploit API parameters, bypass role-based access controls, or escalate privileges to unauthorized administrator endpoints.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Malicious Uploads:</strong> Uploading files containing viruses, Trojans, malware, executable binaries, or corrupted file signatures.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Fraud & Deception:</strong> Creating false corporate profiles, impersonating other companies, or advertising pyramid schemes, multi-level marketing, or work-from-home scams.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Platform Disruption:</strong> Launching denial-of-service (DoS) attacks, flooding notification queues, or imposing unreasonable loads on our cloud infrastructure.
                </li>
              </ul>
            </section>

            {/* 8. Platform Availability */}
            <section id="platform-availability" style={{ marginBottom: '40px' }}>
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
                8. Platform Availability
              </h2>
              <p style={{ marginBottom: '14px' }}>
                HireConnect is hosted across modern cloud infrastructure (including Render, Vercel, and MongoDB Atlas). While we endeavor to maintain high uptime, we do not guarantee uninterrupted, continuous, or error-free access:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  The platform may occasionally be modified, updated, or temporarily unavailable due to scheduled maintenance, software releases, or emergency infrastructure patches.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  We are not liable for service interruptions caused by third-party hosting providers, network outages, or events beyond our reasonable control.
                </li>
              </ul>
            </section>

            {/* 9. Email Notifications */}
            <section id="email-notifications" style={{ marginBottom: '40px' }}>
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
                9. Email Notifications
              </h2>
              <p style={{ marginBottom: '14px' }}>
                HireConnect delivers transactional notifications essential to the operation of your recruitment workflows:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Transactional Delivery:</strong> We use the official Google Gmail REST API via OAuth 2.0 (send-only scope `gmail.send`) over HTTPS Port 443 to deliver account welcomes, job application receipts, candidate submissions, status changes, and interview scheduling confirmations.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Service Communications:</strong> Because transactional emails contain critical account and recruitment data (e.g., password resets and interview links), users cannot opt out of essential service-level security notifications.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Notification Preferences:</strong> Users may manage non-critical email alerts (such as daily digest updates) within their Account Settings page.
                </li>
              </ul>
            </section>

            {/* 10. Intellectual Property */}
            <section id="intellectual-property" style={{ marginBottom: '40px' }}>
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
                10. Intellectual Property
              </h2>
              <p style={{ marginBottom: '14px' }}>
                All proprietary rights in the HireConnect platform are protected:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Platform Content:</strong> The HireConnect wordmark, logo, visual design, custom components, typography, matching algorithms, and software code are the intellectual property of HireConnect and its authors.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>User Content:</strong> You retain ownership of any text, resumes, portfolio materials, or corporate logos that you submit. By uploading content, you grant HireConnect a worldwide, non-exclusive, royalty-free license solely to host, display, and process your content for authorized recruitment purposes.
                </li>
              </ul>
            </section>

            {/* 11. Account Suspension and Termination */}
            <section id="suspension-termination" style={{ marginBottom: '40px' }}>
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
                11. Account Suspension and Termination
              </h2>
              <p style={{ marginBottom: '14px' }}>
                HireConnect administrators reserve the right to suspend or terminate accounts, remove job postings, or revoke platform access without liability if:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>You violate any provision of these Terms or our Privacy Policy.</li>
                <li style={{ marginBottom: '8px' }}>A recruiter posts fraudulent, deceptive, or non-compliant job listings.</li>
                <li style={{ marginBottom: '8px' }}>A candidate uploads malicious files or submits fraudulent qualification claims.</li>
                <li style={{ marginBottom: '8px' }}>Your account is associated with abusive behavior, harassment, or system tampering.</li>
              </ul>
              <p>
                Users may discontinue their use of HireConnect and request account deletion at any time by contacting our support team.
              </p>
            </section>

            {/* 12. Limitation of Liability */}
            <section id="limitation-of-liability" style={{ marginBottom: '40px' }}>
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
                12. Limitation of Liability
              </h2>
              <p style={{ marginBottom: '14px' }}>
                To the maximum extent permitted by applicable law:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  HireConnect is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express, implied, statutory, or otherwise.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  HireConnect expressly disclaims liability for the conduct, statements, or representations of candidates or employers, including hiring outcomes, interview conduct, employment contract terms, and job performance.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  In no event shall HireConnect, its developers, or affiliates be liable for indirect, incidental, special, consequential, or punitive damages resulting from your access to or inability to use the platform.
                </li>
              </ul>
            </section>

            {/* 13. Changes to Terms */}
            <section id="changes-to-terms" style={{ marginBottom: '40px' }}>
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
                13. Changes to Terms
              </h2>
              <p style={{ marginBottom: '14px' }}>
                We reserve the right to amend or update these Terms at any time. When modifications are made, we will update the "Last Updated" date at the top of this document.
              </p>
              <p>
                Your continued use of HireConnect following the publication of revised Terms signifies your acceptance of the updated terms. If you do not agree to the revisions, your sole recourse is to discontinue using the platform.
              </p>
            </section>

            {/* 14. Contact Information */}
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
                14. Contact Information
              </h2>
              <p style={{ marginBottom: '14px' }}>
                If you have questions, feedback, or legal inquiries concerning these Terms of Service, please contact us:
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
                <p style={{ margin: '4px 0' }}><strong>Support Inquiries:</strong> <a href="mailto:contact@hireconnect.io" style={{ color: 'var(--color-accent-mint)' }}>contact@hireconnect.io</a></p>
                <p style={{ margin: '4px 0' }}><strong>Platform Administrator:</strong> <a href="mailto:sabari1082005@gmail.com" style={{ color: 'var(--color-accent-mint)' }}>sabari1082005@gmail.com</a></p>
                <p style={{ margin: '4px 0' }}><strong>Live Application:</strong> <a href="https://mern-stack-9192.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-mint)' }}>https://mern-stack-9192.vercel.app</a></p>
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
            <Link to="/" style={{ color: 'var(--color-accent-mint)', textDecoration: 'none' }}>
              ← Return to Home
            </Link>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link to="/privacy-policy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Privacy Policy
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

export default TermsPage;
