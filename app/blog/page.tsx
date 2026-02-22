'use client';

import { useEffect } from 'react';
import Nav from '@/components/dashboard/nav';
import BlogHeader from '@/components/blog/BlogHeader';
import BlogList from '@/components/blog/BlogList';
import PostDetailModal from '@/components/blog/PostDetailModal';
import { useBlogStore, type BlogPost } from '@/store/blogStore';
import { getBlogs } from '@/lib/api/blogApi';

const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    authorId: 5,
    authorName: 'Phạm Thị Diễm',
    title: 'Top 10 quán cà phê đẹp nhất Sài Gòn',
    content:
      'Sài Gòn không chỉ nổi tiếng với nhịp sống sôi động mà còn có rất nhiều quán cà phê đẹp, view tuyệt vời...\n\n1. Highlands Coffee Nguyễn Huệ - View sông tuyệt đẹp\n2. The Coffee House Lý Tự Trọng - Không gian yên tĩnh\n...',
    images: [
      'https://picsum.photos/1200/800?random=801',
      'https://picsum.photos/1200/800?random=802',
    ],
    likesCount: 156,
    status: 'published',
    createdAt: '2026-02-21T18:00:57.289596',
    updatedAt: '2026-02-21T18:00:57.289738',
  },
  {
    id: 2,
    authorId: 3,
    authorName: 'Marco Rossi',
    title: 'Top 10 Italian Restaurants You Must Try in 2026',
    content:
      'Discover the best authentic Italian restaurants that showcase traditional recipes and modern twists. From pasta to risotto, we have it all.',
    images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop'],
    likesCount: 234,
    status: 'published',
    createdAt: '2026-02-20T10:00:00.000000',
    updatedAt: '2026-02-20T10:00:00.000000',
  },
  {
    id: 3,
    authorId: 4,
    authorName: 'Yuki Tanaka',
    title: 'The Art of Sushi: A Complete Guide to Japanese Cuisine',
    content:
      'Learn the techniques and traditions behind authentic sushi making. From selecting fish to rolling techniques, masters share their secrets.',
    images: ['https://images.unsplash.com/photo-1555939594-58d7cb561f1f?w=500&h=300&fit=crop'],
    likesCount: 567,
    status: 'published',
    createdAt: '2026-02-19T14:30:00.000000',
    updatedAt: '2026-02-19T14:30:00.000000',
  },
  {
    id: 4,
    authorId: 2,
    authorName: 'Sarah Chen',
    title: 'Farm-to-Table: The Future of Sustainable Dining',
    content:
      'Explore how restaurants are embracing sustainable practices by sourcing locally and reducing food waste. A conversation with leading chefs.',
    images: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop'],
    likesCount: 445,
    status: 'published',
    createdAt: '2026-02-18T09:00:00.000000',
    updatedAt: '2026-02-18T09:00:00.000000',
  },
  {
    id: 5,
    authorId: 1,
    authorName: 'James Wilson',
    title: 'Michelin Star Kitchens: Inside the Minds of Top Chefs',
    content:
      'An exclusive interview with Michelin-starred chefs about their journey, inspirations, and the future of fine dining in the modern world.',
    images: ['https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=300&fit=crop'],
    likesCount: 892,
    status: 'published',
    createdAt: '2026-02-17T16:00:00.000000',
    updatedAt: '2026-02-17T16:00:00.000000',
  },
  {
    id: 6,
    authorId: 6,
    authorName: 'Maria Garcia',
    title: 'Street Food Around the World: 15 Must-Try Dishes',
    content:
      'From Bangkok pad thai to Mexican tacos, discover the incredible street food scene across different continents and cultures.',
    images: ['https://images.unsplash.com/photo-1555939594-58d7cb561f1f1?w=500&h=300&fit=crop'],
    likesCount: 623,
    status: 'published',
    createdAt: '2026-02-16T11:00:00.000000',
    updatedAt: '2026-02-16T11:00:00.000000',
  },
  {
    id: 7,
    authorId: 7,
    authorName: 'Emma Johnson',
    title: 'The Rise of Plant-Based Dining: What Chefs Are Creating',
    content:
      'Vegan restaurants are transforming the culinary landscape. We explore innovative dishes and techniques that challenge traditional cooking.',
    images: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd1?w=500&h=300&fit=crop'],
    likesCount: 456,
    status: 'published',
    createdAt: '2026-02-15T08:00:00.000000',
    updatedAt: '2026-02-15T08:00:00.000000',
  },
  {
    id: 8,
    authorId: 8,
    authorName: 'David Brown',
    title: 'Coffee Culture: From Bean to Cup',
    content:
      'Explore the world of specialty coffee. Learn about different brewing methods, origins, and how to find your perfect cup.',
    images: ['https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=300&fit=crop'],
    likesCount: 334,
    status: 'published',
    createdAt: '2026-02-14T13:00:00.000000',
    updatedAt: '2026-02-14T13:00:00.000000',
  },
];

export default function BlogPage() {
  const posts = useBlogStore((s) => s.posts);
  const selectedPostId = useBlogStore((s) => s.selectedPostId);
  const setSelectedPostId = useBlogStore((s) => s.setSelectedPostId);
  const setPosts = useBlogStore((s) => s.setPosts);
  const setLoading = useBlogStore((s) => s.setLoading);
  const setError = useBlogStore((s) => s.setError);
  const page = useBlogStore((s) => s.page);
  const pageSize = useBlogStore((s) => s.pageSize);

  const selectedPost = selectedPostId ? posts.find((p) => p.id === selectedPostId) ?? null : null;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getBlogs({ page, pageSize });
        if (!cancelled) {
          setPosts(res.posts, res.totalCount);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load blogs.');
          setPosts(SAMPLE_BLOG_POSTS, SAMPLE_BLOG_POSTS.length);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [setPosts, setLoading, setError, page, pageSize]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Nav />

      <div className="pt-32 pb-12 px-6">
        <BlogHeader
          title="FOOD & LIFESTYLE BLOG"
          subtitle="Discover amazing food stories, restaurant reviews, and culinary trends"
        />
      </div>

      <div className="px-6 pb-20">
        <BlogList />
      </div>

      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPostId(null)}
      />

      <div className="h-20" />
    </main>
  );
}
