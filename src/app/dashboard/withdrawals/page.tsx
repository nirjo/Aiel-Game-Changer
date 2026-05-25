'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/marketing/Button';

export default function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [income, setIncome] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const supabase = createClient();

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const [withdrawalsData, incomeData] = await Promise.all([
        supabase.from('withdrawals').select('*').eq('user_id', user.id).order('request_date', { ascending: false }),
        supabase.from('income').select('*').eq('user_id', user.id).single()
      ]);
      
      if (withdrawalsData.data) setWithdrawals(withdrawalsData.data);
      if (incomeData.data) setIncome(incomeData.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRequesting(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get('amount') as string);

    if (income && amount > income.cleared_income) {
      setMessage({ text: 'Insufficient cleared income for this withdrawal.', type: 'error' });
      setRequesting(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user.id,
          amount: amount,
          status: 'pending'
        });

      if (error) throw error;
      
      setMessage({ text: 'Withdrawal requested successfully!', type: 'success' });
      (e.target as HTMLFormElement).reset();
      loadData(); // Reload to update table
    } catch (error: any) {
      setMessage({ text: error.message || 'Error requesting withdrawal', type: 'error' });
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading withdrawal history...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-wide text-[var(--color-primary-black)]">
          Withdrawals
        </h1>
        <p className="text-gray-500 mt-1">
          Request payouts and track your withdrawal history.
        </p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-sm border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold uppercase tracking-wide mb-4">Available Balance</h2>
            <div className="text-4xl font-bold font-heading text-green-600 mb-2">
              ₹{income?.cleared_income?.toFixed(2) || '0.00'}
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Pending clearance: ₹{income?.pending_clearance?.toFixed(2) || '0.00'}
            </p>
            
            <form onSubmit={handleRequest} className="space-y-4 pt-6 border-t border-gray-100">
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Withdrawal Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input 
                    type="number" 
                    name="amount" 
                    step="0.01" 
                    min="100" 
                    max={income?.cleared_income || 0}
                    required 
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-sm focus:border-[var(--color-primary-red)] outline-none" 
                    placeholder="0.00" 
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum withdrawal: ₹100</p>
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={requesting || !income?.cleared_income || income?.cleared_income < 100}>
                {requesting ? 'Processing...' : 'Request Withdrawal'}
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold uppercase tracking-wide">Withdrawal History</h2>
            </div>
            
            {withdrawals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="py-3 px-6 text-xs font-bold uppercase tracking-wider text-gray-600">Date</th>
                      <th className="py-3 px-6 text-xs font-bold uppercase tracking-wider text-gray-600">Amount</th>
                      <th className="py-3 px-6 text-xs font-bold uppercase tracking-wider text-gray-600">Status</th>
                      <th className="py-3 px-6 text-xs font-bold uppercase tracking-wider text-gray-600">TDS Deduction</th>
                      <th className="py-3 px-6 text-xs font-bold uppercase tracking-wider text-gray-600">Net Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 text-sm">{new Date(item.request_date).toLocaleDateString()}</td>
                        <td className="py-4 px-6 text-sm font-bold">₹{item.amount.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            item.status === 'processed' ? 'bg-green-100 text-green-700' :
                            item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">₹{(item.tds_deduction || 0).toFixed(2)}</td>
                        <td className="py-4 px-6 text-sm font-bold text-green-600">₹{(item.net_final_amount || item.amount).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center text-gray-500">
                You haven't made any withdrawal requests yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
