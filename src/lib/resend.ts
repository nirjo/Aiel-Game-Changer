import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

// ─────────────────────────────────────────────────────────────────────────────
// Shared email wrapper — keeps branding consistent across all transactional
// emails sent by the platform.
// ─────────────────────────────────────────────────────────────────────────────
function emailLayout(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Inter','Helvetica Neue',Arial,sans-serif;color:#333333;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background-color:#0A0A0A;padding:24px 32px;text-align:center;">
              <h1 style="margin:0;font-family:'Bebas Neue','Helvetica Neue',Arial,sans-serif;font-size:28px;letter-spacing:2px;color:#ffffff;">
                THE <span style="color:#C41E3A;">GAME CHANGER</span>
              </h1>
            </td>
          </tr>
          <!-- Red accent line -->
          <tr>
            <td style="background-color:#C41E3A;height:4px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background-color:#fafafa;border-top:1px solid #eee;text-align:center;">
              <p style="margin:0;font-size:12px;color:#999;">
                &copy; ${new Date().getFullYear()} The Game Changer &mdash; Vehicle-Based Advertising Platform
              </p>
              <p style="margin:4px 0 0;font-size:12px;color:#bbb;">
                You received this email because you interacted with our platform.
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

// ─────────────────────────────────────────────────────────────────────────────
// Welcome email — sent after a new driver completes registration.
// ─────────────────────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(email: string, fullName: string) {
  const body = `
    <h2 style="margin:0 0 16px;font-size:22px;color:#0A0A0A;">Welcome aboard, ${fullName}! 🎉</h2>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#333;">
      Thank you for joining <strong>The Game Changer</strong>. Your driver profile has been successfully created.
    </p>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#333;">
      You can now log in to your dashboard to view earning opportunities, track your progress, and manage your vehicle advertising campaigns.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background-color:#C41E3A;border-radius:4px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://thegamechanger.in'}/dashboard"
             style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">
            Go to Dashboard
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:13px;color:#999;">
      If you didn&rsquo;t create this account, you can safely ignore this email.
    </p>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Welcome to The Game Changer! 🚗',
    html: emailLayout('Welcome to The Game Changer', body),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Contact confirmation — auto-reply when someone submits the contact form.
// ─────────────────────────────────────────────────────────────────────────────
export async function sendContactConfirmation(
  email: string,
  name: string,
  message: string
) {
  const body = `
    <h2 style="margin:0 0 16px;font-size:22px;color:#0A0A0A;">We received your message, ${name} 👋</h2>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#333;">
      Thank you for reaching out to <strong>The Game Changer</strong>. Our team will review your message and get back to you shortly.
    </p>
    <div style="margin:20px 0;padding:16px 20px;background-color:#f9f9f9;border-left:4px solid #C41E3A;border-radius:2px;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#999;">Your Message</p>
      <p style="margin:0;font-size:14px;line-height:1.5;color:#555;">${message}</p>
    </div>
    <p style="margin:0;font-size:13px;color:#999;">
      You don&rsquo;t need to reply to this email. We&rsquo;ll be in touch!
    </p>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Thanks for contacting The Game Changer',
    html: emailLayout('Contact Confirmation', body),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Profile completion reminder — sent to Google OAuth users who haven't
// finished filling in their driver details.
// ─────────────────────────────────────────────────────────────────────────────
export async function sendProfileCompletionReminder(
  email: string,
  fullName: string
) {
  const body = `
    <h2 style="margin:0 0 16px;font-size:22px;color:#0A0A0A;">Almost there, ${fullName}! 🏁</h2>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#333;">
      You&rsquo;ve signed in to <strong>The Game Changer</strong>, but your driver profile is incomplete.
    </p>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#333;">
      Please take a moment to fill in your vehicle and contact details so you can start earning with vehicle-based advertising.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background-color:#C41E3A;border-radius:4px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://thegamechanger.in'}/complete-profile"
             style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">
            Complete My Profile
          </a>
        </td>
      </tr>
    </table>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Complete your Game Changer profile',
    html: emailLayout('Complete Your Profile', body),
  });
}
