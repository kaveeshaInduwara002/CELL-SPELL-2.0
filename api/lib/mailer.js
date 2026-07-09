// ============================================================
// api/lib/mailer.js — Brevo SMTP Email Client (via Nodemailer)
// ============================================================
// Uses Brevo (formerly Sendinblue) SMTP relay to send
// transactional emails.
//
// Environment Variables Required:
//   - BREVO_SMTP_USER     (your Brevo SMTP login, usually your email)
//   - BREVO_SMTP_KEY      (your Brevo SMTP key / master password)
//   - BREVO_SENDER_EMAIL  (verified sender address in Brevo)
//
// Set these in:
//   - .env (local dev)
//   - Vercel Dashboard > Settings > Environment Variables (production)
// ============================================================

import nodemailer from 'nodemailer';

const brevoUser = process.env.BREVO_SMTP_USER;
const brevoKey = process.env.BREVO_SMTP_KEY;
const senderEmail = process.env.BREVO_SENDER_EMAIL;

if (!brevoUser || !brevoKey) {
  throw new Error(
    'Missing BREVO_SMTP_USER or BREVO_SMTP_KEY environment variables. ' +
    'Set them in your Vercel Environment Variables.'
  );
}

if (!senderEmail) {
  throw new Error(
    'Missing BREVO_SENDER_EMAIL environment variable. ' +
    'Set it to your verified sender address in Brevo.'
  );
}

// Create a reusable SMTP transporter using Brevo
export const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: brevoUser,
    pass: brevoKey,
  },
});

// The sender address (uses your verified Brevo sender)
export const EMAIL_FROM = `Cell Spell 2.0 <${senderEmail}>`;
