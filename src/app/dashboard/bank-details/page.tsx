'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/marketing/Button';

export default function BankDetails() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [bankDetails, setBankDetails] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadDetails() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('bank_details')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (data) setBankDetails(data);
      }
      setLoading(false);
    }
    loadDetails();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData(e.currentTarget);
    const updates = {
      bank_name: formData.get('bank_name'),
      account_number: formData.get('account_number'),
      ifsc_code: formData.get('ifsc_code'),
      branch_name: formData.get('branch_name'),
    };

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('bank_details')
        .upsert({ user_id: user.id, ...updates });

      if (error) throw error;
      
      setMessage({ text: 'Bank details updated successfully!', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.message || 'Error updating bank details', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading bank details...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-wide text-[var(--color-primary-black)]">
          Bank Details
        </h1>
        <p className="text-gray-500 mt-1">
          Update your banking information to receive payments securely.
        </p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-sm border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-sm shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Bank Name</label>
            <input type="text" name="bank_name" defaultValue={bankDetails?.bank_name || ''} required className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none" placeholder="State Bank of India" />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Account Number</label>
            <input type="text" name="account_number" defaultValue={bankDetails?.account_number || ''} required className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none" placeholder="Enter your account number" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">IFSC Code</label>
            <input type="text" name="ifsc_code" defaultValue={bankDetails?.ifsc_code || ''} required className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none uppercase" placeholder="SBIN0001234" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Branch Name</label>
            <input type="text" name="branch_name" defaultValue={bankDetails?.branch_name || ''} required className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none" placeholder="Main Branch" />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving Details...' : 'Save Bank Details'}
          </Button>
        </div>
      </form>
    </div>
  );
}
