import React from 'react';
import { Link } from 'react-router-dom';

export function CasesPage() {
  const caseStudies = [
    {
      company: 'Beatport',
      title: 'Scaling Distributed Audio Infrastructure',
      outcome: 'Hired 6 Staff Platform Engineers within 28 days with 94% retention.',
      description: 'Beatport leveraged HireConnect Talent Match to source specialized audio streaming, low-latency WebSockets, and Kubernetes specialists without agency markups.'
    },
    {
      company: 'PushPress',
      title: 'Expanding Core SaaS Engineering Squads',
      outcome: 'Reduced time-to-hire by 52% while doubling engineering interview conversion rate.',
      description: 'Using real-time slot scheduling and verified candidate profiles, PushPress accelerated their hiring pipeline from screening to offer acceptance.'
    },
    {
      company: 'Altos',
      title: 'Building Modern Cloud Healthtech Systems',
      outcome: 'Completed 12 cross-functional hires across Full-Stack, QA, and Data Architecture.',
      description: 'Altos prioritized verified candidate capabilities and private resume storage to ensure compliance and recruit senior technologists.'
    }
  ];

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="site-container-narrow">
          <div style={{ marginBottom: '40px' }}>
            <span className="caption" style={{ color: 'var(--color-accent-purple-light)', display: 'block', marginBottom: '8px' }}>
              Proven Recruitment Outcomes
            </span>
            <h1 className="h1" style={{ marginBottom: '16px' }}>
              Customer Case Studies
            </h1>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              See how high-growth tech ventures leverage HireConnect to hire faster, cut recruitment friction, and scale high-impact engineering teams.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '48px' }}>
            {caseStudies.map((cs, idx) => (
              <div key={idx} className="surface-card" style={{ padding: '36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <span className="badge badge-purple" style={{ fontSize: '14px' }}>
                    {cs.company}
                  </span>
                  <span className="badge badge-mint" style={{ fontSize: '13px' }}>
                    ✓ Verified Outcome
                  </span>
                </div>
                <h2 className="h3" style={{ marginBottom: '12px' }}>{cs.title}</h2>
                <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-accent-mint)', marginBottom: '12px' }}>
                  {cs.outcome}
                </div>
                <p className="body-text" style={{ lineHeight: 1.6 }}>{cs.description}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <h3 className="h3" style={{ marginBottom: '16px' }}>Ready to write your company's hiring success story?</h3>
            <Link to="/signup?role=recruiter" className="btn-primary">
              <span>Start Hiring with HireConnect</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
