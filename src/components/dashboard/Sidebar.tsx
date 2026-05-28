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

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold font-heading uppercase tracking-widest text-[var(--color-primary-black)]">
          <Image src="/logo.png" alt="The Game Changer" width={24} height={28} className="w-auto h-6" />
          <span><span className="text-[var(--color-primary-red)]">GC</span> Driver</span>
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-40 w-64 bg-white shadow-lg border-r border-gray-100 flex flex-col h-full`}>
        <div className="hidden md:flex p-6 items-center justify-center border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-3 text-2xl font-bold font-heading uppercase tracking-widest text-[var(--color-primary-black)]">
            <Image src="/logo.png" alt="The Game Changer" width={40} height={48} className="w-auto h-10" />
            <span><span className="text-[var(--color-primary-red)]">GC</span> Driver</span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {DASHBOARD_NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
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

        <div className="p-4 border-t border-gray-100 mt-auto">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-sm font-bold uppercase tracking-wide text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};
