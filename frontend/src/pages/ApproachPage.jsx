import React from 'react';
import { Link } from 'react-router-dom';

export function ApproachPage() {
  return (
    <div className="page-container">
      <main className="main-content">
        <div className="site-container-narrow">
          <div style={{ marginBottom: '40px' }}>
            <span className="caption" style={{ color: 'var(--color-accent-mint)', display: 'block', marginBottom: '8px' }}>
              The HireConnect Methodology
            </span>
            <h1 className="h1" style={{ marginBottom: '16px' }}>
              An Engineering-First Recruitment Model
            </h1>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              Built by technologists for technologists. We replaced resume keyword keyword-stuffing with genuine capability evaluation and atomic workflows.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '48px' }}>
            <div className="surface-card" style={{ padding: '36px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <span className="badge badge-purple" style={{ fontSize: '15px' }}>Step 01</span>
                <h2 className="h3" style={{ margin: 0 }}>Rigorous Profile Verification</h2>
              </div>
              <p className="body-text" style={{ lineHeight: 1.6 }}>
                Candidates build a structured profile with verified skills, verifiable employment history, and authentic documents. File signatures are validated cryptographically with magic-byte checks.
              </p>
            </div>

            <div className="surface-card" style={{ padding: '36px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <span className="badge badge-mint" style={{ fontSize: '15px' }}>Step 02</span>
                <h2 className="h3" style={{ margin: 0 }}>Transparent 6-Factor Matching</h2>
              </div>
              <p className="body-text" style={{ lineHeight: 1.6 }}>
                Our Talent Match algorithm computes explainable scores across skills, experience, location, compensation, education, and domain without hidden black-box biases.
              </p>
            </div>

            <div className="surface-card" style={{ padding: '36px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <span className="badge badge-amber" style={{ fontSize: '15px' }}>Step 03</span>
                <h2 className="h3" style={{ margin: 0 }}>Frictionless Interview Execution</h2>
              </div>
              <p className="body-text" style={{ lineHeight: 1.6 }}>
                Direct candidate self-scheduling against recruiter availability, automatic timezone translation, Resend SMTP transactional reminders, and double-booking conflict defense.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <Link to="/signup" className="btn-primary">
              <span>Experience HireConnect Today</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
