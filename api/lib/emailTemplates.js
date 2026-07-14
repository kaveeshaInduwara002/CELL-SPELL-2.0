// ============================================================
// api/lib/emailTemplates.js — HTML Email Templates
// ============================================================
// Dark magical biology theme — neon green + black, DNA motifs,
// "spellbook meets science" aesthetic.
//
// Technical approach:
//   - Table-based layout for Outlook/older client compatibility
//   - ALL styling is inline (style="...") on each element
//   - <style> block used ONLY as progressive enhancement for
//     mobile (@media queries) — layout works without it
//   - 600px max width, single-column collapse on mobile
//   - Web-safe fonts (Arial, Helvetica, sans-serif)
//   - Emoji used for icons (universal client support)
//   - Total HTML kept well under Gmail's 102KB clip limit
// ============================================================

// -------------------------------------------------------
// Color palette (matches site CSS custom properties)
// -------------------------------------------------------
// Dark theme palette (used as hardcoded inline styles — the base render)
const C = {
  bgOuter:    '#050a05',  // --bg-deep
  bgInner:    '#0a120a',  // --bg-dark
  bgCard:     '#0d1a0d',  // --bg-card
  bgSurface:  '#132613',  // --bg-surface
  neon:       '#39ff14',  // --neon-green
  neonDim:    'rgba(57,255,20,0.35)',
  neonSoft:   'rgba(57,255,20,0.12)',
  neonBorder: 'rgba(57,255,20,0.20)',
  neonFaint:  'rgba(57,255,20,0.08)',
  teal:       '#00ffc8',  // --magic-teal
  textPri:    '#e8f5e9',  // --text-primary
  textSec:    '#a5d6a7',  // --text-secondary
  textMuted:  '#66bb6a',  // --text-muted
  textDim:    '#4a7a4a',  // --text-dim
  success:    '#4ade80',  // --success
  white:      '#ffffff',
};

// Light theme palette (applied via @media (prefers-color-scheme: light) in <style>)
// Neon green is darkened for legibility on white backgrounds.
const CL = {
  bgOuter:    '#eef2ee',
  bgInner:    '#ffffff',
  bgCard:     '#f8faf8',
  bgSurface:  '#edf5ed',
  neon:       '#18a300',  // darkened neon green — readable on white
  neonBorder: 'rgba(24,163,0,0.25)',
  neonFaint:  'rgba(24,163,0,0.10)',
  textPri:    '#1a2e1a',
  textSec:    '#2e5c2e',
  textMuted:  '#3a7a3a',
  textDim:    '#5a8a5a',
  success:    '#16a34a',
  white:      '#ffffff',
};

const FONT = "Arial, Helvetica, 'Segoe UI', sans-serif";
const FONT_MONO = "'Courier New', Courier, monospace";

