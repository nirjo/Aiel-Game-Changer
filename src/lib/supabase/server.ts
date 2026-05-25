import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function createClient() {
  const cookieStore = await cookies();

  if (!supabaseUrl || supabaseUrl === 'your_project_url' || !supabaseAnonKey || supabaseAnonKey === 'your_anon_key') {
    console.warn(
      '⚠️ Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    );
  }

  return createServerClient(
    supabaseUrl && supabaseUrl !== 'your_project_url' ? supabaseUrl : 'https://placeholder.supabase.co',
    supabaseAnonKey && supabaseAnonKey !== 'your_anon_key' ? supabaseAnonKey : 'placeholder-key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}

