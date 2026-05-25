'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/marketing/Button';

export default function Support() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const supabase = createClient();

  async function loadTickets() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (data) setTickets(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData(e.currentTarget);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: formData.get('subject'),
          message: formData.get('message'),
          status: 'open'
        });

      if (error) throw error;
      
      setMessage({ text: 'Support ticket submitted successfully!', type: 'success' });
      (e.target as HTMLFormElement).reset();
      loadTickets(); // Reload table
    } catch (error: any) {
      setMessage({ text: error.message || 'Error submitting ticket', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading support tickets...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-wide text-[var(--color-primary-black)]">
          Help & Support
        </h1>
        <p className="text-gray-500 mt-1">
          Create a new support ticket or view your previous inquiries.
        </p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-sm border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold uppercase tracking-wide mb-6">Create New Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Subject</label>
              <input 
                type="text" 
                name="subject" 
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none" 
                placeholder="e.g. Issue with recent proof submission" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Message</label>
              <textarea 
                name="message" 
                required 
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none resize-none" 
                placeholder="Describe your issue in detail..." 
              ></textarea>
            </div>
            
            <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </form>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold uppercase tracking-wide">Your Tickets</h2>
          </div>
          
          {tickets.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{ticket.subject}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ml-4 ${
                      ticket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      ticket.status === 'closed' ? 'bg-gray-100 text-gray-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ticket.message}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500 uppercase tracking-widest">
                    <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                    <span>ID: #{ticket.id.substring(0, 8)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-gray-500">
              You don't have any support tickets.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
