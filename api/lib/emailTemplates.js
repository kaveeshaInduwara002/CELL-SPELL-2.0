// ============================================================
// api/lib/emailTemplates.js — HTML Email Templates
// ============================================================
// Beautiful, responsive HTML email templates for registration
// confirmation. Uses inline CSS for maximum email client
// compatibility (Gmail, Outlook, Apple Mail, Yahoo, etc.)
//
// CUSTOMIZE: Search for "CUSTOMIZE" comments to find all
// placeholders you need to update before going live.
// ============================================================

// -------------------------------------------------------
// No verified domain yet — using Resend's free test sender.
// This works immediately, no DNS setup needed.
// When you get a domain, verify it at https://resend.com/domains
// and update the address below.
// -------------------------------------------------------
export const EMAIL_FROM = 'Cell Spell 2.0 <onboarding@resend.dev>';

// -------------------------------------------------------
// Shared styles and components used by both templates
// -------------------------------------------------------
function getBaseStyles() {
  return `
    /* Reset */
    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }

    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      min-width: 100%;
      background-color: #0a0a1a;
      font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .email-wrapper {
      width: 100%;
      background-color: #0a0a1a;
      padding: 40px 0;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: linear-gradient(145deg, #12122a 0%, #0d0d20 100%);
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(139, 92, 246, 0.15);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.08);
    }

    @media only screen and (max-width: 640px) {
      .email-container { margin: 0 16px !important; border-radius: 16px !important; }
      .content-section { padding: 24px 20px !important; }
      .hero-title { font-size: 22px !important; }
      .hero-subtitle { font-size: 14px !important; }
      .detail-grid { display: block !important; }
      .detail-item { display: block !important; width: 100% !important; margin-bottom: 12px !important; }
    }
  `;
}

function getHeaderHtml(eventIcon, eventTitle, eventSubtitle) {
  return `
    <!-- Header with gradient -->
    <div style="
      background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 30%, #4c1d95 60%, #2e1065 100%);
      padding: 48px 40px 40px;
      text-align: center;
      position: relative;
      overflow: hidden;
    ">
      <!-- Decorative orbs -->
      <div style="
        position: absolute;
        top: -30px;
        right: -30px;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: rgba(167, 139, 250, 0.15);
        filter: blur(40px);
      "></div>
      <div style="
        position: absolute;
        bottom: -20px;
        left: -20px;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: rgba(139, 92, 246, 0.12);
        filter: blur(35px);
      "></div>

      <!-- Cell Spell Logo/Brand -->
      <div style="
        display: inline-block;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        padding: 14px 18px;
        margin-bottom: 24px;
      ">
        <span style="font-size: 28px; line-height: 1;">${eventIcon}</span>
      </div>

      <h1 class="hero-title" style="
        color: #ffffff;
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 8px;
        letter-spacing: -0.5px;
        line-height: 1.2;
      ">
        ${eventTitle}
      </h1>

      <p class="hero-subtitle" style="
        color: rgba(221, 214, 254, 0.85);
        font-size: 15px;
        font-weight: 400;
        margin: 0;
        line-height: 1.5;
      ">
        ${eventSubtitle}
      </p>

      <!-- Accent line -->
      <div style="
        width: 60px;
        height: 3px;
        background: linear-gradient(90deg, rgba(167, 139, 250, 0.6), rgba(139, 92, 246, 0.3));
        border-radius: 3px;
        margin: 24px auto 0;
      "></div>
    </div>
  `;
}

function getSuccessBadgeHtml(registrationId) {
  return `
    <!-- Success Badge -->
    <div style="
      text-align: center;
      padding: 32px 40px 0;
    ">
      <div style="
        display: inline-block;
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%);
        border: 1px solid rgba(34, 197, 94, 0.2);
        border-radius: 14px;
        padding: 20px 32px;
      ">
        <div style="
          font-size: 32px;
          margin-bottom: 8px;
        ">✅</div>
        <p style="
          color: #4ade80;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px;
          letter-spacing: 0.3px;
        ">Registration Confirmed!</p>
        <p style="
          color: rgba(167, 243, 208, 0.7);
          font-size: 13px;
          margin: 0;
        ">Your Registration ID</p>
        <p style="
          color: #a78bfa;
          font-size: 22px;
          font-weight: 700;
          margin: 8px 0 0;
          letter-spacing: 2px;
          font-family: 'Courier New', Courier, monospace;
        ">${registrationId}</p>
      </div>
    </div>
  `;
}

