/**
 * HireConnect Find Jobs Engine
 * Powers live search, filtering, verified job cards, pagination, and modal dialogs.
 * Direct official employer career portal integration — strictly NO LinkedIn, Naukri, or Indeed.
 */

(function () {
  'use strict';

  // SVG Icons used throughout the UI
  const ICONS = {
    search: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 2a8 8 0 015.293 14.004l5.35 5.35a1 1 0 01-1.414 1.414l-5.35-5.35A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z"/></svg>',
    pin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hc-metric-svg" style="width:14rem;height:14rem;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    briefcase: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hc-metric-svg" style="width:14rem;height:14rem;"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    cash: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="hc-metric-svg" style="width:14rem;height:14rem;"><path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4.5 4.5 0 0 0 0-9"/></svg>',
    external: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13rem;height:13rem;"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    checkShield: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width:15rem;height:15rem;"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 15l-4-4 1.41-1.41L10 13.17l6.59-6.59L18 8l-8 8z"/></svg>',
    close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18rem;height:18rem;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    bookmark: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15rem;height:15rem;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    bookmarkFilled: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#a1d8c0" stroke="#a1d8c0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15rem;height:15rem;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>'
  };

  const CATEGORIES = [
    { id: 'all', label: 'All Roles' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'devops', label: 'DevOps & Cloud' },
    { id: 'ai-ml', label: 'AI / ML' },
    { id: 'data', label: 'Data Engineering' },
    { id: 'product', label: 'Product & Design' },
    { id: 'security', label: 'Cybersecurity' }
  ];

  class FindJobsEngine {
    constructor(rootEl) {
      this.root = rootEl || document.getElementById('hc-find-jobs-root') || document.querySelector('[data-page="services"]');
      if (!this.root) return;

      this.state = {
        q: '',
        location: 'all',
        workMode: 'all',
        experience: 'all',
        employmentType: 'all',
        category: 'all',
        sort: 'newest',
        page: 1,
        limit: 9,
        total: 0,
        hasMore: false,
        jobs: [],
        isLoading: false,
        activeJob: null
      };

      this.savedJobIds = new Set();
      this.debounceTimer = null;
      this.init();
      this.fetchSavedJobs();
    }

    init() {
      // Build DOM structure if not already populated
      this.renderAppShell();
      this.bindElements();
      this.bindEvents();
      this.fetchJobs(true);
    }

    renderAppShell() {
      // Check if shell already exists
      if (this.root.querySelector('.hc-jobs-wrapper')) return;

      this.root.innerHTML = `
        <div class="hc-jobs-wrapper">
          <!-- Page Hero Header -->
          <header class="hc-jobs-hero">
            <h1 class="hc-jobs-title">
              Find Your Next <span class="highlight-mint">Opportunity</span>
            </h1>
            <p class="hc-jobs-subtitle">
              Discover verified engineering, product, and tech roles directly with hiring teams.
            </p>
          </header>

          <!-- Translucent Glassmorphism Search Bar -->
          <section class="hc-search-card" aria-label="Job Search and Filters">
            <div class="hc-search-row">
              <div class="hc-input-box" style="flex: 2;">
                ${ICONS.search}
                <input type="text" id="hc-input-keyword" placeholder="Job title, skill (e.g. React, Python, Go, AWS) or keyword..." autocomplete="off">
              </div>

              <div class="hc-input-box" style="flex: 1.3;">
                ${ICONS.pin}
                <input type="text" id="hc-input-location" list="hc-locations-list" placeholder="Location in India or Remote..." autocomplete="off">
                <datalist id="hc-locations-list">
                  <option value="All India">
                  <option value="Remote - India">
                  <option value="Bengaluru, Karnataka">
                  <option value="Mumbai, Maharashtra">
                  <option value="Pune, Maharashtra">
                  <option value="Hyderabad, Telangana">
                  <option value="Gurugram, Haryana">
                  <option value="Chennai, Tamil Nadu">
                  <option value="Noida, Uttar Pradesh">
                </datalist>
              </div>

              <button type="button" id="hc-btn-search" class="hc-btn-search">
                ${ICONS.search}
                <span>Search Jobs</span>
              </button>
            </div>

            <!-- Secondary Filters Row -->
            <div class="hc-filters-row">
              <select id="hc-select-mode" class="hc-filter-dropdown" aria-label="Work Mode">
                <option value="all">All Work Modes</option>
                <option value="Remote">Remote Only</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>

              <select id="hc-select-exp" class="hc-filter-dropdown" aria-label="Experience Level">
                <option value="all">All Experience Levels</option>
                <option value="entry">0 - 2 Years (Entry / Associate)</option>
                <option value="mid">2 - 5 Years (Mid Level)</option>
                <option value="senior">5 - 8 Years (Senior)</option>
                <option value="lead">8+ Years (Lead / Principal)</option>
              </select>

              <select id="hc-select-type" class="hc-filter-dropdown" aria-label="Employment Type">
                <option value="all">All Employment Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>

              <select id="hc-select-sort" class="hc-filter-dropdown" aria-label="Sort Jobs By">
                <option value="newest">Sort: Newest First</option>
                <option value="salary_high">Sort: Highest Salary</option>
                <option value="experience_low">Sort: Experience (Low to High)</option>
              </select>

              <button type="button" id="hc-btn-clear" class="hc-filter-clear">
                Reset Filters
              </button>
            </div>
          </section>

          <!-- Category Quick Filter Pills -->
          <nav class="hc-categories-bar" aria-label="Job Categories">
            ${CATEGORIES.map(cat => `
              <button type="button" class="hc-cat-pill ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}">
                ${cat.label}
              </button>
            `).join('')}
          </nav>

          <!-- Results Stats & Count Row -->
          <div class="hc-stats-header">
            <span id="hc-results-count">Explore Available Positions</span>
            <span style="color: #666; font-size: 12rem;">Direct verified applications</span>
          </div>

          <!-- Dynamic Jobs Grid -->
          <div id="hc-jobs-grid" class="hc-jobs-grid" aria-live="polite">
            ${this.getSkeletonHtml(6)}
          </div>

          <!-- Pagination / Load More Button -->
          <div id="hc-pagination-wrap" class="hc-pagination-wrap" style="display: none;">
            <button type="button" id="hc-btn-load-more" class="hc-btn-load-more">
              Load More Opportunities
            </button>
          </div>
        </div>
      `;
    }

    bindElements() {
      this.inputKeyword = this.root.querySelector('#hc-input-keyword');
      this.inputLocation = this.root.querySelector('#hc-input-location');
      this.btnSearch = this.root.querySelector('#hc-btn-search');
      this.selectMode = this.root.querySelector('#hc-select-mode');
      this.selectExp = this.root.querySelector('#hc-select-exp');
      this.selectType = this.root.querySelector('#hc-select-type');
      this.selectSort = this.root.querySelector('#hc-select-sort');
      this.btnClear = this.root.querySelector('#hc-btn-clear');
      this.jobsGrid = this.root.querySelector('#hc-jobs-grid');
      this.resultsCount = this.root.querySelector('#hc-results-count');
      this.paginationWrap = this.root.querySelector('#hc-pagination-wrap');
      this.btnLoadMore = this.root.querySelector('#hc-btn-load-more');
      this.categoryPills = this.root.querySelectorAll('.hc-cat-pill');
    }

    bindEvents() {
      // Search input Enter key
      this.inputKeyword?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.state.q = this.inputKeyword.value.trim();
          this.fetchJobs(true);
        }
      });

      // Location input Enter key
      this.inputLocation?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.state.location = this.inputLocation.value.trim() || 'all';
          this.fetchJobs(true);
        }
      });

      // Debounced live typing for search keywords
      this.inputKeyword?.addEventListener('input', () => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.state.q = this.inputKeyword.value.trim();
          this.fetchJobs(true);
        }, 320);
      });

      // Location input change
      this.inputLocation?.addEventListener('input', () => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.state.location = this.inputLocation.value.trim() || 'all';
          this.fetchJobs(true);
        }, 320);
      });

      // Search button click
      this.btnSearch?.addEventListener('click', () => {
        this.state.q = this.inputKeyword ? this.inputKeyword.value.trim() : '';
        this.state.location = this.inputLocation ? (this.inputLocation.value.trim() || 'all') : 'all';
        this.fetchJobs(true);
      });

      // Filter dropdown changes
      this.selectMode?.addEventListener('change', () => {
        this.state.workMode = this.selectMode.value;
        this.fetchJobs(true);
      });

      this.selectExp?.addEventListener('change', () => {
        this.state.experience = this.selectExp.value;
        this.fetchJobs(true);
      });

      this.selectType?.addEventListener('change', () => {
        this.state.employmentType = this.selectType.value;
        this.fetchJobs(true);
      });

      this.selectSort?.addEventListener('change', () => {
        this.state.sort = this.selectSort.value;
        this.fetchJobs(true);
      });

      // Category pills click
      this.categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
          this.categoryPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.state.category = pill.getAttribute('data-category') || 'all';
          this.fetchJobs(true);
        });
      });

      // Reset filters button
      this.btnClear?.addEventListener('click', () => {
        this.resetFilters();
      });

      // Load more button
      this.btnLoadMore?.addEventListener('click', () => {
        if (!this.state.isLoading && this.state.hasMore) {
          this.state.page += 1;
          this.fetchJobs(false);
        }
      });

      // Job card click delegation: handling bookmark, internal apply, and external application
      this.jobsGrid?.addEventListener('click', (e) => {
        const saveBtn = e.target.closest('.hc-btn-save-job');
        if (saveBtn) {
          e.preventDefault();
          e.stopPropagation();
          const jobId = saveBtn.getAttribute('data-job-id');
          this.toggleSaveJob(jobId, saveBtn);
          return;
        }

        const internalApplyBtn = e.target.closest('.hc-btn-internal-apply');
        if (internalApplyBtn) {
          e.preventDefault();
          e.stopPropagation();
          const targetId = internalApplyBtn.getAttribute('data-job-id');
          const job = this.state.jobs.find(j => (j.id && j.id === targetId) || (j._id && j._id.toString() === targetId));
          const compName = this.getJobCompany(job);
          if (job && window.HireConnectAuth && typeof window.HireConnectAuth.openApplyModal === 'function') {
            window.HireConnectAuth.openApplyModal(job.id || job._id, job.title, compName, job.salary);
          }
          return;
        }

        const applyBtn = e.target.closest('.hc-btn-direct-apply');
        if (applyBtn) {
          // Native link handles opening in new tab
          return;
        }

        const card = e.target.closest('.hc-job-card');
        if (card) {
          const targetId = card.getAttribute('data-job-id');
          if (targetId) {
            const job = this.state.jobs.find(j => (j.id && j.id === targetId) || (j._id && j._id.toString() === targetId));
            const compName = this.getJobCompany(job);
            if (job && job.applyUrl && !job.applyUrl.startsWith('/api') && job.applyUrl !== '#') {
              window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
            } else if (job && window.HireConnectAuth && typeof window.HireConnectAuth.openApplyModal === 'function') {
              window.HireConnectAuth.openApplyModal(job.id || job._id, job.title, compName, job.salary);
            }
          }
        }
      });
    }

    resetFilters() {
      if (this.inputKeyword) this.inputKeyword.value = '';
      if (this.inputLocation) this.inputLocation.value = '';
      if (this.selectMode) this.selectMode.value = 'all';
      if (this.selectExp) this.selectExp.value = 'all';
      if (this.selectType) this.selectType.value = 'all';
      if (this.selectSort) this.selectSort.value = 'newest';

      this.categoryPills.forEach(p => {
        if (p.getAttribute('data-category') === 'all') {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });

      this.state.q = '';
      this.state.location = 'all';
      this.state.workMode = 'all';
      this.state.experience = 'all';
      this.state.employmentType = 'all';
      this.state.category = 'all';
      this.state.sort = 'newest';

      this.fetchJobs(true);
    }

    async fetchJobs(reset = false) {
      if (reset) {
        this.state.page = 1;
        this.jobsGrid.innerHTML = this.getSkeletonHtml(6);
        this.paginationWrap.style.display = 'none';
      }

      this.state.isLoading = true;

      // Construct API URL
      const params = new URLSearchParams();
      if (this.state.q) params.set('q', this.state.q);
      if (this.state.location && this.state.location !== 'all' && this.state.location.toLowerCase() !== 'all india') {
        params.set('location', this.state.location);
      }
      if (this.state.workMode && this.state.workMode !== 'all') params.set('workMode', this.state.workMode);
      if (this.state.experience && this.state.experience !== 'all') params.set('experience', this.state.experience);
      if (this.state.employmentType && this.state.employmentType !== 'all') params.set('employmentType', this.state.employmentType);
      if (this.state.category && this.state.category !== 'all') params.set('category', this.state.category);
      if (this.state.sort) params.set('sort', this.state.sort);
      params.set('page', this.state.page);
      params.set('limit', this.state.limit);

      try {
        const res = await fetch(`/api/jobs?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();

        const fetchedJobs = data.jobs || (data.data && data.data.jobs) || [];
        if (reset) {
          this.state.jobs = fetchedJobs;
        } else {
          this.state.jobs = [...this.state.jobs, ...fetchedJobs];
        }

        this.state.total = typeof data.total === 'number' ? data.total : (data.data && typeof data.data.total === 'number' ? data.data.total : fetchedJobs.length);
        this.state.hasMore = Boolean(data.hasMore || (data.data && data.data.hasMore));

        this.renderResults(reset);
      } catch (err) {
        console.error('Failed to load jobs from API:', err);
        this.renderErrorState();
      } finally {
        this.state.isLoading = false;
      }
    }

    renderResults(reset) {
      // Update count text
      if (this.resultsCount) {
        if (this.state.total === 0) {
          this.resultsCount.innerHTML = `No positions match your active search`;
        } else if (this.state.total === 1) {
          this.resultsCount.innerHTML = `Showing <strong>1</strong> Available Position`;
        } else {
          this.resultsCount.innerHTML = `Showing <strong>${this.state.jobs.length}</strong> of <strong>${this.state.total}</strong> Available Positions`;
        }
      }

      if (this.state.total === 0) {
        this.jobsGrid.innerHTML = `
          <div class="hc-empty-state" style="grid-column: 1 / -1;">
            <div class="hc-empty-emoji">🔍</div>
            <h3 class="hc-empty-heading">No matching opportunities found</h3>
            <p class="hc-empty-text">
              We couldn't find any direct listings matching your search terms. Try searching for broader keywords (e.g., "React", "Python", "Full Stack"), changing your location, or clearing applied filters.
            </p>
            <button type="button" class="hc-btn-search" style="margin: 0 auto;" id="hc-empty-reset-btn">
              Reset All Filters
            </button>
          </div>
        `;
        const resetBtn = this.jobsGrid.querySelector('#hc-empty-reset-btn');
        resetBtn?.addEventListener('click', () => this.resetFilters());
        this.paginationWrap.style.display = 'none';
        return;
      }

      const cardsHtml = (reset ? this.state.jobs : this.state.jobs.slice((this.state.page - 1) * this.state.limit))
        .map((job, idx) => this.renderCardHtml(job, (reset ? 0 : (this.state.page - 1) * this.state.limit) + idx))
        .join('');

      if (reset) {
        this.jobsGrid.innerHTML = cardsHtml;
      } else {
        this.jobsGrid.insertAdjacentHTML('beforeend', cardsHtml);
      }

      // Update pagination button
      if (this.state.hasMore) {
        this.paginationWrap.style.display = 'block';
        const remaining = this.state.total - this.state.jobs.length;
        this.btnLoadMore.textContent = `Load More Opportunities (${remaining} remaining)`;
      } else {
        this.paginationWrap.style.display = 'none';
      }
    }

    getJobCompany(job) {
      if (!job) return 'HireConnect Employer';
      if (typeof job.company === 'string') return job.company;
      return job.company?.name || job.companyName || 'HireConnect Employer';
    }

    renderCardHtml(job, index = 0) {
      const modeClass = (job.workMode || '').toLowerCase();
      const companyName = this.getJobCompany(job);
      const initials = (companyName || 'HC')
        .split(' ')
        .filter(Boolean)
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'HC';
      const logoUrl = job.companyLogo || (typeof job.company === 'object' ? job.company?.logoUrl : null);
      const companyCat = typeof job.companyCategory === 'string'
        ? job.companyCategory
        : (job.company?.industry || job.company?.category || 'Technology');
      const themeClass = (index % 2 === 0) ? 'theme-mint' : 'theme-purple';
      const jobId = job.id || (job._id ? job._id.toString() : '');
      const isSaved = this.savedJobIds && this.savedJobIds.has(jobId);
      const isInternal = job.isInternal || job.applicationMethod === 'internal' || !job.applyUrl || job.applyUrl.startsWith('/api') || job.applyUrl === '#';
      const formattedDate = job.formattedDate || (job.publishedAt ? new Date(job.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently posted');

      return `
        <article class="hc-job-card ${themeClass}" data-job-id="${this.escapeHtml(jobId)}" tabindex="0" role="button" aria-label="${this.escapeHtml(job.title)} at ${this.escapeHtml(companyName)}">
          <div>
            <div class="hc-card-top">
              <div class="hc-company-meta">
                <div class="hc-company-logo">
                  ${logoUrl ? `<img src="${this.escapeHtml(logoUrl)}" alt="${this.escapeHtml(companyName)}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='block';" /><span style="display:none;">${initials}</span>` : `<span>${initials}</span>`}
                </div>
                <div class="hc-company-details">
                  <span class="hc-company-title">${this.escapeHtml(companyName)}</span>
                  <span class="hc-company-category">${this.escapeHtml(companyCat)}</span>
                </div>
              </div>
              <span class="hc-badge-mode ${modeClass}">${this.escapeHtml(job.workMode || 'Full-time')}</span>
            </div>

            <h3 class="hc-card-title">${this.escapeHtml(job.title)}</h3>

            <div class="hc-card-metrics">
              <span class="hc-metric-item" title="Location">
                ${ICONS.pin}
                <span>${this.escapeHtml(job.location || 'India')}</span>
              </span>
              <span class="hc-metric-item" title="Experience">
                ${ICONS.briefcase}
                <span>${this.escapeHtml(job.experience || 'Not specified')}</span>
              </span>
              <span class="hc-metric-item salary" title="Compensation">
                ${ICONS.cash}
                <span>${this.escapeHtml(job.salary || 'Competitive')}</span>
              </span>
            </div>

            <p class="hc-card-desc">${this.escapeHtml(job.description || '')}</p>

            <div class="hc-card-skills">
              ${(job.skills || []).slice(0, 4).map(skill => `
                <span class="hc-skill-pill">${this.escapeHtml(skill)}</span>
              `).join('')}
              ${(job.skills || []).length > 4 ? `<span class="hc-skill-pill">+${job.skills.length - 4} more</span>` : ''}
            </div>
          </div>

          <div class="hc-card-footer">
            <div class="hc-date-source">
              <span class="hc-time-ago">${this.escapeHtml(formattedDate)}</span>
              <span class="hc-source-label">${this.escapeHtml(job.source || 'Official Company Careers')}</span>
            </div>
            <div class="hc-btn-group" style="display:flex;align-items:center;gap:8rem;">
              <button type="button" class="hc-btn-save-job" data-job-id="${this.escapeHtml(jobId)}" title="${isSaved ? 'Remove from Saved Jobs' : 'Save Job'}" aria-label="${isSaved ? 'Remove from Saved Jobs' : 'Save Job'}" style="background: rgba(255,255,255,0.06); border: 1px solid ${isSaved ? '#a1d8c0' : 'rgba(255,255,255,0.14)'}; border-radius: 8rem; width: 34rem; height: 34rem; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: ${isSaved ? '#a1d8c0' : '#888'}; transition: all 0.2s;">
                ${isSaved ? ICONS.bookmarkFilled : ICONS.bookmark}
              </button>
              ${isInternal ? `
                <button type="button" class="hc-btn-direct-apply hc-btn-internal-apply" data-job-id="${this.escapeHtml(jobId)}" title="Submit application through HireConnect">
                  <span>Apply Now</span>
                </button>
              ` : `
                <a href="${this.escapeHtml(job.applyUrl)}" target="_blank" rel="noopener noreferrer" class="hc-btn-direct-apply" title="Apply directly on ${this.escapeHtml(companyName)} careers portal">
                  <span>Apply Now</span>
                  ${ICONS.external}
                </a>
              `}
            </div>
          </div>
        </article>
      `;
    }

    async fetchSavedJobs() {
      try {
        const token =
          window.HireConnectAuth?.getToken?.() ||
          localStorage.getItem('hc_auth_token') ||
          localStorage.getItem('hireconnect_token') ||
          sessionStorage.getItem('hc_auth_token') ||
          sessionStorage.getItem('hireconnect_token');
        if (!token) return;
        const res = await fetch('/api/saved-jobs', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!res.ok) return;
        const data = await res.json();
        const list = data.savedJobs || (data.data && data.data.savedJobs) || [];
        this.savedJobIds = new Set(list.map(s => (s.job && s.job._id) || (s.job && s.job.id) || s.job || s.jobId));
        this.updateSavedButtons();
      } catch (e) {
        // Silently ignore if unauthenticated
      }
    }

    updateSavedButtons() {
      if (!this.jobsGrid) return;
      this.jobsGrid.querySelectorAll('.hc-btn-save-job').forEach(btn => {
        const jId = btn.getAttribute('data-job-id');
        const isSaved = this.savedJobIds && this.savedJobIds.has(jId);
        btn.innerHTML = isSaved ? ICONS.bookmarkFilled : ICONS.bookmark;
        btn.style.color = isSaved ? '#a1d8c0' : '#888';
        btn.style.borderColor = isSaved ? '#a1d8c0' : 'rgba(255,255,255,0.14)';
        btn.title = isSaved ? 'Remove from Saved Jobs' : 'Save Job';
        btn.setAttribute('aria-label', isSaved ? 'Remove from Saved Jobs' : 'Save Job');
      });
    }

    async toggleSaveJob(jobId, buttonEl) {
      const token =
        window.HireConnectAuth?.getToken?.() ||
        localStorage.getItem('hc_auth_token') ||
        localStorage.getItem('hireconnect_token') ||
        sessionStorage.getItem('hc_auth_token') ||
        sessionStorage.getItem('hireconnect_token');
      if (!token) {
        if (window.HireConnectAuth && typeof window.HireConnectAuth.showToast === 'function') {
          window.HireConnectAuth.showToast('Please sign in as a job seeker to bookmark jobs.');
        } else {
          alert('Please sign in as a job seeker to bookmark jobs.');
        }
        return;
      }

      const isSaved = this.savedJobIds && this.savedJobIds.has(jobId);
      buttonEl.disabled = true;

      try {
        const endpoint = `/api/jobs/${jobId}/save`;
        const method = isSaved ? 'DELETE' : 'POST';
        const res = await fetch(endpoint, {
          method,
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();

        if (res.ok && data.success) {
          if (isSaved) {
            this.savedJobIds.delete(jobId);
            if (window.HireConnectAuth?.showToast) {
              window.HireConnectAuth.showToast('Position removed from saved bookmarks.');
            }
          } else {
            this.savedJobIds.add(jobId);
            if (window.HireConnectAuth?.showToast) {
              window.HireConnectAuth.showToast('Position successfully saved to bookmarks!');
            }
          }
          this.updateSavedButtons();
        } else {
          if (window.HireConnectAuth?.showToast) {
            window.HireConnectAuth.showToast(data.message || 'Could not update saved position.', true);
          }
        }
      } catch (err) {
        if (window.HireConnectAuth?.showToast) {
          window.HireConnectAuth.showToast('Network error updating saved status.', true);
        }
      } finally {
        buttonEl.disabled = false;
      }
    }

    renderErrorState() {
      this.jobsGrid.innerHTML = `
        <div class="hc-empty-state" style="grid-column: 1 / -1;">
          <div class="hc-empty-emoji">⚠️</div>
          <h3 class="hc-empty-heading">Unable to load job listings</h3>
          <p class="hc-empty-text">
            There was a temporary problem connecting to the jobs server. Please verify your connection or click retry.
          </p>
          <button type="button" class="hc-btn-search" style="margin: 0 auto;" id="hc-error-retry-btn">
            Retry Loading
          </button>
        </div>
      `;
      const retryBtn = this.jobsGrid.querySelector('#hc-error-retry-btn');
      retryBtn?.addEventListener('click', () => this.fetchJobs(true));
    }

    getSkeletonHtml(count = 6) {
      let out = '';
      for (let i = 0; i < count; i++) {
        out += `
          <div class="hc-skeleton-card">
            <div style="display:flex;gap:12rem;align-items:center;margin-bottom:18rem;">
              <div class="hc-skeleton-line" style="width:44rem;height:44rem;border-radius:12rem;margin-bottom:0;"></div>
              <div style="flex:1;">
                <div class="hc-skeleton-line" style="width:50%;height:14rem;"></div>
                <div class="hc-skeleton-line" style="width:30%;height:10rem;margin-bottom:0;"></div>
              </div>
            </div>
            <div class="hc-skeleton-line" style="width:85%;height:22rem;margin-bottom:16rem;"></div>
            <div class="hc-skeleton-line" style="width:65%;height:14rem;margin-bottom:14rem;"></div>
            <div class="hc-skeleton-line" style="width:100%;height:38rem;margin-bottom:16rem;"></div>
            <div style="display:flex;gap:6rem;margin-bottom:20rem;">
              <div class="hc-skeleton-line" style="width:56rem;height:22rem;margin-bottom:0;"></div>
              <div class="hc-skeleton-line" style="width:72rem;height:22rem;margin-bottom:0;"></div>
              <div class="hc-skeleton-line" style="width:60rem;height:22rem;margin-bottom:0;"></div>
            </div>
          </div>
        `;
      }
      return out;
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  }

  // Global initializer function
  window.initFindJobs = function (rootEl) {
    const target = rootEl || document.getElementById('hc-find-jobs-root') || document.querySelector('[data-page="services"]');
    if (target) {
      if (!target.__hcJobsEngine) {
        target.__hcJobsEngine = new FindJobsEngine(target);
      }
      return target.__hcJobsEngine;
    }
    return null;
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.initFindJobs());
  } else {
    window.initFindJobs();
  }
})();
