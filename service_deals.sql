-- ============================================================
-- SERVICE DEALS TABLE
-- Provider posts a deal → client books it
-- Run in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS service_deals (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gb_ref          TEXT UNIQUE,

  -- Provider info
  provider_id     UUID REFERENCES services(id),
  provider_name   TEXT NOT NULL,
  provider_phone  TEXT NOT NULL,
  provider_tier   TEXT DEFAULT 'new', -- new | verified | top_rated
  provider_rating DECIMAL(2,1) DEFAULT 0,

  -- Deal info
  category        TEXT NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  price           DECIMAL NOT NULL,
  price_includes  TEXT, -- "Includes: filter clean, gas top-up, check"

  -- Availability
  slots_total     INT DEFAULT 1,
  slots_booked    INT DEFAULT 0,
  valid_from      DATE DEFAULT CURRENT_DATE,
  valid_until     DATE DEFAULT CURRENT_DATE,
  available_time  TEXT, -- "9am - 6pm", "Morning only"

  -- Location
  emirate         TEXT NOT NULL,
  areas_covered   TEXT[], -- ['Marina','JLT','JBR']

  -- Commission
  commission_pct  DECIMAL DEFAULT 10,
  commission_amt  DECIMAL DEFAULT 0,

  -- Status
  status          TEXT DEFAULT 'active', -- active | full | expired | paused | cancelled
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICE BOOKINGS
CREATE TABLE IF NOT EXISTS service_bookings (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id         UUID REFERENCES service_deals(id),
  gb_ref          TEXT UNIQUE,

  -- Client
  client_name     TEXT NOT NULL,
  client_phone    TEXT NOT NULL,
  client_area     TEXT,
  client_notes    TEXT,

  -- Payment
  amount_paid     DECIMAL NOT NULL,
  commission_pct  DECIMAL NOT NULL,
  commission_amt  DECIMAL NOT NULL,
  provider_payout DECIMAL NOT NULL,
  payment_status  TEXT DEFAULT 'unpaid', -- unpaid|held|released|refunded

  -- Job status
  status          TEXT DEFAULT 'confirmed', -- confirmed|in_progress|completed|cancelled|disputed
  confirmed_at    TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Auto ref for deals
CREATE OR REPLACE FUNCTION assign_deal_ref()
RETURNS TRIGGER AS $$
DECLARE v_seq BIGINT;
BEGIN
  IF NEW.gb_ref IS NULL THEN
    UPDATE gb_sequences SET last_seq=last_seq+1 WHERE category='services' RETURNING last_seq INTO v_seq;
    NEW.gb_ref := 'GB-DEAL-' || LPAD(v_seq::TEXT,6,'0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_deal_ref ON service_deals;
CREATE TRIGGER trg_deal_ref
  BEFORE INSERT ON service_deals
  FOR EACH ROW EXECUTE FUNCTION assign_deal_ref();

-- Auto-expire deals past valid_until date
CREATE OR REPLACE FUNCTION expire_old_deals()
RETURNS VOID AS $$
BEGIN
  UPDATE service_deals SET status='expired'
  WHERE valid_until < CURRENT_DATE AND status='active';
  UPDATE service_deals SET status='full'
  WHERE slots_booked >= slots_total AND status='active';
END;
$$ LANGUAGE plpgsql;

-- RLS
ALTER TABLE service_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_deals"    ON service_deals FOR SELECT USING (status='active');
CREATE POLICY "public_insert_deals"  ON service_deals FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_deals"  ON service_deals FOR UPDATE USING (true);
CREATE POLICY "public_insert_bookings" ON service_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_bookings"   ON service_bookings FOR SELECT USING (true);
CREATE POLICY "public_update_bookings" ON service_bookings FOR UPDATE USING (true);

-- Index
CREATE INDEX IF NOT EXISTS idx_deals_category ON service_deals(category);
CREATE INDEX IF NOT EXISTS idx_deals_emirate  ON service_deals(emirate);
CREATE INDEX IF NOT EXISTS idx_deals_status   ON service_deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_valid    ON service_deals(valid_until);

SELECT 'Service Deals System Ready ✅' as status;
