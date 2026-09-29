-- ============================================================
-- Supabase Schema for Niskala Wedding Invitation
-- Run this in your Supabase Project: SQL Editor -> New Query -> Run
-- ============================================================

-- 1. Create table for Wedding Configuration (Customizable Invitation Data)
CREATE TABLE IF NOT EXISTS public.wedding_configs (
  id TEXT PRIMARY KEY DEFAULT 'default',
  config_data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create table for Client Guest List (Daftar Tamu Undangan oleh Klien)
CREATE TABLE IF NOT EXISTS public.wedding_guests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  category TEXT DEFAULT 'Umum',
  notes TEXT DEFAULT '',
  custom_slug TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create table for RSVP submissions & Wishing Board (Buku Tamu & Kehadiran)
CREATE TABLE IF NOT EXISTS public.wedding_rsvps (
  id TEXT PRIMARY KEY,
  guest_name TEXT NOT NULL,
  attendance TEXT NOT NULL,
  guest_count INTEGER DEFAULT 1,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.wedding_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_rsvps ENABLE ROW LEVEL SECURITY;

-- 5. Policies for Public Read & Write (Anon key allows public wedding guests & client)
DROP POLICY IF EXISTS "Public can view wedding config" ON public.wedding_configs;
CREATE POLICY "Public can view wedding config" ON public.wedding_configs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can update wedding config" ON public.wedding_configs;
CREATE POLICY "Public can update wedding config" ON public.wedding_configs FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can manage guests" ON public.wedding_guests;
CREATE POLICY "Public can manage guests" ON public.wedding_guests FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can view rsvps" ON public.wedding_rsvps;
CREATE POLICY "Public can view rsvps" ON public.wedding_rsvps FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert rsvps" ON public.wedding_rsvps;
CREATE POLICY "Public can insert rsvps" ON public.wedding_rsvps FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete rsvps" ON public.wedding_rsvps;
CREATE POLICY "Public can delete rsvps" ON public.wedding_rsvps FOR DELETE USING (true);

-- Enable real-time for rsvps and guests (optional in Supabase UI)
ALTER PUBLICATION supabase_realtime ADD TABLE public.wedding_rsvps;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wedding_guests;
