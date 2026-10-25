/**
 * HireConnect Universal Shared Account Menu & Modals
 * Supports Employee/Candidate Profiles, Recruiter Job Posting & Navigation
 */

(function () {
  'use strict';

  let currentUser = null;
  let userProfile = null;
  let userCompany = null;
  let isCheckingAuth = false;

  function getToken() {
    try {
      const urlToken = new URLSearchParams(window.location.search).get('auth_token');
      if (urlToken) {
        setToken(urlToken, true);
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

  function setToken(token, remember) {
    try {
      localStorage.setItem('hc_auth_token', token);
      localStorage.setItem('hireconnect_token', token);
      sessionStorage.setItem('hc_auth_token', token);
      sessionStorage.setItem('hireconnect_token', token);
    } catch (e) {}
  }

  function clearToken() {
    try {
      localStorage.removeItem('hc_auth_token');
      localStorage.removeItem('hireconnect_token');
      localStorage.removeItem('hireconnect_user');
      localStorage.removeItem('hc_user');
      sessionStorage.removeItem('hc_auth_token');
      sessionStorage.removeItem('hireconnect_token');
    } catch (e) {}
  }

  function showToast(message, isError = false) {
    let container = document.getElementById('hc-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'hc-toast-container';
      container.className = 'hc-toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'hc-toast' + (isError ? ' error' : '');
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  async function checkAuth() {
    const token = getToken();
    if (!token) {
      currentUser = null;
      userProfile = null;
      userCompany = null;
      renderNavWidget();
      return;
    }

    if (isCheckingAuth) return;
    isCheckingAuth = true;

    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (res.ok) {
        const data = await res.json();
        currentUser = data.user;
        userProfile = data.profile;
        userCompany = data.company;
      } else {
        clearToken();
        currentUser = null;
        userProfile = null;
        userCompany = null;
      }
    } catch (e) {
      console.warn('[HireConnect] Auth check offline or failed:', e);
    } finally {
      isCheckingAuth = false;
      renderNavWidget();
    }
  }

  function getInitials(name) {
    if (!name) return 'HC';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function renderFloatingAvatar() {
    let avatarContainer = document.getElementById('hc-floating-avatar-container');
    if (!avatarContainer) {
      avatarContainer = document.createElement('div');
      avatarContainer.id = 'hc-floating-avatar-container';
      document.body.appendChild(avatarContainer);
    }

    const oldWidget = document.getElementById('hc-nav-account-widget');
    if (oldWidget) oldWidget.remove();

    const role = currentUser ? (currentUser.role === 'admin' ? 'admin' : (currentUser.role === 'recruiter' ? 'recruiter' : 'candidate')) : 'guest';
    const name = currentUser ? currentUser.name : '';
    const email = currentUser ? currentUser.email : '';
    const avatarUrl = (currentUser && currentUser.avatarUrl) || (userProfile && userProfile.avatarUrl) || '';
    const initials = currentUser ? getInitials(currentUser.name) : 'HC';

    let avatarInner = '';
    if (currentUser) {
      if (avatarUrl) {
        avatarInner = `<img src="${escapeHtml(avatarUrl)}" class="hc-nav-avatar-img" alt="${escapeHtml(name)}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" /><span class="hc-nav-avatar-initials ${role}" style="display:none;">${escapeHtml(initials)}</span>`;
      } else {
        avatarInner = `<span class="hc-nav-avatar-initials ${role}">${escapeHtml(initials)}</span>`;
      }
    } else {
      avatarInner = `<svg class="hc-nav-avatar-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
    }

    let dropdownHtml = '';
    if (!currentUser) {
      dropdownHtml = `
        <div class="hc-dropdown-header guest">
          <div class="hc-dh-tag">HireConnect Account</div>
          <div class="hc-dh-sub">Sign in to manage verified applications &amp; hiring.</div>
        </div>
        <a href="/about/?role=employee" class="hc-dropdown-item">
          <span class="hc-di-icon">👤</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Sign In as Candidate</span>
            <span class="hc-di-sub">Job Seeker Portal</span>
          </div>
        </a>
        <a href="/about/?role=recruiter" class="hc-dropdown-item">
          <span class="hc-di-icon">🏢</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Sign In as Recruiter</span>
            <span class="hc-di-sub">Employer &amp; Hiring Teams</span>
          </div>
        </a>
        <div class="hc-dropdown-divider"></div>
        <a href="/signup/?role=employee" class="hc-dropdown-item highlight">
          <span class="hc-di-icon">✨</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Create Candidate Account</span>
            <span class="hc-di-sub">Direct access to tech roles</span>
          </div>
        </a>
        <a href="/signup/?role=recruiter" class="hc-dropdown-item">
          <span class="hc-di-icon">💼</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Create Employer Account</span>
            <span class="hc-di-sub">Post jobs &amp; book meetings</span>
          </div>
        </a>
      `;
    } else if (role === 'admin') {
      dropdownHtml = `
        <div class="hc-dropdown-header">
          <div class="hc-dh-name">${escapeHtml(name)}</div>
          <div class="hc-dh-email">${escapeHtml(email)}</div>
          <div class="hc-dh-tag" style="color: #a855f7; border-color: rgba(168, 85, 247, 0.3);">Platform Administrator</div>
        </div>
        <a href="/admin/" class="hc-dropdown-item highlight">
          <span class="hc-di-icon">🛡️</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Admin Dashboard</span>
            <span class="hc-di-sub">Platform metrics &amp; governance</span>
          </div>
        </a>
        <a href="/admin/?tab=users" class="hc-dropdown-item">
          <span class="hc-di-icon">👥</span>
          <div class="hc-di-text">
            <span class="hc-di-title">User Governance</span>
            <span class="hc-di-sub">Manage &amp; suspend accounts</span>
          </div>
        </a>
        <a href="/admin/?tab=verification" class="hc-dropdown-item">
          <span class="hc-di-icon">🏢</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Company Verification</span>
            <span class="hc-di-sub">Review corporate queue</span>
          </div>
        </a>
        <a href="/admin/?tab=jobs" class="hc-dropdown-item">
          <span class="hc-di-icon">📋</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Job Moderation</span>
            <span class="hc-di-sub">Listing removal &amp; restore</span>
          </div>
        </a>
        <a href="/admin/?tab=audit" class="hc-dropdown-item">
          <span class="hc-di-icon">📜</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Audit Logs</span>
            <span class="hc-di-sub">System action trail</span>
          </div>
        </a>
        <div class="hc-dropdown-divider"></div>
        <button type="button" class="hc-dropdown-item danger" id="hc-floating-logout-btn">
          <span class="hc-di-icon">🚪</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Sign Out</span>
            <span class="hc-di-sub">Terminate active session</span>
          </div>
        </button>
      `;
    } else if (role === 'candidate') {
      dropdownHtml = `
        <div class="hc-dropdown-header">
          <div class="hc-dh-name">${escapeHtml(name)}</div>
          <div class="hc-dh-email">${escapeHtml(email)}</div>
          <div class="hc-dh-tag">Job Seeker / Candidate</div>
        </div>
        <a href="/profile/" class="hc-dropdown-item">
          <span class="hc-di-icon">👤</span>
          <div class="hc-di-text">
            <span class="hc-di-title">My Profile</span>
            <span class="hc-di-sub">Skills, experience &amp; summary</span>
          </div>
        </a>
        <a href="/profile/?tab=resume" class="hc-dropdown-item">
          <span class="hc-di-icon">📄</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Resume Management</span>
            <span class="hc-di-sub">Upload or replace document</span>
          </div>
        </a>
        <a href="/services/?tab=applications" class="hc-dropdown-item">
          <span class="hc-di-icon">📑</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Applications &amp; Saved</span>
            <span class="hc-di-sub">Track application status</span>
          </div>
        </a>
        <a href="/settings/" class="hc-dropdown-item">
          <span class="hc-di-icon">⚙️</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Account Settings</span>
            <span class="hc-di-sub">Security, password &amp; sessions</span>
          </div>
        </a>
        <div class="hc-dropdown-divider"></div>
        <button type="button" class="hc-dropdown-item danger" id="hc-floating-logout-btn">
          <span class="hc-di-icon">🚪</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Sign Out</span>
            <span class="hc-di-sub">Terminate active session</span>
          </div>
        </button>
      `;
    } else {
      const compName = userCompany ? userCompany.name : (userProfile && userProfile.companyName ? userProfile.companyName : 'Tech Employer');
      dropdownHtml = `
        <div class="hc-dropdown-header">
          <div class="hc-dh-name">${escapeHtml(name)}</div>
          <div class="hc-dh-email">${escapeHtml(email)}</div>
          <div class="hc-dh-comp">${escapeHtml(compName)}</div>
        </div>
        <a href="/profile/" class="hc-dropdown-item">
          <span class="hc-di-icon">🏢</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Recruiter Profile</span>
            <span class="hc-di-sub">Corporate &amp; team details</span>
          </div>
        </a>
        <a href="/approach/?tab=jobs" class="hc-dropdown-item">
          <span class="hc-di-icon">📋</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Manage Jobs</span>
            <span class="hc-di-sub">Post &amp; edit openings</span>
          </div>
        </a>
        <a href="/approach/?tab=candidates" class="hc-dropdown-item">
          <span class="hc-di-icon">🔍</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Candidate Discovery</span>
            <span class="hc-di-sub">Verified talent search</span>
          </div>
        </a>
        <a href="/settings/" class="hc-dropdown-item">
          <span class="hc-di-icon">⚙️</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Account Settings</span>
            <span class="hc-di-sub">Security &amp; team access</span>
          </div>
        </a>
        <div class="hc-dropdown-divider"></div>
        <button type="button" class="hc-dropdown-item danger" id="hc-floating-logout-btn">
          <span class="hc-di-icon">🚪</span>
          <div class="hc-di-text">
            <span class="hc-di-title">Sign Out</span>
            <span class="hc-di-sub">Terminate active session</span>
          </div>
        </button>
      `;
    }

    avatarContainer.innerHTML = `
      <div class="hc-nav-account-widget">
        ${currentUser ? `
          <div class="hc-notif-bell-wrap">
            <button type="button" class="hc-notif-bell-btn" id="hc-notif-bell-btn" aria-label="Notifications" title="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span class="hc-notif-badge" id="hc-notif-badge" style="display: none;">0</span>
            </button>
            <div class="hc-notif-dropdown" id="hc-notif-dropdown">
              <div class="hc-notif-header">
                <span class="hc-notif-header-title">Notifications</span>
                <button type="button" class="hc-notif-mark-all" id="hc-notif-mark-all">Mark all read</button>
              </div>
              <div class="hc-notif-list" id="hc-notif-list">
                <div class="hc-notif-loading" style="padding: 24px; text-align: center; color: #9a9a9a; font-size: 13px;">Loading notifications...</div>
              </div>
            </div>
          </div>
        ` : ''}
        <button type="button" class="hc-nav-avatar-btn ${role}" id="hc-floating-avatar-btn" aria-label="HireConnect Account Menu" title="${currentUser ? escapeHtml(name) : 'Account Options'}">
          ${avatarInner}
          <span class="hc-nav-status-dot ${role}"></span>
        </button>
        <div class="hc-account-dropdown" id="hc-floating-dropdown">
          ${dropdownHtml}
        </div>
      </div>
    `;

    const avatarBtn = avatarContainer.querySelector('#hc-floating-avatar-btn');
    const dropdown = avatarContainer.querySelector('#hc-floating-dropdown');
    const notifBellBtn = avatarContainer.querySelector('#hc-notif-bell-btn');
    const notifDropdown = avatarContainer.querySelector('#hc-notif-dropdown');
    const markAllBtn = avatarContainer.querySelector('#hc-notif-mark-all');

    if (notifBellBtn && notifDropdown) {
      notifBellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dropdown) dropdown.classList.remove('show');
        const isOpen = notifDropdown.classList.toggle('show');
        if (isOpen) {
          loadNotifications();
        }
      });

      if (markAllBtn) {
        markAllBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const token = getToken();
          if (!token) return;
          try {
            await fetch('/api/notifications/read-all', {
              method: 'PATCH',
              headers: { 'Authorization': 'Bearer ' + token }
            });
            fetchUnreadCount();
            loadNotifications();
          } catch (err) {}
        });
      }

      // Initial unread count fetch and start interval
      fetchUnreadCount();
      if (!window.__hcNotifPollInterval) {
        window.__hcNotifPollInterval = setInterval(fetchUnreadCount, 30000);
      }
    }

    if (avatarBtn && dropdown) {
      avatarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (notifDropdown) notifDropdown.classList.remove('show');
        dropdown.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
        if (!avatarContainer.contains(e.target)) {
          dropdown.classList.remove('show');
          if (notifDropdown) notifDropdown.classList.remove('show');
        }
      });
    }

    const logoutBtn = avatarContainer.querySelector('#hc-floating-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST', headers: { 'Authorization': 'Bearer ' + getToken() } });
        } catch (e) {}
        clearToken();
        localStorage.removeItem('hireconnect_token');
        localStorage.removeItem('hireconnect_user');
        window.location.href = '/about/';
      });
    }

    const myAppsLink = avatarContainer.querySelector('a[href*="tab=applications"]');
    if (myAppsLink) {
      myAppsLink.addEventListener('click', (e) => {
        if (window.location.pathname.includes('/services') || window.location.pathname === '/') {
          e.preventDefault();
          dropdown.classList.remove('show');
          openMyApplicationsModal();
        }
      });
    }

    if (new URLSearchParams(window.location.search).get('open_menu') === '1' && dropdown) {
      setTimeout(() => dropdown.classList.add('show'), 200);
    }

    if (new URLSearchParams(window.location.search).get('tab') === 'applications') {
      setTimeout(() => openMyApplicationsModal(), 300);
    }

    // Ensure all navbar and drawer links remain visible and naturally styled
    document.querySelectorAll('#nav ._items_p8o7m_41 a[href="/about/"], ._menu_1lkeu_1 ._items_1lkeu_28 a[href="/about/"]').forEach(el => {
      el.style.display = '';
    });

    // If authenticated, update the Sign In link to show Account / Profile access
    const signinLinks = document.querySelectorAll('#nav ._items_p8o7m_41 a[href="/about/"], ._menu_1lkeu_1 ._items_1lkeu_28 a[href="/about/"]');
    signinLinks.forEach(a => {
      const scrambleDiv = a.querySelector('._scrambleText_gjmr7_1');
      if (currentUser) {
        const displayName = currentUser.role === 'recruiter' ? 'Recruiter' : 'Profile';
        if (scrambleDiv) {
          scrambleDiv.setAttribute('data-text', displayName);
          const spans = scrambleDiv.querySelectorAll('span');
          if (spans.length >= 2) {
            spans[0].textContent = displayName;
            spans[1].textContent = displayName;
          }
        }
        a.setAttribute('href', '/profile/');
        a.setAttribute('title', currentUser.name + ' (' + currentUser.email + ')');
      } else {
        if (scrambleDiv) {
          scrambleDiv.setAttribute('data-text', 'Sign In');
          const spans = scrambleDiv.querySelectorAll('span');
          if (spans.length >= 2) {
            spans[0].textContent = 'Sign In';
            spans[1].textContent = 'Sign In';
          }
        }
        a.setAttribute('href', '/about/');
        a.removeAttribute('title');
      }
    });

    if (currentUser) {
      document.body.classList.add('hc-authenticated');
    } else {
      document.body.classList.remove('hc-authenticated');
    }

    if (new URLSearchParams(window.location.search).get('open_booking') === '1') {
      setTimeout(() => openBookingModal(), 200);
    }

    if (new URLSearchParams(window.location.search).get('open_booking_slot') === '1') {
      setTimeout(() => {
        openBookingModal();
        setTimeout(() => {
          const firstChip = document.querySelector('.hc-sched-slot-chip:not(.booked)');
          if (firstChip) {
            firstChip.click();
            setTimeout(() => {
              const card = document.querySelector('.hc-sched-card');
              if (card) card.scrollTop = 380;
            }, 300);
          }
        }, 600);
      }, 200);
    }

    if (new URLSearchParams(window.location.search).get('open_booking_confirmed') === '1') {
      setTimeout(() => {
        openBookingModal();
        setTimeout(() => {
          const bodyContainer = document.getElementById('hc-booking-body');
          const mockMeeting = {
            reference: 'HC-MEET-820194',
            hostName: 'Neil Bhargava',
            hostRole: 'Principal Recruiter & Talent Lead',
            name: currentUser ? currentUser.name : 'Vikramaditya Sharma',
            email: currentUser ? currentUser.email : 'vikram@company.com',
            date: '2026-10-28',
            timeSlot: '10:00 AM - 10:15 AM',
            timezone: 'Asia/Kolkata',
            durationMinutes: 15,
            videoUrl: 'https://meet.hireconnect.io/room-hc-meet-820194'
          };
          if (bodyContainer) {
            bodyContainer.innerHTML = `
              <div class="hc-sched-confirmed-view">
                <div class="hc-sched-confirm-badge-icon">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 class="hc-sched-confirmed-title">Your meeting is confirmed</h3>
                <p class="hc-sched-confirmed-sub">
                  A calendar invitation and Google Meet video conference link have been sent to <strong>${escapeHtml(mockMeeting.email)}</strong>.
                </p>

                <div class="hc-sched-ref-pill">Reference: ${escapeHtml(mockMeeting.reference)}</div>

                <div class="hc-sched-confirmed-card">
                  <div class="hc-sched-cc-row">
                    <span class="hc-sched-cc-label">Host</span>
                    <strong class="hc-sched-cc-val">${escapeHtml(mockMeeting.hostName)} (${escapeHtml(mockMeeting.hostRole)})</strong>
                  </div>
                  <div class="hc-sched-cc-row">
                    <span class="hc-sched-cc-label">Date &amp; Time</span>
                    <strong class="hc-sched-cc-val">${escapeHtml(mockMeeting.date)} · ${escapeHtml(mockMeeting.timeSlot)} (${escapeHtml(mockMeeting.timezone)})</strong>
                  </div>
                  <div class="hc-sched-cc-row">
                    <span class="hc-sched-cc-label">Duration</span>
                    <strong class="hc-sched-cc-val">15 Minutes</strong>
                  </div>
                  <div class="hc-sched-cc-row">
                    <span class="hc-sched-cc-label">Format</span>
                    <strong class="hc-sched-cc-val">Web Conference (Instant HD Google Meet)</strong>
                  </div>
                </div>

                <a href="${escapeHtml(mockMeeting.videoUrl)}" target="_blank" class="hc-sched-join-btn">
                  Join Video Room &rarr;
                </a>

                <div class="hc-sched-actions-row">
                  <button type="button" class="hc-sched-action-btn primary" id="hc-sched-mock-cal">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    Add to Calendar
                  </button>
                  <button type="button" class="hc-sched-action-btn" id="hc-sched-mock-resched">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
                    Reschedule Meeting
                  </button>
                  <button type="button" class="hc-sched-action-btn danger" id="hc-sched-mock-cancel">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    Cancel Meeting
                  </button>
                  <button type="button" class="hc-sched-action-btn" id="hc-sched-mock-close">
                    Close
                  </button>
                </div>
              </div>
            `;
            const overlay = document.getElementById('hc-booking-modal');
            const calBtn = document.getElementById('hc-sched-mock-cal');
            if (calBtn) {
              calBtn.addEventListener('click', () => {
                downloadIcsCalendar(mockMeeting);
                openGoogleCalendar(mockMeeting);
              });
            }
            const reschedBtn = document.getElementById('hc-sched-mock-resched');
            if (reschedBtn) {
              reschedBtn.addEventListener('click', () => {
                openBookingModal(null, true, mockMeeting.reference);
              });
            }
            const closeBtn = document.getElementById('hc-sched-mock-close');
            if (closeBtn && overlay) {
              closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
            }
          }
        }, 150);
      }, 200);
    }
  }

  const renderNavWidget = renderFloatingAvatar;

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==================== NOTIFICATIONS CLIENT (PHASE 9) ====================
  async function fetchUnreadCount() {
    const token = getToken();
    if (!token || !currentUser) return;
    try {
      const res = await fetch('/api/notifications/unread-count', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) return;
      const data = await res.json();
      const badge = document.getElementById('hc-notif-badge');
      if (badge) {
        if (data.unreadCount > 0) {
          badge.textContent = data.unreadCount > 99 ? '99+' : data.unreadCount;
          badge.style.display = 'flex';
        } else {
          badge.style.display = 'none';
        }
      }
    } catch (e) {}
  }

  async function loadNotifications() {
    const listEl = document.getElementById('hc-notif-list');
    if (!listEl) return;
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch('/api/notifications?limit=10', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) {
        listEl.innerHTML = '<div class="hc-notif-empty">Failed to load notifications.</div>';
        return;
      }
      const data = await res.json();
      const notifications = data.notifications || [];

      if (notifications.length === 0) {
        listEl.innerHTML = '<div class="hc-notif-empty">No notifications yet.</div>';
        return;
      }

      listEl.innerHTML = notifications.map(n => {
        const isUnread = !n.readAt;
        const icon = getNotifIcon(n.type);
        const timeAgo = formatTimeAgo(n.createdAt);
        return `
          <div class="hc-notif-item ${isUnread ? 'unread' : ''}" data-id="${escapeHtml(n.id)}" data-url="${escapeHtml(n.actionUrl || '')}">
            <div class="hc-notif-icon-box">${icon}</div>
            <div class="hc-notif-content">
              <div class="hc-notif-title">${escapeHtml(n.title)}</div>
              <div class="hc-notif-msg">${escapeHtml(n.message)}</div>
              <div class="hc-notif-time">${escapeHtml(timeAgo)}</div>
            </div>
          </div>
        `;
      }).join('');

      listEl.querySelectorAll('.hc-notif-item').forEach(item => {
        item.addEventListener('click', async () => {
          const notifId = item.getAttribute('data-id');
          const targetUrl = item.getAttribute('data-url');
          if (item.classList.contains('unread')) {
            try {
              await fetch(`/api/notifications/${notifId}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': 'Bearer ' + token }
              });
              item.classList.remove('unread');
              fetchUnreadCount();
            } catch (e) {}
          }
          const notifDropdown = document.getElementById('hc-notif-dropdown');
          if (notifDropdown) notifDropdown.classList.remove('show');
          if (targetUrl && targetUrl !== '/') {
            if (targetUrl.startsWith('/meetings')) {
              openBookingModal();
            } else if (targetUrl.startsWith('/applications')) {
              openMyApplicationsModal();
            } else {
              window.location.href = targetUrl;
            }
          }
        });
      });
    } catch (err) {
      listEl.innerHTML = '<div class="hc-notif-empty">Error loading notifications.</div>';
    }
  }

  function getNotifIcon(type) {
    switch (type) {
      case 'interview_booked':
      case 'interview_rescheduled':
      case 'interview_reminder':
        return '📅';
      case 'interview_cancelled':
        return '❌';
      case 'application_submitted':
      case 'new_applicant':
        return '📝';
      case 'application_status_changed':
        return '🔄';
      case 'application_withdrawn':
        return '↩️';
      case 'job_published':
      case 'job_closed':
        return '💼';
      case 'company_verification_updated':
        return '🛡️';
      default:
        return '🔔';
    }
  }

  function formatTimeAgo(dateStr) {
    if (!dateStr) return '';
    const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  }

  // ==================== CANDIDATE PROFILE MODAL ====================
  function openCandidateProfileModal() {
    let overlay = document.getElementById('hc-candidate-profile-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'hc-candidate-profile-modal';
      overlay.className = 'hc-modal-overlay';
      document.body.appendChild(overlay);
    }

    const p = userProfile || {
      name: currentUser ? currentUser.name : '',
      email: currentUser ? currentUser.email : '',
      headline: '',
      location: 'Bengaluru, Karnataka',
      phone: '',
      summary: '',
      desiredTitles: ['Software Engineer'],
      expectedSalary: '₹30–45 LPA',
      noticePeriod: '30 Days',
      skills: [{ name: 'React', level: 'Expert', category: 'Frontend' }],
      experience: [],
      education: [],
      privacy: { isDiscoverable: false, allowResumeDownload: true, hideContactInfo: false },
      completionPercentage: 80
    };

    overlay.innerHTML = `
      <div class="hc-modal-card">
        <div class="hc-modal-header">
          <div class="hc-modal-title-box">
            <div class="hc-modal-title-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div>
              <h3 class="hc-modal-title">Candidate Profile &amp; Resume</h3>
              <div class="hc-modal-subtitle">${escapeHtml(p.headline || 'Maintain your professional profile & privacy settings')}</div>
            </div>
          </div>
          <button type="button" class="hc-modal-close-btn" id="hc-modal-profile-close">&times;</button>
        </div>

        <div class="hc-modal-tabs-bar">
          <button type="button" class="hc-modal-tab active" data-tab="tab-basic">Personal &amp; Bio</button>
          <button type="button" class="hc-modal-tab" data-tab="tab-skills">Skills &amp; Tech</button>
          <button type="button" class="hc-modal-tab" data-tab="tab-experience">Experience &amp; Edu</button>
          <button type="button" class="hc-modal-tab" data-tab="tab-resume">Resume Management</button>
          <button type="button" class="hc-modal-tab" data-tab="tab-privacy">Privacy Settings</button>
        </div>

        <div class="hc-modal-body">
          <div class="hc-completion-box">
            <div class="hc-cb-header">
              <span>Profile Strength</span>
              <strong id="hc-score-label">${p.completionPercentage || 85}% Complete</strong>
            </div>
            <div class="hc-cb-track">
              <div class="hc-cb-bar" id="hc-score-bar" style="width: ${p.completionPercentage || 85}%;"></div>
            </div>
          </div>

          <!-- TAB 1: BASIC -->
          <div class="hc-tab-content active" id="tab-basic">
            <div class="hc-form-grid">
              <div class="hc-form-group">
                <label class="hc-form-label">Full Name</label>
                <input type="text" class="hc-form-input" id="hc-p-name" value="${escapeHtml(p.name || '')}">
              </div>
              <div class="hc-form-group">
                <label class="hc-form-label">Professional Headline</label>
                <input type="text" class="hc-form-input" id="hc-p-headline" value="${escapeHtml(p.headline || '')}" placeholder="e.g. Senior Frontend Engineer | React • Next.js">
              </div>
              <div class="hc-form-group">
                <label class="hc-form-label">Location (City, State)</label>
                <input type="text" class="hc-form-input" id="hc-p-location" value="${escapeHtml(p.location || 'Bengaluru, Karnataka')}">
              </div>
              <div class="hc-form-group">
                <label class="hc-form-label">Contact Phone</label>
                <input type="text" class="hc-form-input" id="hc-p-phone" value="${escapeHtml(p.phone || '+91 98765 43210')}">
              </div>
              <div class="hc-form-group">
                <label class="hc-form-label">Contact Email</label>
                <input type="email" class="hc-form-input" id="hc-p-email" value="${escapeHtml(p.contactEmail || p.email || '')}">
              </div>
              <div class="hc-form-group">
                <label class="hc-form-label">Notice Period</label>
                <select class="hc-form-select" id="hc-p-notice">
                  <option value="Immediate" ${p.noticePeriod === 'Immediate' ? 'selected' : ''}>Immediate (0 Days)</option>
                  <option value="15 Days" ${p.noticePeriod === '15 Days' ? 'selected' : ''}>15 Days</option>
                  <option value="30 Days" ${p.noticePeriod === '30 Days' ? 'selected' : ''}>30 Days</option>
                  <option value="60 Days" ${p.noticePeriod === '60 Days' ? 'selected' : ''}>60 Days</option>
                  <option value="90 Days" ${p.noticePeriod === '90 Days' ? 'selected' : ''}>90 Days</option>
                </select>
              </div>
              <div class="hc-form-group">
                <label class="hc-form-label">Expected Salary (CTC)</label>
                <input type="text" class="hc-form-input" id="hc-p-salary" value="${escapeHtml(p.expectedSalary || '₹32 - 45 LPA')}">
              </div>
              <div class="hc-form-group">
                <label class="hc-form-label">Desired Job Title</label>
                <input type="text" class="hc-form-input" id="hc-p-desired-titles" value="${escapeHtml(Array.isArray(p.desiredTitles) ? p.desiredTitles.join(', ') : (p.desiredTitles || ''))}">
              </div>
            </div>
            <div class="hc-form-group" style="margin-top: 14rem;">
              <label class="hc-form-label">Professional Summary</label>
              <textarea class="hc-form-textarea" id="hc-p-summary" rows="3" placeholder="Brief overview of your experience, architectural achievements, and technical passions.">${escapeHtml(p.summary || '')}</textarea>
            </div>
          </div>

          <!-- TAB 2: SKILLS -->
          <div class="hc-tab-content" id="tab-skills" style="display: none;">
            <div style="display: flex; gap: 8rem; margin-bottom: 16rem;">
              <input type="text" class="hc-form-input" id="hc-new-skill-name" placeholder="Skill name (e.g. TypeScript, Kafka)" style="flex: 2;">
              <select class="hc-form-select" id="hc-new-skill-level" style="flex: 1;">
                <option value="Expert">Expert</option>
                <option value="Advanced">Advanced</option>
                <option value="Intermediate">Intermediate</option>
              </select>
              <button type="button" class="hc-btn-primary" id="hc-add-skill-btn">+ Add Skill</button>
            </div>
            <div id="hc-skills-list" style="display: flex; flex-wrap: wrap; gap: 8rem;">
              ${(p.skills || []).map((s, idx) => `
                <div class="hc-skill-pill" data-idx="${idx}" style="display: inline-flex; align-items: center; gap: 6rem; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 9999px; padding: 6rem 14rem; font-size: 13rem; color: #f7f5f2;">
                  <span>${escapeHtml(s.name)}</span>
                  <span style="font-size: 10rem; font-family: var(--hc-font-mono); color: var(--hc-mint); background: rgba(161,216,192,0.12); padding: 2rem 6rem; border-radius: 4rem;">${escapeHtml(s.level)}</span>
                  <button type="button" class="hc-remove-skill" data-idx="${idx}" style="background: none; border: none; color: #888; cursor: pointer; font-size: 14rem; line-height: 1;">&times;</button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- TAB 3: EXPERIENCE -->
          <div class="hc-tab-content" id="tab-experience" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14rem;">
              <h4 style="margin: 0; color: #fff; font-size: 15rem;">Work History</h4>
              <button type="button" class="hc-btn-secondary" id="hc-add-exp-btn" style="font-size: 12rem; padding: 6rem 14rem;">+ Add Role</button>
            </div>
            <div id="hc-exp-list">
              ${(p.experience || []).length === 0 ? '<p style="color: #777; font-size: 13rem;">No work history recorded yet. Click Add Role to include previous companies.</p>' : ''}
              ${(p.experience || []).map((exp, idx) => `
                <div class="hc-exp-card" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12rem; padding: 14rem; margin-bottom: 12rem;">
                  <div style="display: flex; justify-content: space-between;">
                    <strong style="color: #f7f5f2; font-size: 14rem;">${escapeHtml(exp.title)}</strong>
                    <span style="font-size: 12rem; color: var(--hc-mint); font-family: var(--hc-font-mono);">${escapeHtml(exp.startDate)} — ${exp.current ? 'Present' : escapeHtml(exp.endDate || '')}</span>
                  </div>
                  <div style="font-size: 13rem; color: var(--hc-text-secondary); margin: 2rem 0 6rem;">${escapeHtml(exp.company)} • ${escapeHtml(exp.location || 'India')}</div>
                  <div style="font-size: 13rem; color: #bbb; line-height: 1.4;">${escapeHtml(exp.description || '')}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- TAB 4: RESUME -->
          <div class="hc-tab-content" id="tab-resume" style="display: none;">
            <div id="hc-current-resume-box">
              ${p.resume ? `
                <div style="background: rgba(161,216,192,0.06); border: 1px solid rgba(161,216,192,0.25); border-radius: 14rem; padding: 18rem; margin-bottom: 18rem; display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 14rem;">
                    <div style="width: 44rem; height: 44rem; border-radius: 10rem; background: rgba(161,216,192,0.15); display: flex; align-items: center; justify-content: center; color: var(--hc-mint);">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    </div>
                    <div>
                      <div style="font-size: 15rem; font-weight: 600; color: #fff;">${escapeHtml(p.resume.fileName || 'Resume.pdf')}</div>
                      <div style="font-size: 12rem; color: var(--hc-text-secondary); margin-top: 2rem;">Uploaded • ${(p.resume.fileSize ? Math.round(p.resume.fileSize / 1024) + ' KB' : 'PDF Document')}</div>
                    </div>
                  </div>
                  <div style="display: flex; gap: 8rem;">
                    <a href="${p.resume.fileUrl || '/api/profile/resume/download/' + p.userId}" class="hc-btn-secondary" style="font-size: 12rem; padding: 8rem 14rem; text-decoration: none;" download>Download</a>
                    <button type="button" class="hc-btn-secondary" id="hc-btn-delete-resume" style="color: #ff7777; border-color: rgba(255,100,100,0.3); font-size: 12rem; padding: 8rem 14rem;">Delete</button>
                  </div>
                </div>
              ` : `
                <div style="text-align: center; padding: 24rem; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.12); border-radius: 14rem; margin-bottom: 18rem;">
                  <p style="color: #888; font-size: 14rem; margin-bottom: 8rem;">No resume attached to your profile.</p>
                  <span style="font-size: 12rem; color: #666;">Upload your resume in PDF or DOCX format (Max 5MB)</span>
                </div>
              `}
            </div>

            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14rem; padding: 18rem;">
              <h4 style="margin: 0 0 8rem; color: #fff; font-size: 14rem;">Upload or Replace Resume</h4>
              <p style="font-size: 12rem; color: var(--hc-text-secondary); margin-bottom: 14rem;">Supported file formats: PDF or DOCX. Maximum file size: 5MB.</p>
              <input type="file" id="hc-resume-file-input" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style="display: none;">
              <button type="button" class="hc-btn-secondary" id="hc-select-resume-btn" style="width: 100%; justify-content: center; padding: 14rem;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <span>Select Resume File from Computer</span>
              </button>
              <div id="hc-upload-status" style="margin-top: 10rem; font-size: 12rem; color: var(--hc-mint); text-align: center;"></div>
            </div>
          </div>

          <!-- TAB 5: PRIVACY (Strict Principle A) -->
          <div class="hc-tab-content" id="tab-privacy" style="display: none;">
            <div class="hc-privacy-card">
              <div class="hc-privacy-info">
                <h4>Make Profile Discoverable to Recruiters</h4>
                <p>When turned on, authorized recruiters can find your profile in candidate discovery based on your tech stack. <strong>By default, profiles are strictly private.</strong></p>
              </div>
              <label class="hc-switch">
                <input type="checkbox" id="hc-p-discoverable" ${p.privacy && p.privacy.isDiscoverable ? 'checked' : ''}>
                <span class="hc-slider"></span>
              </label>
            </div>

            <div class="hc-privacy-card">
              <div class="hc-privacy-info">
                <h4>Allow Verified Employers to Download Resume</h4>
                <p>Permit authenticated hiring teams reviewing your applications or discoverable profile to download your official resume document.</p>
              </div>
              <label class="hc-switch">
                <input type="checkbox" id="hc-p-allow-resume" ${p.privacy && p.privacy.allowResumeDownload ? 'checked' : ''}>
                <span class="hc-slider"></span>
              </label>
            </div>

            <div class="hc-privacy-card">
              <div class="hc-privacy-info">
                <h4>Hide Direct Phone &amp; Email</h4>
                <p>Mask your direct phone number and email address. Recruiters must send an interview request through HireConnect to reveal contact information.</p>
              </div>
              <label class="hc-switch">
                <input type="checkbox" id="hc-p-hide-contact" ${p.privacy && p.privacy.hideContactInfo ? 'checked' : ''}>
                <span class="hc-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="hc-modal-footer">
          <button type="button" class="hc-btn-secondary" id="hc-btn-cancel-profile">Cancel</button>
          <button type="button" class="hc-btn-primary" id="hc-btn-save-profile">Save Profile Changes</button>
        </div>
      </div>
    `;

    // Modal tabs interaction
    const tabs = overlay.querySelectorAll('.hc-modal-tab');
    const contents = overlay.querySelectorAll('.hc-tab-content');
    tabs.forEach(t => {
      t.addEventListener('click', () => {
        tabs.forEach(x => x.classList.remove('active'));
        contents.forEach(c => c.style.display = 'none');
        t.classList.add('active');
        const target = overlay.querySelector('#' + t.dataset.tab);
        if (target) target.style.display = 'block';
      });
    });

    // Close logic
    const closeBtn = overlay.querySelector('#hc-modal-profile-close');
    const cancelBtn = overlay.querySelector('#hc-btn-cancel-profile');
    const closeModal = () => overlay.classList.remove('open');
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Skill add/remove
    const addSkillBtn = overlay.querySelector('#hc-add-skill-btn');
    const skillNameInput = overlay.querySelector('#hc-new-skill-name');
    const skillLevelInput = overlay.querySelector('#hc-new-skill-level');
    const skillsList = overlay.querySelector('#hc-skills-list');

    addSkillBtn.addEventListener('click', () => {
      const name = skillNameInput.value.trim();
      if (!name) return;
      if (!p.skills) p.skills = [];
      p.skills.push({ name, level: skillLevelInput.value, category: 'Technical' });
      skillNameInput.value = '';
      renderSkills();
    });

    function renderSkills() {
      skillsList.innerHTML = (p.skills || []).map((s, idx) => `
        <div class="hc-skill-pill" data-idx="${idx}" style="display: inline-flex; align-items: center; gap: 6rem; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 9999px; padding: 6rem 14rem; font-size: 13rem; color: #f7f5f2;">
          <span>${escapeHtml(s.name)}</span>
          <span style="font-size: 10rem; font-family: var(--hc-font-mono); color: var(--hc-mint); background: rgba(161,216,192,0.12); padding: 2rem 6rem; border-radius: 4rem;">${escapeHtml(s.level)}</span>
          <button type="button" class="hc-remove-skill" data-idx="${idx}" style="background: none; border: none; color: #888; cursor: pointer; font-size: 14rem; line-height: 1;">&times;</button>
        </div>
      `).join('');
      skillsList.querySelectorAll('.hc-remove-skill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.target.dataset.idx, 10);
          p.skills.splice(idx, 1);
          renderSkills();
        });
      });
    }

    renderSkills();

    // Resume file upload
    const fileInput = overlay.querySelector('#hc-resume-file-input');
    const selectFileBtn = overlay.querySelector('#hc-select-resume-btn');
    const uploadStatus = overlay.querySelector('#hc-upload-status');
    const deleteResumeBtn = overlay.querySelector('#hc-btn-delete-resume');

    selectFileBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      if (!file) return;

      const validExts = ['.pdf', '.docx'];
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();
      if (!validExts.includes(fileExt)) {
        showToast('Please upload a PDF or DOCX file only.', true);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast('File size exceeds the 5MB limit.', true);
        return;
      }

      uploadStatus.textContent = 'Uploading ' + file.name + '...';

      // Read as base64 or upload metadata
      const reader = new FileReader();
      reader.onload = async () => {
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
              contentText: `${p.name} - Official Resume (${file.name})`
            })
          });
          const data = await res.json();
          if (data.success) {
            uploadStatus.textContent = '✓ Resume uploaded successfully!';
            showToast('Resume uploaded and verified!');
            p.resume = data.resume;
            setTimeout(() => openCandidateProfileModal(), 800);
          } else {
            uploadStatus.textContent = data.message || 'Upload failed.';
            showToast(data.message || 'Upload failed.', true);
          }
        } catch (err) {
          uploadStatus.textContent = 'Network error uploading resume.';
        }
      };
      reader.readAsDataURL(file);
    });

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
            p.resume = null;
            openCandidateProfileModal();
          }
        } catch (e) {
          showToast('Failed to delete resume.', true);
        }
      });
    }

    // Save profile changes
    const saveBtn = overlay.querySelector('#hc-btn-save-profile');
    saveBtn.addEventListener('click', async () => {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      const desiredStr = overlay.querySelector('#hc-p-desired-titles').value;
      const desiredTitles = desiredStr.split(',').map(s => s.trim()).filter(Boolean);

      const updates = {
        name: overlay.querySelector('#hc-p-name').value.trim(),
        headline: overlay.querySelector('#hc-p-headline').value.trim(),
        location: overlay.querySelector('#hc-p-location').value.trim(),
        phone: overlay.querySelector('#hc-p-phone').value.trim(),
        contactEmail: overlay.querySelector('#hc-p-email').value.trim(),
        noticePeriod: overlay.querySelector('#hc-p-notice').value,
        expectedSalary: overlay.querySelector('#hc-p-salary').value.trim(),
        summary: overlay.querySelector('#hc-p-summary').value.trim(),
        desiredTitles,
        skills: p.skills,
        privacy: {
          isDiscoverable: overlay.querySelector('#hc-p-discoverable').checked,
          allowResumeDownload: overlay.querySelector('#hc-p-allow-resume').checked,
          hideContactInfo: overlay.querySelector('#hc-p-hide-contact').checked
        }
      };

      try {
        const res = await fetch('/api/profile/candidate', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify(updates)
        });
        const data = await res.json();
        if (data.success) {
          userProfile = data.profile;
          showToast('Profile updated successfully!');
          renderNavWidget();
          closeModal();
        } else {
          showToast(data.message || 'Failed to update profile.', true);
        }
      } catch (err) {
        showToast('Network error saving profile.', true);
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Profile Changes';
      }
    });

    overlay.classList.add('open');
  }

  // ==================== RECRUITER POST A JOB MODAL ====================
  function openPostJobModal() {
    let overlay = document.getElementById('hc-post-job-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'hc-post-job-modal';
      overlay.className = 'hc-modal-overlay';
      document.body.appendChild(overlay);
    }

    const compName = userCompany ? userCompany.name : 'Your Company';

    overlay.innerHTML = `
      <div class="hc-modal-card">
        <div class="hc-modal-header">
          <div class="hc-modal-title-box">
            <div class="hc-modal-title-icon purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
            <div>
              <h3 class="hc-modal-title">Publish a Verified Job Opening</h3>
              <div class="hc-modal-subtitle">Publishing on behalf of <strong>${escapeHtml(compName)}</strong></div>
            </div>
          </div>
          <button type="button" class="hc-modal-close-btn" id="hc-modal-job-close">&times;</button>
        </div>

        <div class="hc-modal-body">
          <div class="hc-form-grid">
            <div class="hc-form-group">
              <label class="hc-form-label">Job Title *</label>
              <input type="text" class="hc-form-input" id="hc-job-title" placeholder="e.g. Senior Frontend Engineer (React / TypeScript)">
            </div>
            <div class="hc-form-group">
              <label class="hc-form-label">Role Category / Department</label>
              <select class="hc-form-select" id="hc-job-cat">
                <option value="frontend">Frontend Engineering</option>
                <option value="backend">Backend Engineering</option>
                <option value="fullstack">Full Stack Engineering</option>
                <option value="mobile">Mobile Engineering</option>
                <option value="devops">DevOps &amp; Cloud</option>
                <option value="ai-ml">AI / Machine Learning</option>
                <option value="data">Data Engineering</option>
                <option value="security">Cybersecurity</option>
                <option value="product">Product &amp; Design</option>
              </select>
            </div>
            <div class="hc-form-group">
              <label class="hc-form-label">Office Location</label>
              <input type="text" class="hc-form-input" id="hc-job-loc" value="Bengaluru, Karnataka" placeholder="e.g. Bengaluru, Karnataka">
            </div>
            <div class="hc-form-group">
              <label class="hc-form-label">Work Mode</label>
              <select class="hc-form-select" id="hc-job-mode">
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
            <div class="hc-form-group">
              <label class="hc-form-label">Experience Range</label>
              <input type="text" class="hc-form-input" id="hc-job-exp" value="3 - 6 Years" placeholder="e.g. 3 - 6 Years">
            </div>
            <div class="hc-form-group">
              <label class="hc-form-label">Salary Range (CTC)</label>
              <input type="text" class="hc-form-input" id="hc-job-salary" value="₹30 - 46 LPA" placeholder="e.g. ₹30 - 46 LPA">
            </div>
          </div>

          <div class="hc-form-group" style="margin-top: 14rem;">
            <label class="hc-form-label">Required Skills (Comma separated)</label>
            <input type="text" class="hc-form-input" id="hc-job-skills" value="React, TypeScript, Next.js, Redux" placeholder="e.g. React, TypeScript, Node.js, AWS">
          </div>

          <div class="hc-form-group" style="margin-top: 14rem;">
            <label class="hc-form-label">Job Overview &amp; Role Scope</label>
            <textarea class="hc-form-textarea" id="hc-job-desc" rows="3" placeholder="Describe the responsibilities, high-throughput systems, and team impact..."></textarea>
          </div>

          <div class="hc-form-grid" style="margin-top: 14rem;">
            <div class="hc-form-group">
              <label class="hc-form-label">Key Requirements (One per line)</label>
              <textarea class="hc-form-textarea" id="hc-job-reqs" rows="3" placeholder="3+ years of production experience&#10;Deep proficiency in core web APIs&#10;Track record of building scalable micro-frontends"></textarea>
            </div>
            <div class="hc-form-group">
              <label class="hc-form-label">Key Responsibilities (One per line)</label>
              <textarea class="hc-form-textarea" id="hc-job-resps" rows="3" placeholder="Architect modular client-side components&#10;Partner with backend and product designers&#10;Improve bundle sizes and performance vitals"></textarea>
            </div>
          </div>
        </div>

        <div class="hc-modal-footer">
          <button type="button" class="hc-btn-secondary" id="hc-btn-draft-job">Save as Draft</button>
          <button type="button" class="hc-btn-purple" id="hc-btn-publish-job">Publish Job Opening</button>
        </div>
      </div>
    `;

    const closeBtn = overlay.querySelector('#hc-modal-job-close');
    const closeModal = () => overlay.classList.remove('open');
    closeBtn.addEventListener('click', closeModal);

    const publishBtn = overlay.querySelector('#hc-btn-publish-job');
    const draftBtn = overlay.querySelector('#hc-btn-draft-job');

    const submitJob = async (status) => {
      const title = overlay.querySelector('#hc-job-title').value.trim();
      if (!title) {
        showToast('Job title is required.', true);
        return;
      }

      publishBtn.disabled = true;
      draftBtn.disabled = true;

      const skillsStr = overlay.querySelector('#hc-job-skills').value;
      const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);

      const reqsStr = overlay.querySelector('#hc-job-reqs').value;
      const requirements = reqsStr.split('\n').map(s => s.trim()).filter(Boolean);

      const respsStr = overlay.querySelector('#hc-job-resps').value;
      const responsibilities = respsStr.split('\n').map(s => s.trim()).filter(Boolean);

      const jobData = {
        title,
        category: overlay.querySelector('#hc-job-cat').value,
        location: overlay.querySelector('#hc-job-loc').value.trim(),
        workMode: overlay.querySelector('#hc-job-mode').value,
        experience: overlay.querySelector('#hc-job-exp').value.trim(),
        salary: overlay.querySelector('#hc-job-salary').value.trim(),
        skills,
        description: overlay.querySelector('#hc-job-desc').value.trim(),
        requirements,
        responsibilities,
        status // 'published' or 'draft'
      };

      try {
        const res = await fetch('/api/jobs/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify(jobData)
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Job listing "${title}" ${status === 'published' ? 'published and live on Find Jobs!' : 'saved as draft.'}`);
          closeModal();
          // Dispatch custom event so Find Jobs or Companies page can auto-refresh
          window.dispatchEvent(new CustomEvent('hc:job-published', { detail: data.job }));
        } else {
          showToast(data.message || 'Failed to post job.', true);
        }
      } catch (err) {
        showToast('Network error publishing job opening.', true);
      } finally {
        publishBtn.disabled = false;
        draftBtn.disabled = false;
      }
    };

    publishBtn.addEventListener('click', () => submitJob('published'));
    draftBtn.addEventListener('click', () => submitJob('draft'));

    overlay.classList.add('open');
  }

  // ==================== CANDIDATE APPLICATION MODAL ====================
  function openApplyModal(jobId, jobTitle, companyName, salary = '') {
    if (!currentUser) {
      showToast('Please sign in as a job seeker to submit applications.');
      window.location.href = '/about/';
      return;
    }

    if (currentUser.role === 'recruiter') {
      showToast('Recruiter accounts cannot apply for positions. Please switch to a Candidate account.', true);
      return;
    }

    let overlay = document.getElementById('hc-apply-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'hc-apply-modal';
      overlay.className = 'hc-modal-overlay';
      document.body.appendChild(overlay);
    }

    const p = userProfile || {};

    overlay.innerHTML = `
      <div class="hc-modal-card" style="max-width: 620rem;">
        <div class="hc-modal-header">
          <div class="hc-modal-title-box">
            <div class="hc-modal-title-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
            <div>
              <h3 class="hc-modal-title">Apply for Position</h3>
              <div class="hc-modal-subtitle">${escapeHtml(jobTitle)} at <strong>${escapeHtml(companyName)}</strong></div>
            </div>
          </div>
          <button type="button" class="hc-modal-close-btn" id="hc-modal-apply-close">&times;</button>
        </div>

        <div class="hc-modal-body">
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12rem; padding: 14rem; margin-bottom: 16rem;">
            <div style="font-size: 13rem; color: #aaa;">Applying as: <strong style="color: #fff;">${escapeHtml(currentUser.name)}</strong> (${escapeHtml(currentUser.email)})</div>
            <div style="font-size: 12rem; color: var(--hc-mint); margin-top: 4rem;">${escapeHtml(p.headline || 'Software Engineer')}</div>
          </div>

          <div style="margin-bottom: 16rem;">
            <label class="hc-form-label" style="display: block; margin-bottom: 6rem;">Resume to Attach</label>
            ${p.resume ? `
              <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(161,216,192,0.08); border: 1px solid rgba(161,216,192,0.25); border-radius: 10rem; padding: 10rem 14rem;">
                <span style="font-size: 13rem; color: #fff;">📄 ${escapeHtml(p.resume.fileName || 'Profile Resume.pdf')}</span>
                <span style="font-size: 11rem; font-family: var(--hc-font-mono); color: var(--hc-mint);">Profile Resume Attached</span>
              </div>
            ` : `
              <div style="background: rgba(255,100,100,0.08); border: 1px solid rgba(255,100,100,0.2); border-radius: 10rem; padding: 10rem 14rem; font-size: 13rem; color: #ff9999;">
                ⚠️ No resume found on profile. You can still apply; your full profile and technical skills will be submitted.
              </div>
            `}
          </div>

          <div class="hc-form-group">
            <label class="hc-form-label">Cover Note / Why you're a great fit (Optional)</label>
            <textarea class="hc-form-textarea" id="hc-app-cover-note" rows="4" placeholder="Highlight relevant achievements, projects, or why you are excited about ${escapeHtml(companyName)}..."></textarea>
          </div>
        </div>

        <div class="hc-modal-footer">
          <button type="button" class="hc-btn-secondary" id="hc-btn-cancel-apply">Cancel</button>
          <button type="button" class="hc-btn-primary" id="hc-btn-submit-apply">Submit Direct Application</button>
        </div>
      </div>
    `;

    const closeBtn = overlay.querySelector('#hc-modal-apply-close');
    const cancelBtn = overlay.querySelector('#hc-btn-cancel-apply');
    const closeModal = () => overlay.classList.remove('open');
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    const submitBtn = overlay.querySelector('#hc-btn-submit-apply');
    submitBtn.addEventListener('click', async () => {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      const coverNote = overlay.querySelector('#hc-app-cover-note').value;

      try {
        const res = await fetch('/api/applications/apply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify({
            jobId,
            coverNote
          })
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Application successfully sent directly to ${companyName}'s hiring team!`);
          closeModal();
        } else {
          showToast(data.message || 'Could not submit application.', true);
        }
      } catch (e) {
        showToast('Network error submitting application.', true);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Direct Application';
      }
    });

    overlay.classList.add('open');
  }

  // ==================== CANDIDATE MY APPLICATIONS & SAVED JOBS MODAL ====================
  async function openMyApplicationsModal(defaultTab = 'applications') {
    let overlay = document.getElementById('hc-my-applications-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'hc-my-applications-modal';
      overlay.className = 'hc-modal-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="hc-modal-card" style="max-width: 760rem;">
        <div class="hc-modal-header">
          <div class="hc-modal-title-box">
            <div class="hc-modal-title-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
            <div>
              <h3 class="hc-modal-title">My Applications &amp; Saved Jobs</h3>
              <div class="hc-modal-subtitle">Track real-time hiring progress across your direct applications and bookmarked opportunities</div>
            </div>
          </div>
          <button type="button" class="hc-modal-close-btn" id="hc-modal-apps-close">&times;</button>
        </div>

        <div style="display: flex; gap: 8rem; padding: 12rem 24rem 0; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <button type="button" class="hc-tab-btn ${defaultTab === 'applications' ? 'active' : ''}" id="hc-tab-btn-applications" style="padding: 8rem 16rem; font-size: 13rem; border: none; background: none; color: ${defaultTab === 'applications' ? 'var(--hc-mint)' : '#888'}; border-bottom: 2px solid ${defaultTab === 'applications' ? 'var(--hc-mint)' : 'transparent'}; cursor: pointer; font-weight: 600;">
            Direct Applications <span id="hc-tab-app-count"></span>
          </button>
          <button type="button" class="hc-tab-btn ${defaultTab === 'saved' ? 'active' : ''}" id="hc-tab-btn-saved" style="padding: 8rem 16rem; font-size: 13rem; border: none; background: none; color: ${defaultTab === 'saved' ? 'var(--hc-mint)' : '#888'}; border-bottom: 2px solid ${defaultTab === 'saved' ? 'var(--hc-mint)' : 'transparent'}; cursor: pointer; font-weight: 600;">
            Saved Positions <span id="hc-tab-saved-count"></span>
          </button>
        </div>

        <div class="hc-modal-body" id="hc-apps-modal-body" style="max-height: 520rem; overflow-y: auto;">
          <div style="text-align: center; padding: 30rem; color: #888;">Loading your applications...</div>
        </div>
      </div>
    `;

    const closeBtn = overlay.querySelector('#hc-modal-apps-close');
    closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
    overlay.classList.add('open');

    const appTabBtn = overlay.querySelector('#hc-tab-btn-applications');
    const savedTabBtn = overlay.querySelector('#hc-tab-btn-saved');
    const body = overlay.querySelector('#hc-apps-modal-body');

    const statusBadges = {
      applied: { label: 'Applied', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
      under_review: { label: 'Under Review', color: '#c496ff', bg: 'rgba(196,150,255,0.12)' },
      shortlisted: { label: 'Shortlisted', color: '#a1d8c0', bg: 'rgba(161,216,192,0.12)' },
      interview: { label: 'Interview Scheduled', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
      interviewing: { label: 'Interview Scheduled', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
      offered: { label: 'Offer Extended', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
      rejected: { label: 'Not Moving Forward', color: '#9ca3af', bg: 'rgba(156,163,175,0.12)' },
      withdrawn: { label: 'Withdrawn', color: '#f87171', bg: 'rgba(248,113,113,0.12)' }
    };

    async function loadApplications() {
      appTabBtn.style.color = 'var(--hc-mint)';
      appTabBtn.style.borderBottomColor = 'var(--hc-mint)';
      savedTabBtn.style.color = '#888';
      savedTabBtn.style.borderBottomColor = 'transparent';

      body.innerHTML = '<div style="text-align: center; padding: 30rem; color: #888;">Loading your direct applications...</div>';

      try {
        const res = await fetch('/api/applications/my', {
          headers: { 'Authorization': 'Bearer ' + getToken() }
        });
        const data = await res.json();
        const apps = data.applications || (data.data && data.data.applications) || [];

        const countSpan = overlay.querySelector('#hc-tab-app-count');
        if (countSpan) countSpan.textContent = `(${apps.length})`;

        if (apps.length === 0) {
          body.innerHTML = `
            <div style="text-align: center; padding: 40rem 20rem;">
              <p style="font-size: 15rem; color: #fff; margin-bottom: 8rem;">No active applications submitted yet.</p>
              <p style="font-size: 13rem; color: #888; margin-bottom: 20rem;">Explore 200+ verified tech roles across India and apply directly with hiring teams.</p>
              <a href="/services/" class="hc-btn-primary" style="text-decoration: none; display: inline-block;">Browse Open Jobs</a>
            </div>
          `;
          return;
        }

        body.innerHTML = apps.map(app => {
          const badge = statusBadges[app.status] || statusBadges.applied;
          const dateStr = app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
          const canWithdraw = app.status !== 'withdrawn' && app.status !== 'rejected' && app.status !== 'offered';

          return `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14rem; padding: 18rem; margin-bottom: 12rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 16rem;">
              <div style="flex: 1;">
                <div style="font-size: 15rem; font-weight: 600; color: #fff; margin-bottom: 4rem;">${escapeHtml(app.jobTitle)}</div>
                <div style="font-size: 13rem; color: var(--hc-text-secondary); margin-bottom: 6rem;">${escapeHtml(app.companyName)} • Applied on ${dateStr}</div>
                ${app.coverNote ? `<div style="font-size: 12rem; color: #888; font-style: italic; margin-bottom: 8rem;">"${escapeHtml(app.coverNote.slice(0, 100))}${app.coverNote.length > 100 ? '...' : ''}"</div>` : ''}
              </div>
              <div style="text-align: right; flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 8rem;">
                <span style="display: inline-block; padding: 4rem 12rem; border-radius: 9999px; font-size: 11rem; font-family: var(--hc-font-mono); font-weight: 600; color: ${badge.color}; background: ${badge.bg}; border: 1px solid ${badge.color}40;">
                  ${badge.label}
                </span>
                ${canWithdraw ? `
                  <button type="button" class="hc-btn-withdraw-app" data-app-id="${app.id}" data-app-title="${escapeHtml(app.jobTitle)}" style="background: none; border: 1px solid rgba(248,113,113,0.3); color: #f87171; border-radius: 6rem; padding: 4rem 10rem; font-size: 11rem; cursor: pointer; transition: all 0.2s;">
                    Withdraw
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }).join('');

        // Wire withdraw buttons
        body.querySelectorAll('.hc-btn-withdraw-app').forEach(btn => {
          btn.addEventListener('click', async () => {
            const appId = btn.getAttribute('data-app-id');
            const appTitle = btn.getAttribute('data-app-title');
            if (!confirm(`Are you sure you want to withdraw your application for "${appTitle}"? This action cannot be reversed.`)) {
              return;
            }
            btn.disabled = true;
            btn.textContent = 'Withdrawing...';
            try {
              const wRes = await fetch(`/api/applications/${appId}/withdraw`, {
                method: 'PATCH',
                headers: {
                  'Authorization': 'Bearer ' + getToken(),
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason: 'Withdrawn by candidate' })
              });
              const wData = await wRes.json();
              if (wRes.ok && wData.success) {
                showToast(`Application for "${appTitle}" withdrawn.`);
                loadApplications();
              } else {
                showToast(wData.message || 'Could not withdraw application.', true);
                btn.disabled = false;
                btn.textContent = 'Withdraw';
              }
            } catch (err) {
              showToast('Network error withdrawing application.', true);
              btn.disabled = false;
              btn.textContent = 'Withdraw';
            }
          });
        });

      } catch (e) {
        body.innerHTML = '<div style="color: #ff8888; text-align: center; padding: 20rem;">Error fetching applications.</div>';
      }
    }

    async function loadSavedJobs() {
      savedTabBtn.style.color = 'var(--hc-mint)';
      savedTabBtn.style.borderBottomColor = 'var(--hc-mint)';
      appTabBtn.style.color = '#888';
      appTabBtn.style.borderBottomColor = 'transparent';

      body.innerHTML = '<div style="text-align: center; padding: 30rem; color: #888;">Loading your saved jobs...</div>';

      try {
        const res = await fetch('/api/saved-jobs', {
          headers: { 'Authorization': 'Bearer ' + getToken() }
        });
        const data = await res.json();
        const saved = data.savedJobs || (data.data && data.data.savedJobs) || [];

        const countSpan = overlay.querySelector('#hc-tab-saved-count');
        if (countSpan) countSpan.textContent = `(${saved.length})`;

        if (saved.length === 0) {
          body.innerHTML = `
            <div style="text-align: center; padding: 40rem 20rem;">
              <p style="font-size: 15rem; color: #fff; margin-bottom: 8rem;">No saved job positions yet.</p>
              <p style="font-size: 13rem; color: #888; margin-bottom: 20rem;">Click the bookmark icon on any job card on Find Jobs to save positions for later review.</p>
              <a href="/services/" class="hc-btn-primary" style="text-decoration: none; display: inline-block;">Explore Positions</a>
            </div>
          `;
          return;
        }

        body.innerHTML = saved.map(item => {
          const j = item.job || {};
          const isClosed = j.isClosed || j.status === 'closed';
          const compName = typeof j.company === 'string' ? j.company : (j.company?.name || j.companyName || 'Company');

          return `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14rem; padding: 18rem; margin-bottom: 12rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 16rem;">
              <div style="flex: 1;">
                <div style="font-size: 15rem; font-weight: 600; color: #fff; margin-bottom: 4rem;">${escapeHtml(j.title || 'Tech Opportunity')}</div>
                <div style="font-size: 13rem; color: var(--hc-text-secondary); margin-bottom: 6rem;">
                  ${escapeHtml(compName)} • ${escapeHtml(j.location || 'India')} • ${escapeHtml(j.workMode || 'Full-time')}
                </div>
                ${j.salary ? `<div style="font-size: 12rem; color: var(--hc-mint); font-family: var(--hc-font-mono);">${escapeHtml(j.salary)}</div>` : ''}
                ${isClosed ? `<div style="font-size: 11rem; color: #ff8888; margin-top: 4rem;">⚠️ This job listing has concluded.</div>` : ''}
              </div>
              <div style="text-align: right; flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 8rem;">
                <div style="display: flex; gap: 8rem; align-items: center;">
                  ${!isClosed ? `
                    <button type="button" class="hc-btn-primary hc-saved-apply-btn" data-job-id="${j.id}" data-job-title="${escapeHtml(j.title)}" data-comp-name="${escapeHtml(compName)}" data-apply-url="${escapeHtml(j.applyUrl || '')}" style="padding: 6rem 12rem; font-size: 12rem;">
                      Apply Now
                    </button>
                  ` : ''}
                  <button type="button" class="hc-btn-secondary hc-saved-remove-btn" data-job-id="${item.jobId || j.id}" title="Remove from bookmarks" style="padding: 6rem 10rem; font-size: 12rem;">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('');

        // Wire unsave buttons
        body.querySelectorAll('.hc-saved-remove-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const jobId = btn.getAttribute('data-job-id');
            btn.disabled = true;
            try {
              const delRes = await fetch(`/api/jobs/${jobId}/save`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + getToken() }
              });
              const delData = await delRes.json();
              if (delRes.ok && delData.success) {
                showToast('Position removed from saved bookmarks.');
                loadSavedJobs();
              } else {
                showToast(delData.message || 'Could not remove saved job.', true);
                btn.disabled = false;
              }
            } catch (err) {
              showToast('Network error removing job.', true);
              btn.disabled = false;
            }
          });
        });

        // Wire apply buttons
        body.querySelectorAll('.hc-saved-apply-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const jId = btn.getAttribute('data-job-id');
            const jTitle = btn.getAttribute('data-job-title');
            const cName = btn.getAttribute('data-comp-name');
            const applyUrl = btn.getAttribute('data-apply-url');

            overlay.classList.remove('open');
            if (applyUrl && !applyUrl.startsWith('/api') && applyUrl !== '#') {
              window.open(applyUrl, '_blank', 'noopener,noreferrer');
            } else {
              openApplyModal(jId, jTitle, cName);
            }
          });
        });

      } catch (e) {
        body.innerHTML = '<div style="color: #ff8888; text-align: center; padding: 20rem;">Error fetching saved jobs.</div>';
      }
    }

    appTabBtn.addEventListener('click', () => loadApplications());
    savedTabBtn.addEventListener('click', () => loadSavedJobs());

    if (defaultTab === 'saved') {
      loadSavedJobs();
    } else {
      loadApplications();
    }
  }

  
  // ==================== MEETING BOOKING & CALENDAR MODAL ====================
  let selectedBookingSlot = '';
  let currentAvailableSlots = [];

  async function fetchBookingSlots(date, timezone, purpose) {
    const chipsContainer = document.getElementById('bm-slot-chips-container');
    const statusLabel = document.getElementById('bm-slots-status');
    const hostAvatar = document.getElementById('bm-host-avatar');
    const hostName = document.getElementById('bm-host-name');
    const hostRole = document.getElementById('bm-host-role');

    if (!chipsContainer) return;
    chipsContainer.innerHTML = '<div style="color: #888; font-size: 13rem; padding: 12rem 0;">Checking real-time calendar availability...</div>';
    if (statusLabel) statusLabel.textContent = 'Updating...';

    try {
      const res = await fetch(`/api/bookings/availability?date=${encodeURIComponent(date)}&timezone=${encodeURIComponent(timezone)}&purpose=${encodeURIComponent(purpose)}`);
      const data = await res.json();

      if (!data.available && data.reason) {
        chipsContainer.innerHTML = `<div style="color: #ff9999; font-size: 13rem; padding: 12rem 0;">${escapeHtml(data.reason)}</div>`;
        if (statusLabel) statusLabel.textContent = 'No slots available';
        selectedBookingSlot = '';
        const slotInput = document.getElementById('bm-selected-slot');
        if (slotInput) slotInput.value = '';
        return;
      }

      if (data.assignedHost) {
        if (hostName) hostName.textContent = data.assignedHost.name;
        if (hostRole) hostRole.textContent = data.assignedHost.role;
        if (hostAvatar) hostAvatar.textContent = getInitials(data.assignedHost.name);
      }

      currentAvailableSlots = data.slots || [];
      const bookedSlots = data.bookedSlots || [];

      if (currentAvailableSlots.length === 0) {
        chipsContainer.innerHTML = '<div style="color: #ff9999; font-size: 13rem; padding: 12rem 0;">All slots on this date are booked. Please choose another date.</div>';
        if (statusLabel) statusLabel.textContent = 'Fully booked';
        selectedBookingSlot = '';
        const slotInput = document.getElementById('bm-selected-slot');
        if (slotInput) slotInput.value = '';
        return;
      }

      if (statusLabel) statusLabel.textContent = `${currentAvailableSlots.length} slot${currentAvailableSlots.length === 1 ? '' : 's'} available`;

      const allSlots = [
        '10:00 AM - 10:30 AM',
        '10:45 AM - 11:15 AM',
        '11:30 AM - 12:00 PM',
        '02:00 PM - 02:30 PM',
        '02:45 PM - 03:15 PM',
        '03:30 PM - 04:00 PM',
        '04:15 PM - 04:45 PM',
        '05:00 PM - 05:30 PM'
      ];

      chipsContainer.innerHTML = allSlots.map(slot => {
        const isBooked = bookedSlots.includes(slot);
        const isSelected = selectedBookingSlot === slot;
        return `
          <button type="button" class="bm-slot-chip ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}" data-slot="${escapeHtml(slot)}" ${isBooked ? 'disabled' : ''}>
            ${escapeHtml(slot)}
            ${isBooked ? ' (Booked)' : ''}
          </button>
        `;
      }).join('');

      chipsContainer.querySelectorAll('.bm-slot-chip:not(.booked)').forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.preventDefault();
          chipsContainer.querySelectorAll('.bm-slot-chip').forEach(c => c.classList.remove('selected'));
          chip.classList.add('selected');
          selectedBookingSlot = chip.getAttribute('data-slot');
          const slotInput = document.getElementById('bm-selected-slot');
          if (slotInput) slotInput.value = selectedBookingSlot;
          const errDiv = document.getElementById('bm-form-error');
          if (errDiv) errDiv.style.display = 'none';
        });
      });

      if (!selectedBookingSlot || bookedSlots.includes(selectedBookingSlot)) {
        const firstAvailable = chipsContainer.querySelector('.bm-slot-chip:not(.booked)');
        if (firstAvailable) {
          firstAvailable.click();
        }
      }
    } catch (e) {
      chipsContainer.innerHTML = '<div style="color: #ff8888; font-size: 13rem; padding: 12rem 0;">Error checking slot availability. Please try again.</div>';
    }
  }

  function getNextBusinessDayStr() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (d.getDay() === 0 || d.getDay() === 6) {
      d.setDate(d.getDate() + 1);
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function downloadIcsCalendar(meet) {
    const startStr = (meet.timeSlot || '10:00 AM').split('-')[0].trim();
    const parts = startStr.split(' ');
    let [hours, minutes] = (parts[0] || '10:00').split(':').map(Number);
    const meridian = parts[1] || 'AM';
    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;

    const localDate = new Date(`${meet.date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00+05:30`);
    const utcStart = isNaN(localDate.getTime()) ? new Date() : localDate;
    const utcEnd = new Date(utcStart.getTime() + (meet.durationMinutes || 15) * 60000);

    const toIcsDate = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HireConnect//Meeting Scheduler//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:${meet.reference}@hireconnect.io`,
      `DTSTAMP:${toIcsDate(new Date())}`,
      `DTSTART:${toIcsDate(utcStart)}`,
      `DTEND:${toIcsDate(utcEnd)}`,
      `SUMMARY:HireConnect: 15-min Meeting with ${meet.hostName}`,
      `DESCRIPTION:HireConnect Recruiter Consultation\\nReference: ${meet.reference}\\nHost: ${meet.hostName} (${meet.hostRole})\\nAttendee: ${meet.name} (${meet.email})\\nVideo Room: ${meet.videoUrl}`,
      `LOCATION:${meet.videoUrl}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hireconnect-meeting-${meet.reference.toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function openGoogleCalendar(meet) {
    const startStr = (meet.timeSlot || '10:00 AM').split('-')[0].trim();
    const parts = startStr.split(' ');
    let [hours, minutes] = (parts[0] || '10:00').split(':').map(Number);
    const meridian = parts[1] || 'AM';
    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;

    const localDate = new Date(`${meet.date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00+05:30`);
    const utcStart = isNaN(localDate.getTime()) ? new Date() : localDate;
    const utcEnd = new Date(utcStart.getTime() + (meet.durationMinutes || 15) * 60000);
    const toGCalDate = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const gUrl = new URL('https://calendar.google.com/calendar/render');
    gUrl.searchParams.set('action', 'TEMPLATE');
    gUrl.searchParams.set('text', `HireConnect: 15-min Meeting with ${meet.hostName}`);
    gUrl.searchParams.set('dates', `${toGCalDate(utcStart)}/${toGCalDate(utcEnd)}`);
    gUrl.searchParams.set('details', `HireConnect Recruiter Consultation\nHost: ${meet.hostName} (${meet.hostRole})\nReference: ${meet.reference}\nVideo Room: ${meet.videoUrl}`);
    gUrl.searchParams.set('location', meet.videoUrl);

    window.open(gUrl.toString(), '_blank');
  }

  function openBookingModal(initialPurpose, isReschedule = false, rescheduleRef = '') {
    let overlay = document.getElementById('hc-booking-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'hc-booking-modal';
      document.body.appendChild(overlay);
    }

    const defaultDate = getNextBusinessDayStr();
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultName = currentUser ? currentUser.name : '';
    const defaultEmail = currentUser ? currentUser.email : '';
    const defaultCompany = (currentUser && currentUser.role === 'recruiter' && userCompany) ? userCompany.name : '';

    const dateObj = new Date(defaultDate + 'T00:00:00');
    let viewYear = dateObj.getFullYear();
    let viewMonth = dateObj.getMonth();
    let activeDateStr = defaultDate;
    let activeSlot = '';
    let currentHost = {
      name: 'Neil Bhargava',
      role: 'Principal Recruiter & Talent Lead',
      email: 'neil.bhargava@hireconnect.io'
    };

    overlay.innerHTML = `
      <div class="hc-sched-outer-frame">
        <button type="button" class="hc-sched-close-btn" id="hc-booking-close" aria-label="Close scheduler">&times;</button>
        <div class="hc-sched-card" id="hc-booking-body">
          ${isReschedule ? `
            <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 8px; padding: 12px 18px; margin-bottom: 22px; color: #92400e; font-size: 13.5px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
              <span>🔄</span>
              <span>Rescheduling meeting <strong>${escapeHtml(rescheduleRef)}</strong>. Select your new date &amp; time slot.</span>
            </div>
          ` : ''}

          <!-- SECTION A: Brand Bar -->
          <div class="hc-sched-brand-bar">
            <div class="hc-sched-brand-logo">
              <svg width="24" height="26" viewBox="0 0 37 40" fill="none">
                <path d="M22.77 11.426H18.5c-2.47 0-4.27-2.023-4.27-4.283V4.286A4.247 4.247 0 0 0 9.963 0H4.269A4.27 4.27 0 0 0 0 4.286V10c0 2.326 1.816 4.286 4.306 4.286s4.232 2.08 4.232 4.314v7.114C8.538 37.143 11.385 40 22.77 40S37 37.143 37 25.786s-2.846-14.36-14.23-14.36" fill="#0f172a"/>
              </svg>
              <span class="hc-sched-brand-title">HireConnect</span>
            </div>
          </div>
          <div class="hc-sched-divider"></div>

          <!-- SECTION B: Recruiter Profile Header -->
          <div class="hc-sched-profile-section" id="hc-sched-profile-box">
            <div class="hc-sched-avatar-ring">
              <div class="hc-sched-avatar-inner">
                <span class="hc-sched-avatar-initials" id="hc-sched-host-initials">NB</span>
              </div>
            </div>
            <div class="hc-sched-recruiter-name" id="hc-sched-host-name">Neil Bhargava</div>
            <div class="hc-sched-recruiter-role" id="hc-sched-host-role">Principal Recruiter &amp; Talent Lead</div>
            <div class="hc-sched-duration-hero">15 min</div>
            <div class="hc-sched-meta-row">
              <div class="hc-sched-meta-item">
                <svg class="hc-sched-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>15 min</span>
              </div>
              <div class="hc-sched-meta-item">
                <svg class="hc-sched-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 7l-7 5 7 5V7z"></path>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                <span>Web conferencing details provided upon confirmation.</span>
              </div>
            </div>
          </div>
          <div class="hc-sched-divider"></div>

          <!-- SECTION C: Heading -->
          <h3 class="hc-sched-heading">Select a Date &amp; Time</h3>

          <!-- SECTION D: Monthly Calendar -->
          <div class="hc-sched-calendar-wrap">
            <div class="hc-sched-month-nav">
              <button type="button" class="hc-sched-nav-arrow" id="hc-cal-prev" title="Previous Month">&lsaquo;</button>
              <span class="hc-sched-month-display" id="hc-cal-month-label">October 2026</span>
              <button type="button" class="hc-sched-nav-arrow" id="hc-cal-next" title="Next Month">&rsaquo;</button>
            </div>
            <div class="hc-sched-weekdays-row">
              <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
            </div>
            <div class="hc-sched-days-grid" id="hc-cal-days-grid">
              <!-- Calendar day buttons -->
            </div>
          </div>

          <!-- SECTION E: Time Slots Grid -->
          <div class="hc-sched-slots-box" id="hc-sched-slots-box">
            <div class="hc-sched-slots-label">
              <span>Available times for <strong id="hc-sched-active-date-label">Wednesday, Oct 28</strong>:</span>
              <span class="hc-sched-tz-badge" id="hc-sched-tz-badge">Asia/Kolkata (IST)</span>
            </div>
            <div class="hc-sched-slots-grid" id="hc-sched-slots-grid">
              <!-- Chip buttons -->
            </div>
            <div id="hc-sched-slot-empty" class="hc-sched-empty-msg" style="display: none;">
              No available slots on this date. Please choose another weekday.
            </div>
          </div>

          <!-- SECTION F: Selected Appointment Summary Banner -->
          <div class="hc-sched-summary-banner" id="hc-sched-summary-banner" style="display: none;">
            <div>
              <div class="hc-sched-summary-badge">Selected Time Slot</div>
              <div class="hc-sched-summary-title" id="hc-sb-title">15-minute meeting with Neil Bhargava</div>
              <div class="hc-sched-summary-details" id="hc-sb-details">Wednesday, October 28, 2026 · 10:00 AM - 10:15 AM · Asia/Kolkata</div>
            </div>
            <button type="button" class="hc-sched-change-slot-btn" id="hc-sb-change-btn">Change Slot</button>
          </div>

          <!-- SECTION G: Visitor Details Form -->
          <form id="hc-sched-form" style="display: none;">
            <div class="hc-sched-form-grid">
              <div class="hc-sched-form-group">
                <label class="hc-sched-label">Full Name *</label>
                <input type="text" class="hc-sched-input" id="hc-input-name" required placeholder="e.g. Vikramaditya Sharma" value="${escapeHtml(defaultName)}">
              </div>
              <div class="hc-sched-form-group">
                <label class="hc-sched-label">Work Email *</label>
                <input type="email" class="hc-sched-input" id="hc-input-email" required placeholder="name@company.com" value="${escapeHtml(defaultEmail)}">
              </div>
              <div class="hc-sched-form-group">
                <label class="hc-sched-label">Phone Number (Optional)</label>
                <input type="tel" class="hc-sched-input" id="hc-input-phone" placeholder="+91 98765 43210">
              </div>
              <div class="hc-sched-form-group">
                <label class="hc-sched-label">Company Name (Optional)</label>
                <input type="text" class="hc-sched-input" id="hc-input-company" placeholder="e.g. Razorpay, Zepto" value="${escapeHtml(defaultCompany)}">
              </div>
              <div class="hc-sched-form-group full">
                <label class="hc-sched-label">Meeting Purpose *</label>
                <select class="hc-sched-select" id="hc-input-purpose" required>
                  <option value="Recruitment and hiring discussion" ${(!initialPurpose || initialPurpose === 'Recruitment and hiring discussion') ? 'selected' : ''}>Recruitment &amp; Enterprise Hiring Solutions</option>
                  <option value="Talent Match demonstration" ${initialPurpose === 'Talent Match demonstration' ? 'selected' : ''}>Talent Match Live Demo &amp; Candidate Matching</option>
                  <option value="Company onboarding" ${initialPurpose === 'Company onboarding' ? 'selected' : ''}>Employer Registration &amp; Company Onboarding</option>
                  <option value="Technical demonstration" ${initialPurpose === 'Technical demonstration' ? 'selected' : ''}>Technical Architecture &amp; Vetting Assessment</option>
                  <option value="Partnership or business enquiry" ${initialPurpose === 'Partnership or business enquiry' ? 'selected' : ''}>Strategic Partnership &amp; Advisory</option>
                  <option value="General HireConnect enquiry" ${initialPurpose === 'General HireConnect enquiry' ? 'selected' : ''}>General HireConnect Consultation</option>
                </select>
              </div>
              <div class="hc-sched-form-group full">
                <label class="hc-sched-label">Discussion Agenda / Context (Optional)</label>
                <textarea class="hc-sched-textarea" id="hc-input-agenda" placeholder="Share specific candidate requirements, tech stack focus, or questions for our team..."></textarea>
              </div>
            </div>

            <div id="hc-sched-form-error" class="hc-sched-error-box" style="display: none;"></div>

            <!-- SECTION H: Confirm Button -->
            <button type="submit" class="hc-sched-confirm-btn" id="hc-sched-submit-btn">
              ${isReschedule ? 'Confirm Reschedule &rarr;' : 'Confirm Meeting &rarr;'}
            </button>
          </form>
        </div>
      </div>
    `;

    overlay.classList.add('open');

    const closeBtn = overlay.querySelector('#hc-booking-close');
    const closeModal = () => overlay.classList.remove('open');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weekdayNamesFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    function formatShortDate(dStr) {
      const parts = dStr.split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return `${weekdayNamesFull[d.getDay()]}, ${monthNames[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
    }

    function formatFullDate(dStr) {
      const parts = dStr.split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return `${weekdayNamesFull[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }

    function renderCalendar() {
      const monthLabel = overlay.querySelector('#hc-cal-month-label');
      const grid = overlay.querySelector('#hc-cal-days-grid');
      if (!monthLabel || !grid) return;

      monthLabel.textContent = `${monthNames[viewMonth]} ${viewYear}`;
      grid.innerHTML = '';

      const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
      const firstDay = new Date(viewYear, viewMonth, 1).getDay();
      const mondayOffset = (firstDay + 6) % 7;

      for (let i = 0; i < mondayOffset; i++) {
        const empty = document.createElement('div');
        empty.className = 'hc-sched-day-cell empty';
        grid.appendChild(empty);
      }

      for (let day = 1; day <= totalDays; day++) {
        const dStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayDate = new Date(viewYear, viewMonth, day);
        const dayOfWeek = dayDate.getDay();
        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        const isPast = dStr < todayStr;

        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'hc-sched-day-cell';
        cell.textContent = String(day);
        cell.setAttribute('data-date', dStr);

        if (isPast || isWeekend) {
          cell.classList.add('disabled');
          if (isWeekend) cell.classList.add('weekend');
          if (isPast) cell.classList.add('past');
          cell.disabled = true;
        } else {
          cell.classList.add('available');
          if (dStr === activeDateStr) {
            cell.classList.add('selected');
          }
          cell.addEventListener('click', (e) => {
            e.preventDefault();
            activeDateStr = dStr;
            grid.querySelectorAll('.hc-sched-day-cell').forEach(c => c.classList.remove('selected'));
            cell.classList.add('selected');
            updateActiveDateView();
          });
        }

        grid.appendChild(cell);
      }
    }

    const prevMonthBtn = overlay.querySelector('#hc-cal-prev');
    const nextMonthBtn = overlay.querySelector('#hc-cal-next');

    if (prevMonthBtn) {
      prevMonthBtn.addEventListener('click', () => {
        viewMonth--;
        if (viewMonth < 0) {
          viewMonth = 11;
          viewYear--;
        }
        renderCalendar();
      });
    }

    if (nextMonthBtn) {
      nextMonthBtn.addEventListener('click', () => {
        viewMonth++;
        if (viewMonth > 11) {
          viewMonth = 0;
          viewYear++;
        }
        renderCalendar();
      });
    }

    async function updateActiveDateView() {
      const activeLabel = overlay.querySelector('#hc-sched-active-date-label');
      if (activeLabel) activeLabel.textContent = formatShortDate(activeDateStr);

      const slotsGrid = overlay.querySelector('#hc-sched-slots-grid');
      const emptyMsg = overlay.querySelector('#hc-sched-slot-empty');
      const purposeEl = overlay.querySelector('#hc-input-purpose');
      const currentPurpose = purposeEl ? purposeEl.value : (initialPurpose || 'Recruitment and hiring discussion');

      if (slotsGrid) slotsGrid.innerHTML = '<div style="color: #64748b; font-size: 13.5px; padding: 12px 0;">Checking live availability...</div>';
      if (emptyMsg) emptyMsg.style.display = 'none';

      try {
        const res = await fetch(`/api/bookings/availability?date=${activeDateStr}&timezone=Asia/Kolkata&purpose=${encodeURIComponent(currentPurpose)}`);
        const data = await res.json();

        if (data.assignedHost) {
          currentHost = data.assignedHost;
          const hostNameEl = overlay.querySelector('#hc-sched-host-name');
          const hostRoleEl = overlay.querySelector('#hc-sched-host-role');
          const hostInitialsEl = overlay.querySelector('#hc-sched-host-initials');
          if (hostNameEl) hostNameEl.textContent = currentHost.name;
          if (hostRoleEl) hostRoleEl.textContent = currentHost.role;
          if (hostInitialsEl) hostInitialsEl.textContent = getInitials(currentHost.name);
        }

        const availableSlots = data.slots || [];
        const bookedSlots = data.bookedSlots || [];

        const allStandardSlots = [
          '09:00 AM - 09:15 AM',
          '09:30 AM - 09:45 AM',
          '10:00 AM - 10:15 AM',
          '10:30 AM - 10:45 AM',
          '11:00 AM - 11:15 AM',
          '11:30 AM - 11:45 AM',
          '02:00 PM - 02:15 PM',
          '02:30 PM - 02:45 PM',
          '03:00 PM - 03:15 PM',
          '03:30 PM - 03:45 PM',
          '04:00 PM - 04:15 PM',
          '04:30 PM - 04:45 PM'
        ];

        if (slotsGrid) {
          slotsGrid.innerHTML = '';
          allStandardSlots.forEach(slot => {
            const isBooked = bookedSlots.includes(slot) || (!availableSlots.includes(slot) && data.available === false);
            const isSelected = activeSlot === slot;
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = `hc-sched-slot-chip ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`;
            chip.textContent = slot.split(' - ')[0];
            chip.title = slot;
            chip.disabled = isBooked;

            if (!isBooked) {
              chip.addEventListener('click', (e) => {
                e.preventDefault();
                slotsGrid.querySelectorAll('.hc-sched-slot-chip').forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
                activeSlot = slot;
                selectSlot(slot);
              });
            }

            slotsGrid.appendChild(chip);
          });
        }
      } catch (err) {
        if (slotsGrid) slotsGrid.innerHTML = '<div style="color: #ef4444; font-size: 13.5px;">Failed to load time slots. Please try again.</div>';
      }
    }

    function selectSlot(slot) {
      activeSlot = slot;
      const summaryBanner = overlay.querySelector('#hc-sched-summary-banner');
      const sbTitle = overlay.querySelector('#hc-sb-title');
      const sbDetails = overlay.querySelector('#hc-sb-details');
      const visitorForm = overlay.querySelector('#hc-sched-form');

      if (sbTitle) sbTitle.textContent = `15-minute meeting with ${currentHost.name}`;
      if (sbDetails) sbDetails.textContent = `${formatFullDate(activeDateStr)} · ${activeSlot} · Asia/Kolkata`;

      if (summaryBanner) summaryBanner.style.display = 'flex';
      if (visitorForm) visitorForm.style.display = 'block';

      visitorForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const changeSlotBtn = overlay.querySelector('#hc-sb-change-btn');
    if (changeSlotBtn) {
      changeSlotBtn.addEventListener('click', () => {
        const slotsBox = overlay.querySelector('#hc-sched-slots-box');
        if (slotsBox) slotsBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    const purposeSelect = overlay.querySelector('#hc-input-purpose');
    if (purposeSelect) {
      purposeSelect.addEventListener('change', () => {
        updateActiveDateView();
      });
    }

    renderCalendar();
    updateActiveDateView();

    const bookingForm = overlay.querySelector('#hc-sched-form');
    if (bookingForm) {
      bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errBox = overlay.querySelector('#hc-sched-form-error');
        const submitBtn = overlay.querySelector('#hc-sched-submit-btn');
        if (errBox) errBox.style.display = 'none';

        if (!activeSlot) {
          if (errBox) {
            errBox.textContent = 'Please choose an available time slot chip before proceeding.';
            errBox.style.display = 'block';
          }
          return;
        }

        const name = overlay.querySelector('#hc-input-name').value.trim();
        const email = overlay.querySelector('#hc-input-email').value.trim();
        const phone = overlay.querySelector('#hc-input-phone').value.trim();
        const company = overlay.querySelector('#hc-input-company').value.trim();
        const purpose = overlay.querySelector('#hc-input-purpose').value;
        const agenda = overlay.querySelector('#hc-input-agenda').value.trim();

        submitBtn.disabled = true;
        submitBtn.textContent = isReschedule ? 'Rescheduling Slot...' : 'Securing Time Slot...';

        try {
          let res, data;
          if (isReschedule) {
            res = await fetch('/api/bookings/reschedule', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reference: rescheduleRef,
                newDate: activeDateStr,
                newSlot: activeSlot
              })
            });
            data = await res.json();
          } else {
            res = await fetch('/api/bookings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name,
                email,
                phone,
                company,
                purpose,
                date: activeDateStr,
                timeSlot: activeSlot,
                timezone: 'Asia/Kolkata',
                format: 'Video Call (Google Meet)',
                agenda
              })
            });
            data = await res.json();
          }

          if (res.status === 409) {
            if (errBox) {
              errBox.textContent = data.message || 'This time slot was just booked by another user. Please choose another slot.';
              errBox.style.display = 'block';
            }
            submitBtn.disabled = false;
            submitBtn.textContent = isReschedule ? 'Confirm Reschedule &rarr;' : 'Confirm Meeting &rarr;';
            updateActiveDateView();
            return;
          }

          if (!res.ok || !data.success) {
            if (errBox) {
              errBox.textContent = data.message || 'Unable to confirm booking. Please verify all details.';
              errBox.style.display = 'block';
            }
            submitBtn.disabled = false;
            submitBtn.textContent = isReschedule ? 'Confirm Reschedule &rarr;' : 'Confirm Meeting &rarr;';
            return;
          }

          const meeting = data.meeting;
          renderConfirmationScreen(meeting);
          showToast(isReschedule ? 'Meeting rescheduled successfully!' : 'Meeting confirmed! Calendar invite dispatched.');
        } catch (err) {
          if (errBox) {
            errBox.textContent = 'Network or server error while confirming meeting. Please try again.';
            errBox.style.display = 'block';
          }
          submitBtn.disabled = false;
          submitBtn.textContent = isReschedule ? 'Confirm Reschedule &rarr;' : 'Confirm Meeting &rarr;';
        }
      });
    }

    function renderConfirmationScreen(meet) {
      const bodyContainer = overlay.querySelector('#hc-booking-body');
      if (!bodyContainer) return;

      bodyContainer.innerHTML = `
        <div class="hc-sched-confirmed-view">
          <div class="hc-sched-confirm-badge-icon">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3 class="hc-sched-confirmed-title">Your meeting is confirmed</h3>
          <p class="hc-sched-confirmed-sub">
            A calendar invitation and Google Meet video conference link have been sent to <strong>${escapeHtml(meet.email)}</strong>.
          </p>

          <div class="hc-sched-ref-pill">Reference: ${escapeHtml(meet.reference)}</div>

          <div class="hc-sched-confirmed-card">
            <div class="hc-sched-cc-row">
              <span class="hc-sched-cc-label">Host</span>
              <strong class="hc-sched-cc-val">${escapeHtml(meet.hostName)} (${escapeHtml(meet.hostRole)})</strong>
            </div>
            <div class="hc-sched-cc-row">
              <span class="hc-sched-cc-label">Date &amp; Time</span>
              <strong class="hc-sched-cc-val">${escapeHtml(meet.date)} · ${escapeHtml(meet.timeSlot)} (${escapeHtml(meet.timezone)})</strong>
            </div>
            <div class="hc-sched-cc-row">
              <span class="hc-sched-cc-label">Duration</span>
              <strong class="hc-sched-cc-val">${meet.durationMinutes || 15} Minutes</strong>
            </div>
            <div class="hc-sched-cc-row">
              <span class="hc-sched-cc-label">Format</span>
              <strong class="hc-sched-cc-val">Web Conference (Instant HD Google Meet)</strong>
            </div>
          </div>

          <a href="${escapeHtml(meet.videoUrl)}" target="_blank" class="hc-sched-join-btn">
            Join Video Room &rarr;
          </a>

          <div class="hc-sched-actions-row">
            <button type="button" class="hc-sched-action-btn primary" id="hc-sched-act-cal">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Add to Calendar
            </button>
            <button type="button" class="hc-sched-action-btn" id="hc-sched-act-reschedule">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
              Reschedule Meeting
            </button>
            <button type="button" class="hc-sched-action-btn danger" id="hc-sched-act-cancel">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              Cancel Meeting
            </button>
            <button type="button" class="hc-sched-action-btn" id="hc-sched-act-close">
              Close
            </button>
          </div>
        </div>
      `;

      const calBtn = overlay.querySelector('#hc-sched-act-cal');
      if (calBtn) {
        calBtn.addEventListener('click', () => {
          downloadIcsCalendar(meet);
          openGoogleCalendar(meet);
          showToast('Calendar invite downloaded (.ics) and Google Calendar opened!');
        });
      }

      const reschedBtn = overlay.querySelector('#hc-sched-act-reschedule');
      if (reschedBtn) {
        reschedBtn.addEventListener('click', () => {
          openBookingModal(meet.purpose, true, meet.reference);
        });
      }

      const cancelBtn = overlay.querySelector('#hc-sched-act-cancel');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', async () => {
          if (!confirm('Are you sure you want to cancel this meeting?')) return;
          try {
            cancelBtn.disabled = true;
            cancelBtn.textContent = 'Cancelling...';
            const cRes = await fetch('/api/bookings/cancel', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reference: meet.reference, reason: 'Cancelled by attendee' })
            });
            const cData = await cRes.json();
            if (cRes.ok && cData.success) {
              showToast('Meeting cancelled successfully.');
              bodyContainer.innerHTML = `
                <div class="hc-sched-confirmed-view">
                  <div class="hc-sched-confirm-badge-icon" style="background: #fee2e2; color: #dc2626; border-color: #fca5a5;">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                  <h3 class="hc-sched-confirmed-title" style="color: #991b1b;">Meeting Cancelled</h3>
                  <div class="hc-sched-ref-pill">Reference: ${escapeHtml(meet.reference)}</div>
                  <p class="hc-sched-confirmed-sub">Your meeting reservation has been cancelled. You may schedule a new session at any time.</p>
                  <div style="margin-top: 24px; display: flex; justify-content: center; gap: 12px;">
                    <button type="button" class="hc-sched-action-btn primary" id="hc-sched-rebook-btn">Book New Session</button>
                    <button type="button" class="hc-sched-action-btn" id="hc-sched-cancelled-close-btn">Close</button>
                  </div>
                </div>
              `;
              overlay.querySelector('#hc-sched-rebook-btn').addEventListener('click', () => openBookingModal());
              overlay.querySelector('#hc-sched-cancelled-close-btn').addEventListener('click', closeModal);
            } else {
              showToast(cData.message || 'Failed to cancel meeting.', true);
              cancelBtn.disabled = false;
              cancelBtn.textContent = 'Cancel Meeting';
            }
          } catch (e) {
            showToast('Network error while cancelling meeting.', true);
            cancelBtn.disabled = false;
            cancelBtn.textContent = 'Cancel Meeting';
          }
        });
      }

      const closeDoneBtn = overlay.querySelector('#hc-sched-act-close');
      if (closeDoneBtn) closeDoneBtn.addEventListener('click', closeModal);
    }
  }

  function updateTalentMatchNav() {
    document.querySelectorAll('a[href="/approach/"], a[href="/cases/"]').forEach(a => {
      const txt = a.textContent.trim().toLowerCase();
      if (txt.includes('for employers') || txt.includes('employers')) {
        const scrambleDiv = a.querySelector('._scrambleText_gjmr7_1');
        if (scrambleDiv) {
          scrambleDiv.setAttribute('data-text', 'Talent Match');
          const spans = scrambleDiv.querySelectorAll('span');
          if (spans.length >= 2) {
            spans[0].textContent = 'Talent Match';
            spans[1].textContent = 'Talent Match';
          }
        } else {
          a.textContent = 'Talent Match';
        }
        a.setAttribute('href', '/cases/');
      }
    });
  }

  // ==================== GLOBAL TOP-LEFT CORNER BACK BUTTON ====================
  const NAV_STACK_KEY = 'hc_nav_stack';
  const NAV_ACTION_KEY = 'hc_nav_action';

  function isLandingPage() {
    const p = (window.location.pathname || '').replace(/\/+$/, '') || '/';
    return p === '/' || p === '/index.html';
  }

  function normalizeNavPath(urlStr) {
    try {
      const u = new URL(urlStr || window.location.href, window.location.origin);
      let p = u.pathname;
      if (!p.endsWith('/') && !p.includes('.')) {
        p += '/';
      }
      return p;
    } catch (e) {
      return (window.location.pathname || '/');
    }
  }

  function getFriendlyPageName(pathStr) {
    if (!pathStr) return 'Home';
    const clean = pathStr.split('?')[0].replace(/\/+$/, '') || '/';
    if (clean === '/' || clean === '/index.html' || clean === '') return 'Home';
    if (clean.includes('/services')) return 'Find Jobs';
    if (clean.includes('/approach')) return 'Companies';
    if (clean.startsWith('/cases/') && clean !== '/cases') return 'Talent Match';
    if (clean.includes('/cases')) return 'Talent Match';
    if (clean.includes('/about')) return 'Sign In';
    if (clean.includes('/signup')) return 'Sign Up';
    if (clean.includes('/profile')) return 'My Profile';
    if (clean.includes('/settings')) return 'Settings';
    if (clean.includes('/contact')) return 'Contact';
    if (clean.includes('/privacy')) return 'Privacy';
    if (clean.includes('/terms')) return 'Terms';
    return 'Previous Page';
  }

  function getNavHistoryStack() {
    try {
      const raw = sessionStorage.getItem(NAV_STACK_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveNavHistoryStack(stack) {
    try {
      sessionStorage.setItem(NAV_STACK_KEY, JSON.stringify(stack.slice(-30)));
    } catch (e) {}
  }

  function recordPageNavigation() {
    const current = normalizeNavPath(window.location.href);
    const action = sessionStorage.getItem(NAV_ACTION_KEY);
    sessionStorage.removeItem(NAV_ACTION_KEY);

    let stack = getNavHistoryStack();

    if (action === 'back') {
      const lastIdx = stack.lastIndexOf(current);
      if (lastIdx !== -1) {
        stack = stack.slice(0, lastIdx + 1);
      } else {
        if (stack.length > 0) stack.pop();
        stack.push(current);
      }
    } else {
      if (stack.length === 0) {
        stack.push(current);
      } else {
        const last = stack[stack.length - 1];
        if (last !== current) {
          stack.push(current);
        }
      }
    }

    saveNavHistoryStack(stack);
  }

  function getPreviousNavPage() {
    const current = normalizeNavPath(window.location.href);
    const stack = getNavHistoryStack();
    for (let i = stack.length - 2; i >= 0; i--) {
      if (stack[i] && stack[i] !== current) {
        return stack[i];
      }
    }
    return '/';
  }

  function handleCornerBackClick(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }

    sessionStorage.setItem(NAV_ACTION_KEY, 'back');

    const prevTarget = getPreviousNavPage();

    // 1. If browser has navigation history, use native history.back()
    if (window.history.length > 1) {
      const initialLocation = window.location.href;
      window.history.back();

      // 2. Fallback timeout if browser history is blocked or external
      setTimeout(() => {
        if (window.location.href === initialLocation) {
          window.location.href = prevTarget;
        }
      }, 160);
      return;
    }

    // 3. Fallback for tabs without browser history
    window.location.href = prevTarget;
  }

  function ensureBackButton() {
    // In landing page there is no need to have back button
    if (isLandingPage()) {
      const existing = document.getElementById('hc-back-button');
      if (existing) existing.remove();
      return;
    }

    let btn = document.getElementById('hc-back-button');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'hc-back-button';
      btn.className = 'hc-global-back-btn';
      btn.setAttribute('aria-label', 'Navigate back');
      btn.innerHTML = `
        <svg class="hc-back-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span class="hc-back-text">Back</span>
      `;
      if (document.body) {
        document.body.insertBefore(btn, document.body.firstChild);
      }
    }

    btn.style.display = 'inline-flex';

    if (!btn.dataset.hcBound) {
      btn.dataset.hcBound = 'true';
      btn.addEventListener('click', handleCornerBackClick);
    }

    const prevInStack = getPreviousNavPage();
    const destName = getFriendlyPageName(prevInStack);
    btn.setAttribute('title', `Go back to ${destName}`);
  }

  // ==================== HIRECONNECT LOGO NAVIGATION ====================
  // Clicking the HireConnect logo on any page always returns to landing page
  function setupLogoNavigation() {
    document.addEventListener('click', (e) => {
      const logoLink = e.target.closest('a._logo_p8o7m_21, a._logo_s2ww8_20');
      if (logoLink) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const pathname = (window.location.pathname || '').replace(/\/+$/, '') || '/';
        if (pathname === '/' || pathname === '/index.html') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.location.href = '/';
        }
        return;
      }

      const anyHomeLink = e.target.closest('a[href="/"], a[href="/index.html"]');
      if (anyHomeLink) {
        if (anyHomeLink.classList.contains('_item_1lkeu_28')) return;
        if (anyHomeLink.querySelector('svg') || anyHomeLink.closest('#nav') || anyHomeLink.closest('#footer')) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          const pathname = (window.location.pathname || '').replace(/\/+$/, '') || '/';
          if (pathname === '/' || pathname === '/index.html') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            window.location.href = '/';
          }
        }
      }
    }, true);
  }

  // ==================== TALENT MATCH NAVBAR ENFORCEMENT ====================
  function ensureTalentMatchNav() {
    const pathname = (window.location.pathname || '').replace(/\/+$/, '') || '/';
    const isCases = pathname === '/cases' || document.querySelector('[data-page="cases"]');
    if (!isCases) return;

    const nav = document.getElementById('nav');
    if (nav) {
      if (nav.classList.contains('_isSmall_p8o7m_61')) {
        nav.classList.remove('_isSmall_p8o7m_61');
      }
      if (!nav.classList.contains('hc-force-nav-expanded')) {
        nav.classList.add('hc-force-nav-expanded');
      }

      const tmLink = nav.querySelector('a[href="/cases/"]');
      if (tmLink) {
        tmLink.classList.add('router-link-active', 'router-link-exact-active');
        tmLink.setAttribute('aria-current', 'page');
      }
    }
  }

  // ==================== INITIALIZATION & WATCHDOG ====================
  function init() {
    recordPageNavigation();
    ensureBackButton();
    setupLogoNavigation();
    checkAuth();
    updateTalentMatchNav();
    ensureTalentMatchNav();

    // Unified HireConnect button handler: both navbar button & landing page button open meeting booking
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button, [role="button"], a');
      if (!btn) return;

      // EXCLUDE logo links - they must navigate to landing page, NEVER open modal!
      const isLogo = btn.classList.contains('_logo_p8o7m_21') ||
                     btn.classList.contains('_logo_s2ww8_20') ||
                     btn.closest('._logo_p8o7m_21, ._logo_s2ww8_20') ||
                     (btn.tagName === 'A' && (btn.getAttribute('href') === '/' || btn.getAttribute('href') === '/index.html'));
      if (isLogo) return;

      const btnText = (btn.textContent || '').trim().toLowerCase();
      const isHireConnectBtn = btnText === 'hireconnect' ||
                               btn.classList.contains('_hireButton_p8o7m_55') ||
                               btn.classList.contains('_hireButton_1lkeu_52') ||
                               btn.classList.contains('_button_193mg_34') ||
                               btn.classList.contains('_hireTalentButton_s2ww8_54') ||
                               btn.hasAttribute('data-hireconnect-modal');

      if (isHireConnectBtn) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openBookingModal();
      }
    }, true);

    // Watchdog for dynamic route/DOM changes
    const observer = new MutationObserver(() => {
      ensureBackButton();
      ensureTalentMatchNav();
    });
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: false });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Global exports
  window.HireConnectAuth = {
    openBookingModal,
    checkAuth,
    getUser: () => currentUser,
    getProfile: () => userProfile,
    getCompany: () => userCompany,
    openCandidateProfileModal,
    openPostJobModal,
    openApplyModal,
    openMyApplicationsModal,
    showToast,
    ensureBackButton,
    navigateBack: handleCornerBackClick
  };
})();
