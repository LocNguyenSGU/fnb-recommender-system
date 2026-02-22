// TypeScript interfaces cho hệ thống

export interface User {
  id: number;
  username: string;
  password?: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  googleId?: string;
  facebookId?: string;
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
  ownerId: number;
  categoryId?: number;
  categoryName?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  openTime: string;
  closeTime: string;
  status: 'pending' | 'approved' | 'rejected';
  images: string[];
  rating?: number;
  reviewCount?: number;
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
  userId: number;
  shopId: number;
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
