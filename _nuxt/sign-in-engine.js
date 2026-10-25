(function () {
  'use strict';

  function persistAuthSession(token, user) {
    try {
      if (token) {
        localStorage.setItem('hc_auth_token', token);
        localStorage.setItem('hireconnect_token', token);
        sessionStorage.setItem('hc_auth_token', token);
        sessionStorage.setItem('hireconnect_token', token);
      }
      if (user) {
        localStorage.setItem('hireconnect_user', JSON.stringify(user));
        localStorage.setItem('hc_user', JSON.stringify(user));
      }
    } catch (e) {}
  }

  const AUTH_CARD_HTML = `
<div id="hc-auth-root" class="hc-auth-container">
  <div class="hc-auth-header">
    <h1 class="hc-auth-super-title">Not just another job board</h1>
    <p class="hc-auth-subtitle" id="hc-role-badge-desc">Find &amp; apply for verified roles across India</p>
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
    <div class="hc-field-group">
      <label class="hc-label" for="hc-email-input" id="hc-email-label">Email Address</label>
      <div class="hc-input-wrapper">
        <input type="email" id="hc-email-input" class="hc-input" placeholder="candidate@hireconnect.io" autocomplete="email" required>
      </div>
    </div>

    <div class="hc-field-group">
      <label class="hc-label" for="hc-password-input">Password</label>
      <div class="hc-input-wrapper">
        <input type="password" id="hc-password-input" class="hc-input" placeholder="••••••••••••" autocomplete="current-password" required>
        <button type="button" id="hc-pw-toggle" class="hc-pw-toggle" aria-label="Toggle password visibility">
          <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
        </button>
      </div>
    </div>

    <div class="hc-form-row">
      <label class="hc-checkbox-label">
        <input type="checkbox" id="hc-remember-me" checked>
        <span>Remember me for 30 days</span>
      </label>
      <a href="#" id="hc-forgot-link" class="hc-forgot-link">Forgot password?</a>
    </div>

    <button type="submit" id="hc-submit-btn" class="hc-submit-btn hc-candidate-btn">
      <span id="hc-submit-text">Sign In as Job Seeker</span>
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
      <span>Continue with Google</span>
    </button>

    <div id="hc-demo-badge" class="hc-demo-badge" data-demo-email="candidate@hireconnect.io" data-demo-pw="Candidate@123" title="Click to autofill evaluation credentials">
      <span>Test Demo: candidate@hireconnect.io / Candidate@123</span>
    </div>

    <div class="hc-switch-view" id="hc-switch-view-link">
      New to HireConnect? <a href="/signup/?role=employee" id="hc-register-trigger">Create Candidate Account</a>
    </div>
  </form>
</div>
`;

  function ensureStylesLoaded() {
    if (!document.getElementById('hc-auth-styles')) {
      const link = document.createElement('link');
      link.id = 'hc-auth-styles';
      link.rel = 'stylesheet';
      link.href = '/_nuxt/sign-in.css';
      document.head.appendChild(link);
    }
  }

  function mountAndInitAuth() {
    // Clean up timeline factor if present
    const timelineEl = document.querySelector('._timeline_qsdh7_1');
    if (timelineEl) timelineEl.remove();

    // Only run strictly on the Sign In page (/about/)
    const path = window.location.pathname;
    const isSignInPage = path === '/about' || path === '/about/' || path.includes('/about/');
    if (!isSignInPage) return;

    const stickyHero = document.querySelector('._sticky_n3z96_7');
    if (!stickyHero) return;

    ensureStylesLoaded();

    let container = document.getElementById('hc-auth-root');

    // If stickyHero exists and container is not inside it, inject it
    if (stickyHero && (!container || !stickyHero.contains(container))) {
      if (container) container.remove();
      stickyHero.insertAdjacentHTML('beforeend', AUTH_CARD_HTML);
      container = document.getElementById('hc-auth-root');
    }

    if (!container || container.dataset.initialized === 'true') return;
    container.dataset.initialized = 'true';

    let currentRole = 'employee'; // 'employee' or 'recruiter'

    const segmentedTabs = container.querySelectorAll('.hc-role-tab');
    const alertBox = document.getElementById('hc-auth-alert');
    const authForm = document.getElementById('hc-auth-form');
    const roleBadgeDesc = document.getElementById('hc-role-badge-desc');
    const emailLabel = document.getElementById('hc-email-label');
    const emailInput = document.getElementById('hc-email-input');
    const passwordInput = document.getElementById('hc-password-input');
    const pwToggleBtn = document.getElementById('hc-pw-toggle');
    const submitBtn = document.getElementById('hc-submit-btn');
    const submitText = document.getElementById('hc-submit-text');
    const demoBadge = document.getElementById('hc-demo-badge');
    const switchViewLink = document.getElementById('hc-switch-view-link');
    const googleBtn = document.getElementById('hc-google-btn');
    const forgotLink = document.getElementById('hc-forgot-link');

    function showAlert(type, message) {
      if (!alertBox) return;
      alertBox.className = `hc-auth-alert ${type}`;
      alertBox.innerHTML = `<span>${message}</span>`;
      alertBox.style.display = 'flex';
    }

    function hideAlert() {
      if (!alertBox) return;
      alertBox.style.display = 'none';
      alertBox.innerHTML = '';
    }

    function setRole(role) {
      currentRole = role;
      hideAlert();

      segmentedTabs.forEach(tab => {
        const isMatch = tab.getAttribute('data-role') === role;
        tab.classList.toggle('active', isMatch);
        tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      if (role === 'recruiter') {
        container.classList.add('recruiter-mode');
        if (roleBadgeDesc) roleBadgeDesc.textContent = 'Manage hiring pipelines & top tech talent';
        if (emailLabel) emailLabel.textContent = 'Work Email Address';
        if (emailInput) {
          emailInput.placeholder = 'recruiter@company.com';
          if (emailInput.value === 'candidate@hireconnect.io') emailInput.value = '';
        }
        if (submitBtn) {
          submitBtn.className = 'hc-submit-btn hc-recruiter-btn';
          if (submitText) submitText.textContent = 'Sign In as Recruiter';
        }
        if (demoBadge) {
          demoBadge.setAttribute('data-demo-email', 'recruiter@hireconnect.io');
          demoBadge.setAttribute('data-demo-pw', 'Recruiter@123');
          demoBadge.querySelector('span').textContent = 'Test Demo: recruiter@hireconnect.io / Recruiter@123';
        }
        if (switchViewLink) {
          switchViewLink.innerHTML = 'Hiring for your team? <a href="/signup/?role=recruiter" id="hc-register-trigger">Create Employer Account</a>';
        }
      } else {
        container.classList.remove('recruiter-mode');
        if (roleBadgeDesc) roleBadgeDesc.textContent = 'Find & apply for verified roles across India';
        if (emailLabel) emailLabel.textContent = 'Email Address';
        if (emailInput) {
          emailInput.placeholder = 'candidate@hireconnect.io';
          if (emailInput.value === 'recruiter@hireconnect.io') emailInput.value = '';
        }
        if (submitBtn) {
          submitBtn.className = 'hc-submit-btn hc-candidate-btn';
          if (submitText) submitText.textContent = 'Sign In as Job Seeker';
        }
        if (demoBadge) {
          demoBadge.setAttribute('data-demo-email', 'candidate@hireconnect.io');
          demoBadge.setAttribute('data-demo-pw', 'Candidate@123');
          demoBadge.querySelector('span').textContent = 'Test Demo: candidate@hireconnect.io / Candidate@123';
        }
        if (switchViewLink) {
          switchViewLink.innerHTML = 'New to HireConnect? <a href="/signup/?role=employee" id="hc-register-trigger">Create Candidate Account</a>';
        }
      }

      bindRegisterTrigger();
    }

    segmentedTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        setRole(tab.getAttribute('data-role'));
      });
    });

    // Password visibility toggle
    if (pwToggleBtn && passwordInput) {
      pwToggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        pwToggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        pwToggleBtn.innerHTML = isPassword
          ? `<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`
          : `<svg viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>`;
      });
    }

    // Demo credential badge autofill
    if (demoBadge) {
      demoBadge.addEventListener('click', () => {
        const email = demoBadge.getAttribute('data-demo-email');
        const pw = demoBadge.getAttribute('data-demo-pw');
        if (emailInput) emailInput.value = email;
        if (passwordInput) passwordInput.value = pw;
        hideAlert();
      });
    }

    // Sign in form submission
    if (authForm) {
      authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();

        const email = (emailInput?.value || '').trim();
        const password = (passwordInput?.value || '').trim();
        const rememberMe = document.getElementById('hc-remember-me')?.checked || false;

        if (!email) {
          showAlert('error', 'Please enter your email address.');
          emailInput?.focus();
          return;
        }

        if (!password) {
          showAlert('error', 'Please enter your password.');
          passwordInput?.focus();
          return;
        }

        submitBtn.disabled = true;
        const originalText = submitText.textContent;
        submitText.innerHTML = `<span class="hc-spinner"></span> Authenticating...`;

        try {
          const resp = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role: currentRole, rememberMe })
          });

          const data = await resp.json();

          if (!resp.ok || !data.success) {
            showAlert('error', data.message || 'Authentication failed. Please verify credentials.');
            submitBtn.disabled = false;
            submitText.textContent = originalText;
            return;
          }

          showAlert('success', `${data.message} Redirecting to your dashboard...`);
          persistAuthSession(data.token, data.user);

          setTimeout(() => {
            window.location.href = data.redirectUrl || (currentRole === 'recruiter' ? '/cases/' : '/services/');
          }, 800);
        } catch (netErr) {
          showAlert('error', 'Network error connecting to authentication server. Please try again.');
          submitBtn.disabled = false;
          submitText.textContent = originalText;
        }
      });
    }

    // Google Sign-In
    if (googleBtn) {
      googleBtn.addEventListener('click', () => {
        openGoogleModal(currentRole);
      });
    }

    // Forgot password
    if (forgotLink) {
      forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        openForgotModal(currentRole);
      });
    }

    function bindRegisterTrigger() {
      const trigger = document.getElementById('hc-register-trigger');
      if (trigger) {
        trigger.onclick = (e) => {
          e.preventDefault();
          openRegisterModal(currentRole);
        };
      }
    }

    bindRegisterTrigger();
  }

  // Google OAuth Dialog
  function openGoogleModal(role) {
    const existing = document.getElementById('hc-google-modal');
    if (existing) existing.remove();

    const roleName = role === 'recruiter' ? 'Recruiter / Employer' : 'Job Seeker / Candidate';
    const redirectTarget = role === 'recruiter' ? '/cases/' : '/services/';

    const modal = document.createElement('div');
    modal.id = 'hc-google-modal';
    modal.className = 'hc-modal-overlay';
    modal.innerHTML = `
      <div class="hc-modal">
        <button class="hc-modal-close" aria-label="Close modal">&times;</button>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <svg class="hc-google-icon" viewBox="0 0 24 24" style="width:24px;height:24px;">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"/>
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
            <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.4 0-.8.2-1.6.4-2.4L1.6 7c-.9 1.8-1.5 3.8-1.5 5.9 0 2.2.6 4.1 1.6 5.9l3.6-4.1z"/>
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.1L1.6 16.1C3.5 19.9 7.4 23 12 23z"/>
          </svg>
          <h2 class="hc-modal-title" style="margin:0;">Continue with Google</h2>
        </div>
        <p class="hc-modal-desc">Authenticating role: <strong style="color:${role === 'recruiter' ? '#c496ff' : '#a1d8c0'};">${roleName}</strong></p>
        
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;margin-bottom:16px;font-size:13px;line-height:1.45;color:#c0c0c0;">
          <strong style="color:#ffffff;">Official Google OAuth 2.0 Integration</strong><br>
          For production deployment, configure your OAuth Client ID in Google Cloud Console with:
          <div class="hc-oauth-code-block">Authorized JavaScript origins: http://localhost:3000
Authorized redirect URIs: http://localhost:3000/api/auth/google/callback</div>
          In this local environment, you can authorize instantly with the verified <strong>Google Simulation Session</strong> below.
        </div>

        <div id="hc-google-alert" class="hc-auth-alert" style="display:none;"></div>

        <button type="button" id="hc-google-auth-btn" class="hc-submit-btn ${role === 'recruiter' ? 'hc-recruiter-btn' : 'hc-candidate-btn'}" style="margin-bottom:10px;">
          <span>Sign In as ${role === 'recruiter' ? 'Verified Employer via Google' : 'Verified Candidate via Google'}</span>
        </button>

        <p style="text-align:center;font-size:11px;color:#777;margin:0;">Your privacy is protected. No passwords are shared with third parties.</p>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.hc-modal-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    const authBtn = modal.querySelector('#hc-google-auth-btn');
    authBtn.onclick = async () => {
      authBtn.disabled = true;
      authBtn.innerHTML = '<span class="hc-spinner"></span> Authenticating Google token...';
      const gAlert = modal.querySelector('#hc-google-alert');

      try {
        const resp = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role })
        });
        const data = await resp.json();

        if (data.success) {
          gAlert.className = 'hc-auth-alert success';
          gAlert.innerHTML = `<span>Authenticated as ${data.user.email}! Redirecting...</span>`;
          gAlert.style.display = 'flex';

          persistAuthSession(data.token, data.user);

          setTimeout(() => {
            window.location.href = data.redirectUrl || redirectTarget;
          }, 800);
        } else {
          gAlert.className = 'hc-auth-alert error';
          gAlert.innerHTML = `<span>${data.message || 'Google authentication failed.'}</span>`;
          gAlert.style.display = 'flex';
          authBtn.disabled = false;
          authBtn.innerHTML = `<span>Try Again</span>`;
        }
      } catch (err) {
        gAlert.className = 'hc-auth-alert error';
        gAlert.innerHTML = `<span>Network error during Google auth.</span>`;
        gAlert.style.display = 'flex';
        authBtn.disabled = false;
        authBtn.innerHTML = `<span>Try Again</span>`;
      }
    };
  }

  // Forgot Password Modal
  function openForgotModal(role) {
    const existing = document.getElementById('hc-forgot-modal');
    if (existing) existing.remove();

    const roleLabel = role === 'recruiter' ? 'Recruiter / Employer' : 'Job Seeker / Candidate';

    const modal = document.createElement('div');
    modal.id = 'hc-forgot-modal';
    modal.className = 'hc-modal-overlay';
    modal.innerHTML = `
      <div class="hc-modal">
        <button class="hc-modal-close" aria-label="Close modal">&times;</button>
        <h2 class="hc-modal-title">Reset Your Password</h2>
        <p class="hc-modal-desc">Account Type: <strong style="color:${role === 'recruiter' ? '#c496ff' : '#a1d8c0'};">${roleLabel}</strong></p>
        <div id="hc-forgot-alert" class="hc-auth-alert" style="display:none;"></div>
        
        <form id="hc-forgot-form" style="display:flex;flex-direction:column;gap:14px;">
          <div class="hc-field-group">
            <label class="hc-label">Account Email Address</label>
            <input type="email" id="hc-forgot-email" class="hc-input" placeholder="${role === 'recruiter' ? 'recruiter@company.com' : 'candidate@hireconnect.io'}" required>
          </div>
          <button type="submit" id="hc-forgot-submit" class="hc-submit-btn ${role === 'recruiter' ? 'hc-recruiter-btn' : 'hc-candidate-btn'}">
            <span>Send Password Reset Instructions</span>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('.hc-modal-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    const form = modal.querySelector('#hc-forgot-form');
    const fAlert = modal.querySelector('#hc-forgot-alert');
    const submitBtn = modal.querySelector('#hc-forgot-submit');

    form.onsubmit = async (e) => {
      e.preventDefault();
      const email = modal.querySelector('#hc-forgot-email').value.trim();
      if (!email) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="hc-spinner"></span> Sending...';

      try {
        const resp = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, role })
        });
        const data = await resp.json();

        if (data.success) {
          fAlert.className = 'hc-auth-alert success';
          fAlert.innerHTML = `<span>${data.message}</span>`;
          fAlert.style.display = 'flex';
          form.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Instructions Sent!</span>';
        } else {
          fAlert.className = 'hc-auth-alert error';
          fAlert.innerHTML = `<span>${data.message || 'Could not reset password.'}</span>`;
          fAlert.style.display = 'flex';
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Send Password Reset Instructions</span>';
        }
      } catch (err) {
        fAlert.className = 'hc-auth-alert error';
        fAlert.innerHTML = `<span>Network error. Please try again.</span>`;
        fAlert.style.display = 'flex';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Password Reset Instructions</span>';
      }
    };
  }

  // Registration Modal
  function openRegisterModal(role) {
    const existing = document.getElementById('hc-register-modal');
    if (existing) existing.remove();

    const isRecruiter = role === 'recruiter';
    const modal = document.createElement('div');
    modal.id = 'hc-register-modal';
    modal.className = 'hc-modal-overlay';
    modal.innerHTML = `
      <div class="hc-modal">
        <button class="hc-modal-close" aria-label="Close modal">&times;</button>
        <h2 class="hc-modal-title">Create ${isRecruiter ? 'Employer' : 'Candidate'} Account</h2>
        <p class="hc-modal-desc">${isRecruiter ? 'Publish positions and access pre-vetted engineers' : 'Access 200+ verified tech opportunities across India'}</p>
        <div id="hc-register-alert" class="hc-auth-alert" style="display:none;"></div>
        
        <form id="hc-register-form" style="display:flex;flex-direction:column;gap:12px;">
          <div class="hc-field-group">
            <label class="hc-label">Full Name</label>
            <input type="text" id="hc-reg-name" class="hc-input" placeholder="e.g. Sanjay Verma" required>
          </div>
          <div class="hc-field-group">
            <label class="hc-label">${isRecruiter ? 'Work Email Address' : 'Personal or Work Email'}</label>
            <input type="email" id="hc-reg-email" class="hc-input" placeholder="${isRecruiter ? 'sanjay@techstartup.in' : 'sanjay@gmail.com'}" required>
          </div>
          ${isRecruiter ? `
          <div class="hc-field-group">
            <label class="hc-label">Company / Organization Name</label>
            <input type="text" id="hc-reg-company" class="hc-input" placeholder="e.g. Zerodha Technologies" required>
          </div>` : ''}
          <div class="hc-field-group">
            <label class="hc-label">Password (minimum 6 characters)</label>
            <input type="password" id="hc-reg-password" class="hc-input" placeholder="••••••••••••" minlength="6" required>
          </div>
          <div class="hc-field-group">
            <label class="hc-label">Confirm Password</label>
            <input type="password" id="hc-reg-confirm" class="hc-input" placeholder="••••••••••••" minlength="6" required>
          </div>

          <button type="submit" id="hc-reg-submit" class="hc-submit-btn ${isRecruiter ? 'hc-recruiter-btn' : 'hc-candidate-btn'}" style="margin-top:6px;">
            <span>Create Account & Sign In</span>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('.hc-modal-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    const form = modal.querySelector('#hc-register-form');
    const rAlert = modal.querySelector('#hc-register-alert');
    const submitBtn = modal.querySelector('#hc-reg-submit');

    form.onsubmit = async (e) => {
      e.preventDefault();
      const name = modal.querySelector('#hc-reg-name').value.trim();
      const email = modal.querySelector('#hc-reg-email').value.trim();
      const companyName = isRecruiter ? modal.querySelector('#hc-reg-company').value.trim() : '';
      const password = modal.querySelector('#hc-reg-password').value;
      const confirm = modal.querySelector('#hc-reg-confirm').value;

      if (password !== confirm) {
        rAlert.className = 'hc-auth-alert error';
        rAlert.innerHTML = '<span>Passwords do not match. Please re-enter.</span>';
        rAlert.style.display = 'flex';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="hc-spinner"></span> Creating account...';

      try {
        const resp = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role, companyName })
        });
        const data = await resp.json();

        if (data.success) {
          rAlert.className = 'hc-auth-alert success';
          rAlert.innerHTML = '<span>Account created successfully! Redirecting...</span>';
          rAlert.style.display = 'flex';

          persistAuthSession(data.token, data.user);

          setTimeout(() => {
            window.location.href = data.redirectUrl || (isRecruiter ? '/cases/' : '/services/');
          }, 800);
        } else {
          rAlert.className = 'hc-auth-alert error';
          rAlert.innerHTML = `<span>${data.message || 'Registration failed.'}</span>`;
          rAlert.style.display = 'flex';
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Create Account & Sign In</span>';
        }
      } catch (err) {
        rAlert.className = 'hc-auth-alert error';
        rAlert.innerHTML = `<span>Network error during registration.</span>`;
        rAlert.style.display = 'flex';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Create Account & Sign In</span>';
      }
    };
  }

  // Periodic watchdog checker to support both direct load and Nuxt SPA route changes
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAndInitAuth);
  } else {
    mountAndInitAuth();
  }

  setInterval(mountAndInitAuth, 400);
  window.mountAndInitAuth = mountAndInitAuth;
})();
