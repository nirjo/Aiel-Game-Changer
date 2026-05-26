'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/marketing/Button';

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    // Listen for auth state changes to catch the password recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Successfully processed the recovery link
        setError(null);
      } else if (event === 'SIGNED_IN' && session) {
        // Also valid if they are just signed in via the link
        setError(null);
      }
    });

    // Also do a fallback check after a delay in case the event already fired
    // or they visited the page without a token
    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Invalid or expired password reset link. Please request a new one.');
      }
    }, 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      
      // Since the user is authenticated via the email link, we can just update their user profile.
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the password.');
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
          Create New Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your new password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-sm sm:px-10 border-t-4 border-[var(--color-primary-red)]">
          {!success ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-800 p-4 rounded-sm text-sm border border-red-200">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">New Password</label>
                <div className="mt-1">
                  <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-[var(--color-primary-red)] focus:border-[var(--color-primary-red)] sm:text-sm" 
                  />
                </div>
              </div>

              <div>
                <Button type="submit" variant="primary" className="w-full" disabled={loading || !!error?.includes('Invalid')}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="bg-green-50 text-green-800 p-4 rounded-sm text-sm border border-green-200 mb-6">
                Password updated successfully! Redirecting to login...
              </div>
              <Button href="/login" variant="primary" className="w-full">
                Go to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
