-- ============================================================
-- GULFBUDDY SERVICES COMMISSION SYSTEM
-- Run in Supabase SQL Editor
-- ============================================================

-- SERVICE JOBS (posted by clients)
CREATE TABLE IF NOT EXISTS service_jobs (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gb_ref        TEXT UNIQUE,
  client_name   TEXT NOT NULL,
  client_phone  TEXT NOT NULL,
  client_email  TEXT,
  category      TEXT NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  job_type      TEXT DEFAULT 'fixed',   -- fixed | hourly
  budget_min    DECIMAL,
  budget_max    DECIMAL,
  hourly_rate   DECIMAL,
  emirate       TEXT NOT NULL,
  area          TEXT,
  timing        TEXT,                   -- asap | this_week | flexible
  status        TEXT DEFAULT 'open',    -- open | assigned | in_progress | completed | cancelled | disputed
  assigned_to   UUID,                   -- provider id
  agreed_price  DECIMAL,
  escrow_held   DECIMAL DEFAULT 0,
  commission_pct DECIMAL DEFAULT 10,
  commission_amt DECIMAL DEFAULT 0,
  provider_payout DECIMAL DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid', -- unpaid | held | released | refunded
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICE BIDS (providers bid on jobs)
CREATE TABLE IF NOT EXISTS service_bids (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id        UUID REFERENCES service_jobs(id) ON DELETE CASCADE,
  provider_id   UUID REFERENCES services(id),
  provider_name TEXT NOT NULL,
  provider_phone TEXT NOT NULL,
  bid_amount    DECIMAL NOT NULL,
  message       TEXT,
  estimated_hrs DECIMAL,
  status        TEXT DEFAULT 'pending', -- pending | accepted | rejected | withdrawn
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- PROVIDER RATINGS (after job completion)
CREATE TABLE IF NOT EXISTS provider_ratings (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id        UUID REFERENCES service_jobs(id),
  provider_id   UUID REFERENCES services(id),
  client_rating INTEGER CHECK (client_rating BETWEEN 1 AND 5),
  client_review TEXT,
  provider_rating INTEGER CHECK (provider_rating BETWEEN 1 AND 5),
  provider_review TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- PROVIDER EARNINGS (running ledger)
CREATE TABLE IF NOT EXISTS provider_earnings (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id   UUID REFERENCES services(id),
  job_id        UUID REFERENCES service_jobs(id),
  gross_amount  DECIMAL NOT NULL,
  commission_pct DECIMAL NOT NULL,
  commission_amt DECIMAL NOT NULL,
  net_amount    DECIMAL NOT NULL,
  status        TEXT DEFAULT 'pending', -- pending | released | withdrawn
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Add commission tracking columns to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS completed_jobs INT DEFAULT 0;
ALTER TABLE services ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(2,1) DEFAULT 0;
ALTER TABLE services ADD COLUMN IF NOT EXISTS commission_tier TEXT DEFAULT 'new';
  -- new (10%) | verified (7%) | top_rated (5%)
ALTER TABLE services ADD COLUMN IF NOT EXISTS total_earned DECIMAL DEFAULT 0;
ALTER TABLE services ADD COLUMN IF NOT EXISTS active_bids INT DEFAULT 0;

-- Add gb_ref to service_jobs
CREATE TABLE IF NOT EXISTS sj_sequences (
  last_seq BIGINT DEFAULT 0
);
INSERT INTO sj_sequences (last_seq) VALUES (0) ON CONFLICT DO NOTHING;

-- Auto-assign GB ref for service jobs
CREATE OR REPLACE FUNCTION assign_service_job_ref()
RETURNS TRIGGER AS $$
DECLARE v_seq BIGINT;
BEGIN
  IF NEW.gb_ref IS NULL THEN
    UPDATE sj_sequences SET last_seq = last_seq + 1 RETURNING last_seq INTO v_seq;
    NEW.gb_ref := 'GB-SVC-' || LPAD(v_seq::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_service_job_ref ON service_jobs;
CREATE TRIGGER trg_service_job_ref
  BEFORE INSERT ON service_jobs
  FOR EACH ROW EXECUTE FUNCTION assign_service_job_ref();

-- Commission calculator function
CREATE OR REPLACE FUNCTION calc_commission(provider_uuid UUID, gross DECIMAL)
RETURNS TABLE(commission_pct DECIMAL, commission_amt DECIMAL, net_amt DECIMAL) AS $$
DECLARE v_tier TEXT; v_pct DECIMAL;
BEGIN
  SELECT commission_tier INTO v_tier FROM services WHERE id = provider_uuid;
  v_pct := CASE v_tier
    WHEN 'top_rated' THEN 5
    WHEN 'verified'  THEN 7
    ELSE 10
  END;
  RETURN QUERY SELECT v_pct, ROUND(gross * v_pct / 100, 2), ROUND(gross * (1 - v_pct/100), 2);
END;
$$ LANGUAGE plpgsql;

-- RLS
ALTER TABLE service_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_jobs"    ON service_jobs FOR SELECT USING (status != 'cancelled');
CREATE POLICY "public_insert_jobs"  ON service_jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_jobs"  ON service_jobs FOR UPDATE USING (true);
CREATE POLICY "public_read_bids"    ON service_bids FOR SELECT USING (true);
CREATE POLICY "public_insert_bids"  ON service_bids FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_bids"  ON service_bids FOR UPDATE USING (true);
CREATE POLICY "public_read_ratings" ON provider_ratings FOR SELECT USING (true);
CREATE POLICY "public_insert_ratings" ON provider_ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_earnings" ON provider_earnings FOR SELECT USING (true);
CREATE POLICY "public_insert_earnings" ON provider_earnings FOR INSERT WITH CHECK (true);

SELECT 'Services Commission System Ready ✅' as status;
