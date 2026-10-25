import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { analyticsService } from '../services/analyticsService';
import { Link } from 'react-router-dom';

export function AdminDashboardPage() {
  const { user, role, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Users Governance
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  // Verification Requests
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [loadingVerifications, setLoadingVerifications] = useState(false);

  // Moderation Jobs
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Load Overview Metrics
  const loadOverview = useCallback(async () => {
    setLoadingMetrics(true);
    try {
      const res = await analyticsService.getAdminDashboard();
      setMetrics(res?.data || res);
    } catch (err) {
      toast.error('Failed to load administrative platform metrics.');
    } finally {
      setLoadingMetrics(false);
    }
  }, [toast]);

  // Load Users
  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const params = { limit: 50 };
      if (userSearch) params.search = userSearch;
      const res = await analyticsService.getAdminUsers(params);
      const list = res?.data?.users || res?.users || [];
      setUsers(list);
    } catch (err) {
      toast.error('Failed to load platform users.');
    } finally {
      setLoadingUsers(false);
    }
  }, [userSearch, toast]);

  // Load Verifications
  const loadVerifications = useCallback(async () => {
    setLoadingVerifications(true);
    try {
      const res = await analyticsService.getCompanyVerificationRequests();
      const list = res?.data?.requests || res?.requests || res?.data || [];
      setVerificationRequests(Array.isArray(list) ? list : []);
    } catch (err) {
      // ignore
    } finally {
      setLoadingVerifications(false);
    }
  }, []);

  // Load Jobs
  const loadJobs = useCallback(async () => {
    setLoadingJobs(true);
    try {
      const res = await analyticsService.getAdminJobs({ limit: 50 });
      const list = res?.data?.jobs || res?.jobs || [];
      setJobs(list);
    } catch (err) {
      // ignore
    } finally {
      setLoadingJobs(false);
    }
  }, []);

  // Load Audit Logs
  const loadAuditLogs = useCallback(async () => {
    setLoadingLogs(true);
    try {
      const res = await analyticsService.getAuditLogs({ limit: 50 });
      const list = res?.data?.logs || res?.logs || [];
      setAuditLogs(list);
    } catch (err) {
      // ignore
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') return;

    if (activeTab === 'overview') loadOverview();
    else if (activeTab === 'users') loadUsers();
    else if (activeTab === 'verifications') loadVerifications();
    else if (activeTab === 'jobs') loadJobs();
    else if (activeTab === 'logs') loadAuditLogs();
  }, [activeTab, isAuthenticated, role, loadOverview, loadUsers, loadVerifications, loadJobs, loadAuditLogs]);

  // User Status Toggle (Suspend / Reactivate)
  const handleToggleUserStatus = async (targetUser) => {
    const isCurrentlyActive = targetUser.accountStatus === 'active';
    const newStatus = isCurrentlyActive ? 'suspended' : 'active';
    const reason = window.prompt(`Enter reason for ${newStatus} account ${targetUser.email}:`, 'Administrative audit action');
    if (reason === null) return;

    try {
      await analyticsService.updateAdminUserStatus(targetUser._id || targetUser.id, newStatus, reason);
      toast.success(`User account marked as ${newStatus}.`);
      loadUsers();
    } catch (err) {
      toast.error(err.message || 'Action failed.');
    }
  };

  // Company Verification Approval
  const handleApproveVerification = async (requestId) => {
    try {
      await analyticsService.approveCompanyVerification(requestId);
      toast.success('Company verification approved!');
      loadVerifications();
    } catch (err) {
      toast.error('Failed to approve company.');
    }
  };

  // Job Moderation
  const handleModerateJob = async (jobId) => {
    const reason = window.prompt('Enter moderation reason to remove this job from public listings:', 'Policy compliance check');
    if (reason === null) return;

    try {
      await analyticsService.moderateJob(jobId, reason);
      toast.info('Job opening flagged and moderated.');
      loadJobs();
    } catch (err) {
      toast.error('Moderation action failed.');
    }
  };

  const handleRestoreJob = async (jobId) => {
    try {
      await analyticsService.restoreJob(jobId);
      toast.success('Job restored to published state.');
      loadJobs();
    } catch (err) {
      toast.error('Restore action failed.');
    }
  };

  // Export CSV
  const handleExportCsv = async () => {
    try {
      const blob = await analyticsService.exportAdminCsvReport();
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'hireconnect_platform_analytics.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Platform metrics CSV exported.');
    } catch (err) {
      toast.error('CSV export failed.');
    }
  };

  if (!isAuthenticated || role !== 'admin') {
    return (
      <div className="page-container">
        <main className="main-content" style={{ textAlign: 'center', padding: '120px 20px' }}>
          <div className="surface-card" style={{ maxWidth: '520px', margin: '0 auto', padding: '40px' }}>
            <div style={{ fontSize: '36px', marginBottom: '16px' }}>🔒</div>
            <h2 className="h3" style={{ marginBottom: '12px' }}>Administrator Access Required</h2>
            <p className="body-text" style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              This portal is restricted to authorized platform administrators. Please sign in with administrator credentials.
            </p>
            <Link to="/signin?role=admin" className="btn-primary">
              <span>Sign In as Admin</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="site-container">
          {/* Header */}
          <div className="surface-card" style={{ padding: '32px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="badge badge-amber" style={{ marginBottom: '8px' }}>
                  Super Administrator
                </span>
                <h1 className="h2" style={{ marginBottom: '4px' }}>Platform Governance</h1>
                <div style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                  {user?.name} ({user?.email}) • Active MongoDB Atlas Session
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn-secondary btn-sm" onClick={handleExportCsv}>
                  <span>Export Platform CSV</span>
                </button>
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
              { id: 'overview', label: 'Platform Metrics' },
              { id: 'users', label: 'User Governance' },
              { id: 'verifications', label: 'Company Queue' },
              { id: 'jobs', label: 'Job Moderation' },
              { id: 'logs', label: 'Audit Trail' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 20px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${activeTab === tab.id ? 'var(--color-warning)' : 'transparent'}`,
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

          {/* TAB 1: Metrics Overview */}
          {activeTab === 'overview' && (
            <div className="surface-card" style={{ padding: '32px' }}>
              <h3 className="h3" style={{ marginBottom: '24px' }}>Platform Statistics</h3>

              {loadingMetrics ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <span className="spinner" />
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  <div className="surface-card" style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--color-accent-purple-light)' }}>
                      {metrics?.totalUsers ?? metrics?.usersCount ?? 0}
                    </div>
                    <div className="caption" style={{ marginTop: '8px' }}>Registered Users</div>
                  </div>

                  <div className="surface-card" style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--color-accent-mint)' }}>
                      {metrics?.activeJobs ?? metrics?.jobsCount ?? 0}
                    </div>
                    <div className="caption" style={{ marginTop: '8px' }}>Active Job Postings</div>
                  </div>

                  <div className="surface-card" style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--color-warning)' }}>
                      {metrics?.applicationsSubmitted ?? metrics?.applicationsCount ?? 0}
                    </div>
                    <div className="caption" style={{ marginTop: '8px' }}>Applications Processed</div>
                  </div>

                  <div className="surface-card" style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--color-info)' }}>
                      {metrics?.interviewsBooked ?? metrics?.meetingsCount ?? 0}
                    </div>
                    <div className="caption" style={{ marginTop: '8px' }}>Interviews Booked</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: User Governance */}
          {activeTab === 'users' && (
            <div className="surface-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <h3 className="h3">User Accounts ({users.length})</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    style={{ width: '260px' }}
                  />
                  <button type="button" className="btn-secondary btn-sm" onClick={loadUsers}>
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {loadingUsers ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <span className="spinner" />
                </div>
              ) : (
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Governance Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => {
                        const isSuspended = u.accountStatus === 'suspended';
                        const isSelf = (u._id || u.id) === (user._id || user.id);

                        return (
                          <tr key={u._id || u.id}>
                            <td>
                              <div style={{ fontWeight: 500 }}>{u.name}</div>
                              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{u.email}</div>
                            </td>
                            <td>
                              <span className={`badge ${u.role === 'admin' ? 'badge-amber' : u.role === 'recruiter' ? 'badge-mint' : 'badge-purple'}`}>
                                {u.role ? u.role.toUpperCase() : 'USER'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${isSuspended ? 'badge-red' : 'badge-mint'}`}>
                                {u.accountStatus ? u.accountStatus.toUpperCase() : 'ACTIVE'}
                              </span>
                            </td>
                            <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                            <td>
                              {!isSelf && (
                                <button
                                  type="button"
                                  className={isSuspended ? 'btn-primary btn-sm' : 'btn-danger btn-sm'}
                                  onClick={() => handleToggleUserStatus(u)}
                                >
                                  <span>{isSuspended ? 'Reactivate' : 'Suspend'}</span>
                                </button>
                              )}
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

          {/* TAB 3: Company Queue */}
          {activeTab === 'verifications' && (
            <div className="surface-card" style={{ padding: '32px' }}>
              <h3 className="h3" style={{ marginBottom: '24px' }}>Company Verification Requests</h3>

              {loadingVerifications ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <span className="spinner" />
                </div>
              ) : verificationRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <p className="body-text">No pending company verification requests.</p>
                </div>
              ) : (
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Company Name</th>
                        <th>Website</th>
                        <th>Verification Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verificationRequests.map((req) => (
                        <tr key={req._id || req.id}>
                          <td style={{ fontWeight: 500 }}>{req.company?.name || req.name || 'Company'}</td>
                          <td>{req.company?.website || req.website || 'N/A'}</td>
                          <td>
                            <span className="badge badge-amber">{req.status ? req.status.toUpperCase() : 'PENDING'}</span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn-primary btn-sm"
                              onClick={() => handleApproveVerification(req._id || req.id)}
                            >
                              <span>Approve Verification</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Job Moderation */}
          {activeTab === 'jobs' && (
            <div className="surface-card" style={{ padding: '32px' }}>
              <h3 className="h3" style={{ marginBottom: '24px' }}>Job Moderation Queue</h3>

              {loadingJobs ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <span className="spinner" />
                </div>
              ) : jobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <p className="body-text">No jobs found for review.</p>
                </div>
              ) : (
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((j) => (
                        <tr key={j._id || j.id}>
                          <td style={{ fontWeight: 500 }}>{j.title}</td>
                          <td>{j.companyName || j.company?.name || 'Company'}</td>
                          <td>
                            <span className={`badge ${j.status === 'published' ? 'badge-mint' : 'badge-amber'}`}>
                              {j.status ? j.status.toUpperCase() : 'ACTIVE'}
                            </span>
                          </td>
                          <td>
                            {j.status === 'published' ? (
                              <button
                                type="button"
                                className="btn-danger btn-sm"
                                onClick={() => handleModerateJob(j._id || j.id)}
                              >
                                <span>Flag & Remove</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn-primary btn-sm"
                                onClick={() => handleRestoreJob(j._id || j.id)}
                              >
                                <span>Restore Opening</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Audit Trail */}
          {activeTab === 'logs' && (
            <div className="surface-card" style={{ padding: '32px' }}>
              <h3 className="h3" style={{ marginBottom: '24px' }}>Immutable Administrative Audit Logs</h3>

              {loadingLogs ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <span className="spinner" />
                </div>
              ) : auditLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <p className="body-text">No audit entries recorded yet.</p>
                </div>
              ) : (
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Action</th>
                        <th>Target Resource</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log) => (
                        <tr key={log._id || log.id}>
                          <td style={{ fontFamily: 'Saans Mono, monospace', fontSize: '13px' }}>
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td>
                            <span className="badge badge-purple">{log.action}</span>
                          </td>
                          <td>{log.targetType || 'Resource'}</td>
                          <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            {log.details || log.reason || JSON.stringify(log.metadata || {})}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
