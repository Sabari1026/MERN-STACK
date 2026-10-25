import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer
      style={{
        width: '100%',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '60rem var(--margin) 40rem',
        boxSizing: 'border-box',
        color: 'var(--text-secondary)'
      }}
    >
      <div className="site-container">
        {/* Top Section */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--gap)',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            marginBottom: '48rem'
          }}
        >
          {/* Logo & Brand statement */}
          <div style={{ flex: '1 1 340px', minWidth: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '24px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 187 40" style={{ height: '32px' }}>
                <text x="0" y="31" fontFamily="'Saans', sans-serif" fontWeight="600" fontSize="33" fill="#f7f5f2" letterSpacing="-0.03em">
                  HireConnect
                </text>
              </svg>
            </Link>
            <p className="body-text" style={{ maxWidth: '420px', color: 'var(--text-secondary)', margin: 0 }}>
              The modern recruitment platform connecting high-growth tech companies with verified engineering, product, and leadership talent.
            </p>
          </div>

          {/* CTA Card */}
          <div
            className="surface-card"
            style={{
              flex: '1 1 480px',
              backgroundColor: '#f7f5f2',
              color: '#1b1b1b',
              borderRadius: 'var(--radius-xl)',
              padding: '36rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span style={{ color: 'var(--color-accent-purple)', fontFamily: 'Saans Mono, monospace', fontSize: '15rem', fontWeight: 500, display: 'block', marginBottom: '12rem' }}>
                Ready to connect and hire?
              </span>
              <p style={{ margin: '0 0 24rem 0', color: '#454543', fontSize: '18rem', lineHeight: 1.4 }}>
                Built for teams that need to deliver.<br />
                Experienced engineers. Real recruitment outcomes.
              </p>
            </div>
            <div>
              <Link
                to="/signup"
                className="btn-primary"
                style={{
                  backgroundColor: '#1b1b1b',
                  color: '#f7f5f2',
                  borderColor: '#1b1b1b',
                  display: 'inline-flex'
                }}
              >
                <span>Get started</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Middle Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'var(--gap)',
            paddingTop: '32rem',
            borderTop: '1px solid var(--border-subtle)',
            marginBottom: '48rem'
          }}
        >
          <div>
            <span className="caption" style={{ display: 'block', marginBottom: '20rem', color: 'var(--text-primary)' }}>
              Explore Platform
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12rem', fontSize: '16rem' }}>
              <Link to="/jobs">Find Jobs</Link>
              <Link to="/companies">Companies Directory</Link>
              <Link to="/talent-match">Talent Match AI</Link>
              <Link to="/schedule">Interview Scheduling</Link>
            </div>
          </div>

          <div>
            <span className="caption" style={{ display: 'block', marginBottom: '20rem', color: 'var(--text-primary)' }}>
              Company & Services
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12rem', fontSize: '16rem' }}>
              <Link to="/about">About Us</Link>
              <Link to="/approach">Our Approach</Link>
              <Link to="/cases">Case Studies</Link>
              <Link to="/services">Enterprise Services</Link>
            </div>
          </div>

          <div>
            <span className="caption" style={{ display: 'block', marginBottom: '20rem', color: 'var(--text-primary)' }}>
              Get in Touch
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12rem', fontSize: '16rem' }}>
              <Link to="/contact">Contact Support</Link>
              <a href="mailto:contact@hireconnect.io">contact@hireconnect.io</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter / X</a>
            </div>
          </div>

          <div>
            <span className="caption" style={{ display: 'block', marginBottom: '20rem', color: 'var(--text-primary)' }}>
              Security & Trust
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12rem', fontSize: '14rem', color: 'var(--text-muted)' }}>
              <span>✓ MongoDB Atlas Verified</span>
              <span>✓ Resend Encrypted SMTP</span>
              <span>✓ Private Resumes Isolation</span>
              <span>✓ Zero Tailwind / Pure MERN</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16rem',
            paddingTop: '24rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '14rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>HireConnect © 2026. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '24rem' }}>
            <Link to="/terms" style={{ color: 'var(--text-muted)' }}>
              Terms & Conditions
            </Link>
            <Link to="/privacy" style={{ color: 'var(--text-muted)' }}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
