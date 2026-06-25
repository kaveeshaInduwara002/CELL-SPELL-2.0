-- =============================================
-- Cell Spell 2.0 — Form Status Control System
-- Migration: form_configs + form_status_logs
-- =============================================
-- Run this SQL in your Supabase SQL Editor AFTER the main schema
-- (Dashboard > SQL Editor > New Query)
-- =============================================

-- -----------------------------------------------
-- Step 1: Clean up Workshop-2 from events table
-- -----------------------------------------------
-- First, delete any registrations for the deprecated events so we can delete the events
DELETE FROM registrations WHERE event_slug IN ('workshop-2', 'competition');

-- Now we can delete the deprecated events
DELETE FROM events WHERE slug IN ('workshop-2', 'competition');

-- To rename workshop-1 to workshop, we must handle the foreign key and unique constraints.
-- 1. Temporarily change the prefix of workshop-1 so we can reuse 'W'
UPDATE events SET prefix = 'X' WHERE slug = 'workshop-1';

-- 2. Insert the new event 'workshop' using the 'W' prefix
INSERT INTO events (slug, name, prefix, status, event_date, venue, description)
SELECT 'workshop', name, 'W', status, event_date, venue, description
FROM events WHERE slug = 'workshop-1'
ON CONFLICT (slug) DO NOTHING;

-- Move existing workshop-1 registrations to point to the new 'workshop' slug
UPDATE registrations SET event_slug = 'workshop' WHERE event_slug = 'workshop-1';

-- Now it's safe to delete the old workshop-1 event
DELETE FROM events WHERE slug = 'workshop-1';

-- Update industry-visit status
UPDATE events SET status = 'coming_soon' WHERE slug = 'industry-visit';

-- -----------------------------------------------
-- Step 2: Create form_configs table
-- -----------------------------------------------
DROP TABLE IF EXISTS form_configs CASCADE;

CREATE TABLE form_configs (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_key          TEXT UNIQUE NOT NULL,
  status            TEXT NOT NULL DEFAULT 'coming_soon'
                    CHECK (status IN ('open', 'closed', 'coming_soon')),
  scheduled_open_at TIMESTAMPTZ,
  title             TEXT,
  description       TEXT,
  schedule_info     JSONB,
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- Seed with default configs
INSERT INTO form_configs (form_key, status, title, description) VALUES
  ('workshop', 'open', 'Bioinformatics Workshop', 'Register for the Bioinformatics Workshop'),
  ('industry_visit', 'coming_soon', 'Industry Visit', 'Registration opens soon. Stay tuned!')
ON CONFLICT (form_key) DO NOTHING;

-- -----------------------------------------------
-- Step 3: Create form_status_logs table
-- -----------------------------------------------
DROP TABLE IF EXISTS form_status_logs CASCADE;

CREATE TABLE form_status_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_key    TEXT NOT NULL,
  old_status  TEXT,
  new_status  TEXT NOT NULL,
  changed_by  TEXT,
  changed_at  TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fsl_form_key ON form_status_logs (form_key);
CREATE INDEX IF NOT EXISTS idx_fsl_changed_at ON form_status_logs (changed_at DESC);

-- -----------------------------------------------
-- Step 4: RLS Policies
-- -----------------------------------------------
ALTER TABLE form_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_status_logs ENABLE ROW LEVEL SECURITY;

-- form_configs: public read
CREATE POLICY "Public read form_configs"
  ON form_configs FOR SELECT
  TO anon, authenticated
  USING (true);

-- form_configs: admin update only
CREATE POLICY "Admin update form_configs"
  ON form_configs FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- form_configs: admin insert (for initial seeding)
CREATE POLICY "Admin insert form_configs"
  ON form_configs FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- form_status_logs: admin read only
CREATE POLICY "Admin read form_status_logs"
  ON form_status_logs FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- form_status_logs: admin delete
CREATE POLICY "Admin delete form_status_logs"
  ON form_status_logs FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- form_status_logs: allow inserts from triggers (SECURITY DEFINER handles this)
CREATE POLICY "System insert form_status_logs"
  ON form_status_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- -----------------------------------------------
-- Step 5: Auto-log trigger on form_configs update
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION trg_log_form_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only log and sync when status actually changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO form_status_logs (form_key, old_status, new_status, changed_by)
    VALUES (
      NEW.form_key,
      OLD.status,
      NEW.status,
      COALESCE(
        (SELECT email FROM admin_users WHERE id = auth.uid()),
        'system'
      )
    );

    -- Sync the events table status
    UPDATE events
    SET status = NEW.status
    WHERE (
      (NEW.form_key = 'workshop' AND slug = 'workshop') OR
      (NEW.form_key = 'industry_visit' AND slug = 'industry-visit')
    );
  END IF;

  -- Auto-update the updated_at timestamp
  NEW.updated_at := now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS log_form_status_change ON form_configs;
CREATE TRIGGER log_form_status_change
  BEFORE UPDATE ON form_configs
  FOR EACH ROW
  EXECUTE FUNCTION trg_log_form_status_change();

-- -----------------------------------------------
-- Step 6: Admin RPC to update form_config
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION update_form_config(
  p_form_key TEXT,
  p_status TEXT,
  p_scheduled_open_at TIMESTAMPTZ DEFAULT NULL,
  p_title TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_schedule_info JSONB DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check admin
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()) THEN
    RETURN json_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Validate status
  IF p_status NOT IN ('open', 'closed', 'coming_soon') THEN
    RETURN json_build_object('success', false, 'error', 'Invalid status value');
  END IF;

  -- Update form_configs (trigger will auto-log the change)
  UPDATE form_configs
  SET
    status = p_status,
    scheduled_open_at = COALESCE(p_scheduled_open_at, scheduled_open_at),
    title = COALESCE(p_title, title),
    description = COALESCE(p_description, description),
    schedule_info = COALESCE(p_schedule_info, schedule_info)
  WHERE form_key = p_form_key;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Form config not found');
  END IF;

  -- Also update the events table status to stay in sync
  UPDATE events
  SET status = p_status
  WHERE (
    (p_form_key = 'workshop' AND slug = 'workshop') OR
    (p_form_key = 'industry_visit' AND slug = 'industry-visit')
  );

  RETURN json_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION update_form_config TO authenticated;

-- -----------------------------------------------
-- Step 7: Auto-open function (for cron/edge function)
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION check_scheduled_opens()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT := 0;
BEGIN
  -- Find forms that should auto-open
  UPDATE form_configs
  SET status = 'open'
  WHERE status = 'coming_soon'
    AND scheduled_open_at IS NOT NULL
    AND scheduled_open_at <= now();

  GET DIAGNOSTICS v_count = ROW_COUNT;

  RETURN json_build_object(
    'success', true,
    'opened_count', v_count
  );
END;
$$;

-- Allow anon to call this (for Vercel cron)
GRANT EXECUTE ON FUNCTION check_scheduled_opens TO anon;

-- -----------------------------------------------
-- Step 8: Enable Realtime on form_configs
-- -----------------------------------------------
-- NOTE: You must also enable Realtime for the form_configs table
-- in your Supabase Dashboard:
--   Database > Replication > Supabase Realtime > Toggle ON for form_configs
--
-- Or run:
ALTER PUBLICATION supabase_realtime ADD TABLE form_configs;

-- =============================================
-- MIGRATION COMPLETE
-- =============================================
-- After running this migration:
-- 1. Enable Realtime for form_configs in Supabase Dashboard
-- 2. The workshop form defaults to 'open'
-- 3. The industry visit form defaults to 'coming_soon'
-- 4. Admin can control both from the dashboard
-- =============================================
