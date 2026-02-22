// Mock API functions for admin CRUD operations
// In a real app, these would call actual API endpoints

import { User, Category, Shop, Menu, MenuItem, Review, Blog, BlogComment } from './types';
import {
  MOCK_USERS,
  CATEGORIES,
  MOCK_SHOPS,
  MOCK_MENUS,
  MOCK_MENU_ITEMS,
  MOCK_REVIEWS,
  MOCK_BLOGS,
  MOCK_COMMENTS,
} from './mockData';

// Mock data storage - initialized with mock data
let mockUsers: User[] = [...MOCK_USERS];
let mockCategories: Category[] = [...CATEGORIES];
let mockShops: Shop[] = [...MOCK_SHOPS];
let mockMenus: Menu[] = [...MOCK_MENUS];
let mockMenuItems: MenuItem[] = [...MOCK_MENU_ITEMS];
let mockReviews: Review[] = [...MOCK_REVIEWS];
let mockBlogs: Blog[] = [...MOCK_BLOGS];
let mockComments: BlogComment[] = [...MOCK_COMMENTS];

// Generic CRUD functions
function getAll<T>(data: T[]): T[] {
  return [...data];
}

function getById<T extends { id: number }>(data: T[], id: number): T | undefined {
  return data.find(item => item.id === id);
}

function create<T extends { id: number; createdAt: string; updatedAt: string }>(data: T[], item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
  const newItem = {
    ...item,
    id: Math.max(0, ...data.map(d => d.id)) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as T;
  data.push(newItem);
  return newItem;
}

function update<T extends { id: number }>(data: T[], id: number, updates: Partial<T>): T | undefined {
  const item = getById(data, id);
  if (item) {
    Object.assign(item, updates, { updated_at: new Date().toISOString() });
  }
  return item;
}

function remove<T extends { id: number }>(data: T[], id: number): boolean {
  const index = data.findIndex(item => item.id === id);
  if (index > -1) {
    data.splice(index, 1);
    return true;
  }
  return false;
}

// User API
export const userAPI = {
  getAll: () => getAll(mockUsers),
  getById: (id: number) => getById(mockUsers, id),
  create: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => create(mockUsers, user),
  update: (id: number, updates: Partial<User>) => update(mockUsers, id, updates),
  delete: (id: number) => remove(mockUsers, id),
};

// Category API
export const categoryAPI = {
  getAll: () => getAll(mockCategories),
  getById: (id: number) => getById(mockCategories, id),
  create: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => create(mockCategories, category),
  update: (id: number, updates: Partial<Category>) => update(mockCategories, id, updates),
  delete: (id: number) => remove(mockCategories, id),
};

// Shop API
export const shopAPI = {
  getAll: () => getAll(mockShops),
  getById: (id: number) => getById(mockShops, id),
  create: (shop: Omit<Shop, 'id' | 'createdAt' | 'updatedAt'>) => create(mockShops, shop),
  update: (id: number, updates: Partial<Shop>) => update(mockShops, id, updates),
  delete: (id: number) => remove(mockShops, id),
};

// Menu API
export const menuAPI = {
  getAll: () => getAll(mockMenus),
  getById: (id: number) => getById(mockMenus, id),
  create: (menu: Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>) => create(mockMenus, menu),
  update: (id: number, updates: Partial<Menu>) => update(mockMenus, id, updates),
  delete: (id: number) => remove(mockMenus, id),
};

// MenuItem API
export const menuItemAPI = {
  getAll: () => getAll(mockMenuItems),
  getById: (id: number) => getById(mockMenuItems, id),
  create: (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => create(mockMenuItems, item),
  update: (id: number, updates: Partial<MenuItem>) => update(mockMenuItems, id, updates),
  delete: (id: number) => remove(mockMenuItems, id),
};

// Review API
export const reviewAPI = {
  getAll: () => getAll(mockReviews),
  getById: (id: number) => getById(mockReviews, id),
  create: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => create(mockReviews, review),
  update: (id: number, updates: Partial<Review>) => update(mockReviews, id, updates),
  delete: (id: number) => remove(mockReviews, id),
};

// Blog API
export const blogAPI = {
  getAll: () => getAll(mockBlogs),
  getById: (id: number) => getById(mockBlogs, id),
  create: (blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>) => create(mockBlogs, blog),
  update: (id: number, updates: Partial<Blog>) => update(mockBlogs, id, updates),
  delete: (id: number) => remove(mockBlogs, id),
};

// Comment API
export const commentAPI = {
  getAll: () => getAll(mockComments),
  getById: (id: number) => getById(mockComments, id),
  create: (comment: Omit<BlogComment, 'id' | 'createdAt' | 'updatedAt'>) => create(mockComments, comment),
  update: (id: number, updates: Partial<BlogComment>) => update(mockComments, id, updates),
  delete: (id: number) => remove(mockComments, id),
};