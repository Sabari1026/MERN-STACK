import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { JobCard } from '../components/jobs/JobCard';
import { ApplyModal } from '../components/jobs/ApplyModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadFeatured() {
      try {
        setLoading(true);
        const res = await jobService.getJobs({ limit: 6 });
        const jobs = res?.data?.jobs || res?.jobs || [];
        if (isMounted) setFeaturedJobs(jobs);
      } catch (err) {
        // Fallback
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleSave = async (jobId) => {
    if (!isAuthenticated) {
      toast.info('Please sign in to save job openings.');
      return;
    }
    try {
      await jobService.toggleSaveJob(jobId);
      toast.success('Saved jobs updated.');
    } catch (err) {
      toast.error('Could not update saved job.');
    }
  };

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section style={{ padding: '80rem var(--margin) 60rem', position: 'relative', overflow: 'hidden' }}>
        <div className="site-container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', marginBottom: '20rem' }}>
            <span className="badge badge-purple" style={{ padding: '6rem 14rem', fontSize: '14rem' }}>
              ⚡ Genuine MERN Recruitment Engine
            </span>
          </div>

          <h1 className="super" style={{ maxWidth: '1100rem', margin: '0 auto 24rem auto' }}>
            Modern Recruiting Built for High-Growth Tech
          </h1>

          <p className="body-large" style={{ maxWidth: '780rem', margin: '0 auto 40rem auto' }}>
            HireConnect bridges high-velocity engineering teams and verified technical talent with AI matching, direct verified applications, and real-time interview scheduling.
          </p>

          <div style={{ display: 'flex', gap: '16rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/jobs" className="btn-primary" style={{ padding: '16rem 32rem', fontSize: '16rem' }}>
              <span>Find Open Roles</span>
            </Link>
            <Link to="/signup?role=recruiter" className="btn-secondary" style={{ padding: '16rem 32rem', fontSize: '16rem' }}>
              <span>Hire Top Engineers</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted Companies Showcase */}
      <section style={{ padding: '32rem var(--margin) 60rem', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="site-container" style={{ textAlign: 'center' }}>
          <span className="caption" style={{ display: 'block', marginBottom: '24rem' }}>
            Trusted by teams at modern high-growth companies
          </span>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '40rem',
              flexWrap: 'wrap',
              opacity: 0.75
            }}
          >
            <span style={{ fontFamily: 'Saans, sans-serif', fontWeight: 600, fontSize: '22rem', color: '#fff' }}>Beatport</span>
            <span style={{ fontFamily: 'Saans, sans-serif', fontWeight: 600, fontSize: '22rem', color: '#fff' }}>PushPress</span>
            <span style={{ fontFamily: 'Saans, sans-serif', fontWeight: 600, fontSize: '22rem', color: '#fff' }}>Altos</span>
            <span style={{ fontFamily: 'Saans, sans-serif', fontWeight: 600, fontSize: '22rem', color: '#fff' }}>DjCity</span>
            <span style={{ fontFamily: 'Saans, sans-serif', fontWeight: 600, fontSize: '22rem', color: '#fff' }}>Razorpay</span>
            <span style={{ fontFamily: 'Saans, sans-serif', fontWeight: 600, fontSize: '22rem', color: '#fff' }}>Swiggy</span>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={{ padding: '80rem var(--margin)' }}>
        <div className="site-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40rem', flexWrap: 'wrap', gap: '16rem' }}>
            <div>
              <span className="caption" style={{ color: 'var(--color-accent-mint)', display: 'block', marginBottom: '8rem' }}>
                Verified Openings
              </span>
              <h2 className="h2">Featured Tech Opportunities</h2>
            </div>
            <Link to="/jobs" className="btn-secondary btn-sm">
              <span>View all openings →</span>
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '60rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <span className="spinner" style={{ width: '32px', height: '32px' }} />
              <div style={{ marginTop: '16rem' }}>Loading active job listings...</div>
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="surface-card" style={{ textAlign: 'center', padding: '60rem 20rem' }}>
              <p className="body-text" style={{ color: 'var(--text-muted)' }}>
                No active openings currently listed. Check back shortly or browse company profiles.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '24rem'
              }}
            >
              {featuredJobs.map((job) => (
                <JobCard
                  key={job._id || job.id}
                  job={job}
                  onApply={(j) => setSelectedJobForApply(j)}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Platform Pillars Section */}
      <section style={{ padding: '80rem var(--margin)', backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="site-container">
          <div style={{ textAlign: 'center', maxWidth: '800rem', margin: '0 auto 60rem auto' }}>
            <span className="caption" style={{ color: 'var(--color-accent-purple-light)', display: 'block', marginBottom: '10rem' }}>
              Engineering First
            </span>
            <h2 className="h2" style={{ marginBottom: '16rem' }}>Why High-Growth Teams Choose HireConnect</h2>
            <p className="body-text">
              We eliminated the noise from traditional recruitment with transparent scoring, private resumes, and native calendar workflows.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '28rem'
            }}
          >
            <div className="surface-card">
              <div style={{ fontSize: '28rem', marginBottom: '16rem' }}>🎯</div>
              <h3 className="h4" style={{ marginBottom: '12rem' }}>Explainable Talent Match</h3>
              <p className="body-text" style={{ fontSize: '15rem' }}>
                Deterministic 6-factor scoring breakdown based on verified skills, career seniority, education, location, and salary alignment.
              </p>
            </div>

            <div className="surface-card">
              <div style={{ fontSize: '28rem', marginBottom: '16rem' }}>🔒</div>
              <h3 className="h4" style={{ marginBottom: '12rem' }}>Private & Secure Storage</h3>
              <p className="body-text" style={{ fontSize: '15rem' }}>
                Resumes remain strictly private and accessible only to authorized hiring managers with active applications.
              </p>
            </div>

            <div className="surface-card">
              <div style={{ fontSize: '28rem', marginBottom: '16rem' }}>📅</div>
              <h3 className="h4" style={{ marginBottom: '12rem' }}>Integrated Scheduling</h3>
              <p className="body-text" style={{ fontSize: '15rem' }}>
                Candidate self-service slot discovery, time-zone conversion, and atomic double-booking prevention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Application Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          isOpen={!!selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
        />
      )}
    </div>
  );
}
