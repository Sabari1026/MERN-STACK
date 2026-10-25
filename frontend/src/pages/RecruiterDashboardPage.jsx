import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { companyService } from '../services/companyService';
import { profileService } from '../services/profileService';
import { analyticsService } from '../services/analyticsService';

export function RecruiterDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, company, refreshUser } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'jobs');
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Job creation / editing modal
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Engineering',
    workMode: 'remote',
    jobType: 'full_time',
    location: '',
    description: '',
    skills: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'USD'
  });
  const [savingJob, setSavingJob] = useState(false);

  // Applicant Pipeline State
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [selectedJobFilter, setSelectedJobFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Company Edit Form State
  const [companyName, setCompanyName] = useState(company?.name || '');
  const [companyWebsite, setCompanyWebsite] = useState(company?.website || '');
  const [companyDescription, setCompanyDescription] = useState(company?.description || '');
  const [companyIndustry, setCompanyIndustry] = useState(company?.industry || 'Software & Internet');
  const [companySize, setCompanySize] = useState(company?.size || '50-200');
  const [savingCompany, setSavingCompany] = useState(false);

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Load Recruiter Jobs
  const loadJobs = useCallback(async () => {
    setLoadingJobs(true);
    try {
      const res = await jobService.getRecruiterJobs({ limit: 50 });
      const items = res?.data?.jobs || res?.jobs || [];
      setJobs(items);
    } catch (err) {
      toast.error('Unable to load recruiter jobs.');
    } finally {
      setLoadingJobs(false);
    }
  }, [toast]);

  // Load Applications
  const loadApplications = useCallback(async () => {
    setLoadingApps(true);
    try {
      const params = {};
      if (selectedJobFilter) params.jobId = selectedJobFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await applicationService.getRecruiterApplications(params);
      const items = res?.data?.applications || res?.applications || [];
      setApplications(items);
    } catch (err) {
      toast.error('Unable to load applications pipeline.');
    } finally {
      setLoadingApps(false);
    }
  }, [selectedJobFilter, statusFilter, toast]);

  useEffect(() => {
    if (activeTab === 'jobs') {
      loadJobs();
    } else if (activeTab === 'applicants') {
      loadJobs();
      loadApplications();
    } else if (activeTab === 'analytics') {
      async function loadMetrics() {
        setLoadingAnalytics(true);
        try {
          const res = await analyticsService.getRecruiterOverview();
          setAnalyticsData(res?.data || res);
        } catch (err) {
          // ignore
        } finally {
          setLoadingAnalytics(false);
        }
      }
      loadMetrics();
    }
  }, [activeTab, loadJobs, loadApplications]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Job Actions
  const handleCreateJob = async (e) => {
    e.preventDefault();
    setSavingJob(true);
    try {
      const skillsArray = jobForm.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await jobService.createJob({
        title: jobForm.title.trim(),
        department: jobForm.department,
        workMode: jobForm.workMode,
        jobType: jobForm.jobType,
        location: jobForm.location.trim() || 'Remote',
        description: jobForm.description.trim(),
        skills: skillsArray,
        salaryMin: jobForm.salaryMin ? Number(jobForm.salaryMin) : undefined,
        salaryMax: jobForm.salaryMax ? Number(jobForm.salaryMax) : undefined,
        salaryCurrency: jobForm.salaryCurrency
      });

      toast.success('Job opening published successfully!');
      setIsJobModalOpen(false);
      setJobForm({
        title: '',
        department: 'Engineering',
        workMode: 'remote',
        jobType: 'full_time',
        location: '',
        description: '',
        skills: '',
        salaryMin: '',
        salaryMax: '',
        salaryCurrency: 'USD'
      });
      loadJobs();
    } catch (err) {
      toast.error(err.message || 'Failed to create job opening.');
    } finally {
      setSavingJob(false);
    }
  };

  const handlePauseJob = async (id) => {
    try {
      await jobService.pauseJob(id);
      toast.info('Job opening paused.');
      loadJobs();
    } catch (err) {
      toast.error('Could not pause job.');
    }
  };

  const handlePublishJob = async (id) => {
    try {
      await jobService.publishJob(id);
      toast.success('Job opening resumed and visible.');
      loadJobs();
    } catch (err) {
      toast.error('Could not publish job.');
    }
  };

  const handleCloseJob = async (id) => {
    if (!window.confirm('Are you sure you want to close this job opening?')) return;
    try {
      await jobService.closeJob(id);
      toast.info('Job closed.');
      loadJobs();
    } catch (err) {
      toast.error('Could not close job.');
    }
  };

  // Status Update on Application
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await applicationService.updateStatus(appId, newStatus);
      toast.success(`Application marked as ${newStatus}`);
      setApplications((prev) =>
        prev.map((a) => (a._id === appId || a.id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      toast.error('Failed to update applicant status.');
    }
  };

  // Authorized Candidate Resume Download
  const handleDownloadCandidateResume = async (candidateId, candidateName) => {
    try {
      const blob = await profileService.downloadResumeByUserId(candidateId);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${candidateName || 'Candidate'}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Downloading verified resume document...');
    } catch (err) {
      toast.error('Unauthorized to download resume or candidate has not uploaded a file.');
    }
  };

  // Company Updates
  const handleSaveCompany = async (e) => {
    e.preventDefault();
    if (!company?._id && !company?.id) {
      toast.error('No company associated with recruiter account.');
      return;
    }
    setSavingCompany(true);
    try {
      const companyId = company._id || company.id;
      await companyService.updateCompany(companyId, {
        name: companyName.trim(),
        website: companyWebsite.trim(),
        description: companyDescription.trim(),
        industry: companyIndustry,
        size: companySize
      });
      toast.success('Company profile updated successfully!');
      await refreshUser();
    } catch (err) {
      toast.error(err.message || 'Failed to update company details.');
    } finally {
      setSavingCompany(false);
    }
  };

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="site-container">
          {/* Header */}
          <div className="surface-card" style={{ padding: '32px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div className="caption" style={{ color: 'var(--color-accent-mint)', marginBottom: '4px' }}>
                  Recruitment Center
                </div>
                <h1 className="h3" style={{ marginBottom: '4px' }}>
                  {company?.name || 'Recruiter Dashboard'}
                </h1>
                <div style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                  Logged in as {user?.name} ({user?.email})
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn-primary" onClick={() => setIsJobModalOpen(true)}>
                  <span>+ Post New Job</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
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
              { id: 'jobs', label: 'Job Openings' },
              { id: 'applicants', label: 'Applicant Pipeline' },
              { id: 'company', label: 'Company Profile' },
              { id: 'analytics', label: 'Recruitment Analytics' }
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

          {/* TAB 1: Jobs Management */}
          {activeTab === 'jobs' && (
            <div className="surface-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 className="h3">Active Listings ({jobs.length})</h3>
                <button type="button" className="btn-secondary btn-sm" onClick={loadJobs}>
                  <span>Refresh</span>
                </button>
              </div>

              {loadingJobs ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <span className="spinner" />
                </div>
              ) : jobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <p className="body-text">No job openings created yet.</p>
                  <button type="button" className="btn-primary" style={{ marginTop: '16px' }} onClick={() => setIsJobModalOpen(true)}>
                    <span>Create Your First Opening</span>
                  </button>
                </div>
              ) : (
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Department</th>
                        <th>Work Mode</th>
                        <th>Status</th>
                        <th>Applicants</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((j) => (
                        <tr key={j._id || j.id}>
                          <td style={{ fontWeight: 500 }}>{j.title}</td>
                          <td>{j.department || 'Engineering'}</td>
                          <td>
                            <span className="badge badge-gray">{j.workMode ? j.workMode.toUpperCase() : 'REMOTE'}</span>
                          </td>
                          <td>
                            <span className={`badge ${j.status === 'published' ? 'badge-mint' : j.status === 'paused' ? 'badge-amber' : 'badge-red'}`}>
                              {j.status ? j.status.toUpperCase() : 'ACTIVE'}
                            </span>
                          </td>
                          <td>{j.applicantCount ?? 0}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {j.status === 'published' ? (
                                <button type="button" className="btn-secondary btn-sm" onClick={() => handlePauseJob(j._id || j.id)}>
                                  <span>Pause</span>
                                </button>
                              ) : (
                                <button type="button" className="btn-primary btn-sm" onClick={() => handlePublishJob(j._id || j.id)}>
                                  <span>Publish</span>
                                </button>
                              )}
                              <button type="button" className="btn-danger btn-sm" onClick={() => handleCloseJob(j._id || j.id)}>
                                <span>Close</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Applicant Pipeline */}
          {activeTab === 'applicants' && (
            <div className="surface-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <h3 className="h3">Review Pipeline ({applications.length})</h3>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <select value={selectedJobFilter} onChange={(e) => setSelectedJobFilter(e.target.value)} style={{ width: '200px' }}>
                    <option value="">All Job Postings</option>
                    {jobs.map((j) => (
                      <option key={j._id || j.id} value={j._id || j.id}>
                        {j.title}
                      </option>
                    ))}
                  </select>

                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '160px' }}>
                    <option value="">All Statuses</option>
                    <option value="applied">Applied</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview">Interview</option>
                    <option value="offered">Offered</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {loadingApps ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <span className="spinner" />
                </div>
              ) : applications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <p className="body-text">No applicants currently in this review queue.</p>
                </div>
              ) : (
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Role Applied</th>
                        <th>Applied Date</th>
                        <th>Resume</th>
                        <th>Review Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => {
                        const candidate = app.candidate || {};
                        const candidateName = app.candidateSnapshot?.name || candidate.name || 'Candidate';
                        const candidateEmail = app.candidateSnapshot?.email || candidate.email || '';
                        const candidateId = candidate._id || candidate.id || app.candidate;

                        return (
                          <tr key={app._id || app.id}>
                            <td>
                              <div style={{ fontWeight: 500 }}>{candidateName}</div>
                              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{candidateEmail}</div>
                            </td>
                            <td>{app.job?.title || 'Engineering Role'}</td>
                            <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                            <td>
                              <button
                                type="button"
                                className="btn-secondary btn-sm"
                                onClick={() => handleDownloadCandidateResume(candidateId, candidateName)}
                              >
                                <span>📄 View Resume</span>
                              </button>
                            </td>
                            <td>
                              <select
                                value={app.status || 'applied'}
                                onChange={(e) => handleUpdateStatus(app._id || app.id, e.target.value)}
                                style={{ width: '150px', padding: '6px 10px', fontSize: '13px' }}
                              >
                                <option value="applied">Applied</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="interview">Interview</option>
                                <option value="offered">Offered</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Company Profile */}
          {activeTab === 'company' && (
            <div className="surface-card" style={{ padding: '32px' }}>
              <h3 className="h3" style={{ marginBottom: '20px' }}>Company Information</h3>
              <form onSubmit={handleSaveCompany}>
                <div className="grid-12">
                  <div className="col-6 form-group">
                    <label className="form-label">Company Name</label>
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                  </div>

                  <div className="col-6 form-group">
                    <label className="form-label">Website</label>
                    <input type="url" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
                  </div>

                  <div className="col-6 form-group">
                    <label className="form-label">Industry</label>
                    <input type="text" value={companyIndustry} onChange={(e) => setCompanyIndustry(e.target.value)} />
                  </div>

                  <div className="col-6 form-group">
                    <label className="form-label">Company Size</label>
                    <select value={companySize} onChange={(e) => setCompanySize(e.target.value)}>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="50-200">50-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                  </div>

                  <div className="col-12 form-group">
                    <label className="form-label">Company Overview</label>
                    <textarea rows={4} value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} />
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn-primary" disabled={savingCompany}>
                      {savingCompany ? <span>Saving...</span> : <span>Save Company Details</span>}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: Recruitment Analytics */}
          {activeTab === 'analytics' && (
            <div className="surface-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <h3 className="h3">Recruitment Metrics Overview</h3>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={async () => {
                    try {
                      const blob = await analyticsService.exportRecruiterJobsReport();
                      const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/csv' }));
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', 'recruitment_jobs_report.csv');
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                      toast.success('Downloaded CSV Report.');
                    } catch (err) {
                      toast.error('Failed to export CSV report.');
                    }
                  }}
                >
                  <span>Export CSV</span>
                </button>
              </div>

              {loadingAnalytics ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <span className="spinner" />
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div className="surface-card" style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--color-accent-purple-light)' }}>
                      {jobs.length}
                    </div>
                    <div className="caption" style={{ marginTop: '8px' }}>Active Openings</div>
                  </div>

                  <div className="surface-card" style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--color-accent-mint)' }}>
                      {applications.length}
                    </div>
                    <div className="caption" style={{ marginTop: '8px' }}>Total Applications</div>
                  </div>

                  <div className="surface-card" style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--color-warning)' }}>
                      {applications.filter((a) => a.status === 'shortlisted' || a.status === 'interview').length}
                    </div>
                    <div className="caption" style={{ marginTop: '8px' }}>Interviews & Shortlists</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Post Job Modal */}
      {isJobModalOpen && (
        <div className="modal-overlay" onClick={() => setIsJobModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="h4">Post New Tech Opening</div>
              <button className="modal-close-btn" onClick={() => setIsJobModalOpen(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleCreateJob}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Role Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Backend Engineer (Node.js/Go)"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-12">
                  <div className="col-6 form-group">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      value={jobForm.department}
                      onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label className="form-label">Work Mode</label>
                    <select
                      value={jobForm.workMode}
                      onChange={(e) => setJobForm({ ...jobForm, workMode: e.target.value })}
                    >
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onsite">On-site</option>
                    </select>
                  </div>
                </div>

                <div className="grid-12">
                  <div className="col-6 form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Remote (India / US) or Bengaluru"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label className="form-label">Contract Type</label>
                    <select
                      value={jobForm.jobType}
                      onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                    >
                      <option value="full_time">Full Time</option>
                      <option value="contract">Contract</option>
                      <option value="part_time">Part Time</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Key Required Skills (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Node.js, Express, MongoDB, TypeScript, Docker"
                    value={jobForm.skills}
                    onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Job Description & Responsibilities</label>
                  <textarea
                    rows={4}
                    placeholder="Detail the technical responsibilities, stack, expectations, and culture..."
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsJobModalOpen(false)}>
                  <span>Cancel</span>
                </button>
                <button type="submit" className="btn-primary" disabled={savingJob}>
                  {savingJob ? <span>Publishing...</span> : <span>Publish Opening</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
