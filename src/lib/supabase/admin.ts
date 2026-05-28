import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

// Admin client that bypasses RLS — ONLY use server-side (API routes, server actions)
// We provide placeholder values to prevent crashes if the key isn't set, but operations will fail.
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseServiceKey && supabaseServiceKey !== 'your_copied_service_role_key_here' 
    ? supabaseServiceKey 
    : 'placeholder-key'
);
