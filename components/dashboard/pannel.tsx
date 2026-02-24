'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

export default function Pannel() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
   
    // Animate description
    gsap.fromTo(
      descriptionRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' }
    );

    // Animate buttons container
    gsap.fromTo(
      buttonsRef.current,
      { opacity: 0, scale: 0.9, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'back.out(1.5)' }
    );

  
  }, []);

  return (
    <div className="relative w-full min-h-screen flex justify-center text-white">
      {/* Background Image */}
      <Image
        src="/img/pannel_img.png"
        alt="Food Map Illustration"
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mt-[42rem]">
        <h1 ref={titleRef} className="text-3xl md:text-5xl font-bold leading-tight mb-4">
          FIND AMAZING FOOD <br /> NEAR YOU
        </h1>

        <p ref={descriptionRef} className="text-sm md:text-lg text-gray-200 mb-6">
          Discover the best restaurants, cafes, and bars in your area. Explore reviews,
          find new cuisines, and share your favorite dining spots with the community.
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition shadow-md">
            Explore Restaurants
          </button>

          <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition shadow-md">
            Open The Blog
          </button>
        </div>
      </div>
    </div>
  );
}