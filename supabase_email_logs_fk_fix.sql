-- =============================================
-- Cell Spell 2.0 — Fix email_logs Foreign Key
-- Migration: email_logs_registration_id_fkey → ON DELETE CASCADE
-- =============================================
-- WHY: The admin dashboard needs to be able to delete registrations
-- (e.g. removing duplicates or test entries). Currently this fails
-- with a foreign key violation because email_logs references the
-- registration_id without an ON DELETE behavior, leaving orphaned
-- email log rows that block the delete.
--
-- WHAT: Drops the existing constraint and re-adds it with
-- ON DELETE CASCADE, so deleting a registration automatically
-- cleans up any associated email_logs rows.
--
-- HOW TO RUN:
--   1. Go to Supabase Dashboard > SQL Editor > New Query
--   2. Paste this entire file
--   3. Click "Run"
-- =============================================

ALTER TABLE email_logs
DROP CONSTRAINT email_logs_registration_id_fkey;

ALTER TABLE email_logs
ADD CONSTRAINT email_logs_registration_id_fkey
FOREIGN KEY (registration_id)
REFERENCES registrations (registration_id)
ON DELETE CASCADE;
