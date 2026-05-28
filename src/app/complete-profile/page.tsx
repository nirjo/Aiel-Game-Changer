'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/marketing/Button';

export default function CompleteProfile() {
  const router = useRouter();
  const supabase = createClient();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  // On mount, check that the user is authenticated and pre-fill any data from Google
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email ?? '');
      setUserName(user.user_metadata?.full_name ?? user.user_metadata?.name ?? '');
      setCheckingAuth(false);
    };

    checkUser();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const fullName = (formData.get('fullName') as string) || userName;
    const whatsapp = formData.get('whatsapp') as string;
    const license = formData.get('license') === 'yes';
    const pincode = formData.get('pincode') as string;
    const vehicleType = formData.get('vehicleType') as string;
    const avgKm = formData.get('avgKm') as string;

    if (!whatsapp || !vehicleType || !pincode) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const profileRes = await fetch('/api/register-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          fullName,
          email: userEmail,
          whatsapp,
          license,
          pincode,
          vehicleType,
          avgKm,
        }),
      });

      if (!profileRes.ok) {
        const data = await profileRes.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save profile.');
      }

      router.refresh();
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-off-white)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Link href="/" aria-label="Go to homepage">
          <Image src="/logo.png" alt="The Game Changer" width={60} height={70} className="w-auto h-16 mb-4" />
        </Link>
        <h1 className="mt-2 text-center text-3xl font-bold uppercase tracking-wide text-gray-900">
          Complete Your Profile
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          We need a few more details to get you started
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-sm sm:px-10 border-t-4 border-[var(--color-primary-red)]">

          {/* Pre-filled info banner */}
          <div className="mb-6 bg-blue-50 text-blue-800 p-4 rounded-sm text-sm border border-blue-200 flex items-start gap-3">
            <svg className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold">Signed in as {userEmail}</p>
              <p className="mt-1 text-blue-700">Fill in your vehicle & contact details below to unlock your dashboard.</p>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div role="alert" className="mb-6 bg-red-50 text-red-800 p-4 rounded-sm text-sm border border-red-200">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Full Name</label>
                <div className="mt-1">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    defaultValue={userName}
                    disabled={loading}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm sm:text-sm disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                  WhatsApp Number <span className="text-[var(--color-primary-red)]">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    required
                    disabled={loading}
                    placeholder="+91 98765 43210"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm sm:text-sm disabled:bg-gray-50 placeholder:text-gray-400"
                  />
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
                  <select id="license" name="license" required disabled={loading} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-sm border disabled:bg-gray-50">
                    <option value="yes">Yes, I have one</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="pincode" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Pincode <span className="text-[var(--color-primary-red)]">*</span>
                </label>
                <div className="mt-1">
                  <input id="pincode" name="pincode" type="text" required disabled={loading} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm sm:text-sm disabled:bg-gray-50" />
                </div>
              </div>

              <div>
                <label htmlFor="vehicleType" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Vehicle Make/Model <span className="text-[var(--color-primary-red)]">*</span>
                </label>
                <div className="mt-1">
                  <select id="vehicleType" name="vehicleType" required disabled={loading} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-sm border disabled:bg-gray-50">
                    <option value="">Select vehicle type</option>
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="avgKm" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Avg KM Driven Per Day</label>
                <div className="mt-1">
                  <select id="avgKm" name="avgKm" required disabled={loading} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-sm border disabled:bg-gray-50">
                    <option value="">Select average KM</option>
                    <option value="40-70">40-70 km</option>
                    <option value="70-100">70-100 km</option>
                    <option value="100-120">100-120 km</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Saving…' : 'Save & Go to Dashboard'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
