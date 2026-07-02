-- =============================================
-- Cell Spell 2.0 — Email Logs Table
-- Run this SQL in your Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query)
-- =============================================

-- -----------------------------------------------
-- Table: email_logs
-- Tracks all confirmation emails sent (or failed)
-- so admins can follow up on failures manually.
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id TEXT REFERENCES registrations(registration_id),
  event_slug TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
  resend_id TEXT,              -- Resend's message ID for tracking/debugging
  error_message TEXT,          -- Error details if sending failed
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for quick lookups by registration
CREATE INDEX IF NOT EXISTS idx_email_logs_registration_id ON email_logs (registration_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs (status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs (created_at DESC);

-- -----------------------------------------------
-- Row Level Security
-- Only the service_role key (used by serverless functions)
-- and authenticated admins can access this table.
-- No public/anon access at all.
-- -----------------------------------------------
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view email logs in the dashboard
CREATE POLICY "Admin select email_logs"
  ON email_logs FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Service role key bypasses RLS automatically,
-- so the serverless function can INSERT without a policy.

-- =============================================
-- DONE — Run this after your main supabase.sql
-- =============================================
