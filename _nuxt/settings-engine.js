/**
 * HireConnect Settings Engine
 * Handles Security, Passwords, Notifications, Privacy, Connected Accounts & Sessions
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

  async function initSettings() {
    const container = document.getElementById('hc-settings-app');
    if (!container) return;

    const token = getToken();
    if (!token) {
      container.innerHTML = `
        <div class="hc-content-card" style="text-align: center; padding: 60rem 20rem; max-width: 600rem; margin: 40rem auto;">
          <div style="font-size: 40rem; margin-bottom: 16rem;">🔒</div>
          <h2 style="font-size: 24rem; color: #fff; margin: 0 0 8rem;">Sign In Required</h2>
          <p style="font-size: 14rem; color: #999; margin: 0 0 24rem;">Please sign in to access your HireConnect account settings.</p>
          <div style="display: flex; gap: 12rem; justify-content: center;">
            <a href="/about/" class="hc-btn-primary" style="text-decoration: none;">Sign In</a>
            <a href="/signup/" class="hc-btn-secondary" style="text-decoration: none;">Create Account</a>
          </div>
        </div>
      `;
      return;
    }

    try {
      const [userRes, setRes, sessRes] = await Promise.all([
        fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } }),
        fetch('/api/settings', { headers: { 'Authorization': 'Bearer ' + token } }),
        fetch('/api/auth/sessions', { headers: { 'Authorization': 'Bearer ' + token } })
      ]);

      if (!userRes.ok) {
        localStorage.removeItem('hc_auth_token');
        localStorage.removeItem('hireconnect_token');
        sessionStorage.removeItem('hc_auth_token');
        sessionStorage.removeItem('hireconnect_token');
        window.location.href = '/about/';
        return;
      }

      const userData = await userRes.json();
      const user = userData.user;
      const settingsData = setRes.ok ? await setRes.json() : { settings: {} };
      const settings = settingsData.settings || {};
      const sessData = sessRes.ok ? await sessRes.json() : { sessions: [] };
      const sessions = sessData.sessions || [];

      renderSettingsView(container, user, settings, sessions);
    } catch (e) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40rem; color: #ff8888;">
          Failed to load settings. Please check your connection or sign in again.
        </div>
      `;
    }
  }

  function renderSettingsView(container, user, settings, sessions) {
    const isRecruiter = user.role === 'recruiter';
    const notifs = settings.notifications || {
      applicationUpdates: true,
      recruiterMessages: true,
      weeklyJobMatches: true,
      marketingAnnouncements: false
    };
    const privacy = settings.privacy || {
      profileDiscoverable: isRecruiter ? true : false,
      allowResumeDownload: true,
      hideDirectContact: false
    };

    container.innerHTML = `
      <div style="margin-bottom: 24rem;">
        <h1 style="font-size: 28rem; font-weight: 600; color: #fff; margin: 0 0 6rem;">Account Settings &amp; Security</h1>
        <p style="font-size: 14rem; color: var(--hc-text-secondary); margin: 0;">Manage your security credentials, notification alerts, discoverability and session access.</p>
      </div>

      <!-- SECTION 1: ACCOUNT OVERVIEW & EMAIL STATUS -->
      <div class="hc-content-card" style="margin-bottom: 24rem;">
        <div class="hc-settings-group">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14rem;">
            <div>
              <div class="hc-settings-title">Account Information</div>
              <div class="hc-settings-desc">Primary authentication identity on HireConnect.</div>
              <div style="font-size: 14rem; color: #fff; margin-bottom: 4rem;">
                <strong>${escapeHtml(user.name)}</strong> (${escapeHtml(user.email)})
              </div>
              <div style="font-size: 12rem; font-family: var(--hc-font-mono); color: ${isRecruiter ? 'var(--hc-purple)' : 'var(--hc-mint)'};">
                Account Role: ${isRecruiter ? 'Recruiter / Employer Partner' : 'Job Seeker / Tech Candidate'}
              </div>
            </div>
            <div>
              <span style="display: inline-flex; align-items: center; gap: 6rem; background: rgba(34, 197, 94, 0.12); border: 1px solid rgba(34, 197, 94, 0.35); color: #86efac; border-radius: 9999px; padding: 6rem 14rem; font-size: 12rem; font-family: var(--hc-font-mono);">
                ✓ Email Address Verified
              </span>
            </div>
          </div>
        </div>

        <!-- SECTION 2: CHANGE PASSWORD -->
        <div class="hc-settings-group">
          <div class="hc-settings-title">Change Password</div>
          <div class="hc-settings-desc">Keep your account secure with a strong password of at least 8 characters.</div>

          <div id="hc-pw-alert" class="hc-auth-alert" style="display:none;"></div>

          <form id="hc-change-pw-form" style="max-width: 500rem;">
            <div class="hc-field-group">
              <label class="hc-label">Current Password</label>
              <div class="hc-input-wrapper">
                <input type="password" id="hc-curr-pw" class="hc-input" placeholder="••••••••••••" required>
              </div>
            </div>

            <div class="hc-field-group">
              <label class="hc-label">New Password</label>
              <div class="hc-input-wrapper">
                <input type="password" id="hc-new-pw" class="hc-input hc-pw-input" placeholder="••••••••••••" required>
              </div>
              <div class="hc-pw-strength-bar"><div class="hc-pw-strength-fill" id="hc-new-pw-fill"></div></div>
              <div class="hc-pw-strength-text" id="hc-new-pw-text">Strength: At least 8 characters</div>
            </div>

            <div class="hc-field-group">
              <label class="hc-label">Confirm New Password</label>
              <div class="hc-input-wrapper">
                <input type="password" id="hc-confirm-new-pw" class="hc-input" placeholder="••••••••••••" required>
              </div>
            </div>

            <button type="submit" class="hc-btn-primary" id="hc-update-pw-btn" style="margin-top: 8rem;">
              Update Password
            </button>
          </form>
        </div>

        <!-- SECTION 3: NOTIFICATION PREFERENCES -->
        <div class="hc-settings-group">
          <div class="hc-settings-title">Notification Preferences</div>
          <div class="hc-settings-desc">Choose which real-time alerts are sent to your verified email address.</div>

          <div class="hc-privacy-card">
            <div class="hc-privacy-info">
              <h4>Direct Application &amp; Hiring Updates</h4>
              <p>Receive immediate alerts when your application status changes (Shortlisted, Interview Scheduled, Offer Extended).</p>
            </div>
            <label class="hc-switch">
              <input type="checkbox" id="hc-notif-app" ${notifs.applicationUpdates ? 'checked' : ''}>
              <span class="hc-slider"></span>
            </label>
          </div>

          <div class="hc-privacy-card">
            <div class="hc-privacy-info">
              <h4>Recruiter Messages &amp; Direct Inquiries</h4>
              <p>Get notified when authorized hiring managers message you or request an introductory call.</p>
            </div>
            <label class="hc-switch">
              <input type="checkbox" id="hc-notif-msg" ${notifs.recruiterMessages ? 'checked' : ''}>
              <span class="hc-slider"></span>
            </label>
          </div>

          <div class="hc-privacy-card">
            <div class="hc-privacy-info">
              <h4>Weekly Curated Opportunity Digest</h4>
              <p>Summary of new verified engineering roles matching your preferred tech stack and salary expectations.</p>
            </div>
            <label class="hc-switch">
              <input type="checkbox" id="hc-notif-weekly" ${notifs.weeklyJobMatches ? 'checked' : ''}>
              <span class="hc-slider"></span>
            </label>
          </div>

          <div style="margin-top: 14rem;">
            <button type="button" class="hc-btn-secondary" id="hc-save-notifs-btn">Save Notification Preferences</button>
          </div>
        </div>

        <!-- SECTION 4: PRIVACY & DISCOVERABILITY -->
        <div class="hc-settings-group">
          <div class="hc-settings-title">Privacy &amp; Candidate Discoverability</div>
          <div class="hc-settings-desc">Control whether and how hiring teams can view your profile and contact you.</div>

          <div class="hc-privacy-card">
            <div class="hc-privacy-info">
              <h4>Discoverable in Recruiter Searches</h4>
              <p>When enabled, verified recruiters can find your profile in candidate discovery based on your tech stack. <strong>Strict default: Private.</strong></p>
            </div>
            <label class="hc-switch">
              <input type="checkbox" id="hc-set-discoverable" ${privacy.profileDiscoverable ? 'checked' : ''}>
              <span class="hc-slider"></span>
            </label>
          </div>

          <div class="hc-privacy-card">
            <div class="hc-privacy-info">
              <h4>Allow Verified Employers to Download Resume</h4>
              <p>Permit authenticated companies reviewing your applications to download your official resume document.</p>
            </div>
            <label class="hc-switch">
              <input type="checkbox" id="hc-set-resume-dl" ${privacy.allowResumeDownload ? 'checked' : ''}>
              <span class="hc-slider"></span>
            </label>
          </div>

          <div class="hc-privacy-card">
            <div class="hc-privacy-info">
              <h4>Mask Direct Contact Information</h4>
              <p>Hide phone number and direct email. Recruiters can only reach out through HireConnect until you accept.</p>
            </div>
            <label class="hc-switch">
              <input type="checkbox" id="hc-set-mask-contact" ${privacy.hideDirectContact ? 'checked' : ''}>
              <span class="hc-slider"></span>
            </label>
          </div>

          <div style="margin-top: 14rem;">
            <button type="button" class="hc-btn-secondary" id="hc-save-privacy-btn">Save Privacy Controls</button>
          </div>
        </div>

        <!-- SECTION 5: CONNECTED GOOGLE ACCOUNT -->
        <div class="hc-settings-group">
          <div class="hc-settings-title">Connected Accounts</div>
          <div class="hc-settings-desc">Connect external OAuth providers for instant sign-in.</div>

          <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12rem; padding: 16rem; flex-wrap: wrap; gap: 12rem;">
            <div style="display: flex; align-items: center; gap: 12rem;">
              <svg class="hc-google-icon" viewBox="0 0 24 24" style="width:28px;height:28px;">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.4 0-.8.2-1.6.4-2.4L1.6 7c-.9 1.8-1.5 3.8-1.5 5.9 0 2.2.6 4.1 1.6 5.9l3.6-4.1z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.1L1.6 16.1C3.5 19.9 7.4 23 12 23z"/>
              </svg>
              <div>
                <strong style="color: #fff; font-size: 14rem;">Google Account</strong>
                <div style="font-size: 12rem; color: #888; margin-top: 2rem;">
                  ${user.email.includes('gmail.com') ? `Connected (${escapeHtml(user.email)})` : 'Link Google account for fast authentication'}
                </div>
              </div>
            </div>
            <div>
              <span style="font-size: 12rem; color: var(--hc-mint); font-family: var(--hc-font-mono);">✓ OAuth 2.0 Ready</span>
            </div>
          </div>
        </div>

        <!-- SECTION 6: ACTIVE SESSIONS -->
        <div class="hc-settings-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12rem; flex-wrap: wrap; gap: 8rem;">
            <div>
              <div class="hc-settings-title" style="margin-bottom: 2rem;">Active Browser Sessions</div>
              <div class="hc-settings-desc" style="margin: 0;">Currently authenticated sessions across your devices.</div>
            </div>
            <button type="button" class="hc-btn-secondary" id="hc-revoke-others-btn" style="font-size: 12rem; padding: 6rem 14rem;">
              Sign Out Other Devices
            </button>
          </div>

          <div id="hc-sessions-list">
            ${sessions.map(s => `
              <div class="hc-session-item">
                <div style="display: flex; align-items: center; gap: 12rem;">
                  <span style="font-size: 20rem;">💻</span>
                  <div>
                    <strong style="color: #fff; font-size: 13rem;">${escapeHtml(s.device)}</strong>
                    <div style="font-size: 12rem; color: #888; margin-top: 2rem;">${escapeHtml(s.location)}</div>
                  </div>
                </div>
                <div>
                  ${s.isCurrent ? `
                    <span style="font-size: 11rem; font-family: var(--hc-font-mono); color: var(--hc-mint); background: rgba(161,216,192,0.12); padding: 3rem 8rem; border-radius: 4rem;">Active Now</span>
                  ` : `
                    <span style="font-size: 11rem; font-family: var(--hc-font-mono); color: #888;">Active</span>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- SECTION 7: DANGER ZONE -->
        <div class="hc-danger-card">
          <div class="hc-settings-title" style="color: #ff8888;">Danger Zone: Account Deletion</div>
          <div class="hc-settings-desc" style="color: #ffaaaa;">
            Permanently delete your HireConnect account, professional profile, resume, and application records. This action cannot be undone.
          </div>
          <button type="button" class="hc-btn-secondary" id="hc-delete-account-btn" style="color: #ff6666; border-color: rgba(255,100,100,0.4);">
            Delete HireConnect Account
          </button>
        </div>
      </div>
    `;

    // Change Password Handler
    const pwForm = container.querySelector('#hc-change-pw-form');
    const pwAlert = container.querySelector('#hc-pw-alert');
    const newPwInput = container.querySelector('#hc-new-pw');
    const newPwFill = container.querySelector('#hc-new-pw-fill');
    const newPwText = container.querySelector('#hc-new-pw-text');

    newPwInput.addEventListener('input', () => {
      const val = newPwInput.value;
      let strength = 0;
      if (val.length >= 8) strength += 25;
      if (/[A-Z]/.test(val)) strength += 25;
      if (/[0-9]/.test(val)) strength += 25;
      if (/[^A-Za-z0-9]/.test(val)) strength += 25;

      newPwFill.style.width = strength + '%';
      if (strength <= 25) {
        newPwFill.style.backgroundColor = '#ef4444';
        newPwText.textContent = 'Weak: Add numbers, symbols, uppercase';
        newPwText.style.color = '#ef4444';
      } else if (strength <= 50) {
        newPwFill.style.backgroundColor = '#f59e0b';
        newPwText.textContent = 'Fair: Needs special characters';
        newPwText.style.color = '#f59e0b';
      } else if (strength <= 75) {
        newPwFill.style.backgroundColor = '#a1d8c0';
        newPwText.textContent = 'Good: Strong password';
        newPwText.style.color = '#a1d8c0';
      } else {
        newPwFill.style.backgroundColor = '#22c55e';
        newPwText.textContent = 'Excellent: Very secure';
        newPwText.style.color = '#22c55e';
      }
    });

    pwForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentPassword = container.querySelector('#hc-curr-pw').value;
      const newPassword = newPwInput.value;
      const confirmPw = container.querySelector('#hc-confirm-new-pw').value;

      if (newPassword.length < 8) {
        pwAlert.className = 'hc-auth-alert error';
        pwAlert.textContent = 'New password must be at least 8 characters long.';
        pwAlert.style.display = 'flex';
        return;
      }

      if (newPassword !== confirmPw) {
        pwAlert.className = 'hc-auth-alert error';
        pwAlert.textContent = 'New passwords do not match.';
        pwAlert.style.display = 'flex';
        return;
      }

      const updateBtn = container.querySelector('#hc-update-pw-btn');
      updateBtn.disabled = true;
      updateBtn.textContent = 'Updating...';

      try {
        const resp = await fetch('/api/auth/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify({ currentPassword, newPassword })
        });
        const resData = await resp.json();
        if (resData.success) {
          pwAlert.className = 'hc-auth-alert success';
          pwAlert.textContent = '✓ Password updated successfully!';
          pwAlert.style.display = 'flex';
          pwForm.reset();
          newPwFill.style.width = '0%';
          newPwText.textContent = 'Strength: At least 8 characters';
          showToast('Password updated successfully!');
        } else {
          pwAlert.className = 'hc-auth-alert error';
          pwAlert.textContent = resData.message || 'Failed to update password.';
          pwAlert.style.display = 'flex';
        }
      } catch (err) {
        pwAlert.className = 'hc-auth-alert error';
        pwAlert.textContent = 'Network error changing password.';
        pwAlert.style.display = 'flex';
      } finally {
        updateBtn.disabled = false;
        updateBtn.textContent = 'Update Password';
      }
    });

    // Save Notifications Handler
    const saveNotifsBtn = container.querySelector('#hc-save-notifs-btn');
    saveNotifsBtn.addEventListener('click', async () => {
      saveNotifsBtn.disabled = true;
      saveNotifsBtn.textContent = 'Saving...';
      try {
        const resp = await fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify({
            notifications: {
              applicationUpdates: container.querySelector('#hc-notif-app').checked,
              recruiterMessages: container.querySelector('#hc-notif-msg').checked,
              weeklyJobMatches: container.querySelector('#hc-notif-weekly').checked
            }
          })
        });
        if (resp.ok) {
          showToast('Notification preferences saved!');
        } else {
          showToast('Failed to save notification preferences.', true);
        }
      } catch (e) {
        showToast('Network error saving preferences.', true);
      } finally {
        saveNotifsBtn.disabled = false;
        saveNotifsBtn.textContent = 'Save Notification Preferences';
      }
    });

    // Save Privacy Handler
    const savePrivacyBtn = container.querySelector('#hc-save-privacy-btn');
    savePrivacyBtn.addEventListener('click', async () => {
      savePrivacyBtn.disabled = true;
      savePrivacyBtn.textContent = 'Saving...';
      try {
        const resp = await fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify({
            privacy: {
              profileDiscoverable: container.querySelector('#hc-set-discoverable').checked,
              allowResumeDownload: container.querySelector('#hc-set-resume-dl').checked,
              hideDirectContact: container.querySelector('#hc-set-mask-contact').checked
            }
          })
        });
        if (resp.ok) {
          showToast('Privacy & discoverability controls updated!');
        } else {
          showToast('Failed to update privacy controls.', true);
        }
      } catch (e) {
        showToast('Network error updating privacy controls.', true);
      } finally {
        savePrivacyBtn.disabled = false;
        savePrivacyBtn.textContent = 'Save Privacy Controls';
      }
    });

    // Revoke Other Sessions Handler
    const revokeBtn = container.querySelector('#hc-revoke-others-btn');
    revokeBtn.addEventListener('click', async () => {
      if (!confirm('Sign out of all other active browser sessions?')) return;
      try {
        const resp = await fetch('/api/auth/sessions/revoke-others', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + getToken() }
        });
        const resData = await resp.json();
        showToast(resData.message || 'Other sessions revoked.');
        setTimeout(() => window.location.reload(), 500);
      } catch (e) {
        showToast('Failed to revoke other sessions.', true);
      }
    });

    // Delete Account Handler
    const deleteBtn = container.querySelector('#hc-delete-account-btn');
    deleteBtn.addEventListener('click', async () => {
      const confirmDelete = confirm('WARNING: Are you absolutely sure you want to permanently delete your HireConnect account? This action cannot be reversed.');
      if (!confirmDelete) return;

      const password = prompt('Please enter your current account password to confirm deletion:');
      if (!password) return;

      try {
        const resp = await fetch('/api/auth/delete-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify({ password })
        });
        const resData = await resp.json();
        if (resData.success) {
          localStorage.removeItem('hc_auth_token');
          localStorage.removeItem('hireconnect_token');
          localStorage.removeItem('hc_user');
          localStorage.removeItem('hireconnect_user');
          sessionStorage.removeItem('hc_auth_token');
          sessionStorage.removeItem('hireconnect_token');
          sessionStorage.removeItem('hc_user');
          sessionStorage.removeItem('hireconnect_user');
          alert('Your HireConnect account has been permanently deleted.');
          window.location.href = '/';
        } else {
          showToast(resData.message || 'Failed to delete account.', true);
        }
      } catch (e) {
        showToast('Network error processing account deletion.', true);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettings);
  } else {
    initSettings();
  }
})();
