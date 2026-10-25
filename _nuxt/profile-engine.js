/**
 * HireConnect Profile Engine
 * Comprehensive Profile Manager for Job Seekers and Recruiters
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

  function showToast(message, isError = false) {
    if (window.HireConnectAuth && window.HireConnectAuth.showToast) {
      window.HireConnectAuth.showToast(message, isError);
      return;
    }
    alert(message);
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

  function getInitials(name) {
    if (!name) return 'HC';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  async function initProfile() {
    const container = document.getElementById('hc-profile-app');
    if (!container) return;

    const token = getToken();
    if (!token) {
      renderUnauthenticated(container);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) {
        renderUnauthenticated(container);
        return;
      }
      const data = await res.json();
      const user = data.user;
      const profile = data.profile || {};
      const company = data.company || null;

      if (user.role === 'recruiter') {
        await renderRecruiterProfile(container, user, profile, company);
      } else {
        await renderCandidateProfile(container, user, profile);
      }
    } catch (e) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40rem; color: #ff8888;">
          Failed to load profile. Please verify your connection or sign in again.
        </div>
      `;
    }
  }

  function renderUnauthenticated(container) {
    container.innerHTML = `
      <div class="hc-content-card" style="text-align: center; padding: 60rem 20rem; max-width: 600rem; margin: 40rem auto;">
        <div style="font-size: 40rem; margin-bottom: 16rem;">🔒</div>
        <h2 style="font-size: 24rem; color: #fff; margin: 0 0 8rem;">Sign In Required</h2>
        <p style="font-size: 14rem; color: #999; margin: 0 0 24rem;">Please sign in to view and manage your HireConnect profile and preferences.</p>
        <div style="display: flex; gap: 12rem; justify-content: center;">
          <a href="/about/" class="hc-btn-primary" style="text-decoration: none;">Sign In</a>
          <a href="/signup/" class="hc-btn-secondary" style="text-decoration: none;">Create Account</a>
        </div>
      </div>
    `;
  }

  // ==================== CANDIDATE PROFILE ====================
  async function renderCandidateProfile(container, user, profile) {
    const p = profile;
    const completion = p.completionPercentage || 85;
    const initials = getInitials(user.name);

    let stats = {
      totalApplicationsSubmitted: 0,
      awaitingReview: 0,
      shortlisted: 0,
      interviewStage: 0,
      offersReceived: 0,
      upcomingInterviewsCount: 0,
      savedJobsCount: 0
    };
    try {
      const statsRes = await fetch('/api/candidate/analytics/overview', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success && statsData.data) {
          stats = statsData.data;
        }
      }
    } catch (err) {
      // Graceful fallback to zero stats
    }

    container.innerHTML = `
      <!-- HERO -->
      <div class="hc-hero-card">
        <div class="hc-hero-left">
          <div class="hc-hero-avatar candidate" id="hc-cand-avatar-wrap">
            ${p.avatarUrl ? `<img src="${escapeHtml(p.avatarUrl)}" alt="${escapeHtml(user.name)}" />` : initials}
          </div>
          <div class="hc-hero-details">
            <h1>${escapeHtml(user.name)}</h1>
            <div class="hc-hero-headline">${escapeHtml(p.headline || 'Software Engineer')}</div>
            <div class="hc-hero-badges">
              <span class="hc-role-tag candidate">Job Seeker / Candidate</span>
              <span style="font-size: 12rem; color: #888;">📍 ${escapeHtml(p.location || 'Bengaluru, India')}</span>
              <span style="font-size: 12rem; color: #888;">✉️ ${escapeHtml(user.email)}</span>
            </div>
          </div>
        </div>
        <div class="hc-hero-right">
          <div class="hc-cb-header" style="width: 220rem; margin-bottom: 4rem;">
            <span style="font-size: 12rem; color: #888;">Profile Strength</span>
            <strong style="color: var(--hc-mint); font-family: var(--hc-font-mono); font-size: 13rem;">${completion}% Complete</strong>
          </div>
          <div class="hc-cb-track" style="width: 220rem; height: 6rem; background: rgba(255,255,255,0.1); border-radius: 9999px; overflow: hidden;">
            <div style="height: 100%; width: ${completion}%; background: linear-gradient(90deg, #a1d8c0, #7ee787); border-radius: 9999px;"></div>
          </div>
          <button type="button" class="hc-btn-primary" id="hc-save-profile-top" style="margin-top: 8rem;">Save All Changes</button>
        </div>
      </div>

      <!-- CANDIDATE REAL-TIME ACTIVITY METRICS -->
      <div class="hc-metrics-grid" style="margin-bottom: 24rem;">
        <div class="hc-metric-card">
          <div class="hc-metric-val mint">${stats.totalApplicationsSubmitted}</div>
          <div class="hc-metric-label">Applications Submitted</div>
        </div>
        <div class="hc-metric-card">
          <div class="hc-metric-val purple">${stats.awaitingReview}</div>
          <div class="hc-metric-label">Awaiting Review</div>
        </div>
        <div class="hc-metric-card">
          <div class="hc-metric-val" style="color: #60a5fa;">${stats.shortlisted + stats.interviewStage}</div>
          <div class="hc-metric-label">Shortlisted / Interviews</div>
        </div>
        <div class="hc-metric-card">
          <div class="hc-metric-val" style="color: #fbbf24;">${stats.upcomingInterviewsCount}</div>
          <div class="hc-metric-label">Upcoming Interviews</div>
        </div>
      </div>

      <!-- MAIN TABS -->
      <div class="hc-content-card">
        <div class="hc-page-tabs" role="tablist">
          <button type="button" class="hc-page-tab active" data-tab="tab-personal">Personal Details</button>
          <button type="button" class="hc-page-tab" data-tab="tab-skills">Skills &amp; Expertise</button>
          <button type="button" class="hc-page-tab" data-tab="tab-experience">Work Experience</button>
          <button type="button" class="hc-page-tab" data-tab="tab-education">Education &amp; Grades</button>
          <button type="button" class="hc-page-tab" data-tab="tab-projects">Projects &amp; Demos</button>
          <button type="button" class="hc-page-tab" data-tab="tab-certifications">Certifications</button>
          <button type="button" class="hc-page-tab" data-tab="tab-preferences">Career Preferences</button>
          <button type="button" class="hc-page-tab" data-tab="tab-resume">Resume Management</button>
          <button type="button" class="hc-page-tab" data-tab="tab-privacy">Recruiter Privacy</button>
        </div>

        <!-- TAB 1: PERSONAL -->
        <div class="hc-tab-pane" id="tab-personal">
          <div class="hc-form-grid">
            <div class="hc-form-group">
              <label class="hc-form-label">Full Name</label>
              <input type="text" class="hc-form-input" id="hc-cand-name" value="${escapeHtml(p.name || user.name)}">
            </div>
            <div class="hc-form-group">
              <label class="hc-form-label">Professional Headline</label>
              <input type="text" class="hc-form-input" id="hc-cand-headline" value="${escapeHtml(p.headline || '')}" placeholder="e.g. Senior Frontend Engineer | React • Next.js • TypeScript">
            </div>
            <div class="hc-form-group">
              <label class="hc-form-label">Location (City, State)</label>
              <input type="text" class="hc-form-input" id="hc-cand-loc" value="${escapeHtml(p.location || 'Bengaluru, Karnataka')}">
            </div>
            <div class="hc-form-group">
              <label class="hc-form-label">Phone Number</label>
              <input type="tel" class="hc-form-input" id="hc-cand-phone" value="${escapeHtml(p.phone || '+91 98765 43210')}">
            </div>
            <div class="hc-form-group">
              <label class="hc-form-label">Contact Email</label>
              <input type="email" class="hc-form-input" id="hc-cand-contact-email" value="${escapeHtml(p.contactEmail || user.email)}">
            </div>
            <div class="hc-form-group">
              <label class="hc-form-label">Profile Photo URL</label>
              <input type="url" class="hc-form-input" id="hc-cand-avatar" value="${escapeHtml(p.avatarUrl || '')}" placeholder="https://images.prismic.io/... or https://...">
            </div>
          </div>
          <div class="hc-form-group" style="margin-top: 16rem;">
            <label class="hc-form-label">Professional Summary</label>
            <textarea class="hc-form-textarea" id="hc-cand-summary" rows="4" placeholder="Highlight your technical strengths, scalable systems experience, and core contributions...">${escapeHtml(p.summary || '')}</textarea>
          </div>
        </div>

        <!-- TAB 2: SKILLS -->
        <div class="hc-tab-pane" id="tab-skills" style="display:none;">
          <div style="display: flex; gap: 8rem; margin-bottom: 20rem; flex-wrap: wrap;">
            <input type="text" class="hc-form-input" id="hc-skill-input" placeholder="Skill name (e.g. React, Kafka, Docker)" style="flex: 2; min-width: 180rem;">
            <select class="hc-form-select" id="hc-skill-level" style="flex: 1; min-width: 130rem;">
              <option value="Expert">Expert</option>
              <option value="Advanced" selected>Advanced</option>
              <option value="Intermediate">Intermediate</option>
            </select>
            <button type="button" class="hc-btn-primary" id="hc-add-skill-btn">+ Add Skill</button>
          </div>
          <div id="hc-skills-box" style="display: flex; flex-wrap: wrap; gap: 8rem;"></div>
        </div>

        <!-- TAB 3: WORK EXPERIENCE -->
        <div class="hc-tab-pane" id="tab-experience" style="display:none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rem;">
            <h3 style="margin: 0; font-size: 16rem; color: #fff;">Work Experience &amp; Internships</h3>
            <button type="button" class="hc-btn-secondary" id="hc-add-exp-btn">+ Add Position</button>
          </div>
          <div id="hc-exp-container"></div>
        </div>

        <!-- TAB 4: EDUCATION -->
        <div class="hc-tab-pane" id="tab-education" style="display:none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rem;">
            <h3 style="margin: 0; font-size: 16rem; color: #fff;">Education &amp; Academic Credentials</h3>
            <button type="button" class="hc-btn-secondary" id="hc-add-edu-btn">+ Add Degree</button>
          </div>
          <div id="hc-edu-container"></div>
        </div>

        <!-- TAB 5: PROJECTS & DEMOS -->
        <div class="hc-tab-pane" id="tab-projects" style="display:none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rem;">
            <h3 style="margin: 0; font-size: 16rem; color: #fff;">Projects, GitHub Links &amp; Live Demos</h3>
            <button type="button" class="hc-btn-secondary" id="hc-add-proj-btn">+ Add Project</button>
          </div>
          <div id="hc-proj-container"></div>
        </div>

        <!-- TAB 6: CERTIFICATIONS -->
        <div class="hc-tab-pane" id="tab-certifications" style="display:none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rem;">
            <h3 style="margin: 0; font-size: 16rem; color: #fff;">Certifications &amp; Achievements</h3>
            <button type="button" class="hc-btn-secondary" id="hc-add-cert-btn">+ Add Certificate</button>
          </div>
          <div id="hc-cert-container"></div>
        </div>

        <!-- TAB 7: CAREER PREFERENCES -->
        <div class="hc-tab-pane" id="tab-preferences" style="display:none;">
          <div class="hc-form-grid">
            <div class="hc-form-group">
              <label class="hc-form-label">Desired Job Titles</label>
              <input type="text" class="hc-form-input" id="hc-cand-desired-titles" value="${escapeHtml(Array.isArray(p.desiredTitles) ? p.desiredTitles.join(', ') : (p.desiredTitles || ''))}" placeholder="e.g. Senior Frontend Engineer, Full Stack Tech Lead">
            </div>
            <div class="hc-form-group">
              <label class="hc-form-label">Expected Salary (CTC)</label>
              <input type="text" class="hc-form-input" id="hc-cand-salary" value="${escapeHtml(p.expectedSalary || '₹32–45 LPA')}" placeholder="e.g. ₹32–45 LPA">
            </div>
            <div class="hc-form-group">
              <label class="hc-form-label">Notice Period</label>
              <select class="hc-form-select" id="hc-cand-notice">
                <option value="Immediate" ${p.noticePeriod === 'Immediate' ? 'selected' : ''}>Immediate (0 Days)</option>
                <option value="15 Days" ${p.noticePeriod === '15 Days' ? 'selected' : ''}>15 Days</option>
                <option value="30 Days" ${p.noticePeriod === '30 Days' ? 'selected' : ''}>30 Days</option>
                <option value="60 Days" ${p.noticePeriod === '60 Days' ? 'selected' : ''}>60 Days</option>
                <option value="90 Days" ${p.noticePeriod === '90 Days' ? 'selected' : ''}>90 Days</option>
              </select>
            </div>
            <div class="hc-form-group">
              <label class="hc-form-label">Preferred Locations</label>
              <input type="text" class="hc-form-input" id="hc-cand-pref-locs" value="${escapeHtml(Array.isArray(p.preferredLocations) ? p.preferredLocations.join(', ') : (p.preferredLocations || 'Bengaluru, Remote'))}" placeholder="e.g. Bengaluru, Hyderabad, Remote">
            </div>
          </div>
        </div>

        <!-- TAB 8: RESUME MANAGEMENT -->
        <div class="hc-tab-pane" id="tab-resume" style="display:none;">
          <div id="hc-resume-box" style="margin-bottom: 24rem;">
            ${p.resume ? `
              <div style="background: rgba(161,216,192,0.06); border: 1px solid rgba(161,216,192,0.25); border-radius: 14rem; padding: 20rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14rem;">
                <div style="display: flex; align-items: center; gap: 14rem;">
                  <div style="width: 48rem; height: 48rem; border-radius: 12rem; background: rgba(161,216,192,0.15); display: flex; align-items: center; justify-content: center; color: var(--hc-mint); font-size: 24rem;">
                    📄
                  </div>
                  <div>
                    <div style="font-size: 15rem; font-weight: 600; color: #fff;">${escapeHtml(p.resume.fileName || 'Resume.pdf')}</div>
                    <div style="font-size: 12rem; color: var(--hc-text-secondary); margin-top: 2rem;">Official Verified Document • ${(p.resume.fileSize ? Math.round(p.resume.fileSize / 1024) + ' KB' : 'PDF')}</div>
                  </div>
                </div>
                <div style="display: flex; gap: 10rem;">
                  <a href="${p.resume.fileUrl || '/api/profile/resume/download/' + p.userId}" class="hc-btn-secondary" style="text-decoration: none;" download>Download Resume</a>
                  <button type="button" class="hc-btn-secondary" id="hc-delete-resume-btn" style="color: #ff8888; border-color: rgba(255,100,100,0.3);">Delete</button>
                </div>
              </div>
            ` : `
              <div style="text-align: center; padding: 32rem; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.14); border-radius: 14rem;">
                <p style="color: #fff; font-size: 15rem; margin-bottom: 6rem;">No Resume Attached</p>
                <p style="color: #888; font-size: 12rem;">Upload your resume in PDF or DOCX format (Max 5MB) for direct applications.</p>
              </div>
            `}
          </div>

          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14rem; padding: 20rem;">
            <h4 style="margin: 0 0 6rem; color: #fff; font-size: 15rem;">Upload or Replace Resume Document</h4>
            <p style="font-size: 12rem; color: var(--hc-text-secondary); margin-bottom: 16rem;">Supported file formats: PDF or DOCX. Maximum file size: 5MB.</p>
            <input type="file" id="hc-resume-file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style="display:none;">
            <button type="button" class="hc-btn-secondary" id="hc-trigger-upload-btn" style="width: 100%; justify-content: center; padding: 14rem;">
              📁 Select Resume File from Computer
            </button>
            <div id="hc-upload-msg" style="margin-top: 10rem; font-size: 12rem; text-align: center; color: var(--hc-mint);"></div>
          </div>
        </div>

        <!-- TAB 9: RECRUITER PRIVACY -->
        <div class="hc-tab-pane" id="tab-privacy" style="display:none;">
          <div class="hc-privacy-card">
            <div class="hc-privacy-info">
              <h4>Make Profile Discoverable to Verified Recruiters</h4>
              <p>Allow authorized hiring teams searching by technical skills to find your profile. <strong>By default, profiles are strictly private.</strong></p>
            </div>
            <label class="hc-switch">
              <input type="checkbox" id="hc-cand-discoverable" ${p.privacy && p.privacy.isDiscoverable ? 'checked' : ''}>
              <span class="hc-slider"></span>
            </label>
          </div>

          <div class="hc-privacy-card">
            <div class="hc-privacy-info">
              <h4>Allow Verified Employers to Download Resume</h4>
              <p>Permit authenticated companies reviewing your applications or discovery card to download your uploaded resume.</p>
            </div>
            <label class="hc-switch">
              <input type="checkbox" id="hc-cand-allow-resume" ${p.privacy && p.privacy.allowResumeDownload ? 'checked' : ''}>
              <span class="hc-slider"></span>
            </label>
          </div>

          <div class="hc-privacy-card">
            <div class="hc-privacy-info">
              <h4>Hide Direct Phone &amp; Email</h4>
              <p>Mask your direct contact phone and email until an interview request is confirmed.</p>
            </div>
            <label class="hc-switch">
              <input type="checkbox" id="hc-cand-hide-contact" ${p.privacy && p.privacy.hideContactInfo ? 'checked' : ''}>
              <span class="hc-slider"></span>
            </label>
          </div>
        </div>

        <!-- FOOTER SAVE BAR -->
        <div style="margin-top: 32rem; padding-top: 20rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: flex-end; gap: 12rem;">
          <button type="button" class="hc-btn-primary" id="hc-save-profile-btn">Save Profile Changes</button>
        </div>
      </div>
    `;

    // Tab switching
    const tabs = container.querySelectorAll('.hc-page-tab');
    const panes = container.querySelectorAll('.hc-tab-pane');
    tabs.forEach(t => {
      t.addEventListener('click', () => {
        tabs.forEach(x => x.classList.remove('active'));
        panes.forEach(p => p.style.display = 'none');
        t.classList.add('active');
        const target = container.querySelector('#' + t.dataset.tab);
        if (target) target.style.display = 'block';
      });
    });

    // Check query param for default tab
    const urlTab = new URLSearchParams(window.location.search).get('tab');
    if (urlTab) {
      const matchTab = container.querySelector(`[data-tab="tab-${urlTab}"]`);
      if (matchTab) matchTab.click();
    }

    // Skills handling
    let skills = p.skills || [{ name: 'React', level: 'Expert' }];
    const skillsBox = container.querySelector('#hc-skills-box');
    const skillInput = container.querySelector('#hc-skill-input');
    const skillLevel = container.querySelector('#hc-skill-level');
    const addSkillBtn = container.querySelector('#hc-add-skill-btn');

    function renderSkillsList() {
      skillsBox.innerHTML = skills.map((s, idx) => `
        <div class="hc-skill-pill" style="display: inline-flex; align-items: center; gap: 6rem; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 9999px; padding: 6rem 14rem; font-size: 13rem; color: #f7f5f2;">
          <span>${escapeHtml(s.name)}</span>
          <span style="font-size: 10rem; font-family: var(--hc-font-mono); color: var(--hc-mint); background: rgba(161,216,192,0.12); padding: 2rem 6rem; border-radius: 4rem;">${escapeHtml(s.level)}</span>
          <button type="button" class="hc-del-skill" data-idx="${idx}" style="background: none; border: none; color: #888; cursor: pointer; font-size: 14rem; line-height: 1;">&times;</button>
        </div>
      `).join('');
      skillsBox.querySelectorAll('.hc-del-skill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.target.dataset.idx, 10);
          skills.splice(idx, 1);
          renderSkillsList();
        });
      });
    }
    renderSkillsList();

    addSkillBtn.addEventListener('click', () => {
      const name = skillInput.value.trim();
      if (!name) return;
      skills.push({ name, level: skillLevel.value });
      skillInput.value = '';
      renderSkillsList();
    });

    // Work Experience handling
    let experience = p.experience || [];
    const expContainer = container.querySelector('#hc-exp-container');
    const addExpBtn = container.querySelector('#hc-add-exp-btn');

    function renderExpList() {
      if (experience.length === 0) {
        expContainer.innerHTML = '<p style="color: #777; font-size: 13rem;">No positions recorded. Click "+ Add Position" to list your work history.</p>';
        return;
      }
      expContainer.innerHTML = experience.map((exp, idx) => `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12rem; padding: 16rem; margin-bottom: 12rem; position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <strong style="color: #fff; font-size: 15rem;">${escapeHtml(exp.title)}</strong>
              <div style="color: var(--hc-mint); font-size: 13rem; margin-top: 2rem;">${escapeHtml(exp.company)} • ${escapeHtml(exp.location || 'India')}</div>
              <div style="font-size: 11rem; font-family: var(--hc-font-mono); color: #888; margin: 4rem 0 8rem;">${escapeHtml(exp.startDate || '')} — ${exp.current ? 'Present' : escapeHtml(exp.endDate || '')}</div>
              <div style="font-size: 13rem; color: #bbb; line-height: 1.4;">${escapeHtml(exp.description || '')}</div>
            </div>
            <button type="button" class="hc-del-exp" data-idx="${idx}" style="background: none; border: none; color: #ff7777; cursor: pointer; font-size: 12rem;">Remove</button>
          </div>
        </div>
      `).join('');
      expContainer.querySelectorAll('.hc-del-exp').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.target.dataset.idx, 10);
          experience.splice(idx, 1);
          renderExpList();
        });
      });
    }
    renderExpList();

    addExpBtn.addEventListener('click', () => {
      const title = prompt('Job Title (e.g. Senior Frontend Engineer):');
      if (!title) return;
      const company = prompt('Company Name (e.g. Razorpay):');
      if (!company) return;
      const dates = prompt('Dates (e.g. Jan 2022 — Present):', '2023 — Present');
      experience.push({ title, company, startDate: dates, current: true, description: 'Built production features and high-throughput web components.' });
      renderExpList();
    });

    // Education handling
    let education = p.education || [];
    const eduContainer = container.querySelector('#hc-edu-container');
    const addEduBtn = container.querySelector('#hc-add-edu-btn');

    function renderEduList() {
      if (education.length === 0) {
        eduContainer.innerHTML = '<p style="color: #777; font-size: 13rem;">No education entries recorded yet. Click "+ Add Degree" to add qualifications.</p>';
        return;
      }
      eduContainer.innerHTML = education.map((edu, idx) => `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12rem; padding: 16rem; margin-bottom: 12rem; display: flex; justify-content: space-between;">
          <div>
            <strong style="color: #fff; font-size: 15rem;">${escapeHtml(edu.degree)}</strong>
            <div style="color: var(--hc-mint); font-size: 13rem; margin-top: 2rem;">${escapeHtml(edu.institution)}</div>
            <div style="font-size: 12rem; color: #888; font-family: var(--hc-font-mono); margin-top: 4rem;">Graduated: ${escapeHtml(edu.year || '2022')} • Grade / CGPA: ${escapeHtml(edu.grade || '8.8 / 10')}</div>
          </div>
          <button type="button" class="hc-del-edu" data-idx="${idx}" style="background: none; border: none; color: #ff7777; cursor: pointer; font-size: 12rem;">Remove</button>
        </div>
      `).join('');
      eduContainer.querySelectorAll('.hc-del-edu').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.target.dataset.idx, 10);
          education.splice(idx, 1);
          renderEduList();
        });
      });
    }
    renderEduList();

    addEduBtn.addEventListener('click', () => {
      const degree = prompt('Degree or Course (e.g. B.Tech Computer Science):');
      if (!degree) return;
      const institution = prompt('College / University:');
      if (!institution) return;
      const year = prompt('Graduation Year:', '2023');
      const grade = prompt('Grade / CGPA:', '8.5 / 10');
      education.push({ degree, institution, year, grade });
      renderEduList();
    });

    // Projects handling
    let projects = p.projects || [];
    const projContainer = container.querySelector('#hc-proj-container');
    const addProjBtn = container.querySelector('#hc-add-proj-btn');

    function renderProjList() {
      if (projects.length === 0) {
        projContainer.innerHTML = '<p style="color: #777; font-size: 13rem;">No projects added yet. Click "+ Add Project" to showcase GitHub repositories and live demos.</p>';
        return;
      }
      projContainer.innerHTML = projects.map((prj, idx) => `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12rem; padding: 16rem; margin-bottom: 12rem; display: flex; justify-content: space-between;">
          <div>
            <strong style="color: #fff; font-size: 15rem;">${escapeHtml(prj.title)}</strong>
            <div style="font-size: 13rem; color: #ccc; margin: 4rem 0 8rem;">${escapeHtml(prj.description || '')}</div>
            <div style="display: flex; gap: 12rem; font-size: 12rem;">
              ${prj.githubUrl ? `<a href="${escapeHtml(prj.githubUrl)}" target="_blank" style="color: var(--hc-mint); text-decoration: underline;">GitHub Repository</a>` : ''}
              ${prj.liveUrl ? `<a href="${escapeHtml(prj.liveUrl)}" target="_blank" style="color: var(--hc-purple); text-decoration: underline;">Live Demo</a>` : ''}
            </div>
          </div>
          <button type="button" class="hc-del-proj" data-idx="${idx}" style="background: none; border: none; color: #ff7777; cursor: pointer; font-size: 12rem;">Remove</button>
        </div>
      `).join('');
      projContainer.querySelectorAll('.hc-del-proj').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.target.dataset.idx, 10);
          projects.splice(idx, 1);
          renderProjList();
        });
      });
    }
    renderProjList();

    addProjBtn.addEventListener('click', () => {
      const title = prompt('Project Title:');
      if (!title) return;
      const desc = prompt('Short Description:');
      const gh = prompt('GitHub URL:', 'https://github.com/...');
      const live = prompt('Live Demo URL (optional):', '');
      projects.push({ title, description: desc, githubUrl: gh, liveUrl: live });
      renderProjList();
    });

    // Certifications handling
    let certs = p.certifications || [];
    const certContainer = container.querySelector('#hc-cert-container');
    const addCertBtn = container.querySelector('#hc-add-cert-btn');

    function renderCertList() {
      if (certs.length === 0) {
        certContainer.innerHTML = '<p style="color: #777; font-size: 13rem;">No certifications added yet. Click "+ Add Certificate" to list your achievements.</p>';
        return;
      }
      certContainer.innerHTML = certs.map((c, idx) => `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12rem; padding: 16rem; margin-bottom: 12rem; display: flex; justify-content: space-between;">
          <div>
            <strong style="color: #fff; font-size: 15rem;">${escapeHtml(c.name)}</strong>
            <div style="color: var(--hc-mint); font-size: 13rem; margin-top: 2rem;">${escapeHtml(c.issuer || 'Issuing Organization')} • Issued: ${escapeHtml(c.date || '2023')}</div>
            ${c.credentialId ? `<div style="font-size: 11rem; font-family: var(--hc-font-mono); color: #888;">ID: ${escapeHtml(c.credentialId)}</div>` : ''}
          </div>
          <button type="button" class="hc-del-cert" data-idx="${idx}" style="background: none; border: none; color: #ff7777; cursor: pointer; font-size: 12rem;">Remove</button>
        </div>
      `).join('');
      certContainer.querySelectorAll('.hc-del-cert').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.target.dataset.idx, 10);
          certs.splice(idx, 1);
          renderCertList();
        });
      });
    }
    renderCertList();

    addCertBtn.addEventListener('click', () => {
      const name = prompt('Certificate Name (e.g. AWS Certified Solutions Architect):');
      if (!name) return;
      const issuer = prompt('Issuing Body (e.g. Amazon Web Services):');
      const date = prompt('Issue Date (e.g. Oct 2023):');
      certs.push({ name, issuer, date });
      renderCertList();
    });

    // Resume file upload
    const resumeFileInput = container.querySelector('#hc-resume-file');
    const triggerUploadBtn = container.querySelector('#hc-trigger-upload-btn');
    const uploadMsg = container.querySelector('#hc-upload-msg');
    const deleteResumeBtn = container.querySelector('#hc-delete-resume-btn');

    if (triggerUploadBtn) {
      triggerUploadBtn.addEventListener('click', () => resumeFileInput.click());
    }

    if (resumeFileInput) {
      resumeFileInput.addEventListener('change', async () => {
        const file = resumeFileInput.files[0];
        if (!file) return;

        const validExts = ['.pdf', '.docx'];
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        if (!validExts.includes(fileExt)) {
          showToast('Please upload a PDF or DOCX file only.', true);
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          showToast('File size exceeds 5MB limit.', true);
          return;
        }

        uploadMsg.textContent = 'Uploading ' + file.name + '...';

        try {
          const res = await fetch('/api/profile/resume/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type || 'application/pdf',
              fileSize: file.size,
              contentText: `${user.name} - Official Resume (${file.name})`
            })
          });
          const resData = await res.json();
          if (resData.success) {
            showToast('Resume uploaded and verified successfully!');
            setTimeout(() => window.location.reload(), 600);
          } else {
            uploadMsg.textContent = resData.message || 'Upload failed.';
            showToast(resData.message || 'Upload failed.', true);
          }
        } catch (e) {
          uploadMsg.textContent = 'Network error during upload.';
        }
      });
    }

    if (deleteResumeBtn) {
      deleteResumeBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete your current resume?')) return;
        try {
          const res = await fetch('/api/profile/resume', {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + getToken() }
          });
          if (res.ok) {
            showToast('Resume deleted.');
            setTimeout(() => window.location.reload(), 500);
          }
        } catch (e) {
          showToast('Failed to delete resume.', true);
        }
      });
    }

    // Save profile handler
    async function saveProfile() {
      const saveBtn = container.querySelector('#hc-save-profile-btn');
      const topBtn = container.querySelector('#hc-save-profile-top');
      if (saveBtn) saveBtn.textContent = 'Saving...';
      if (topBtn) topBtn.textContent = 'Saving...';

      const desiredTitles = container.querySelector('#hc-cand-desired-titles').value.split(',').map(s => s.trim()).filter(Boolean);
      const preferredLocations = container.querySelector('#hc-cand-pref-locs').value.split(',').map(s => s.trim()).filter(Boolean);

      const payload = {
        name: container.querySelector('#hc-cand-name').value.trim(),
        headline: container.querySelector('#hc-cand-headline').value.trim(),
        location: container.querySelector('#hc-cand-loc').value.trim(),
        phone: container.querySelector('#hc-cand-phone').value.trim(),
        contactEmail: container.querySelector('#hc-cand-contact-email').value.trim(),
        avatarUrl: container.querySelector('#hc-cand-avatar').value.trim(),
        summary: container.querySelector('#hc-cand-summary').value.trim(),
        expectedSalary: container.querySelector('#hc-cand-salary').value.trim(),
        noticePeriod: container.querySelector('#hc-cand-notice').value,
        desiredTitles,
        preferredLocations,
        skills,
        experience,
        education,
        projects,
        certifications: certs,
        privacy: {
          isDiscoverable: container.querySelector('#hc-cand-discoverable').checked,
          allowResumeDownload: container.querySelector('#hc-cand-allow-resume').checked,
          hideContactInfo: container.querySelector('#hc-cand-hide-contact').checked
        }
      };

      try {
        const resp = await fetch('/api/profile/candidate', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify(payload)
        });
        const resData = await resp.json();
        if (resData.success) {
          showToast('Profile updated successfully!');
          setTimeout(() => window.location.reload(), 600);
        } else {
          showToast(resData.message || 'Failed to save changes.', true);
        }
      } catch (e) {
        showToast('Network error saving profile.', true);
      } finally {
        if (saveBtn) saveBtn.textContent = 'Save Profile Changes';
        if (topBtn) topBtn.textContent = 'Save All Changes';
      }
    }

    const saveBtn = container.querySelector('#hc-save-profile-btn');
    const topBtn = container.querySelector('#hc-save-profile-top');
    if (saveBtn) saveBtn.addEventListener('click', saveProfile);
    if (topBtn) topBtn.addEventListener('click', saveProfile);
  }

  // ==================== RECRUITER PROFILE ====================
  async function renderRecruiterProfile(container, user, profile, company) {
    const p = profile;
    let activity = {
      totalJobsPosted: 0,
      activeJobsCount: 0,
      totalApplications: 0,
      interviewsScheduled: 0
    };

    try {
      const statsRes = await fetch('/api/recruiter/analytics/overview', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success && statsData.data && statsData.data.summary) {
          const s = statsData.data.summary;
          activity = {
            totalJobsPosted: s.jobsManaged,
            activeJobsCount: s.activeJobs,
            totalApplications: s.totalApplications,
            interviewsScheduled: s.upcomingInterviews
          };
        }
      }
    } catch (e) {
      // Fallback
    }

    const initials = getInitials(user.name);

    container.innerHTML = `
      <!-- RECRUITER HERO -->
      <div class="hc-hero-card recruiter">
        <div class="hc-hero-left">
          <div class="hc-hero-avatar recruiter">
            ${p.avatarUrl ? `<img src="${escapeHtml(p.avatarUrl)}" alt="${escapeHtml(user.name)}" />` : initials}
          </div>
          <div class="hc-hero-details">
            <h1>${escapeHtml(user.name)}</h1>
            <div class="hc-hero-headline" style="color: var(--hc-purple);">${escapeHtml(p.title || 'Technical Recruiter')} • <strong>${company ? escapeHtml(company.name) : 'Employer Partner'}</strong></div>
            <div class="hc-hero-badges">
              <span class="hc-role-tag recruiter">Recruiter / Employer</span>
              ${company && company.isVerified ? '<span style="font-size: 11rem; font-family: var(--hc-font-mono); color: var(--hc-mint); background: rgba(161,216,192,0.12); padding: 2rem 8rem; border-radius: 4rem;">✓ Verified Company</span>' : ''}
              <span style="font-size: 12rem; color: #888;">✉️ ${escapeHtml(user.email)}</span>
            </div>
          </div>
        </div>
        <div class="hc-hero-right" style="display: flex; gap: 8rem; flex-wrap: wrap; justify-content: flex-end;">
          <button type="button" id="hc-recruiter-csv-btn" class="hc-btn-secondary" style="font-size: 13rem; padding: 8rem 14rem;">📥 Export Jobs CSV</button>
          <a href="/approach/?tab=jobs" class="hc-btn-purple" style="text-decoration: none;">Manage Company Jobs</a>
        </div>
      </div>

      <!-- RECRUITER ACTIVITY METRICS -->
      <div class="hc-metrics-grid">
        <div class="hc-metric-card">
          <div class="hc-metric-val purple">${activity.totalJobsPosted}</div>
          <div class="hc-metric-label">Total Jobs Published</div>
        </div>
        <div class="hc-metric-card">
          <div class="hc-metric-val mint">${activity.activeJobsCount}</div>
          <div class="hc-metric-label">Live Active Openings</div>
        </div>
        <div class="hc-metric-card">
          <div class="hc-metric-val">${activity.totalApplications}</div>
          <div class="hc-metric-label">Direct Applications</div>
        </div>
        <div class="hc-metric-card">
          <div class="hc-metric-val mint">${activity.interviewsScheduled}</div>
          <div class="hc-metric-label">Interviews Scheduled</div>
        </div>
      </div>

      <!-- RECRUITER EDIT FORM -->
      <div class="hc-content-card">
        <h3 style="margin: 0 0 16rem; font-size: 18rem; color: #fff;">Professional Recruiter Profile</h3>
        <div class="hc-form-grid">
          <div class="hc-form-group">
            <label class="hc-form-label">Full Name</label>
            <input type="text" class="hc-form-input" id="hc-rec-name" value="${escapeHtml(p.name || user.name)}">
          </div>
          <div class="hc-form-group">
            <label class="hc-form-label">Job Title / Role</label>
            <input type="text" class="hc-form-input" id="hc-rec-title" value="${escapeHtml(p.title || 'Technical Recruiter')}" placeholder="e.g. Head of Talent, Senior Recruiter">
          </div>
          <div class="hc-form-group">
            <label class="hc-form-label">Contact Phone</label>
            <input type="tel" class="hc-form-input" id="hc-rec-phone" value="${escapeHtml(p.phone || '+91 98765 43210')}">
          </div>
          <div class="hc-form-group">
            <label class="hc-form-label">LinkedIn Profile URL</label>
            <input type="url" class="hc-form-input" id="hc-rec-linkedin" value="${escapeHtml(p.linkedin || '')}" placeholder="https://linkedin.com/in/...">
          </div>
          <div class="hc-form-group">
            <label class="hc-form-label">Associated Company</label>
            <input type="text" class="hc-form-input" value="${company ? escapeHtml(company.name) : 'Company'}" disabled style="opacity: 0.7;">
          </div>
          <div class="hc-form-group">
            <label class="hc-form-label">Avatar Photo URL</label>
            <input type="url" class="hc-form-input" id="hc-rec-avatar" value="${escapeHtml(p.avatarUrl || '')}" placeholder="https://...">
          </div>
        </div>

        <div class="hc-form-group" style="margin-top: 16rem;">
          <label class="hc-form-label">Recruiter Bio &amp; Hiring Philosophy</label>
          <textarea class="hc-form-textarea" id="hc-rec-bio" rows="3" placeholder="Share a few words on what your hiring teams value in exceptional engineering candidates...">${escapeHtml(p.bio || '')}</textarea>
        </div>

        <div style="margin-top: 24rem; padding-top: 20rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: flex-end; gap: 12rem;">
          <a href="/approach/?tab=candidates" class="hc-btn-secondary" style="text-decoration: none;">Candidate Discovery</a>
          <button type="button" class="hc-btn-purple" id="hc-save-recruiter-btn">Save Recruiter Profile</button>
        </div>
      </div>
    `;

    const saveBtn = container.querySelector('#hc-save-recruiter-btn');
    saveBtn.addEventListener('click', async () => {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      const payload = {
        name: container.querySelector('#hc-rec-name').value.trim(),
        title: container.querySelector('#hc-rec-title').value.trim(),
        phone: container.querySelector('#hc-rec-phone').value.trim(),
        linkedin: container.querySelector('#hc-rec-linkedin').value.trim(),
        avatarUrl: container.querySelector('#hc-rec-avatar').value.trim(),
        bio: container.querySelector('#hc-rec-bio').value.trim()
      };

      try {
        const resp = await fetch('/api/profile/recruiter', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify(payload)
        });
        const resData = await resp.json();
        if (resData.success) {
          showToast('Recruiter profile updated successfully!');
          setTimeout(() => window.location.reload(), 600);
        } else {
          showToast(resData.message || 'Failed to update recruiter profile.', true);
        }
      } catch (e) {
        showToast('Network error saving recruiter profile.', true);
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Recruiter Profile';
      }
    });

    const csvBtn = container.querySelector('#hc-recruiter-csv-btn');
    if (csvBtn) {
      csvBtn.addEventListener('click', async () => {
        csvBtn.disabled = true;
        csvBtn.textContent = 'Exporting...';
        try {
          const res = await fetch('/api/recruiter/analytics/jobs/export', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
          });
          if (!res.ok) throw new Error('Failed to export jobs report');
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `hireconnect_recruiter_jobs_${Date.now()}.csv`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          showToast('Job performance CSV exported successfully!');
        } catch (err) {
          showToast(err.message, true);
        } finally {
          csvBtn.disabled = false;
          csvBtn.textContent = '📥 Export Jobs CSV';
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfile);
  } else {
    initProfile();
  }
})();
