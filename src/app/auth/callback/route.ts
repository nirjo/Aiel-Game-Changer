import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * GET /auth/callback
 *
 * Supabase redirects here after Google OAuth completes.
 * We exchange the `code` query param for a session (stored in cookies),
 * check whether the user has a completed profile in the `users` table,
 * and redirect them accordingly:
 *   - Complete profile → /dashboard
 *   - Missing profile  → /complete-profile
 *
 * Required Supabase Dashboard config:
 *   Authentication → URL Configuration → Redirect URLs
 *   Add: http://localhost:3000/auth/callback  (dev)
 *        https://yourdomain.com/auth/callback  (prod)
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // `next` lets us deep-link after login (e.g. /auth/callback?next=/dashboard/profile)
  const next = searchParams.get('next') ?? '/dashboard';

  if (!code) {
    // No code — user landed here directly or OAuth was cancelled
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
            // setAll called from a Server Component context — safe to ignore.
          }
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession error:', error.message);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`
    );
  }

  // ── Check whether the user has a completed profile ──────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('id, whatsapp_number, vehicle_type')
      .eq('id', user.id)
      .single();

    // If no profile row exists OR key fields are missing, send to complete-profile
    if (!profile || !profile.whatsapp_number || !profile.vehicle_type) {
      return NextResponse.redirect(`${origin}/complete-profile`);
    }
  }

  // Session is now stored in cookies — redirect to dashboard (or custom `next`)
  return NextResponse.redirect(`${origin}${next}`);
}
