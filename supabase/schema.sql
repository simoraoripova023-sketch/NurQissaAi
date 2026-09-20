-- NURQissa AI Supabase Database Schema
-- Run this SQL in Supabase SQL Editor in your Supabase Dashboard

-- 1. Feedbacks (Taklif va Shikoyatlar)
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) DEFAULT 'taklif',
  name VARCHAR(255),
  contact VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Stories (Generatsiya qilingan ertaklar)
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_uz TEXT NOT NULL,
  title_en TEXT,
  child_name VARCHAR(255),
  child_age INT,
  theme VARCHAR(255),
  cover_image_url TEXT,
  pages JSONB DEFAULT '[]'::jsonb,
  reflection JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Profiles (Foydalanuvchilar va bolalar profili)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  child_name VARCHAR(255) NOT NULL,
  stars_count INT DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  certificates JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Open insert policies for public client usage
CREATE POLICY "Allow public insert to feedbacks" ON feedbacks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on feedbacks" ON feedbacks FOR SELECT USING (true);

CREATE POLICY "Allow public insert to stories" ON stories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on stories" ON stories FOR SELECT USING (true);

CREATE POLICY "Allow public all on profiles" ON profiles FOR ALL USING (true);
