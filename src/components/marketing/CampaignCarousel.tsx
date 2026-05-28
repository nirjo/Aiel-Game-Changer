'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from './Button';

const CAMPAIGNS = [
  {
    id: 1,
    image: '/images/gc1.jpeg',
    title: 'Just Drive Campaign',
    subtitle: 'Motorbike Advertising',
    description: 'No delivery targets, no schedules. Wrap your bike and earn up to ₹5,000/month passively.',
    badge: 'Popular'
  },
  {
    id: 2,
    image: '/images/gc2.jpeg',
    title: 'Eco-Rider Program',
    subtitle: 'Bicycle Advertising',
    description: 'Perfect for local college students and daily commuters. Go green and get paid for your active routes.',
    badge: 'Eco-Friendly'
  },
  {
    id: 3,
    image: '/images/gc3.jpeg',
    title: 'City-Pulse Marketing',
    subtitle: 'Scooter & Moped Campaigns',
    description: 'Turn your daily scooter commute into a cash stream. Join premium high-impact local brand runs.',
    badge: 'High Yield'
  },
  {
    id: 4,
    image: '/images/gc4.jpeg',
    title: 'Multi-Format Ad Runs',
    subtitle: 'Combined Fleet Advertising',
    description: 'Our most comprehensive branding campaigns spanning across cycles, scooters, and motorbikes.',
    badge: 'Enterprise'
  }
];

export const CampaignCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % CAMPAIGNS.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + CAMPAIGNS.length) % CAMPAIGNS.length);
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    if (isPlaying) {
      timerRef.current = setInterval(nextSlide, 4500);
    }
  };

  const stopAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [activeIndex, isPlaying]);

  return (
    <section className="py-24 bg-gradient-to-b from-[var(--color-primary-black)] to-gray-900 text-white overflow-hidden relative">
      {/* Abstract background grids/circles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[var(--color-primary-red)] rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Copy section */}
          <div className="lg:w-5/12 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/50 border border-red-500/30 text-[var(--color-primary-red)] rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary-red)] animate-pulse"></span>
              Live Driver Campaigns
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wide leading-tight">
              Earn Passive <br />
              <span className="text-[var(--color-primary-red)]">Income</span> While <br />
              You Just Drive
            </h2>
            <div className="w-20 h-1 bg-[var(--color-primary-red)]"></div>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              We connect local drivers with top-tier brands looking for high-visibility outdoor advertising. Turn your daily commute or riding routes into a rewarding revenue stream with zero hassle.
            </p>
            
            <div className="pt-6 flex flex-wrap gap-4 items-center">
              <Button href="/register" variant="primary" size="lg">
                Join As A Driver
              </Button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-4 py-3 rounded-sm border border-gray-700 bg-gray-900/50 hover:bg-gray-800 transition-colors text-sm font-bold uppercase tracking-wider text-gray-300 cursor-pointer"
                aria-label={isPlaying ? 'Pause Auto Play' : 'Start Auto Play'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? 'Pause Rotation' : 'Auto Rotate'}
              </button>
            </div>
          </div>

          {/* Interactive 3D Showcase Carousel */}
          <div className="lg:w-7/12 w-full flex flex-col items-center">
            <div className="relative w-full h-[550px] md:h-[650px] flex items-center justify-center">
              
              {CAMPAIGNS.map((camp, idx) => {
                // Calculate relative positions for 3D layout
                let position = idx - activeIndex;
                if (position < -1) position += CAMPAIGNS.length;
                if (position > CAMPAIGNS.length - 2) position -= CAMPAIGNS.length;

                const isActive = position === 0;
                const isPrev = position === -1;
                const isNext = position === 1;
                const isVisible = isActive || isPrev || isNext;

                if (!isVisible) return null;

                // 3D transform values based on position
                let transformStr = '';
                let zIndex = 0;
                let opacity = 0;

                if (isActive) {
                  transformStr = 'scale(1) translate3d(0, 0, 0)';
                  zIndex = 30;
                  opacity = 1;
                } else if (isPrev) {
                  transformStr = 'scale(0.85) translate3d(-35%, 0, -100px) rotateY(15deg)';
                  zIndex = 20;
                  opacity = 0.5;
                } else if (isNext) {
                  transformStr = 'scale(0.85) translate3d(35%, 0, -100px) rotateY(-15deg)';
                  zIndex = 20;
                  opacity = 0.5;
                }

                return (
                  <div
                    key={camp.id}
                    className="absolute w-[280px] md:w-[340px] aspect-[9/16] rounded-xl overflow-hidden shadow-2xl transition-all duration-700 ease-out cursor-pointer"
                    style={{
                      transform: transformStr,
                      zIndex: zIndex,
                      opacity: opacity,
                      transformStyle: 'preserve-3d',
                      perspective: '1000px'
                    }}
                    onClick={() => {
                      if (isPrev) prevSlide();
                      if (isNext) nextSlide();
                    }}
                  >
                    {/* Shadow overlay to enhance 3D feel on background cards */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-black/60 z-20 transition-opacity duration-700"></div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-30">
                      <span className="px-3 py-1 bg-[var(--color-primary-red)] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md">
                        {camp.badge}
                      </span>
                    </div>

                    {/* Poster Image */}
                    <div className="relative w-full h-full">
                      <Image
                        src={camp.image}
                        alt={camp.title}
                        fill
                        className="object-cover z-10"
                        sizes="(max-width: 768px) 280px, 340px"
                        priority={isActive}
                      />
                    </div>

                    {/* Info Card (slide up on hover of active item) */}
                    <div className={`absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-30 transition-all duration-500 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                      <div className="text-[var(--color-primary-red)] text-xs font-bold uppercase tracking-widest mb-1">
                        {camp.subtitle}
                      </div>
                      <h4 className="text-xl font-bold uppercase tracking-wide text-white mb-2">
                        {camp.title}
                      </h4>
                      <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                        {camp.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-6 mt-8">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-gray-700 bg-gray-900/50 hover:bg-[var(--color-primary-red)] hover:border-[var(--color-primary-red)] transition-all flex items-center justify-center text-white cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-2">
                {CAMPAIGNS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === idx ? 'w-8 bg-[var(--color-primary-red)]' : 'w-2.5 bg-gray-700 hover:bg-gray-500'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border border-gray-700 bg-gray-900/50 hover:bg-[var(--color-primary-red)] hover:border-[var(--color-primary-red)] transition-all flex items-center justify-center text-white cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
