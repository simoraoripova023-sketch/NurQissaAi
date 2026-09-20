import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type FeedbackRow = {
  id?: string;
  type: 'taklif' | 'shikoyat' | 'savol';
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
  age?: number;
  theme?: string;
  cover_image_url?: string;
  pages?: any;
  created_at?: string;
};
