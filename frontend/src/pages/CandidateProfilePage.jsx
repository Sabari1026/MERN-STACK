import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { profileService } from '../services/profileService';
import { applicationService } from '../services/applicationService';
import { jobService } from '../services/jobService';

export function CandidateProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, profile, updateProfileState, refreshUser } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [saving, setSaving] = useState(false);
  const [loadingApps, setLoadingApps] = useState(false);
  const [myApplications, setMyApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  // Form State
  const [headline, setHeadline] = useState(profile?.headline || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [isDiscoverable, setIsDiscoverable] = useState(profile?.isDiscoverable ?? true);
  const [skills, setSkills] = useState(profile?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  // Experience state
  const [experiences, setExperiences] = useState(profile?.experience || []);
  // Education state
  const [education, setEducation] = useState(profile?.education || []);

  // Sync state when profile loads
  useEffect(() => {
    if (profile) {
      setHeadline(profile.headline || '');
      setBio(profile.bio || '');
      setLocation(profile.location || '');
      setPhone(profile.phone || '');
      setIsDiscoverable(profile.isDiscoverable ?? true);
      setSkills(profile.skills || []);
      setExperiences(profile.experience || []);
      setEducation(profile.education || []);
    }
  }, [profile]);

  // Load applications or saved jobs when tab switches
  useEffect(() => {
    if (activeTab === 'applications') {
      async function loadApps() {
        setLoadingApps(true);
        try {
          const res = await applicationService.getMyApplications();
          const list = res?.data?.applications || res?.applications || [];
          setMyApplications(list);
        } catch (err) {
          // ignore
        } finally {
          setLoadingApps(false);
        }
      }
      loadApps();
    } else if (activeTab === 'saved') {
      async function loadSaved() {
        setLoadingSaved(true);
        try {
          const res = await jobService.getSavedJobs();
          const list = res?.data?.savedJobs || res?.savedJobs || [];
          setSavedJobs(list);
        } catch (err) {
          // ignore
        } finally {
          setLoadingSaved(false);
        }
      }
      loadSaved();
    }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await profileService.updateCandidateProfile({
        headline: headline.trim(),
        bio: bio.trim(),
        location: location.trim(),
        phone: phone.trim(),
        isDiscoverable,
        skills,
        experience: experiences,
        education
      });

      const updated = res?.data?.profile || res?.profile || res;
      updateProfileState(updated);
      toast.success('Candidate profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await profileService.uploadAvatar(file);
      toast.success('Avatar updated successfully!');
      await refreshUser();
    } catch (err) {
      toast.error(err.message || 'Avatar upload failed. Accepts JPEG, PNG, WebP up to 2MB.');
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await profileService.deleteAvatar();
      toast.info('Avatar removed; restored initials.');
      await refreshUser();
    } catch (err) {
      toast.error('Failed to remove avatar.');
    }
  };

  // Resume upload & download
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await profileService.uploadResume(file);
      toast.success('Resume document uploaded and verified successfully!');
      await refreshUser();
    } catch (err) {
      toast.error(err.message || 'Resume upload failed. Accepts PDF or DOCX up to 5MB.');
    }
  };

  const handleDownloadResume = async () => {
    try {
      const blob = await profileService.downloadOwnResume();
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', profile?.resume?.filename || 'My_Resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Downloading resume...');
    } catch (err) {
      toast.error('Could not download resume document.');
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to remove your resume?')) return;
    try {
      await profileService.deleteResume();
      toast.info('Resume deleted from profile.');
      await refreshUser();
    } catch (err) {
      toast.error('Could not remove resume.');
    }
  };

  const completeness = profile?.completeness ?? 65;

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="site-container">
          {/* Header Card */}
          <div className="surface-card" style={{ padding: '32px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {/* Avatar with upload trigger */}
                <div style={{ position: 'relative' }}>
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-medium)' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-accent-purple)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        fontWeight: 600,
                        fontFamily: 'Saans Mono, monospace'
                      }}
                    >
                      {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                    </div>
                  )}

                  <label
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: '50%',
                      padding: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                    title="Change Avatar"
                  >
                    📷
                    <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                  </label>
                </div>

                <div>
                  <h1 className="h3" style={{ marginBottom: '4px' }}>
                    {user?.name || 'Candidate Profile'}
                  </h1>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '8px' }}>
                    {profile?.headline || 'Add your professional headline'}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="badge badge-purple">Candidate</span>
                    <span className={`badge ${isDiscoverable ? 'badge-mint' : 'badge-gray'}`}>
                      {isDiscoverable ? '✓ Discoverable by Recruiters' : '🔒 Private (Unlisted)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Completeness Meter */}
              <div style={{ minWidth: '200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', fontFamily: 'Saans Mono, monospace' }}>
                  <span>Profile Strength</span>
                  <span style={{ color: 'var(--color-accent-mint)' }}>{completeness}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${completeness}%`, height: '100%', backgroundColor: 'var(--color-accent-mint)', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '32px',
              overflowX: 'auto',
              paddingBottom: '2px'
            }}
          >
            {[
              { id: 'profile', label: 'Profile Details' },
              { id: 'resume', label: 'Resume & Documents' },
              { id: 'applications', label: 'Application History' },
              { id: 'saved', label: 'Saved Jobs' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                style={{
                  padding: '12px 20px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${activeTab === tab.id ? 'var(--color-accent-purple)' : 'transparent'}`,
                  color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: '15px',
                  fontFamily: 'Saans Mono, monospace',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Profile Details Form */}
          {activeTab === 'profile' && (
            <div className="surface-card" style={{ padding: '32px' }}>
              <form onSubmit={handleSaveProfile}>
                <div className="grid-12">
                  <div className="col-12 form-group">
                    <label className="form-label">Professional Headline</label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Platform Engineer | Distributed Systems & Kubernetes"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                    />
                  </div>

                  <div className="col-6 form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru, India or Remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <div className="col-6 form-group">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="col-12 form-group">
                    <label className="form-label">Professional Bio / Summary</label>
                    <textarea
                      rows={4}
                      placeholder="Summarize your background, core technical strengths, and what engineering problems excite you..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  {/* Skills Editor */}
                  <div className="col-12 form-group">
                    <label className="form-label">Core Skills & Technologies</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <input
                        type="text"
                        placeholder="Add a technology (e.g. Node.js, Go, MongoDB, AWS)..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                      />
                      <button type="button" className="btn-secondary" onClick={handleAddSkill}>
                        <span>Add</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {skills.map((skill, idx) => (
                        <span key={idx} className="badge badge-purple" style={{ padding: '6px 12px', fontSize: '13px' }}>
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: '6px' }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Discoverability Toggle */}
                  <div className="col-12" style={{ padding: '16px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isDiscoverable}
                        onChange={(e) => setIsDiscoverable(e.target.checked)}
                        style={{ width: 'auto' }}
                      />
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '15px' }}>Enable Recruiter Discoverability</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          When enabled, verified recruiters can discover your profile and match you for relevant job openings.
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn-primary" disabled={saving}>
                      {saving ? <span>Saving...</span> : <span>Save Profile Changes</span>}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Resume & Documents */}
          {activeTab === 'resume' && (
            <div className="surface-card" style={{ padding: '32px' }}>
              <h3 className="h3" style={{ marginBottom: '16px' }}>Resume Document</h3>
              <p className="body-text" style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
                Your resume is securely stored in local persistent disk storage with path traversal and binary signature protection.
                It is strictly private and shared only when you submit an application.
              </p>

              {profile?.resume ? (
                <div
                  style={{
                    padding: '24px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    backgroundColor: 'rgba(52, 211, 153, 0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '32px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 500, color: 'var(--color-accent-mint)', marginBottom: '4px' }}>
                      📄 {profile.resume.filename || profile.resume.originalName || 'Uploaded Resume Document'}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      MIME: {profile.resume.mimeType || 'application/pdf'} • Uploaded:{' '}
                      {profile.resume.createdAt ? new Date(profile.resume.createdAt).toLocaleDateString() : 'Active'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="button" className="btn-secondary btn-sm" onClick={handleDownloadResume}>
                      <span>Download</span>
                    </button>
                    <button type="button" className="btn-danger btn-sm" onClick={handleDeleteResume}>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    border: '2px dashed var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '48px 24px',
                    textAlign: 'center',
                    marginBottom: '32px'
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>📤</div>
                  <h4 className="h4" style={{ marginBottom: '8px' }}>No resume uploaded yet</h4>
                  <p className="body-small" style={{ marginBottom: '20px' }}>
                    Upload an authentic PDF or DOCX file (up to 5MB)
                  </p>
                  <label className="btn-primary" style={{ display: 'inline-flex', cursor: 'pointer' }}>
                    <span>Select Resume File</span>
                    <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style={{ display: 'none' }} onChange={handleResumeUpload} />
                  </label>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Applications */}
          {activeTab === 'applications' && (
            <div className="surface-card" style={{ padding: '32px' }}>
              <h3 className="h3" style={{ marginBottom: '20px' }}>Your Job Applications</h3>

              {loadingApps ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <span className="spinner" />
                </div>
              ) : myApplications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                  <p className="body-text">You haven't submitted any job applications yet.</p>
                  <Link to="/jobs" className="btn-primary btn-sm" style={{ marginTop: '16px', display: 'inline-flex' }}>
                    <span>Browse Open Positions</span>
                  </Link>
                </div>
              ) : (
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Job Opening</th>
                        <th>Company</th>
                        <th>Applied Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myApplications.map((app) => (
                        <tr key={app._id || app.id}>
                          <td>
                            <Link to={`/jobs/${app.job?._id || app.job}`} style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                              {app.job?.title || 'Engineering Role'}
                            </Link>
                          </td>
                          <td>{app.company?.name || app.job?.companyName || 'Verified Company'}</td>
                          <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span
                              className={`badge ${
                                app.status === 'shortlisted' || app.status === 'offered'
                                  ? 'badge-mint'
                                  : app.status === 'interview'
                                  ? 'badge-purple'
                                  : app.status === 'rejected'
                                  ? 'badge-red'
                                  : 'badge-gray'
                              }`}
                            >
                              {app.status ? app.status.toUpperCase() : 'APPLIED'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Saved Jobs */}
          {activeTab === 'saved' && (
            <div className="surface-card" style={{ padding: '32px' }}>
              <h3 className="h3" style={{ marginBottom: '20px' }}>Bookmarked Opportunities</h3>

              {loadingSaved ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <span className="spinner" />
                </div>
              ) : savedJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                  <p className="body-text">You haven't saved any jobs yet.</p>
                  <Link to="/jobs" className="btn-primary btn-sm" style={{ marginTop: '16px', display: 'inline-flex' }}>
                    <span>Browse Openings</span>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                  {savedJobs.map((item) => {
                    const job = item.job || item;
                    return (
                      <div key={item._id || item.id} className="surface-card" style={{ padding: '20px' }}>
                        <div style={{ fontWeight: 500, fontSize: '18px', marginBottom: '4px' }}>
                          <Link to={`/jobs/${job._id || job.id}`}>{job.title}</Link>
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                          {job.companyName || job.company?.name || 'Tech Company'} • {job.location || 'Remote'}
                        </div>
                        <Link to={`/jobs/${job._id || job.id}`} className="btn-primary btn-sm">
                          <span>View Opening</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
