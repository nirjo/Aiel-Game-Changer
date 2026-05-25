'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { NAVIGATION } from '@/lib/constants/content';
import { Button } from './Button';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[var(--color-primary-black)]/95 backdrop-blur-sm py-4 shadow-md' : 'bg-[var(--color-primary-black)] py-6'}`}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 relative z-50">
          <Image src="/logo.png" alt="The Game Changer" width={40} height={48} className="w-auto h-10 md:h-12" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAVIGATION.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className={`text-sm uppercase font-bold tracking-widest transition-colors hover:text-[var(--color-primary-red)] ${pathname === item.href ? 'text-[var(--color-primary-red)] border-b-2 border-[var(--color-primary-red)]' : 'text-white'}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button href="/login" variant="outline" size="sm" className="!border-white !text-white hover:!bg-white hover:!text-black">
            Driver Login
          </Button>
          <Button href="/register" variant="primary" size="sm">
            Join Platform
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white relative z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Nav */}
        <div className={`fixed inset-0 bg-[var(--color-primary-black)] flex flex-col items-center justify-center gap-8 transition-transform duration-300 md:hidden z-40 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {NAVIGATION.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className={`text-2xl uppercase font-bold tracking-widest ${pathname === item.href ? 'text-[var(--color-primary-red)]' : 'text-white'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="flex flex-col gap-4 mt-8 w-64">
            <Button href="/login" variant="outline" className="w-full !border-white !text-white" onClick={() => setMobileMenuOpen(false)}>
              Driver Login
            </Button>
            <Button href="/register" variant="primary" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              Join Platform
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
