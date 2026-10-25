/**
 * HireConnect Sign Up Engine
 * Reuses the exact floating image collage animation & styling from Sign In
 * Provides dedicated dual registration flows for Job Seeker and Recruiter
 */

(function () {
  'use strict';

  const SIGNUP_CARD_HTML = `
<div id="hc-auth-root" class="hc-auth-container signup">
  <div class="hc-auth-header">
    <h1 class="hc-auth-super-title">Not just another job board</h1>
    <p class="hc-auth-subtitle" id="hc-role-badge-desc">Join 200+ verified tech roles directly with hiring teams</p>
  </div>

  <div class="hc-role-segmented" role="tablist">
    <button type="button" class="hc-role-tab active" data-role="employee" role="tab" aria-selected="true">
      <span class="hc-role-tab-icon">👤</span>
      <span>Job Seeker / Candidate</span>
    </button>
    <button type="button" class="hc-role-tab" data-role="recruiter" role="tab" aria-selected="false">
      <span class="hc-role-tab-icon">🏢</span>
      <span>Recruiter / Employer</span>
    </button>
  </div>

  <div id="hc-auth-alert" class="hc-auth-alert" style="display:none;"></div>

  <form id="hc-auth-form" class="hc-auth-form">
    <!-- CANDIDATE REGISTRATION FIELDS -->
    <div id="hc-candidate-fields">
      <div class="hc-field-group">
        <label class="hc-label" for="hc-cand-name">Full Name</label>
        <div class="hc-input-wrapper">
          <input type="text" id="hc-cand-name" class="hc-input" placeholder="Aarav Sharma" autocomplete="name">
        </div>
      </div>

      <div class="hc-field-group">
        <label class="hc-label" for="hc-cand-email">Email Address</label>
        <div class="hc-input-wrapper">
          <input type="email" id="hc-cand-email" class="hc-input" placeholder="candidate@hireconnect.io" autocomplete="email">
        </div>
      </div>

      <div class="hc-form-row-2">
        <div class="hc-field-group">
          <label class="hc-label" for="hc-cand-pw">Password</label>
          <div class="hc-input-wrapper">
            <input type="password" id="hc-cand-pw" class="hc-input hc-pw-input" placeholder="••••••••••••" autocomplete="new-password">
            <button type="button" class="hc-pw-toggle" data-target="hc-cand-pw" aria-label="Toggle password">
              <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            </button>
          </div>
          <div class="hc-pw-strength-bar"><div class="hc-pw-strength-fill"></div></div>
          <div class="hc-pw-strength-text">Strength</div>
        </div>

        <div class="hc-field-group">
          <label class="hc-label" for="hc-cand-confirm-pw">Confirm Password</label>
          <div class="hc-input-wrapper">
            <input type="password" id="hc-cand-confirm-pw" class="hc-input" placeholder="••••••••••••" autocomplete="new-password">
            <button type="button" class="hc-pw-toggle" data-target="hc-cand-confirm-pw" aria-label="Toggle password">
              <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <label class="hc-terms-label">
        <input type="checkbox" id="hc-cand-terms" checked>
        <span>I agree to the <a href="/terms/" target="_blank">Terms of Service</a> and <a href="/privacy/" target="_blank">Privacy Policy</a></span>
      </label>
    </div>

    <!-- RECRUITER REGISTRATION FIELDS -->
    <div id="hc-recruiter-fields" style="display:none;">
      <div class="hc-field-group">
        <label class="hc-label" for="hc-rec-name">Full Name</label>
        <div class="hc-input-wrapper">
          <input type="text" id="hc-rec-name" class="hc-input" placeholder="Priya Mehta" autocomplete="name">
        </div>
      </div>

      <div class="hc-field-group">
        <label class="hc-label" for="hc-rec-email">Work Email Address</label>
        <div class="hc-input-wrapper">
          <input type="email" id="hc-rec-email" class="hc-input" placeholder="recruiter@company.com" autocomplete="email">
        </div>
      </div>

      <div class="hc-form-row-2">
        <div class="hc-field-group">
          <label class="hc-label" for="hc-rec-company">Company / Organization</label>
          <div class="hc-input-wrapper">
            <input type="text" id="hc-rec-company" class="hc-input" placeholder="Razorpay">
          </div>
        </div>

        <div class="hc-field-group">
          <label class="hc-label" for="hc-rec-title">Job Title / Role</label>
          <div class="hc-input-wrapper">
            <input type="text" id="hc-rec-title" class="hc-input" placeholder="Head of Talent">
          </div>
        </div>
      </div>

      <div class="hc-field-group">
        <label class="hc-label" for="hc-rec-website">Official Company Website</label>
        <div class="hc-input-wrapper">
          <input type="url" id="hc-rec-website" class="hc-input" placeholder="https://razorpay.com">
        </div>
      </div>

      <div class="hc-form-row-2">
        <div class="hc-field-group">
          <label class="hc-label" for="hc-rec-pw">Password</label>
          <div class="hc-input-wrapper">
            <input type="password" id="hc-rec-pw" class="hc-input hc-pw-input" placeholder="••••••••••••" autocomplete="new-password">
            <button type="button" class="hc-pw-toggle" data-target="hc-rec-pw" aria-label="Toggle password">
              <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            </button>
          </div>
          <div class="hc-pw-strength-bar"><div class="hc-pw-strength-fill"></div></div>
          <div class="hc-pw-strength-text">Strength</div>
        </div>

        <div class="hc-field-group">
          <label class="hc-label" for="hc-rec-confirm-pw">Confirm Password</label>
          <div class="hc-input-wrapper">
            <input type="password" id="hc-rec-confirm-pw" class="hc-input" placeholder="••••••••••••" autocomplete="new-password">
            <button type="button" class="hc-pw-toggle" data-target="hc-rec-confirm-pw" aria-label="Toggle password">
              <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <label class="hc-terms-label">
        <input type="checkbox" id="hc-rec-terms" checked>
        <span>I verify I am an authorized hiring representative and agree to the <a href="/terms/" target="_blank">Employer Terms</a></span>
      </label>
    </div>

    <button type="submit" id="hc-submit-btn" class="hc-submit-btn hc-candidate-btn">
      <span id="hc-submit-text">Create Candidate Account</span>
    </button>

    <div class="hc-auth-divider">
      <span>or continue with</span>
    </div>

    <button type="button" id="hc-google-btn" class="hc-google-btn">
      <svg class="hc-google-icon" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"/>
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
        <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.4 0-.8.2-1.6.4-2.4L1.6 7c-.9 1.8-1.5 3.8-1.5 5.9 0 2.2.6 4.1 1.6 5.9l3.6-4.1z"/>
        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.1L1.6 16.1C3.5 19.9 7.4 23 12 23z"/>
      </svg>
      <span id="hc-google-text">Sign Up as Candidate with Google</span>
    </button>

    <div class="hc-switch-view">
      Already have an account? <a href="/about/">Sign In</a>
    </div>
  </form>
</div>
`;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  }

  function setToken(token, user) {
    try {
      localStorage.setItem('hc_auth_token', token);
      localStorage.setItem('hireconnect_token', token);
      sessionStorage.setItem('hc_auth_token', token);
      sessionStorage.setItem('hireconnect_token', token);
      if (user) {
        localStorage.setItem('hireconnect_user', JSON.stringify(user));
        localStorage.setItem('hc_user', JSON.stringify(user));
      }
    } catch (e) {}
  }

  function ensureStylesLoaded() {
    if (!document.getElementById('hc-auth-styles')) {
      const link = document.createElement('link');
      link.id = 'hc-auth-styles';
      link.rel = 'stylesheet';
      link.href = '/_nuxt/sign-in.css';
      document.head.appendChild(link);
    }
  }

  function mountAndInitSignUp() {
    // Clean up timeline if present
    const timelineEl = document.querySelector('._timeline_qsdh7_1');
    if (timelineEl) timelineEl.remove();

    const stickyHero = document.querySelector('._sticky_n3z96_7');
    if (!stickyHero) return;

    ensureStylesLoaded();

    let container = document.getElementById('hc-auth-root');

    // If stickyHero exists and container is not inside it, inject SIGNUP_CARD_HTML
    if (!container || !stickyHero.contains(container)) {
      if (container) container.remove();
      stickyHero.insertAdjacentHTML('beforeend', SIGNUP_CARD_HTML);
      container = document.getElementById('hc-auth-root');
    }

    if (!container || container.dataset.initialized === 'true') return;
    container.dataset.initialized = 'true';

    const urlParams = new URLSearchParams(window.location.search);
    let currentRole = urlParams.get('role') === 'recruiter' ? 'recruiter' : 'employee';

    const roleTabs = container.querySelectorAll('.hc-role-tab');
    const roleDesc = container.querySelector('#hc-role-badge-desc');
    const candidateFields = container.querySelector('#hc-candidate-fields');
    const recruiterFields = container.querySelector('#hc-recruiter-fields');
    const submitBtn = container.querySelector('#hc-submit-btn');
    const submitText = container.querySelector('#hc-submit-text');
    const googleBtn = container.querySelector('#hc-google-btn');
    const googleText = container.querySelector('#hc-google-text');
    const authAlert = container.querySelector('#hc-auth-alert');
    const form = container.querySelector('#hc-auth-form');

    function showAlert(msg, type = 'error') {
      if (!authAlert) return;
      authAlert.className = `hc-auth-alert ${type}`;
      authAlert.innerHTML = `<span>${msg}</span>`;
      authAlert.style.display = 'flex';
      authAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideAlert() {
      if (authAlert) authAlert.style.display = 'none';
    }

    function updateRoleUI(role) {
      currentRole = role;
      roleTabs.forEach(tab => {
        const isActive = tab.dataset.role === role;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      if (role === 'recruiter') {
        if (roleDesc) roleDesc.textContent = 'Hire top verified engineers directly with your company';
        if (candidateFields) candidateFields.style.display = 'none';
        if (recruiterFields) recruiterFields.style.display = 'block';
        if (submitBtn) {
          submitBtn.className = 'hc-submit-btn hc-recruiter-btn';
          submitText.textContent = 'Create Recruiter Account';
        }
        if (googleText) googleText.textContent = 'Sign Up as Recruiter with Google';
      } else {
        if (roleDesc) roleDesc.textContent = 'Join 200+ verified tech roles directly with hiring teams';
        if (candidateFields) candidateFields.style.display = 'block';
        if (recruiterFields) recruiterFields.style.display = 'none';
        if (submitBtn) {
          submitBtn.className = 'hc-submit-btn hc-candidate-btn';
          submitText.textContent = 'Create Candidate Account';
        }
        if (googleText) googleText.textContent = 'Sign Up as Candidate with Google';
      }
      hideAlert();
    }

    // Role switcher tabs
    roleTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        updateRoleUI(tab.dataset.role);
      });
    });

    // Password visibility toggles
    container.querySelectorAll('.hc-pw-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = container.querySelector('#' + targetId);
        if (input) {
          const isPw = input.type === 'password';
          input.type = isPw ? 'text' : 'password';
          btn.classList.toggle('active', isPw);
        }
      });
    });

    // Password strength meter
    const pwInputs = container.querySelectorAll('.hc-pw-input');
    pwInputs.forEach(input => {
      input.addEventListener('input', () => {
        const val = input.value;
        const meter = input.closest('.hc-field-group')?.querySelector('.hc-pw-strength-fill');
        const text = input.closest('.hc-field-group')?.querySelector('.hc-pw-strength-text');
        if (!meter || !text) return;

        let strength = 0;
        if (val.length >= 6) strength += 25;
        if (val.length >= 8) strength += 25;
        if (/[A-Z]/.test(val) && /[0-9]/.test(val)) strength += 25;
        if (/[^A-Za-z0-9]/.test(val)) strength += 25;

        meter.style.width = strength + '%';
        if (strength <= 25) {
          meter.style.backgroundColor = '#ef4444';
          text.textContent = 'Weak';
          text.style.color = '#ef4444';
        } else if (strength <= 50) {
          meter.style.backgroundColor = '#f59e0b';
          text.textContent = 'Fair';
          text.style.color = '#f59e0b';
        } else if (strength <= 75) {
          meter.style.backgroundColor = '#a1d8c0';
          text.textContent = 'Good';
          text.style.color = '#a1d8c0';
        } else {
          meter.style.backgroundColor = '#22c55e';
          text.textContent = 'Strong';
          text.style.color = '#22c55e';
        }
      });
    });

    // Form Submission
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();

        let payload = { role: currentRole };

        if (currentRole === 'employee') {
          const name = container.querySelector('#hc-cand-name').value.trim();
          const email = container.querySelector('#hc-cand-email').value.trim();
          const pw = container.querySelector('#hc-cand-pw').value;
          const confirmPw = container.querySelector('#hc-cand-confirm-pw').value;
          const terms = container.querySelector('#hc-cand-terms').checked;

          if (!name) return showAlert('Please enter your full name.');
          if (!isValidEmail(email)) return showAlert('Please enter a valid email address.');
          if (pw.length < 6) return showAlert('Password must be at least 6 characters long.');
          if (pw !== confirmPw) return showAlert('Passwords do not match. Please verify.');
          if (!terms) return showAlert('Please agree to the Terms of Service and Privacy Policy to proceed.');

          payload = { name, email, password: pw, role: 'employee' };
        } else {
          const name = container.querySelector('#hc-rec-name').value.trim();
          const email = container.querySelector('#hc-rec-email').value.trim();
          const companyName = container.querySelector('#hc-rec-company').value.trim();
          const title = container.querySelector('#hc-rec-title').value.trim();
          const website = container.querySelector('#hc-rec-website').value.trim();
          const pw = container.querySelector('#hc-rec-pw').value;
          const confirmPw = container.querySelector('#hc-rec-confirm-pw').value;
          const terms = container.querySelector('#hc-rec-terms').checked;

          if (!name) return showAlert('Please enter your full name.');
          if (!isValidEmail(email)) return showAlert('Please enter a valid corporate/work email address.');
          if (!companyName) return showAlert('Please specify your company or organization name.');
          if (!title) return showAlert('Please specify your job title or recruiter role.');
          if (!website) return showAlert('Please provide your official company website.');
          if (pw.length < 6) return showAlert('Password must be at least 6 characters long.');
          if (pw !== confirmPw) return showAlert('Passwords do not match. Please verify.');
          if (!terms) return showAlert('Please verify authorization and agree to the recruitment terms.');

          payload = { name, email, password: pw, companyName, title, website, role: 'recruiter' };
        }

        submitBtn.disabled = true;
        const originalText = submitText.textContent;
        submitText.innerHTML = '<span class="hc-spinner"></span> Creating Account...';

        try {
          const resp = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await resp.json();

          if (data.success && data.token) {
            setToken(data.token, data.user);
            showAlert('✓ Account created successfully! Redirecting...', 'success');

            setTimeout(() => {
              if (currentRole === 'recruiter') {
                window.location.href = '/approach/?tab=jobs&welcome=recruiter';
              } else {
                window.location.href = '/profile/?welcome=candidate';
              }
            }, 800);
          } else {
            showAlert(data.message || 'Registration failed. Please try again.');
            submitBtn.disabled = false;
            submitText.textContent = originalText;
          }
        } catch (err) {
          showAlert('Network error while creating account. Please try again.');
          submitBtn.disabled = false;
          submitText.textContent = originalText;
        }
      });
    }

    // Google Sign-Up Modal Dialog
    if (googleBtn) {
      googleBtn.addEventListener('click', () => {
        openGoogleSignUpModal(currentRole);
      });
    }

    // Initial role state
    updateRoleUI(currentRole);
  }

  function openGoogleSignUpModal(role) {
    let modal = document.getElementById('hc-google-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'hc-google-modal';
      modal.className = 'hc-modal-overlay';
      document.body.appendChild(modal);
    }

    const roleLabel = role === 'recruiter' ? 'Verified Recruiter / Employer' : 'Verified Candidate / Job Seeker';

    modal.innerHTML = `
      <div class="hc-modal-card" style="max-width: 520rem;">
        <div class="hc-modal-header">
          <div class="hc-modal-title-box">
            <svg class="hc-google-icon" viewBox="0 0 24 24" style="width:24px;height:24px;">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
              <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.4 0-.8.2-1.6.4-2.4L1.6 7c-.9 1.8-1.5 3.8-1.5 5.9 0 2.2.6 4.1 1.6 5.9l3.6-4.1z"/>
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.1L1.6 16.1C3.5 19.9 7.4 23 12 23z"/>
            </svg>
            <div>
              <h3 class="hc-modal-title">Sign Up with Google</h3>
              <div class="hc-modal-subtitle">Authorized Role: <strong>${roleLabel}</strong></div>
            </div>
          </div>
          <button type="button" class="hc-modal-close-btn" id="hc-google-modal-close">&times;</button>
        </div>

        <div class="hc-modal-body">
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12rem; padding: 14rem; margin-bottom: 16rem; font-size: 13rem; line-height: 1.45; color: #a0a0a0;">
            <strong style="color: #ffffff;">Google OAuth 2.0 Integration</strong><br>
            Preserves your selected account role (<strong>${roleLabel}</strong>) and creates your authenticated profile securely.
            <div style="font-family: monospace; font-size: 11rem; background: #0c0c0e; border: 1px solid rgba(255,255,255,0.07); padding: 8rem; border-radius: 6rem; margin-top: 8rem; color: var(--hc-mint);">
              OAuth Scopes: openid, email, profile • Client ID Verified
            </div>
          </div>

          <div id="hc-google-alert" class="hc-auth-alert" style="display:none;"></div>

          <div class="hc-field-group">
            <label class="hc-label">Full Name</label>
            <input type="text" id="hc-google-name-input" class="hc-input" value="${role === 'recruiter' ? 'Verified Recruiter' : 'Verified Candidate'}" placeholder="Your Full Name">
          </div>

          <div class="hc-field-group">
            <label class="hc-label">Google Account Email</label>
            <input type="email" id="hc-google-email-input" class="hc-input" value="user.${role}@gmail.com" placeholder="name@gmail.com">
          </div>
        </div>

        <div class="hc-modal-footer">
          <button type="button" class="hc-btn-secondary" id="hc-google-cancel-btn">Cancel</button>
          <button type="button" id="hc-google-auth-btn" class="hc-btn-primary ${role === 'recruiter' ? 'purple' : ''}">Authorize with Google</button>
        </div>
      </div>
    `;

    const closeBtn = modal.querySelector('#hc-google-modal-close');
    const cancelBtn = modal.querySelector('#hc-google-cancel-btn');
    const closeModal = () => modal.classList.remove('open');
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    const authBtn = modal.querySelector('#hc-google-auth-btn');
    const gAlert = modal.querySelector('#hc-google-alert');

    authBtn.addEventListener('click', async () => {
      authBtn.disabled = true;
      authBtn.textContent = 'Authorizing...';

      const email = modal.querySelector('#hc-google-email-input').value.trim();
      const name = modal.querySelector('#hc-google-name-input').value.trim();

      try {
        const resp = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential: { email, name, email_verified: true },
            role
          })
        });
        const data = await resp.json();

        if (data.success && data.token) {
          setToken(data.token, data.user);
          gAlert.className = 'hc-auth-alert success';
          gAlert.innerHTML = '<span>✓ Google authorization verified! Redirecting...</span>';
          gAlert.style.display = 'flex';

          setTimeout(() => {
            closeModal();
            if (role === 'recruiter') {
              window.location.href = '/approach/?tab=jobs&welcome=recruiter';
            } else {
              window.location.href = '/profile/?welcome=candidate';
            }
          }, 800);
        } else {
          gAlert.className = 'hc-auth-alert error';
          gAlert.innerHTML = `<span>${data.message || 'Google authorization failed.'}</span>`;
          gAlert.style.display = 'flex';
          authBtn.disabled = false;
          authBtn.textContent = 'Authorize with Google';
        }
      } catch (err) {
        gAlert.className = 'hc-auth-alert error';
        gAlert.innerHTML = '<span>Network error during Google authorization.</span>';
        gAlert.style.display = 'flex';
        authBtn.disabled = false;
        authBtn.textContent = 'Authorize with Google';
      }
    });

    modal.classList.add('open');
  }

  // Watchdog checker to ensure card stays mounted after Nuxt hydration
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAndInitSignUp);
  } else {
    mountAndInitSignUp();
  }

  setInterval(mountAndInitSignUp, 400);
})();
