import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://byfftryvhlwgadouglgs.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_-xhoXYbs6UhO2HKfooWO9g_U7dOMNoB';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client for browser / client-side components
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Privileged admin client for server-side API routes (bypasses RLS when service role key is present)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey || supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export type FeedbackRow = {
  id?: string;
  type: 'taklif' | 'shikoyat' | 'savol' | 'order' | 'otp';
  name: string;
  contact: string;
  message: string;
  created_at?: string;
};

export type StoryRow = {
  id?: string;
  title_uz: string;
  title_en?: string;
  child_name?: string;
  child_age?: number;
  theme?: string;
  cover_image_url?: string;
  pages?: any;
  reflection?: any;
  quiz?: any;
  created_at?: string;
};

export type OrderRow = {
  id: string;
  plan_key: string;
  plan_name: string;
  amount: number;
  status: string;
  user_name?: string;
  user_phone?: string;
  click_trans_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type OtpRow = {
  phone: string;
  code: string;
  expires_at: number;
  created_at?: string;
};
