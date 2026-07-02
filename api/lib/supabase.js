// ============================================================
// api/lib/supabase.js — Server-side Supabase Client
// ============================================================
// This creates a Supabase client using the SERVICE ROLE KEY,
// which bypasses Row Level Security (RLS). This is ONLY used
// in server-side Vercel Serverless Functions — never in the
// browser/client code.
//
// Environment Variables Required:
//   - VITE_SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)
//   - SUPABASE_SERVICE_ROLE_KEY
//
// Set these in:
//   - .env (local dev)
//   - Vercel Dashboard > Settings > Environment Variables (production)
// ============================================================

import { createClient } from '@supabase/supabase-js';

// In Vercel serverless functions, VITE_ prefixed vars are NOT auto-exposed.
// We check multiple env var names for flexibility.
const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing SUPABASE_URL environment variable. ' +
    'Set SUPABASE_URL in your Vercel Environment Variables.'
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
    'Set it in Vercel Environment Variables (never expose to the client!).'
  );
}

// Create a Supabase client with the service role key.
// This client bypasses RLS and has full database access.
// NEVER import this in client-side code.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
