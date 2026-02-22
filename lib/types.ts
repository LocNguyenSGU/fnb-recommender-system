// TypeScript interfaces cho hệ thống

export interface User {
  id: number;
  username: string;
  password?: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  google_id?: string;
  facebook_id?: string;
  provider: 'local' | 'google' | 'facebook';
  role: 'user' | 'admin' | 'owner';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shop {
  id: number;
  owner_id: number;
  category_id?: number;
  category_name?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  open_time: string;
  close_time: string;
  status: 'pending' | 'approved' | 'rejected';
  images: string[];
  rating?: number;
  review_count?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Menu {
  id: number;
  shop_id: number;
  name: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: number;
  menu_id: number;
  name: string;
  description?: string;
  price: number;
  images: string[];
  is_available: boolean;
  is_hot: boolean;
  is_signature: boolean;
  view_count: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  user_id: number;
  shop_id: number;
  rating: number;
  content: string;
  replies: any[];
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: number;
  author_id: number;
  title: string;
  content: string;
  images: string[];
  likes_count: number;
  status: 'pending' | 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface BlogComment {
  id: number;
  blog_id: number;
  user_id: number;
  content: string;
  replies: any[];
  createdAt: string;
  updatedAt: string;
}
