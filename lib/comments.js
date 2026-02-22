import api from './apiClient.js';
import createCrudApi from './crudFactory.js';

const crud = createCrudApi('/api/comments');

const comments = {
  ...crud,
  getCommentsByUserId: (userId) => api.get(`/api/comments/user/${userId}`),
  getCommentsByBlogId: (blogId) => api.get(`/api/comments/blog/${blogId}`),
};

export default comments;