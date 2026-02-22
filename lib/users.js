import api from './apiClient.js';
import createCrudApi from './crudFactory.js';

const crud = createCrudApi('/api/users');

const users = {
  ...crud,
  getUserByUsername: (username) => api.get(`/api/users/username/${username}`),
  existsByUsername: (username) => api.get(`/api/users/exists/username/${username}`),
  existsByEmail: (email) => api.get(`/api/users/exists/email/${email}`),
  getUserByEmail: (email) => api.get(`/api/users/email/${email}`),
};

export default users;