import api from './apiClient.js';
import createCrudApi from './crudFactory.js';

const crud = createCrudApi('/api/shops');

const shops = {
  ...crud,
  getAll: () => api.get('/api/shops'),
  getShopsByStatus: (status) => api.get(`/api/shops/status/${status}`),
  searchShopsByName: (name) => api.get('/api/shops/search', { params: { name } }),
  getShopsByOwnerId: (ownerId) => api.get(`/api/shops/owner/${ownerId}`),
  findShopsWithinRadius: (params) => api.get('/api/shops/nearby', { params }),
  getShopsByCategoryId: (categoryId) => api.get(`/api/shops/category/${categoryId}`),
  getCount: () => api.get('/api/shops/count'),
};

export default shops;