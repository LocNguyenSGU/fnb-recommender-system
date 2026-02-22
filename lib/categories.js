import api from './apiClient.js';
import createCrudApi from './crudFactory.js';

const crud = createCrudApi('/api/categories');

const categories = {
  ...crud,
  getCategoryByName: (name) => api.get(`/api/categories/name/${name}`),
  existsByName: (name) => api.get(`/api/categories/exists/name/${name}`),
};

export default categories;