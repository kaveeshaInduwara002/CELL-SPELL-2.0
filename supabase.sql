-- =============================================
-- Cell Spell 2.0 — Supabase Database Setup
-- =============================================
-- Run this SQL in your Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query)
-- =============================================

-- -----------------------------------------------
-- Registration Counter Table
-- (Tracks sequential IDs per event type)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS registration_counters (
  event_prefix TEXT PRIMARY KEY,       -- e.g. 'W' for Workshop, 'I' for Industry Visit
  current_count INT DEFAULT 0 NOT NULL
);

-- Seed the counters for each event type
INSERT INTO registration_counters (event_prefix, current_count) VALUES
  ('W', 0),
  ('I', 0),
  ('S', 0),
  ('C', 0)
ON CONFLICT (event_prefix) DO NOTHING;

-- -----------------------------------------------
-- Function: Generate sequential registration ID
-- Format: R + prefix + zero-padded 3-digit number
-- e.g. RW001, RI002, RS003
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION generate_registration_id(prefix TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_count INT;
BEGIN
  UPDATE registration_counters
    SET current_count = current_count + 1
    WHERE event_prefix = prefix
  RETURNING current_count INTO new_count;

  IF new_count IS NULL THEN
    -- Auto-create counter if it doesn't exist
    INSERT INTO registration_counters (event_prefix, current_count)
      VALUES (prefix, 1)
    ON CONFLICT (event_prefix) DO UPDATE SET current_count = registration_counters.current_count + 1
    RETURNING current_count INTO new_count;
  END IF;

  RETURN 'R' || prefix || LPAD(new_count::TEXT, 3, '0');
END;
$$;

-- -----------------------------------------------
-- Table: bioinformatics_workshop_registrations
-- (Workshop events — prefix 'W')
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS bioinformatics_workshop_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id TEXT UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL CHECK (char_length(telephone) = 10 AND telephone ~ '^\d{10}$'),
  nic_number TEXT NOT NULL CHECK (char_length(nic_number) = 12 AND nic_number ~ '^\d{12}$'),
  faculty TEXT NOT NULL CHECK (faculty IN (
    'Faculty of Humanities and Science',
    'Faculty of Engineering',
    'Faculty of Computing',
    'Business School'
  )),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Unique constraints
ALTER TABLE bioinformatics_workshop_registrations
  ADD CONSTRAINT uq_bw_nic_number UNIQUE (nic_number);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bw_email ON bioinformatics_workshop_registrations (email);
CREATE INDEX IF NOT EXISTS idx_bw_nic_number ON bioinformatics_workshop_registrations (nic_number);
CREATE INDEX IF NOT EXISTS idx_bw_registration_id ON bioinformatics_workshop_registrations (registration_id);
CREATE INDEX IF NOT EXISTS idx_bw_created_at ON bioinformatics_workshop_registrations (created_at DESC);

-- Trigger: auto-generate registration_id on insert
CREATE OR REPLACE FUNCTION trg_bw_registration_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.registration_id := generate_registration_id('W');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_bw_registration_id ON bioinformatics_workshop_registrations;
CREATE TRIGGER set_bw_registration_id
  BEFORE INSERT ON bioinformatics_workshop_registrations
  FOR EACH ROW
  EXECUTE FUNCTION trg_bw_registration_id();

-- -----------------------------------------------
-- Table: industry_visit_registrations
-- (Industry visit / Workshop 02 — prefix 'I')
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS industry_visit_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id TEXT UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL CHECK (char_length(telephone) = 10 AND telephone ~ '^\d{10}$'),
  nic_number TEXT NOT NULL CHECK (char_length(nic_number) = 12 AND nic_number ~ '^\d{12}$'),
  faculty TEXT NOT NULL CHECK (faculty IN (
    'Faculty of Humanities and Science',
    'Faculty of Engineering',
    'Faculty of Computing',
    'Business School'
  )),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Unique constraints
ALTER TABLE industry_visit_registrations
  ADD CONSTRAINT uq_iv_nic_number UNIQUE (nic_number);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_iv_email ON industry_visit_registrations (email);
CREATE INDEX IF NOT EXISTS idx_iv_nic_number ON industry_visit_registrations (nic_number);
CREATE INDEX IF NOT EXISTS idx_iv_registration_id ON industry_visit_registrations (registration_id);
CREATE INDEX IF NOT EXISTS idx_iv_created_at ON industry_visit_registrations (created_at DESC);

-- Trigger: auto-generate registration_id on insert
CREATE OR REPLACE FUNCTION trg_iv_registration_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.registration_id := generate_registration_id('I');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_iv_registration_id ON industry_visit_registrations;
CREATE TRIGGER set_iv_registration_id
  BEFORE INSERT ON industry_visit_registrations
  FOR EACH ROW
  EXECUTE FUNCTION trg_iv_registration_id();

-- -----------------------------------------------
-- Row Level Security (RLS)
-- -----------------------------------------------
ALTER TABLE registration_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE bioinformatics_workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_visit_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT (register)
CREATE POLICY "Allow public insert on bioinformatics_workshop_registrations"
  ON bioinformatics_workshop_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public insert on industry_visit_registrations"
  ON industry_visit_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow reading own registration (to get the generated registration_id back)
CREATE POLICY "Allow public select on bioinformatics_workshop_registrations"
  ON bioinformatics_workshop_registrations
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public select on industry_visit_registrations"
  ON industry_visit_registrations
  FOR SELECT
  TO anon
  USING (true);

-- Counter table: allow anon to update counters (needed for trigger)
CREATE POLICY "Allow trigger update on registration_counters"
  ON registration_counters
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
