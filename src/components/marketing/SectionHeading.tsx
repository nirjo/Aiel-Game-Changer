import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  dark?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  title, 
  subtitle, 
  centered = false,
  dark = false
}) => {
  return (
    <div className={`flex flex-col ${centered ? 'items-center text-center' : 'items-start'} mb-12`}>
      <h2 className={`text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4 ${dark ? 'text-white' : 'text-[var(--color-primary-black)]'}`}>
        {title}
      </h2>
      <div className="accent-line mb-6"></div>
      {subtitle && (
        <p className={`text-lg max-w-2xl ${dark ? 'text-gray-300' : 'text-[var(--color-muted)]'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
