-- ============================================================
-- GULFBUDDY — COMPLETE SERVICES SQL
-- Run this ENTIRE file in Supabase SQL Editor at once
-- Copy ALL lines — do not skip any section
-- ============================================================

-- 1. CREATE SERVICE DEALS TABLE
CREATE TABLE IF NOT EXISTS service_deals (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gb_ref          TEXT,
  provider_name   TEXT NOT NULL DEFAULT 'Provider',
  provider_phone  TEXT NOT NULL DEFAULT '0000000000',
  category        TEXT NOT NULL DEFAULT 'other',
  title           TEXT NOT NULL DEFAULT 'Service Deal',
  description     TEXT,
  what_included   TEXT,
  price           DECIMAL NOT NULL DEFAULT 0,
  original_price  DECIMAL,
  price_note      TEXT,
  deal_type       TEXT DEFAULT 'flash',
  slots_total     INT DEFAULT 3,
  slots_booked    INT DEFAULT 0,
  valid_until     TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  emirate         TEXT NOT NULL DEFAULT 'Dubai',
  areas_covered   TEXT,
  status          TEXT DEFAULT 'active',
  share_count     INT DEFAULT 0,
  view_count      INT DEFAULT 0,
  commission_pct  DECIMAL DEFAULT 10,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE SERVICE BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS service_bookings (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gb_ref          TEXT,
  deal_id         UUID REFERENCES service_deals(id) ON DELETE CASCADE,
  client_name     TEXT NOT NULL DEFAULT 'Client',
  client_phone    TEXT NOT NULL DEFAULT '0000000000',
  client_address  TEXT,
  preferred_date  TEXT,
  preferred_time  TEXT,
  notes           TEXT,
  amount_paid     DECIMAL DEFAULT 0,
  commission_pct  DECIMAL DEFAULT 10,
  commission_amt  DECIMAL DEFAULT 0,
  provider_payout DECIMAL DEFAULT 0,
  payment_status  TEXT DEFAULT 'pending',
  status          TEXT DEFAULT 'pending',
  confirmed_at    TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENABLE RLS
ALTER TABLE service_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bookings ENABLE ROW LEVEL SECURITY;

-- 4. DROP OLD POLICIES IF EXIST
DROP POLICY IF EXISTS "public_read_deals" ON service_deals;
DROP POLICY IF EXISTS "public_insert_deals" ON service_deals;
DROP POLICY IF EXISTS "public_update_deals" ON service_deals;
DROP POLICY IF EXISTS "public_read_bookings" ON service_bookings;
DROP POLICY IF EXISTS "public_insert_bookings" ON service_bookings;
DROP POLICY IF EXISTS "public_update_bookings" ON service_bookings;

-- 5. CREATE OPEN RLS POLICIES
CREATE POLICY "public_read_deals"      ON service_deals FOR SELECT USING (true);
CREATE POLICY "public_insert_deals"    ON service_deals FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_deals"    ON service_deals FOR UPDATE USING (true);
CREATE POLICY "public_read_bookings"   ON service_bookings FOR SELECT USING (true);
CREATE POLICY "public_insert_bookings" ON service_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_bookings" ON service_bookings FOR UPDATE USING (true);

-- 6. INDEXES
CREATE INDEX IF NOT EXISTS idx_deals_category ON service_deals(category);
CREATE INDEX IF NOT EXISTS idx_deals_emirate  ON service_deals(emirate);
CREATE INDEX IF NOT EXISTS idx_deals_status   ON service_deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_type     ON service_deals(deal_type);

-- 7. INSERT 3 SAMPLE DEALS (safe — skips if already exist)
INSERT INTO service_deals
  (provider_name, provider_phone, category, title, what_included, price, original_price, deal_type, slots_total, slots_booked, emirate, areas_covered, status, valid_until)
VALUES
  ('Arctic Cool AC Services', '+971501234567', 'ac',
   'AC Full Service + Gas Top-Up — Summer Special',
   'Gas recharge, filter clean, leak test, remote check, drain flush',
   149, 220, 'flash', 4, 0, 'Dubai', 'Marina, JLT, JBR, Downtown, Business Bay',
   'active', NOW() + INTERVAL '24 hours'),

  ('CleanPro UAE', '+971502345678', 'cleaning',
   'Deep Clean Full Apartment — 2BHK or 3BHK',
   'Kitchen deep clean, 2-3 bathrooms, all bedrooms, living room, balcony',
   199, 280, 'flash', 6, 1, 'Dubai', 'Business Bay, DIFC, Downtown, JBR, Karama',
   'active', NOW() + INTERVAL '24 hours'),

  ('Fix It Fast Handyman', '+971503456789', 'handyman',
   'Handyman Package — 4 Hours Any Job',
   'Furniture assembly, TV mounting, shelf fitting, minor repairs — any 4 tasks',
   180, 250, 'weekly', 10, 2, 'Dubai', 'All Dubai Areas',
   'active', NOW() + INTERVAL '7 days'),

  ('CleanHome Sharjah', '+971504567890', 'cleaning',
   'Villa Deep Clean — 4BHK Full Service',
   'Full villa clean including garden, pool area, all rooms and bathrooms',
   350, 500, 'weekly', 3, 0, 'Sharjah', 'Al Nahda, Al Majaz, Al Qasba, University City',
   'active', NOW() + INTERVAL '7 days'),

  ('ProPlumb UAE', '+971505678901', 'plumbing',
   'Plumbing Checkup + Fix — Any 2 Issues',
   'Leak fix, tap replacement, pipe inspection, water pressure check',
   120, 180, 'standard', 8, 0, 'Dubai', 'All Dubai Areas',
   'active', NOW() + INTERVAL '30 days')
ON CONFLICT DO NOTHING;

-- 8. VERIFY
SELECT
  'Tables created ✅' as step1,
  (SELECT COUNT(*) FROM service_deals) as deals_count,
  (SELECT COUNT(*) FROM service_bookings) as bookings_count;
