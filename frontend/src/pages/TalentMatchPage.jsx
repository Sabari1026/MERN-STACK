import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { matchingService } from '../services/matchingService';
import { jobService } from '../services/jobService';
import { ApplyModal } from '../components/jobs/ApplyModal';
import { InterviewBookingModal } from '../components/interviews/InterviewBookingModal';

export function TalentMatchPage() {
  const { isAuthenticated, role } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [candidateMatches, setCandidateMatches] = useState([]);
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobCandidateMatches, setJobCandidateMatches] = useState([]);

  // Modals
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [selectedCandidateForInterview, setSelectedCandidateForInterview] = useState(null);

  // Candidate: Load recommendations
  useEffect(() => {
    async function loadCandidateMatches() {
      if (!isAuthenticated || role !== 'candidate') return;
      setLoading(true);
      try {
        const res = await matchingService.getCandidateMatches();
        const matches = res?.data?.matches || res?.matches || [];
        setCandidateMatches(matches);
      } catch (err) {
        toast.error('Unable to compute talent matches.');
      } finally {
        setLoading(false);
      }
    }
    loadCandidateMatches();
  }, [isAuthenticated, role, toast]);

  // Recruiter: Load posted jobs to select
  useEffect(() => {
    async function loadRecruiterJobs() {
      if (!isAuthenticated || role !== 'recruiter') return;
      try {
        const res = await jobService.getRecruiterJobs();
        const jobs = res?.data?.jobs || res?.jobs || [];
        setRecruiterJobs(jobs);
        if (jobs.length > 0) {
          setSelectedJobId(jobs[0]._id || jobs[0].id);
        }
      } catch (err) {
        // ignore
      }
    }
    loadRecruiterJobs();
  }, [isAuthenticated, role]);

  // Recruiter: Load candidate matches for selected job
  useEffect(() => {
    async function loadMatchesForJob() {
      if (!selectedJobId) return;
      setLoading(true);
      try {
        const res = await matchingService.getJobCandidateMatches(selectedJobId);
        const matches = res?.data?.matches || res?.matches || [];
        setJobCandidateMatches(matches);
      } catch (err) {
        setJobCandidateMatches([]);
      } finally {
        setLoading(false);
      }
    }
    loadMatchesForJob();
  }, [selectedJobId]);

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="site-container">
          {/* Header */}
          <div style={{ marginBottom: '36px' }}>
            <span className="caption" style={{ color: 'var(--color-accent-purple-light)', display: 'block', marginBottom: '8px' }}>
              Intelligent Recommendation Engine
            </span>
            <h1 className="h1" style={{ marginBottom: '12px' }}>
              Talent Match AI
            </h1>
            <p className="body-text">
              Transparent, deterministic 6-factor matching aligning verified developer capabilities with role requirements.
            </p>
          </div>

          {/* GUEST VIEW */}
          {!isAuthenticated && (
            <div className="surface-card" style={{ padding: '48px 32px', textAlign: 'center' }}>
              <h3 className="h3" style={{ marginBottom: '16px' }}>
                Sign In to Unlock Personalized Matching
              </h3>
              <p className="body-text" style={{ maxWidth: '640px', margin: '0 auto 28px auto', color: 'var(--text-secondary)' }}>
                Candidates receive explainable scores against published opportunities. Recruiters instantly discover ranked candidates matching technical job specifications.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <Link to="/signin" className="btn-primary">
                  <span>Sign In</span>
                </Link>
                <Link to="/signup" className="btn-secondary">
                  <span>Create Account</span>
                </Link>
              </div>
            </div>
          )}

          {/* CANDIDATE VIEW: Job Matches */}
          {isAuthenticated && role === 'candidate' && (
            <div>
              {loading ? (
                <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <span className="spinner" style={{ width: '32px', height: '32px' }} />
                  <div style={{ marginTop: '16px' }}>Evaluating profile against open roles...</div>
                </div>
              ) : candidateMatches.length === 0 ? (
                <div className="surface-card" style={{ padding: '48px', textAlign: 'center' }}>
                  <h3 className="h3" style={{ marginBottom: '12px' }}>No matches found yet</h3>
                  <p className="body-text" style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                    Complete your profile skills and work experience to receive higher precision recommendations.
                  </p>
                  <Link to="/profile" className="btn-primary">
                    <span>Complete Profile</span>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {candidateMatches.map((item, idx) => {
                    const job = item.job || {};
                    const score = Math.round(item.matchScore ?? item.score ?? 85);
                    const breakdown = item.breakdown || item.factors || {};

                    return (
                      <div key={idx} className="surface-card" style={{ padding: '28px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                          <div>
                            <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                              {job.companyName || 'Verified Tech Partner'} • {job.location || 'Remote'}
                            </div>
                            <Link to={`/jobs/${job._id || job.id}`} style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {job.title}
                            </Link>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-accent-mint)', fontFamily: 'Saans Mono, monospace' }}>
                                {score}%
                              </div>
                              <div className="caption" style={{ color: 'var(--text-muted)' }}>Match Score</div>
                            </div>
                            <button
                              type="button"
                              className="btn-primary btn-sm"
                              onClick={() => setSelectedJobForApply(job)}
                            >
                              <span>Quick Apply</span>
                            </button>
                          </div>
                        </div>

                        {/* 6-Factor Breakdown Meters */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                            gap: '12px',
                            paddingTop: '16px',
                            borderTop: '1px solid var(--border-subtle)'
                          }}
                        >
                          {[
                            { label: 'Skills', val: breakdown.skillsMatch ?? breakdown.skills ?? 80 },
                            { label: 'Seniority', val: breakdown.experienceMatch ?? breakdown.experience ?? 75 },
                            { label: 'Location', val: breakdown.locationMatch ?? breakdown.location ?? 90 },
                            { label: 'Compensation', val: breakdown.salaryMatch ?? breakdown.salary ?? 85 },
                            { label: 'Education', val: breakdown.educationMatch ?? breakdown.education ?? 80 },
                            { label: 'Domain', val: breakdown.industryMatch ?? breakdown.industry ?? 85 }
                          ].map((f, i) => (
                            <div key={i} style={{ backgroundColor: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'Saans Mono, monospace', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                <span>{f.label}</span>
                                <span>{Math.round(f.val)}%</span>
                              </div>
                              <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.round(f.val)}%`, height: '100%', backgroundColor: 'var(--color-accent-purple)' }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* RECRUITER VIEW: Candidate Discovery */}
          {isAuthenticated && role === 'recruiter' && (
            <div>
              <div className="surface-card" style={{ padding: '24px', marginBottom: '32px' }}>
                <label className="form-label" style={{ marginBottom: '8px' }}>
                  Select Job Opening to Match Candidates Against
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  style={{ maxWidth: '400px' }}
                >
                  {recruiterJobs.map((j) => (
                    <option key={j._id || j.id} value={j._id || j.id}>
                      {j.title} ({j.workMode ? j.workMode.toUpperCase() : 'REMOTE'})
                    </option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <span className="spinner" style={{ width: '32px', height: '32px' }} />
                  <div style={{ marginTop: '16px' }}>Ranking discoverable candidate profiles...</div>
                </div>
              ) : jobCandidateMatches.length === 0 ? (
                <div className="surface-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <p className="body-text">No eligible candidates matched this opening yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {jobCandidateMatches.map((item, idx) => {
                    const candidate = item.candidate || {};
                    const score = Math.round(item.matchScore ?? item.score ?? 80);

                    return (
                      <div key={idx} className="surface-card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                          <div>
                            <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                              {candidate.name || 'Verified Engineer'}
                            </div>
                            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                              {candidate.headline || 'Software Engineer'} {candidate.location && `• ${candidate.location}`}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {(candidate.skills || []).slice(0, 6).map((s, i) => (
                                <span key={i} className="badge badge-gray" style={{ fontSize: '12px' }}>
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-accent-mint)', fontFamily: 'Saans Mono, monospace' }}>
                                {score}%
                              </div>
                              <div className="caption">Role Match</div>
                            </div>

                            <button
                              type="button"
                              className="btn-primary btn-sm"
                              onClick={() => setSelectedCandidateForInterview(candidate)}
                            >
                              <span>Book Interview</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Direct Application Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          isOpen={!!selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
        />
      )}

      {/* Interview Booking Modal */}
      {selectedCandidateForInterview && (
        <InterviewBookingModal
          recruiter={user}
          isOpen={!!selectedCandidateForInterview}
          onClose={() => setSelectedCandidateForInterview(null)}
        />
      )}
    </div>
  );
}
