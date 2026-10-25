import React from 'react';

export function JobFilterPanel({ filters, onFilterChange, onReset }) {
  return (
    <div
      className="surface-card"
      style={{
        padding: '20rem',
        marginBottom: '28rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16rem',
        alignItems: 'flex-end'
      }}
    >
      {/* Keyword Search */}
      <div style={{ flex: '2 1 240px' }}>
        <label className="form-label">Search Roles or Keywords</label>
        <input
          type="text"
          placeholder="e.g. Node.js, Cloud Architect, React..."
          value={filters.keyword || ''}
          onChange={(e) => onFilterChange('keyword', e.target.value)}
        />
      </div>

      {/* Location */}
      <div style={{ flex: '1 1 180px' }}>
        <label className="form-label">Location</label>
        <input
          type="text"
          placeholder="e.g. Remote, Bangalore, London..."
          value={filters.location || ''}
          onChange={(e) => onFilterChange('location', e.target.value)}
        />
      </div>

      {/* Work Mode */}
      <div style={{ flex: '1 1 140px' }}>
        <label className="form-label">Work Mode</label>
        <select
          value={filters.workMode || ''}
          onChange={(e) => onFilterChange('workMode', e.target.value)}
        >
          <option value="">All Modes</option>
          <option value="remote">Remote Only</option>
          <option value="hybrid">Hybrid</option>
          <option value="onsite">On-site</option>
        </select>
      </div>

      {/* Job Type */}
      <div style={{ flex: '1 1 140px' }}>
        <label className="form-label">Contract Type</label>
        <select
          value={filters.jobType || ''}
          onChange={(e) => onFilterChange('jobType', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="full_time">Full Time</option>
          <option value="contract">Contract</option>
          <option value="part_time">Part Time</option>
          <option value="internship">Internship</option>
        </select>
      </div>

      {/* Reset */}
      <div>
        <button
          type="button"
          className="btn-secondary"
          onClick={onReset}
          style={{ height: '46px' }}
        >
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
