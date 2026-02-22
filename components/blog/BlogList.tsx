'use client';

import { useState, useMemo, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import BlogCard from './BlogCard';
import { useBlogStore, type BlogPost } from '@/store/blogStore';

const PAGE_SIZE_OPTIONS = [6, 12, 24];

export default function BlogList() {
  const [searchQuery, setSearchQuery] = useState('');

  const posts = useBlogStore((s) => s.posts);
  const page = useBlogStore((s) => s.page);
  const pageSize = useBlogStore((s) => s.pageSize);
  const totalCount = useBlogStore((s) => s.totalCount);
  const setPage = useBlogStore((s) => s.setPage);
  const setPageSize = useBlogStore((s) => s.setPageSize);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.authorName.toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  const isServerPaginated = totalCount > posts.length;

  const filteredTotal = isServerPaginated && !searchQuery.trim() ? totalCount : filteredPosts.length;
  const totalPages = Math.ceil(filteredTotal / pageSize) || 1;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const paginatedPosts = useMemo(() => {
    if (isServerPaginated && !searchQuery.trim()) return posts;
    const start = (page - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [posts, filteredPosts, page, pageSize, isServerPaginated, searchQuery]);

  const goNext = useCallback(() => {
    if (hasNextPage) setPage(page + 1);
  }, [hasNextPage, page, setPage]);

  const goPrev = useCallback(() => {
    if (hasPrevPage) setPage(page - 1);
  }, [hasPrevPage, setPage]);

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size);
    },
    [setPageSize]
  );

  return (
    <div className="w-full">
      <div className="mb-12 max-w-3xl mx-auto">
        <div className="mb-8 relative">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-4">
          Showing{' '}
          <span className="font-semibold text-gray-900">
            {paginatedPosts.length ? (page - 1) * pageSize + 1 : 0}–
            {Math.min(page * pageSize, filteredTotal)}
          </span>{' '}
          of <span className="font-semibold text-gray-900">{filteredTotal}</span> posts
          {searchQuery.trim() && totalCount !== filteredTotal && ` (filtered from ${totalCount})`}
        </p>
      </div>

      <div className="space-y-8 max-w-3xl mx-auto">
        {paginatedPosts.length > 0 ? (
          paginatedPosts.map((post: BlogPost, index: number) => (
            <BlogCard key={post.id} {...post} index={index} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No posts found. Try adjusting your search.
            </p>
          </div>
        )}
      </div>

      {filteredTotal > 0 && (
        <div className="mt-12 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-8">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Posts per page:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={!hasPrevPage}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>
            <span className="text-sm text-gray-600 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={!hasNextPage}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
