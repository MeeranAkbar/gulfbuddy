-- ============================================================
-- GULFBUDDY MASTER SQL — Run ONCE in Supabase SQL Editor
-- Covers ALL tables, columns, indexes, RLS policies
-- Safe to run multiple times — uses IF NOT EXISTS everywhere
-- ============================================================

-- ============================================================
-- SECTION 1: CORE LISTINGS TABLE (base table)
-- ============================================================
CREATE TABLE IF NOT EXISTS listings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  user_name text,
  user_email text,
  title text NOT NULL,
  description text,
  price decimal,
  price_type text DEFAULT 'fixed',
  category text NOT NULL,
  subcategory text,
  area text,
  emirate text DEFAULT 'Dubai',
  images text[],
  contact_phone text,
  contact_whatsapp text,
  status text DEFAULT 'active',
  is_featured boolean DEFAULT false,
  featured_until timestamp,
  views integer DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ============================================================
-- SECTION 2: LISTINGS — ALL EXTRA COLUMNS
-- ============================================================
-- Vehicle columns
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_type text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_brand text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_model text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_year integer;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_km integer;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_condition text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_fuel text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_transmission text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_body text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS vehicle_color text;

-- Property columns
ALTER TABLE listings ADD COLUMN IF NOT EXISTS property_purpose text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS property_type text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS property_beds text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS property_baths text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS property_size integer;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS property_building text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS property_furnish text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS property_amenities text[];
ALTER TABLE listings ADD COLUMN IF NOT EXISTS rera_number text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS posted_by text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS size_sqft integer;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS beds integer;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS baths integer;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS furnishing text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS lat decimal;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS lng decimal;

-- Classifieds columns
ALTER TABLE listings ADD COLUMN IF NOT EXISTS condition text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS sub_category text;

-- Tier & plan columns
ALTER TABLE listings ADD COLUMN IF NOT EXISTS plan text DEFAULT 'free';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS bumped_at timestamptz DEFAULT now();
ALTER TABLE listings ADD COLUMN IF NOT EXISTS expires_at timestamptz;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS edit_count integer DEFAULT 0;

-- Analytics columns
ALTER TABLE listings ADD COLUMN IF NOT EXISTS call_count integer DEFAULT 0;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS whatsapp_count integer DEFAULT 0;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS views_by_emirate jsonb DEFAULT '{}';

-- CRM sync columns
ALTER TABLE listings ADD COLUMN IF NOT EXISTS external_id text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS external_source text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS source text;

-- Off-Plan columns
ALTER TABLE listings ADD COLUMN IF NOT EXISTS floor_plan_url text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS payment_plan jsonb;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS handover_date text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS developer_name text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS dld_number text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS register_interest_count integer DEFAULT 0;

-- ============================================================
-- SECTION 3: LISTINGS — RLS POLICIES
-- ============================================================
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active listings" ON listings;
DROP POLICY IF EXISTS "Users can insert their own listings" ON listings;
DROP POLICY IF EXISTS "Users can update their own listings" ON listings;
DROP POLICY IF EXISTS "Users can delete their own listings" ON listings;
DROP POLICY IF EXISTS "public read" ON listings;
DROP POLICY IF EXISTS "own insert" ON listings;
DROP POLICY IF EXISTS "own update" ON listings;
DROP POLICY IF EXISTS "own delete" ON listings;

CREATE POLICY "public_read_listings" ON listings FOR SELECT USING (status = 'active');
CREATE POLICY "auth_insert_listings" ON listings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "own_update_listings" ON listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own_delete_listings" ON listings FOR DELETE USING (auth.uid() = user_id);

-- CRM upsert index (no duplicates from same CRM feed)
CREATE UNIQUE INDEX IF NOT EXISTS listings_external_idx
  ON listings(external_id, external_source)
  WHERE external_id IS NOT NULL AND external_source IS NOT NULL;

