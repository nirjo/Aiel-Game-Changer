import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Supabase session refresh middleware.
 *
 * Runs on every non-static request. Key responsibilities:
 * 1. Refresh the Supabase access token when it nears expiry (via getUser).
 * 2. Redirect unauthenticated visitors away from /dashboard/* → /login.
 * 3. Redirect already-logged-in users away from /login and /register → /dashboard.
 *
 * IMPORTANT: Do NOT use supabase.auth.getSession() here — it reads from the
 * JWT without verifying with Supabase servers. Always use getUser() in middleware.
 */
export async function middleware(request: NextRequest) {
  // Start with a pass-through response; we'll mutate cookies onto it below.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write cookies to the request so downstream Server Components can read them.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Create a new response that carries the updated cookies to the browser.
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Calling getUser() refreshes the access token if needed and validates it
  // server-side. Must be called before any redirect logic.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // --- Protected routes ---
  if (!user && (pathname.startsWith('/dashboard') || pathname === '/complete-profile')) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // --- Already authenticated (redirect away from auth pages) ---
  // Note: /complete-profile is intentionally NOT included here — authenticated
  // users with incomplete profiles need to stay on that page.
  if (user && (pathname === '/login' || pathname === '/register')) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  // Return the response with refreshed session cookies attached.
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (Next.js static assets)
     * - _next/image   (Next.js image optimisation)
     * - favicon.ico
     * - /auth/callback  (must be excluded so Supabase redirect works before session exists)
     * - public files with extensions (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
