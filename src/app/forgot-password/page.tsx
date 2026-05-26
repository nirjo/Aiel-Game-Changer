'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/marketing/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const supabase = createClient();
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending the reset link.');
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
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email to receive a password reset link
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
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
                <div className="mt-1">
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-[var(--color-primary-red)] focus:border-[var(--color-primary-red)] sm:text-sm" 
                  />
                </div>
              </div>

              <div>
                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                  {loading ? 'Sending link...' : 'Send Reset Link'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="bg-green-50 text-green-800 p-4 rounded-sm text-sm border border-green-200 mb-6">
                Password reset link sent! Check your email inbox.
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remembered your password?{' '}
              <Link href="/login" className="font-bold text-[var(--color-primary-red)] hover:text-[var(--color-primary-red-dark)] uppercase tracking-wide">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
