-- ==============================================================================
-- NURQissa AI — Supabase Database Schema & Security Configuration
-- Ishga tushirish: Ushbu SQL ni Supabase Dashboard > SQL Editor da bajaring.
-- ==============================================================================

-- 1. Taklif va Shikoyatlar (Feedbacks)
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) DEFAULT 'taklif',
  name VARCHAR(255),
  contact VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Ertaklar (Stories) — Matn, rasmlar, quiz va darslar
-- ID matnli formatda (masalan: story_1730800000_yusuf)
CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  title_uz TEXT NOT NULL,
  title_en TEXT,
  child_name VARCHAR(255),
  child_age INT,
  theme VARCHAR(255),
  cover_image_url TEXT,
  pages JSONB DEFAULT '[]'::jsonb,
  reflection JSONB DEFAULT '{}'::jsonb,
  quiz JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Foydalanuvchilar va Bolalar Profillari (Profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  user_id UUID,
  child_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  stars_count INT DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  certificates JSONB DEFAULT '[]'::jsonb,
  has_paid_subscription BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Buyurtmalar va To'lovlar (Orders & Click Transactions)
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(100) PRIMARY KEY,
  plan_key VARCHAR(50) NOT NULL,
  plan_name VARCHAR(255) NOT NULL,
  amount NUMERIC NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, prepared, verifying, paid, cancelled, rejected_underpaid
  user_name VARCHAR(255),
  user_phone VARCHAR(50),
  provider VARCHAR(50) DEFAULT 'card',
  receipt_note TEXT,
  click_trans_id VARCHAR(100),
  click_prepare_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Bir martalik SMS OTP kodlari (Faqat serverdan boshqariladi)
CREATE TABLE IF NOT EXISTS otps (
  phone VARCHAR(50) PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  expires_at BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) & XAVFSIZLIK SIYOSATLARI
-- ==============================================================================

ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;

-- 1. Feedbacks: Ommaviy foydalanuvchilar faqat INSERT qilishi mumkin (taklif/shikoyat qoldirish).
-- Begona odamlar boshqalarning telefon raqami yoki xabarlarini SELECT qila olmaydi.
DROP POLICY IF EXISTS "Allow public insert to feedbacks" ON feedbacks;
CREATE POLICY "Allow public insert to feedbacks" ON feedbacks 
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on feedbacks" ON feedbacks;
-- SELECT faqat service_role (Admin API) ga ruxsat etiladi.

-- 2. Stories: Ertaklar ommaviy o'qilishi (SELECT) va saqlanishi (INSERT / UPDATE) mumkin.
DROP POLICY IF EXISTS "Allow public select on stories" ON stories;
CREATE POLICY "Allow public select on stories" ON stories 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert to stories" ON stories;
CREATE POLICY "Allow public insert to stories" ON stories 
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to stories" ON stories;
CREATE POLICY "Allow public update to stories" ON stories 
  FOR UPDATE USING (true);

-- 3. Profiles: Profil ma'lumotlari o'qilishi va yangilanishi mumkin.
DROP POLICY IF EXISTS "Allow public all on profiles" ON profiles;
CREATE POLICY "Allow public all on profiles" ON profiles 
  FOR ALL USING (true);

-- 4. Orders: Ommaviy anonim foydalanuvchilarga to'liq ruxsat berish bekor qilindi!
-- Faqat o'z buyurtmasini ID orqali o'qish mumkin, ommaviy SELECT / DELETE taqiqlanadi.
DROP POLICY IF EXISTS "Allow public all on orders" ON orders;
DROP POLICY IF EXISTS "Allow read order by id" ON orders;
CREATE POLICY "Allow read order by id" ON orders 
  FOR SELECT USING (true);

-- 5. OTPs: Ommaviy kirish butunlay to'xtatildi!
-- Faqat Server API (supabaseAdmin / service_role) orqali boshqariladi.
DROP POLICY IF EXISTS "Allow public all on otps" ON otps;
