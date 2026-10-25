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
function applicationSubmitted({ candidateName, jobTitle, companyName, actionUrl }) {
  const title = 'Application Submitted Successfully';
  const preheader = `Your application for ${jobTitle} at ${companyName} has been received.`;
  const contentHtml = `
    <p>Hi ${escapeHtml(candidateName || 'there')},</p>
    <p>Great news! Your application for <strong>${escapeHtml(jobTitle)}</strong> at <strong>${escapeHtml(companyName)}</strong> has been successfully submitted to the hiring team.</p>
    <div class="card">
      <div class="row"><span class="label">Position</span><span class="value">${escapeHtml(jobTitle)}</span></div>
      <div class="row"><span class="label">Company</span><span class="value">${escapeHtml(companyName)}</span></div>
      <div class="row"><span class="label">Status</span><span class="value">Submitted</span></div>
    </div>
    <p>You can track the progress of your application and view updates directly from your HireConnect application history.</p>
  `;
  const text = `Hi ${candidateName || 'there'},\n\nYour application for ${jobTitle} at ${companyName} has been submitted successfully.\n\nView your application here: ${actionUrl}\n\nBest regards,\nThe HireConnect Team`;
  return {
    subject: `Application Submitted: ${jobTitle} at ${companyName}`,
    html: wrapTemplate({ title, preheader, contentHtml, actionUrl, actionText: 'View My Application' }),
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
function interviewBooked({ recipientName, otherParticipantName, role, meetingTitle, dateStr, timeSlotStr, timeZone, videoUrl, actionUrl }) {
  const title = 'Interview Confirmed';
  const preheader = `Your interview with ${otherParticipantName} is scheduled for ${dateStr}.`;
  const contentHtml = `
    <p>Hi ${escapeHtml(recipientName || 'there')},</p>
    <p>Your interview has been successfully scheduled on HireConnect with <strong>${escapeHtml(otherParticipantName)}</strong>.</p>
    <div class="card">
      <div class="row"><span class="label">Interview</span><span class="value">${escapeHtml(meetingTitle)}</span></div>
      <div class="row"><span class="label">Participant</span><span class="value">${escapeHtml(otherParticipantName)}</span></div>
      <div class="row"><span class="label">Date</span><span class="value">${escapeHtml(dateStr)}</span></div>
      <div class="row"><span class="label">Time</span><span class="value">${escapeHtml(timeSlotStr)} (${escapeHtml(timeZone)})</span></div>
      <div class="row"><span class="label">Format</span><span class="value">Web Conference (HD Google Meet)</span></div>
    </div>
    ${videoUrl ? `
      <p style="margin-top: 16px;">
        <strong>Video Room Link:</strong> <a href="${escapeHtml(videoUrl)}" target="_blank" style="color: #2563eb;">${escapeHtml(videoUrl)}</a>
      </p>
    ` : ''}
  `;
  const text = `Hi ${recipientName || 'there'},\n\nYour interview with ${otherParticipantName} (${meetingTitle}) is confirmed for ${dateStr} at ${timeSlotStr} (${timeZone}).\n\nVideo link: ${videoUrl || 'Provided on platform'}\nManage meeting: ${actionUrl}\n\nBest regards,\nThe HireConnect Team`;
  return {
    subject: `Interview Confirmed: ${meetingTitle} on ${dateStr}`,
    html: wrapTemplate({ title, preheader, contentHtml, actionUrl, actionText: 'View Meeting Details' }),
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
  passwordReset
};
