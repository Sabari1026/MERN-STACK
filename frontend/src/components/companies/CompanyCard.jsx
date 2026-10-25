import React from 'react';
import { Link } from 'react-router-dom';

export function CompanyCard({ company }) {
  const logo = company.logo || null;
  const name = company.name || 'Tech Company';
  const openPositions = company.openPositionsCount ?? company.jobCount ?? 0;

  return (
    <div
      className="surface-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      <div>
        {/* Top: Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16rem' }}>
          {logo ? (
            <img
              src={logo}
              alt={name}
              style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'contain', background: '#fff', padding: '2px' }}
            />
          ) : (
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(52, 211, 153, 0.15)',
                color: 'var(--color-accent-mint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '18px',
                fontFamily: 'Saans Mono, monospace'
              }}
            >
              {name.substring(0, 2).toUpperCase()}
            </div>
          )}

          <div>
            <div style={{ fontSize: '18rem', fontWeight: 500, color: 'var(--text-primary)' }}>
              {name}
            </div>
            {company.industry && (
              <div style={{ fontSize: '14rem', color: 'var(--text-secondary)' }}>
                {company.industry}
              </div>
            )}
          </div>
        </div>

        {/* Badges / Metadata */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8rem', marginBottom: '16rem' }}>
          {company.verified && (
            <span className="badge badge-mint">
              ✓ Verified Partner
            </span>
          )}
          {company.size && (
            <span className="badge badge-gray">
              👥 {company.size} employees
            </span>
          )}
          {company.location && (
            <span className="badge badge-gray">
              📍 {company.location}
            </span>
          )}
        </div>

        {/* Description */}
        {company.description && (
          <p
            style={{
              fontSize: '14rem',
              color: 'var(--text-muted)',
              lineHeight: 1.45,
              margin: '0 0 20rem 0',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {company.description}
          </p>
        )}
      </div>

      {/* Footer link */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16rem', borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '14rem', color: 'var(--color-accent-purple-light)', fontFamily: 'Saans Mono, monospace' }}>
          {openPositions} open position{openPositions === 1 ? '' : 's'}
        </span>
        <Link
          to={`/jobs?keyword=${encodeURIComponent(name)}`}
          className="btn-secondary btn-sm"
        >
          <span>View Jobs</span>
        </Link>
      </div>
    </div>
  );
}
