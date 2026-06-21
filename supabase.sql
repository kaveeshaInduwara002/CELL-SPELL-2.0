-- =============================================
-- Cell Spell 2.0 — Supabase Database Setup
-- Production-Hardened Schema
-- =============================================
-- Run this SQL in your Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query)
-- =============================================

-- -----------------------------------------------
-- CLEAN SLATE: Drop existing objects first
-- -----------------------------------------------
DROP TABLE IF EXISTS bioinformatics_workshop_registrations CASCADE;
DROP TABLE IF EXISTS industry_visit_registrations CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS registration_counters CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

DROP FUNCTION IF EXISTS generate_registration_id CASCADE;
DROP FUNCTION IF EXISTS trg_bw_registration_id CASCADE;
DROP FUNCTION IF EXISTS trg_iv_registration_id CASCADE;
DROP FUNCTION IF EXISTS trg_registration_id CASCADE;
DROP FUNCTION IF EXISTS submit_registration CASCADE;
DROP FUNCTION IF EXISTS admin_get_dashboard_stats CASCADE;
DROP FUNCTION IF EXISTS admin_get_registrations CASCADE;

-- -----------------------------------------------
-- Table: events
-- (Central event registry — add new events here)
-- -----------------------------------------------
CREATE TABLE events (
  slug TEXT PRIMARY KEY,                -- e.g. 'workshop-1', 'workshop-2'
  name TEXT NOT NULL,                   -- Display name
  prefix CHAR(1) NOT NULL UNIQUE,      -- Registration ID prefix: 'W', 'I', etc.
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'closed', 'coming_soon')),
  event_date TEXT,                      -- Human-readable date string
  venue TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed events
INSERT INTO events (slug, name, prefix, status, event_date, venue, description) VALUES
  ('workshop', 'Bioinformatics Workshop', 'W', 'open',
   'Coming Soon', 'University Main Auditorium',
   'Explore the intersection of biology and computing. Learn essential bioinformatics software, then compete in an exciting challenge.'),
  ('industry-visit', 'Industry Visit', 'S', 'coming_soon',
   NULL, NULL,
   'Behind-the-scenes look at leading biotech and pharmaceutical companies.')
ON CONFLICT (slug) DO NOTHING;


-- -----------------------------------------------
-- Registration Counter Table
-- (Tracks sequential IDs per event prefix)
-- -----------------------------------------------
CREATE TABLE registration_counters (
  event_prefix TEXT PRIMARY KEY,
  current_count INT DEFAULT 0 NOT NULL
);

-- Seed counters for each event prefix
INSERT INTO registration_counters (event_prefix, current_count) VALUES
  ('W', 0),
  ('S', 0)
ON CONFLICT (event_prefix) DO NOTHING;

