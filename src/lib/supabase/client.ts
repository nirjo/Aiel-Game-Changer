import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

export function createClient() {
  if (!supabaseUrl || supabaseUrl === 'your_project_url' || !supabaseAnonKey || supabaseAnonKey === 'your_anon_key') {
    console.warn(
      '⚠️ Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    );
  }

  return createBrowserClient(
    supabaseUrl && supabaseUrl !== 'your_project_url' ? supabaseUrl : 'https://placeholder.supabase.co',
    supabaseAnonKey && supabaseAnonKey !== 'your_anon_key' ? supabaseAnonKey : 'placeholder-key'
  );
}