function getGreetingHtml(fullName) {
  return `
    <div class="content-section" style="padding: 32px 40px 0;">
      <p style="
        color: #e2e8f0;
        font-size: 16px;
        line-height: 1.6;
        margin: 0;
      ">
        Hi <strong style="color: #c4b5fd;">${fullName}</strong>,
      </p>
      <p style="
        color: rgba(203, 213, 225, 0.8);
        font-size: 15px;
        line-height: 1.7;
        margin: 12px 0 0;
      ">
        Thank you for registering! We're thrilled to have you. Here are your event details — please save this email for reference.
      </p>
    </div>
  `;
}

function getDetailItemHtml(icon, label, value) {
  return `
    <td class="detail-item" style="
      width: 50%;
      vertical-align: top;
      padding: 8px;
    ">
      <div style="
        background: rgba(139, 92, 246, 0.06);
        border: 1px solid rgba(139, 92, 246, 0.1);
        border-radius: 12px;
        padding: 16px;
      ">
        <div style="
          color: rgba(167, 139, 250, 0.6);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        ">${icon} ${label}</div>
        <div style="
          color: #e2e8f0;
          font-size: 15px;
          font-weight: 500;
          line-height: 1.4;
        ">${value}</div>
      </div>
    </td>
  `;
}

function getInstructionsHtml(items) {
  const listItems = items
    .map(
      (item) => `
      <tr>
        <td style="
          padding: 10px 0;
          vertical-align: top;
          width: 36px;
        ">
          <div style="
            width: 28px;
            height: 28px;
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1));
            border: 1px solid rgba(139, 92, 246, 0.2);
            border-radius: 8px;
            text-align: center;
            line-height: 28px;
            color: #a78bfa;
            font-size: 14px;
            font-weight: 600;
          ">${item.icon}</div>
        </td>
        <td style="
          padding: 10px 0 10px 12px;
          color: rgba(203, 213, 225, 0.85);
          font-size: 14px;
          line-height: 1.6;
          vertical-align: top;
        ">${item.text}</td>
      </tr>`
    )
    .join('');

  return `
    <div class="content-section" style="padding: 24px 40px;">
      <h3 style="
        color: #c4b5fd;
        font-size: 15px;
        font-weight: 600;
        margin: 0 0 16px;
        text-transform: uppercase;
        letter-spacing: 1px;
      ">📋 Important Instructions</h3>
      <div style="
        background: rgba(139, 92, 246, 0.04);
        border: 1px solid rgba(139, 92, 246, 0.08);
        border-radius: 14px;
        padding: 16px 20px;
      ">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          ${listItems}
        </table>
      </div>
    </div>
  `;
}

function getFooterHtml() {
  return `
    <!-- Footer -->
    <div style="
      padding: 28px 40px 36px;
      text-align: center;
      border-top: 1px solid rgba(139, 92, 246, 0.08);
    ">
      <p style="
        color: rgba(167, 139, 250, 0.6);
        font-size: 13px;
        margin: 0 0 8px;
        line-height: 1.5;
      ">
        Questions? Reach out to us at
        <a href="mailto:cellspell@sliit.lk" style="
          color: #a78bfa;
          text-decoration: underline;
        ">cellspell@sliit.lk</a>
      </p>

      <!-- TODO: Replace YOUR_LINK with actual WhatsApp group invite link -->
      <p style="
        color: rgba(167, 139, 250, 0.5);
        font-size: 13px;
        margin: 8px 0;
      ">
        Join our WhatsApp group:
        <a href="https://chat.whatsapp.com/YOUR_LINK" style="color: #a78bfa;">Click here</a>
      </p>

      <div style="
        width: 40px;
        height: 2px;
        background: rgba(139, 92, 246, 0.15);
        border-radius: 2px;
        margin: 20px auto;
      "></div>

      <p style="
        color: rgba(148, 163, 184, 0.4);
        font-size: 12px;
        margin: 0 0 4px;
        line-height: 1.5;
      ">
        Cell Spell 2.0 — SLIIT IEEE Biotechnology Society
      </p>
      <p style="
        color: rgba(148, 163, 184, 0.3);
        font-size: 11px;
        margin: 0;
      ">
        You received this email because you registered for our event.
      </p>
    </div>
  `;
}

