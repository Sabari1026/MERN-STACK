const fs = require('fs');
const path = require('path');

function fixMenu(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  // Find widget.innerHTML = `\n        <button type="button" class="hc-nav-avatar-btn ${isRecruiter ? 'recruiter' : 'candidate'}"
  const startPattern = 'widget.innerHTML = `\n        <button type="button" class="hc-nav-avatar-btn ${isRecruiter ? \'recruiter\' : \'candidate\'}"';
  const endPattern = '<span>Sign Out</span>\n          </button>\n        </div>\n      `;';

  const startIndex = code.indexOf('widget.innerHTML = `\n        <button type="button" class="hc-nav-avatar-btn ${isRecruiter');
  if (startIndex === -1) {
    console.error('Could not find start index in', filePath);
    return;
  }

  const endIndex = code.indexOf('<span>Sign Out</span>\n          </button>\n        </div>\n      `;', startIndex);
  if (endIndex === -1) {
    console.error('Could not find end index in', filePath);
    return;
  }

  const replacement = `widget.innerHTML = \`
        <button type="button" class="hc-nav-avatar-btn \${isRecruiter ? 'recruiter' : 'candidate'}" id="hc-nav-avatar-trigger" aria-label="\${escapeHtml(currentUser.name)}'s Account Menu" aria-haspopup="true" aria-expanded="false" title="\${escapeHtml(currentUser.name)}">
          \${avatarPhoto ? \`
            <img src="\${escapeHtml(avatarPhoto)}" class="hc-nav-avatar-img" alt="\${escapeHtml(currentUser.name)}" />
          \` : \`
            <div class="hc-nav-avatar-initials \${isRecruiter ? 'recruiter' : 'candidate'}">\${initials}</div>
          \`}
          <span class="hc-nav-status-dot \${isRecruiter ? 'recruiter' : ''}"></span>
        </button>

        <div class="hc-account-dropdown" id="hc-account-dropdown-menu" role="menu">
          <div class="hc-dropdown-header \${isRecruiter ? 'recruiter' : ''}">
            <div class="hc-dh-name">\${escapeHtml(currentUser.name)}</div>
            <div class="hc-dh-email">\${escapeHtml(currentUser.email)}</div>
            <div class="hc-dh-meta">
              <span class="hc-role-tag \${isRecruiter ? 'recruiter' : 'candidate'}">\${roleBadgeLabel}</span>
              \${!isRecruiter && userProfile ? \`<span class="hc-completion-mini">\${userProfile.completionPercentage || 85}% Profile</span>\` : ''}
              \${isRecruiter && userCompany ? \`<span class="hc-dh-comp">🏢 \${escapeHtml(userCompany.name)}</span>\` : ''}
            </div>
          </div>

          <div class="hc-dropdown-divider"></div>

          \${!isRecruiter ? \`
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
          \` : \`
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
          <button type="button" class="hc-dropdown-item danger" id="hc-menu-signout" role="menuitem">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span>Sign Out</span>
          </button>
        </div>
      \`;`;

  code = code.substring(0, startIndex) + replacement + code.substring(endIndex + '<span>Sign Out</span>\n          </button>\n        </div>\n      `;'.length);

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Fixed', filePath);
}

fixMenu(path.join(__dirname, 'shared-account-menu.js'));
fixMenu(path.join(__dirname, 'blueprintapps.io', 'shared-account-menu.js'));
