import api from './apiClient.js';
import createCrudApi from './crudFactory.js';

const crud = createCrudApi('/api/menu-items');

const menuItems = {
  ...crud,
  incrementViewCount: (id) => api.put(`/api/menu-items/${id}/view`),
  getTopViewedMenuItems: (limit) => api.get('/api/menu-items/top-viewed', { params: { limit } }),
  getSignatureMenuItems: () => api.get('/api/menu-items/signature'),
  searchMenuItemsByName: (name) => api.get('/api/menu-items/search', { params: { name } }),
  getMenuItemsByMenuId: (menuId) => api.get(`/api/menu-items/menu/${menuId}`),
  getAvailableMenuItemsByMenuId: (menuId) => api.get(`/api/menu-items/menu/${menuId}/available`),
  getHotMenuItems: () => api.get('/api/menu-items/hot'),
};

export default menuItems;