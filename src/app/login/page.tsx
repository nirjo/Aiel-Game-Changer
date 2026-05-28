'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/marketing/Button';

// ─────────────────────────────────────────────────────────────────────────────
// Inner component — uses useSearchParams so it MUST live inside a Suspense boundary.
// ─────────────────────────────────────────────────────────────────────────────
function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ?error= is appended by /auth/callback when Google OAuth fails
  const urlError = searchParams.get('error')
    ? decodeURIComponent(searchParams.get('error')!)
    : null;

  const [formError, setFormError] = React.useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [emailLoading, setEmailLoading] = React.useState(false);

  const supabase = createClient();
  const isAnyLoading = googleLoading || emailLoading;

  // ── Google OAuth ─────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setFormError(null);
    setGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // After Google completes, Supabase redirects here.
        // /auth/callback exchanges the code → session → /dashboard.
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          // Force account picker so drivers can switch Google accounts.
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      setFormError(error.message);
      setGoogleLoading(false);
    }
    // On success the browser navigates away; nothing more to do.
  };

  // ── Email / Password ─────────────────────────────────────────
  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setEmailLoading(true);

    const data = new FormData(e.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Refresh server components so the dashboard layout sees the new session.
      router.refresh();
      router.push('/dashboard');
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : 'Invalid email or password.'
      );
    } finally {
      setEmailLoading(false);
    }
  };

  // Combined error to show (URL error takes priority on first render)
  const displayError = formError ?? urlError;

  return (
    <div className="min-h-screen bg-[var(--color-off-white)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      {/* ── Branding ── */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Link href="/" aria-label="Go to homepage">
          <Image src="/logo.png" alt="The Game Changer" width={60} height={70} className="w-auto h-16 mb-4" />
        </Link>
        <h1 className="mt-2 text-center text-3xl font-bold uppercase tracking-wide text-gray-900">
          Driver Login
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your earning dashboard
        </p>
      </div>

      {/* ── Card ── */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-sm sm:px-10 border-t-4 border-[var(--color-primary-red)]">

          {/* Error banner */}
          {displayError && (
            <div role="alert" className="mb-6 bg-red-50 text-red-800 p-4 rounded-sm text-sm border border-red-200">
              {displayError}
            </div>
          )}

          {/* ── Google OAuth button ── */}
          <button
            id="google-signin-btn"
            type="button"
            onClick={handleGoogleLogin}
            disabled={isAnyLoading}
            aria-label="Sign in with Google"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-6 border border-gray-300 rounded-sm bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm font-bold text-gray-700 text-sm uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Redirecting to Google…
              </>
            ) : (
              <>
                {/* Official Google G */}
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>

          {/* ── Divider ── */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500 uppercase tracking-widest text-xs font-bold">
                or continue with email
              </span>
            </div>
          </div>

          {/* ── Email / Password form ── */}
          <form className="space-y-6" onSubmit={handleEmailSubmit} noValidate>
            <div>
              <label htmlFor="login-email" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isAnyLoading}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm sm:text-sm disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={isAnyLoading}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm sm:text-sm disabled:bg-gray-50"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[var(--color-primary-red)] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm font-bold text-[var(--color-primary-red)] hover:text-[var(--color-primary-red-dark)]"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={isAnyLoading}>
              {emailLoading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-bold text-[var(--color-primary-red)] hover:text-[var(--color-primary-red-dark)] uppercase tracking-wide"
              >
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page export — Suspense is required because LoginInner calls useSearchParams().
// ─────────────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--color-off-white)] flex items-center justify-center">
          <div className="text-center">
            <svg
              className="animate-spin h-8 w-8 text-[var(--color-primary-red)] mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Loading…</p>
          </div>
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