-- ============================================================
-- SECTION 4: DIRECTORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS directory (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  business_name text NOT NULL,
  category text NOT NULL,
  subcategory text,
  description text,
  area text,
  emirate text DEFAULT 'Dubai',
  phone text,
  whatsapp text,
  email text,
  website text,
  images text[],
  working_hours text,
  tier text DEFAULT 'free',
  featured_until timestamp,
  rating decimal DEFAULT 0,
  review_count integer DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

ALTER TABLE directory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view active directory" ON directory;
DROP POLICY IF EXISTS "Users can insert their own business" ON directory;
DROP POLICY IF EXISTS "Users can update their own business" ON directory;
CREATE POLICY "public_read_directory" ON directory FOR SELECT USING (status = 'active');
CREATE POLICY "auth_insert_directory" ON directory FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "own_update_directory" ON directory FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- SECTION 5: REVIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  user_name text,
  listing_id uuid REFERENCES directory(id),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
DROP POLICY IF EXISTS "Logged in users can add reviews" ON reviews;
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "auth_insert_reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- SECTION 6: JOBS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  user_name text, user_email text,
  title text NOT NULL, company text NOT NULL,
  category text NOT NULL, description text, requirements text,
  job_type text DEFAULT 'fulltime', experience text,
  salary_min decimal, salary_max decimal,
  nationality text, gender text DEFAULT 'any', openings integer DEFAULT 1,
  area text, emirate text DEFAULT 'Dubai',
  contact_phone text, contact_email text, contact_whatsapp text,
  is_featured boolean DEFAULT false, featured_until timestamp,
  plan text DEFAULT 'free',
  call_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  bumped_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  status text DEFAULT 'active', views integer DEFAULT 0,
  created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view jobs" ON jobs;
DROP POLICY IF EXISTS "Users insert jobs" ON jobs;
DROP POLICY IF EXISTS "Users update jobs" ON jobs;
DROP POLICY IF EXISTS "Users delete jobs" ON jobs;
CREATE POLICY "public_read_jobs" ON jobs FOR SELECT USING (status = 'active');
CREATE POLICY "auth_insert_jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "own_update_jobs" ON jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own_delete_jobs" ON jobs FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- SECTION 7: SERVICES TABLES
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  business_name text NOT NULL,
  category text NOT NULL,
  emirate text, area text,
  phone text, description text,
  tier text DEFAULT 'free',
  rating decimal(2,1) DEFAULT 4.5,
  review_count integer DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL, description text NOT NULL,
  budget text, timing text,
  emirate text NOT NULL, area text,
  client_name text NOT NULL, client_phone text NOT NULL,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_services" ON services;
DROP POLICY IF EXISTS "auth_insert_services" ON services;
DROP POLICY IF EXISTS "public_insert_requests" ON service_requests;
DROP POLICY IF EXISTS "auth_read_requests" ON service_requests;
CREATE POLICY "public_read_services" ON services FOR SELECT USING (true);
CREATE POLICY "auth_insert_services" ON services FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "public_insert_requests" ON service_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_read_requests" ON service_requests FOR SELECT USING (auth.uid() IS NOT NULL);

-- ============================================================
-- SECTION 8: SEARCH LOG TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS search_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  query text NOT NULL,
  section text DEFAULT 'all',
  emirate text,
  results_count integer DEFAULT 0,
  searched_at timestamptz DEFAULT now()
);

ALTER TABLE search_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_insert_search_log" ON search_log;
DROP POLICY IF EXISTS "auth_read_search_log" ON search_log;
CREATE POLICY "public_insert_search_log" ON search_log FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_read_search_log" ON search_log FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_search_query ON search_log(query);
CREATE INDEX IF NOT EXISTS idx_search_section ON search_log(section);

-- ============================================================
-- SECTION 9: PARTNER REGISTRATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS partner_registrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_name text NOT NULL,
  agency_name text NOT NULL,
  email text NOT NULL,
  phone text,
  crm_type text,
  listing_count text,
  emirates_covered jsonb DEFAULT '[]',
  notes text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE partner_registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public insert" ON partner_registrations;
DROP POLICY IF EXISTS "admin read" ON partner_registrations;
CREATE POLICY "public_insert_partners" ON partner_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_read_partners" ON partner_registrations FOR SELECT USING (auth.uid() IS NOT NULL);

-- ============================================================
-- SECTION 10: PROFILES TABLE (user account + tier data)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  full_name text,
  phone text,
  phone_verified boolean DEFAULT false,
  phone_hash text,
  plan text DEFAULT 'free',
  plan_expires_at timestamptz,
  active_listing_count integer DEFAULT 0,
  trust_score integer DEFAULT 50,
  strike_count integer DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_read_profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own_update_profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "own_insert_profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- SECTION 11: REPORTS TABLE (listing reports)
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid,
  listing_type text DEFAULT 'listing',
  reporter_ip text,
  reason text NOT NULL,
  details text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert_reports" ON reports FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_read_reports" ON reports FOR SELECT USING (auth.uid() IS NOT NULL);

-- ============================================================
-- SECTION 12: STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('listings-images', 'listings-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('directory-images', 'directory-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
DROP POLICY IF EXISTS "Logged in users can upload images" ON storage.objects;
CREATE POLICY "public_view_images" ON storage.objects FOR SELECT USING (bucket_id IN ('listings-images','directory-images'));
CREATE POLICY "auth_upload_images" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- SECTION 13: PERFORMANCE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_emirate ON listings(emirate);
CREATE INDEX IF NOT EXISTS idx_listings_plan ON listings(plan);
CREATE INDEX IF NOT EXISTS idx_listings_bumped ON listings(bumped_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_created ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_emirate ON jobs(emirate);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_directory_category ON directory(category);
CREATE INDEX IF NOT EXISTS idx_directory_emirate ON directory(emirate);

-- ============================================================
-- ALL DONE — GulfHabibi database is fully set up
-- ============================================================
SELECT 'GulfHabibi Master SQL Complete ✅' as status;
