import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[var(--color-off-white)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto w-full">
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
