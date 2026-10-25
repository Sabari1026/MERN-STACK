import React from 'react';
import { Link } from 'react-router-dom';

export function TermsPage() {
  return (
    <div className="page-container">
      <main className="main-content">
        <div className="site-container-narrow">
          <div style={{ marginBottom: '40px' }}>
            <span className="caption" style={{ color: 'var(--color-accent-mint)', display: 'block', marginBottom: '8px' }}>
              Platform Agreement
            </span>
            <h1 className="h1" style={{ marginBottom: '16px' }}>
              Terms & Conditions
            </h1>
            <p className="body-small" style={{ color: 'var(--text-muted)' }}>
              Last Updated: September 11, 2025
            </p>
          </div>

          <div className="surface-card" style={{ padding: '36px', lineHeight: 1.7 }}>
            <p className="body-text" style={{ marginBottom: '24px' }}>
              These Terms and Conditions constitute a legally binding agreement made between you and HireConnect, LLC ("HireConnect," "we," "us," or "our"), concerning your access to and use of the hireconnect.io website and recruitment portal.
            </p>

            <h3 className="h4" style={{ marginTop: '32px', marginBottom: '12px' }}>1. User Representations & Candidate Verification</h3>
            <p className="body-text" style={{ marginBottom: '16px' }}>
              By using the platform, you represent and warrant that all registration information you submit is true, accurate, current, and complete. Candidates warrant that submitted resumes, technical skills, and work experience accurately reflect their genuine employment history.
            </p>

            <h3 className="h4" style={{ marginTop: '32px', marginBottom: '12px' }}>2. Employer & Recruiter Responsibilities</h3>
            <p className="body-text" style={{ marginBottom: '16px' }}>
              Recruiters and employers agree to post only authentic, bona fide employment openings. Employers agree not to post discriminatory listings, misleading compensation terms, or unauthorized third-party content. All resumes accessed through HireConnect must be treated as strictly confidential.
            </p>

            <h3 className="h4" style={{ marginTop: '32px', marginBottom: '12px' }}>3. Prohibited Activities</h3>
            <p className="body-text" style={{ marginBottom: '16px' }}>
              You may not access or use the platform for any purpose other than that for which we make it available. Specifically, prohibited activities include:
            </p>
            <ul style={{ paddingLeft: '24px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              <li style={{ marginBottom: '8px' }}>Systematic retrieval of data or resumes to create a competing recruitment database.</li>
              <li style={{ marginBottom: '8px' }}>Attempting to bypass role-based access controls or unauthorized administrator endpoints.</li>
              <li style={{ marginBottom: '8px' }}>Uploading corrupted files, executable malware, or exploiting path traversal vectors.</li>
              <li style={{ marginBottom: '8px' }}>Engaging in automated scraping without written authorization.</li>
            </ul>

            <h3 className="h4" style={{ marginTop: '32px', marginBottom: '12px' }}>4. Contact</h3>
            <p className="body-text">
              For questions regarding these Terms, please contact us at:{' '}
              <a href="mailto:contact@hireconnect.io" style={{ color: 'var(--color-accent-purple-light)' }}>
                contact@hireconnect.io
              </a>
              . For privacy inquiries, view our{' '}
              <Link to="/privacy" style={{ color: 'var(--color-accent-purple-light)', textDecoration: 'underline' }}>
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
