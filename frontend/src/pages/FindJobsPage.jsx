import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { JobCard } from '../components/jobs/JobCard';
import { JobFilterPanel } from '../components/jobs/JobFilterPanel';
import { ApplyModal } from '../components/jobs/ApplyModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function FindJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  // Filters state from URL or defaults
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    workMode: searchParams.get('workMode') || '',
    jobType: searchParams.get('jobType') || ''
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = {
        page,
        limit: 12,
        ...filters
      };
      // Clean empty keys
      Object.keys(queryParams).forEach((k) => !queryParams[k] && delete queryParams[k]);

      const res = await jobService.getJobs(queryParams);
      const items = res?.data?.jobs || res?.jobs || [];
      const total = res?.data?.total || res?.total || items.length;
      const pages = res?.data?.totalPages || res?.totalPages || Math.ceil(total / 12) || 1;

      setJobs(items);
      setTotalJobs(total);
      setTotalPages(pages);
    } catch (err) {
      toast.error('Unable to load job listings. Please check your connection.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page, toast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Load saved jobs for candidate
  useEffect(() => {
    async function loadSaved() {
      if (!isAuthenticated) return;
      try {
        const res = await jobService.getSavedJobs();
        const savedList = res?.data?.savedJobs || res?.savedJobs || [];
        const ids = new Set(savedList.map((s) => s.job?._id || s.job || s._id));
        setSavedJobIds(ids);
      } catch (err) {
        // ignore
      }
    }
    loadSaved();
  }, [isAuthenticated]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(1);

    // Sync to URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    const clean = { keyword: '', location: '', workMode: '', jobType: '' };
    setFilters(clean);
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  const handleToggleSave = async (jobId) => {
    if (!isAuthenticated) {
      toast.info('Please sign in to save job openings.');
      return;
    }
    try {
      await jobService.toggleSaveJob(jobId);
      setSavedJobIds((prev) => {
        const next = new Set(prev);
        if (next.has(jobId)) {
          next.delete(jobId);
          toast.info('Removed from saved jobs.');
        } else {
          next.add(jobId);
          toast.success('Job saved successfully!');
        }
        return next;
      });
    } catch (err) {
      toast.error('Failed to update bookmark.');
    }
  };

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="site-container">
          {/* Header */}
          <div style={{ marginBottom: '32rem' }}>
            <span className="caption" style={{ color: 'var(--color-accent-purple-light)', display: 'block', marginBottom: '8rem' }}>
              Explore Career Opportunities
            </span>
            <h1 className="h1" style={{ marginBottom: '12rem' }}>
              Find Your Next Role
            </h1>
            <p className="body-text">
              Browse {totalJobs} active engineering, infrastructure, design, and product management openings.
            </p>
          </div>

          {/* Search & Filter Panel */}
          <JobFilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          {/* Jobs Listing */}
          {loading ? (
            <div style={{ padding: '80rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <span className="spinner" style={{ width: '32px', height: '32px' }} />
              <div style={{ marginTop: '16rem' }}>Searching job opportunities...</div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="surface-card" style={{ textAlign: 'center', padding: '60rem 20rem' }}>
              <div style={{ fontSize: '36rem', marginBottom: '16rem' }}>🔍</div>
              <h3 className="h3" style={{ marginBottom: '8rem' }}>No matching openings found</h3>
              <p className="body-text" style={{ maxWidth: '480rem', margin: '0 auto 24rem auto', color: 'var(--text-muted)' }}>
                Try relaxing your search terms or resetting filters to view all verified engineering opportunities.
              </p>
              <button type="button" className="btn-primary" onClick={handleResetFilters}>
                <span>Reset Filters</span>
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                  gap: '24rem',
                  marginBottom: '40rem'
                }}
              >
                {jobs.map((job) => (
                  <JobCard
                    key={job._id || job.id}
                    job={job}
                    onApply={(j) => setSelectedJobForApply(j)}
                    onToggleSave={handleToggleSave}
                    isSaved={savedJobIds.has(job._id || job.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16rem' }}>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <span>← Previous</span>
                  </button>
                  <span style={{ fontSize: '14rem', fontFamily: 'Saans Mono, monospace', color: 'var(--text-secondary)' }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <span>Next →</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          isOpen={!!selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={() => {
            // refresh or update local state
          }}
        />
      )}
    </div>
  );
}