// -------------------------------------------------------
// Progressive-enhancement <style> block
// Only for clients that support embedded CSS (Apple Mail,
// Gmail app, etc.). Layout is fully functional without it.
// -------------------------------------------------------
function getEmailStyles() {
  return `
    /* =====================================================
       MOBILE RESPONSIVE
       ===================================================== */
    @media only screen and (max-width: 600px) {
      .email-outer { padding: 8px !important; }
      .email-inner { border-radius: 12px !important; }
      .content-pad { padding-left: 20px !important; padding-right: 20px !important; }
      .hero-pad { padding: 32px 20px 28px !important; }
      .detail-cell { display: block !important; width: 100% !important; padding: 4px 0 !important; }
      .hero-title { font-size: 22px !important; }
      .reg-id-text { font-size: 24px !important; }
    }

    /* =====================================================
       DARK MODE
       Lock in the dark palette — prevents mail clients
       from auto-inverting our already-dark email.
       ===================================================== */
    @media (prefers-color-scheme: dark) {
      body, .email-body          { background-color: ${C.bgOuter} !important; color: ${C.textPri} !important; }
      .email-outer-td            { background-color: ${C.bgOuter} !important; }
      .email-inner               { background-color: ${C.bgInner} !important; border-color: ${C.neonBorder} !important; }
      .email-header              { background-color: ${C.bgCard} !important; border-bottom-color: ${C.neonBorder} !important; }
      .email-card                { background-color: ${C.bgCard} !important; border-color: ${C.neonBorder} !important; }
      .email-card-faint          { background-color: ${C.bgCard} !important; border-color: ${C.neonFaint} !important; }
      .email-surface             { background-color: ${C.bgSurface} !important; border-color: ${C.neonBorder} !important; }
      .email-wa-card             { background-color: #061a0c !important; border-color: rgba(37,211,102,0.30) !important; }
      .email-icon-cell           { background-color: ${C.bgSurface} !important; border-color: ${C.neonFaint} !important; }
      .email-reg-id-badge        { background-color: ${C.bgSurface} !important; border-color: ${C.neon} !important; }
      .c-neon                    { color: ${C.neon} !important; }
      .c-text-pri                { color: ${C.textPri} !important; }
      .c-text-sec                { color: ${C.textSec} !important; }
      .c-text-muted              { color: ${C.textMuted} !important; }
      .c-text-dim                { color: ${C.textDim} !important; }
      .c-success                 { color: ${C.success} !important; }
    }

    /* =====================================================
       LIGHT MODE
       Override inline dark styles with light palette.
       ===================================================== */
    @media (prefers-color-scheme: light) {
      body, .email-body          { background-color: ${CL.bgOuter} !important; color: ${CL.textPri} !important; }
      .email-outer-td            { background-color: ${CL.bgOuter} !important; }
      .email-inner               { background-color: ${CL.bgInner} !important; border-color: ${CL.neonBorder} !important; }
      .email-header              { background-color: ${CL.bgCard} !important; border-bottom-color: ${CL.neonBorder} !important; }
      .email-card                { background-color: ${CL.bgCard} !important; border-color: ${CL.neonBorder} !important; }
      .email-card-faint          { background-color: ${CL.bgCard} !important; border-color: ${CL.neonFaint} !important; }
      .email-surface             { background-color: ${CL.bgSurface} !important; border-color: ${CL.neonBorder} !important; }
      .email-wa-card             { background-color: #e8f5e9 !important; border-color: rgba(37,211,102,0.40) !important; }
      .email-icon-cell           { background-color: ${CL.bgSurface} !important; border-color: ${CL.neonFaint} !important; }
      .email-reg-id-badge        { background-color: ${CL.bgSurface} !important; border-color: ${CL.neon} !important; }
      .c-neon                    { color: ${CL.neon} !important; }
      .c-text-pri                { color: ${CL.textPri} !important; }
      .c-text-sec                { color: ${CL.textSec} !important; }
      .c-text-muted              { color: ${CL.textMuted} !important; }
      .c-text-dim                { color: ${CL.textDim} !important; }
      .c-success                 { color: ${CL.success} !important; }
    }

    /* =====================================================
       OUTLOOK / GMAIL DARK MODE FORCED-INVERSION GUARD
       [data-ogsc] = Outlook dark mode
       [data-ogsb] = Outlook dark mode (body bg)
       These prevent Outlook/Gmail from re-inverting our
       already-correct dark email for dark-mode users.
       ===================================================== */
    [data-ogsc] body, [data-ogsc] .email-body,
    [data-ogsb] body, [data-ogsb] .email-body   { background-color: ${C.bgOuter} !important; color: ${C.textPri} !important; }
    [data-ogsc] .email-outer-td,
    [data-ogsb] .email-outer-td                 { background-color: ${C.bgOuter} !important; }
    [data-ogsc] .email-inner,
    [data-ogsb] .email-inner                    { background-color: ${C.bgInner} !important; border-color: ${C.neonBorder} !important; }
    [data-ogsc] .email-header,
    [data-ogsb] .email-header                   { background-color: ${C.bgCard} !important; border-bottom-color: ${C.neonBorder} !important; }
    [data-ogsc] .email-card,
    [data-ogsb] .email-card                     { background-color: ${C.bgCard} !important; border-color: ${C.neonBorder} !important; }
    [data-ogsc] .email-card-faint,
    [data-ogsb] .email-card-faint               { background-color: ${C.bgCard} !important; border-color: ${C.neonFaint} !important; }
    [data-ogsc] .email-surface,
    [data-ogsb] .email-surface                  { background-color: ${C.bgSurface} !important; border-color: ${C.neonBorder} !important; }
    [data-ogsc] .email-reg-id-badge,
    [data-ogsb] .email-reg-id-badge             { background-color: ${C.bgSurface} !important; border-color: ${C.neon} !important; }
    [data-ogsc] .email-icon-cell,
    [data-ogsb] .email-icon-cell                { background-color: ${C.bgSurface} !important; border-color: ${C.neonFaint} !important; }
    [data-ogsc] .c-neon, [data-ogsb] .c-neon   { color: ${C.neon} !important; }
    [data-ogsc] .c-text-pri, [data-ogsb] .c-text-pri   { color: ${C.textPri} !important; }
    [data-ogsc] .c-text-sec, [data-ogsb] .c-text-sec   { color: ${C.textSec} !important; }
    [data-ogsc] .c-text-muted, [data-ogsb] .c-text-muted { color: ${C.textMuted} !important; }
    [data-ogsc] .c-text-dim, [data-ogsb] .c-text-dim   { color: ${C.textDim} !important; }
    [data-ogsc] .c-success, [data-ogsb] .c-success     { color: ${C.success} !important; }
  `;
}

