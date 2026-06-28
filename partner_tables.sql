-- GulfHabibi Partner & CRM Integration SQL
-- Run in Supabase SQL Editor

-- 1. Partner registrations table (from partners/index.html form)
CREATE TABLE IF NOT EXISTS partner_registrations (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_name      TEXT NOT NULL,
  agency_name     TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  crm_type        TEXT,
  listing_count   TEXT,
  emirates_covered JSONB DEFAULT '[]',
  notes           TEXT,
  status          TEXT DEFAULT 'pending',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add CRM sync columns to listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS external_id     TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS external_source TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS source          TEXT;

-- 3. Unique constraint so upsert works (no duplicates from same CRM)
CREATE UNIQUE INDEX IF NOT EXISTS listings_external_idx
  ON listings(external_id, external_source)
  WHERE external_id IS NOT NULL AND external_source IS NOT NULL;

-- 4. RLS for partner_registrations (only you can read, anyone can insert)
ALTER TABLE partner_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public insert" ON partner_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read"   ON partner_registrations FOR SELECT USING (auth.uid() = 'YOUR_ADMIN_USER_ID');

-- 5. Check what registered (run after agents register)
SELECT agency_name, crm_type, listing_count, emirates_covered, created_at
FROM partner_registrations
ORDER BY created_at DESC;
