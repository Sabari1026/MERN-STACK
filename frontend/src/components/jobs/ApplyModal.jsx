import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { applicationService } from '../../services/applicationService';
import { profileService } from '../../services/profileService';
import { Link } from 'react-router-dom';

export function ApplyModal({ job, isOpen, onClose, onSuccess }) {
  const { user, profile, isAuthenticated, role } = useAuth();
  const { toast } = useToast();

  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  if (!isOpen || !job) return null;

  const hasExistingResume = !!(profile?.resume || user?.resume);
  const existingResumeName = profile?.resume?.filename || profile?.resume?.originalName || 'Current Resume on File';

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let activeResumeId = profile?.resume?._id || profile?.resume?.id || profile?.resumeAssetId;

      // If candidate attached a fresh resume file
      if (resumeFile) {
        setUploadingResume(true);
        const uploadRes = await profileService.uploadResume(resumeFile);
        activeResumeId = uploadRes?.data?.resumeAsset?._id || uploadRes?.resumeAsset?._id || activeResumeId;
        setUploadingResume(false);
      }

      await applicationService.applyForJob({
        jobId: job._id || job.id,
        resume: activeResumeId,
        coverLetter: coverLetter.trim(),
        candidateSnapshot: {
          name: user.name,
          email: user.email,
          headline: profile?.headline || '',
          skills: profile?.skills || []
        }
      });

      toast.success(`Application submitted successfully for ${job.title}!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit application. Please check your resume.');
    } finally {
      setSubmitting(false);
      setUploadingResume(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="caption" style={{ color: 'var(--color-accent-purple-light)', marginBottom: '4px' }}>
              Direct Application
            </div>
            <div className="h4" style={{ color: 'var(--text-primary)' }}>
              {job.title}
            </div>
            <div style={{ fontSize: '14rem', color: 'var(--text-secondary)' }}>
              {job.companyName || job.company?.name || 'Verified Tech Partner'}
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '40rem 20rem' }}>
            <p className="body-text" style={{ marginBottom: '24rem' }}>
              Please sign in to your candidate account to submit your application and track recruitment progress.
            </p>
            <div style={{ display: 'flex', gap: '12rem', justifyContent: 'center' }}>
              <Link to="/signin" className="btn-primary" onClick={onClose}>
                <span>Sign In</span>
              </Link>
              <Link to="/signup" className="btn-secondary" onClick={onClose}>
                <span>Create Candidate Profile</span>
              </Link>
            </div>
          </div>
        ) : role !== 'candidate' ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '40rem 20rem' }}>
            <p className="body-text" style={{ color: 'var(--color-warning)' }}>
              You are currently signed in as a Recruiter. Only candidate accounts can submit job applications.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApply}>
            <div className="modal-body">
              {/* Candidate Info */}
              <div style={{ marginBottom: '20rem', padding: '16rem', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '13rem', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'Saans Mono, monospace' }}>
                  Applying As
                </div>
                <div style={{ fontWeight: 500, fontSize: '16rem', color: 'var(--text-primary)' }}>
                  {user.name} ({user.email})
                </div>
              </div>

              {/* Resume selection */}
              <div className="form-group">
                <label className="form-label">Resume Document (PDF or DOCX)</label>
                {hasExistingResume && !resumeFile && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12rem 16rem',
                      backgroundColor: 'rgba(52, 211, 153, 0.08)',
                      border: '1px solid rgba(52, 211, 153, 0.25)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '8rem'
                    }}
                  >
                    <span style={{ fontSize: '14rem', color: 'var(--color-accent-mint)' }}>
                      📄 {existingResumeName} (Saved on profile)
                    </span>
                    <label style={{ fontSize: '13rem', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>
                      Change
                      <input
                        type="file"
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        style={{ display: 'none' }}
                        onChange={(e) => setResumeFile(e.target.files[0] || null)}
                      />
                    </label>
                  </div>
                )}

                {(!hasExistingResume || resumeFile) && (
                  <div>
                    <input
                      type="file"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => setResumeFile(e.target.files[0] || null)}
                      required={!hasExistingResume}
                    />
                    <div className="form-hint">Accepted formats: PDF or DOCX up to 5MB</div>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div className="form-group">
                <label className="form-label">
                  Cover Note / Message to Recruiter
                  <span style={{ color: 'var(--text-muted)' }}>(Optional)</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Share a brief note highlighting relevant experience or your motivation for this role..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
                <span>Cancel</span>
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner" />
                    <span>{uploadingResume ? 'Uploading Resume...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <span>Submit Application</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
