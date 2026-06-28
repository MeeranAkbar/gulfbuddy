-- ============================================================
-- GULFHABIBI — AI AUDIT LOG TABLE
-- Run this in Supabase SQL Editor
-- Tracks every AI call for security monitoring
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_audit_log (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  feature         text NOT NULL DEFAULT 'general',
  input_length    integer DEFAULT 0,
  output_length   integer DEFAULT 0,
  ip_hash         text,
  model           text DEFAULT 'llama-3.3-70b-versatile',
  blocked         boolean DEFAULT false,
  risk_score      integer DEFAULT 0,
  created_at      timestamptz DEFAULT now()
);

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS idx_ai_audit_created ON ai_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_audit_feature ON ai_audit_log(feature);

-- RLS: Only service role can insert (Cloudflare Worker uses service key)
ALTER TABLE ai_audit_log ENABLE ROW LEVEL SECURITY;

-- No public read/write — only the worker (service role) can insert
CREATE POLICY "service_role_only" ON ai_audit_log
  USING (false)
  WITH CHECK (false);

-- ============================================================
-- SITE SETTINGS TABLE (if not already created)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  key   text PRIMARY KEY,
  value text NOT NULL DEFAULT ''
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed for section on/off checks)
CREATE POLICY "public_read_settings" ON site_settings
  FOR SELECT USING (true);

-- Only authenticated users with admin role can write
CREATE POLICY "admin_write_settings" ON site_settings
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
    OR (auth.jwt() -> 'app_metadata') ->> 'role' = 'admin'
  );