-- -----------------------------------------------
-- Function: Generate sequential registration ID
-- SECURITY DEFINER — runs as the function owner,
-- bypassing RLS. Anon users never touch this table.
-- Format: R + prefix + zero-padded 3-digit number
-- e.g. RW001, RI002, RS003
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION generate_registration_id(prefix TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count INT;
BEGIN
  UPDATE registration_counters
    SET current_count = current_count + 1
    WHERE event_prefix = prefix
  RETURNING current_count INTO new_count;

  IF new_count IS NULL THEN
    INSERT INTO registration_counters (event_prefix, current_count)
      VALUES (prefix, 1)
    ON CONFLICT (event_prefix)
      DO UPDATE SET current_count = registration_counters.current_count + 1
    RETURNING current_count INTO new_count;
  END IF;

  RETURN 'R' || prefix || LPAD(new_count::TEXT, 3, '0');
END;
$$;

-- -----------------------------------------------
-- Table: registrations
-- (Unified table for ALL event registrations)
-- -----------------------------------------------
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id TEXT UNIQUE,
  event_slug TEXT NOT NULL REFERENCES events(slug),
  full_name TEXT NOT NULL,
  sliit_reg_number TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL CHECK (char_length(telephone) = 10 AND telephone ~ '^\d{10}$'),
  nic_number TEXT NOT NULL CHECK (char_length(nic_number) = 12 AND nic_number ~ '^\d{12}$'),
  faculty TEXT NOT NULL CHECK (faculty IN (
    'Faculty of Humanities and Science',
    'Faculty of Engineering',
    'Faculty of Computing',
    'Business School'
  )),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Same student can register for different events, but not twice for the same event
  CONSTRAINT unique_event_sliit_reg UNIQUE (event_slug, sliit_reg_number),
  CONSTRAINT unique_event_nic UNIQUE (event_slug, nic_number),
  CONSTRAINT unique_event_email UNIQUE (event_slug, email),
  CONSTRAINT unique_event_telephone UNIQUE (event_slug, telephone)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_reg_event_slug ON registrations (event_slug);
CREATE INDEX IF NOT EXISTS idx_reg_email ON registrations (email);
CREATE INDEX IF NOT EXISTS idx_reg_nic_number ON registrations (nic_number);
CREATE INDEX IF NOT EXISTS idx_reg_registration_id ON registrations (registration_id);
CREATE INDEX IF NOT EXISTS idx_reg_created_at ON registrations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reg_faculty ON registrations (faculty);

-- -----------------------------------------------
-- Trigger: auto-generate registration_id on insert
-- Uses the event's prefix from the events table
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION trg_registration_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  event_prefix_val CHAR(1);
BEGIN
  SELECT prefix INTO event_prefix_val
    FROM events
    WHERE slug = NEW.event_slug;

  IF event_prefix_val IS NULL THEN
    RAISE EXCEPTION 'Unknown event slug: %', NEW.event_slug;
  END IF;

  NEW.registration_id := generate_registration_id(event_prefix_val);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_registration_id ON registrations;
CREATE TRIGGER set_registration_id
  BEFORE INSERT ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION trg_registration_id();

-- -----------------------------------------------
-- Admin Users Table
-- (Linked to Supabase Auth — only admin users)
-- -----------------------------------------------
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------
-- Row Level Security (RLS)
-- -----------------------------------------------
ALTER TABLE registration_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ===== Events: public can read (to show event info) =====
CREATE POLICY "Allow public read on events"
  ON events FOR SELECT
  TO anon, authenticated
  USING (true);

-- ===== Registrations: anon can INSERT only =====
CREATE POLICY "Allow public insert on registrations"
  ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- ===== Registrations: authenticated admins can SELECT =====
CREATE POLICY "Admin select registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- ===== Registrations: authenticated admins can UPDATE =====
CREATE POLICY "Admin update registrations"
  ON registrations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- ===== Registrations: authenticated admins can DELETE =====
CREATE POLICY "Admin delete registrations"
  ON registrations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- ===== Registration counters: NO public access =====
-- Counters are only accessed via SECURITY DEFINER functions.
-- No RLS policies for anon = no access.

-- ===== Admin users: admins can read their own record =====
CREATE POLICY "Admin read own record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- -----------------------------------------------
-- SECURITY DEFINER RPC: submit_registration
-- Public-facing function for registration.
-- Validates input, inserts, returns ONLY the
-- registration_id. Never exposes other data.
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION submit_registration(
  p_event_slug TEXT,
  p_full_name TEXT,
  p_sliit_reg_number TEXT,
  p_email TEXT,
  p_telephone TEXT,
  p_nic_number TEXT,
  p_faculty TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event_status TEXT;
  v_reg_id TEXT;
  v_clean_email TEXT;
  v_clean_name TEXT;
  v_clean_sliit TEXT;
  v_clean_phone TEXT;
  v_clean_nic TEXT;
BEGIN
  -- Sanitize inputs
  v_clean_name := TRIM(p_full_name);
  v_clean_sliit := UPPER(TRIM(p_sliit_reg_number));
  v_clean_email := LOWER(TRIM(p_email));
  v_clean_phone := TRIM(p_telephone);
  v_clean_nic := TRIM(p_nic_number);

  -- Validate event exists and is open
  SELECT status INTO v_event_status
    FROM events
    WHERE slug = p_event_slug;

  IF v_event_status IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid event.');
  END IF;

  IF v_event_status != 'open' THEN
    RETURN json_build_object('success', false, 'error', 'Registration for this event is currently closed.');
  END IF;

  -- Validate required fields
  IF v_clean_name = '' OR char_length(v_clean_name) < 2 THEN
    RETURN json_build_object('success', false, 'error', 'Full name is required and must be at least 2 characters.');
  END IF;

  IF v_clean_sliit = '' THEN
    RETURN json_build_object('success', false, 'error', 'SLIIT Registration Number is required.');
  END IF;

  IF v_clean_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' THEN
    RETURN json_build_object('success', false, 'error', 'Please enter a valid email address.');
  END IF;

  IF v_clean_phone !~ '^\d{10}$' THEN
    RETURN json_build_object('success', false, 'error', 'Telephone must be exactly 10 digits.');
  END IF;

  IF v_clean_nic !~ '^\d{12}$' THEN
    RETURN json_build_object('success', false, 'error', 'NIC number must be exactly 12 digits.');
  END IF;

  IF p_faculty NOT IN (
    'Faculty of Humanities and Science',
    'Faculty of Engineering',
    'Faculty of Computing',
    'Business School'
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Invalid faculty selection.');
  END IF;

  -- PREEMPTIVE CHECKS FOR DUPLICATES
  IF EXISTS (
    SELECT 1 FROM registrations 
    WHERE event_slug = p_event_slug AND sliit_reg_number = v_clean_sliit
  ) THEN
    RETURN json_build_object('success', false, 'error', 'This SLIIT Registration Number is already registered.');
  END IF;

  IF EXISTS (
    SELECT 1 FROM registrations 
    WHERE event_slug = p_event_slug AND nic_number = v_clean_nic
  ) THEN
    RETURN json_build_object('success', false, 'error', 'This NIC Number is already registered.');
  END IF;

  IF EXISTS (
    SELECT 1 FROM registrations 
    WHERE event_slug = p_event_slug AND email = v_clean_email
  ) THEN
    RETURN json_build_object('success', false, 'error', 'This Email Address is already registered.');
  END IF;

  IF EXISTS (
    SELECT 1 FROM registrations 
    WHERE event_slug = p_event_slug AND telephone = v_clean_phone
  ) THEN
    RETURN json_build_object('success', false, 'error', 'This Phone Number is already registered.');
  END IF;

  -- Insert (trigger will generate registration_id)
  INSERT INTO registrations (
    event_slug, full_name, sliit_reg_number,
    email, telephone, nic_number, faculty
  ) VALUES (
    p_event_slug, v_clean_name, v_clean_sliit,
    v_clean_email, v_clean_phone, v_clean_nic, p_faculty
  )
  RETURNING registration_id INTO v_reg_id;

  RETURN json_build_object('success', true, 'registration_id', v_reg_id);

EXCEPTION
  WHEN unique_violation THEN
    -- Fallback race-condition handler
    IF SQLERRM LIKE '%sliit%' THEN
      RETURN json_build_object('success', false, 'error', 'This SLIIT Registration Number is already registered.');
    ELSIF SQLERRM LIKE '%nic%' THEN
      RETURN json_build_object('success', false, 'error', 'This NIC Number is already registered.');
    ELSIF SQLERRM LIKE '%email%' THEN
      RETURN json_build_object('success', false, 'error', 'This Email Address is already registered.');
    ELSIF SQLERRM LIKE '%telephone%' OR SQLERRM LIKE '%phone%' THEN
      RETURN json_build_object('success', false, 'error', 'This Phone Number is already registered.');
    ELSE
      RETURN json_build_object('success', false, 'error', 'You have already registered for this event.');
    END IF;
  WHEN check_violation THEN
    RETURN json_build_object('success', false, 'error', 'Please check your input values and try again.');
END;
$$;

-- Grant anon the ability to call the RPC
GRANT EXECUTE ON FUNCTION submit_registration TO anon;

-- -----------------------------------------------
-- Admin RPC: Get dashboard statistics
-- Only callable by authenticated admin users
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION admin_get_dashboard_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total INT;
  v_today INT;
  v_per_event JSON;
  v_per_faculty JSON;
BEGIN
  -- Check admin
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT COUNT(*) INTO v_total FROM registrations;

  SELECT COUNT(*) INTO v_today
    FROM registrations
    WHERE created_at >= CURRENT_DATE;

  SELECT json_agg(row_to_json(t)) INTO v_per_event
    FROM (
      SELECT e.slug, e.name, COALESCE(r.cnt, 0) AS count
      FROM events e
      LEFT JOIN (
        SELECT event_slug, COUNT(*) AS cnt
        FROM registrations GROUP BY event_slug
      ) r ON r.event_slug = e.slug
      ORDER BY e.slug
    ) t;

  SELECT json_agg(row_to_json(t)) INTO v_per_faculty
    FROM (
      SELECT faculty, COUNT(*) AS count
      FROM registrations
      GROUP BY faculty
      ORDER BY count DESC
    ) t;

  RETURN json_build_object(
    'total', v_total,
    'today', v_today,
    'per_event', COALESCE(v_per_event, '[]'::json),
    'per_faculty', COALESCE(v_per_faculty, '[]'::json)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION admin_get_dashboard_stats TO authenticated;

-- -----------------------------------------------
-- Admin RPC: Get registrations (paginated + search)
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION admin_get_registrations(
  p_event_slug TEXT DEFAULT NULL,
  p_search TEXT DEFAULT NULL,
  p_faculty TEXT DEFAULT NULL,
  p_limit INT DEFAULT 50,
  p_offset INT DEFAULT 0
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rows JSON;
  v_total INT;
BEGIN
  -- Check admin
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Count total matching
  SELECT COUNT(*) INTO v_total
  FROM registrations r
  WHERE (p_event_slug IS NULL OR r.event_slug = p_event_slug)
    AND (p_faculty IS NULL OR r.faculty = p_faculty)
    AND (p_search IS NULL OR (
      r.full_name ILIKE '%' || p_search || '%'
      OR r.email ILIKE '%' || p_search || '%'
      OR r.registration_id ILIKE '%' || p_search || '%'
      OR r.sliit_reg_number ILIKE '%' || p_search || '%'
      OR r.nic_number ILIKE '%' || p_search || '%'
    ));

  -- Fetch rows
  SELECT json_agg(row_to_json(t)) INTO v_rows
  FROM (
    SELECT
      r.id, r.registration_id, r.event_slug,
      e.name AS event_name,
      r.full_name, r.sliit_reg_number, r.email,
      r.telephone, r.nic_number, r.faculty,
      r.created_at
    FROM registrations r
    JOIN events e ON e.slug = r.event_slug
    WHERE (p_event_slug IS NULL OR r.event_slug = p_event_slug)
      AND (p_faculty IS NULL OR r.faculty = p_faculty)
      AND (p_search IS NULL OR (
        r.full_name ILIKE '%' || p_search || '%'
        OR r.email ILIKE '%' || p_search || '%'
        OR r.registration_id ILIKE '%' || p_search || '%'
        OR r.sliit_reg_number ILIKE '%' || p_search || '%'
        OR r.nic_number ILIKE '%' || p_search || '%'
      ))
    ORDER BY r.created_at DESC
    LIMIT p_limit OFFSET p_offset
  ) t;

  RETURN json_build_object(
    'total', v_total,
    'rows', COALESCE(v_rows, '[]'::json)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION admin_get_registrations TO authenticated;

-- -----------------------------------------------
-- Email Stub (Phase 4 placeholder)
-- Replace with Edge Function call when Resend is ready
-- -----------------------------------------------
-- CREATE OR REPLACE FUNCTION send_registration_email(...)
-- This is a placeholder. When you have a Resend API key:
-- 1. Create a Supabase Edge Function: supabase/functions/send-registration-email
-- 2. Store RESEND_API_KEY as a Supabase secret
-- 3. Call the Edge Function from submit_registration after insert
-- For now, email sending is not implemented.

-- =============================================
-- SETUP COMPLETE
-- =============================================
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Create an admin user in Supabase Auth (Dashboard > Authentication > Users)
-- 3. Insert the admin user's UUID into admin_users:
--    INSERT INTO admin_users (id, email, display_name)
--    VALUES ('YOUR-AUTH-USER-UUID', 'admin@example.com', 'Admin');
-- =============================================
