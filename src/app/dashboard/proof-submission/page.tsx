'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/marketing/Button';

export default function ProofSubmission() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [file, setFile] = useState<File | null>(null);
  
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    if (!file) {
      setMessage({ text: 'Please select an image to upload.', type: 'error' });
      setSubmitting(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const formData = new FormData(e.currentTarget);
      const kmStart = parseFloat(formData.get('km_start') as string);
      const kmEnd = parseFloat(formData.get('km_end') as string);

      if (kmEnd <= kmStart) {
        throw new Error('Ending KM must be greater than starting KM');
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error('Failed to upload image. Make sure the documents bucket exists and is public.');
      }

      // Insert record
      const { error: dbError } = await supabase
        .from('proof_submissions')
        .insert({
          user_id: user.id,
          date: formData.get('date'),
          km_start: kmStart,
          km_end: kmEnd,
          proof_image_url: fileName,
          status: 'pending'
        });

      if (dbError) throw dbError;
      
      setMessage({ text: 'Proof submitted successfully! It will be reviewed shortly.', type: 'success' });
      (e.target as HTMLFormElement).reset();
      setFile(null);
    } catch (error: any) {
      setMessage({ text: error.message || 'Error submitting proof', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-wide text-[var(--color-primary-black)]">
          Submit Daily Proof
        </h1>
        <p className="text-gray-500 mt-1">
          Upload your speedometer reading to verify your daily kilometers driven.
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
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Date</label>
            <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Starting KM</label>
            <input type="number" name="km_start" step="0.1" required className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none" placeholder="e.g. 15420.5" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Ending KM</label>
            <input type="number" name="km_end" step="0.1" required className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none" placeholder="e.g. 15480.2" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Speedometer Photo (End of Day)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-sm hover:border-[var(--color-primary-red)] transition-colors">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[var(--color-primary-red)] hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[var(--color-primary-red)]">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                {file && <p className="text-sm font-bold mt-2 text-green-600">Selected: {file.name}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-sm">
          <h4 className="font-bold text-blue-800 text-sm mb-1 uppercase tracking-wide">Note on Earnings</h4>
          <p className="text-sm text-blue-600">
            Your daily earnings will be calculated automatically based on the difference between your starting and ending KM (KM Driven) multiplied by your campaign's rate per KM. Earnings will appear as pending until the proof is verified by our team.
          </p>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Daily Proof'}
          </Button>
        </div>
      </form>
    </div>
  );
}
