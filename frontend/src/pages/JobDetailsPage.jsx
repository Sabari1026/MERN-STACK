import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { ApplyModal } from '../components/jobs/ApplyModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatSalary } from '../utils/formatters';

export function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const { toast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function loadJob() {
      setLoading(true);
      try {
        const res = await jobService.getJobById(id);
        const data = res?.data?.job || res?.job || res?.data || res;
        setJob(data);
      } catch (err) {
        toast.error('Job opening not found or has been closed.');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [id, navigate, toast]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to bookmark this opening.');
      return;
    }
    try {
      await jobService.toggleSaveJob(id);
      setIsSaved(!isSaved);
      toast.success(isSaved ? 'Removed from saved jobs' : 'Job saved to your profile!');
    } catch (err) {
      toast.error('Could not update saved status.');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <main className="main-content" style={{ textAlign: 'center', padding: '120rem 20rem' }}>
          <span className="spinner" style={{ width: '36px', height: '36px' }} />
          <div style={{ marginTop: '16rem', color: 'var(--text-muted)' }}>Loading opening details...</div>
        </main>
      </div>
    );
  }

  if (!job) return null;

  const company = job.company || {};
  const companyName = job.companyName || company.name || 'Verified Tech Partner';
  const logo = company.logo || null;

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="site-container-narrow">
          {/* Back link */}
          <div style={{ marginBottom: '24rem' }}>
            <Link to="/jobs" style={{ fontSize: '14rem', color: 'var(--text-secondary)' }}>
              ← Back to all openings
            </Link>
          </div>

          {/* Job Overview Card */}
          <div className="surface-card" style={{ padding: '36rem', marginBottom: '32rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20rem', marginBottom: '24rem' }}>
              <div style={{ display: 'flex', gap: '16rem', alignItems: 'center' }}>
                {logo ? (
                  <img
                    src={logo}
                    alt={companyName}
                    style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'contain', background: '#fff', padding: '4px' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(137, 66, 228, 0.15)',
                      color: 'var(--color-accent-purple-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '22px',
                      fontFamily: 'Saans Mono, monospace'
                    }}
                  >
                    {companyName.substring(0, 2).toUpperCase()}
                  </div>
                )}

                <div>
                  <h1 className="h2" style={{ marginBottom: '6rem' }}>
                    {job.title}
                  </h1>
                  <div style={{ fontSize: '16rem', color: 'var(--text-secondary)' }}>
                    {companyName} {job.location && `• ${job.location}`}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleToggleSave}
                >
                  <span>{isSaved ? '★ Saved' : '☆ Save Job'}</span>
                </button>

                {(!isAuthenticated || role === 'candidate') && (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setIsApplyModalOpen(true)}
                  >
                    <span>Apply Now</span>
                  </button>
                )}
              </div>
            </div>

            {/* Badges / Quick stats */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10rem', paddingTop: '20rem', borderTop: '1px solid var(--border-subtle)' }}>
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
              {job.department && (
                <span className="badge badge-gray">
                  {job.department}
                </span>
              )}
              {(job.salaryMin || job.salaryMax || job.salary) && (
                <span className="badge badge-purple" style={{ fontFamily: 'Saans Mono, monospace' }}>
                  💰 {formatSalary(job)}
                </span>
              )}
              {(job.openingsCount || job.openings) && (
                <span className="badge badge-mint" style={{ fontFamily: 'Saans Mono, monospace' }}>
                  👥 {job.openingsCount || job.openings} {(job.openingsCount || job.openings) === 1 ? 'Opening' : 'Openings'}
                </span>
              )}
            </div>
          </div>

          {/* Job Description & Requirements */}
          <div className="surface-card" style={{ padding: '36rem', marginBottom: '32rem' }}>
            <h3 className="h3" style={{ marginBottom: '20rem' }}>
              About the Role
            </h3>

            <div
              className="body-text"
              style={{ lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: '32rem' }}
            >
              {job.description}
            </div>

            {/* Required Skills */}
            {job.skills && job.skills.length > 0 && (
              <div style={{ marginBottom: '32rem' }}>
                <h4 className="h4" style={{ marginBottom: '16rem' }}>
                  Target Skills & Technologies
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8rem' }}>
                  {job.skills.map((skill, idx) => (
                    <span key={idx} className="badge badge-purple" style={{ fontSize: '13rem', padding: '6rem 12rem' }}>
                      {typeof skill === 'string' ? skill : skill.name || skill.skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Banner at bottom of details */}
            <div
              style={{
                marginTop: '40rem',
                paddingTop: '24rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16rem'
              }}
            >
              <div>
                <div style={{ fontWeight: 500, fontSize: '18rem', color: 'var(--text-primary)' }}>
                  Interested in joining {companyName}?
                </div>
                <div style={{ fontSize: '14rem', color: 'var(--text-muted)' }}>
                  Submit your verified resume directly to the recruitment team.
                </div>
              </div>

              {(!isAuthenticated || role === 'candidate') && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setIsApplyModalOpen(true)}
                >
                  <span>Apply Now</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <ApplyModal
          job={job}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
        />
      )}
    </div>
  );
}
