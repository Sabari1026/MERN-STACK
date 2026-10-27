import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatSalary } from '../../utils/formatters';

export function JobCard({ job, onApply, onToggleSave, isSaved = false }) {
  const { isAuthenticated, role } = useAuth();

  const companyName = job.companyName || job.company?.name || 'Verified Tech Partner';
  const logo = job.company?.logo || null;
  const isCandidate = !isAuthenticated || role === 'candidate';

  return (
    <div
      className="surface-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative'
      }}
    >
      <div>
        {/* Header: Company & Save Bookmark */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {logo ? (
              <img
                src={logo}
                alt={companyName}
                style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', objectFit: 'contain', background: '#fff', padding: '2px' }}
              />
            ) : (
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(137, 66, 228, 0.15)',
                  color: 'var(--color-accent-purple-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '16px',
                  fontFamily: 'Saans Mono, monospace'
                }}
              >
                {companyName.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontSize: '14rem', color: 'var(--text-muted)' }}>{companyName}</div>
              <Link
                to={`/jobs/${job._id || job.id}`}
                style={{ fontSize: '18rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.25 }}
              >
                {job.title}
              </Link>
            </div>
          </div>

          {isCandidate && onToggleSave && (
            <button
              type="button"
              onClick={() => onToggleSave(job._id || job.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isSaved ? 'var(--color-accent-purple)' : 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px'
              }}
              title={isSaved ? 'Remove from saved' : 'Save job opening'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          )}
        </div>

        {/* Badges / Metadata */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8rem', marginBottom: '16rem' }}>
          {job.workMode && (
            <span className={`badge ${job.workMode === 'remote' ? 'badge-mint' : 'badge-purple'}`}>
              {job.workMode.toUpperCase()}
            </span>
          )}
          {job.jobType && (
            <span className="badge badge-gray">
              {job.jobType.replace('_', ' ').toUpperCase()}
            </span>
          )}
          {job.location && (
            <span className="badge badge-gray" style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              📍 {job.location}
            </span>
          )}
          {job.matchScore !== undefined && (
            <span className="badge badge-purple">
              ⚡ {Math.round(job.matchScore)}% Match
            </span>
          )}
          {(job.openingsCount || job.openings) && (
            <span className="badge badge-gray">
              👥 {job.openingsCount || job.openings} {(job.openingsCount || job.openings) === 1 ? 'Opening' : 'Openings'}
            </span>
          )}
        </div>

        {/* Salary */}
        <div style={{ fontSize: '15rem', color: 'var(--text-secondary)', marginBottom: '16rem', fontFamily: 'Saans Mono, monospace' }}>
          {formatSalary(job)}
        </div>

        {/* Snippet */}
        {job.description && (
          <p
            style={{
              fontSize: '14rem',
              color: 'var(--text-muted)',
              lineHeight: 1.45,
              margin: '0 0 20rem 0',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {job.description.replace(/<[^>]*>?/gm, '')}
          </p>
        )}
      </div>

      {/* Card Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '16rem', borderTop: '1px solid var(--border-subtle)' }}>
        <Link to={`/jobs/${job._id || job.id}`} style={{ fontSize: '14rem', color: 'var(--text-secondary)' }}>
          View details →
        </Link>
        {isCandidate && onApply && (
          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={() => onApply(job)}
          >
            <span>Apply</span>
          </button>
        )}
      </div>
    </div>
  );
}
