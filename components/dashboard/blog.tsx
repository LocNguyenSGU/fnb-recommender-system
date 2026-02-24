'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BLOG_POSTS = [
  {
    id: 1,
    title: 'Restaurant Reviews',
    description: 'In-depth reviews and honest opinions about the hottest dining spots.',
    emoji: '📝',
    buttonText: 'Read Reviews',
    link: '#',
  },
  {
    id: 2,
    title: 'Chef Interviews',
    description: 'Stories and secrets from renowned chefs and culinary experts.',
    emoji: '👨‍🍳',
    buttonText: 'Meet the Chefs',
    link: '#',
  },
  {
    id: 3,
    title: 'Food Guides',
    description: 'Comprehensive guides to navigate different cuisines and experiences.',
    emoji: '🍴',
    buttonText: 'Explore Guides',
    link: '#',
  },
];

export default function Blog() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll trigger for title
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
        },
      }
    );

    // Scroll trigger for description
    gsap.fromTo(
      descriptionRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'top 45%',
          scrub: 1,
        },
      }
    );

    // Scroll trigger for cards with stagger
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1,
        },
      }
    );

    // Scroll trigger for button
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'top 35%',
          scrub: 1,
        },
      }
    );

    // Add hover animations for cards
    cardsRef.current.forEach((card) => {
      if (!card) return;
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -10, boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)', duration: 0.3 });
        gsap.to(card.querySelector('.emoji'), { scale: 1.1, duration: 0.3 });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', duration: 0.3 });
        gsap.to(card.querySelector('.emoji'), { scale: 1, duration: 0.3 });
      });
    });

    // Button hover animation
    if (buttonRef.current) {
      buttonRef.current.addEventListener('mouseenter', () => {
        gsap.to(buttonRef.current, { scale: 1.1, duration: 0.3 });
      });

      buttonRef.current.addEventListener('mouseleave', () => {
        gsap.to(buttonRef.current, { scale: 1, duration: 0.3 });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-white py-16 px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 ref={titleRef} className="text-5xl font-bold text-gray-900 mb-4">
          EXPLORE OUR FOOD BLOG
        </h2>
        <p ref={descriptionRef} className="text-lg text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest food trends, restaurant reviews, and culinary stories
        </p>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.id}
            ref={(el) => {
              if (el) cardsRef.current.push(el);
            }}
            className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300"
          >
            {/* Icon Section */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 h-48 flex items-center justify-center group">
              <span className="emoji text-6xl">{post.emoji}</span>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {post.description}
              </p>
              <button className="w-full bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition-all duration-200 active:scale-95">
                {post.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Visit Blog Button */}
      <div className="flex justify-center">
        <button
          ref={buttonRef}
          className="bg-blue-700 text-white px-10 py-4 rounded-full font-semibold hover:bg-blue-800 transition-all duration-200 shadow-lg"
        >
          Visit Our Blog
        </button>
      </div>
    </section>
  );
}
