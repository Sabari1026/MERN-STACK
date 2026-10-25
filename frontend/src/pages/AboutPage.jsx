import React from 'react';
import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="page-container">
      <main className="main-content">
        <div className="site-container-narrow">
          <div style={{ marginBottom: '40px' }}>
            <span className="caption" style={{ color: 'var(--color-accent-purple-light)', display: 'block', marginBottom: '8px' }}>
              Our Story & Mission
            </span>
            <h1 className="h1" style={{ marginBottom: '16px' }}>
              Not just another job board.
            </h1>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              Verified talent and high-growth tech recruiters, connected seamlessly through genuine data and intelligent workflows.
            </p>
          </div>

          <div className="surface-card" style={{ padding: '36px', marginBottom: '32px' }}>
            <span className="caption" style={{ color: 'var(--color-accent-mint)', display: 'block', marginBottom: '12px' }}>
              Our Promise
            </span>
            <h2 className="h2" style={{ marginBottom: '20px', lineHeight: 1.2 }}>
              Every candidate on HireConnect is evaluated for technical proficiency, problem-solving, and culture alignment.
            </h2>
            <p className="body-text" style={{ lineHeight: 1.6, marginBottom: '24px' }}>
              Traditional recruitment platforms are cluttered with generic keyword matches, unverified resumes, and noisy spam.
              HireConnect was built to fix recruitment from first principles: deterministic 6-factor scoring, private documents protected by server-side authorization, and frictionless self-service calendar scheduling.
            </p>

            <div className="grid-12" style={{ marginTop: '32px' }}>
              <div className="col-4">
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-accent-mint)', fontFamily: 'Saans Mono, monospace' }}>
                  100%
                </div>
                <div className="caption" style={{ marginTop: '6px' }}>Verified Openings</div>
              </div>
              <div className="col-4">
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-accent-purple-light)', fontFamily: 'Saans Mono, monospace' }}>
                  6-Factor
                </div>
                <div className="caption" style={{ marginTop: '6px' }}>Talent Match Breakdown</div>
              </div>
              <div className="col-4">
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#f7f5f2', fontFamily: 'Saans Mono, monospace' }}>
                  0
                </div>
                <div className="caption" style={{ marginTop: '6px' }}>Public Resume Exposure</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h3 className="h3" style={{ marginBottom: '16px' }}>Ready to experience modern recruiting?</h3>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link to="/jobs" className="btn-primary">
                <span>Browse Jobs</span>
              </Link>
              <Link to="/signup?role=recruiter" className="btn-secondary">
                <span>Hire Talent</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
