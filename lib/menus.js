import api from './apiClient.js';
import createCrudApi from './crudFactory.js';

const crud = createCrudApi('/api/menus');

const menus = {
  ...crud,
  getMenusByShopId: (shopId) => api.get(`/api/menus/shop/${shopId}`),
  searchMenusByName: (name) => api.get('/api/menus/search', { params: { name } }),
};

export default menus;