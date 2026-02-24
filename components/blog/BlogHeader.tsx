'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BlogHeaderProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export default function BlogHeader({
  title = 'FOOD & LIFESTYLE BLOG',
  subtitle = 'Discover amazing food stories, restaurant reviews, and culinary trends',
  imageUrl = '/img/food-banner.png', // put your image in public/images
}: BlogHeaderProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    gsap.fromTo(
      subtitleRef.current,
      { x: -80, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, delay: 0.2, ease: 'power3.out' }
    );
  }, []);

  return (
    <div
      ref={headerRef}
      className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl mb-12"
    >
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt="Blog header"
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-8 md:px-16">
        <div className="max-w-xl text-left text-white">
          <h1
            ref={titleRef}
            className="text-5xl md:text-6xl font-bold mb-4 leading-tight"
          >
            {title}
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-gray-200"
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}