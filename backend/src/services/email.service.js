const nodemailer = require('nodemailer');

// Initialize transporter
const createTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Send branded HTML OTP email
 * @param {string} toEmail - Recipient email
 * @param {string} otpCode - 6-digit numeric code
 * @param {string} type - 'EMAIL_VERIFICATION' | 'PASSWORD_RESET'
 */
const sendOtpEmail = async (toEmail, otpCode, type = 'EMAIL_VERIFICATION') => {
  const isReset = type === 'PASSWORD_RESET';
  const subject = isReset
    ? 'Reset Your Password - Real Estate'
    : 'Verify Your Account - Real Estate';

  const heading = isReset ? 'Password Reset Request' : 'Verify Your Email Address';
  const subtext = isReset
    ? 'We received a request to reset your Real Estate account password. Enter the 6-digit code below to set a new password:'
    : 'Welcome to Real Estate! Please enter the 6-digit verification code below to activate your account and start exploring properties:';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; margin: 0; padding: 40px 15px; }
        .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); padding: 35px 20px; text-align: center; }
        .logo { color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; margin: 0; }
        .content { padding: 40px 30px; text-align: center; color: #334155; }
        h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; }
        p { font-size: 15px; line-height: 24px; color: #475569; margin: 0 0 24px 0; }
        .otp-box { display: inline-block; background: #f8fafc; border: 2px dashed #6366f1; border-radius: 12px; padding: 16px 36px; margin: 10px 0 28px 0; }
        .otp-code { font-size: 34px; font-weight: 800; letter-spacing: 10px; color: #4f46e5; font-family: monospace; }
        .expiry-note { font-size: 13px; color: #64748b; margin-top: 15px; }
        .footer { background: #f8fafc; border-top: 1px solid #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Real Estate Platform</div>
        </div>
        <div class="content">
          <h1>${heading}</h1>
          <p>${subtext}</p>
          <div class="otp-box">
            <span class="otp-code">${otpCode}</span>
          </div>
          <p class="expiry-note">
            ⏱ This code will expire in <strong>10 minutes</strong>.<br>
            If you did not request this, you can safely ignore this email.
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Real Estate Inc. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  const transporter = createTransporter();

  // If SMTP is configured, send the real email
  if (transporter) {
    try {
      const from = process.env.EMAIL_FROM || `"Real Estate Platform" <${process.env.SMTP_USER}>`;
      const info = await transporter.sendMail({
        from,
        to: toEmail,
        subject,
        html
      });
      console.log(`[Email Service] Live email sent to ${toEmail}. Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`[Email Service Error] Failed to send email to ${toEmail}:`, error.message);
      // Don't throw fatal error in development so auth flow continues
      return { success: false, error: error.message };
    }
  } else {
    // If SMTP is not yet configured, log notification
    console.log(`[Email Service Notice] SMTP_USER is not configured in .env. Live email skipped.`);
    return { success: true, devMode: true };
  }
};

module.exports = {
  sendOtpEmail
};
