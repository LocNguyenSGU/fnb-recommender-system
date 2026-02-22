import api from './apiClient.js';
import createCrudApi from './crudFactory.js';

const crud = createCrudApi('/api/blogs');

const blogs = {
  ...crud,
  incrementLikesCount: (id) => api.put(`/api/blogs/${id}/like`),
  getTopLikedBlogs: () => api.get('/api/blogs/top-liked'),
  getBlogsByStatus: (status) => api.get(`/api/blogs/status/${status}`),
  searchBlogsByTitle: (title) => api.get('/api/blogs/search', { params: { title } }),
  getBlogsByAuthorId: (authorId) => api.get(`/api/blogs/author/${authorId}`),
};

export default blogs;