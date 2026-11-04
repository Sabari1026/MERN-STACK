/**
 * HireConnect Transactional Email Templates (Phase 9)
 * Generates responsive, branded HTML emails and plain text fallbacks.
 * Adheres strictly to security and privacy guidelines:
 * - No internal recruiter notes or private resume links
 * - Safe internal frontend routes
 * - Responsive layout compatible with major email clients
 */

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Base email layout wrapper with HireConnect branding
 */
function wrapTemplate({ title, preheader, contentHtml, actionUrl, actionText }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
    .wrapper { width: 100%; background-color: #0b0f19; padding: 32px 12px; }
    .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 1px solid #1e293b; }
    .header { background-color: #0f172a; padding: 24px 32px; border-bottom: 2px solid #2563eb; text-align: left; }
    .brand-logo { color: #ffffff; font-size: 20px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; letter-spacing: -0.5px; }
    .brand-badge { background-color: #2563eb; color: #ffffff; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 9999px; margin-left: 8px; text-transform: uppercase; }
    .content { padding: 32px; font-size: 15px; line-height: 1.6; color: #334155; }
    .h1 { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.3px; }
    .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px 20px; margin: 20px 0; }
    .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
    .row:last-child { margin-bottom: 0; }
    .label { color: #64748b; font-weight: 500; }
    .value { color: #0f172a; font-weight: 600; text-align: right; }
    .btn-wrap { text-align: center; margin: 28px 0 12px 0; }
    .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 6px; box-shadow: 0 4px 6px -1px rgba(37,99,235,0.2); }
    .footer { background-color: #f8fafc; padding: 20px 32px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer-links a { color: #64748b; text-decoration: underline; margin: 0 6px; }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${escapeHtml(preheader || title)}
  </div>
  <table class="wrapper" role="presentation" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td class="header">
              <a href="https://hireconnect.io" class="brand-logo">
                HireConnect<span class="brand-badge">Platform</span>
              </a>
            </td>
          </tr>
          <tr>
            <td class="content">
              <h1 class="h1">${escapeHtml(title)}</h1>
              ${contentHtml}
              ${actionUrl && actionText ? `
                <div class="btn-wrap">
                  <a href="${escapeHtml(actionUrl)}" class="btn" target="_blank">${escapeHtml(actionText)}</a>
                </div>
              ` : ''}
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p style="margin: 0 0 8px 0;">You received this transactional email because of activity on your HireConnect account.</p>
              <p style="margin: 0;" class="footer-links">
                &copy; ${new Date().getFullYear()} HireConnect Recruitment Platform &middot; All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ============================================================================
// 1. APPLICATION SUBMITTED (To Candidate)
// ============================================================================
function applicationSubmitted({
  candidateName,
  jobTitle,
  companyName,
  location,
  employmentType,
  workMode,
  salary,
  department,
  applicationId,
  actionUrl
}) {
  const roleName = jobTitle || 'Job Opening';
  const employerName = companyName || 'HireConnect Partner';
  const title = `Application Received: ${roleName}`;
  const preheader = `Your application for ${roleName} at ${employerName} has been received and is now processing.`;
  const refCode = applicationId ? String(applicationId).substring(String(applicationId).length - 8).toUpperCase() : 'APP-' + Math.floor(100000 + Math.random() * 900000);

  const contentHtml = `
    <p>Hi <strong>${escapeHtml(candidateName || 'there')}</strong>,</p>
    <p>🎉 We're excited to let you know that your application for <strong>${escapeHtml(roleName)}</strong> at <strong>${escapeHtml(employerName)}</strong> has been successfully received and is currently <strong>Under Processing</strong>.</p>
    
    <!-- Job Role Details Card -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 24px 0;">
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin-bottom: 12px;">
        📋 Job Role Specifications
      </div>
      <div class="row"><span class="label">Job Title</span><span class="value">${escapeHtml(roleName)}</span></div>
      <div class="row"><span class="label">Hiring Company</span><span class="value">${escapeHtml(employerName)}</span></div>
      ${department ? `<div class="row"><span class="label">Department</span><span class="value">${escapeHtml(department)}</span></div>` : ''}
      ${location ? `<div class="row"><span class="label">Location & Mode</span><span class="value">${escapeHtml(location)}${workMode ? ` (${escapeHtml(workMode)})` : ''}</span></div>` : ''}
      ${employmentType ? `<div class="row"><span class="label">Employment Type</span><span class="value" style="text-transform: capitalize;">${escapeHtml(employmentType)}</span></div>` : ''}
      ${salary ? `<div class="row"><span class="label">Offered Compensation</span><span class="value" style="color: #059669;">${escapeHtml(salary)}</span></div>` : ''}
      <div class="row"><span class="label">Application Reference</span><span class="value" style="font-family: monospace;">#${escapeHtml(refCode)}</span></div>
      <div class="row"><span class="label">Current Status</span><span class="value" style="color: #2563eb; background: #eff6ff; padding: 2px 8px; border-radius: 4px; font-size: 12px;">⚡ UNDER PROCESSING</span></div>
    </div>

    <!-- Application Processing Pipeline -->
    <div style="margin: 28px 0; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; background-color: #ffffff;">
      <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 14px;">
        🚀 Application Processing Roadmap
      </div>
      
      <div style="display: flex; margin-bottom: 14px;">
        <div style="min-width: 28px; height: 28px; border-radius: 50%; background: #10b981; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; text-align: center; line-height: 28px;">✓</div>
        <div>
          <div style="font-weight: 600; font-size: 14px; color: #0f172a;">Stage 1: Application Received</div>
          <div style="font-size: 12px; color: #64748b;">Your verified profile and snapshot have been delivered to the hiring team.</div>
        </div>
      </div>

      <div style="display: flex; margin-bottom: 14px;">
        <div style="min-width: 28px; height: 28px; border-radius: 50%; background: #2563eb; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; text-align: center; line-height: 28px;">2</div>
        <div>
          <div style="font-weight: 600; font-size: 14px; color: #2563eb;">Stage 2: Technical Screening &amp; Review (In Progress)</div>
          <div style="font-size: 12px; color: #64748b;">The recruiter is currently evaluating your qualifications, skills, and resume.</div>
        </div>
      </div>

      <div style="display: flex; margin-bottom: 14px;">
        <div style="min-width: 28px; height: 28px; border-radius: 50%; background: #e2e8f0; color: #64748b; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; text-align: center; line-height: 28px;">3</div>
        <div>
          <div style="font-weight: 600; font-size: 14px; color: #64748b;">Stage 3: Interview Scheduling</div>
          <div style="font-size: 12px; color: #64748b;">If shortlisted, you will receive an invitation to self-schedule an interview slot.</div>
        </div>
      </div>

      <div style="display: flex;">
        <div style="min-width: 28px; height: 28px; border-radius: 50%; background: #e2e8f0; color: #64748b; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; text-align: center; line-height: 28px;">4</div>
        <div>
          <div style="font-weight: 600; font-size: 14px; color: #64748b;">Stage 4: Final Assessment &amp; Decision</div>
          <div style="font-size: 12px; color: #64748b;">Discussion with engineering leaders followed by offer discussion.</div>
        </div>
      </div>
    </div>

    <!-- Processing Timeline Notice -->
    <div style="background-color: #f1f5f9; border-left: 4px solid #2563eb; padding: 14px 16px; border-radius: 4px; font-size: 13px; color: #475569; margin: 20px 0;">
      <strong>⏱ What to expect next:</strong> Hiring teams typically review submissions within <strong>2 to 5 business days</strong>. You'll receive instant email alerts and in-portal notifications whenever your status changes.
    </div>

    <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
      Need to update your resume or add more portfolio work? You can manage your documents at any time from your candidate profile.
    </p>
  `;

  const text = `Hi ${candidateName || 'there'},\n\nYour application for ${roleName} at ${employerName} has been received and is now UNDER PROCESSING.\n\nJOB ROLE DETAILS:\n- Position: ${roleName}\n- Company: ${employerName}\n${location ? `- Location: ${location} (${workMode || 'Hybrid'})\n` : ''}${employmentType ? `- Employment Type: ${employmentType}\n` : ''}${salary ? `- Compensation: ${salary}\n` : ''}- Reference Code: #${refCode}\n- Status: Under Processing / Review\n\nPROCESSING ROADMAP:\n1. Application Received (Completed)\n2. Technical Screening & Review (In Progress)\n3. Interview Scheduling (Upcoming)\n4. Final Assessment & Decision\n\nExpected review timeframe is 2-5 business days. You can track real-time progress anytime at:\n${actionUrl}\n\nBest regards,\nThe HireConnect Team`;

  return {
    subject: `Application Submitted & Processing: ${roleName} at ${employerName}`,
    html: wrapTemplate({
      title,
      preheader,
      contentHtml,
      actionUrl,
      actionText: 'Track Application Status'
    }),
    text
  };
}

// ============================================================================
// 2. NEW APPLICANT RECEIVED (To Recruiter)
// ============================================================================
function newApplicant({ recruiterName, candidateName, jobTitle, companyName, actionUrl }) {
  const title = 'New Candidate Application Received';
  const preheader = `${candidateName} just applied for ${jobTitle}.`;
  const contentHtml = `
    <p>Hi ${escapeHtml(recruiterName || 'there')},</p>
    <p>A new candidate has applied for your job opening on HireConnect.</p>
    <div class="card">
      <div class="row"><span class="label">Candidate</span><span class="value">${escapeHtml(candidateName)}</span></div>
      <div class="row"><span class="label">Job Opening</span><span class="value">${escapeHtml(jobTitle)}</span></div>
      <div class="row"><span class="label">Company</span><span class="value">${escapeHtml(companyName)}</span></div>
    </div>
    <p>Visit your recruiter dashboard to review the candidate's profile, resume snapshot, and evaluate their qualifications.</p>
  `;
  const text = `Hi ${recruiterName || 'there'},\n\n${candidateName} has applied for ${jobTitle} at ${companyName}.\n\nReview the application: ${actionUrl}\n\nBest regards,\nThe HireConnect Team`;
  return {
    subject: `New Applicant: ${candidateName} for ${jobTitle}`,
    html: wrapTemplate({ title, preheader, contentHtml, actionUrl, actionText: 'Review Applicant' }),
    text
  };
}

// ============================================================================
// 3. APPLICATION STATUS CHANGED (To Candidate)
// ============================================================================
function applicationStatusChanged({ candidateName, jobTitle, companyName, newStatus, actionUrl }) {
  const statusDisplay = newStatus ? newStatus.replace(/_/g, ' ').toUpperCase() : 'UPDATED';
  const title = `Application Status Update: ${statusDisplay}`;
  const preheader = `Your application for ${jobTitle} at ${companyName} has been updated to ${statusDisplay}.`;
  const contentHtml = `
    <p>Hi ${escapeHtml(candidateName || 'there')},</p>
    <p>The hiring team at <strong>${escapeHtml(companyName)}</strong> has updated the status of your application for <strong>${escapeHtml(jobTitle)}</strong>.</p>
    <div class="card">
      <div class="row"><span class="label">Position</span><span class="value">${escapeHtml(jobTitle)}</span></div>
      <div class="row"><span class="label">Company</span><span class="value">${escapeHtml(companyName)}</span></div>
      <div class="row"><span class="label">New Status</span><span class="value" style="color: #2563eb;">${escapeHtml(statusDisplay)}</span></div>
    </div>
    <p>Check your dashboard for further details or upcoming interview invitations.</p>
  `;
  const text = `Hi ${candidateName || 'there'},\n\nYour application status for ${jobTitle} at ${companyName} has been updated to: ${statusDisplay}.\n\nCheck your application: ${actionUrl}\n\nBest regards,\nThe HireConnect Team`;
  return {
    subject: `Status Update: ${jobTitle} at ${companyName} (${statusDisplay})`,
    html: wrapTemplate({ title, preheader, contentHtml, actionUrl, actionText: 'View Application Status' }),
    text
  };
}

// ============================================================================
// 4. APPLICATION WITHDRAWN (To Recruiter)
// ============================================================================
function applicationWithdrawn({ recruiterName, candidateName, jobTitle, companyName, actionUrl }) {
  const title = 'Candidate Withdrew Application';
  const preheader = `${candidateName} has withdrawn their application for ${jobTitle}.`;
  const contentHtml = `
    <p>Hi ${escapeHtml(recruiterName || 'there')},</p>
    <p>Candidate <strong>${escapeHtml(candidateName)}</strong> has withdrawn their application for <strong>${escapeHtml(jobTitle)}</strong> at <strong>${escapeHtml(companyName)}</strong>.</p>
    <div class="card">
      <div class="row"><span class="label">Candidate</span><span class="value">${escapeHtml(candidateName)}</span></div>
      <div class="row"><span class="label">Job</span><span class="value">${escapeHtml(jobTitle)}</span></div>
      <div class="row"><span class="label">Status</span><span class="value">Withdrawn</span></div>
    </div>
    <p>Your applicant management roster has been updated accordingly.</p>
  `;
  const text = `Hi ${recruiterName || 'there'},\n\n${candidateName} has withdrawn their application for ${jobTitle} at ${companyName}.\n\nView applicants: ${actionUrl}\n\nBest regards,\nThe HireConnect Team`;
  return {
    subject: `Application Withdrawn: ${candidateName} (${jobTitle})`,
    html: wrapTemplate({ title, preheader, contentHtml, actionUrl, actionText: 'View Job Applicants' }),
    text
  };
}

// ============================================================================
// 5. INTERVIEW BOOKED (To Candidate & Recruiter)
// ============================================================================
function interviewBooked({
  recipientName,
  otherParticipantName,
  role = 'candidate',
  jobTitle,
  companyName,
  meetingTitle,
  meetingReference,
  durationMinutes = 45,
  meetingMode = 'online',
  dateStr,
  timeSlotStr,
  timeZone = 'Asia/Kolkata',
  videoUrl,
  actionUrl
}) {
  const isCandidate = role === 'candidate';
  const roleName = jobTitle || 'Technical Role';
  const employerName = companyName || 'HireConnect Partner';
  const roundTitle = meetingTitle || 'Technical Interview';
  const refCode = meetingReference || 'HC-MEET-' + Math.floor(100000 + Math.random() * 900000);
  const title = `Interview Confirmed: ${roleName}`;
  const preheader = `Your interview with ${otherParticipantName} for ${roleName} is confirmed for ${dateStr} at ${timeSlotStr}.`;

  const contentHtml = isCandidate
    ? `
    <p>Hi <strong>${escapeHtml(recipientName || 'there')}</strong>,</p>
    <p>🎉 Great news! Your interview round for <strong>${escapeHtml(roleName)}</strong> with <strong>${escapeHtml(employerName)}</strong> has been successfully scheduled and confirmed on HireConnect.</p>

    <!-- Interview & Job Role Details Card -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 24px 0;">
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin-bottom: 12px;">
        🗓️ Interview &amp; Role Specifications
      </div>
      <div class="row"><span class="label">Job Position</span><span class="value" style="font-weight: 600;">${escapeHtml(roleName)}</span></div>
      <div class="row"><span class="label">Hiring Company</span><span class="value">${escapeHtml(employerName)}</span></div>
      <div class="row"><span class="label">Interview Round</span><span class="value">${escapeHtml(roundTitle)}</span></div>
      <div class="row"><span class="label">Interviewer / Host</span><span class="value">${escapeHtml(otherParticipantName)} (Recruiter / Hiring Team)</span></div>
      <div class="row"><span class="label">Scheduled Date</span><span class="value" style="color: #2563eb; font-weight: 600;">${escapeHtml(dateStr)}</span></div>
      <div class="row"><span class="label">Time &amp; Timezone</span><span class="value" style="font-weight: 600;">${escapeHtml(timeSlotStr)} (${escapeHtml(timeZone)})</span></div>
      <div class="row"><span class="label">Duration</span><span class="value">${escapeHtml(String(durationMinutes))} Minutes</span></div>
      <div class="row"><span class="label">Format</span><span class="value">Web Conference (HD Google Meet)</span></div>
      <div class="row"><span class="label">Meeting Reference</span><span class="value" style="font-family: monospace;">#${escapeHtml(refCode)}</span></div>
      <div class="row"><span class="label">Status</span><span class="value" style="color: #059669; background: #ecfdf5; padding: 2px 8px; border-radius: 4px; font-size: 12px;">✓ CONFIRMED &amp; SCHEDULED</span></div>
    </div>

    <!-- Prominent Video Link Box -->
    ${
      videoUrl
        ? `
      <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #bfdbfe; border-radius: 10px; padding: 18px 20px; margin: 20px 0; text-align: center;">
        <div style="font-size: 13px; font-weight: 600; color: #1e40af; margin-bottom: 6px;">
          🎥 Video Meeting Room Ready
        </div>
        <div style="font-size: 14px; margin-bottom: 12px;">
          <a href="${escapeHtml(videoUrl)}" target="_blank" style="color: #2563eb; font-weight: bold; text-decoration: underline; word-break: break-all;">
            ${escapeHtml(videoUrl)}
          </a>
        </div>
        <a href="${escapeHtml(videoUrl)}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 10px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none;">
          Join Video Room Now &rarr;
        </a>
      </div>
    `
        : ''
    }

    <!-- Interview Preparation & Processing Pipeline -->
    <div style="margin: 28px 0; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; background-color: #ffffff;">
      <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 14px;">
        🚀 Interview &amp; Evaluation Roadmap
      </div>
      
      <div style="display: flex; margin-bottom: 14px;">
        <div style="min-width: 28px; height: 28px; border-radius: 50%; background: #10b981; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; text-align: center; line-height: 28px;">✓</div>
        <div>
          <div style="font-weight: 600; font-size: 14px; color: #0f172a;">Stage 1: Slot Selected &amp; Confirmed</div>
          <div style="font-size: 12px; color: #64748b;">Time slot locked with the interviewer. Calendar invites dispatched.</div>
        </div>
      </div>

      <div style="display: flex; margin-bottom: 14px;">
        <div style="min-width: 28px; height: 28px; border-radius: 50%; background: #2563eb; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; text-align: center; line-height: 28px;">2</div>
        <div>
          <div style="font-weight: 600; font-size: 14px; color: #2563eb;">Stage 2: Technical &amp; System Check (Action Required)</div>
          <div style="font-size: 12px; color: #64748b;">Ensure your camera, microphone, and a stable internet connection are tested.</div>
        </div>
      </div>

      <div style="display: flex; margin-bottom: 14px;">
        <div style="min-width: 28px; height: 28px; border-radius: 50%; background: #e2e8f0; color: #64748b; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; text-align: center; line-height: 28px;">3</div>
        <div>
          <div style="font-weight: 600; font-size: 14px; color: #64748b;">Stage 3: Live Technical Assessment &amp; Discussion</div>
          <div style="font-size: 12px; color: #64748b;">Interactive session covering domain problems, past architecture, and role alignment.</div>
        </div>
      </div>

      <div style="display: flex;">
        <div style="min-width: 28px; height: 28px; border-radius: 50%; background: #e2e8f0; color: #64748b; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; text-align: center; line-height: 28px;">4</div>
        <div>
          <div style="font-weight: 600; font-size: 14px; color: #64748b;">Stage 4: Post-Interview Feedback &amp; Decision</div>
          <div style="font-size: 12px; color: #64748b;">Comprehensive debrief and next steps shared within 48 to 72 hours.</div>
        </div>
      </div>
    </div>

    <!-- Candidate Preparation Tips -->
    <div style="background-color: #f1f5f9; border-left: 4px solid #2563eb; padding: 14px 16px; border-radius: 4px; font-size: 13px; color: #475569; margin: 20px 0;">
      <strong>💡 Tips for a successful interview:</strong>
      <ul style="margin: 8px 0 0 18px; padding: 0;">
        <li>Join the video room <strong>5 minutes early</strong> to verify video and audio quality.</li>
        <li>Have your resume, past projects, and code repositories ready to share if requested.</li>
        <li>Prepare 2–3 questions about the team, tech stack, and company culture.</li>
      </ul>
    </div>
  `
    : `
    <p>Hi <strong>${escapeHtml(recipientName || 'there')}</strong>,</p>
    <p>A new interview has been confirmed on your schedule with candidate <strong>${escapeHtml(otherParticipantName)}</strong> for <strong>${escapeHtml(roleName)}</strong>.</p>

    <!-- Recruiter Details Card -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 24px 0;">
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin-bottom: 12px;">
        🗓️ Candidate Interview Schedule
      </div>
      <div class="row"><span class="label">Candidate</span><span class="value" style="font-weight: 600;">${escapeHtml(otherParticipantName)}</span></div>
      <div class="row"><span class="label">Position</span><span class="value">${escapeHtml(roleName)}</span></div>
      <div class="row"><span class="label">Company</span><span class="value">${escapeHtml(employerName)}</span></div>
      <div class="row"><span class="label">Round</span><span class="value">${escapeHtml(roundTitle)}</span></div>
      <div class="row"><span class="label">Date</span><span class="value" style="color: #2563eb; font-weight: 600;">${escapeHtml(dateStr)}</span></div>
      <div class="row"><span class="label">Time</span><span class="value" style="font-weight: 600;">${escapeHtml(timeSlotStr)} (${escapeHtml(timeZone)})</span></div>
      <div class="row"><span class="label">Duration</span><span class="value">${escapeHtml(String(durationMinutes))} Minutes</span></div>
      <div class="row"><span class="label">Reference</span><span class="value" style="font-family: monospace;">#${escapeHtml(refCode)}</span></div>
    </div>

    ${
      videoUrl
        ? `
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 18px 0; text-align: center;">
        <a href="${escapeHtml(videoUrl)}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 10px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none;">
          Open Interview Meeting Room &rarr;
        </a>
      </div>
    `
        : ''
    }

    <p style="font-size: 13px; color: #64748b; margin-top: 16px;">
      You can review candidate qualifications, resume snapshots, and past screening answers in your recruiter dashboard.
    </p>
  `;

  const text = isCandidate
    ? `Hi ${recipientName || 'there'},\n\nYour interview for ${roleName} (${roundTitle}) with ${otherParticipantName} at ${employerName} is confirmed!\n\nDETAILS:\n- Job: ${roleName}\n- Company: ${employerName}\n- Interviewer: ${otherParticipantName}\n- Date: ${dateStr}\n- Time: ${timeSlotStr} (${timeZone})\n- Duration: ${durationMinutes} Mins\n- Reference: #${refCode}\n- Video Link: ${videoUrl || 'Available on platform'}\n\nROADMAP:\n1. Slot Confirmed (Done)\n2. Technical & System Check\n3. Live Assessment\n4. Final Decision\n\nManage meeting: ${actionUrl}\n\nBest regards,\nThe HireConnect Team`
    : `Hi ${recipientName || 'there'},\n\nNew interview scheduled with candidate ${otherParticipantName} for ${roleName} at ${employerName}.\nDate: ${dateStr} at ${timeSlotStr} (${timeZone})\nVideo link: ${videoUrl}\nManage: ${actionUrl}\n\nBest regards,\nThe HireConnect Team`;

  return {
    subject: `Interview Confirmed: ${roundTitle} on ${dateStr}`,
    html: wrapTemplate({
      title,
      preheader,
      contentHtml,
      actionUrl: videoUrl || actionUrl,
      actionText: 'Join Video Interview Room'
    }),
    text
  };
}

// ============================================================================
// 6. INTERVIEW RESCHEDULED (To Candidate & Recruiter)
// ============================================================================
function interviewRescheduled({ recipientName, otherParticipantName, meetingTitle, newDateStr, newTimeSlotStr, timeZone, videoUrl, reason, actionUrl }) {
  const title = 'Interview Rescheduled';
  const preheader = `Your interview with ${otherParticipantName} has been moved to ${newDateStr}.`;
  const contentHtml = `
    <p>Hi ${escapeHtml(recipientName || 'there')},</p>
    <p>Please note that your interview <strong>${escapeHtml(meetingTitle)}</strong> with <strong>${escapeHtml(otherParticipantName)}</strong> has been rescheduled.</p>
    <div class="card">
      <div class="row"><span class="label">New Date</span><span class="value" style="color: #2563eb;">${escapeHtml(newDateStr)}</span></div>
      <div class="row"><span class="label">New Time</span><span class="value" style="color: #2563eb;">${escapeHtml(newTimeSlotStr)} (${escapeHtml(timeZone)})</span></div>
      ${reason ? `<div class="row"><span class="label">Reason</span><span class="value">${escapeHtml(reason)}</span></div>` : ''}
    </div>
    ${videoUrl ? `
      <p style="margin-top: 16px;">
        <strong>Video Room Link:</strong> <a href="${escapeHtml(videoUrl)}" target="_blank" style="color: #2563eb;">${escapeHtml(videoUrl)}</a>
      </p>
    ` : ''}
  `;
  const text = `Hi ${recipientName || 'there'},\n\nYour interview (${meetingTitle}) has been rescheduled to ${newDateStr} at ${newTimeSlotStr} (${timeZone}).\nReason: ${reason || 'Schedule update'}\n\nManage meeting: ${actionUrl}\n\nBest regards,\nThe HireConnect Team`;
  return {
    subject: `Interview Rescheduled: ${meetingTitle} on ${newDateStr}`,
    html: wrapTemplate({ title, preheader, contentHtml, actionUrl, actionText: 'View Updated Meeting' }),
    text
  };
}

// ============================================================================
// 7. INTERVIEW CANCELLED (To Candidate & Recruiter)
// ============================================================================
function interviewCancelled({ recipientName, otherParticipantName, meetingTitle, dateStr, timeSlotStr, reason, actionUrl }) {
  const title = 'Interview Cancelled';
  const preheader = `The interview scheduled for ${dateStr} has been cancelled.`;
  const contentHtml = `
    <p>Hi ${escapeHtml(recipientName || 'there')},</p>
    <p>Your interview <strong>${escapeHtml(meetingTitle)}</strong> with <strong>${escapeHtml(otherParticipantName)}</strong> previously scheduled for <strong>${escapeHtml(dateStr)} at ${escapeHtml(timeSlotStr)}</strong> has been cancelled.</p>
    ${reason ? `
      <div class="card">
        <div class="row"><span class="label">Cancellation Reason</span><span class="value">${escapeHtml(reason)}</span></div>
      </div>
    ` : ''}
    <p>If you need to reschedule or select a new time slot, please visit the HireConnect scheduler.</p>
  `;
  const text = `Hi ${recipientName || 'there'},\n\nYour interview with ${otherParticipantName} on ${dateStr} at ${timeSlotStr} has been cancelled.\nReason: ${reason || 'N/A'}\n\nVisit platform: ${actionUrl}\n\nBest regards,\nThe HireConnect Team`;
  return {
    subject: `Interview Cancelled: ${meetingTitle} on ${dateStr}`,
    html: wrapTemplate({ title, preheader, contentHtml, actionUrl, actionText: 'Book New Meeting' }),
    text
  };
}

// ============================================================================
// 8. INTERVIEW REMINDER (To Candidate & Recruiter)
// ============================================================================
function interviewReminder({ recipientName, otherParticipantName, meetingTitle, dateStr, timeSlotStr, timeZone, videoUrl, intervalText, actionUrl }) {
  const title = `Reminder: Interview Starting ${intervalText || 'Soon'}`;
  const preheader = `Your interview with ${otherParticipantName} is coming up in ${intervalText}.`;
  const contentHtml = `
    <p>Hi ${escapeHtml(recipientName || 'there')},</p>
    <p>This is a quick reminder that your upcoming interview with <strong>${escapeHtml(otherParticipantName)}</strong> starts in <strong>${escapeHtml(intervalText)}</strong>.</p>
    <div class="card">
      <div class="row"><span class="label">Interview</span><span class="value">${escapeHtml(meetingTitle)}</span></div>
      <div class="row"><span class="label">Participant</span><span class="value">${escapeHtml(otherParticipantName)}</span></div>
      <div class="row"><span class="label">Date &amp; Time</span><span class="value">${escapeHtml(dateStr)} &middot; ${escapeHtml(timeSlotStr)} (${escapeHtml(timeZone)})</span></div>
    </div>
    ${videoUrl ? `
      <p style="margin-top: 16px;">
        <strong>Video Room Link:</strong> <a href="${escapeHtml(videoUrl)}" target="_blank" style="color: #2563eb;">${escapeHtml(videoUrl)}</a>
      </p>
    ` : ''}
  `;
  const text = `Hi ${recipientName || 'there'},\n\nReminder: Your interview with ${otherParticipantName} (${meetingTitle}) starts in ${intervalText}.\nDate: ${dateStr} at ${timeSlotStr} (${timeZone})\nVideo link: ${videoUrl || 'Provided on platform'}\n\nManage meeting: ${actionUrl}\n\nBest regards,\nThe HireConnect Team`;
  return {
    subject: `Interview Reminder: ${meetingTitle} in ${intervalText}`,
    html: wrapTemplate({ title, preheader, contentHtml, actionUrl, actionText: 'Join Meeting' }),
    text
  };
}

// ============================================================================
// 9. COMPANY VERIFICATION RESULT (To Company Owner)
// ============================================================================
function companyVerificationResult({ ownerName, companyName, status, reviewNotes, actionUrl }) {
  const isApproved = status === 'verified';
  const title = isApproved ? 'Company Verification Approved' : 'Company Verification Update';
  const preheader = `Your company verification for ${companyName} has been ${status}.`;
  const contentHtml = `
    <p>Hi ${escapeHtml(ownerName || 'there')},</p>
    <p>The administrative team has completed the review of your corporate verification request for <strong>${escapeHtml(companyName)}</strong>.</p>
    <div class="card">
      <div class="row"><span class="label">Company</span><span class="value">${escapeHtml(companyName)}</span></div>
      <div class="row"><span class="label">Status</span><span class="value" style="color: ${isApproved ? '#16a34a' : '#ea580c'};">${escapeHtml(status.toUpperCase())}</span></div>
      ${reviewNotes ? `<div class="row"><span class="label">Notes</span><span class="value">${escapeHtml(reviewNotes)}</span></div>` : ''}
    </div>
    ${isApproved
      ? '<p>Your company profile now features the verified badge, enabling you to publish jobs directly to the talent marketplace.</p>'
      : '<p>Please review the feedback and update your corporate documents to resubmit for verification.</p>'
    }
  `;
  const text = `Hi ${ownerName || 'there'},\n\nYour company verification request for ${companyName} has been: ${status}.\nNotes: ${reviewNotes || 'N/A'}\n\nView company profile: ${actionUrl}\n\nBest regards,\nThe HireConnect Team`;
  return {
    subject: `Company Verification: ${companyName} (${status.toUpperCase()})`,
    html: wrapTemplate({ title, preheader, contentHtml, actionUrl, actionText: 'View Company Dashboard' }),
    text
  };
}

// ============================================================================
// 10. ACCOUNT STATUS CHANGED (To User)
// ============================================================================
function accountStatusChanged({ userName, status, reason, actionUrl }) {
  const isSuspended = status === 'suspended';
  const title = isSuspended ? 'Account Notice: Account Suspended' : 'Account Re-Activated';
  const preheader = `Your HireConnect account status is now ${status}.`;
  const contentHtml = `
    <p>Hi ${escapeHtml(userName || 'there')},</p>
    <p>This is an administrative notification regarding your HireConnect account status.</p>
    <div class="card">
      <div class="row"><span class="label">Status</span><span class="value" style="color: ${isSuspended ? '#dc2626' : '#16a34a'};">${escapeHtml(status.toUpperCase())}</span></div>
      ${reason ? `<div class="row"><span class="label">Reason</span><span class="value">${escapeHtml(reason)}</span></div>` : ''}
    </div>
    ${isSuspended
      ? '<p>If you believe this was done in error or would like to appeal, please contact support@hireconnect.io.</p>'
      : '<p>You may now sign in and resume full access to the HireConnect platform.</p>'
    }
  `;
  const text = `Hi ${userName || 'there'},\n\nYour account status is now: ${status}.\nReason: ${reason || 'N/A'}\n\nSupport: ${actionUrl}\n\nBest regards,\nThe HireConnect Team`;
  return {
    subject: `HireConnect Account Status: ${status.toUpperCase()}`,
    html: wrapTemplate({ title, preheader, contentHtml, actionUrl, actionText: isSuspended ? 'Contact Support' : 'Sign In' }),
    text
  };
}

// ============================================================================
// 11. JOB MODERATED (To Recruiter)
// ============================================================================
function jobModerated({ recruiterName, jobTitle, action, reason, actionUrl }) {
  const isRemoved = action === 'remove';
  const title = isRemoved ? 'Job Opening Removed from Listings' : 'Job Opening Restored';
  const preheader = `Administrative notice regarding your job opening: ${jobTitle}.`;
  const contentHtml = `
    <p>Hi ${escapeHtml(recruiterName || 'there')},</p>
    <p>An administrative moderation action was applied to your job listing <strong>${escapeHtml(jobTitle)}</strong>.</p>
    <div class="card">
      <div class="row"><span class="label">Job Title</span><span class="value">${escapeHtml(jobTitle)}</span></div>
      <div class="row"><span class="label">Action</span><span class="value" style="color: ${isRemoved ? '#dc2626' : '#16a34a'};">${escapeHtml(isRemoved ? 'REMOVED FROM PUBLIC LISTINGS' : 'RESTORED')}</span></div>
      ${reason ? `<div class="row"><span class="label">Moderation Note</span><span class="value">${escapeHtml(reason)}</span></div>` : ''}
    </div>
    <p>Existing submitted applications and interview records remain intact in your hiring pipeline.</p>
  `;
  const text = `Hi ${recruiterName || 'there'},\n\nAction: ${isRemoved ? 'REMOVED' : 'RESTORED'} for job: ${jobTitle}.\nNote: ${reason || 'N/A'}\n\nView details: ${actionUrl}\n\nBest regards,\nThe HireConnect Team`;
  return {
    subject: `Job Moderation: ${jobTitle} (${isRemoved ? 'Removed' : 'Restored'})`,
    html: wrapTemplate({ title, preheader, contentHtml, actionUrl, actionText: 'View Job Details' }),
    text
  };
}

// ============================================================================
// 12. PASSWORD RESET INSTRUCTIONS
// ============================================================================
function passwordReset({ recipientName, resetUrl, expiresInMinutes = 60 }) {
  const title = 'Reset Your HireConnect Password';
  const preheader = 'Instructions to reset your HireConnect account password.';
  const contentHtml = `
    <p>Hi ${escapeHtml(recipientName || 'there')},</p>
    <p>We received a request to reset your password for your HireConnect account. Click the button below to choose a new password:</p>
    <div class="card">
      <div class="row"><span class="label">Security Notice</span><span class="value">Link valid for ${expiresInMinutes} minutes</span></div>
    </div>
    <p style="font-size: 13px; color: #64748b;">If you did not request this password reset, you can safely ignore this email. Your account remains completely secure.</p>
  `;
  const text = `Hi ${recipientName || 'there'},\n\nWe received a request to reset your HireConnect account password.\n\nPlease visit the following link to reset your password:\n${resetUrl}\n\nThis link expires in ${expiresInMinutes} minutes. If you did not request this, please ignore this email.\n\nBest regards,\nThe HireConnect Team`;
  return {
    subject: 'Reset Your HireConnect Password',
    html: wrapTemplate({ title, preheader, contentHtml, actionUrl: resetUrl, actionText: 'Reset Password' }),
    text
  };
}

// ============================================================================
// 13. WELCOME TO HIRECONNECT (To Candidate / Recruiter)
// ============================================================================
function welcome({ recipientName, role = 'candidate', actionUrl }) {
  const isRecruiter = role === 'recruiter';
  const title = isRecruiter ? 'Welcome to HireConnect for Recruiters' : 'Welcome to HireConnect';
  const preheader = isRecruiter
    ? 'Start discovering top engineering talent and scaling your team.'
    : 'Your gateway to top tech careers, direct applications, and live interviews.';

  const contentHtml = isRecruiter
    ? `
    <p>Hi <strong>${escapeHtml(recipientName || 'there')}</strong>,</p>
    <p>Welcome to <strong>HireConnect</strong>! We are thrilled to partner with you and your hiring team.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 24px 0;">
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin-bottom: 12px;">
        🚀 Getting Started as a Recruiter
      </div>
      <div class="row"><span class="label">1. Post Open Roles</span><span class="value">Publish job openings with custom screening</span></div>
      <div class="row"><span class="label">2. Candidate Matching</span><span class="value">AI-driven talent discovery &amp; scoring</span></div>
      <div class="row"><span class="label">3. Easy Scheduling</span><span class="value">Integrated calendar &amp; video interviews</span></div>
    </div>

    <p style="font-size: 14px; color: #475569;">
      Head over to your recruiter dashboard to publish your first opening and manage candidate applications seamlessly.
    </p>
  `
    : `
    <p>Hi <strong>${escapeHtml(recipientName || 'there')}</strong>,</p>
    <p>Welcome to <strong>HireConnect</strong>! We are excited to support your career journey.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 24px 0;">
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin-bottom: 12px;">
        ✨ What You Can Do on HireConnect
      </div>
      <div class="row"><span class="label">1. Complete Profile</span><span class="value">Upload resume &amp; highlight skills</span></div>
      <div class="row"><span class="label">2. Explore Jobs</span><span class="value">Direct application to verified tech employers</span></div>
      <div class="row"><span class="label">3. Book Interviews</span><span class="value">Instant self-scheduling &amp; meeting links</span></div>
    </div>

    <p style="font-size: 14px; color: #475569;">
      Your profile is now live! Explore open positions, apply directly, and track your application status in real-time.
    </p>
  `;

  const text = isRecruiter
    ? `Hi ${recipientName || 'there'},\n\nWelcome to HireConnect for Recruiters!\n\nGetting Started:\n1. Post Open Roles\n2. AI Candidate Matching\n3. Integrated Scheduling & Video Rooms\n\nAccess your dashboard: ${actionUrl}\n\nBest regards,\nThe HireConnect Team`
    : `Hi ${recipientName || 'there'},\n\nWelcome to HireConnect!\n\nExplore thousands of top tech opportunities, apply with one click, and schedule interviews directly.\n\nGet started: ${actionUrl}\n\nBest regards,\nThe HireConnect Team`;

  return {
    subject: isRecruiter ? 'Welcome to HireConnect - Start Hiring Top Talent' : 'Welcome to HireConnect - Your Career Journey Begins',
    html: wrapTemplate({
      title,
      preheader,
      contentHtml,
      actionUrl,
      actionText: isRecruiter ? 'Go to Recruiter Dashboard' : 'Explore Open Positions'
    }),
    text
  };
}

// ============================================================================
// 14. INTERVIEW INVITATION (To Candidate)
// ============================================================================
function interviewInvitation({
  recipientName,
  recruiterName,
  jobTitle,
  companyName,
  schedulingUrl,
  customNote
}) {
  const roleName = jobTitle || 'Position';
  const employerName = companyName || 'HireConnect Partner';
  const title = `Interview Invitation: ${roleName}`;
  const preheader = `You've been invited to interview for ${roleName} at ${employerName}. Select your preferred time slot.`;

  const contentHtml = `
    <p>Hi <strong>${escapeHtml(recipientName || 'there')}</strong>,</p>
    <p>Great news! <strong>${escapeHtml(recruiterName || 'The hiring team')}</strong> from <strong>${escapeHtml(employerName)}</strong> was impressed with your application for <strong>${escapeHtml(roleName)}</strong> and would like to invite you for an interview.</p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 24px 0;">
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin-bottom: 12px;">
        🗓️ Interview Invitation Details
      </div>
      <div class="row"><span class="label">Position</span><span class="value" style="font-weight: 600;">${escapeHtml(roleName)}</span></div>
      <div class="row"><span class="label">Company</span><span class="value">${escapeHtml(employerName)}</span></div>
      <div class="row"><span class="label">Invited By</span><span class="value">${escapeHtml(recruiterName || 'Hiring Team')}</span></div>
      <div class="row"><span class="label">Format</span><span class="value">Video Conference (Google Meet / WebRTC)</span></div>
      ${customNote ? `<div class="row"><span class="label">Note</span><span class="value">${escapeHtml(customNote)}</span></div>` : ''}
    </div>

    <p style="font-size: 14px; color: #475569;">
      Please select a convenient date and time slot from the recruiter's live calendar using the link below:
    </p>
  `;

  const text = `Hi ${recipientName || 'there'},\n\nYou're invited to interview for ${roleName} at ${employerName}!\n\nInvited By: ${recruiterName || 'Hiring Team'}\n${customNote ? `Note: ${customNote}\n` : ''}\nPlease select a time slot that works for you:\n${schedulingUrl}\n\nBest regards,\nThe HireConnect Team`;

  return {
    subject: `Interview Invitation: ${roleName} at ${employerName}`,
    html: wrapTemplate({
      title,
      preheader,
      contentHtml,
      actionUrl: schedulingUrl,
      actionText: 'Select Interview Time Slot'
    }),
    text
  };
}

// ============================================================================
// 15. ADMIN ALERTS & AUDIT NOTIFICATIONS (To Platform Administrator)
// ============================================================================
function adminNewUserRegistered({ userName, userEmail, role = 'candidate', actionUrl }) {
  const isRecruiter = role === 'recruiter';
  const title = `[Admin Alert] New ${isRecruiter ? 'Recruiter' : 'Candidate'} Registered`;
  const preheader = `${userName} (${userEmail}) just registered as a ${role}.`;

  const contentHtml = `
    <p>Hi <strong>Administrator</strong>,</p>
    <p>A new user has registered on the <strong>HireConnect</strong> platform:</p>
    <div class="card">
      <div class="row"><span class="label">User Name</span><span class="value">${escapeHtml(userName)}</span></div>
      <div class="row"><span class="label">Email Address</span><span class="value">${escapeHtml(userEmail)}</span></div>
      <div class="row"><span class="label">Platform Role</span><span class="value" style="text-transform: capitalize; color: #2563eb;">${escapeHtml(role)}</span></div>
      <div class="row"><span class="label">Registered At</span><span class="value">${new Date().toUTCString()}</span></div>
    </div>
    <p style="font-size: 13px; color: #64748b;">You can review user privileges and activity from the central administration portal.</p>
  `;

  const text = `[ADMIN ALERT] New ${role} registered:\nName: ${userName}\nEmail: ${userEmail}\nRole: ${role}\nTime: ${new Date().toISOString()}\n\nAdmin Portal: ${actionUrl}`;

  return {
    subject: `[Admin Alert] New ${isRecruiter ? 'Recruiter' : 'Candidate'} Registered: ${userName}`,
    html: wrapTemplate({ title, preheader, contentHtml, actionUrl, actionText: 'View Admin Dashboard' }),
    text
  };
}

function adminApplicationSubmitted({ candidateName, candidateEmail, jobTitle, companyName, applicationId, actionUrl }) {
  const title = '[Admin Alert] New Job Application Submitted';
  const preheader = `${candidateName} applied for ${jobTitle} at ${companyName}.`;

  const contentHtml = `
    <p>Hi <strong>Administrator</strong>,</p>
    <p>A new job application was submitted on <strong>HireConnect</strong>:</p>
    <div class="card">
      <div class="row"><span class="label">Candidate</span><span class="value">${escapeHtml(candidateName)} (${escapeHtml(candidateEmail)})</span></div>
      <div class="row"><span class="label">Job Position</span><span class="value">${escapeHtml(jobTitle)}</span></div>
      <div class="row"><span class="label">Company</span><span class="value">${escapeHtml(companyName)}</span></div>
      <div class="row"><span class="label">Application Ref</span><span class="value" style="font-family: monospace;">#${escapeHtml(String(applicationId).slice(-8).toUpperCase())}</span></div>
    </div>
  `;

  const text = `[ADMIN ALERT] New application submitted:\nCandidate: ${candidateName} (${candidateEmail})\nJob: ${jobTitle} at ${companyName}\nApplication ID: ${applicationId}\n\nView: ${actionUrl}`;

  return {
    subject: `[Admin Alert] Application Submitted: ${candidateName} for ${jobTitle}`,
    html: wrapTemplate({ title, preheader, contentHtml, actionUrl, actionText: 'Review Application' }),
    text
  };
}

function adminInterviewBooked({ candidateName, candidateEmail, recruiterName, jobTitle, companyName, dateStr, timeSlotStr, videoUrl, actionUrl }) {
  const title = '[Admin Alert] New Interview Scheduled';
  const preheader = `${candidateName} booked an interview with ${recruiterName} for ${jobTitle}.`;

  const contentHtml = `
    <p>Hi <strong>Administrator</strong>,</p>
    <p>An interview round has been booked on <strong>HireConnect</strong>:</p>
    <div class="card">
      <div class="row"><span class="label">Candidate</span><span class="value">${escapeHtml(candidateName)} (${escapeHtml(candidateEmail)})</span></div>
      <div class="row"><span class="label">Interviewer / Recruiter</span><span class="value">${escapeHtml(recruiterName)}</span></div>
      <div class="row"><span class="label">Position &amp; Company</span><span class="value">${escapeHtml(jobTitle)} &middot; ${escapeHtml(companyName)}</span></div>
      <div class="row"><span class="label">Scheduled Time</span><span class="value" style="color: #2563eb; font-weight: 600;">${escapeHtml(dateStr)} at ${escapeHtml(timeSlotStr)}</span></div>
      ${videoUrl ? `<div class="row"><span class="label">Meeting Room</span><span class="value">${escapeHtml(videoUrl)}</span></div>` : ''}
    </div>
  `;

  const text = `[ADMIN ALERT] Interview Scheduled:\nCandidate: ${candidateName} (${candidateEmail})\nRecruiter: ${recruiterName}\nJob: ${jobTitle} (${companyName})\nDate/Time: ${dateStr} at ${timeSlotStr}\nRoom: ${videoUrl || 'N/A'}`;

  return {
    subject: `[Admin Alert] Interview Scheduled: ${candidateName} with ${recruiterName}`,
    html: wrapTemplate({ title, preheader, contentHtml, actionUrl, actionText: 'View Meeting Details' }),
    text
  };
}

function adminInterviewInvited({ candidateName, candidateEmail, recruiterName, jobTitle, companyName, actionUrl }) {
  const title = '[Admin Alert] Candidate Invited to Interview';
  const preheader = `${recruiterName} invited ${candidateName} to self-schedule an interview for ${jobTitle}.`;

  const contentHtml = `
    <p>Hi <strong>Administrator</strong>,</p>
    <p>A candidate was invited to self-schedule an interview slot:</p>
    <div class="card">
      <div class="row"><span class="label">Candidate</span><span class="value">${escapeHtml(candidateName)} (${escapeHtml(candidateEmail)})</span></div>
      <div class="row"><span class="label">Inviting Recruiter</span><span class="value">${escapeHtml(recruiterName)}</span></div>
      <div class="row"><span class="label">Job Position</span><span class="value">${escapeHtml(jobTitle)} (${escapeHtml(companyName)})</span></div>
    </div>
  `;

  const text = `[ADMIN ALERT] Interview Invitation sent:\nCandidate: ${candidateName} (${candidateEmail})\nRecruiter: ${recruiterName}\nJob: ${jobTitle} (${companyName})\n\nView: ${actionUrl}`;

  return {
    subject: `[Admin Alert] Interview Invitation: ${candidateName} by ${recruiterName}`,
    html: wrapTemplate({ title, preheader, contentHtml, actionUrl, actionText: 'View Recruitment Pipeline' }),
    text
  };
}

function adminApplicationStatusChanged({ candidateName, candidateEmail, recruiterName, jobTitle, companyName, previousStatus, newStatus, actionUrl }) {
  const title = '[Admin Alert] Application Status Updated';
  const preheader = `${candidateName}'s application for ${jobTitle} moved from ${previousStatus} to ${newStatus}.`;

  const contentHtml = `
    <p>Hi <strong>Administrator</strong>,</p>
    <p>An application lifecycle transition occurred on <strong>HireConnect</strong>:</p>
    <div class="card">
      <div class="row"><span class="label">Candidate</span><span class="value">${escapeHtml(candidateName)} (${escapeHtml(candidateEmail)})</span></div>
      <div class="row"><span class="label">Job</span><span class="value">${escapeHtml(jobTitle)} at ${escapeHtml(companyName)}</span></div>
      <div class="row"><span class="label">Previous Status</span><span class="value">${escapeHtml(previousStatus || 'N/A')}</span></div>
      <div class="row"><span class="label">Updated Status</span><span class="value" style="color: #2563eb; font-weight: bold;">${escapeHtml(newStatus)}</span></div>
    </div>
  `;

  const text = `[ADMIN ALERT] Application Status Update:\nCandidate: ${candidateName} (${candidateEmail})\nJob: ${jobTitle} (${companyName})\nTransition: ${previousStatus} -> ${newStatus}\n\nView: ${actionUrl}`;

  return {
    subject: `[Admin Alert] Status Changed: ${candidateName} (${jobTitle} -> ${newStatus})`,
    html: wrapTemplate({ title, preheader, contentHtml, actionUrl, actionText: 'View Application' }),
    text
  };
}

function jobPublished({
  recruiterName,
  jobTitle,
  companyName,
  department,
  workMode,
  location,
  actionUrl
}) {
  const title = `Job Published: ${jobTitle}`;
  const preheader = `Your job opening for ${jobTitle} at ${companyName} is now live on HireConnect.`;

  const contentHtml = `
    <p>Hello ${escapeHtml(recruiterName || 'there')},</p>
    <p>Your job opening has been published successfully and is now active and discoverable on HireConnect.</p>
    <div class="card">
      <div class="row">
        <span class="label">Position</span>
        <span class="value">${escapeHtml(jobTitle)}</span>
      </div>
      <div class="row">
        <span class="label">Company</span>
        <span class="value">${escapeHtml(companyName)}</span>
      </div>
      ${department ? `
      <div class="row">
        <span class="label">Department</span>
        <span class="value">${escapeHtml(department)}</span>
      </div>` : ''}
      <div class="row">
        <span class="label">Work Mode</span>
        <span class="value">${escapeHtml(workMode || 'Remote')}</span>
      </div>
      ${location ? `
      <div class="row">
        <span class="label">Location</span>
        <span class="value">${escapeHtml(location)}</span>
      </div>` : ''}
      <div class="row">
        <span class="label">Status</span>
        <span class="value" style="color: #10b981; font-weight: bold;">Published &amp; Active</span>
      </div>
    </div>
    <p>Candidates can now search, view requirements, and submit verified applications for this role.</p>
  `;

  return {
    subject: `Job Opening Published: ${jobTitle} at ${companyName}`,
    html: wrapTemplate({
      title,
      preheader,
      contentHtml,
      actionUrl,
      actionText: 'View Live Job Opening'
    }),
    text: `Hello ${recruiterName},\n\nYour job opening "${jobTitle}" at ${companyName} is now live and published on HireConnect.\n\nWork Mode: ${workMode || 'Remote'}\nLocation: ${location || 'Remote'}\n\nView listing: ${actionUrl}`
  };
}

function adminJobPublished({
  recruiterName,
  recruiterEmail,
  jobTitle,
  companyName,
  department,
  workMode,
  location,
  jobId,
  actionUrl
}) {
  const title = `[Admin Alert] New Job Published`;
  const preheader = `${companyName} published "${jobTitle}" on HireConnect.`;

  const contentHtml = `
    <p>Hi <strong>Administrator</strong>,</p>
    <p>A new job opening has been published and is currently active on <strong>HireConnect</strong>:</p>
    <div class="card">
      <div class="row">
        <span class="label">Job Title</span>
        <span class="value">${escapeHtml(jobTitle)}</span>
      </div>
      <div class="row">
        <span class="label">Company</span>
        <span class="value">${escapeHtml(companyName)}</span>
      </div>
      <div class="row">
        <span class="label">Recruiter</span>
        <span class="value">${escapeHtml(recruiterName)} (${escapeHtml(recruiterEmail || 'N/A')})</span>
      </div>
      ${department ? `
      <div class="row">
        <span class="label">Department</span>
        <span class="value">${escapeHtml(department)}</span>
      </div>` : ''}
      <div class="row">
        <span class="label">Work Mode</span>
        <span class="value">${escapeHtml(workMode || 'Remote')}</span>
      </div>
      ${location ? `
      <div class="row">
        <span class="label">Location</span>
        <span class="value">${escapeHtml(location)}</span>
      </div>` : ''}
      <div class="row">
        <span class="label">Job ID</span>
        <span class="value">${escapeHtml(jobId || 'N/A')}</span>
      </div>
    </div>
  `;

  return {
    subject: `[Admin Alert] New Job Published: ${jobTitle} at ${companyName}`,
    html: wrapTemplate({
      title,
      preheader,
      contentHtml,
      actionUrl,
      actionText: 'Review Job Listing'
    }),
    text: `[Admin Alert] New Job Published\n\nJob Title: ${jobTitle}\nCompany: ${companyName}\nRecruiter: ${recruiterName} (${recruiterEmail})\nLocation: ${location || 'Remote'}\n\nListing URL: ${actionUrl}`
  };
}

module.exports = {
  applicationSubmitted,
  newApplicant,
  applicationStatusChanged,
  applicationWithdrawn,
  interviewBooked,
  interviewRescheduled,
  interviewCancelled,
  interviewReminder,
  companyVerificationResult,
  accountStatusChanged,
  jobModerated,
  passwordReset,
  welcome,
  interviewInvitation,
  adminNewUserRegistered,
  adminApplicationSubmitted,
  adminInterviewBooked,
  adminInterviewInvited,
  adminApplicationStatusChanged,
  jobPublished,
  adminJobPublished
};
