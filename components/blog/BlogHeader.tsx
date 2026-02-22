'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BlogHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function BlogHeader({
  title = 'FOOD & LIFESTYLE BLOG',
  subtitle = 'Discover amazing food stories, restaurant reviews, and culinary trends',
}: BlogHeaderProps) {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    // Animate title
  

  

  }, []);

  return (
    <div
      ref={headerRef}
      className="w-full bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 py-20 px-6 mb-12 rounded-2xl shadow-2xl relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1
          ref={titleRef}
          className="text-6xl md:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-lg"
        >
          {title}
        </h1>
        <p ref={subtitleRef} className="text-lg md:text-xl text-blue-100 drop-shadow">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
