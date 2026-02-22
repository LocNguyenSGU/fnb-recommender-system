import api from './apiClient.js';
import createCrudApi from './crudFactory.js';

const crud = createCrudApi('/api/reviews');

const reviews = {
  ...crud,
  getReviewsByUserId: (userId) => api.get(`/api/reviews/user/${userId}`),
  getReviewsByShopId: (shopId) => api.get(`/api/reviews/shop/${shopId}`),
  countReviewsByShopId: (shopId) => api.get(`/api/reviews/shop/${shopId}/count`),
  getAverageRatingByShopId: (shopId) => api.get(`/api/reviews/shop/${shopId}/average-rating`),
  getCount: () => api.get('/api/reviews/count'),
};

export default reviews;