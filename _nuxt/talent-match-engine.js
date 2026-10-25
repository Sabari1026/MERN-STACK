/**
 * HireConnect Talent Match Engine (Phase 7)
 * Implements a 100% deterministic, explainable 6-factor weighted compatibility formula:
 * 1. Technical & Core Skills: 40%
 * 2. Relevant Experience: 20%
 * 3. Location & Work-Mode: 15%
 * 4. Employment Preferences: 10%
 * 5. Education & Qualifications: 10%
 * 6. Career & Domain Alignment: 5%
 * Total: 100%
 */

(function () {
  'use strict';

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

  function showToast(message, isError = false) {
    if (window.HireConnectAuth && window.HireConnectAuth.showToast) {
      window.HireConnectAuth.showToast(message, isError);
      return;
    }
    const toast = document.createElement('div');
    toast.className = 'hc-toast ' + (isError ? 'hc-toast-error' : 'hc-toast-success');
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1a202c;color:#fff;padding:12px 20px;border-radius:8px;border:1px solid ' + (isError ? '#f56565' : '#48bb78') + ';z-index:9999;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.5);';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3500);
  }

  let currentUser = null;
  let userProfile = null;
  let activeTab = 'jobs'; // 'jobs' for candidates, 'candidates' for recruiters
  let candidateMatches = [];
  let recruiterJobs = [];
  let selectedJobId = null;
  let recruiterMatches = [];
  let completenessData = null;

  // Filter state
  const filters = {
    workMode: 'all',
    minScore: '0',
    location: 'all',
    savedOnly: false,
    shortlistedOnly: false
  };

  function isCandidateUser() {
    return currentUser && (currentUser.role === 'candidate' || currentUser.role === 'employee');
  }

  function isRecruiterUser() {
    return currentUser && currentUser.role === 'recruiter';
  }

  async function initTalentMatch() {
    const root = document.getElementById('hc-talent-match-app');
    if (!root) return;

    const token = getToken();

    if (token) {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) {
          const data = await res.json();
          currentUser = data.user || data.data?.user;
          userProfile = data.profile || data.data?.profile;
          if (currentUser && currentUser.role === 'recruiter') {
            activeTab = 'candidates';
          } else {
            activeTab = 'jobs';
          }
        } else {
          currentUser = null;
        }
      } catch (e) {
        currentUser = null;
      }
    }

    renderTalentMatchUI(root);

    if (currentUser) {
      if (isCandidateUser()) {
        loadCandidateMatches();
      } else if (isRecruiterUser()) {
        loadRecruiterJobsAndMatches();
      }
    }
  }

  function renderTalentMatchUI(container) {
    container.innerHTML = `
      <div class="tm-page-header">
        <div class="tm-header-badge">Explainable Direct Alignment Engine</div>
        <h1 class="tm-hero-title">The Right Talent. The Right Opportunity.</h1>
        <p class="tm-hero-subtitle">
          HireConnect connects candidates and recruiters through relevant skills, verified experience, and authentic career preferences — with 100% explainable 6-factor matching logic.
        </p>

        <div class="tm-role-tabs" role="tablist">
          <button type="button" class="tm-tab-btn ${activeTab === 'jobs' ? 'active' : ''}" id="tm-tab-jobs" role="tab">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            <span>Find Jobs That Match Me</span>
          </button>
          <button type="button" class="tm-tab-btn ${activeTab === 'candidates' ? 'active' : ''}" id="tm-tab-candidates" role="tab">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span>Find Candidates That Match My Opening</span>
          </button>
        </div>
      </div>

      ${!currentUser ? `
        <!-- Unauthenticated Guest Prompt & Interactive Demo -->
        <div class="tm-guest-prompt-card">
          <div class="tm-guest-left">
            <div class="tm-lock-badge">🔒 Personalized AI Matching</div>
            <h2 class="tm-guest-title">Sign in to unlock personalized opportunities</h2>
            <p class="tm-guest-desc">
              Talent Match dynamically evaluates verified skills, past projects, compensation targets, and preferred locations to recommend opportunities where you have the highest probability of technical alignment.
            </p>
            <div class="tm-guest-actions">
              <a href="/about/" class="tm-btn-primary">Sign In to HireConnect</a>
              <a href="/signup/" class="tm-btn-outline">Create Free Account</a>
            </div>
          </div>
          <div class="tm-guest-preview-box">
            <div class="tm-preview-header">
              <div class="tm-preview-dot"></div>
              <span>Explainable Scoring Engine Preview</span>
            </div>
            <div class="tm-preview-item">
              <div class="tm-pi-title">Staff Full Stack Architect • 94% Match</div>
              <div class="tm-pi-reasons">
                <span class="tm-tag-matched">✓ React / Next.js matched (40% skills)</span>
                <span class="tm-tag-matched">✓ Node.js &amp; MongoDB matched</span>
                <span class="tm-tag-matched">✓ 5+ yrs experience verified (20% exp)</span>
                <span class="tm-tag-matched">✓ Remote compatible (15% loc)</span>
              </div>
            </div>
            <div class="tm-formula-note">
              Deterministic 6-Factor Weights: Skills (40%) • Exp (20%) • Location (15%) • Work Type (10%) • Education (10%) • Domain (5%)
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Main Talent Match Workspace -->
      <div id="tm-workspace" style="${!currentUser ? 'display: none;' : ''}">
        <!-- Profile completeness banner if needed -->
        <div id="tm-completeness-banner" style="display:none; margin-bottom: 20rem; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 12rem; padding: 14rem 20rem; color: #e2e8f0;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10rem;">
            <div>
              <strong style="color: #38bdf8;">Profile Completeness: <span id="tm-completeness-pct">0</span>%</strong>
              <span id="tm-completeness-msg" style="margin-left: 8rem; font-size: 13rem; color: #94a3b8;">Add your experience and skills to unlock higher matching accuracy.</span>
            </div>
            <a href="/approach/" class="tm-btn-outline" style="padding: 6rem 14rem; font-size: 12rem;">Update Profile</a>
          </div>
        </div>

        <!-- Dynamic Filter Controls -->
        <div class="tm-filter-card">
          <div class="tm-filter-row">
            ${activeTab === 'candidates' ? `
              <div class="tm-filter-col job-selector-col">
                <label class="tm-filter-label" for="tm-select-job">Matching Against Active Job Opening:</label>
                <select id="tm-select-job" class="tm-select">
                  <option value="">Loading your company jobs...</option>
                </select>
              </div>
            ` : ''}

            <div class="tm-filter-col">
              <label class="tm-filter-label" for="tm-filter-workmode">Work Mode:</label>
              <select id="tm-filter-workmode" class="tm-select">
                <option value="all">All Work Modes</option>
                <option value="remote">Remote Only</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-site</option>
              </select>
            </div>

            <div class="tm-filter-col">
              <label class="tm-filter-label" for="tm-filter-score">Minimum Match Score:</label>
              <select id="tm-filter-score" class="tm-select">
                <option value="0">All Match Scores</option>
                <option value="85">85%+ Excellent Matches</option>
                <option value="70">70%+ Strong Matches</option>
                <option value="50">50%+ Moderate Matches</option>
              </select>
            </div>

            <div class="tm-filter-col tm-toggle-col">
              ${activeTab === 'jobs' ? `
                <label class="tm-checkbox-btn">
                  <input type="checkbox" id="tm-toggle-saved" ${filters.savedOnly ? 'checked' : ''} />
                  <span>★ View Saved Jobs Only</span>
                </label>
              ` : `
                <label class="tm-checkbox-btn">
                  <input type="checkbox" id="tm-toggle-shortlisted" ${filters.shortlistedOnly ? 'checked' : ''} />
                  <span>⭐ Shortlisted Candidates Only</span>
                </label>
              `}
            </div>

            <div class="tm-filter-col tm-refresh-col">
              <button type="button" id="tm-btn-refresh" class="tm-refresh-btn" title="Recalculate matches">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                <span>Recalculate</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Results Counter & Info Bar -->
        <div class="tm-results-bar">
          <div id="tm-results-count" class="tm-count-text">Analyzing your verified profile preferences...</div>
          <div class="tm-scoring-badge" id="tm-explain-trigger" title="Click to view explainable formula details">
            <span>ℹ️ Transparent 6-Factor Formula (40% Skills • 20% Exp • 15% Loc • 10% Work • 10% Edu • 5% Domain)</span>
          </div>
        </div>

        <!-- Cards Grid -->
        <div id="tm-grid" class="tm-grid">
          <div class="tm-loading-state">
            <div class="hc-spinner"></div>
            <p>Evaluating profile evidence against verified opportunities...</p>
          </div>
        </div>
      </div>

      <!-- Explainable Algorithm Breakdown Modal -->
      <div id="tm-explain-modal" class="hc-modal-overlay" style="display:none;">
        <div class="hc-modal-box tm-modal-box">
          <div class="hc-modal-header">
            <h3>Explainable Matching Methodology</h3>
            <button type="button" class="hc-modal-close" id="tm-explain-close">&times;</button>
          </div>
          <div class="hc-modal-body">
            <p style="color: #aaa; font-size: 14rem; line-height: 1.5; margin-bottom: 20rem;">
              HireConnect does not rely on opaque black-box machine learning or arbitrary hiring probabilities. All match recommendations are computed transparently based on verified profile evidence and job criteria across 6 deterministic factors:
            </p>
            <div class="tm-weights-list">
              <div class="tm-weight-row">
                <span class="tm-w-pct">40%</span>
                <div class="tm-w-info">
                  <strong>Technical &amp; Core Skill Alignment</strong>
                  <p>Normalized skill overlap across required (80%) and preferred (20%) technical competencies, mapped with industry skill aliases.</p>
                </div>
              </div>
              <div class="tm-weight-row">
                <span class="tm-w-pct">20%</span>
                <div class="tm-w-info">
                  <strong>Relevant Experience &amp; Seniority</strong>
                  <p>Computed from non-overlapping career intervals to prevent double-counting, benchmarked against job experience criteria.</p>
                </div>
              </div>
              <div class="tm-weight-row">
                <span class="tm-w-pct">15%</span>
                <div class="tm-w-info">
                  <strong>Location &amp; Work Mode Compatibility</strong>
                  <p>Full score for Remote openings or candidate preferred cities (Bengaluru, Mumbai, Pune, Delhi NCR, Hyderabad, etc.).</p>
                </div>
              </div>
              <div class="tm-weight-row">
                <span class="tm-w-pct">10%</span>
                <div class="tm-w-info">
                  <strong>Employment Preferences</strong>
                  <p>Matches preferences for full-time, part-time, contract, or internship work.</p>
                </div>
              </div>
              <div class="tm-weight-row">
                <span class="tm-w-pct">10%</span>
                <div class="tm-w-info">
                  <strong>Education &amp; Qualifications</strong>
                  <p>Evaluates degrees and certifications without unfairly penalizing candidates when optional criteria are omitted.</p>
                </div>
              </div>
              <div class="tm-weight-row">
                <span class="tm-w-pct">5%</span>
                <div class="tm-w-info">
                  <strong>Career &amp; Domain Alignment</strong>
                  <p>Alignment between target titles, professional headline, and company job domain.</p>
                </div>
              </div>
            </div>
            <div style="margin-top: 20rem; text-align: right;">
              <button type="button" class="hc-submit-btn" id="tm-explain-ok" style="width: auto; padding: 10rem 24rem;">Got It</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Match Factors Breakdown Detail Modal -->
      <div id="tm-factor-detail-modal" class="hc-modal-overlay" style="display:none;"></div>
    `;

    setupEventHandlers(container);
  }

  function setupEventHandlers(container) {
    const tabJobs = container.querySelector('#tm-tab-jobs');
    const tabCandidates = container.querySelector('#tm-tab-candidates');

    if (tabJobs) {
      tabJobs.addEventListener('click', () => {
        if (!currentUser) {
          activeTab = 'jobs';
          renderTalentMatchUI(container);
          return;
        }
        if (!isCandidateUser()) {
          showToast('Job Seeker Talent Match is tailored for candidate accounts. Sign in as a candidate to view your job matches.', true);
          return;
        }
        activeTab = 'jobs';
        renderTalentMatchUI(container);
        loadCandidateMatches();
      });
    }

    if (tabCandidates) {
      tabCandidates.addEventListener('click', () => {
        if (!currentUser) {
          activeTab = 'candidates';
          renderTalentMatchUI(container);
          return;
        }
        if (!isRecruiterUser()) {
          showToast('Recruiter Candidate Matching is restricted to authorized company recruiters. Sign in with a recruiter account to access.', true);
          return;
        }
        activeTab = 'candidates';
        renderTalentMatchUI(container);
        loadRecruiterJobsAndMatches();
      });
    }

    const selWorkMode = container.querySelector('#tm-filter-workmode');
    if (selWorkMode) {
      selWorkMode.addEventListener('change', (e) => {
        filters.workMode = e.target.value;
        refreshCurrentTabMatches();
      });
    }

    const selScore = container.querySelector('#tm-filter-score');
    if (selScore) {
      selScore.addEventListener('change', (e) => {
        filters.minScore = e.target.value;
        refreshCurrentTabMatches();
      });
    }

    const toggleSaved = container.querySelector('#tm-toggle-saved');
    if (toggleSaved) {
      toggleSaved.addEventListener('change', (e) => {
        filters.savedOnly = e.target.checked;
        loadCandidateMatches();
      });
    }

    const toggleShortlisted = container.querySelector('#tm-toggle-shortlisted');
    if (toggleShortlisted) {
      toggleShortlisted.addEventListener('change', (e) => {
        filters.shortlistedOnly = e.target.checked;
        loadRecruiterCandidateMatches();
      });
    }

    const btnRefresh = container.querySelector('#tm-btn-refresh');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => {
        showToast('Recalculating fresh match scores against live records...');
        refreshCurrentTabMatches();
      });
    }

    const explainTrigger = container.querySelector('#tm-explain-trigger');
    const explainModal = container.querySelector('#tm-explain-modal');
    const explainClose = container.querySelector('#tm-explain-close');
    const explainOk = container.querySelector('#tm-explain-ok');

    if (explainTrigger && explainModal) {
      explainTrigger.addEventListener('click', () => explainModal.style.display = 'flex');
      if (explainClose) explainClose.addEventListener('click', () => explainModal.style.display = 'none');
      if (explainOk) explainOk.addEventListener('click', () => explainModal.style.display = 'none');
      explainModal.addEventListener('click', (e) => {
        if (e.target === explainModal) explainModal.style.display = 'none';
      });
    }
  }

  function refreshCurrentTabMatches() {
    if (activeTab === 'jobs') {
      loadCandidateMatches();
    } else {
      loadRecruiterCandidateMatches();
    }
  }

  // ==================== CANDIDATE MATCHES ====================
  async function loadCandidateMatches() {
    const grid = document.getElementById('tm-grid');
    const countEl = document.getElementById('tm-results-count');
    const banner = document.getElementById('tm-completeness-banner');
    if (!grid) return;

    grid.innerHTML = '<div class="tm-loading-state"><div class="hc-spinner"></div><p>Calculating explainable match scores...</p></div>';

    const token = getToken();
    const query = new URLSearchParams({
      workMode: filters.workMode,
      minScore: filters.minScore,
      location: filters.location,
      savedOnly: filters.savedOnly ? 'true' : 'false'
    });

    try {
      const res = await fetch(`/api/matching/jobs?${query.toString()}`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();

      if (!res.ok) {
        grid.innerHTML = `<div class="tm-error-state">${escapeHtml(data.message || 'Error fetching matches')}</div>`;
        return;
      }

      candidateMatches = data.matches || data.jobs || [];
      completenessData = {
        completeness: data.candidateProfileCompleteness || 100,
        missing: data.missingProfileFields || []
      };

      if (banner) {
        if (completenessData.completeness < 75 && completenessData.missing.length > 0) {
          banner.style.display = 'block';
          const pctEl = document.getElementById('tm-completeness-pct');
          const msgEl = document.getElementById('tm-completeness-msg');
          if (pctEl) pctEl.textContent = completenessData.completeness;
          if (msgEl) msgEl.textContent = `Recommended: Add ${completenessData.missing.join(', ')} to improve match accuracy.`;
        } else {
          banner.style.display = 'none';
        }
      }

      if (countEl) {
        countEl.innerHTML = `Showing <strong>${candidateMatches.length}</strong> verified opportunities matching your profile`;
      }

      if (candidateMatches.length === 0) {
        grid.innerHTML = `
          <div class="tm-empty-state">
            <div style="font-size: 32rem; margin-bottom: 12rem;">🎯</div>
            <h3>No matches found with current filter criteria</h3>
            <p>Try lowering the minimum match score or switching work modes to discover more engineering roles.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = candidateMatches.map(m => renderCandidateJobCard(m)).join('');
      attachJobCardListeners(grid);
    } catch (e) {
      grid.innerHTML = '<div class="tm-error-state">Failed to connect to Talent Match service.</div>';
    }
  }

  function renderCandidateJobCard(m) {
    const job = m.job || {};
    const score = typeof m.matchScore === 'number' ? m.matchScore : (m.score || 0);
    const category = m.category || (score >= 85 ? 'Excellent match' : (score >= 70 ? 'Strong match' : (score >= 50 ? 'Moderate match' : 'Lower match')));
    const isSaved = Boolean(m.isSaved);
    const isApplied = Boolean(m.isApplied);
    const isLimited = Boolean(m.limitedData);

    let scoreClass = 'high';
    if (score < 50) scoreClass = 'fair';
    else if (score < 70) scoreClass = 'med';
    else if (score < 85) scoreClass = 'strong';

    const matchedChips = (m.matchedSkills || []).map(s => `<span class="tm-chip matched">✓ ${escapeHtml(s)}</span>`).join('');
    const missingChips = (m.missingSkills || []).map(s => `<span class="tm-chip missing">Missing: ${escapeHtml(s)}</span>`).join('');

    return `
      <div class="tm-match-card" data-job-id="${escapeHtml(job.id)}">
        <div class="tm-card-top">
          <div class="tm-card-company-row">
            <span class="tm-company-badge">${escapeHtml(job.company)}</span>
            <div style="display: flex; gap: 8rem; align-items: center;">
              ${isLimited ? `<span class="tm-chip-limited" title="Profile evidence completeness is below 60%" style="font-size: 11rem; background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); padding: 2rem 8rem; border-radius: 9999px;">⚠️ Limited Profile Data</span>` : ''}
              <div class="tm-score-pill ${scoreClass}" title="${score}% alignment based on transparent scoring">
                <span class="tm-score-num">${score}%</span> Match
              </div>
            </div>
          </div>
          <h3 class="tm-job-title">${escapeHtml(job.title)}</h3>
          <div class="tm-meta-row">
            <span class="tm-meta-item">📍 ${escapeHtml(job.location)}</span>
            <span class="tm-meta-item">💼 ${escapeHtml(job.workMode || 'Hybrid')}</span>
            ${job.salary ? `<span class="tm-meta-salary">💰 ${escapeHtml(job.salary)}</span>` : ''}
            <span class="tm-meta-category" style="color: #a1d8c0; font-size: 12rem; font-weight: 600;">• ${escapeHtml(category)}</span>
          </div>
        </div>

        <div class="tm-skills-block">
          <div class="tm-skills-label">Skill Alignment Analysis:</div>
          <div class="tm-chips-wrap">
            ${matchedChips || '<span style="color: #888; font-size: 12rem;">No specific skill overlap identified</span>'}
            ${missingChips}
          </div>
        </div>

        <div class="tm-explain-reasons">
          ${(m.reasons || []).slice(0, 3).map(r => `<div class="tm-reason-line">• ${escapeHtml(r)}</div>`).join('')}
        </div>

        <div style="margin-top: 10rem; margin-bottom: 14rem;">
          <button type="button" class="tm-btn-factors-toggle" data-action="breakdown" data-id="${escapeHtml(job.id)}" style="background: none; border: none; color: #38bdf8; font-size: 12rem; cursor: pointer; text-decoration: underline; padding: 0;">
            🔍 View 6-Factor Score Breakdown
          </button>
        </div>

        <div class="tm-card-footer">
          <button type="button" class="tm-btn-save ${isSaved ? 'saved' : ''}" data-action="save" data-id="${escapeHtml(job.id)}">
            ${isSaved ? '★ Saved' : '☆ Save Job'}
          </button>
          <div class="tm-footer-actions">
            <a href="/services/#job-${escapeHtml(job.id)}" class="tm-btn-view" data-action="view" data-id="${escapeHtml(job.id)}">View Job</a>
            ${isApplied ? `
              <button type="button" class="tm-btn-apply" disabled style="background: #2d3748; color: #a0aec0; cursor: default;">Applied ✓</button>
            ` : `
              <button type="button" class="tm-btn-apply" data-action="apply" data-id="${escapeHtml(job.id)}" data-title="${escapeHtml(job.title)}" data-company="${escapeHtml(job.company)}">Apply Now</button>
            `}
          </div>
        </div>
      </div>
    `;
  }

  function attachJobCardListeners(container) {
    // Save button
    container.querySelectorAll('[data-action="save"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const jobId = btn.dataset.id;
        const token = getToken();
        if (!token) {
          showToast('Please sign in to save jobs.', true);
          return;
        }

        try {
          const res = await fetch('/api/matching/save-job', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ jobId })
          });
          const data = await res.json();
          if (data.success) {
            if (data.isSaved) {
              btn.classList.add('saved');
              btn.textContent = '★ Saved';
              showToast('Job added to your saved list!');
            } else {
              btn.classList.remove('saved');
              btn.textContent = '☆ Save Job';
              showToast('Job removed from saved list.');
            }
          }
        } catch (err) {
          showToast('Failed to update saved job.', true);
        }
      });
    });

    // Breakdown modal button
    container.querySelectorAll('[data-action="breakdown"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const jobId = btn.dataset.id;
        const match = candidateMatches.find(m => (m.job?.id || m.job?._id) === jobId);
        if (match) {
          openFactorBreakdownModal(match, match.job?.title);
        }
      });
    });

    // Apply button
    container.querySelectorAll('[data-action="apply"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const jobId = btn.dataset.id;
        const title = btn.dataset.title;
        const company = btn.dataset.company;

        if (window.HireConnectAuth && window.HireConnectAuth.openApplyModal) {
          window.HireConnectAuth.openApplyModal({ id: jobId, title, company });
        } else {
          window.location.href = `/services/#job-${jobId}`;
        }
      });
    });
  }

  function openFactorBreakdownModal(match, title) {
    const modal = document.getElementById('tm-factor-detail-modal');
    if (!modal) return;

    const factors = match.factors || [];
    const factorRows = factors.map(f => {
      const stateColor = f.score >= 80 ? '#48bb78' : (f.score >= 50 ? '#ecc94b' : (f.hasEvidence ? '#f56565' : '#718096'));
      return `
        <div style="border-bottom: 1px solid rgba(255,255,255,0.06); padding: 12rem 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4rem;">
            <div>
              <strong style="color: #fff; font-size: 14rem;">${escapeHtml(f.name)}</strong>
              <span style="color: #a0aec0; font-size: 12rem; margin-left: 6rem;">(${f.weight}% weight)</span>
            </div>
            <span style="color: ${stateColor}; font-weight: 700; font-size: 14rem;">${f.hasEvidence ? f.score + '%' : 'No Evidence'}</span>
          </div>
          <p style="margin: 0; font-size: 12rem; color: #a0aec0; line-height: 1.4;">${escapeHtml(f.explanation)}</p>
        </div>
      `;
    }).join('');

    modal.innerHTML = `
      <div class="hc-modal-box tm-modal-box" style="max-width: 600rem;">
        <div class="hc-modal-header">
          <div>
            <h3 style="margin: 0;">Explainable Match Breakdown</h3>
            <p style="margin: 4rem 0 0; font-size: 13rem; color: #a1d8c0;">${escapeHtml(title || 'Selected Role')}</p>
          </div>
          <button type="button" class="hc-modal-close" id="tm-factor-close">&times;</button>
        </div>
        <div class="hc-modal-body" style="max-height: 70vh; overflow-y: auto;">
          <div style="background: rgba(255,255,255,0.03); border-radius: 8rem; padding: 12rem 16rem; margin-bottom: 16rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 12rem; color: #888;">Overall Match Compatibility:</div>
              <div style="font-size: 20rem; font-weight: 700; color: #38bdf8;">${match.matchScore || match.score}% • ${escapeHtml(match.category || 'Score')}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 12rem; color: #888;">Data Completeness:</div>
              <div style="font-size: 16rem; font-weight: 600; color: #e2e8f0;">${match.dataCompleteness || 0}%</div>
            </div>
          </div>

          <div style="margin-bottom: 16rem;">
            ${factorRows}
          </div>

          <div style="text-align: right; margin-top: 20rem;">
            <button type="button" class="hc-submit-btn" id="tm-factor-ok" style="width: auto; padding: 10rem 24rem;">Done</button>
          </div>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
    const closeBtn = modal.querySelector('#tm-factor-close');
    const okBtn = modal.querySelector('#tm-factor-ok');
    if (closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
    if (okBtn) okBtn.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  // ==================== RECRUITER MATCHES ====================
  async function loadRecruiterJobsAndMatches() {
    const selJob = document.getElementById('tm-select-job');
    const token = getToken();

    try {
      const res = await fetch('/api/recruiter/jobs', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();

      if (res.ok && data.jobs && data.jobs.length > 0) {
        recruiterJobs = data.jobs;
        if (selJob) {
          selJob.innerHTML = recruiterJobs.map(j => `
            <option value="${escapeHtml(j.id || j._id)}" ${(j.id || j._id) === selectedJobId ? 'selected' : ''}>
              ${escapeHtml(j.title)} (${escapeHtml(j.location)})
            </option>
          `).join('');

          if (!selectedJobId) selectedJobId = recruiterJobs[0].id || recruiterJobs[0]._id;
          selJob.value = selectedJobId;

          selJob.addEventListener('change', (e) => {
            selectedJobId = e.target.value;
            loadRecruiterCandidateMatches();
          });
        }

        loadRecruiterCandidateMatches();
      } else {
        const grid = document.getElementById('tm-grid');
        if (grid) {
          grid.innerHTML = `
            <div class="tm-empty-state">
              <h3>No Active Job Openings Published</h3>
              <p>Publish an opening for your company on the Companies page to discover matching candidates.</p>
              <a href="/approach/#post-job" class="tm-btn-primary" style="margin-top: 16rem; display: inline-block;">Post a Job Opening</a>
            </div>
          `;
        }
      }
    } catch (e) {
      console.warn('Error loading recruiter jobs:', e);
    }
  }

  async function loadRecruiterCandidateMatches() {
    const grid = document.getElementById('tm-grid');
    const countEl = document.getElementById('tm-results-count');
    if (!grid || !selectedJobId) return;

    grid.innerHTML = '<div class="tm-loading-state"><div class="hc-spinner"></div><p>Searching verified candidate profiles matching your job criteria...</p></div>';

    const token = getToken();
    const query = new URLSearchParams({
      minScore: filters.minScore,
      shortlistedOnly: filters.shortlistedOnly ? 'true' : 'false'
    });

    try {
      const res = await fetch(`/api/recruiter/jobs/${selectedJobId}/matches?${query.toString()}`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();

      if (!res.ok) {
        grid.innerHTML = `<div class="tm-error-state">${escapeHtml(data.message || 'Error fetching candidates')}</div>`;
        return;
      }

      recruiterMatches = data.matches || [];
      if (countEl) {
        countEl.innerHTML = `Found <strong>${recruiterMatches.length}</strong> discoverable engineering candidates matching requirements for <em>${escapeHtml(data.job ? data.job.title : 'this role')}</em>`;
      }

      if (recruiterMatches.length === 0) {
        grid.innerHTML = `
          <div class="tm-empty-state">
            <div style="font-size: 32rem; margin-bottom: 12rem;">👥</div>
            <h3>No candidates matched current threshold</h3>
            <p>Try lowering the minimum match score or checking back as new candidates join HireConnect.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = recruiterMatches.map(c => renderRecruiterCandidateCard(c)).join('');
      attachRecruiterCardListeners(grid);
    } catch (e) {
      grid.innerHTML = '<div class="tm-error-state">Failed to connect to Candidate Matching service.</div>';
    }
  }

  function renderRecruiterCandidateCard(c) {
    const score = typeof c.matchScore === 'number' ? c.matchScore : (c.score || 0);
    const category = c.category || (score >= 85 ? 'Excellent match' : (score >= 70 ? 'Strong match' : (score >= 50 ? 'Moderate match' : 'Lower match')));
    const isLimited = Boolean(c.limitedData);

    let scoreClass = 'high';
    if (score < 50) scoreClass = 'fair';
    else if (score < 70) scoreClass = 'med';
    else if (score < 85) scoreClass = 'strong';

    const initials = c.name ? c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'HC';
    const matchedChips = (c.matchedSkills || []).map(s => `<span class="tm-chip matched">✓ ${escapeHtml(s)}</span>`).join('');
    const missingChips = (c.missingSkills || []).map(s => `<span class="tm-chip missing">Missing: ${escapeHtml(s)}</span>`).join('');

    return `
      <div class="tm-match-card candidate-card" data-candidate-id="${escapeHtml(c.candidateId)}">
        <div class="tm-card-top">
          <div class="tm-candidate-header-row">
            <div class="tm-candidate-avatar">${initials}</div>
            <div class="tm-candidate-headline-wrap">
              <h3 class="tm-candidate-name">${escapeHtml(c.name)}</h3>
              <p class="tm-candidate-headline">${escapeHtml(c.headline || 'Software Engineer')}</p>
            </div>
            <div style="display: flex; gap: 8rem; align-items: center;">
              ${isLimited ? `<span class="tm-chip-limited" title="Profile evidence completeness is below 60%" style="font-size: 11rem; background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); padding: 2rem 8rem; border-radius: 9999px;">⚠️ Limited Data</span>` : ''}
              <div class="tm-score-pill ${scoreClass}">
                <span class="tm-score-num">${score}%</span> Match
              </div>
            </div>
          </div>
          <div class="tm-meta-row">
            <span class="tm-meta-item">⏱️ ${c.experienceYears} yrs experience</span>
            <span class="tm-meta-item">📍 ${(c.preferredLocations || []).slice(0, 2).join(', ') || 'India'}</span>
            <span class="tm-meta-item">💼 ${(c.preferredModes || []).join(' / ') || 'Flexible'}</span>
            <span class="tm-meta-category" style="color: #a1d8c0; font-size: 12rem; font-weight: 600;">• ${escapeHtml(category)}</span>
          </div>
        </div>

        <div class="tm-skills-block">
          <div class="tm-skills-label">Candidate Skill Alignment:</div>
          <div class="tm-chips-wrap">
            ${matchedChips || '<span style="color: #888; font-size: 12rem;">General engineering candidate</span>'}
            ${missingChips}
          </div>
        </div>

        <div class="tm-explain-reasons">
          ${(c.reasons || []).slice(0, 3).map(r => `<div class="tm-reason-line">• ${escapeHtml(r)}</div>`).join('')}
        </div>

        <div style="margin-top: 10rem; margin-bottom: 14rem;">
          <button type="button" class="tm-btn-factors-toggle" data-action="cand-breakdown" data-cand-id="${escapeHtml(c.candidateId)}" style="background: none; border: none; color: #38bdf8; font-size: 12rem; cursor: pointer; text-decoration: underline; padding: 0;">
            🔍 View 6-Factor Compatibility Breakdown
          </button>
        </div>

        <div class="tm-card-footer">
          <button type="button" class="tm-btn-save ${c.isShortlisted ? 'saved' : ''}" data-action="shortlist" data-cand-id="${escapeHtml(c.candidateId)}" data-job-id="${escapeHtml(selectedJobId)}">
            ${c.isShortlisted ? '⭐ Shortlisted' : '☆ Shortlist Candidate'}
          </button>
          <div class="tm-footer-actions">
            <button type="button" class="tm-btn-apply" data-action="view-cand" data-cand-id="${escapeHtml(c.candidateId)}">View Full Profile</button>
          </div>
        </div>
      </div>
    `;
  }

  function attachRecruiterCardListeners(container) {
    container.querySelectorAll('[data-action="shortlist"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const candidateId = btn.dataset.candId;
        const jobId = btn.dataset.jobId;
        const token = getToken();

        try {
          const res = await fetch('/api/matching/shortlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ candidateId, jobId })
          });
          const data = await res.json();
          if (data.success) {
            if (data.isShortlisted) {
              btn.classList.add('saved');
              btn.textContent = '⭐ Shortlisted';
              showToast('Candidate shortlisted for this opening!');
            } else {
              btn.classList.remove('saved');
              btn.textContent = '☆ Shortlist Candidate';
              showToast('Candidate removed from shortlist.');
            }
          }
        } catch (err) {
          showToast('Failed to update shortlist.', true);
        }
      });
    });

    // Recruiter factor breakdown
    container.querySelectorAll('[data-action="cand-breakdown"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const candId = btn.dataset.candId;
        const match = recruiterMatches.find(c => c.candidateId === candId);
        if (match) {
          openFactorBreakdownModal(match, match.name);
        }
      });
    });

    container.querySelectorAll('[data-action="view-cand"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const candId = btn.dataset.candId;
        const cand = recruiterMatches.find(c => c.candidateId === candId);
        if (!cand) return;

        openCandidateDetailModal(cand);
      });
    });
  }

  function openCandidateDetailModal(cand) {
    let overlay = document.getElementById('tm-candidate-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'tm-candidate-modal';
      overlay.className = 'hc-modal-overlay';
      document.body.appendChild(overlay);
    }

    const skillsHtml = (cand.skills || []).map(s => {
      const name = typeof s === 'string' ? s : s.name;
      return `<span class="hc-tag" style="background: rgba(255,255,255,0.08); padding: 4rem 10rem; border-radius: 6rem; font-size: 12rem; color: #fff;">${escapeHtml(name)}</span>`;
    }).join('');

    overlay.innerHTML = `
      <div class="hc-modal-box" style="max-width: 640rem;">
        <div class="hc-modal-header">
          <div>
            <h3 style="margin: 0; font-size: 20rem; color: #fff;">${escapeHtml(cand.name)}</h3>
            <p style="margin: 4rem 0 0; font-size: 14rem; color: #a1d8c0;">${escapeHtml(cand.headline)}</p>
          </div>
          <button type="button" class="hc-modal-close" id="tm-cand-modal-close">&times;</button>
        </div>
        <div class="hc-modal-body" style="max-height: 70vh; overflow-y: auto;">
          <div style="background: rgba(255,255,255,0.03); border-radius: 10rem; padding: 14rem 18rem; margin-bottom: 16rem;">
            <div style="font-size: 13rem; color: #888; margin-bottom: 6rem;">Match Score with Selected Job:</div>
            <div style="font-size: 22rem; font-weight: 700; color: #a1d8c0;">${cand.matchScore || cand.score}% Alignment (${escapeHtml(cand.category || 'Score')})</div>
          </div>

          <div style="margin-bottom: 16rem;">
            <h4 style="font-size: 14rem; color: #fff; margin-bottom: 8rem;">Professional Summary</h4>
            <p style="font-size: 13rem; color: #bbb; line-height: 1.5;">${escapeHtml(cand.summary || 'Verified engineer profile on HireConnect.')}</p>
          </div>

          <div style="margin-bottom: 16rem;">
            <h4 style="font-size: 14rem; color: #fff; margin-bottom: 8rem;">Primary Skills</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 6rem;">${skillsHtml || '<span style="color:#888;">Not listed</span>'}</div>
          </div>

          <div style="margin-bottom: 16rem;">
            <h4 style="font-size: 14rem; color: #fff; margin-bottom: 8rem;">Career Preferences</h4>
            <p style="font-size: 13rem; color: #aaa;">
              <strong>Locations:</strong> ${(cand.preferredLocations || []).join(', ') || 'Open'}<br>
              <strong>Work Modes:</strong> ${(cand.preferredModes || []).join(', ') || 'Flexible'}
            </p>
          </div>

          ${cand.contactProtected ? `
            <div style="background: rgba(255, 128, 181, 0.08); border: 1px solid rgba(255, 128, 181, 0.2); border-radius: 8rem; padding: 12rem; font-size: 12rem; color: #ff80b5;">
              🔒 Direct contact info and resume are protected by candidate privacy settings. Shortlist this candidate to request direct contact access.
            </div>
          ` : ''}

          <div style="margin-top: 20rem; text-align: right;">
            <button type="button" class="hc-submit-btn" id="tm-cand-modal-done" style="width: auto; padding: 10rem 24rem;">Close Profile</button>
          </div>
        </div>
      </div>
    `;

    overlay.style.display = 'flex';
    const closeBtn = overlay.querySelector('#tm-cand-modal-close');
    const doneBtn = overlay.querySelector('#tm-cand-modal-done');
    if (closeBtn) closeBtn.addEventListener('click', () => overlay.style.display = 'none');
    if (doneBtn) doneBtn.addEventListener('click', () => overlay.style.display = 'none');
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.style.display = 'none';
    });
  }

  // Self Initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTalentMatch);
  } else {
    initTalentMatch();
  }
})();
