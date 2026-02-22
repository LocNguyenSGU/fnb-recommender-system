import api from './apiClient.js';

/**
 * Creates a CRUD API object for a given base path.
 * @param {string} basePath - The base API path (e.g., '/api/users')
 * @returns {Object} - An object with CRUD methods: getAll, getById, create, update, remove
 */
const createCrudApi = (basePath) => ({
  getAll: () => api.get(basePath),
  getById: (id) => api.get(`${basePath}/${id}`),
  create: (data) => api.post(basePath, data),
  update: (id, data) => api.put(`${basePath}/${id}`, data),
  remove: (id) => api.delete(`${basePath}/${id}`),
});

export default createCrudApi;