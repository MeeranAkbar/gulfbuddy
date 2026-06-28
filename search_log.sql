-- Search analytics table
-- Tracks every search — so you know what people want
CREATE TABLE IF NOT EXISTS search_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  section TEXT DEFAULT 'all',
  emirate TEXT,
  results_count INT DEFAULT 0,
  searched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast querying
CREATE INDEX IF NOT EXISTS idx_search_query ON search_log(query);
CREATE INDEX IF NOT EXISTS idx_search_section ON search_log(section);

-- Enable RLS
ALTER TABLE search_log ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (anonymous search tracking)
CREATE POLICY "public_insert_search_log" ON search_log
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can read (you as admin)
CREATE POLICY "auth_read_search_log" ON search_log
  FOR SELECT USING (auth.uid() IS NOT NULL);
