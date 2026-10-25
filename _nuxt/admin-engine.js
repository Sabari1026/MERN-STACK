/**
 * HireConnect Admin Dashboard Engine (Phase 10)
 * Connects administrative frontend interface to real database-backed platform APIs.
 */

(function () {
  'use strict';

  let currentAdmin = null;
  let activeTab = 'overview';
  let overviewData = null;
  let usersData = [];
  let companiesData = [];
  let verificationQueue = [];
  let jobsData = [];
  let auditLogsData = [];

  // Search & filter states
  const filters = {
    users: { search: '', role: 'all', status: 'all', page: 1 },
    companies: { search: '', verificationStatus: 'all', page: 1 },
    verification: { status: 'pending', page: 1 },
    jobs: { search: '', status: 'all', moderationStatus: 'all', page: 1 },
    audit: { action: 'all', resourceType: 'all', page: 1 }
  };

  function getToken() {
    return (
      localStorage.getItem('hc_auth_token') ||
      localStorage.getItem('hireconnect_token') ||
      sessionStorage.getItem('hc_auth_token') ||
      sessionStorage.getItem('hireconnect_token') ||
      ''
    );
  }

  function showToast(message, isError = false) {
    let container = document.getElementById('hc-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'hc-toast-container';
      container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `background:${isError ? '#ef4444' : '#10b981'};color:#fff;padding:12px 18px;border-radius:8px;font-family:Saans,sans-serif;font-size:14px;box-shadow:0 10px 25px rgba(0,0,0,0.4);pointer-events:auto;transition:all 0.3s ease;`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  async function apiCall(endpoint, method = 'GET', body = null) {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    const res = await fetch(endpoint, config);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  }

  async function init() {
    const appEl = document.getElementById('hc-admin-app');
    if (!appEl) return;

    // Check query params for tab
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['overview', 'users', 'verification', 'companies', 'jobs', 'audit'].includes(tabParam)) {
      activeTab = tabParam;
    }

    const token = getToken();
    if (!token) {
      renderUnauthenticated(appEl);
      return;
    }

    try {
      const authRes = await apiCall('/api/auth/me');
      if (!authRes.success || !authRes.user) {
        renderUnauthenticated(appEl);
        return;
      }

      currentAdmin = authRes.user;

      // Strict role check: Ordinary candidate or recruiter accounts are blocked
      if (currentAdmin.role !== 'admin') {
        renderAccessDenied(appEl, currentAdmin.role);
        return;
      }

      // User is verified admin: load dashboard
      renderDashboardLayout(appEl);
      await loadTabContent();
    } catch (err) {
      console.error('[AdminEngine] Initialization error:', err);
      renderAccessDenied(appEl, 'unauthorized');
    }
  }

  function renderUnauthenticated(el) {
    el.innerHTML = `
      <div class="hc-denied-state">
        <div class="hc-denied-icon">🔒</div>
        <h2 class="hc-denied-title" style="color: #f7f5f2;">Administrator Sign In Required</h2>
        <p class="hc-denied-desc">You must be authenticated with an authorized platform administrator account to access platform governance.</p>
        <a href="/about/?role=admin" class="hc-home-btn">Sign In as Administrator</a>
      </div>
    `;
  }

  function renderAccessDenied(el, role) {
    el.innerHTML = `
      <div class="hc-denied-state">
        <div class="hc-denied-icon">🚫</div>
        <h2 class="hc-denied-title">403 Forbidden: Access Denied</h2>
        <p class="hc-denied-desc">Your account (${escapeHtml(role)}) does not have administrative privileges. All administrative requests are strictly monitored and logged.</p>
        <a href="/" class="hc-home-btn">Return to HireConnect Homepage</a>
      </div>
    `;
  }

  function renderDashboardLayout(el) {
    el.innerHTML = `
      <div class="hc-admin-container">
        <div class="hc-admin-header">
          <div class="hc-admin-badge">🛡️ Platform Administration</div>
          <h1 class="hc-admin-title">HireConnect Command Center</h1>
          <p class="hc-admin-subtitle">Real-time platform metrics, user governance, corporate verification, job moderation, and immutable audit logs.</p>
        </div>

        <div class="hc-admin-tabs">
          <button class="hc-admin-tab ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">
            <span>📊</span> Overview
          </button>
          <button class="hc-admin-tab ${activeTab === 'users' ? 'active' : ''}" data-tab="users">
            <span>👥</span> Users
          </button>
          <button class="hc-admin-tab ${activeTab === 'verification' ? 'active' : ''}" data-tab="verification">
            <span>🏢</span> Company Verification <span class="hc-tab-pill" id="hc-pill-verif" style="display:none;">0</span>
          </button>
          <button class="hc-admin-tab ${activeTab === 'companies' ? 'active' : ''}" data-tab="companies">
            <span>🏛️</span> Companies
          </button>
          <button class="hc-admin-tab ${activeTab === 'jobs' ? 'active' : ''}" data-tab="jobs">
            <span>📋</span> Job Moderation
          </button>
          <button class="hc-admin-tab ${activeTab === 'audit' ? 'active' : ''}" data-tab="audit">
            <span>📜</span> Audit Logs
          </button>
          <button class="hc-admin-tab ${activeTab === 'analytics' ? 'active' : ''}" data-tab="analytics">
            <span>📈</span> Analytics &amp; Reports
          </button>
        </div>

        <div id="hc-tab-container">
          <div style="text-align: center; padding: 60px 0; color: #94a3b8;">
            <p>Loading administrative dataset...</p>
          </div>
        </div>
      </div>
    `;

    // Attach tab click events
    el.querySelectorAll('.hc-admin-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        switchTab(tab);
      });
    });
  }

  function switchTab(tab) {
    activeTab = tab;
    document.querySelectorAll('.hc-admin-tab').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });

    const newUrl = new URL(window.location);
    newUrl.searchParams.set('tab', tab);
    window.history.pushState({}, '', newUrl);

    loadTabContent();
  }

  async function loadTabContent() {
    const container = document.getElementById('hc-tab-container');
    if (!container) return;

    container.innerHTML = `<div style="text-align:center;padding:60px 0;color:#94a3b8;"><p>Loading ${activeTab} data...</p></div>`;

    try {
      if (activeTab === 'overview') {
        await renderOverview(container);
      } else if (activeTab === 'users') {
        await renderUsersTab(container);
      } else if (activeTab === 'verification') {
        await renderVerificationTab(container);
      } else if (activeTab === 'companies') {
        await renderCompaniesTab(container);
      } else if (activeTab === 'jobs') {
        await renderJobsTab(container);
      } else if (activeTab === 'audit') {
        await renderAuditTab(container);
      } else if (activeTab === 'analytics') {
        await renderAnalyticsTab(container);
      }
    } catch (err) {
      container.innerHTML = `
        <div style="text-align:center;padding:40px 20px;color:#ef4444;">
          <p style="font-size:16px;font-weight:600;">Failed to load administrative data</p>
          <p style="font-size:13px;color:#94a3b8;">${escapeHtml(err.message)}</p>
          <button class="hc-btn-action" onclick="location.reload()" style="margin-top:12px;">Retry</button>
        </div>
      `;
    }
  }

  // =========================================================================
  // TAB 1: OVERVIEW METRICS
  // =========================================================================
  async function renderOverview(container) {
    const res = await apiCall('/api/admin/dashboard');
    overviewData = res.data;

    // Update pill badge if pending verifications exist
    const verifCount = overviewData.pendingActions?.verificationRequests || 0;
    const pill = document.getElementById('hc-pill-verif');
    if (pill) {
      if (verifCount > 0) {
        pill.textContent = verifCount;
        pill.style.display = 'inline-block';
      } else {
        pill.style.display = 'none';
      }
    }

    container.innerHTML = `
      ${verifCount > 0 ? `
        <div class="hc-admin-alert-box">
          <div class="hc-alert-text">
            <span>⚠️</span>
            <span><strong>${verifCount} corporate verification request${verifCount > 1 ? 's' : ''} pending review:</strong> Verify employer business registrations and official domains.</span>
          </div>
          <button class="hc-alert-btn" id="hc-go-verif-btn">Review Queue</button>
        </div>
      ` : ''}

      <div class="hc-metrics-grid">
        <div class="hc-metric-card">
          <div class="hc-metric-header">
            <span class="hc-metric-title">Platform Users</span>
            <div class="hc-metric-icon">👥</div>
          </div>
          <div class="hc-metric-value">${overviewData.users.total}</div>
          <div class="hc-metric-subtext">
            <span>${overviewData.users.candidates} candidates</span> &middot;
            <span>${overviewData.users.recruiters} recruiters</span> &middot;
            <span>${overviewData.users.admins} admins</span>
          </div>
        </div>

        <div class="hc-metric-card">
          <div class="hc-metric-header">
            <span class="hc-metric-title">Active Companies</span>
            <div class="hc-metric-icon">🏢</div>
          </div>
          <div class="hc-metric-value">${overviewData.companies.total}</div>
          <div class="hc-metric-subtext">
            <span style="color:#34d399;">${overviewData.companies.verified} verified</span> &middot;
            <span style="color:#fbbf24;">${overviewData.companies.pendingVerification} pending</span>
          </div>
        </div>

        <div class="hc-metric-card">
          <div class="hc-metric-header">
            <span class="hc-metric-title">Job Openings</span>
            <div class="hc-metric-icon">📋</div>
          </div>
          <div class="hc-metric-value">${overviewData.jobs.total}</div>
          <div class="hc-metric-subtext">
            <span style="color:#34d399;">${overviewData.jobs.published} live</span> &middot;
            <span>${overviewData.jobs.draft} draft</span> &middot;
            <span style="color:#f87171;">${overviewData.jobs.moderated} moderated</span>
          </div>
        </div>

        <div class="hc-metric-card">
          <div class="hc-metric-header">
            <span class="hc-metric-title">Applications Submitted</span>
            <div class="hc-metric-icon">📑</div>
          </div>
          <div class="hc-metric-value">${overviewData.applications.total}</div>
          <div class="hc-metric-subtext">
            <span>Direct candidate hiring pipeline</span>
          </div>
        </div>

        <div class="hc-metric-card">
          <div class="hc-metric-header">
            <span class="hc-metric-title">Scheduled Interviews</span>
            <div class="hc-metric-icon">📅</div>
          </div>
          <div class="hc-metric-value">${overviewData.interviews.upcoming}</div>
          <div class="hc-metric-subtext">
            <span>${overviewData.interviews.total} total meetings booked</span>
          </div>
        </div>

        <div class="hc-metric-card">
          <div class="hc-metric-header">
            <span class="hc-metric-title">Suspended Accounts</span>
            <div class="hc-metric-icon">⛔</div>
          </div>
          <div class="hc-metric-value" style="color:${overviewData.users.suspended > 0 ? '#f87171' : '#f7f5f2'};">${overviewData.users.suspended}</div>
          <div class="hc-metric-subtext">
            <span>${overviewData.users.active} active accounts</span>
          </div>
        </div>
      </div>
    `;

    const alertBtn = container.querySelector('#hc-go-verif-btn');
    if (alertBtn) {
      alertBtn.addEventListener('click', () => switchTab('verification'));
    }
  }

  // =========================================================================
  // TAB 2: USER GOVERNANCE
  // =========================================================================
  async function renderUsersTab(container) {
    const f = filters.users;
    const query = new URLSearchParams({
      page: f.page,
      limit: 20,
      role: f.role,
      status: f.status,
      search: f.search
    });

    const res = await apiCall(`/api/admin/users?${query}`);
    usersData = res.data.users;
    const pag = res.data.pagination;

    container.innerHTML = `
      <div class="hc-controls-bar">
        <input type="text" class="hc-search-input" id="hc-user-search" placeholder="Search by name or email..." value="${escapeHtml(f.search)}" />
        <select class="hc-select" id="hc-user-role-filter">
          <option value="all" ${f.role === 'all' ? 'selected' : ''}>All Roles</option>
          <option value="candidate" ${f.role === 'candidate' ? 'selected' : ''}>Candidates</option>
          <option value="recruiter" ${f.role === 'recruiter' ? 'selected' : ''}>Recruiters</option>
          <option value="admin" ${f.role === 'admin' ? 'selected' : ''}>Administrators</option>
        </select>
        <select class="hc-select" id="hc-user-status-filter">
          <option value="all" ${f.status === 'all' ? 'selected' : ''}>All Statuses</option>
          <option value="active" ${f.status === 'active' ? 'selected' : ''}>Active</option>
          <option value="suspended" ${f.status === 'suspended' ? 'selected' : ''}>Suspended</option>
        </select>
      </div>

      <div class="hc-table-card">
        <table class="hc-admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Account Status</th>
              <th>Registered</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${usersData.length === 0 ? `
              <tr><td colspan="5" style="text-align:center;padding:32px;color:#94a3b8;">No matching users found.</td></tr>
            ` : usersData.map(u => {
              const isSelf = currentAdmin && (currentAdmin.id === u.id || currentAdmin._id === u.id);
              const isSuspended = u.accountStatus === 'suspended';
              return `
                <tr>
                  <td>
                    <div class="hc-user-primary">${escapeHtml(u.name)} ${isSelf ? '<span style="color:#c496ff;font-size:11px;">(You)</span>' : ''}</div>
                    <div class="hc-user-sub">${escapeHtml(u.email)}</div>
                  </td>
                  <td>
                    <span class="hc-badge hc-badge-role-${u.role}">${escapeHtml(u.role)}</span>
                  </td>
                  <td>
                    <span class="hc-badge hc-badge-${u.accountStatus}">${escapeHtml(u.accountStatus)}</span>
                  </td>
                  <td style="font-family:'Saans Mono',monospace;font-size:12px;color:#94a3b8;">
                    ${new Date(u.createdAt).toISOString().split('T')[0]}
                  </td>
                  <td style="text-align:right;">
                    ${isSelf ? `
                      <span style="font-size:12px;color:#64748b;">Protected</span>
                    ` : `
                      <button class="hc-btn-action ${isSuspended ? 'hc-btn-success' : 'hc-btn-danger'}" data-action="toggle-status" data-id="${u.id}" data-name="${escapeHtml(u.name)}" data-status="${u.accountStatus}">
                        ${isSuspended ? 'Reactivate' : 'Suspend'}
                      </button>
                    `}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Hook filter inputs
    const searchInput = container.querySelector('#hc-user-search');
    let debounce;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        filters.users.search = e.target.value.trim();
        filters.users.page = 1;
        renderUsersTab(container);
      }, 300);
    });

    container.querySelector('#hc-user-role-filter').addEventListener('change', (e) => {
      filters.users.role = e.target.value;
      filters.users.page = 1;
      renderUsersTab(container);
    });

    container.querySelector('#hc-user-status-filter').addEventListener('change', (e) => {
      filters.users.status = e.target.value;
      filters.users.page = 1;
      renderUsersTab(container);
    });

    // Hook action buttons
    container.querySelectorAll('button[data-action="toggle-status"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const currentStatus = btn.dataset.status;
        const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
        openStatusModal(id, name, newStatus, () => renderUsersTab(container));
      });
    });
  }

  // =========================================================================
  // TAB 3: COMPANY VERIFICATION REVIEW QUEUE
  // =========================================================================
  async function renderVerificationTab(container) {
    const f = filters.verification;
    const res = await apiCall(`/api/admin/companies/verification-requests?status=${f.status}`);
    verificationQueue = res.data.requests;

    container.innerHTML = `
      <div class="hc-controls-bar">
        <select class="hc-select" id="hc-verif-status-filter">
          <option value="pending" ${f.status === 'pending' ? 'selected' : ''}>Pending Reviews</option>
          <option value="under_review" ${f.status === 'under_review' ? 'selected' : ''}>Under Review</option>
          <option value="verified" ${f.status === 'verified' ? 'selected' : ''}>Approved Verifications</option>
          <option value="rejected" ${f.status === 'rejected' ? 'selected' : ''}>Rejected</option>
        </select>
      </div>

      <div class="hc-table-card">
        <table class="hc-admin-table">
          <thead>
            <tr>
              <th>Company &amp; Requester</th>
              <th>Official Contact</th>
              <th>Registration / Tax ID</th>
              <th>Submitted</th>
              <th style="text-align:right;">Decision</th>
            </tr>
          </thead>
          <tbody>
            ${verificationQueue.length === 0 ? `
              <tr><td colspan="5" style="text-align:center;padding:32px;color:#94a3b8;">No verification requests currently in this queue.</td></tr>
            ` : verificationQueue.map(r => `
              <tr>
                <td>
                  <div class="hc-user-primary">${escapeHtml(r.company ? r.company.name : 'Unknown Company')}</div>
                  <div class="hc-user-sub">By: ${escapeHtml(r.requester ? r.requester.name : 'Recruiter')} (${escapeHtml(r.requester ? r.requester.email : '')})</div>
                </td>
                <td>
                  <div><a href="mailto:${escapeHtml(r.officialEmail)}" style="color:#c496ff;">${escapeHtml(r.officialEmail)}</a></div>
                  ${r.website ? `<div class="hc-user-sub"><a href="${escapeHtml(r.website)}" target="_blank" rel="noopener" style="color:#94a3b8;">${escapeHtml(r.website)}</a></div>` : ''}
                </td>
                <td style="font-family:'Saans Mono',monospace;font-size:12px;">
                  ${escapeHtml(r.businessRegistrationNumber || 'Not supplied')}
                </td>
                <td style="font-family:'Saans Mono',monospace;font-size:12px;color:#94a3b8;">
                  ${new Date(r.createdAt).toISOString().split('T')[0]}
                </td>
                <td style="text-align:right;">
                  ${r.status === 'verified' ? `
                    <span class="hc-badge hc-badge-verified">Verified</span>
                  ` : `
                    <div style="display:inline-flex;gap:8px;">
                      <button class="hc-btn-action hc-btn-success" data-action="review-comp" data-id="${r.company ? r.company.id : ''}" data-name="${escapeHtml(r.company ? r.company.name : '')}" data-decision="verified">
                        Approve
                      </button>
                      <button class="hc-btn-action hc-btn-danger" data-action="review-comp" data-id="${r.company ? r.company.id : ''}" data-name="${escapeHtml(r.company ? r.company.name : '')}" data-decision="rejected">
                        Reject
                      </button>
                    </div>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    container.querySelector('#hc-verif-status-filter').addEventListener('change', (e) => {
      filters.verification.status = e.target.value;
      renderVerificationTab(container);
    });

    container.querySelectorAll('button[data-action="review-comp"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const companyId = btn.dataset.id;
        const name = btn.dataset.name;
        const decision = btn.dataset.decision;
        openCompanyReviewModal(companyId, name, decision, () => renderVerificationTab(container));
      });
    });
  }

  // =========================================================================
  // TAB 4: COMPANY DIRECTORY & SUSPENSION
  // =========================================================================
  async function renderCompaniesTab(container) {
    const f = filters.companies;
    const query = new URLSearchParams({
      page: f.page,
      limit: 20,
      search: f.search,
      verificationStatus: f.verificationStatus
    });

    const res = await apiCall(`/api/admin/companies?${query}`);
    companiesData = res.data.companies;

    container.innerHTML = `
      <div class="hc-controls-bar">
        <input type="text" class="hc-search-input" id="hc-comp-search" placeholder="Search companies by name..." value="${escapeHtml(f.search)}" />
        <select class="hc-select" id="hc-comp-verif-filter">
          <option value="all" ${f.verificationStatus === 'all' ? 'selected' : ''}>All Verification States</option>
          <option value="verified" ${f.verificationStatus === 'verified' ? 'selected' : ''}>Verified</option>
          <option value="pending" ${f.verificationStatus === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="suspended" ${f.verificationStatus === 'suspended' ? 'selected' : ''}>Suspended</option>
          <option value="rejected" ${f.verificationStatus === 'rejected' ? 'selected' : ''}>Rejected</option>
        </select>
      </div>

      <div class="hc-table-card">
        <table class="hc-admin-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Industry</th>
              <th>Status</th>
              <th>Active Openings</th>
              <th style="text-align:right;">Corporate Action</th>
            </tr>
          </thead>
          <tbody>
            ${companiesData.length === 0 ? `
              <tr><td colspan="5" style="text-align:center;padding:32px;color:#94a3b8;">No companies found.</td></tr>
            ` : companiesData.map(c => `
              <tr>
                <td>
                  <div class="hc-user-primary">${escapeHtml(c.name)}</div>
                  <div class="hc-user-sub">/${escapeHtml(c.slug)}</div>
                </td>
                <td>${escapeHtml(c.industry || 'Technology')}</td>
                <td>
                  <span class="hc-badge hc-badge-${c.verificationStatus}">${escapeHtml(c.verificationStatus)}</span>
                </td>
                <td style="font-family:'Saans Mono',monospace;">${c.activeJobsCount}</td>
                <td style="text-align:right;">
                  ${c.verificationStatus === 'suspended' ? `
                    <button class="hc-btn-action hc-btn-success" data-action="company-status" data-id="${c.id}" data-name="${escapeHtml(c.name)}" data-target="verified">
                      Re-Instate
                    </button>
                  ` : `
                    <button class="hc-btn-action hc-btn-danger" data-action="company-status" data-id="${c.id}" data-name="${escapeHtml(c.name)}" data-target="suspended">
                      Suspend Company
                    </button>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    const searchInput = container.querySelector('#hc-comp-search');
    let debounce;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        filters.companies.search = e.target.value.trim();
        renderCompaniesTab(container);
      }, 300);
    });

    container.querySelector('#hc-comp-verif-filter').addEventListener('change', (e) => {
      filters.companies.verificationStatus = e.target.value;
      renderCompaniesTab(container);
    });

    container.querySelectorAll('button[data-action="company-status"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const target = btn.dataset.target;
        openCompanyReviewModal(id, name, target, () => renderCompaniesTab(container));
      });
    });
  }

  // =========================================================================
  // TAB 5: JOB MODERATION
  // =========================================================================
  async function renderJobsTab(container) {
    const f = filters.jobs;
    const query = new URLSearchParams({
      page: f.page,
      limit: 20,
      search: f.search,
      status: f.status,
      moderationStatus: f.moderationStatus
    });

    const res = await apiCall(`/api/admin/jobs?${query}`);
    jobsData = res.data.jobs;

    container.innerHTML = `
      <div class="hc-controls-bar">
        <input type="text" class="hc-search-input" id="hc-job-search" placeholder="Search by job title or employer..." value="${escapeHtml(f.search)}" />
        <select class="hc-select" id="hc-job-status-filter">
          <option value="all" ${f.status === 'all' ? 'selected' : ''}>All Lifecycle Statuses</option>
          <option value="published" ${f.status === 'published' ? 'selected' : ''}>Published</option>
          <option value="draft" ${f.status === 'draft' ? 'selected' : ''}>Draft</option>
          <option value="closed" ${f.status === 'closed' ? 'selected' : ''}>Closed</option>
          <option value="paused" ${f.status === 'paused' ? 'selected' : ''}>Paused</option>
        </select>
        <select class="hc-select" id="hc-job-mod-filter">
          <option value="all" ${f.moderationStatus === 'all' ? 'selected' : ''}>All Moderation States</option>
          <option value="approved" ${f.moderationStatus === 'approved' ? 'selected' : ''}>Approved Listings</option>
          <option value="removed" ${f.moderationStatus === 'removed' ? 'selected' : ''}>Removed from Discovery</option>
        </select>
      </div>

      <div class="hc-table-card">
        <table class="hc-admin-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Status</th>
              <th>Moderation</th>
              <th>Applicants</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${jobsData.length === 0 ? `
              <tr><td colspan="6" style="text-align:center;padding:32px;color:#94a3b8;">No jobs found.</td></tr>
            ` : jobsData.map(j => {
              const isRemoved = j.moderationStatus === 'removed';
              return `
                <tr>
                  <td>
                    <div class="hc-user-primary">${escapeHtml(j.title)}</div>
                    ${j.isModerated && j.moderationReason ? `<div class="hc-user-sub" style="color:#f87171;">Reason: ${escapeHtml(j.moderationReason)}</div>` : ''}
                  </td>
                  <td>${escapeHtml(j.company ? j.company.name : j.companyName || 'Employer')}</td>
                  <td>
                    <span class="hc-badge hc-badge-${j.status}">${escapeHtml(j.status)}</span>
                  </td>
                  <td>
                    <span class="hc-badge hc-badge-${j.moderationStatus}">${escapeHtml(j.moderationStatus)}</span>
                  </td>
                  <td style="font-family:'Saans Mono',monospace;">${j.applicantCount}</td>
                  <td style="text-align:right;">
                    ${isRemoved ? `
                      <button class="hc-btn-action hc-btn-success" data-action="moderate-job" data-id="${j.id}" data-title="${escapeHtml(j.title)}" data-mod="restore">
                        Restore Listing
                      </button>
                    ` : `
                      <button class="hc-btn-action hc-btn-danger" data-action="moderate-job" data-id="${j.id}" data-title="${escapeHtml(j.title)}" data-mod="remove">
                        Remove
                      </button>
                    `}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    const searchInput = container.querySelector('#hc-job-search');
    let debounce;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        filters.jobs.search = e.target.value.trim();
        renderJobsTab(container);
      }, 300);
    });

    container.querySelector('#hc-job-status-filter').addEventListener('change', (e) => {
      filters.jobs.status = e.target.value;
      renderJobsTab(container);
    });

    container.querySelector('#hc-job-mod-filter').addEventListener('change', (e) => {
      filters.jobs.moderationStatus = e.target.value;
      renderJobsTab(container);
    });

    container.querySelectorAll('button[data-action="moderate-job"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const title = btn.dataset.title;
        const modAction = btn.dataset.mod;
        openJobModerationModal(id, title, modAction, () => renderJobsTab(container));
      });
    });
  }

  // =========================================================================
  // TAB 6: AUDIT LOGS
  // =========================================================================
  async function renderAuditTab(container) {
    const f = filters.audit;
    const query = new URLSearchParams({
      page: f.page,
      limit: 25,
      action: f.action,
      resourceType: f.resourceType
    });

    const res = await apiCall(`/api/admin/audit-logs?${query}`);
    auditLogsData = res.data.logs;

    container.innerHTML = `
      <div class="hc-controls-bar">
        <select class="hc-select" id="hc-audit-action-filter">
          <option value="all" ${f.action === 'all' ? 'selected' : ''}>All Actions</option>
          <option value="user_suspended" ${f.action === 'user_suspended' ? 'selected' : ''}>User Suspended</option>
          <option value="user_reactivated" ${f.action === 'user_reactivated' ? 'selected' : ''}>User Reactivated</option>
          <option value="company_verified" ${f.action === 'company_verified' ? 'selected' : ''}>Company Verified</option>
          <option value="company_verification_rejected" ${f.action === 'company_verification_rejected' ? 'selected' : ''}>Company Rejected</option>
          <option value="company_suspended" ${f.action === 'company_suspended' ? 'selected' : ''}>Company Suspended</option>
          <option value="job_moderation_removed" ${f.action === 'job_moderation_removed' ? 'selected' : ''}>Job Moderation Removed</option>
          <option value="job_moderation_restored" ${f.action === 'job_moderation_restored' ? 'selected' : ''}>Job Moderation Restored</option>
        </select>
        <select class="hc-select" id="hc-audit-type-filter">
          <option value="all" ${f.resourceType === 'all' ? 'selected' : ''}>All Resource Types</option>
          <option value="user" ${f.resourceType === 'user' ? 'selected' : ''}>User</option>
          <option value="company" ${f.resourceType === 'company' ? 'selected' : ''}>Company</option>
          <option value="job" ${f.resourceType === 'job' ? 'selected' : ''}>Job</option>
        </select>
      </div>

      <div class="hc-table-card">
        <table class="hc-admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Acting Administrator</th>
              <th>Action</th>
              <th>Target Resource</th>
              <th>Reason / Notes</th>
            </tr>
          </thead>
          <tbody>
            ${auditLogsData.length === 0 ? `
              <tr><td colspan="5" style="text-align:center;padding:32px;color:#94a3b8;">No administrative audit logs found for this filter.</td></tr>
            ` : auditLogsData.map(log => `
              <tr>
                <td style="font-family:'Saans Mono',monospace;font-size:12px;color:#94a3b8;">
                  ${new Date(log.createdAt).toLocaleString('en-US', { hour12: false })}
                </td>
                <td>
                  <div class="hc-user-primary">${escapeHtml(log.actorName || 'Admin')}</div>
                  <div class="hc-user-sub">${escapeHtml(log.actorEmail || '')}</div>
                </td>
                <td>
                  <span class="hc-badge" style="background:rgba(168,85,247,0.12);color:#c496ff;border:1px solid rgba(168,85,247,0.3);">
                    ${escapeHtml(log.action)}
                  </span>
                </td>
                <td>
                  <span class="hc-user-sub">${escapeHtml(log.resourceType)}</span>:
                  <span style="font-family:'Saans Mono',monospace;font-size:12px;">${escapeHtml(log.resourceId)}</span>
                </td>
                <td style="color:#cbd5e1;font-size:13px;">
                  ${escapeHtml(log.reason || 'No reason supplied')}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    container.querySelector('#hc-audit-action-filter').addEventListener('change', (e) => {
      filters.audit.action = e.target.value;
      renderAuditTab(container);
    });

    container.querySelector('#hc-audit-type-filter').addEventListener('change', (e) => {
      filters.audit.resourceType = e.target.value;
      renderAuditTab(container);
    });
  }

  // =========================================================================
  // TAB 7: ANALYTICS & REPORTS (Phase 11)
  // =========================================================================
  let currentAnalyticsPeriod = '30d';

  async function renderAnalyticsTab(container) {
    container.innerHTML = `<div style="text-align:center;padding:60px 0;color:#94a3b8;"><p>Loading real-time platform analytics...</p></div>`;

    const [overviewRes, funnelRes] = await Promise.all([
      apiCall(`/api/admin/analytics/overview?period=${currentAnalyticsPeriod}`),
      apiCall(`/api/admin/analytics/recruitment-funnel?period=${currentAnalyticsPeriod}`)
    ]);

    const ov = overviewRes.data;
    const fn = funnelRes.data;

    function renderGrowthBadge(val) {
      if (val === null || val === undefined) {
        return `<span class="hc-growth-badge neutral">New</span>`;
      }
      if (val > 0) {
        return `<span class="hc-growth-badge positive">↑ +${val}%</span>`;
      }
      if (val < 0) {
        return `<span class="hc-growth-badge negative">↓ ${val}%</span>`;
      }
      return `<span class="hc-growth-badge neutral">0%</span>`;
    }

    // Generate responsive SVG chart
    const ts = ov.timeSeries || [];
    const maxVal = Math.max(...ts.map(d => Math.max(d.applications, d.jobs, d.users)), 5);
    const chartW = 800;
    const chartH = 220;
    const padL = 40;
    const padR = 20;
    const padT = 20;
    const padB = 40;
    const plotW = chartW - padL - padR;
    const plotH = chartH - padT - padB;

    function getCoords(arr, key) {
      if (!arr.length) return '';
      return arr.map((item, idx) => {
        const x = padL + (idx / Math.max(arr.length - 1, 1)) * plotW;
        const y = padT + plotH - ((item[key] || 0) / maxVal) * plotH;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
    }

    const appsPoly = getCoords(ts, 'applications');
    const jobsPoly = getCoords(ts, 'jobs');
    const usersPoly = getCoords(ts, 'users');

    // SVG Area path for applications
    let appsAreaPath = '';
    if (ts.length > 0) {
      const firstX = padL;
      const lastX = padL + plotW;
      const baseY = padT + plotH;
      appsAreaPath = `M ${firstX},${baseY} ` + ts.map((item, idx) => {
        const x = padL + (idx / Math.max(ts.length - 1, 1)) * plotW;
        const y = padT + plotH - ((item.applications || 0) / maxVal) * plotH;
        return `L ${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ') + ` L ${lastX},${baseY} Z`;
    }

    container.innerHTML = `
      <div class="hc-analytics-toolbar">
        <div>
          <h2 style="font-size:20px;font-weight:600;margin:0 0 4px;color:#f7f5f2;">Platform Intelligence &amp; Performance</h2>
          <p style="font-size:13px;color:#94a3b8;margin:0;">Real MongoDB recruitment records, conversion funnels, and time series.</p>
        </div>
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <div class="hc-period-group">
            <button class="hc-period-btn ${currentAnalyticsPeriod === '7d' ? 'active' : ''}" data-p="7d">7 Days</button>
            <button class="hc-period-btn ${currentAnalyticsPeriod === '30d' ? 'active' : ''}" data-p="30d">30 Days</button>
            <button class="hc-period-btn ${currentAnalyticsPeriod === '90d' ? 'active' : ''}" data-p="90d">90 Days</button>
          </div>
          <button class="hc-export-btn" id="hc-admin-export-btn">
            <span>📥</span> Export CSV
          </button>
        </div>
      </div>

      <!-- METRIC CARDS -->
      <div class="hc-metrics-grid">
        <div class="hc-metric-card">
          <div class="hc-metric-header">
            <span class="hc-metric-title">Users Total</span>
            <span class="hc-metric-icon">👥</span>
          </div>
          <div class="hc-metric-value">${ov.summary.users.total} ${renderGrowthBadge(ov.summary.users.growthPercentage)}</div>
          <div class="hc-metric-subtext">${ov.summary.users.newInPeriod} new in period (${ov.summary.users.candidates} candidates, ${ov.summary.users.recruiters} recruiters)</div>
        </div>

        <div class="hc-metric-card">
          <div class="hc-metric-header">
            <span class="hc-metric-title">Published Openings</span>
            <span class="hc-metric-icon">📋</span>
          </div>
          <div class="hc-metric-value">${ov.summary.jobs.published} ${renderGrowthBadge(ov.summary.jobs.growthPercentage)}</div>
          <div class="hc-metric-subtext">${ov.summary.jobs.newInPeriod} new in period (${ov.summary.jobs.total} total postings)</div>
        </div>

        <div class="hc-metric-card">
          <div class="hc-metric-header">
            <span class="hc-metric-title">Candidate Applications</span>
            <span class="hc-metric-icon">📄</span>
          </div>
          <div class="hc-metric-value">${ov.summary.applications.total} ${renderGrowthBadge(ov.summary.applications.growthPercentage)}</div>
          <div class="hc-metric-subtext">${ov.summary.applications.newInPeriod} submitted in period (${ov.summary.applications.previousPeriod} in previous window)</div>
        </div>

        <div class="hc-metric-card">
          <div class="hc-metric-header">
            <span class="hc-metric-title">Interview Schedules</span>
            <span class="hc-metric-icon">📅</span>
          </div>
          <div class="hc-metric-value">${ov.summary.interviews.upcoming}</div>
          <div class="hc-metric-subtext">${ov.summary.interviews.scheduledInPeriod} booked in period (${ov.summary.interviews.total} total meetings)</div>
        </div>
      </div>

      <!-- CHARTS GRID -->
      <div class="hc-chart-grid">
        <!-- TIME SERIES CHART -->
        <div class="hc-chart-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
            <div>
              <h3 class="hc-chart-title">Platform Activity Time Series</h3>
              <p class="hc-chart-sub">Daily volume of candidate applications, jobs published, and registrations.</p>
            </div>
            <div style="display:flex;gap:12px;font-size:12px;font-family:'Saans Mono',monospace;">
              <span style="color:#a1d8c0;display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;background:#a1d8c0;border-radius:50%;display:inline-block;"></span> Apps</span>
              <span style="color:#60a5fa;display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;background:#60a5fa;border-radius:50%;display:inline-block;"></span> Jobs</span>
              <span style="color:#c084fc;display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;background:#c084fc;border-radius:50%;display:inline-block;"></span> Users</span>
            </div>
          </div>

          <div style="width:100%;overflow-x:auto;">
            <svg viewBox="0 0 ${chartW} ${chartH}" style="width:100%;height:auto;min-width:440px;" xmlns="http://www.w3.org/2000/svg">
              <!-- Grid lines -->
              <line x1="${padL}" y1="${padT}" x2="${chartW - padR}" y2="${padT}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3"/>
              <line x1="${padL}" y1="${padT + plotH * 0.5}" x2="${chartW - padR}" y2="${padT + plotH * 0.5}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3"/>
              <line x1="${padL}" y1="${padT + plotH}" x2="${chartW - padR}" y2="${padT + plotH}" stroke="rgba(255,255,255,0.15)"/>

              <!-- Y Axis labels -->
              <text x="${padL - 8}" y="${padT + 4}" fill="#64748b" font-size="10" text-anchor="end" font-family="'Saans Mono',monospace">${maxVal}</text>
              <text x="${padL - 8}" y="${padT + plotH * 0.5 + 4}" fill="#64748b" font-size="10" text-anchor="end" font-family="'Saans Mono',monospace">${Math.round(maxVal / 2)}</text>
              <text x="${padL - 8}" y="${padT + plotH + 4}" fill="#64748b" font-size="10" text-anchor="end" font-family="'Saans Mono',monospace">0</text>

              <!-- X Axis first & last date -->
              ${ts.length > 0 ? `
                <text x="${padL}" y="${chartH - 10}" fill="#64748b" font-size="10" text-anchor="start" font-family="'Saans Mono',monospace">${ts[0].date}</text>
                <text x="${chartW - padR}" y="${chartH - 10}" fill="#64748b" font-size="10" text-anchor="end" font-family="'Saans Mono',monospace">${ts[ts.length - 1].date}</text>
              ` : ''}

              <!-- Area fill for applications -->
              ${appsAreaPath ? `<path d="${appsAreaPath}" fill="rgba(161, 216, 192, 0.08)"/>` : ''}

              <!-- Application Line (Mint) -->
              ${appsPoly ? `<polyline points="${appsPoly}" fill="none" stroke="#a1d8c0" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>` : ''}

              <!-- Jobs Line (Blue) -->
              ${jobsPoly ? `<polyline points="${jobsPoly}" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>` : ''}

              <!-- Users Line (Purple) -->
              ${usersPoly ? `<polyline points="${usersPoly}" fill="none" stroke="#c084fc" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>` : ''}
            </svg>
          </div>
        </div>

        <!-- RECRUITMENT FUNNEL -->
        <div class="hc-chart-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
            <div>
              <h3 class="hc-chart-title">Recruitment Pipeline Funnel</h3>
              <p class="hc-chart-sub">Conversion rates and progression across recruitment stages.</p>
            </div>
            ${fn.metrics.avgTimeToFirstReviewHours ? `
              <div style="font-size:12px;font-family:'Saans Mono',monospace;color:#a1d8c0;background:rgba(161,216,192,0.1);padding:4px 8px;border-radius:6px;">
                Avg Review: ${fn.metrics.avgTimeToFirstReviewHours}h
              </div>
            ` : ''}
          </div>

          <div style="margin-top:16px;">
            ${fn.funnelStages.map(s => {
              const stageKey = s.stage.toLowerCase().replace(' ', '_');
              const widthPct = Math.max(s.conversionRate, 2);
              return `
                <div class="hc-funnel-item">
                  <div class="hc-funnel-label">
                    <span>${escapeHtml(s.stage)}</span>
                    <span><strong>${s.count}</strong> (${s.conversionRate}%)</span>
                  </div>
                  <div class="hc-funnel-track">
                    <div class="hc-funnel-fill ${stageKey === 'under_review' ? 'reviewed' : stageKey}" style="width:${widthPct}%;">
                      ${s.conversionRate > 15 ? `${s.conversionRate}%` : ''}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Application Status Snapshot -->
          <div style="margin-top:24px;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;">
            <div style="font-size:12px;color:#94a3b8;font-family:'Saans Mono',monospace;text-transform:uppercase;margin-bottom:8px;">Current Application Status Distribution</div>
            <div class="hc-status-pill-grid">
              <div class="hc-status-pill"><div class="label">Applied</div><div class="val">${fn.currentStatusDistribution.applied}</div></div>
              <div class="hc-status-pill"><div class="label">Under Review</div><div class="val">${fn.currentStatusDistribution.under_review}</div></div>
              <div class="hc-status-pill"><div class="label">Shortlisted</div><div class="val">${fn.currentStatusDistribution.shortlisted}</div></div>
              <div class="hc-status-pill"><div class="label">Interview</div><div class="val">${fn.currentStatusDistribution.interview}</div></div>
              <div class="hc-status-pill"><div class="label">Offered</div><div class="val">${fn.currentStatusDistribution.offered}</div></div>
              <div class="hc-status-pill"><div class="label">Rejected</div><div class="val">${fn.currentStatusDistribution.rejected}</div></div>
              <div class="hc-status-pill"><div class="label">Withdrawn</div><div class="val">${fn.currentStatusDistribution.withdrawn}</div></div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Period buttons event listener
    container.querySelectorAll('.hc-period-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentAnalyticsPeriod = btn.dataset.p;
        renderAnalyticsTab(container);
      });
    });

    // Export button listener
    const expBtn = container.querySelector('#hc-admin-export-btn');
    if (expBtn) {
      expBtn.addEventListener('click', async () => {
        expBtn.disabled = true;
        expBtn.innerHTML = 'Generating CSV...';
        try {
          const res = await fetch(`/api/admin/analytics/export?period=${currentAnalyticsPeriod}&type=platform_summary`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
          });
          if (!res.ok) throw new Error('Failed to generate export');
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `hireconnect_platform_analytics_${currentAnalyticsPeriod}_${Date.now()}.csv`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          showToast('Platform analytics CSV exported successfully.');
        } catch (err) {
          showToast(err.message, true);
        } finally {
          expBtn.disabled = false;
          expBtn.innerHTML = '<span>📥</span> Export CSV';
        }
      });
    }
  }

  // =========================================================================
  // CONFIRMATION MODALS
  // =========================================================================
  function openStatusModal(userId, userName, targetStatus, onComplete) {
    const isSuspension = targetStatus === 'suspended';
    const overlay = document.createElement('div');
    overlay.className = 'hc-modal-overlay';
    overlay.innerHTML = `
      <div class="hc-modal-card">
        <h3 class="hc-modal-title">${isSuspension ? 'Suspend User Account' : 'Reactivate User Account'}</h3>
        <p class="hc-modal-desc">
          Are you sure you want to ${isSuspension ? 'suspend' : 'reactivate'} <strong>${escapeHtml(userName)}</strong>?
          ${isSuspension ? 'The user will immediately be blocked from performing all platform actions, and active sessions will be terminated.' : 'The user will regain immediate sign-in access.'}
        </p>
        <textarea class="hc-modal-textarea" id="hc-modal-reason" placeholder="Administrative reason for this action (optional)..."></textarea>
        <div class="hc-modal-actions">
          <button class="hc-btn-action" id="hc-modal-cancel">Cancel</button>
          <button class="hc-btn-action ${isSuspension ? 'hc-btn-danger' : 'hc-btn-success'}" id="hc-modal-confirm">
            Confirm ${isSuspension ? 'Suspension' : 'Reactivation'}
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('#hc-modal-cancel').addEventListener('click', () => overlay.remove());

    overlay.querySelector('#hc-modal-confirm').addEventListener('click', async () => {
      const reason = overlay.querySelector('#hc-modal-reason').value.trim();
      const confirmBtn = overlay.querySelector('#hc-modal-confirm');
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Processing...';

      try {
        await apiCall(`/api/admin/users/${userId}/status`, 'PATCH', {
          status: targetStatus,
          reason
        });
        showToast(`User ${targetStatus === 'suspended' ? 'suspended' : 'reactivated'} successfully.`);
        overlay.remove();
        if (onComplete) onComplete();
      } catch (err) {
        showToast(err.message, true);
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm';
      }
    });
  }

  function openCompanyReviewModal(companyId, companyName, targetStatus, onComplete) {
    const overlay = document.createElement('div');
    overlay.className = 'hc-modal-overlay';
    overlay.innerHTML = `
      <div class="hc-modal-card">
        <h3 class="hc-modal-title">Company Verification: ${targetStatus.toUpperCase()}</h3>
        <p class="hc-modal-desc">
          Set verification status for <strong>${escapeHtml(companyName)}</strong> to <strong>${escapeHtml(targetStatus)}</strong>.
        </p>
        <textarea class="hc-modal-textarea" id="hc-modal-notes" placeholder="Review notes or feedback for employer (optional)..."></textarea>
        <div class="hc-modal-actions">
          <button class="hc-btn-action" id="hc-modal-cancel">Cancel</button>
          <button class="hc-btn-action ${targetStatus === 'verified' ? 'hc-btn-success' : 'hc-btn-danger'}" id="hc-modal-confirm">
            Confirm Decision
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('#hc-modal-cancel').addEventListener('click', () => overlay.remove());

    overlay.querySelector('#hc-modal-confirm').addEventListener('click', async () => {
      const notes = overlay.querySelector('#hc-modal-notes').value.trim();
      const confirmBtn = overlay.querySelector('#hc-modal-confirm');
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Updating...';

      try {
        await apiCall(`/api/admin/companies/${companyId}/verification`, 'PATCH', {
          status: targetStatus,
          reason: notes,
          notes
        });
        showToast(`Company verification updated to ${targetStatus}.`);
        overlay.remove();
        if (onComplete) onComplete();
      } catch (err) {
        showToast(err.message, true);
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Decision';
      }
    });
  }

  function openJobModerationModal(jobId, jobTitle, action, onComplete) {
    const isRemove = action === 'remove';
    const overlay = document.createElement('div');
    overlay.className = 'hc-modal-overlay';
    overlay.innerHTML = `
      <div class="hc-modal-card">
        <h3 class="hc-modal-title">${isRemove ? 'Remove Job from Discovery' : 'Restore Job to Listings'}</h3>
        <p class="hc-modal-desc">
          ${isRemove ? `Are you sure you want to remove <strong>${escapeHtml(jobTitle)}</strong> from public job discovery? Existing applications and candidate records will be fully preserved.` : `Restore <strong>${escapeHtml(jobTitle)}</strong> to active listings?`}
        </p>
        <textarea class="hc-modal-textarea" id="hc-modal-mod-reason" placeholder="State reason for administrative moderation action..."></textarea>
        <div class="hc-modal-actions">
          <button class="hc-btn-action" id="hc-modal-cancel">Cancel</button>
          <button class="hc-btn-action ${isRemove ? 'hc-btn-danger' : 'hc-btn-success'}" id="hc-modal-confirm">
            ${isRemove ? 'Remove Listing' : 'Restore Listing'}
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('#hc-modal-cancel').addEventListener('click', () => overlay.remove());

    overlay.querySelector('#hc-modal-confirm').addEventListener('click', async () => {
      const reason = overlay.querySelector('#hc-modal-mod-reason').value.trim();
      if (reason.length < 3) {
        showToast('Please provide a reason of at least 3 characters.', true);
        return;
      }

      const confirmBtn = overlay.querySelector('#hc-modal-confirm');
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Processing...';

      try {
        await apiCall(`/api/admin/jobs/${jobId}/moderation`, 'PATCH', {
          action,
          reason
        });
        showToast(`Job listing ${isRemove ? 'removed' : 'restored'} successfully.`);
        overlay.remove();
        if (onComplete) onComplete();
      } catch (err) {
        showToast(err.message, true);
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm';
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
