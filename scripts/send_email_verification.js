const path = require('path');
const dotenv = require('../backend/node_modules/dotenv');
dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

process.env.NODE_ENV = 'development';

const emailService = require('../backend/src/services/email.service');

async function sendCheckEmail() {
  console.log('--------------------------------------------------');
  console.log('Sending Live Verification Email via Resend SMTP...');
  console.log('--------------------------------------------------');

  emailService.initTransporter();

  console.log('[1/2] Verifying SMTP connection to Resend...');
  const connResult = await emailService.verifyConnection();
  console.log('SMTP Connection Status:', connResult);

  if (!connResult.success) {
    console.error('Failed to establish SMTP connection:', connResult.message);
    process.exit(1);
  }

  const recipient = 'sabari1082005@gmail.com';
  const sentTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>HireConnect — Email Verification</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
    .wrapper { width: 100%; background-color: #0b0f19; padding: 32px 12px; }
    .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 1px solid #1e293b; }
    .header { background-color: #0f172a; padding: 24px 32px; border-bottom: 2px solid #2563eb; text-align: left; }
    .brand-logo { color: #ffffff; font-size: 20px; font-weight: 700; text-decoration: none; }
    .brand-badge { background-color: #2563eb; color: #ffffff; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 9999px; margin-left: 8px; text-transform: uppercase; }
    .content { padding: 32px; font-size: 15px; line-height: 1.6; color: #334155; }
    .h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; }
    .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px 20px; margin: 20px 0; }
    .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
    .row:last-child { margin-bottom: 0; }
    .label { color: #64748b; font-weight: 500; }
    .value { color: #0f172a; font-weight: 600; text-align: right; }
    .status-pill { background-color: #dcfce7; color: #15803d; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 6px; display: inline-block; }
    .footer { background-color: #f8fafc; padding: 20px 32px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <table class="wrapper" role="presentation" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td class="header">
              <span class="brand-logo">HireConnect<span class="brand-badge">Platform</span></span>
            </td>
          </tr>
          <tr>
            <td class="content">
              <h1 class="h1">Email Delivery Verification</h1>
              <p>Hi Sabari,</p>
              <p>This is a live test email confirming that <strong>Resend SMTP</strong> delivery is active, securely connected, and fully operational for the <strong>HireConnect</strong> backend.</p>
              
              <div class="card">
                <div class="row">
                  <span class="label">Delivery Status</span>
                  <span class="value"><span class="status-pill">&#10003; DELIVERED</span></span>
                </div>
                <div class="row">
                  <span class="label">SMTP Provider</span>
                  <span class="value">smtp.resend.com (Port 465 SSL)</span>
                </div>
                <div class="row">
                  <span class="label">Sender Identity</span>
                  <span class="value">HireConnect &lt;onboarding@resend.dev&gt;</span>
                </div>
                <div class="row">
                  <span class="label">Recipient</span>
                  <span class="value">${recipient}</span>
                </div>
                <div class="row">
                  <span class="label">Timestamp</span>
                  <span class="value">${sentTime} IST</span>
                </div>
              </div>

              <p>All HireConnect transactional notification workflows (password resets, application alerts, and interview reminders) can now reliably dispatch emails.</p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p style="margin: 0 0 6px 0;">HireConnect Recruitment Platform &middot; Automated System Verification</p>
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} HireConnect. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textContent = `HireConnect — Email Delivery Verification

Hi Sabari,

This is a live test email confirming that Resend SMTP delivery is active and operational for the HireConnect backend.

- Status: DELIVERED
- Provider: smtp.resend.com (Port 465 SSL)
- Sender: HireConnect <onboarding@resend.dev>
- Recipient: ${recipient}
- Timestamp: ${sentTime} IST

Best regards,
The HireConnect Platform Team`;

  console.log(`[2/2] Sending email to ${recipient}...`);
  const result = await emailService.sendEmail({
    to: recipient,
    subject: 'HireConnect — Live Email Delivery Test (Resend SMTP Verified)',
    html: htmlContent,
    text: textContent
  });

  console.log('\n==================================================');
  console.log('DELIVERY RESULT:');
  console.log('Success:', result.success);
  console.log('Message ID:', result.messageId);
  if (result.error) console.log('Error:', result.error);
  console.log('==================================================\n');

  if (result.success) {
    console.log(`✓ Email successfully accepted by Resend SMTP for delivery to ${recipient}.`);
  } else {
    console.log(`✗ Delivery failed: ${result.error}`);
  }
}

sendCheckEmail().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
