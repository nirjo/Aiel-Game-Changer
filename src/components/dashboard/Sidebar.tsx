'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  LayoutDashboard, 
  User, 
  Landmark, 
  FileCheck, 
  IndianRupee, 
  LifeBuoy, 
  LogOut 
} from 'lucide-react';

const DASHBOARD_NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Bank Details', href: '/dashboard/bank-details', icon: Landmark },
  { name: 'Submit Proof', href: '/dashboard/proof-submission', icon: FileCheck },
  { name: 'Withdrawals', href: '/dashboard/withdrawals', icon: IndianRupee },
  { name: 'Support', href: '/dashboard/support', icon: LifeBuoy },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-100 flex flex-col h-full sticky top-0">
      <div className="p-6 flex items-center justify-center border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3 text-2xl font-bold font-heading uppercase tracking-widest text-[var(--color-primary-black)]">
          <Image src="/logo.png" alt="The Game Changer" width={40} height={48} className="w-auto h-10" />
          <span><span className="text-[var(--color-primary-red)]">GC</span> Driver</span>
        </Link>
      </div>

      <nav className="flex-grow p-4 space-y-1">
        {DASHBOARD_NAV.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm font-bold uppercase tracking-wide text-sm transition-colors ${
                isActive 
                  ? 'bg-[var(--color-primary-red)] text-white' 
                  : 'text-gray-600 hover:bg-red-50 hover:text-[var(--color-primary-red)]'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-sm font-bold uppercase tracking-wide text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};
