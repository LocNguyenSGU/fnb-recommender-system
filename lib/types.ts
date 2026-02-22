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
  shopId: number;
  name: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: number;
  menuId: number;
  name: string;
  description?: string;
  price: number;
  images: string[];
  isAvailable: boolean;
  isHot: boolean;
  isSignature: boolean;
  viewCount: number;
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
  authorId: number;
  title: string;
  content: string;
  images: string[];
  likesCount: number;
  status: 'pending' | 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface BlogComment {
  id: number;
  blogId: number;
  userId: number;
  content: string;
  replies: any[];
  createdAt: string;
  updatedAt: string;
}
