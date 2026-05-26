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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const whatsapp = formData.get('whatsapp') as string;
    const license = formData.get('license') === 'yes';
    const pincode = formData.get('pincode') as string;
    const vehicleType = formData.get('vehicleType') as string;
    const avgKm = formData.get('avgKm') as string;
    
    if (!formData.get('declaration')) {
      setError('You must accept the declaration to register.');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      
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
          } catch (e) {
            const errorText = await profileRes.text();
            console.error('Profile creation API failed with non-JSON response:', errorText);
          }
        }
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-off-white)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={60} height={70} className="w-auto h-16 mb-4" />
        </Link>
        <h2 className="mt-2 text-center text-3xl font-bold uppercase tracking-wide text-gray-900">
          Driver Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join our vehicle-based advertising platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-sm sm:px-10 border-t-4 border-[var(--color-primary-red)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-sm text-sm border border-red-200">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Full Name</label>
                <div className="mt-1">
                  <input id="fullName" name="fullName" type="text" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-[var(--color-primary-red)] focus:border-[var(--color-primary-red)] sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">WhatsApp Number</label>
                <div className="mt-1">
                  <input id="whatsapp" name="whatsapp" type="tel" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-[var(--color-primary-red)] focus:border-[var(--color-primary-red)] sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
                <div className="mt-1">
                  <input id="email" name="email" type="email" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-[var(--color-primary-red)] focus:border-[var(--color-primary-red)] sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Password</label>
                <div className="mt-1">
                  <input id="password" name="password" type="password" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-[var(--color-primary-red)] focus:border-[var(--color-primary-red)] sm:text-sm" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="license" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Driving License</label>
                <div className="mt-1">
                  <select id="license" name="license" required className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[var(--color-primary-red)] focus:border-[var(--color-primary-red)] sm:text-sm rounded-sm border">
                    <option value="yes">Yes, I have one</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="pincode" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Pincode</label>
                <div className="mt-1">
                  <input id="pincode" name="pincode" type="text" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-[var(--color-primary-red)] focus:border-[var(--color-primary-red)] sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="vehicleType" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Vehicle Make/Model</label>
                <div className="mt-1">
                  <select id="vehicleType" name="vehicleType" required className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[var(--color-primary-red)] focus:border-[var(--color-primary-red)] sm:text-sm rounded-sm border">
                    <option value="">Select vehicle type</option>
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="avgKm" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Avg KM Driven Per Day</label>
                <div className="mt-1">
                  <select id="avgKm" name="avgKm" required className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[var(--color-primary-red)] focus:border-[var(--color-primary-red)] sm:text-sm rounded-sm border">
                    <option value="">Select average KM</option>
                    <option value="40-70">40-70 km</option>
                    <option value="70-100">70-100 km</option>
                    <option value="100-120">100-120 km</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center mt-6">
              <input id="declaration" name="declaration" type="checkbox" className="h-4 w-4 text-[var(--color-primary-red)] focus:ring-[var(--color-primary-red)] border-gray-300 rounded" />
              <label htmlFor="declaration" className="ml-2 block text-sm text-gray-900">
                I hereby declare that all the information provided is true and correct.
              </label>
            </div>

            <div className="pt-4">
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Registering...' : 'Complete Registration'}
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
