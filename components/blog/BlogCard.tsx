'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import gsap from 'gsap';
import Image from 'next/image';
import type { BlogPost } from '@/store/blogStore';
import { useBlogStore } from '@/store/blogStore';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Create a short excerpt from content (plain text, no markdown) */
function excerpt(content: string, maxLength = 160): string {
  const plain = content.replace(/\n/g, ' ').trim();
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).trim() + '...';
}

interface BlogCardProps extends BlogPost {
  index?: number;
}

export default function BlogCard({
  id,
  authorName,
  title,
  content,
  images,
  likesCount,
  createdAt,
  status,
  index = 0,
}: BlogCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);
  const setSelectedPostId = useBlogStore((s) => s.setSelectedPostId);
  const imageUrl = images?.[0] ?? 'https://picsum.photos/1200/800?random=' + id;

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    gsap.fromTo(
      card,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'back.out(1.5)',
      }
    );

    const onEnter = () => {
      gsap.to(card, {
        y: -5,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        duration: 0.3,
      });
    };
    const onLeave = () => {
      gsap.to(card, {
        y: 0,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        duration: 0.3,
      });
    };
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="relative w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden group">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg capitalize">
            {status}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              {authorName.charAt(0)}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{authorName}</h4>
              <span className="text-xs text-gray-500">{formatDate(createdAt)}</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {excerpt(content)}
        </p>

        <button
          type="button"
          onClick={() => setSelectedPostId(id)}
          className="inline-block text-blue-600 text-sm font-semibold hover:text-blue-700 transition mb-4 text-left"
        >
          Read More →
        </button>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setLiked((prev) => !prev)}
            className={`flex items-center gap-2 transition duration-200 group ${
              liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart
              className={`w-5 h-5 group-hover:scale-110 transition ${liked ? 'fill-current' : ''}`}
            />
            <span className="text-sm font-semibold">{likesCount + (liked ? 1 : 0)}</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition duration-200 group"
          >
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition" />
            <span className="text-sm font-semibold">0</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition duration-200 group"
          >
            <Share2 className="w-5 h-5 group-hover:scale-110 transition" />
          </button>
        </div>
        <button
          type="button"
          className="text-gray-600 hover:text-yellow-500 transition duration-200"
        >
          <Bookmark className="w-5 h-5 hover:scale-110 transition" />
        </button>
      </div>
    </div>
  );
}
