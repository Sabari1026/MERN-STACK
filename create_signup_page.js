const fs = require('fs');

let html = fs.readFileSync('about/index.html', 'utf8');

// Update page title
html = html.replace('<title>About Us | HireConnect</title>', '<title>Create Account | HireConnect</title>');
html = html.replace(
  '<link rel="stylesheet" href="/_nuxt/sign-in.css" id="hc-auth-styles">',
  '<link rel="stylesheet" href="/_nuxt/sign-in.css" id="hc-auth-styles">\n<script src="/_nuxt/sign-up-engine.js" defer></script>'
);
html = html.replace('<script src="/_nuxt/sign-in-engine.js" defer></script>', '');

const signupRootHtml = `
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

const startMarker = '<div id="hc-auth-root"';
const endMarker = '</form>\n</div>';

const startIdx = html.indexOf(startMarker);
const formEndIdx = html.indexOf(endMarker, startIdx);

if (startIdx !== -1 && formEndIdx !== -1) {
  const finalHtml = html.slice(0, startIdx) + signupRootHtml + html.slice(formEndIdx + endMarker.length);
  fs.writeFileSync('signup/index.html', finalHtml);
  fs.writeFileSync('blueprintapps.io/signup/index.html', finalHtml);
  console.log('Successfully wrote signup/index.html & mirror, size:', finalHtml.length);
} else {
  console.error('Markers not found', startIdx, formEndIdx);
}
