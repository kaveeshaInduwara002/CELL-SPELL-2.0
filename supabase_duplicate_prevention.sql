-- =============================================
-- Cell Spell 2.0 — Duplicate Registration Prevention
-- Migration: Add composite unique constraints & helper RPC
-- =============================================

-- -----------------------------------------------
-- Step 1: Add new composite unique constraints to registrations
-- -----------------------------------------------

-- 1a. Clean duplicate SLIIT Registration Numbers (just in case they exist)
DELETE FROM registrations a USING registrations b
  WHERE a.id > b.id
    AND a.event_slug = b.event_slug
    AND a.sliit_reg_number = b.sliit_reg_number;

-- 1b. Clean duplicate Telephone Numbers
DELETE FROM registrations a USING registrations b
  WHERE a.id > b.id
    AND a.event_slug = b.event_slug
    AND a.telephone = b.telephone;

-- 1c. Clean duplicate Emails
DELETE FROM registrations a USING registrations b
  WHERE a.id > b.id
    AND a.event_slug = b.event_slug
    AND a.email = b.email;

-- 1d. Clean duplicate NICs
DELETE FROM registrations a USING registrations b
  WHERE a.id > b.id
    AND a.event_slug = b.event_slug
    AND a.nic_number = b.nic_number;

-- 2. Add the unique constraints
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS unique_event_sliit_reg;
ALTER TABLE registrations ADD CONSTRAINT unique_event_sliit_reg UNIQUE (event_slug, sliit_reg_number);

ALTER TABLE registrations DROP CONSTRAINT IF EXISTS unique_event_telephone;
ALTER TABLE registrations ADD CONSTRAINT unique_event_telephone UNIQUE (event_slug, telephone);

-- Recreate existing constraints with explicit names
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_event_slug_email_key;
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS unique_event_email;
ALTER TABLE registrations ADD CONSTRAINT unique_event_email UNIQUE (event_slug, email);

ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_event_slug_nic_number_key;
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS unique_event_nic;
ALTER TABLE registrations ADD CONSTRAINT unique_event_nic UNIQUE (event_slug, nic_number);


-- -----------------------------------------------
-- Step 2: Create check_registration_exists RPC
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION check_registration_exists(
  p_event_slug TEXT,
  p_field TEXT,
  p_value TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_field NOT IN ('sliit_reg_number', 'nic_number', 'email', 'telephone') THEN
    RAISE EXCEPTION 'Invalid field name: %', p_field;
  END IF;

  RETURN EXISTS (
    SELECT 1 
    FROM registrations
    WHERE event_slug = p_event_slug
      AND (
        (p_field = 'sliit_reg_number' AND UPPER(TRIM(sliit_reg_number)) = UPPER(TRIM(p_value))) OR
        (p_field = 'nic_number' AND TRIM(nic_number) = TRIM(p_value)) OR
        (p_field = 'email' AND LOWER(TRIM(email)) = LOWER(TRIM(p_value))) OR
        (p_field = 'telephone' AND TRIM(telephone) = TRIM(p_value))
      )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION check_registration_exists TO anon, authenticated;


-- -----------------------------------------------
-- Step 3: Update submit_registration RPC in the DB
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION submit_registration(
  p_event_slug TEXT,
  p_full_name TEXT,
  p_sliit_reg_number TEXT,
  p_email TEXT,
  p_telephone TEXT,
  p_nic_number TEXT,
  p_faculty TEXT,
  p_year_semester TEXT
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

  IF p_year_semester NOT IN (
    '1st Year 1st Semester',
    '1st Year 2nd Semester',
    '2nd Year 1st Semester',
    '2nd Year 2nd Semester',
    '3rd Year 1st Semester',
    '3rd Year 2nd Semester',
    '4th Year 1st Semester',
    '4th Year 2nd Semester'
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Invalid Year & Semester selection.');
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
    email, telephone, nic_number, faculty, year_semester
  ) VALUES (
    p_event_slug, v_clean_name, v_clean_sliit,
    v_clean_email, v_clean_phone, v_clean_nic, p_faculty, p_year_semester
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

GRANT EXECUTE ON FUNCTION submit_registration TO anon;