// -------------------------------------------------------
// Simple inline SVG: DNA double-helix divider
// Single-color, no gradients/filters/animations.
// Used as a decorative separator — degrades gracefully
// (clients that strip SVG just see nothing, which is fine).
// -------------------------------------------------------
function dnaDividerSvg() {
  // A minimal single-color DNA strand rendered as a horizontal divider
  return `
    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='24' viewBox='0 0 200 24'%3E%3Cpath d='M0 12 Q25 0 50 12 Q75 24 100 12 Q125 0 150 12 Q175 24 200 12' fill='none' stroke='%2339ff14' stroke-width='1.5' opacity='0.4'/%3E%3Cpath d='M0 12 Q25 24 50 12 Q75 0 100 12 Q125 24 150 12 Q175 0 200 12' fill='none' stroke='%2339ff14' stroke-width='1.5' opacity='0.4'/%3E%3Ccircle cx='50' cy='12' r='2' fill='%2339ff14' opacity='0.5'/%3E%3Ccircle cx='100' cy='12' r='2' fill='%2339ff14' opacity='0.5'/%3E%3Ccircle cx='150' cy='12' r='2' fill='%2339ff14' opacity='0.5'/%3E%3C/svg%3E" width="200" height="24" alt="" style="display:block;margin:0 auto;" />
  `.trim();
}

