// ============================================================
// api/lib/resend.js — Resend Email Client
// ============================================================
// Initializes the Resend client for sending transactional emails.
//
// Environment Variable Required:
//   - RESEND_API_KEY
//
// Set this in:
//   - .env (local dev)
//   - Vercel Dashboard > Settings > Environment Variables (production)
//
// Get your API key at: https://resend.com/api-keys
// ============================================================

import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error(
    'Missing RESEND_API_KEY environment variable. ' +
    'Set it in your Vercel Environment Variables.'
  );
}

export const resend = new Resend(resendApiKey);
