import { create } from 'zustand';

export interface BlogPost {
  id: number;
  authorId: number;
  authorName: string;
  title: string;
  content: string;
  images: string[];
  likesCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogState {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  // Modal: which post detail is open
  selectedPostId: number | null;
  // Pagination
  page: number;
  pageSize: number;
  totalCount: number;
  // Actions
  setPosts: (posts: BlogPost[], totalCount?: number) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetPagination: () => void;
  setSelectedPostId: (id: number | null) => void;
}

const DEFAULT_PAGE_SIZE = 6;

export const useBlogStore = create<BlogState>((set) => ({
  posts: [],
  loading: false,
  error: null,
  selectedPostId: null,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  totalCount: 0,

  setSelectedPostId: (selectedPostId) => set({ selectedPostId }),

  setPosts: (posts, totalCount) =>
    set((state) => ({
      posts,
      totalCount: totalCount ?? posts.length,
    })),

  setPage: (page) => set({ page }),

  setPageSize: (pageSize) => set({ pageSize, page: 1 }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  resetPagination: () => set({ page: 1 }),
}));

/** Total number of pages based on totalCount and pageSize */
export const selectTotalPages = (state: BlogState) =>
  Math.ceil(state.totalCount / state.pageSize) || 1;

/** Whether there is a next page */
export const selectHasNextPage = (state: BlogState) =>
  state.page < Math.ceil(state.totalCount / state.pageSize);

/** Whether there is a previous page */
export const selectHasPrevPage = (state: BlogState) => state.page > 1;
