'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/marketing/Button';

export default function Login() {
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

    try {
      const supabase = createClient();
      
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
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
          Driver Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your earning dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-sm sm:px-10 border-t-4 border-[var(--color-primary-red)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-sm text-sm border border-red-200">
                {error}
              </div>
            )}
            
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[var(--color-primary-red)] focus:ring-[var(--color-primary-red)] border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-bold text-[var(--color-primary-red)] hover:text-[var(--color-primary-red-dark)]">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-bold text-[var(--color-primary-red)] hover:text-[var(--color-primary-red-dark)] uppercase tracking-wide">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
