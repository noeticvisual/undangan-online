-- Supabase SQL Migration untuk Tabel RSVP
-- Jalankan script ini di Supabase SQL Editor

-- 1. Create RSVP Table
CREATE TABLE IF NOT EXISTS rsvps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'declined', 'pending')),
  number_of_guests INTEGER DEFAULT 1,
  special_request TEXT,
  is_wish BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Index untuk performance
CREATE INDEX idx_rsvps_status ON rsvps(status);
CREATE INDEX idx_rsvps_created_at ON rsvps(created_at DESC);
CREATE INDEX idx_rsvps_name ON rsvps(name);
CREATE INDEX idx_rsvps_email ON rsvps(email);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- 4. Create policy untuk SELECT (public dapat membaca)
CREATE POLICY "Allow public read access" ON rsvps
  FOR SELECT USING (true);

-- 5. Create policy untuk INSERT (public dapat insert)
CREATE POLICY "Allow public insert" ON rsvps
  FOR INSERT WITH CHECK (true);

-- 6. Create policy untuk DELETE (hanya authenticated users)
CREATE POLICY "Allow authenticated delete" ON rsvps
  FOR DELETE USING (auth.role() = 'authenticated');

-- 7. Create policy untuk UPDATE (hanya authenticated users)
CREATE POLICY "Allow authenticated update" ON rsvps
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 8. Create Admin Users Table untuk authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Enable RLS untuk admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 10. Create policy untuk admin_users
CREATE POLICY "Allow read own admin record" ON admin_users
  FOR SELECT USING (auth.uid() = id);

-- Selesai! Tabel sudah siap digunakan.
