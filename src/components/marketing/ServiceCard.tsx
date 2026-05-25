import React from 'react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon: Icon }) => {
  return (
    <div className="group bg-[var(--color-off-white)] p-8 rounded-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-transparent hover:border-[var(--color-primary-red)] flex flex-col h-full">
      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md mb-6 text-[var(--color-primary-black)] group-hover:text-white group-hover:bg-[var(--color-primary-red)] transition-colors duration-300">
        <Icon size={28} />
      </div>
      <h3 className="text-2xl font-bold uppercase tracking-wide mb-4 text-[var(--color-primary-black)]">
        {title}
      </h3>
      <p className="text-[var(--color-muted)] mb-6 flex-grow leading-relaxed">
        {description}
      </p>
      <Link href="/services" className="inline-flex items-center text-[var(--color-primary-red)] font-bold uppercase tracking-wider text-sm hover:text-[var(--color-primary-red-dark)] transition-colors mt-auto">
        Learn More <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  );
};
