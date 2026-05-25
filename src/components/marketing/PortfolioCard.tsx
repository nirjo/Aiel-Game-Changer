import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PortfolioCardProps {
  title: string;
  client: string;
  category: string;
  image: string;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ title, client, category, image }) => {
  return (
    <Link href="/portfolio" className="group block relative overflow-hidden rounded-sm aspect-[4/3] w-full">
      <div className="absolute inset-0 bg-gray-200">
        {/* We use a colored placeholder if the image path is invalid initially */}
        <Image 
          src={image} 
          alt={title} 
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <span className="text-[var(--color-primary-red)] font-bold uppercase tracking-widest text-xs mb-2">
          {category}
        </span>
        <h3 className="text-3xl font-bold uppercase tracking-wide text-white mb-1">
          {title}
        </h3>
        <p className="text-gray-300 font-medium">
          {client}
        </p>
      </div>
    </Link>
  );
};
