-- ============================================================
-- GULFBUDDY RLS FIX — Allow public posting (no login required)
-- Run this in Supabase SQL Editor
-- GulfHabibi Phase 1: Free to post without account
-- ============================================================

-- LISTINGS — allow public insert
DROP POLICY IF EXISTS "auth_insert_listings" ON listings;
DROP POLICY IF EXISTS "public_insert_listings" ON listings;
CREATE POLICY "public_insert_listings" ON listings FOR INSERT WITH CHECK (true);

-- JOBS — allow public insert
DROP POLICY IF EXISTS "auth_insert_jobs" ON jobs;
DROP POLICY IF EXISTS "public_insert_jobs" ON jobs;
CREATE POLICY "public_insert_jobs" ON jobs FOR INSERT WITH CHECK (true);

-- SERVICES — allow public insert
DROP POLICY IF EXISTS "auth_insert_services" ON services;
DROP POLICY IF EXISTS "public_insert_services" ON services;
CREATE POLICY "public_insert_services" ON services FOR INSERT WITH CHECK (true);

-- DIRECTORY — allow public insert
DROP POLICY IF EXISTS "auth_insert_directory" ON directory;
DROP POLICY IF EXISTS "public_insert_directory" ON directory;
CREATE POLICY "public_insert_directory" ON directory FOR INSERT WITH CHECK (true);

-- STORAGE — allow public image uploads
DROP POLICY IF EXISTS "auth_upload_images" ON storage.objects;
DROP POLICY IF EXISTS "public_upload_images" ON storage.objects;
CREATE POLICY "public_upload_images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('listings-images','directory-images'));

SELECT 'RLS updated — public posting enabled ✅' as status;