// -------------------------------------------------------
// Header section — event icon + name + subtitle + DNA motif
// -------------------------------------------------------
function getHeaderHtml(eventEmoji, eventTitle, eventSubtitle) {
  return `
    <!-- HEADER -->
    <tr>
      <td align="center" class="hero-pad email-header" style="padding:44px 40px 36px;background-color:${C.bgCard};border-bottom:2px solid ${C.neonBorder};">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <!-- Logo / brand badge -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="email-surface" style="background-color:${C.bgSurface};border:2px solid ${C.neonBorder};border-radius:50%;padding:4px;text-align:center;width:80px;height:80px;overflow:hidden;">
                    <img src="https://cell-spell-2-0.vercel.app/cell-spell-logo.jpg"
                         alt="Cell Spell 2.0"
                         width="80"
                         height="80"
                         style="display:block;width:80px;height:80px;border-radius:50%;object-fit:cover;border:0;outline:none;text-decoration:none;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Event title -->
          <tr>
            <td align="center">
              <h1 class="hero-title c-neon" style="margin:0 0 6px;font-family:${FONT};font-size:26px;font-weight:700;color:${C.neon};letter-spacing:-0.3px;line-height:1.2;">
                ${eventTitle}
              </h1>
            </td>
          </tr>
          <!-- Subtitle -->
          <tr>
            <td align="center" style="padding-top:4px;">
              <p class="c-text-sec" style="margin:0;font-family:${FONT};font-size:15px;color:${C.textSec};line-height:1.5;">
                ${eventSubtitle}
              </p>
            </td>
          </tr>
          <!-- DNA helix divider -->
          <tr>
            <td align="center" style="padding-top:24px;">
              ${dnaDividerSvg()}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

// -------------------------------------------------------
// Registration Confirmed badge with prominent reg ID
// -------------------------------------------------------
function getSuccessBadgeHtml(registrationId) {
  return `
    <!-- REGISTRATION CONFIRMED BADGE -->
    <tr>
      <td align="center" class="content-pad" style="padding:32px 40px 8px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="email-card" style="border:1px solid ${C.neonBorder};border-radius:14px;background-color:${C.bgCard};">
          <tr>
            <td align="center" style="padding:28px 36px;">
              <!-- Checkmark -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" class="email-surface" style="width:52px;height:52px;border-radius:50%;background-color:rgba(57,255,20,0.10);border:2px solid ${C.neonBorder};font-size:26px;line-height:52px;text-align:center;">
                    &#x2714;&#xFE0F;
                  </td>
                </tr>
              </table>
              <!-- Heading -->
              <h2 class="c-success" style="margin:16px 0 4px;font-family:${FONT};font-size:20px;font-weight:700;color:${C.success};letter-spacing:0.3px;">
                Registration Confirmed!
              </h2>
              <p class="c-text-dim" style="margin:0 0 14px;font-family:${FONT};font-size:13px;color:${C.textDim};text-transform:uppercase;letter-spacing:1.5px;">
                Your Registration ID
              </p>
              <!-- Registration ID badge -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" class="email-reg-id-badge" style="background-color:${C.bgSurface};border:2px solid ${C.neon};border-radius:10px;padding:12px 28px;">
                    <span class="reg-id-text c-neon" style="font-family:${FONT_MONO};font-size:28px;font-weight:700;color:${C.neon};letter-spacing:3px;">
                      ${registrationId}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

// -------------------------------------------------------
// Greeting paragraph
// -------------------------------------------------------
function getGreetingHtml(fullName) {
  return `
    <!-- GREETING -->
    <tr>
      <td class="content-pad" style="padding:28px 40px 0;">
        <p class="c-text-pri" style="margin:0;font-family:${FONT};font-size:16px;line-height:1.6;color:${C.textPri};">
          Hi <strong class="c-neon" style="color:${C.neon};">${fullName}</strong>,
        </p>
        <p class="c-text-sec" style="margin:10px 0 0;font-family:${FONT};font-size:16px;line-height:1.7;color:${C.textSec};">
          Thank you for registering! We're thrilled to have you join us. Here are your event details &mdash; please save this email for reference.
        </p>
      </td>
    </tr>
  `;
}

// -------------------------------------------------------
// Single detail row (label + value) — used in a 2-column grid
// -------------------------------------------------------
function detailCell(label, value) {
  return `
    <td class="detail-cell" style="width:50%;vertical-align:top;padding:6px;" valign="top">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-card-faint" style="background-color:${C.bgCard};border:1px solid ${C.neonFaint};border-radius:10px;">
        <tr>
          <td style="padding:14px 16px;">
            <p class="c-text-dim" style="margin:0 0 4px;font-family:${FONT};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:${C.textDim};">
              ${label}
            </p>
            <p class="c-text-pri" style="margin:0;font-family:${FONT};font-size:15px;font-weight:500;color:${C.textPri};line-height:1.4;">
              ${value}
            </p>
          </td>
        </tr>
      </table>
    </td>
  `;
}

// -------------------------------------------------------
// Event details grid (date, venue, faculty, etc.)
// -------------------------------------------------------
function getDetailsGridHtml({ eventDate, eventVenue, faculty, yearSemester, sliitRegNumber, email }) {
  return `
    <!-- EVENT DETAILS -->
    <tr>
      <td class="content-pad" style="padding:24px 40px;">
        <h3 class="c-neon" style="margin:0 0 14px;font-family:${FONT};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${C.neon};">
          &#x1F4C5; Event Details
        </h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            ${detailCell('Date', eventDate)}
            ${detailCell('Venue', eventVenue)}
          </tr>
          <tr>
            ${detailCell('Faculty', faculty)}
            ${detailCell('Year &amp; Semester', yearSemester)}
          </tr>
          <tr>
            ${detailCell('SLIIT Reg No.', sliitRegNumber)}
            ${detailCell('Email', email)}
          </tr>
        </table>
      </td>
    </tr>
  `;
}

// -------------------------------------------------------
// "What to Expect" box — list of items
// -------------------------------------------------------
function getExpectationsHtml(sectionTitle, items) {
  const listHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding:6px 0;vertical-align:top;width:22px;" valign="top">
            <span class="c-neon" style="font-family:${FONT};font-size:14px;color:${C.neon};line-height:1.6;">&#x25B8;</span>
          </td>
          <td class="c-text-sec" style="padding:6px 0 6px 8px;font-family:${FONT};font-size:15px;color:${C.textSec};line-height:1.6;">
            ${item}
          </td>
        </tr>`
    )
    .join('');

  return `
    <!-- WHAT TO EXPECT -->
    <tr>
      <td class="content-pad" style="padding:0 40px 24px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-card-faint" style="background-color:${C.bgCard};border:1px solid ${C.neonFaint};border-radius:12px;">
          <tr>
            <td style="padding:22px 24px;">
              <h3 class="c-neon" style="margin:0 0 12px;font-family:${FONT};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${C.neon};">
                ${sectionTitle}
              </h3>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                ${listHtml}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

// -------------------------------------------------------
// Important instructions list
// -------------------------------------------------------
function getInstructionsHtml(items) {
  const listHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;vertical-align:top;width:32px;" valign="top">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td class="email-icon-cell" style="width:26px;height:26px;border-radius:7px;background-color:${C.bgSurface};border:1px solid ${C.neonFaint};text-align:center;font-size:13px;line-height:26px;">
                  ${item.icon}
                </td>
              </tr>
            </table>
          </td>
          <td class="c-text-sec" style="padding:8px 0 8px 10px;font-family:${FONT};font-size:15px;color:${C.textSec};line-height:1.6;vertical-align:top;" valign="top">
            ${item.text}
          </td>
        </tr>`
    )
    .join('');

  return `
    <!-- IMPORTANT INSTRUCTIONS -->
    <tr>
      <td class="content-pad" style="padding:0 40px 28px;">
        <h3 class="c-neon" style="margin:0 0 14px;font-family:${FONT};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${C.neon};">
          &#x1F4CB; Important Instructions
        </h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-card-faint" style="background-color:${C.bgCard};border:1px solid ${C.neonFaint};border-radius:12px;">
          <tr>
            <td style="padding:18px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                ${listHtml}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

// -------------------------------------------------------
// Footer — organizer info, contact, branding
// -------------------------------------------------------
function getFooterHtml() {
  return `
    <!-- FOOTER -->
    <tr>
      <td style="padding:0;">
        <!-- Top border glow line -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="height:1px;background-color:${C.neonFaint};font-size:1px;line-height:1px;">&nbsp;</td>
          </tr>
        </table>

        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td align="center" style="padding:28px 40px 16px;">
              <!-- DNA divider -->
              ${dnaDividerSvg()}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:4px 40px;">
              <p class="c-text-muted" style="margin:0;font-family:${FONT};font-size:14px;color:${C.textMuted};line-height:1.5;">
                Questions? Reach out at
                <a href="mailto:cellspell2@gmail.com" class="c-neon" style="color:${C.neon};text-decoration:underline;">cellspell2@gmail.com</a>
              </p>
            </td>
          </tr>

          <!-- Neon divider dot -->
          <tr>
            <td align="center" style="padding:20px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="width:6px;height:6px;border-radius:50%;background-color:${C.neonBorder};">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 40px;">
              <p class="c-text-dim" style="margin:0;font-family:${FONT};font-size:12px;color:${C.textDim};line-height:1.5;">
                Cell Spell 2.0 &mdash; SLIIT IEEE Biotechnology Society
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:6px 40px 32px;">
              <p style="margin:0;font-family:${FONT};font-size:11px;color:rgba(74,122,74,0.6);line-height:1.5;">
                You received this email because you registered for our event.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

// -------------------------------------------------------
// WhatsApp Group CTA — inline SVG button + hint text
// Pill-shaped button with WA brand green, works in light
// and dark email themes (green is fine on both).
// -------------------------------------------------------
function getWhatsAppCtaHtml() {
  const WA_LINK = 'https://chat.whatsapp.com/GedxmaHBym83Fz9ksAAw2j?mode=gi_t';

  // Inline SVG WhatsApp icon path — no external load, renders everywhere
  const waIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32"
       style="display:inline-block;vertical-align:middle;margin-right:8px;" aria-hidden="true">
    <path fill="#ffffff" d="M16.002 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.37.633 4.687 1.833 6.714
      L2.667 29.333l6.807-1.787A13.268 13.268 0 0 0 16.002 29.333c7.364 0 13.331-5.969 13.331-13.333
      0-7.364-5.967-13.333-13.331-13.333zm0 24.223a11.24 11.24 0 0 1-5.74-1.574l-.411-.244
      -4.038 1.059 1.078-3.93-.267-.404A11.198 11.198 0 0 1 4.782 16c0-6.185 5.034-11.22 11.22-11.22
      6.187 0 11.22 5.035 11.22 11.22 0 6.186-5.033 11.22-11.22 11.22zm6.15-8.4
      c-.337-.169-1.994-.984-2.303-1.096-.308-.113-.533-.169-.757.169
      -.225.337-.869 1.096-1.066 1.321-.196.225-.392.253-.729.084
      -.337-.169-1.422-.524-2.708-1.672-.999-.892-1.674-1.993-1.871-2.33
      -.196-.337-.021-.52.148-.688.152-.151.337-.393.506-.589.168-.196.225-.337.337-.562
      .113-.225.057-.422-.028-.591-.084-.169-.757-1.825-1.037-2.499
      -.273-.656-.55-.567-.757-.578l-.645-.011c-.225 0-.589.084-.898.422
      -.308.337-1.178 1.152-1.178 2.808 0 1.655 1.206 3.255 1.374 3.48
      .169.225 2.374 3.624 5.752 5.083.804.347 1.431.554 1.921.709
      .807.256 1.542.22 2.122.133.647-.097 1.994-.815 2.275-1.603
      .281-.787.281-1.462.196-1.603-.084-.14-.308-.225-.645-.393z"/>
  </svg>`;

  return `
    <!-- WHATSAPP GROUP CTA -->
    <tr>
      <td class="content-pad" style="padding:0 40px 28px;text-align:center;">
        <!-- Pill button -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
          <tr>
            <td align="center" style="border-radius:100px;background-color:#25D366;
                box-shadow:0 4px 20px rgba(37,211,102,0.35);">
              <a href="${WA_LINK}" target="_blank"
                 style="display:inline-block;padding:14px 32px;font-family:${FONT};font-size:15px;
                        font-weight:700;color:#ffffff;text-decoration:none;border-radius:100px;
                        letter-spacing:0.3px;vertical-align:middle;">
                ${waIconSvg}<span style="vertical-align:middle;">Join our WhatsApp Group</span>
              </a>
            </td>
          </tr>
        </table>
        <!-- Hint text -->
        <p class="c-text-muted" style="margin:10px 0 0;font-family:${FONT};font-size:12px;
                  color:${C.textMuted};letter-spacing:0.3px;text-align:center;">
          Join WhatsApp group for Future Updates
        </p>
      </td>
    </tr>
  `;
}

// -------------------------------------------------------
// Full email wrapper — wraps all sections in the outer
// table-based scaffold with dark background
// -------------------------------------------------------
function wrapEmail(title, innerRows) {
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Reset for all clients */
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    ${getEmailStyles()}
  </style>
</head>
<body class="email-body" style="margin:0;padding:0;width:100%;background-color:${C.bgOuter};font-family:${FONT};-webkit-font-smoothing:antialiased;">
  <!-- Outer wrapper table — full-width dark background -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${C.bgOuter};">
    <tr>
      <td align="center" class="email-outer email-outer-td" style="padding:32px 16px;">
        <!-- Inner container — 600px max -->
        <!--[if (gte mso 9)|(IE)]>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center"><tr><td>
        <![endif]-->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-inner" style="max-width:600px;background-color:${C.bgInner};border:1px solid ${C.neonBorder};border-radius:16px;overflow:hidden;">
          ${innerRows}
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td></tr></table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
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
  const eventDate = 'To be Announced';
  const eventVenue = 'To be Announced';

  const innerRows = [
    getHeaderHtml(
      '&#x1F9EC;', // 🧬
      'Bioinformatics Workshop',
      'Where biology meets dark magic &#x2728;'
    ),
    getSuccessBadgeHtml(registrationId),
    getGreetingHtml(fullName),
    getWhatsAppCtaHtml(),
    getDetailsGridHtml({ eventDate, eventVenue, faculty, yearSemester, sliitRegNumber, email }),
    getExpectationsHtml('&#x1F52C; What to Expect', [
      'Introduction to essential bioinformatics software and tools',
      'Hands-on practical sessions to build real bioinformatics skills',
      'Exciting competition to solve a real bioinformatics challenge',
      'Certificates awarded to all attendees for participation',
      'Meet and greet with industry expert speakers',
      'Networking with fellow biology and computing enthusiasts',
    ]),
    getInstructionsHtml([
      { icon: '&#x1F4B3;', text: `Bring your <strong style="color:${C.textPri};">University ID card</strong> for check-in verification.` },
      { icon: '&#x1F4BB;', text: `Bring a <strong style="color:${C.textPri};">laptop</strong> for the hands-on sessions (charger recommended).` },
      { icon: '&#x23F0;', text: `Arrive <strong style="color:${C.textPri};">15 minutes early</strong> for registration and seating.` },
      { icon: '&#x1F4F1;', text: `Save your <strong style="color:${C.textPri};">Registration ID</strong> &mdash; you'll need it at the venue.` },
      { icon: '&#x1F6AB;', text: `Registration is <strong style="color:${C.textPri};">non-transferable</strong>. Contact us for cancellations.` },
    ]),
    getFooterHtml(),
  ].join('');

  return wrapEmail('Workshop Registration Confirmed — Cell Spell 2.0', innerRows);
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

  const innerRows = [
    getHeaderHtml(
      '&#x1F3ED;', // 🏭
      'Industry Visit',
      'Behind-the-scenes at leading biotech &amp; pharma companies'
    ),
    getSuccessBadgeHtml(registrationId),
    getGreetingHtml(fullName),
    getDetailsGridHtml({ eventDate, eventVenue, faculty, yearSemester, sliitRegNumber, email }),
    getExpectationsHtml('&#x1F3E2; What to Expect', [
      'Guided facility tour of leading biotech/pharmaceutical companies',
      'Interactive sessions with industry professionals',
      'Understanding of real-world applications of biotechnology',
      'Networking opportunities with industry leaders',
      'Q&amp;A sessions with company representatives',
    ]),
    getInstructionsHtml([
      { icon: '&#x1F4B3;', text: `Bring your <strong style="color:${C.textPri};">University ID card</strong> &mdash; required for facility entry.` },
      { icon: '&#x1F454;', text: `Wear <strong style="color:${C.textPri};">smart casual / formal attire</strong> (company requirement).` },
      { icon: '&#x1F68C;', text: `<strong style="color:${C.textPri};">Transport details</strong> will be shared closer to the event date.` },
      { icon: '&#x23F0;', text: `Be at the <strong style="color:${C.textPri};">assembly point on time</strong> &mdash; the bus will not wait.` },
      { icon: '&#x1F4F1;', text: `Save your <strong style="color:${C.textPri};">Registration ID</strong> &mdash; you'll need it for attendance.` },
      { icon: '&#x1F4F8;', text: `Photography may be <strong style="color:${C.textPri};">restricted</strong> inside the facility. Follow instructions.` },
    ]),
    getFooterHtml(),
  ].join('');

  return wrapEmail('Industry Visit Registration Confirmed — Cell Spell 2.0', innerRows);
}
