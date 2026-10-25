import React from 'react';
import { Link } from 'react-router-dom';

export function ServicesPage() {
  return (
    <div className="page-container">
      <main className="main-content">
        <div className="site-container-narrow">
          <div style={{ marginBottom: '40px' }}>
            <span className="caption" style={{ color: 'var(--color-accent-purple-light)', display: 'block', marginBottom: '8px' }}>
              Solutions for Growing Companies
            </span>
            <h1 className="h1" style={{ marginBottom: '16px' }}>
              Enterprise Recruitment Services
            </h1>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              Tailored recruitment solutions designed for high-growth tech ventures, scale-ups, and modern engineering organizations.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
            <div className="surface-card" style={{ padding: '36px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '28px' }}>🚀</span>
                <h2 className="h3" style={{ margin: 0 }}>Direct Hire & Executive Search</h2>
              </div>
              <p className="body-text" style={{ marginBottom: '16px', lineHeight: 1.6 }}>
                Full-cycle candidate sourcing and verification for senior engineers, tech leads, engineering managers, and VP-level technology executives.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span className="badge badge-gray">Staff Engineers</span>
                <span className="badge badge-gray">Cloud Architects</span>
                <span className="badge badge-gray">VP of Engineering</span>
                <span className="badge badge-gray">Founding Engineers</span>
              </div>
            </div>

            <div className="surface-card" style={{ padding: '36px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '28px' }}>⚡</span>
                <h2 className="h3" style={{ margin: 0 }}>High-Velocity Squad Scaling</h2>
              </div>
              <p className="body-text" style={{ marginBottom: '16px', lineHeight: 1.6 }}>
                Scale an entire cross-functional team across frontend, backend, data, and DevOps simultaneously with coordinated interview scheduling and verified technical benchmarks.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span className="badge badge-gray">Product Squads</span>
                <span className="badge badge-gray">Core Infrastructure</span>
                <span className="badge badge-gray">Security Operations</span>
              </div>
            </div>

            <div className="surface-card" style={{ padding: '36px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '28px' }}>🛡️</span>
                <h2 className="h3" style={{ margin: 0 }}>Private & Verified Recruitment Portal</h2>
              </div>
              <p className="body-text" style={{ marginBottom: '16px', lineHeight: 1.6 }}>
                Dedicated recruiter dashboards, confidential candidate profiles, server-side resume protection, and real-time interview availability synchronization.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span className="badge badge-mint">Encrypted Resumes</span>
                <span className="badge badge-mint">Calendar Integration</span>
                <span className="badge badge-mint">MongoDB Atlas Cloud</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <h3 className="h3" style={{ marginBottom: '16px' }}>Need a tailored recruitment partnership?</h3>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link to="/contact" className="btn-primary">
                <span>Talk with an Advisor</span>
              </Link>
              <Link to="/signup?role=recruiter" className="btn-secondary">
                <span>Post Open Roles</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