// ============================================================
// WORKSHOP CONFIRMATION EMAIL
// ============================================================
export function workshopConfirmationTemplate({
  fullName,
  registrationId,
  email,
  sliitRegNumber,
  faculty,
  yearSemester,
}) {
  // Update these when final times are confirmed
  const eventDate = '29th July 2026';
  const eventVenue = 'New Building, SLIIT';

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Workshop Registration Confirmed — Cell Spell 2.0</title>
  <style type="text/css">${getBaseStyles()}</style>
</head>
<body>
  <div class="email-wrapper">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <div class="email-container">

            ${getHeaderHtml(
              '🧬',
              'Bioinformatics Workshop',
              'Explore the intersection of biology and computing'
            )}

            ${getSuccessBadgeHtml(registrationId)}

            ${getGreetingHtml(fullName)}

            <!-- Event Details Grid -->
            <div class="content-section" style="padding: 24px 40px;">
              <h3 style="
                color: #c4b5fd;
                font-size: 15px;
                font-weight: 600;
                margin: 0 0 16px;
                text-transform: uppercase;
                letter-spacing: 1px;
              ">📅 Event Details</h3>
              <table class="detail-grid" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  ${getDetailItemHtml('📅', 'Date & Time', eventDate)}
                  ${getDetailItemHtml('📍', 'Venue', eventVenue)}
                </tr>
                <tr>
                  ${getDetailItemHtml('🎓', 'Faculty', faculty)}
                  ${getDetailItemHtml('📆', 'Year & Semester', yearSemester)}
                </tr>
                <tr>
                  ${getDetailItemHtml('🆔', 'SLIIT Reg No.', sliitRegNumber)}
                  ${getDetailItemHtml('📧', 'Email', email)}
                </tr>
              </table>
            </div>

            <!-- What to Expect -->
            <div class="content-section" style="padding: 0 40px 24px;">
              <div style="
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%);
                border: 1px solid rgba(139, 92, 246, 0.12);
                border-radius: 14px;
                padding: 24px;
              ">
                <h3 style="
                  color: #c4b5fd;
                  font-size: 15px;
                  font-weight: 600;
                  margin: 0 0 12px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                ">🔬 What to Expect</h3>
                <!-- Update workshop agenda items as needed -->
                <ul style="
                  color: rgba(203, 213, 225, 0.85);
                  font-size: 14px;
                  line-height: 2;
                  margin: 0;
                  padding-left: 20px;
                ">
                  <li>Introduction to essential bioinformatics software and tools</li>
                  <li>Hands-on practical sessions with real biological datasets</li>
                  <li>Exciting competition to solve a bioinformatics challenge</li>
                  <li>Certificates awarded to competition winners</li>
                  <li>Networking with fellow biology and computing enthusiasts</li>
                </ul>
              </div>
            </div>

            ${getInstructionsHtml([
              // Update these instructions as needed
              { icon: '🪪', text: 'Bring your <strong style="color: #e2e8f0;">University ID card</strong> for check-in verification.' },
              { icon: '💻', text: 'Bring a <strong style="color: #e2e8f0;">laptop</strong> for the hands-on sessions (charger recommended).' },
              { icon: '⏰', text: 'Arrive <strong style="color: #e2e8f0;">15 minutes early</strong> for registration and seating.' },
              { icon: '📱', text: 'Save your <strong style="color: #e2e8f0;">Registration ID</strong> — you\'ll need it at the venue.' },
              { icon: '🚫', text: 'Registration is <strong style="color: #e2e8f0;">non-transferable</strong>. Contact us for cancellations.' },
            ])}

            ${getFooterHtml()}

          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `.trim();
}

// ============================================================
// INDUSTRY VISIT CONFIRMATION EMAIL
// ============================================================
export function industryVisitConfirmationTemplate({
  fullName,
  registrationId,
  email,
  sliitRegNumber,
  faculty,
  yearSemester,
}) {
  // Update venue once it's confirmed
  const eventDate = '1st August 2026';
  const eventVenue = 'Venue To Be Announced';

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Industry Visit Registration Confirmed — Cell Spell 2.0</title>
  <style type="text/css">${getBaseStyles()}</style>
</head>
<body>
  <div class="email-wrapper">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <div class="email-container">

            ${getHeaderHtml(
              '🏭',
              'Industry Visit',
              'Behind-the-scenes at leading biotech & pharma companies'
            )}

            ${getSuccessBadgeHtml(registrationId)}

            ${getGreetingHtml(fullName)}

            <!-- Event Details Grid -->
            <div class="content-section" style="padding: 24px 40px;">
              <h3 style="
                color: #c4b5fd;
                font-size: 15px;
                font-weight: 600;
                margin: 0 0 16px;
                text-transform: uppercase;
                letter-spacing: 1px;
              ">📅 Event Details</h3>
              <table class="detail-grid" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  ${getDetailItemHtml('📅', 'Date & Time', eventDate)}
                  ${getDetailItemHtml('📍', 'Venue', eventVenue)}
                </tr>
                <tr>
                  ${getDetailItemHtml('🎓', 'Faculty', faculty)}
                  ${getDetailItemHtml('📆', 'Year & Semester', yearSemester)}
                </tr>
                <tr>
                  ${getDetailItemHtml('🆔', 'SLIIT Reg No.', sliitRegNumber)}
                  ${getDetailItemHtml('📧', 'Email', email)}
                </tr>
              </table>
            </div>

            <!-- What to Expect -->
            <div class="content-section" style="padding: 0 40px 24px;">
              <div style="
                background: linear-gradient(135deg, rgba(34, 197, 94, 0.06) 0%, rgba(16, 185, 129, 0.04) 100%);
                border: 1px solid rgba(34, 197, 94, 0.1);
                border-radius: 14px;
                padding: 24px;
              ">
                <h3 style="
                  color: #86efac;
                  font-size: 15px;
                  font-weight: 600;
                  margin: 0 0 12px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                ">🏢 What to Expect</h3>
                <!-- Update visit agenda items as needed -->
                <ul style="
                  color: rgba(203, 213, 225, 0.85);
                  font-size: 14px;
                  line-height: 2;
                  margin: 0;
                  padding-left: 20px;
                ">
                  <li>Guided facility tour of leading biotech/pharmaceutical companies</li>
                  <li>Interactive sessions with industry professionals</li>
                  <li>Understanding of real-world applications of biotechnology</li>
                  <li>Networking opportunities with industry leaders</li>
                  <li>Q&A sessions with company representatives</li>
                </ul>
              </div>
            </div>

            ${getInstructionsHtml([
              // Update these instructions as needed
              { icon: '🪪', text: 'Bring your <strong style="color: #e2e8f0;">University ID card</strong> — required for facility entry.' },
              { icon: '👔', text: 'Wear <strong style="color: #e2e8f0;">smart casual / formal attire</strong> (company requirement).' },
              { icon: '🚌', text: '<strong style="color: #e2e8f0;">Transport details</strong> will be shared closer to the event date.' },
              { icon: '⏰', text: 'Be at the <strong style="color: #e2e8f0;">assembly point on time</strong> — the bus will not wait.' },
              { icon: '📱', text: 'Save your <strong style="color: #e2e8f0;">Registration ID</strong> — you\'ll need it for attendance.' },
              { icon: '📸', text: 'Photography may be <strong style="color: #e2e8f0;">restricted</strong> inside the facility. Follow instructions.' },
            ])}

            ${getFooterHtml()}

          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `.trim();
}
