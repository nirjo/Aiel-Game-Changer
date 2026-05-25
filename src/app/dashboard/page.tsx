import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { IndianRupee, MapPin, Activity, Calendar } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function DashboardHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch dashboard data in parallel
  const [
    { data: incomeData },
    { data: proofData },
    { count: totalProofs }
  ] = await Promise.all([
    supabase.from('income').select('*').eq('user_id', user.id).single(),
    supabase.from('proof_submissions').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(5),
    supabase.from('proof_submissions').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
  ]);

  // Handle case where income record doesn't exist yet
  const income = incomeData || { total_income: 0, pending_clearance: 0, cleared_income: 0 };
  const recentProofs = proofData || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-wide text-[var(--color-primary-black)]">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here's a summary of your earnings and activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500 uppercase tracking-wide text-xs">Total Earnings</h3>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <IndianRupee size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold font-heading">
            ₹{income.total_income.toFixed(2)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500 uppercase tracking-wide text-xs">Pending Clearance</h3>
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
              <Activity size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold font-heading">
            ₹{income.pending_clearance.toFixed(2)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500 uppercase tracking-wide text-xs">Cleared Income</h3>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <IndianRupee size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold font-heading">
            ₹{income.cleared_income.toFixed(2)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500 uppercase tracking-wide text-xs">Total Days Driven</h3>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[var(--color-primary-red)]">
              <Calendar size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold font-heading">
            {totalProofs || 0}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold uppercase tracking-wide mb-6 flex items-center gap-2">
            <MapPin size={20} className="text-[var(--color-primary-red)]" />
            Recent Submissions
          </h2>
          
          {recentProofs.length > 0 ? (
            <div className="space-y-4">
              {recentProofs.map((proof) => (
                <div key={proof.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-sm hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="font-bold">{new Date(proof.date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">{proof.km_driven} km driven</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    proof.status === 'approved' ? 'bg-green-100 text-green-700' :
                    proof.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {proof.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 border border-dashed border-gray-200 rounded-sm">
              No recent proof submissions found.
            </div>
          )}
        </div>

        {/* Campaign Info (Static for now, could be fetched from DB) */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold uppercase tracking-wide mb-6">Current Campaign</h2>
          <div className="bg-[var(--color-primary-black)] text-white rounded-sm p-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[var(--color-primary-red)] rounded-full opacity-20 blur-xl"></div>
            <h3 className="text-2xl font-bold mb-2">City Wide Awareness</h3>
            <p className="text-gray-400 mb-6 text-sm">Sponsored by TechFlow Solutions</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Campaign Progress</span>
                  <span className="font-bold">45%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-[var(--color-primary-red)] h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-800 flex justify-between text-sm">
                <div>
                  <div className="text-gray-400 uppercase tracking-widest text-xs">Ends In</div>
                  <div className="font-bold mt-1">14 Days</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 uppercase tracking-widest text-xs">Rate</div>
                  <div className="font-bold mt-1">₹3 / km</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
