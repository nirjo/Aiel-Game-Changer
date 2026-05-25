import React from 'react';
import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  company: string;
  quote: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, company, quote }) => {
  return (
    <div className="bg-white p-8 md:p-10 rounded-sm shadow-lg border border-gray-100 relative h-full flex flex-col">
      <Quote size={48} className="text-[var(--color-off-white)] absolute top-6 right-8 rotate-180" />
      
      <div className="flex gap-1 mb-6 text-[var(--color-primary-red)]">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={18} fill="currentColor" />
        ))}
      </div>
      
      <p className="text-[var(--color-body-text)] text-lg leading-relaxed mb-8 italic relative z-10 flex-grow">
        "{quote}"
      </p>
      
      <div className="mt-auto">
        <h4 className="font-bold text-[var(--color-primary-black)] uppercase tracking-wide">{name}</h4>
        <p className="text-sm text-[var(--color-muted)]">{company}</p>
      </div>
    </div>
  );
};
