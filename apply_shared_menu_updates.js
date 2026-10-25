const fs = require('fs');
const path = require('path');

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping non-existent: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Ensure Create Account in guest menu
  content = content.replace(
    /<span class="hc-di-title">Create Account \/ Sign Up<\/span>/g,
    '<span class="hc-di-title">Create Account</span>'
  );

  // 2. Candidate Dropdown HTML
  const candidateDropdownOldRegex = /\$\{\!isRecruiter \? `[\s\S]*?` : `/;
  const candidateDropdownNew = `\${!isRecruiter ? \`
            <a href="/profile/" class="hc-dropdown-item" id="hc-menu-my-profile" role="menuitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>My Profile</span>
            </a>
            <a href="/profile/?tab=resume" class="hc-dropdown-item" id="hc-menu-update-resume" role="menuitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
              <span>Update Resume</span>
            </a>
            <button type="button" class="hc-dropdown-item" id="hc-menu-my-applications" role="menuitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              <span>My Applications</span>
            </button>
            <a href="/cases/?view=saved" class="hc-dropdown-item" id="hc-menu-saved-jobs" role="menuitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              <span>Saved Jobs</span>
            </a>
            <a href="/cases/" class="hc-dropdown-item" id="hc-menu-talent-match" role="menuitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="12 8 8 12 12 16 16 12 12 8"></polygon></svg>
              <span>Talent Match</span>
            </a>
            <a href="/settings/" class="hc-dropdown-item" id="hc-menu-settings" role="menuitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <span>Settings</span>
            </a>
          \` : \``;

  if (candidateDropdownOldRegex.test(content)) {
    content = content.replace(candidateDropdownOldRegex, candidateDropdownNew);
  }

  // 3. Recruiter Dropdown HTML
  const recruiterDropdownOldRegex = /: `[\s\S]*?<div class="hc-dropdown-divider"><\/div>[\s\S]*?<button type="button" class="hc-dropdown-item danger" id="hc-menu-signout"/;
  const recruiterDropdownNew = `: \`
            <a href="/profile/" class="hc-dropdown-item" id="hc-menu-my-profile" role="menuitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>My Profile</span>
            </a>
            <a href="/approach/?tab=jobs" class="hc-dropdown-item" id="hc-menu-recruiter-dashboard" role="menuitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span>Recruiter Dashboard</span>
            </a>
            <a href="/approach/?tab=overview" class="hc-dropdown-item" id="hc-menu-company-profile" role="menuitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              <span>Company Profile</span>
            </a>
            <button type="button" class="hc-dropdown-item" id="hc-menu-post-job" role="menuitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              <span>Post a Job</span>
            </button>
            <a href="/approach/?tab=jobs" class="hc-dropdown-item" id="hc-menu-manage-jobs" role="menuitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              <span>Manage Jobs</span>
            </a>
            <a href="/cases/" class="hc-dropdown-item" id="hc-menu-talent-match" role="menuitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="12 8 8 12 12 16 16 12 12 8"></polygon></svg>
              <span>Talent Match</span>
            </a>
            <a href="/settings/" class="hc-dropdown-item" id="hc-menu-settings" role="menuitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <span>Settings</span>
            </a>
          \`}

          <div class="hc-dropdown-divider"></div>
          <button type="button" class="hc-dropdown-item danger" id="hc-menu-signout"`;

  if (recruiterDropdownOldRegex.test(content)) {
    content = content.replace(recruiterDropdownOldRegex, recruiterDropdownNew);
  }

  // 4. Dropdown action click listeners
  const actionHandlersTarget = `const btnUpdateResume = widget.querySelector('#hc-menu-update-resume');
    if (btnUpdateResume) {
      btnUpdateResume.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.remove('show');
        if (window.location.pathname.startsWith('/profile/')) {
          const tabResume = document.querySelector('[data-tab="tab-resume"]');
          if (tabResume) tabResume.click();
        } else {
          openCandidateProfileModal('tab-resume');
        }
      });
    }`;

  const actionHandlersReplacement = `const btnUpdateResume = widget.querySelector('#hc-menu-update-resume');
    if (btnUpdateResume) {
      btnUpdateResume.addEventListener('click', (e) => {
        if (window.location.pathname.startsWith('/profile/')) {
          e.preventDefault();
          dropdown.classList.remove('show');
          const tabResume = document.querySelector('[data-tab="tab-resume"]');
          if (tabResume) tabResume.click();
        }
      });
    }

    const btnMyApps = widget.querySelector('#hc-menu-my-applications');
    if (btnMyApps) {
      btnMyApps.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.remove('show');
        openMyApplicationsModal();
      });
    }

    const btnPostJob = widget.querySelector('#hc-menu-post-job');
    if (btnPostJob) {
      btnPostJob.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.remove('show');
        openPostJobModal();
      });
    }`;

  if (content.includes(actionHandlersTarget)) {
    content = content.replace(actionHandlersTarget, actionHandlersReplacement);
  }

  // 5. Booking Modal Implementation
  const bookingCode = `
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
      const res = await fetch(\`/api/bookings/availability?date=\${encodeURIComponent(date)}&timezone=\${encodeURIComponent(timezone)}&purpose=\${encodeURIComponent(purpose)}\`);
      const data = await res.json();

      if (!data.available && data.reason) {
        chipsContainer.innerHTML = \`<div style="color: #ff9999; font-size: 13rem; padding: 12rem 0;">\${escapeHtml(data.reason)}</div>\`;
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

      if (statusLabel) statusLabel.textContent = \`\${currentAvailableSlots.length} slot\${currentAvailableSlots.length === 1 ? '' : 's'} available\`;

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
        return \`
          <button type="button" class="bm-slot-chip \${isBooked ? 'booked' : ''} \${isSelected ? 'selected' : ''}" data-slot="\${escapeHtml(slot)}" \${isBooked ? 'disabled' : ''}>
            \${escapeHtml(slot)}
            \${isBooked ? ' (Booked)' : ''}
          </button>
        \`;
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
    const now = new Date();
    now.setDate(now.getDate() + 1);
    if (now.getDay() === 6) now.setDate(now.getDate() + 2);
    if (now.getDay() === 0) now.setDate(now.getDate() + 1);
    return now.toISOString().split('T')[0];
  }

  function openBookingModal(initialPurpose) {
    let overlay = document.getElementById('hc-booking-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'hc-booking-modal';
      overlay.className = 'hc-modal-overlay';
      document.body.appendChild(overlay);
    }

    const defaultDate = getNextBusinessDayStr();
    const todayStr = new Date().toISOString().split('T')[0];

    const defaultName = currentUser ? currentUser.name : '';
    const defaultEmail = currentUser ? currentUser.email : '';
    const defaultCompany = (currentUser && currentUser.role === 'recruiter' && userCompany) ? userCompany.name : '';

    overlay.innerHTML = \`
      <div class="bm-modal-card">
        <div class="bm-header">
          <div class="bm-title-box">
            <div class="bm-title-badge">DIRECT BOOKING</div>
            <h3 class="bm-title">Schedule a Session with HireConnect</h3>
            <p class="bm-subtitle">Connect directly with our talent matching &amp; engineering leadership for live demonstrations or recruiting consultations.</p>
          </div>
          <button type="button" class="hc-modal-close-btn" id="hc-booking-close">&times;</button>
        </div>

        <div class="bm-body" id="hc-booking-body">
          <form id="hc-booking-form">
            <div class="bm-grid">
              <div class="bm-field">
                <label class="bm-label">Full Name *</label>
                <input type="text" class="bm-input" id="bm-input-name" value="\${escapeHtml(defaultName)}" required placeholder="e.g. Vikramaditya Sharma">
              </div>
              <div class="bm-field">
                <label class="bm-label">Work Email *</label>
                <input type="email" class="bm-input" id="bm-input-email" value="\${escapeHtml(defaultEmail)}" required placeholder="name@company.com">
              </div>
              <div class="bm-field">
                <label class="bm-label">Phone Number (Optional)</label>
                <input type="tel" class="bm-input" id="bm-input-phone" placeholder="+91 98765 43210">
              </div>
              <div class="bm-field">
                <label class="bm-label">Company Name (Optional)</label>
                <input type="text" class="bm-input" id="bm-input-company" value="\${escapeHtml(defaultCompany)}" placeholder="e.g. Razorpay, Zepto">
              </div>
              <div class="bm-field full">
                <label class="bm-label">Meeting Purpose *</label>
                <select class="bm-select" id="bm-input-purpose" required>
                  <option value="Talent Match demonstration" \${initialPurpose === 'Talent Match demonstration' ? 'selected' : ''}>Talent Match Live Demo &amp; Candidate Matching</option>
                  <option value="Recruitment and hiring discussion" \${initialPurpose === 'Recruitment and hiring discussion' ? 'selected' : ''}>Recruitment &amp; Enterprise Hiring Solutions</option>
                  <option value="Company onboarding" \${initialPurpose === 'Company onboarding' ? 'selected' : ''}>Employer Registration &amp; Company Onboarding</option>
                  <option value="Technical demonstration" \${initialPurpose === 'Technical demonstration' ? 'selected' : ''}>Technical Architecture &amp; Vetting Assessment</option>
                  <option value="Partnership or business enquiry" \${initialPurpose === 'Partnership or business enquiry' ? 'selected' : ''}>Strategic Partnership &amp; Advisory</option>
                  <option value="General HireConnect enquiry" \${initialPurpose === 'General HireConnect enquiry' ? 'selected' : ''}>General HireConnect Consultation</option>
                </select>
              </div>
              <div class="bm-field">
                <label class="bm-label">Meeting Date * (Mon - Fri)</label>
                <input type="date" class="bm-input" id="bm-input-date" min="\${todayStr}" value="\${defaultDate}" required>
              </div>
              <div class="bm-field">
                <label class="bm-label">Timezone</label>
                <select class="bm-select" id="bm-input-timezone">
                  <option value="Asia/Kolkata" selected>Asia/Kolkata (IST, UTC+05:30)</option>
                  <option value="America/New_York">America/New_York (EST, UTC-05:00)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST, UTC-08:00)</option>
                  <option value="Europe/London">Europe/London (GMT/BST, UTC+01:00)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT, UTC+08:00)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST, UTC+04:00)</option>
                </select>
              </div>
            </div>

            <!-- TIME SLOTS -->
            <div class="bm-slots-section">
              <div class="bm-slots-label">
                <span>Available Time Slots (30 min) *</span>
                <span id="bm-slots-status" style="color: var(--hc-mint);">Checking availability...</span>
              </div>
              <div class="bm-slot-chips" id="bm-slot-chips-container">
                <!-- Dynamically rendered chips -->
              </div>
              <input type="hidden" id="bm-selected-slot" required>
            </div>

            <!-- HOST PREVIEW CARD -->
            <div class="bm-assigned-host-card" id="bm-assigned-host-box">
              <div class="bm-host-avatar" id="bm-host-avatar">ND</div>
              <div class="bm-host-info">
                <strong id="bm-host-name">Neeraj Deshmukh</strong>
                <span id="bm-host-role">Lead Solutions Architect &amp; Engineering Lead</span>
              </div>
            </div>

            <div class="bm-field full" style="margin-top: 14rem;">
              <label class="bm-label">Meeting Format</label>
              <div style="font-size: 13rem; color: #a1d8c0; background: rgba(161,216,192,0.08); padding: 10rem 14rem; border-radius: 8rem; border: 1px solid rgba(161,216,192,0.2); font-family: var(--hc-font-mono);">
                📹 Video Conference (Instant HD WebRTC / Google Meet room dispatched upon confirmation)
              </div>
            </div>

            <div class="bm-field full" style="margin-top: 14rem;">
              <label class="bm-label">Discussion Agenda / Context (Optional)</label>
              <textarea class="bm-textarea" id="bm-input-agenda" placeholder="Share specific candidate requirements, tech stack focus, or questions for our team..."></textarea>
            </div>

            <div id="bm-form-error" style="color: #ff6b6b; font-size: 13rem; margin-top: 12rem; display: none; padding: 8rem 12rem; background: rgba(255,107,107,0.1); border-radius: 6rem; border: 1px solid rgba(255,107,107,0.2);"></div>

            <div class="bm-footer">
              <button type="button" class="hc-btn-secondary" id="bm-btn-cancel">Cancel</button>
              <button type="submit" class="hc-btn-primary" id="bm-btn-submit">Confirm &amp; Schedule Meeting</button>
            </div>
          </form>
        </div>
      </div>
    \`;

    overlay.classList.add('open');

    const closeBtn = overlay.querySelector('#hc-booking-close');
    const cancelBtn = overlay.querySelector('#bm-btn-cancel');
    const closeModal = () => overlay.classList.remove('open');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    const dateInput = overlay.querySelector('#bm-input-date');
    const timezoneSelect = overlay.querySelector('#bm-input-timezone');
    const purposeSelect = overlay.querySelector('#bm-input-purpose');
    const bookingForm = overlay.querySelector('#hc-booking-form');

    const updateAvailability = () => {
      fetchBookingSlots(dateInput.value, timezoneSelect.value, purposeSelect.value);
    };

    dateInput.addEventListener('change', updateAvailability);
    timezoneSelect.addEventListener('change', updateAvailability);
    purposeSelect.addEventListener('change', updateAvailability);

    updateAvailability();

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errDiv = document.getElementById('bm-form-error');
      const submitBtn = document.getElementById('bm-btn-submit');
      if (errDiv) errDiv.style.display = 'none';

      const name = document.getElementById('bm-input-name').value.trim();
      const email = document.getElementById('bm-input-email').value.trim();
      const phone = document.getElementById('bm-input-phone').value.trim();
      const company = document.getElementById('bm-input-company').value.trim();
      const purpose = document.getElementById('bm-input-purpose').value;
      const date = document.getElementById('bm-input-date').value;
      const timezone = document.getElementById('bm-input-timezone').value;
      const timeSlot = document.getElementById('bm-selected-slot').value;
      const agenda = document.getElementById('bm-input-agenda').value.trim();

      if (!timeSlot) {
        if (errDiv) {
          errDiv.textContent = 'Please select an available time slot chip.';
          errDiv.style.display = 'block';
        }
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Securing Time Slot...';

      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            company,
            purpose,
            date,
            timeSlot,
            timezone,
            format: 'Video Call (Google Meet)',
            agenda
          })
        });

        const data = await res.json();

        if (res.status === 409) {
          if (errDiv) {
            errDiv.textContent = data.message || 'This time slot is already booked. Please choose another available slot.';
            errDiv.style.display = 'block';
          }
          submitBtn.disabled = false;
          submitBtn.textContent = 'Confirm & Schedule Meeting';
          fetchBookingSlots(date, timezone, purpose);
          return;
        }

        if (!res.ok || !data.success) {
          if (errDiv) {
            errDiv.textContent = data.message || 'Failed to book meeting. Please check required fields.';
            errDiv.style.display = 'block';
          }
          submitBtn.disabled = false;
          submitBtn.textContent = 'Confirm & Schedule Meeting';
          return;
        }

        const meet = data.meeting;
        const bodyContainer = document.getElementById('hc-booking-body');
        bodyContainer.innerHTML = \`
          <div class="bm-confirm-box">
            <div class="bm-success-icon">✓</div>
            <h3 style="font-size: 22rem; color: #fff; margin-bottom: 8rem; font-weight: 600;">Meeting Confirmed!</h3>
            <div class="bm-ref-pill">Reference Code: \${escapeHtml(meet.reference)}</div>
            <p style="font-size: 14rem; color: #ccc; margin-bottom: 16rem; line-height: 1.6;">
              Your video session with <strong style="color: #fff;">\${escapeHtml(meet.hostName)}</strong> (\${escapeHtml(meet.hostRole)}) has been reserved for<br>
              <strong style="color: var(--hc-mint); font-family: var(--hc-font-mono); font-size: 15rem;">\${escapeHtml(meet.date)}</strong> at 
              <strong style="color: var(--hc-mint); font-family: var(--hc-font-mono); font-size: 15rem;">\${escapeHtml(meet.timeSlot)}</strong> (\${escapeHtml(meet.timezone)}).
            </p>

            <a href="\${escapeHtml(meet.videoUrl)}" target="_blank" class="bm-video-btn">
              Join Video Room &rarr;
            </a>

            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8rem; padding: 14rem 18rem; margin: 16rem 0; font-size: 12rem; color: #aaa; text-align: left; font-family: var(--hc-font-mono); line-height: 1.6;">
              <div style="margin-bottom: 6rem;">📧 <strong>Confirmation dispatched:</strong> \${escapeHtml(meet.email)}</div>
              <div>🔄 <strong>Need to modify or cancel?</strong> Email team@hireconnect.io referencing <strong>\${escapeHtml(meet.reference)}</strong></div>
            </div>

            <div style="margin-top: 24rem;">
              <button type="button" class="hc-btn-primary" id="bm-confirm-close-btn" style="min-width: 140rem;">Done</button>
            </div>
          </div>
        \`;

        document.getElementById('bm-confirm-close-btn').addEventListener('click', closeModal);
        showToast('Meeting confirmed! Calendar invite dispatched.');
      } catch (err) {
        if (errDiv) {
          errDiv.textContent = 'Network or server error while booking. Please try again.';
          errDiv.style.display = 'block';
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm & Schedule Meeting';
      }
    });
  }

  function updateTalentMatchNav() {
    document.querySelectorAll('a[href="/approach/"], a[href="/cases/"]').forEach(a => {
      const txt = a.textContent.trim().toLowerCase();
      if (txt.includes('for employers') || txt.includes('employers')) {
        if (!a.closest('#hc-account-dropdown-menu')) {
          a.textContent = 'Talent Match';
          a.setAttribute('href', '/cases/');
        }
      }
    });
  }
`;

  // Insert before // ==================== INITIALIZATION & WATCHDOG ====================
  if (!content.includes('function openBookingModal')) {
    content = content.replace(
      /\/\/ ==================== INITIALIZATION & WATCHDOG ====================/,
      `${bookingCode}\n  // ==================== INITIALIZATION & WATCHDOG ====================`
    );
  }

  // 6. Update init() to capture HireConnect clicks and run updateTalentMatchNav
  const initTarget = `  // ==================== INITIALIZATION & WATCHDOG ====================
  function init() {
    checkAuth();

    // Attach to existing "HireConnect" modal button if user clicks it
    document.addEventListener('click', (e) => {
      const target = e.target.closest('._hireButton_p8o7m_55, ._hireButton_1lkeu_52');
      if (target) {
        // If recruiter logged in, open post job modal
        if (currentUser && currentUser.role === 'recruiter') {
          e.preventDefault();
          e.stopPropagation();
          openPostJobModal();
        } else if (currentUser && currentUser.role === 'employee') {
          e.preventDefault();
          e.stopPropagation();
          openCandidateProfileModal();
        }
      }
    });

    // DOM watchdog for Nuxt hydration/route updates
    const observer = new MutationObserver(() => {
      const widget = document.getElementById('hc-nav-account-widget');
      const navRight = document.querySelector('#nav ._right_p8o7m_36');
      if (navRight && !widget) {
        renderNavWidget();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }`;

  const initReplacement = `  // ==================== INITIALIZATION & WATCHDOG ====================
  function init() {
    checkAuth();
    updateTalentMatchNav();

    // Global capture handler for HireConnect navbar / mobile button -> Open genuine meeting booking modal
    document.addEventListener('click', (e) => {
      const hireBtn = e.target.closest('._hireButton_p8o7m_55, ._hireButton_1lkeu_52, [data-hireconnect-modal]');
      if (hireBtn) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openBookingModal();
      }
    }, true);

    // DOM watchdog for Nuxt hydration/route updates
    const observer = new MutationObserver(() => {
      const widget = document.getElementById('hc-nav-account-widget');
      const navRight = document.querySelector('#nav ._right_p8o7m_36');
      if (navRight && !widget) {
        renderNavWidget();
      }
      updateTalentMatchNav();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }`;

  if (content.includes(initTarget)) {
    content = content.replace(initTarget, initReplacement);
  } else {
    // In case whitespace differs, replace regex
    const initRegex = /\/\/ ==================== INITIALIZATION & WATCHDOG ====================[\s\S]*?observer\.observe\(document\.body, \{ childList: true, subtree: true \}\);\s*\}/;
    content = content.replace(initRegex, initReplacement);
  }

  // 7. Update export object
  if (!content.includes('openBookingModal,')) {
    content = content.replace(
      /window\.HireConnectAuth = \{/,
      'window.HireConnectAuth = {\n    openBookingModal,'
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully updated: ${filePath}`);
}

updateFile(path.join(__dirname, 'shared-account-menu.js'));
updateFile(path.join(__dirname, 'blueprintapps.io', 'shared-account-menu.js'));
