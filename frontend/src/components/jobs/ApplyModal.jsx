import React, { useState, useEffect } from 'react';
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
  const [screeningAnswers, setScreeningAnswers] = useState({});

  const screeningQuestions = job && Array.isArray(job.screeningQuestions) ? job.screeningQuestions : [];

  // Reset/initialize screening answers when job or modal changes
  useEffect(() => {
    if (job?.screeningQuestions && Array.isArray(job.screeningQuestions)) {
      const initial = {};
      job.screeningQuestions.forEach((sq, idx) => {
        const key = typeof sq === 'object' ? (sq.id || `q_${idx}`) : `q_${idx}`;
        initial[key] = '';
      });
      setScreeningAnswers(initial);
    } else {
      setScreeningAnswers({});
    }
  }, [job, isOpen]);

  if (!isOpen || !job) return null;

  const hasExistingResume = !!(profile?.resume || user?.resume);
  const existingResumeName = profile?.resume?.filename || profile?.resume?.originalName || 'Current Resume on File';

  const handleAnswerChange = (key, val) => {
    setScreeningAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required screening questions
      if (screeningQuestions.length > 0) {
        for (let i = 0; i < screeningQuestions.length; i++) {
          const sq = screeningQuestions[i];
          const key = typeof sq === 'object' ? (sq.id || `q_${i}`) : `q_${i}`;
          const qText = typeof sq === 'string' ? sq : (sq.question || sq.title || sq.text || `Question ${i + 1}`);
          const isRequired = typeof sq === 'object' ? Boolean(sq.required) : false;
          const ans = (screeningAnswers[key] || '').trim();

          if (isRequired && !ans) {
            toast.error(`Please answer the required screening question: "${qText}"`);
            setSubmitting(false);
            return;
          }
        }
      }

      let activeResumeId = profile?.resume?._id || profile?.resume?.id || profile?.resumeAssetId;

      // If candidate attached a fresh resume file
      if (resumeFile) {
        setUploadingResume(true);
        const uploadRes = await profileService.uploadResume(resumeFile);
        activeResumeId = uploadRes?.data?.resumeAsset?._id || uploadRes?.resumeAsset?._id || activeResumeId;
        setUploadingResume(false);
      }

      // Format answers matching Application schema: [{ question: string, answer: string }]
      const formattedAnswers = screeningQuestions.map((sq, i) => {
        const key = typeof sq === 'object' ? (sq.id || `q_${i}`) : `q_${i}`;
        const qText = typeof sq === 'string' ? sq : (sq.question || sq.title || sq.text || `Question ${i + 1}`);
        return {
          question: qText,
          answer: (screeningAnswers[key] || '').trim()
        };
      });

      await applicationService.applyForJob({
        jobId: job._id || job.id,
        resume: activeResumeId,
        coverLetter: coverLetter.trim(),
        answers: formattedAnswers,
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

              {/* Screening Questions (if job has any) */}
              {screeningQuestions.length > 0 && (
                <div style={{ marginBottom: '20rem', padding: '16rem', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <div
                    style={{
                      fontSize: '14rem',
                      fontWeight: 600,
                      marginBottom: '14rem',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>Screening Questions</span>
                    <span className="badge badge-purple" style={{ fontSize: '11rem' }}>
                      {screeningQuestions.length} {screeningQuestions.length === 1 ? 'Question' : 'Questions'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16rem' }}>
                    {screeningQuestions.map((sq, idx) => {
                      const key = typeof sq === 'object' ? (sq.id || `q_${idx}`) : `q_${idx}`;
                      const qText = typeof sq === 'string' ? sq : (sq.question || sq.title || sq.text || `Question ${idx + 1}`);
                      const isRequired = typeof sq === 'object' ? Boolean(sq.required) : false;
                      const qType = typeof sq === 'object' ? (sq.type || 'text') : 'text';
                      const options = typeof sq === 'object' && Array.isArray(sq.options) ? sq.options : [];

                      return (
                        <div key={key} className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ marginBottom: '6px' }}>
                            {qText}
                            {isRequired ? (
                              <span style={{ color: 'var(--color-danger, #ef4444)', marginLeft: '4px' }}>*</span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', marginLeft: '4px', fontSize: '12rem' }}>(Optional)</span>
                            )}
                          </label>

                          {qType === 'textarea' ? (
                            <textarea
                              rows={3}
                              placeholder="Type your response..."
                              value={screeningAnswers[key] || ''}
                              onChange={(e) => handleAnswerChange(key, e.target.value)}
                              required={isRequired}
                            />
                          ) : qType === 'yes_no' ? (
                            <div style={{ display: 'flex', gap: '16rem', marginTop: '6px' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                <input
                                  type="radio"
                                  name={`sq_${key}`}
                                  value="Yes"
                                  checked={screeningAnswers[key] === 'Yes'}
                                  onChange={(e) => handleAnswerChange(key, e.target.value)}
                                  required={isRequired}
                                />
                                <span>Yes</span>
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                <input
                                  type="radio"
                                  name={`sq_${key}`}
                                  value="No"
                                  checked={screeningAnswers[key] === 'No'}
                                  onChange={(e) => handleAnswerChange(key, e.target.value)}
                                  required={isRequired}
                                />
                                <span>No</span>
                              </label>
                            </div>
                          ) : qType === 'multiple_choice' && options.length > 0 ? (
                            <select
                              value={screeningAnswers[key] || ''}
                              onChange={(e) => handleAnswerChange(key, e.target.value)}
                              required={isRequired}
                            >
                              <option value="">-- Select an option --</option>
                              {options.map((opt, oIdx) => (
                                <option key={oIdx} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              placeholder="Your answer..."
                              value={screeningAnswers[key] || ''}
                              onChange={(e) => handleAnswerChange(key, e.target.value)}
                              required={isRequired}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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
