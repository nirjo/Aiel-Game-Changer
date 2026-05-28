'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/marketing/Button';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [profile, setProfile] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (data) setProfile({ ...data, email: user.email });
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData(e.currentTarget);
    const updates = {
      full_name: formData.get('full_name'),
      whatsapp_number: formData.get('whatsapp_number'),
      profession: formData.get('profession'),
      age: formData.get('age') ? parseInt(formData.get('age') as string) : null,
      pan_card: formData.get('pan_card'),
      aadhar_card: formData.get('aadhar_card'),
      address: formData.get('address'),
      pincode: formData.get('pincode'),
      vehicle_type: formData.get('vehicle_type'),
      avg_km_per_day: formData.get('avg_km_per_day'),
    };

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('users')
        .upsert({ id: user.id, email: user.email, ...updates });

      if (error) throw error;
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.message || 'Error updating profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse flex space-x-4">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-wide text-[var(--color-primary-black)]">
          Profile Management
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your personal information and vehicle details.
        </p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-sm border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-sm shadow-sm border border-gray-100">
        {/* Personal Details Section */}
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wide mb-6 pb-2 border-b border-gray-100">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Full Name</label>
              <input type="text" name="full_name" defaultValue={profile?.full_name || ''} required className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Email (Read Only)</label>
              <input type="email" value={profile?.email || ''} readOnly className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-sm text-gray-500 outline-none cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">WhatsApp Number</label>
              <input type="tel" name="whatsapp_number" defaultValue={profile?.whatsapp_number || ''} required className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Age</label>
              <input type="number" name="age" defaultValue={profile?.age || ''} min="18" max="100" className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Profession</label>
              <select name="profession" defaultValue={profile?.profession || ''} className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none">
                <option value="">Select profession</option>
                <option value="student">Student</option>
                <option value="employed">Employed</option>
                <option value="self_employed">Self Employed</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Identity Section */}
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wide mb-6 pb-2 border-b border-gray-100">Identity & Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">PAN Card Number</label>
              <input type="text" name="pan_card" defaultValue={profile?.pan_card || ''} className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none uppercase" placeholder="ABCDE1234F" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Aadhar Card Number</label>
              <input type="text" name="aadhar_card" defaultValue={profile?.aadhar_card || ''} className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none" placeholder="1234 5678 9012" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Address</label>
              <textarea name="address" defaultValue={profile?.address || ''} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none resize-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Pincode</label>
              <input type="text" name="pincode" defaultValue={profile?.pincode || ''} required className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none" />
            </div>
          </div>
        </div>

        {/* Vehicle Section */}
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wide mb-6 pb-2 border-b border-gray-100">Vehicle Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Vehicle Type</label>
              <select name="vehicle_type" defaultValue={profile?.vehicle_type || ''} required className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none">
                <option value="bike">Bike</option>
                <option value="scooter">Scooter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Avg KM Per Day</label>
              <select name="avg_km_per_day" defaultValue={profile?.avg_km_per_day || ''} required className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none">
                <option value="40-70">40-70 km</option>
                <option value="70-100">70-100 km</option>
                <option value="100-120">100-120 km</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
