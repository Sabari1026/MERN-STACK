/**
 * HireConnect Companies Engine
 * Powers the Companies Directory, Dedicated Company Profiles & Recruiter Management Portal
 */

(function () {
  'use strict';

  let allCompanies = [];
  let filteredCompanies = [];
  let activeCompanyProfile = null;
  let currentRecruiterTab = 'jobs'; // 'jobs', 'applicants', 'discovery', 'company'
  let currentView = 'directory'; // 'directory', 'company_profile', 'recruiter_portal'
  let loadingProfileParam = false;

  let searchFilter = {
    q: '',
    industry: 'all',
    location: 'all'
  };

  function getToken() {
    try {
      const urlToken = new URLSearchParams(window.location.search).get('auth_token');
      if (urlToken) {
        localStorage.setItem('hc_auth_token', urlToken);
        localStorage.setItem('hireconnect_token', urlToken);
        return urlToken;
      }
    } catch (e) {}
    return (
      localStorage.getItem('hc_auth_token') ||
      localStorage.getItem('hireconnect_token') ||
      sessionStorage.getItem('hc_auth_token') ||
      sessionStorage.getItem('hireconnect_token') ||
      ''
    );
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async function fetchCompanies() {
    try {
      const res = await fetch('/api/companies?limit=100');
      const data = await res.json();
      allCompanies = data.companies || [];
      applyFilters();
    } catch (e) {
      console.error('[HireConnect] Error fetching companies:', e);
    }
  }

  function applyFilters() {
    filteredCompanies = allCompanies.filter(comp => {
      if (searchFilter.q) {
        const query = searchFilter.q.toLowerCase().trim();
        const matchesName = comp.name.toLowerCase().includes(query);
        const matchesCat = (comp.category && comp.category.toLowerCase().includes(query)) ||
                           (comp.industry && comp.industry.toLowerCase().includes(query));
        const matchesDesc = comp.description && comp.description.toLowerCase().includes(query);
        const matchesTech = comp.techStack && comp.techStack.some(t => t.toLowerCase().includes(query));
        if (!matchesName && !matchesCat && !matchesDesc && !matchesTech) return false;
      }

      if (searchFilter.industry && searchFilter.industry !== 'all') {
        const cleanInd = searchFilter.industry.toLowerCase();
        const matchesInd = (comp.industry && comp.industry.toLowerCase().includes(cleanInd)) ||
                           (comp.category && comp.category.toLowerCase().includes(cleanInd));
        if (!matchesInd) return false;
      }

      if (searchFilter.location && searchFilter.location !== 'all') {
        const cleanLoc = searchFilter.location.toLowerCase();
        const matchesLoc = comp.locations && comp.locations.some(l => l.toLowerCase().includes(cleanLoc));
        if (!matchesLoc) return false;
      }

      return true;
    });

    renderView();
  }

  function getOrCreateRoot() {
    let root = document.getElementById('hc-companies-root');
    if (!root) {
      const pageContainer = document.querySelector('[data-page="approach"]');
      const screeningSec = document.querySelector('._screening_16dpx_1');
      if (pageContainer) {
        root = document.createElement('div');
        root.id = 'hc-companies-root';
        root.style.cssText = 'padding-top: 130rem; padding-bottom: 40rem; position: relative; z-index: 10;';
        if (screeningSec) {
          pageContainer.insertBefore(root, screeningSec);
        } else {
          pageContainer.prepend(root);
        }
      }
    }
    return root;
  }

  async function loadCompanyProfile(compId) {
    try {
      const res = await fetch('/api/companies/' + compId);
      const data = await res.json();
      if (data.success) {
        activeCompanyProfile = { ...data.company, activeJobs: data.jobs || [] };
        currentView = 'company_profile';
        renderView();
        const root = document.getElementById('hc-companies-root');
        if (root) window.scrollTo({ top: root.offsetTop - 100, behavior: 'smooth' });
      }
    } catch (e) {
      console.error('Error loading company profile:', e);
    }
  }

  function renderView() {
    const root = getOrCreateRoot();
    if (!root) return;

    const user = window.HireConnectAuth ? window.HireConnectAuth.getUser() : null;
    const isRecruiter = user && user.role === 'recruiter';

    // Check URL parameters for tab navigation
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const compParam = urlParams.get('company');

    if (compParam && !activeCompanyProfile && !loadingProfileParam) {
      loadingProfileParam = true;
      loadCompanyProfile(compParam).finally(() => { loadingProfileParam = false; });
    } else if (tabParam && isRecruiter && currentView === 'directory') {
      currentView = 'recruiter_portal';
      currentRecruiterTab = tabParam === 'candidates' ? 'discovery' : (tabParam === 'jobs' ? 'jobs' : 'applicants');
    }

    let innerContent = '';

    if (currentView === 'company_profile' && activeCompanyProfile) {
      innerContent = renderCompanyProfileView(activeCompanyProfile);
    } else if (currentView === 'recruiter_portal' && isRecruiter) {
      innerContent = renderRecruiterPortalView();
    } else {
      innerContent = renderDirectoryView(isRecruiter);
    }

    root.innerHTML = `
      <div class="hc-comp-container">
        <!-- Hero Header -->
        <div class="hc-comp-hero">
          <div class="hc-comp-badge">Verified Direct Tech Employers</div>
          <h1 class="hc-comp-title">Discover Top <span class="mint">Engineering &amp; Tech</span> <span class="purple">Employers</span></h1>
          <p class="hc-comp-subtitle">Connect directly with verified engineering organizations across India, explore tech cultures and perks, and apply to authoritative open roles.</p>
        </div>

        ${renderRecruiterCallout(user, isRecruiter)}

        ${isRecruiter ? `
          <div class="hc-view-tabs">
            <button type="button" class="hc-view-tab ${currentView === 'directory' ? 'active' : ''}" id="hc-view-tab-dir">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span>Companies Directory</span>
            </button>
            <button type="button" class="hc-view-tab recruiter ${currentView === 'recruiter_portal' ? 'active' : ''}" id="hc-view-tab-rp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              <span>Recruiter Management Portal</span>
            </button>
          </div>
        ` : ''}

        <div id="hc-active-view-container">
          ${innerContent}
        </div>
      </div>
    `;

    bindEvents();
  }

  function renderRecruiterCallout(user, isRecruiter) {
    if (isRecruiter) {
      const comp = window.HireConnectAuth ? window.HireConnectAuth.getCompany() : null;
      const compName = comp ? comp.name : (user.companyName || 'Your Company');
      return `
        <div class="hc-recruiter-bar">
          <div class="hc-rb-info">
            <div class="hc-rb-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div class="hc-rb-text">
              <h4>${escapeHtml(compName)} Recruiter Hub</h4>
              <p>Logged in as ${escapeHtml(user.name)}. Publish and manage authoritative jobs or search pre-vetted candidates.</p>
            </div>
          </div>
          <div class="hc-rb-actions">
            <button type="button" class="hc-btn-secondary" id="hc-quick-recruiter-portal">Recruitment Portal</button>
            <button type="button" class="hc-btn-purple" id="hc-quick-post-job">+ Post a New Job</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="hc-recruiter-bar">
        <div class="hc-rb-info">
          <div class="hc-rb-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </div>
          <div class="hc-rb-text">
            <h4>Hiring Engineering &amp; Product Talent?</h4>
            <p>Register your company on HireConnect to publish verified jobs and access discoverable tech candidates.</p>
          </div>
        </div>
        <div class="hc-rb-actions">
          <a href="/about/?role=recruiter" class="hc-btn-purple" style="text-decoration: none;">Recruiter Sign In / Register</a>
        </div>
      </div>
    `;
  }

  function renderDirectoryView(isRecruiter) {
    const industries = [
      { id: 'all', label: 'All Industries' },
      { id: 'FinTech', label: 'FinTech' },
      { id: 'E-Commerce', label: 'E-Commerce' },
      { id: 'Quick Commerce', label: 'Quick Commerce' },
      { id: 'AI / ML', label: 'AI & ML' },
      { id: 'SaaS', label: 'SaaS & Cloud' },
      { id: 'Technology', label: 'Enterprise Tech' }
    ];

    const locations = [
      'All India',
      'Bengaluru, Karnataka',
      'Mumbai, Maharashtra',
      'Pune, Maharashtra',
      'Hyderabad, Telangana',
      'Gurugram / Delhi NCR',
      'Chennai, Tamil Nadu',
      'Remote - India'
    ];

    return `
      <!-- Filters Box -->
      <div class="hc-filter-box">
        <div class="hc-filter-row">
          <div class="hc-search-input-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#777" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" class="hc-search-input" id="hc-comp-search-input" placeholder="Search companies by name, tech stack (e.g. React, Go, AWS)..." value="${escapeHtml(searchFilter.q)}">
          </div>
          <div class="hc-loc-select-wrap">
            <select class="hc-loc-select" id="hc-comp-loc-select">
              ${locations.map(loc => `<option value="${loc === 'All India' ? 'all' : loc}" ${searchFilter.location === (loc === 'All India' ? 'all' : loc) ? 'selected' : ''}>${loc}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="hc-cat-pills">
          ${industries.map(ind => `
            <button type="button" class="hc-cat-pill ${searchFilter.industry === ind.id ? 'active' : ''}" data-industry="${ind.id}">${ind.label}</button>
          `).join('')}
        </div>
      </div>

      <!-- Results Count Bar -->
      <div class="hc-results-bar">
        <span>Showing <strong>${filteredCompanies.length}</strong> verified technology employers across India</span>
        <span>Updated real-time from authorized feeds</span>
      </div>

      <!-- Grid of Cards -->
      <div class="hc-companies-grid">
        ${filteredCompanies.map(c => renderCompanyCard(c)).join('')}
      </div>
    `;
  }

  function renderCompanyCard(comp) {
    const initials = (comp.name || 'HC').slice(0, 2).toUpperCase();
    const activeJobs = comp.activeJobsCount || 0;
    const locationsStr = Array.isArray(comp.locations) ? comp.locations[0] : (comp.locations || 'Bengaluru, Karnataka');

    return `
      <div class="hc-company-card" data-comp-id="${comp.id}">
        <div>
          <div class="hc-card-top">
            <div class="hc-comp-logo">
              ${comp.logoUrl ? `<img src="${escapeHtml(comp.logoUrl)}" alt="${escapeHtml(comp.name)}">` : initials}
            </div>
            <div class="hc-comp-meta">
              <div class="hc-comp-name-row">
                <h3 class="hc-comp-name">${escapeHtml(comp.name)}</h3>
                ${comp.verified ? `<span class="hc-verified-badge">✓ Verified</span>` : ''}
              </div>
              <div class="hc-comp-industry-loc">
                <span>${escapeHtml(comp.industry || comp.category || 'Technology')}</span>
                <span>•</span>
                <span>${escapeHtml(locationsStr)}</span>
              </div>
            </div>
          </div>

          <p class="hc-comp-desc">${escapeHtml(comp.description || '')}</p>

          <div class="hc-tech-tags">
            ${(comp.techStack || ['Full Stack', 'Cloud', 'Distributed Systems']).slice(0, 4).map(t => `
              <span class="hc-tech-tag">${escapeHtml(t)}</span>
            `).join('')}
          </div>
        </div>

        <div class="hc-card-bottom">
          <span class="hc-jobs-badge">${activeJobs} Active Openings</span>
          <button type="button" class="hc-view-btn" data-comp-id="${comp.id}">View Profile &amp; Jobs</button>
        </div>
      </div>
    `;
  }

  function renderCompanyProfileView(comp) {
    const initials = (comp.name || 'HC').slice(0, 2).toUpperCase();
    const locationsStr = Array.isArray(comp.locations) ? comp.locations.join(' • ') : (comp.locations || 'Bengaluru, Karnataka');
    const activeJobs = comp.activeJobs || [];

    return `
      <div class="hc-profile-view">
        <button type="button" class="hc-profile-back-btn" id="hc-btn-back-dir">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          <span>Back to All Companies</span>
        </button>

        <div class="hc-profile-hero">
          <div class="hc-ph-left">
            <div class="hc-ph-logo">
              ${comp.logoUrl ? `<img src="${escapeHtml(comp.logoUrl)}" alt="${escapeHtml(comp.name)}" style="width:100%;height:100%;object-fit:cover;border-radius:18rem;">` : initials}
            </div>
            <div>
              <div class="hc-ph-title-row">
                <h2 class="hc-ph-name">${escapeHtml(comp.name)}</h2>
                ${comp.verified ? `<span class="hc-verified-badge">✓ Verified Partner</span>` : ''}
              </div>
              <div class="hc-ph-details">
                <span>${escapeHtml(comp.industry || comp.category)}</span>
                <span>•</span>
                <span>${escapeHtml(locationsStr)}</span>
                <span>•</span>
                <span>Team: ${escapeHtml(comp.teamSize || '500+ employees')}</span>
                ${comp.website ? `
                  <span>•</span>
                  <a href="${escapeHtml(comp.website)}" target="_blank" rel="noopener noreferrer">
                    <span>${escapeHtml(comp.website.replace(/^https?:\/\//, ''))}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
                ` : ''}
              </div>
            </div>
          </div>

          <div>
            <span class="hc-jobs-badge" style="font-size: 14rem;">${activeJobs.length} Direct Openings</span>
          </div>
        </div>

        <div class="hc-profile-columns">
          <div>
            <div style="margin-bottom: 26rem;">
              <h3 class="hc-section-title">About ${escapeHtml(comp.name)}</h3>
              <p style="font-size: 14.5rem; color: #ccc; line-height: 1.6; margin: 0 0 14rem;">${escapeHtml(comp.description || '')}</p>
            </div>

            <div style="margin-bottom: 26rem;">
              <h3 class="hc-section-title">Engineering Culture &amp; Standards</h3>
              <p style="font-size: 14rem; color: #b5b5b5; line-height: 1.6; margin: 0;">${escapeHtml(comp.culture || 'High ownership, agile delivery, robust microservices, and continuous integration.')}</p>
            </div>

            <div>
              <h3 class="hc-section-title">Core Technology Stack</h3>
              <div class="hc-tech-tags" style="margin-top: 8rem;">
                ${(comp.techStack || ['Full Stack', 'Cloud', 'Distributed Systems']).map(t => `<span class="hc-tech-tag" style="font-size: 13rem; padding: 6rem 14rem;">${escapeHtml(t)}</span>`).join('')}
              </div>
            </div>
          </div>

          <div>
            <h3 class="hc-section-title">Benefits &amp; Perks</h3>
            <div class="hc-perks-grid">
              ${(comp.benefits || ['Comprehensive Health Insurance', 'Flexible Schedules', 'Competitive ESOPs', 'Annual Learning Allowance']).map(b => `
                <div class="hc-perk-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>${escapeHtml(b)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Active Jobs Section -->
        <div class="hc-jobs-listing">
          <h3 class="hc-section-title">Active Opportunities at ${escapeHtml(comp.name)}</h3>
          ${activeJobs.length === 0 ? `
            <div style="text-align: center; padding: 30rem; color: #888; background: rgba(255,255,255,0.02); border-radius: 14rem;">
              There are currently no active public job openings for ${escapeHtml(comp.name)}. Check back soon or register for alerts.
            </div>
          ` : `
            <div>
              ${activeJobs.map(job => `
                <div class="hc-job-row-card">
                  <div>
                    <h4 class="hc-jr-title">${escapeHtml(job.title)}</h4>
                    <div class="hc-jr-meta">
                      <span>${escapeHtml(job.department || 'Engineering')}</span>
                      <span>•</span>
                      <span>${escapeHtml(job.location)}</span>
                      <span>•</span>
                      <span>${escapeHtml(job.workMode)}</span>
                      <span>•</span>
                      <span>${escapeHtml(job.experience)}</span>
                      <span>•</span>
                      <span class="hc-jr-salary">${escapeHtml(job.salary)}</span>
                    </div>
                  </div>
                  <div class="hc-jr-actions">
                    <button type="button" class="hc-btn-primary hc-apply-job-btn" data-job-id="${job.id}" data-job-title="${escapeHtml(job.title)}" data-comp-name="${escapeHtml(comp.name)}">
                      Apply Now
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  }

  // ==================== RECRUITER PORTAL VIEW ====================
  function renderRecruiterPortalView() {
    const comp = window.HireConnectAuth ? window.HireConnectAuth.getCompany() : null;
    const compName = comp ? comp.name : 'Your Company';

    return `
      <div class="hc-recruiter-portal">
        <div class="hc-rp-header">
          <div>
            <h2 style="font-size: 22rem; margin: 0 0 4rem; color: #fff;">${escapeHtml(compName)} Recruiter Portal</h2>
            <div style="font-size: 13rem; color: #a0a0a0;">Manage published listings, view candidate applications, and search discoverable engineers</div>
          </div>
          <div>
            <button type="button" class="hc-btn-purple" id="hc-rp-post-job-btn">+ Post a New Job</button>
          </div>
        </div>

        <div class="hc-rp-tabs">
          <button type="button" class="hc-rp-tab ${currentRecruiterTab === 'jobs' ? 'active' : ''}" data-tab="jobs">Jobs Management</button>
          <button type="button" class="hc-rp-tab ${currentRecruiterTab === 'discovery' ? 'active' : ''}" data-tab="discovery">Candidate Discovery</button>
        </div>

        <div id="hc-rp-content-area">
          ${currentRecruiterTab === 'jobs' ? renderRecruiterJobsArea() : renderRecruiterDiscoveryArea()}
        </div>
      </div>
    `;
  }

  function renderRecruiterJobsArea() {
    return `<div id="hc-recruiter-jobs-list" style="padding: 20rem; text-align: center; color: #888;">Loading your company job listings...</div>`;
  }

  function renderRecruiterDiscoveryArea() {
    return `
      <div>
        <div style="display: flex; gap: 12rem; margin-bottom: 20rem; flex-wrap: wrap;">
          <input type="text" class="hc-form-input" id="hc-disc-search" placeholder="Search by name, title, or skills (e.g. React, Go, Kafka)..." style="flex: 2; min-width: 260rem;">
          <input type="text" class="hc-form-input" id="hc-disc-skills" placeholder="Required skills (e.g. Node.js, AWS)" style="flex: 1; min-width: 180rem;">
          <button type="button" class="hc-btn-primary" id="hc-disc-btn">Filter Candidates</button>
        </div>
        <div id="hc-disc-results" style="color: #888; text-align: center; padding: 20rem;">Loading discoverable candidates...</div>
      </div>
    `;
  }

  async function loadRecruiterJobs() {
    const listEl = document.getElementById('hc-recruiter-jobs-list');
    if (!listEl) return;

    try {
      const res = await fetch('/api/recruiter/jobs', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      const data = await res.json();
      if (!data.jobs || data.jobs.length === 0) {
        listEl.innerHTML = `
          <div style="padding: 30rem; text-align: center;">
            <p style="color: #fff; font-size: 15rem; margin-bottom: 8rem;">No job openings published yet.</p>
            <p style="color: #888; font-size: 13rem; margin-bottom: 16rem;">Publish your first verified job listing to start receiving direct candidate applications.</p>
            <button type="button" class="hc-btn-purple" onclick="window.HireConnectAuth.openPostJobModal()">+ Post a Job</button>
          </div>
        `;
        return;
      }

      listEl.innerHTML = data.jobs.map(job => {
        const isPaused = job.status === 'paused';
        const isClosed = job.status === 'closed';
        return `
          <div class="hc-manage-job-card">
            <div>
              <div style="display: flex; align-items: center; gap: 10rem; margin-bottom: 4rem;">
                <h4 style="font-size: 16rem; margin: 0; color: #fff;">${escapeHtml(job.title)}</h4>
                <span class="hc-status-pill ${job.status}">${job.status.toUpperCase()}</span>
              </div>
              <div style="font-size: 13rem; color: #999;">
                <span>${escapeHtml(job.location)}</span> • <span>${escapeHtml(job.salary)}</span> • <span>${escapeHtml(job.experience)}</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 12rem;">
              <span style="font-size: 13rem; color: var(--hc-mint); font-family: Saans Mono, monospace;">
                <strong>${job.applicantCount || 0}</strong> Applicants
              </span>
              <button type="button" class="hc-btn-secondary hc-toggle-pause-btn" data-job-id="${job.id}" data-current-status="${job.status}">
                ${isPaused ? 'Reopen Job' : 'Pause Job'}
              </button>
              ${!isClosed ? `
                <button type="button" class="hc-btn-secondary hc-close-job-btn" data-job-id="${job.id}" style="color: #ff8888; border-color: rgba(255,100,100,0.3);">
                  Close
                </button>
              ` : ''}
              <button type="button" class="hc-btn-secondary hc-view-apps-btn" data-job-id="${job.id}" data-job-title="${escapeHtml(job.title)}">
                View Applicants
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Bind pause/reopen and close actions
      listEl.querySelectorAll('.hc-toggle-pause-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const jobId = btn.dataset.jobId;
          const currentStatus = btn.dataset.currentStatus;
          const nextStatus = currentStatus === 'paused' ? 'published' : 'paused';

          btn.disabled = true;
          try {
            const res = await fetch(`/api/jobs/${jobId}/status`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
              },
              body: JSON.stringify({ status: nextStatus })
            });
            const d = await res.json();
            if (d.success) {
              window.HireConnectAuth.showToast(`Job status updated to ${nextStatus}.`);
              loadRecruiterJobs();
              fetchCompanies(); // sync active job counts
            }
          } catch (e) {
            window.HireConnectAuth.showToast('Failed to update job status.', true);
          } finally {
            btn.disabled = false;
          }
        });
      });

      listEl.querySelectorAll('.hc-close-job-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('Are you sure you want to close this job listing? It will no longer accept applicants.')) return;
          const jobId = btn.dataset.jobId;
          try {
            await fetch(`/api/jobs/${jobId}/status`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
              },
              body: JSON.stringify({ status: 'closed' })
            });
            window.HireConnectAuth.showToast('Job opening closed.');
            loadRecruiterJobs();
            fetchCompanies();
          } catch (e) {
            window.HireConnectAuth.showToast('Failed to close job.', true);
          }
        });
      });

      listEl.querySelectorAll('.hc-view-apps-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          openRecruiterApplicantsModal(btn.dataset.jobId, btn.dataset.jobTitle);
        });
      });

    } catch (e) {
      listEl.innerHTML = '<div style="color: #ff8888;">Error loading jobs.</div>';
    }
  }

  async function openRecruiterApplicantsModal(jobId, jobTitle) {
    let overlay = document.getElementById('hc-applicants-viewer-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'hc-applicants-viewer-modal';
      overlay.className = 'hc-modal-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="hc-modal-card" style="max-width: 760rem;">
        <div class="hc-modal-header">
          <div class="hc-modal-title-box">
            <div class="hc-modal-title-icon purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
            </div>
            <div>
              <h3 class="hc-modal-title">Applicants: ${escapeHtml(jobTitle)}</h3>
              <div class="hc-modal-subtitle">Direct candidate submissions</div>
            </div>
          </div>
          <button type="button" class="hc-modal-close-btn" id="hc-modal-apps-view-close">&times;</button>
        </div>
        <div class="hc-modal-body" id="hc-apps-view-body">
          <div style="text-align: center; padding: 20rem; color: #888;">Loading applicants...</div>
        </div>
      </div>
    `;

    overlay.querySelector('#hc-modal-apps-view-close').addEventListener('click', () => overlay.classList.remove('open'));
    overlay.classList.add('open');

    try {
      const res = await fetch(`/api/applications/job/${jobId}`, {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      const data = await res.json();
      const body = overlay.querySelector('#hc-apps-view-body');

      if (!data.applications || data.applications.length === 0) {
        body.innerHTML = `<div style="text-align: center; padding: 30rem; color: #888;">No applications submitted for this role yet.</div>`;
        return;
      }

      body.innerHTML = data.applications.map(app => `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14rem; padding: 18rem; margin-bottom: 14rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 14rem; margin-bottom: 8rem;">
            <div>
              <h4 style="font-size: 16rem; color: #fff; margin: 0 0 4rem;">${escapeHtml(app.candidateName)}</h4>
              <div style="font-size: 13rem; color: var(--hc-mint);">${escapeHtml(app.candidateHeadline || '')}</div>
              <div style="font-size: 12rem; color: #888; margin-top: 2rem;">${escapeHtml(app.candidateLocation || 'India')} • Applied ${new Date(app.appliedAt).toLocaleDateString()}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 8rem;">
              <select class="hc-form-select hc-app-status-select" data-app-id="${app.id}" style="padding: 6rem 10rem; font-size: 12rem;">
                <option value="applied" ${app.status === 'applied' ? 'selected' : ''}>Applied</option>
                <option value="under_review" ${app.status === 'under_review' ? 'selected' : ''}>Under Review</option>
                <option value="shortlisted" ${app.status === 'shortlisted' ? 'selected' : ''}>Shortlisted</option>
                <option value="interviewing" ${app.status === 'interviewing' ? 'selected' : ''}>Interviewing</option>
                <option value="offered" ${app.status === 'offered' ? 'selected' : ''}>Offered</option>
                <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Rejected</option>
              </select>
              ${app.resumeUrl ? `
                <a href="${escapeHtml(app.resumeUrl)}" class="hc-btn-secondary" style="font-size: 12rem; padding: 6rem 12rem; text-decoration: none;" download>Download Resume</a>
              ` : ''}
            </div>
          </div>
          ${app.coverNote ? `
            <div style="background: rgba(0,0,0,0.25); border-radius: 8rem; padding: 10rem; font-size: 13rem; color: #ccc; margin-top: 10rem; line-height: 1.4;">
              <strong>Cover Note:</strong> ${escapeHtml(app.coverNote)}
            </div>
          ` : ''}
        </div>
      `).join('');

      body.querySelectorAll('.hc-app-status-select').forEach(sel => {
        sel.addEventListener('change', async () => {
          const appId = sel.dataset.appId;
          const newStatus = sel.value;
          try {
            await fetch(`/api/applications/${appId}/status`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
              },
              body: JSON.stringify({ status: newStatus })
            });
            window.HireConnectAuth.showToast(`Applicant status updated to ${newStatus}.`);
          } catch (e) {
            window.HireConnectAuth.showToast('Failed to update status.', true);
          }
        });
      });

    } catch (e) {
      overlay.querySelector('#hc-apps-view-body').innerHTML = '<div style="color: #ff8888;">Error loading applicants.</div>';
    }
  }

  async function loadDiscoverableCandidates() {
    const listEl = document.getElementById('hc-disc-results');
    if (!listEl) return;

    const q = document.getElementById('hc-disc-search') ? document.getElementById('hc-disc-search').value : '';
    const skills = document.getElementById('hc-disc-skills') ? document.getElementById('hc-disc-skills').value : '';

    try {
      const res = await fetch(`/api/candidates/discover?q=${encodeURIComponent(q)}&skills=${encodeURIComponent(skills)}`, {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      const data = await res.json();
      if (!data.candidates || data.candidates.length === 0) {
        listEl.innerHTML = `<div style="padding: 30rem; color: #888;">No discoverable candidates match your criteria. Only candidates who explicitly opted-in appear here.</div>`;
        return;
      }

      listEl.innerHTML = `
        <div class="hc-candidates-grid">
          ${data.candidates.map(cand => `
            <div class="hc-candidate-card">
              <div>
                <h4 style="font-size: 16rem; color: #fff; margin: 0 0 4rem;">${escapeHtml(cand.name)}</h4>
                <div style="font-size: 13rem; color: var(--hc-mint); margin-bottom: 6rem;">${escapeHtml(cand.headline)}</div>
                <div style="font-size: 12rem; color: #999; margin-bottom: 12rem;">${escapeHtml(cand.location)} • ${escapeHtml(cand.expectedSalary || 'Competitive CTC')}</div>
                <p style="font-size: 13rem; color: #bbb; line-height: 1.4; margin-bottom: 14rem;">${escapeHtml((cand.summary || '').slice(0, 120))}...</p>
                <div class="hc-tech-tags">
                  ${(cand.skills || []).slice(0, 4).map(s => `<span class="hc-tech-tag">${escapeHtml(s.name)}</span>`).join('')}
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12rem; margin-top: 12rem;">
                <span style="font-size: 11rem; font-family: Saans Mono, monospace; color: #888;">Active Candidate</span>
                ${cand.canDownloadResume ? `
                  <a href="/api/profile/resume/download/${cand.userId}" class="hc-btn-secondary" style="font-size: 12rem; padding: 6rem 12rem; text-decoration: none;" download>Download CV</a>
                ` : `
                  <span style="font-size: 11rem; color: #666;">CV on Request</span>
                `}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } catch (e) {
      listEl.innerHTML = '<div style="color: #ff8888;">Error searching candidates.</div>';
    }
  }

  function bindEvents() {
    const root = document.getElementById('hc-companies-root');
    if (!root) return;

    // View tab switching
    const tabDir = root.querySelector('#hc-view-tab-dir');
    const tabRp = root.querySelector('#hc-view-tab-rp');
    if (tabDir) {
      tabDir.addEventListener('click', () => {
        currentView = 'directory';
        renderView();
      });
    }
    if (tabRp) {
      tabRp.addEventListener('click', () => {
        currentView = 'recruiter_portal';
        renderView();
      });
    }

    // Quick recruiter buttons
    const btnQuickPost = root.querySelector('#hc-quick-post-job');
    if (btnQuickPost) {
      btnQuickPost.addEventListener('click', () => {
        if (window.HireConnectAuth) window.HireConnectAuth.openPostJobModal();
      });
    }

    const btnQuickRp = root.querySelector('#hc-quick-recruiter-portal');
    if (btnQuickRp) {
      btnQuickRp.addEventListener('click', () => {
        currentView = 'recruiter_portal';
        renderView();
      });
    }

    // Directory Search & Filters
    const searchInput = root.querySelector('#hc-comp-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchFilter.q = e.target.value;
        applyFilters();
      });
    }

    const locSelect = root.querySelector('#hc-comp-loc-select');
    if (locSelect) {
      locSelect.addEventListener('change', (e) => {
        searchFilter.location = e.target.value;
        applyFilters();
      });
    }

    const catPills = root.querySelectorAll('.hc-cat-pill');
    catPills.forEach(p => {
      p.addEventListener('click', () => {
        searchFilter.industry = p.dataset.industry;
        applyFilters();
      });
    });

    // Company Card Clicks
    root.querySelectorAll('.hc-company-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const compId = card.dataset.compId;
        if (compId) {
          loadCompanyProfile(compId);
        }
      });
    });

    // Profile Back Button
    const backBtn = root.querySelector('#hc-btn-back-dir');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        currentView = 'directory';
        activeCompanyProfile = null;
        renderView();
      });
    }

    // Apply Buttons in Company Profile
    root.querySelectorAll('.hc-apply-job-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.HireConnectAuth) {
          window.HireConnectAuth.openApplyModal(btn.dataset.jobId, btn.dataset.jobTitle, btn.dataset.compName);
        }
      });
    });

    // Recruiter Portal Inner Tabs
    root.querySelectorAll('.hc-rp-tab').forEach(t => {
      t.addEventListener('click', () => {
        currentRecruiterTab = t.dataset.tab;
        renderView();
      });
    });

    const rpPostBtn = root.querySelector('#hc-rp-post-job-btn');
    if (rpPostBtn) {
      rpPostBtn.addEventListener('click', () => {
        if (window.HireConnectAuth) window.HireConnectAuth.openPostJobModal();
      });
    }

    // If recruiter portal loaded, trigger data load
    if (currentView === 'recruiter_portal') {
      if (currentRecruiterTab === 'jobs') {
        loadRecruiterJobs();
      } else if (currentRecruiterTab === 'discovery') {
        loadDiscoverableCandidates();
        const discBtn = root.querySelector('#hc-disc-btn');
        if (discBtn) {
          discBtn.addEventListener('click', loadDiscoverableCandidates);
        }
      }
    }
  }

  // Listen for job creation to auto-refresh
  window.addEventListener('hc:job-published', () => {
    fetchCompanies();
  });

  function init() {
    fetchCompanies();

    if (window.location.hash === '#screening') {
      setTimeout(() => {
        const sec = document.querySelector('._screening_16dpx_1');
        if (sec) sec.scrollIntoView();
      }, 600);
    }

    // DOM watchdog for Nuxt router
    const observer = new MutationObserver(() => {
      const pageApproach = document.querySelector('[data-page="approach"]');
      if (pageApproach) {
        const root = document.getElementById('hc-companies-root');
        if (!root || root.children.length === 0) {
          renderView();
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
