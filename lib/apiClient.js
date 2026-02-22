import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, remove token and redirect to login
      localStorage.removeItem('token');
      // You can add redirect logic here, e.g., window.location.href = '/login';
    }
    // You can add more error handling here, like showing toast notifications
    return Promise.reject(error);
  }
);

// Users API
export const users = {
  getUserById: (id) => api.get(`/api/users/${id}`),
  updateUser: (id, data) => api.put(`/api/users/${id}`, data),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
  getAllUsers: () => api.get('/api/users'),
  createUser: (data) => api.post('/api/users', data),
  getUserByUsername: (username) => api.get(`/api/users/username/${username}`),
  existsByUsername: (username) => api.get(`/api/users/exists/username/${username}`),
  existsByEmail: (email) => api.get(`/api/users/exists/email/${email}`),
  getUserByEmail: (email) => api.get(`/api/users/email/${email}`),
};

// Shops API
export const shops = {
  getShopById: (id) => api.get(`/api/shops/${id}`),
  updateShop: (id, data) => api.put(`/api/shops/${id}`, data),
  deleteShop: (id) => api.delete(`/api/shops/${id}`),
  getAllShops: () => api.get('/api/shops'),
  createShop: (data) => api.post('/api/shops', data),
  getShopsByStatus: (status) => api.get(`/api/shops/status/${status}`),
  searchShopsByName: (name) => api.get('/api/shops/search', { params: { name } }),
  getShopsByOwnerId: (ownerId) => api.get(`/api/shops/owner/${ownerId}`),
  findShopsWithinRadius: (params) => api.get('/api/shops/nearby', { params }),
  getShopsByCategoryId: (categoryId) => api.get(`/api/shops/category/${categoryId}`),
};

// Reviews API
export const reviews = {
  getReviewById: (id) => api.get(`/api/reviews/${id}`),
  updateReview: (id, data) => api.put(`/api/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/api/reviews/${id}`),
  getAllReviews: () => api.get('/api/reviews'),
  createReview: (data) => api.post('/api/reviews', data),
  getReviewsByUserId: (userId) => api.get(`/api/reviews/user/${userId}`),
  getReviewsByShopId: (shopId) => api.get(`/api/reviews/shop/${shopId}`),
  countReviewsByShopId: (shopId) => api.get(`/api/reviews/shop/${shopId}/count`),
  getAverageRatingByShopId: (shopId) => api.get(`/api/reviews/shop/${shopId}/average-rating`),
};

// Menus API
export const menus = {
  getMenuById: (id) => api.get(`/api/menus/${id}`),
  updateMenu: (id, data) => api.put(`/api/menus/${id}`, data),
  deleteMenu: (id) => api.delete(`/api/menus/${id}`),
  getAllMenus: () => api.get('/api/menus'),
  createMenu: (data) => api.post('/api/menus', data),
  getMenusByShopId: (shopId) => api.get(`/api/menus/shop/${shopId}`),
  searchMenusByName: (name) => api.get('/api/menus/search', { params: { name } }),
};

// Menu Items API
export const menuItems = {
  getMenuItemById: (id) => api.get(`/api/menu-items/${id}`),
  updateMenuItem: (id, data) => api.put(`/api/menu-items/${id}`, data),
  deleteMenuItem: (id) => api.delete(`/api/menu-items/${id}`),
  getAllMenuItems: () => api.get('/api/menu-items'),
  createMenuItem: (data) => api.post('/api/menu-items', data),
  incrementViewCount: (id) => api.put(`/api/menu-items/${id}/view`),
  getTopViewedMenuItems: (limit) => api.get('/api/menu-items/top-viewed', { params: { limit } }),
  getSignatureMenuItems: () => api.get('/api/menu-items/signature'),
  searchMenuItemsByName: (name) => api.get('/api/menu-items/search', { params: { name } }),
  getMenuItemsByMenuId: (menuId) => api.get(`/api/menu-items/menu/${menuId}`),
  getAvailableMenuItemsByMenuId: (menuId) => api.get(`/api/menu-items/menu/${menuId}/available`),
  getHotMenuItems: () => api.get('/api/menu-items/hot'),
};

// Comments API
export const comments = {
  getCommentById: (id) => api.get(`/api/comments/${id}`),
  updateComment: (id, data) => api.put(`/api/comments/${id}`, data),
  deleteComment: (id) => api.delete(`/api/comments/${id}`),
  getAllComments: () => api.get('/api/comments'),
  createComment: (data) => api.post('/api/comments', data),
  getCommentsByUserId: (userId) => api.get(`/api/comments/user/${userId}`),
  getCommentsByBlogId: (blogId) => api.get(`/api/comments/blog/${blogId}`),
};

// Categories API
export const categories = {
  getCategoryById: (id) => api.get(`/api/categories/${id}`),
  updateCategory: (id, data) => api.put(`/api/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/api/categories/${id}`),
  getAllCategories: () => api.get('/api/categories'),
  createCategory: (data) => api.post('/api/categories', data),
  getCategoryByName: (name) => api.get(`/api/categories/name/${name}`),
  existsByName: (name) => api.get(`/api/categories/exists/name/${name}`),
};

// Blogs API
export const blogs = {
  getBlogById: (id) => api.get(`/api/blogs/${id}`),
  updateBlog: (id, data) => api.put(`/api/blogs/${id}`, data),
  deleteBlog: (id) => api.delete(`/api/blogs/${id}`),
  getAllBlogs: () => api.get('/api/blogs'),
  createBlog: (data) => api.post('/api/blogs', data),
  incrementLikesCount: (id) => api.put(`/api/blogs/${id}/like`),
  getTopLikedBlogs: () => api.get('/api/blogs/top-liked'),
  getBlogsByStatus: (status) => api.get(`/api/blogs/status/${status}`),
  searchBlogsByTitle: (title) => api.get('/api/blogs/search', { params: { title } }),
  getBlogsByAuthorId: (authorId) => api.get(`/api/blogs/author/${authorId}`),
};

// Export the axios instance for direct use if needed
export default api;