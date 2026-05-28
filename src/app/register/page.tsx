'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/marketing/Button';

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const supabase = createClient();
  const isAnyLoading = loading || googleLoading;

  // ── Google OAuth ─────────────────────────────────────────────
  const handleGoogleSignup = async () => {
    setError(null);
    setGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
    // On success the browser navigates away; nothing more to do.
  };

  // ── Email / Password Registration ───────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const fullName = formData.get('fullName') as string;
    const whatsapp = formData.get('whatsapp') as string;
    const license = formData.get('license') === 'yes';
    const pincode = formData.get('pincode') as string;
    const vehicleType = formData.get('vehicleType') as string;
    const avgKm = formData.get('avgKm') as string;

    // Client-side validation
    if (!formData.get('declaration')) {
      setError('You must accept the declaration to register.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Create profile via server-side API (bypasses RLS)
      if (authData.user) {
        const profileRes = await fetch('/api/register-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: authData.user.id,
            fullName,
            email,
            whatsapp,
            license,
            pincode,
            vehicleType,
            avgKm,
          }),
        });

        if (!profileRes.ok) {
          try {
            const { error: profileError } = await profileRes.json();
            console.error('Profile creation error, but auth succeeded:', profileError);
          } catch {
            const errorText = await profileRes.text();
            console.error('Profile creation API failed with non-JSON response:', errorText);
          }
        }
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-off-white)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Link href="/" aria-label="Go to homepage">
          <Image src="/logo.png" alt="The Game Changer" width={60} height={70} className="w-auto h-16 mb-4" />
        </Link>
        <h1 className="mt-2 text-center text-3xl font-bold uppercase tracking-wide text-gray-900">
          Driver Registration
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join our vehicle-based advertising platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-sm sm:px-10 border-t-4 border-[var(--color-primary-red)]">

          {/* Error banner */}
          {error && (
            <div role="alert" className="mb-6 bg-red-50 text-red-800 p-4 rounded-sm text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* ── Google OAuth button ── */}
          <button
            id="google-signup-btn"
            type="button"
            onClick={handleGoogleSignup}
            disabled={isAnyLoading}
            aria-label="Sign up with Google"
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
                Sign up with Google
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
                or register with email
              </span>
            </div>
          </div>

          {/* ── Email / Password form ── */}
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Full Name</label>
                <div className="mt-1">
                  <input id="fullName" name="fullName" type="text" required disabled={isAnyLoading} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm sm:text-sm disabled:bg-gray-50" />
                </div>
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">WhatsApp Number</label>
                <div className="mt-1">
                  <input id="whatsapp" name="whatsapp" type="tel" required disabled={isAnyLoading} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm sm:text-sm disabled:bg-gray-50" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
                <div className="mt-1">
                  <input id="email" name="email" type="email" required disabled={isAnyLoading} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm sm:text-sm disabled:bg-gray-50" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Password</label>
                <div className="mt-1">
                  <input id="password" name="password" type="password" required disabled={isAnyLoading} placeholder="Min 6 characters" className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm sm:text-sm disabled:bg-gray-50 placeholder:text-gray-400" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Confirm Password</label>
                <div className="mt-1">
                  <input id="confirmPassword" name="confirmPassword" type="password" required disabled={isAnyLoading} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm sm:text-sm disabled:bg-gray-50" />
                </div>
              </div>
            </div>

            {/* ── Vehicle & License info ── */}
            <div className="relative pt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 uppercase tracking-widest text-xs font-bold">
                  Vehicle Details
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="license" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Driving License</label>
                <div className="mt-1">
                  <select id="license" name="license" required disabled={isAnyLoading} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-sm border disabled:bg-gray-50">
                    <option value="yes">Yes, I have one</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="pincode" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Pincode</label>
                <div className="mt-1">
                  <input id="pincode" name="pincode" type="text" required disabled={isAnyLoading} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm sm:text-sm disabled:bg-gray-50" />
                </div>
              </div>

              <div>
                <label htmlFor="vehicleType" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Vehicle Make/Model</label>
                <div className="mt-1">
                  <select id="vehicleType" name="vehicleType" required disabled={isAnyLoading} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-sm border disabled:bg-gray-50">
                    <option value="">Select vehicle type</option>
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="avgKm" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Avg KM Driven Per Day</label>
                <div className="mt-1">
                  <select id="avgKm" name="avgKm" required disabled={isAnyLoading} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-sm border disabled:bg-gray-50">
                    <option value="">Select average KM</option>
                    <option value="40-70">40-70 km</option>
                    <option value="70-100">70-100 km</option>
                    <option value="100-120">100-120 km</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center mt-6">
              <input id="declaration" name="declaration" type="checkbox" disabled={isAnyLoading} className="h-4 w-4 text-[var(--color-primary-red)] border-gray-300 rounded" />
              <label htmlFor="declaration" className="ml-2 block text-sm text-gray-900">
                I hereby declare that all the information provided is true and correct.
              </label>
            </div>

            <div className="pt-4">
              <Button type="submit" variant="primary" className="w-full" disabled={isAnyLoading}>
                {loading ? 'Registering…' : 'Complete Registration'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-[var(--color-primary-red)] hover:text-[var(--color-primary-red-dark)] uppercase tracking-wide">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
