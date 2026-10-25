import React from 'react';

export function PrivacyPage() {
  return (
    <div className="page-container">
      <main className="main-content">
        <div className="site-container-narrow">
          <div style={{ marginBottom: '40px' }}>
            <span className="caption" style={{ color: 'var(--color-accent-purple-light)', display: 'block', marginBottom: '8px' }}>
              Legal & Compliance
            </span>
            <h1 className="h1" style={{ marginBottom: '16px' }}>
              Privacy Policy
            </h1>
            <p className="body-small" style={{ color: 'var(--text-muted)' }}>
              Last Updated: September 11, 2025
            </p>
          </div>

          <div className="surface-card" style={{ padding: '36px', lineHeight: 1.7 }}>
            <p className="body-text" style={{ marginBottom: '24px' }}>
              HireConnect, LLC ("HireConnect," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, hireconnect.io, and utilize our recruitment platform.
            </p>

            <h3 className="h4" style={{ marginTop: '32px', marginBottom: '12px' }}>1. Collection of Your Information</h3>
            <p className="body-text" style={{ marginBottom: '16px' }}>
              We collect information that you voluntarily provide to us when you register for an account, create a candidate or recruiter profile, upload resume documents, apply for jobs, or communicate with other users on the platform.
            </p>

            <h4 className="h4" style={{ marginTop: '24px', marginBottom: '8px', fontSize: '18px' }}>Personal Data</h4>
            <p className="body-text" style={{ marginBottom: '16px' }}>
              Personally identifiable information, such as your full name, email address, telephone number, employment background, and educational qualifications are collected solely to facilitate authorized recruitment workflows.
            </p>

            <h4 className="h4" style={{ marginTop: '24px', marginBottom: '8px', fontSize: '18px' }}>Resume & Document Protection</h4>
            <p className="body-text" style={{ marginBottom: '16px' }}>
              Resume documents uploaded to HireConnect are stored in secured, server-side private storage. Resumes are NEVER made publicly indexable. Access is granted exclusively to you and to authorized recruiters at organizations to which you have submitted an active job application.
            </p>

            <h3 className="h4" style={{ marginTop: '32px', marginBottom: '12px' }}>2. Use of Your Information</h3>
            <p className="body-text" style={{ marginBottom: '16px' }}>
              Having accurate information about you permits us to provide a customized, efficient recruitment experience. Specifically, we use information collected about you via the Website to:
            </p>
            <ul style={{ paddingLeft: '24px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              <li style={{ marginBottom: '8px' }}>Create and manage candidate and recruiter user accounts.</li>
              <li style={{ marginBottom: '8px' }}>Compute explainable Talent Match recommendations using verified skills.</li>
              <li style={{ marginBottom: '8px' }}>Deliver transactional notification emails and interview calendar reminders.</li>
              <li style={{ marginBottom: '8px' }}>Protect against unauthorized role escalation, fraud, and system abuse.</li>
            </ul>

            <h3 className="h4" style={{ marginTop: '32px', marginBottom: '12px' }}>3. Contact Us</h3>
            <p className="body-text">
              If you have questions or comments about this Privacy Policy, please contact our data privacy officer at:{' '}
              <a href="mailto:contact@hireconnect.io" style={{ color: 'var(--color-accent-purple-light)' }}>
                contact@hireconnect.io
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
