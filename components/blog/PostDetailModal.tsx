'use client';

import Image from 'next/image';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useBlogStore, type BlogPost } from '@/store/blogStore';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface PostDetailModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export default function PostDetailModal({ post, onClose }: PostDetailModalProps) {
  const [liked, setLiked] = useState(false);

  if (!post) return null;

  const imageUrl = post.images?.[0] ?? 'https://picsum.photos/1200/800?random=' + post.id;

  return (
    <Modal open={!!post} onClose={onClose} maxWidth="3xl" title={post.title}>
      <div className="p-6">
        {/* Hero image */}
        <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-gray-100 mb-6">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold capitalize">
            {post.status}
          </span>
        </div>

        {/* Author & date */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {post.authorName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{post.authorName}</p>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Full content */}
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
        </div>

        {/* Extra images */}
        {post.images && post.images.length > 1 && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {post.images.slice(1, 5).map((src, i) => (
              <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 400px) 50vw, 200px"
                />
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setLiked((prev) => !prev)}
              className={`flex items-center gap-2 transition duration-200 ${
                liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span className="font-semibold">{post.likesCount + (liked ? 1 : 0)}</span>
            </button>
            <button type="button" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">0</span>
            </button>
            <button type="button" className="flex items-center gap-2 text-gray-600 hover:text-green-600">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          <button type="button" className="text-gray-600 hover:text-yellow-500">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
