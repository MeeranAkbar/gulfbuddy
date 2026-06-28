
-- ============================================================
-- FUNCTION: generate_gb_ref(category, emirate)
-- Returns next GulfHabibi reference number
-- ============================================================
CREATE OR REPLACE FUNCTION generate_gb_ref(p_category TEXT, p_emirate TEXT)
RETURNS TEXT AS $$
DECLARE
  v_seq     BIGINT;
  v_cat     TEXT;
  v_em      TEXT;
  v_ref     TEXT;
BEGIN
  -- Category code
  v_cat := CASE p_category
    WHEN 'property'    THEN 'PROP'
    WHEN 'motors'      THEN 'MOT'
    WHEN 'jobs'        THEN 'JOB'
    WHEN 'marketplace' THEN 'MKT'
    WHEN 'services'    THEN 'SVC'
    WHEN 'directory'   THEN 'DIR'
    ELSE 'GEN'
  END;

  -- Emirate code
  v_em := CASE p_emirate
    WHEN 'Dubai'       THEN 'DXB'
    WHEN 'Abu Dhabi'   THEN 'AUH'
    WHEN 'Sharjah'     THEN 'SHJ'
    WHEN 'Ajman'       THEN 'AJM'
    WHEN 'RAK'         THEN 'RAK'
    WHEN 'Fujairah'    THEN 'FUJ'
    WHEN 'UAQ'         THEN 'UAQ'
    ELSE 'UAE'
  END;

  -- Increment sequence atomically
  UPDATE gb_sequences
  SET last_seq = last_seq + 1
  WHERE category = p_category
  RETURNING last_seq INTO v_seq;

  -- Build ref: GB-PROP-DXB-001234
  v_ref := 'GB-' || v_cat || '-' || v_em || '-' || LPAD(v_seq::TEXT, 6, '0');

  RETURN v_ref;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION generate_gb_ref(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION generate_gb_ref(TEXT, TEXT) TO authenticated;

-- ============================================================
-- TRIGGER: auto-assign gb_ref on listing insert
-- ============================================================
CREATE OR REPLACE FUNCTION assign_gb_ref()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.gb_ref IS NULL THEN
    NEW.gb_ref := generate_gb_ref(NEW.category, NEW.emirate);
    NEW.gb_seq := (
      SELECT last_seq FROM gb_sequences WHERE category = NEW.category
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_assign_gb_ref ON listings;
CREATE TRIGGER trg_assign_gb_ref
  BEFORE INSERT ON listings
  FOR EACH ROW EXECUTE FUNCTION assign_gb_ref();

-- Same trigger for jobs table
DROP TRIGGER IF EXISTS trg_assign_gb_ref_jobs ON jobs;
CREATE TRIGGER trg_assign_gb_ref_jobs
  BEFORE INSERT ON jobs
  FOR EACH ROW EXECUTE FUNCTION assign_gb_ref_jobs();

CREATE OR REPLACE FUNCTION assign_gb_ref_jobs()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.gb_ref IS NULL THEN
    NEW.gb_ref := generate_gb_ref('jobs', NEW.emirate);
    NEW.gb_seq := (
      SELECT last_seq FROM gb_sequences WHERE category = 'jobs'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate jobs trigger with correct function
DROP TRIGGER IF EXISTS trg_assign_gb_ref_jobs ON jobs;
CREATE TRIGGER trg_assign_gb_ref_jobs
  BEFORE INSERT ON jobs
  FOR EACH ROW EXECUTE FUNCTION assign_gb_ref_jobs();

SELECT 'GulfHabibi Ref System Ready' as status;
