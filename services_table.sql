-- Services table (providers)
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  emirate TEXT,
  area TEXT,
  phone TEXT,
  description TEXT,
  tier TEXT DEFAULT 'free',
  rating DECIMAL(2,1) DEFAULT 4.5,
  review_count INT DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service requests table (client requests)
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  budget TEXT,
  timing TEXT,
  emirate TEXT NOT NULL,
  area TEXT,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Services: anyone can read
CREATE POLICY "public_read_services" ON services FOR SELECT USING (true);

-- Services: authenticated users can insert
CREATE POLICY "auth_insert_services" ON services FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Service requests: anyone can insert (client doesn't need account)
CREATE POLICY "public_insert_requests" ON service_requests FOR INSERT WITH CHECK (true);

-- Service requests: only authenticated can read
CREATE POLICY "auth_read_requests" ON service_requests FOR SELECT USING (auth.uid() IS NOT NULL);
