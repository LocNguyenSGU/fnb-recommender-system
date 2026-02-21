'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Footer() {
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Animate heading with split lines
 
    // Animate description
    gsap.fromTo(
      descriptionRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' }
    );

    // Animate button with bounce
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, scale: 0.5, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 1, delay: 0.4, ease: 'elastic.out(1, 0.6)' }
    );

    // Button hover animation
    buttonRef.current.addEventListener('mouseenter', () => {
      gsap.to(buttonRef.current, {
        scale: 1.15,
        boxShadow: '0 25px 50px rgba(59, 130, 246, 0.4)',
        duration: 0.4,
        ease: 'back.out(2)',
      });
    });

    buttonRef.current.addEventListener('mouseleave', () => {
      gsap.to(buttonRef.current, {
        scale: 1,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        duration: 0.4,
        ease: 'power2.out',
      });
    });

  }, []);

  return (
    <section className="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading */}
        <h2
          ref={headingRef}
          className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
        >
          READY TO FIND YOUR<br />NEXT FAVORITE SPOT?
        </h2>

        {/* Description */}
        <p ref={descriptionRef} className="text-lg text-blue-100 mb-10">
          Join thousands of food lovers discovering amazing restaurants every day
        </p>

        {/* Call-to-Action Button */}
        <button
          ref={buttonRef}
          className="bg-white text-blue-600 font-bold text-lg px-10 py-4 rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg"
        >
          Start Exploring Now
        </button>
      </div>
    </section>
  );
}
