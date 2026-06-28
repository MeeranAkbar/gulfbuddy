-- ============================================================
-- GULFBUDDY SERVICE DEALS — SAFE VERSION
-- Run this COMPLETE file in Supabase SQL Editor
-- Paste ALL of it — do not run in parts
-- ============================================================

-- SERVICE DEALS TABLE
CREATE TABLE IF NOT EXISTS service_deals (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gb_ref          TEXT UNIQUE,
  provider_name   TEXT NOT NULL,
  provider_phone  TEXT NOT NULL,
  category        TEXT NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  what_included   TEXT,
  price           DECIMAL NOT NULL,
  original_price  DECIMAL,
  price_note      TEXT,
  deal_type       TEXT DEFAULT 'flash',
  slots_total     INT DEFAULT 3,
  slots_booked    INT DEFAULT 0,
  valid_until     TIMESTAMPTZ,
  emirate         TEXT NOT NULL,
  areas_covered   TEXT,
  status          TEXT DEFAULT 'active',
  share_count     INT DEFAULT 0,
  view_count      INT DEFAULT 0,
  commission_pct  DECIMAL DEFAULT 10,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICE BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS service_bookings (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gb_ref          TEXT UNIQUE,
  deal_id         UUID REFERENCES service_deals(id) ON DELETE CASCADE,
  client_name     TEXT NOT NULL,
  client_phone    TEXT NOT NULL,
  client_address  TEXT,
  preferred_date  TEXT,
  preferred_time  TEXT,
  notes           TEXT,
  amount_paid     DECIMAL,
  commission_pct  DECIMAL DEFAULT 10,
  commission_amt  DECIMAL DEFAULT 0,
  provider_payout DECIMAL DEFAULT 0,
  payment_status  TEXT DEFAULT 'pending',
  status          TEXT DEFAULT 'pending',
  confirmed_at    TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE service_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_deals" ON service_deals;
DROP POLICY IF EXISTS "public_insert_deals" ON service_deals;
DROP POLICY IF EXISTS "public_update_deals" ON service_deals;
DROP POLICY IF EXISTS "public_insert_bookings" ON service_bookings;
DROP POLICY IF EXISTS "public_read_bookings" ON service_bookings;
DROP POLICY IF EXISTS "public_update_bookings" ON service_bookings;

CREATE POLICY "public_read_deals"    ON service_deals FOR SELECT USING (true);
CREATE POLICY "public_insert_deals"  ON service_deals FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_deals"  ON service_deals FOR UPDATE USING (true);
CREATE POLICY "public_insert_bookings" ON service_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_bookings"   ON service_bookings FOR SELECT USING (true);
CREATE POLICY "public_update_bookings" ON service_bookings FOR UPDATE USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_deals_category ON service_deals(category);
CREATE INDEX IF NOT EXISTS idx_deals_emirate  ON service_deals(emirate);
CREATE INDEX IF NOT EXISTS idx_deals_status   ON service_deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_type     ON service_deals(deal_type);

-- Insert 3 sample deals so the page shows something immediately
INSERT INTO service_deals (provider_name, provider_phone, category, title, what_included, price, original_price, deal_type, slots_total, emirate, areas_covered, status)
VALUES
  ('Arctic Cool Services', '+971501234567', 'ac', 'AC Service + Gas Check — Summer Special', 'Gas top-up, filter clean, leak test, remote check', 149, 220, 'flash', 3, 'Dubai', 'Marina, JLT, JBR, Downtown', 'active'),
  ('CleanPro UAE', '+971502345678', 'cleaning', 'Full Apartment Deep Clean — 3BHK', 'Kitchen, bathrooms, bedrooms, living room, balcony', 199, 280, 'flash', 5, 'Dubai', 'Business Bay, DIFC, Downtown, Karama', 'active'),
  ('Fix It Fast', '+971503456789', 'handyman', 'Handyman Day Rate — 4 Hours Any Job', 'Any furniture assembly, wall mounting, small repairs', 180, 250, 'weekly', 10, 'Dubai', 'All Dubai Areas', 'active')
ON CONFLICT DO NOTHING;

SELECT 'Service Deals Ready ✅ — ' || COUNT(*)::TEXT || ' deals loaded' as status FROM service_deals;
