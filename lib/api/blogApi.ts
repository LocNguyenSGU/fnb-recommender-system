import { apiClient } from './client';
import type { BlogPost } from '@/store/blogStore';

export interface BlogListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export interface BlogListResponse {
  posts: BlogPost[];
  totalCount: number;
}

export interface CreateBlogPayload {
  title: string;
  content: string;
  images?: string[];
  status?: string;
}

export interface UpdateBlogPayload {
  title?: string;
  content?: string;
  images?: string[];
  status?: string;
}

/** List blogs with optional pagination and filters. */
export async function getBlogs(params?: BlogListParams): Promise<BlogListResponse> {
  const { data } = await apiClient.get<BlogListResponse>('/blogs', { params });
  return data;
}

/** Get a single blog by id. */
export async function getBlogById(id: number): Promise<BlogPost> {
  const { data } = await apiClient.get<BlogPost>(`/blogs/${id}`);
  return data;
}

/** Create a new blog (requires auth). */
export async function createBlog(payload: CreateBlogPayload): Promise<BlogPost> {
  const { data } = await apiClient.post<BlogPost>('/blogs', payload);
  return data;
}

/** Update a blog (requires auth, author or admin). */
export async function updateBlog(id: number, payload: UpdateBlogPayload): Promise<BlogPost> {
  const { data } = await apiClient.patch<BlogPost>(`/blogs/${id}`, payload);
  return data;
}

/** Delete a blog (requires auth, author or admin). */
export async function deleteBlog(id: number): Promise<void> {
  await apiClient.delete(`/blogs/${id}`);
}
