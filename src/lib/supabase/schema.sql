-- =============================================================
-- The Game Changer — Supabase Schema
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- =============================================================

-- 1. User Profiles (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  driving_license BOOLEAN DEFAULT false,
  pincode TEXT,
  vehicle_type TEXT CHECK (vehicle_type IN ('bike', 'scooter')),
  avg_km_per_day TEXT CHECK (avg_km_per_day IN ('40-70', '70-100', '100-120')),
  profession TEXT,
  age INTEGER,
  email TEXT,
  pan_card TEXT,
  aadhar_card TEXT,
  address TEXT,
  sponsor_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Contact Form Submissions (public website)
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied'))
);

-- 3. Portfolio Projects
CREATE TABLE public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  client TEXT,
  category TEXT CHECK (category IN ('branding', 'digital', 'social-media', 'video', 'campaign', 'packaging')),
  description TEXT,
  image_url TEXT,
  live_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Testimonials
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  company TEXT,
  quote TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Bank Details
CREATE TABLE public.bank_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  account_holder TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  branch TEXT NOT NULL,
  account_number TEXT NOT NULL,
  document_url TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Daily Proof Submissions
CREATE TABLE public.proof_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  previous_reading NUMERIC NOT NULL,
  current_reading NUMERIC NOT NULL,
  difference_km NUMERIC GENERATED ALWAYS AS (current_reading - previous_reading) STORED,
  accountable_km NUMERIC,
  km_carried_forward NUMERIC DEFAULT 0,
  photo_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Income Records
CREATE TABLE public.income_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('referral', 'driven')),
  amount NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Withdrawals
CREATE TABLE public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  gross_amount NUMERIC NOT NULL,
  charge NUMERIC DEFAULT 0,
  net_amount NUMERIC GENERATED ALWAYS AS (gross_amount - charge) STORED,
  order_id TEXT,
  bank_details_id UUID REFERENCES public.bank_details(id),
  date DATE DEFAULT CURRENT_DATE,
  remark TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Campaign Partners
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  partner_name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Support Tickets
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================
-- Row Level Security Policies
-- =============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proof_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Anyone can submit contact form
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- Portfolio and testimonials are publicly readable
CREATE POLICY "Public can view projects" ON public.portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT USING (true);

-- Users can manage their own bank details
CREATE POLICY "Users manage own bank details" ON public.bank_details FOR ALL USING (auth.uid() = user_id);

-- Users can manage their own proof submissions
CREATE POLICY "Users manage own proofs" ON public.proof_submissions FOR ALL USING (auth.uid() = user_id);

-- Users can view their own income records
CREATE POLICY "Users view own income" ON public.income_records FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own withdrawals
CREATE POLICY "Users view own withdrawals" ON public.withdrawals FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own campaigns
CREATE POLICY "Users view own campaigns" ON public.campaigns FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own tickets
CREATE POLICY "Users manage own tickets" ON public.support_tickets FOR ALL USING (auth.uid() = user_id);
