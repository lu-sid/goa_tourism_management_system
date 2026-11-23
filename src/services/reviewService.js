
import api from './api';

const reviewService = {
  async createReview(reviewData) {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  async getReviews(params = {}) {
    const response = await api.get('/reviews', { params });
    return response.data;
  },

  async getItemReviews(targetType, targetId) {
    const response = await api.get('/reviews', {
      params: { targetType, targetId },
    });

    return response.data;
  },

  async getMyReviews() {
    const response = await api.get('/reviews/my-reviews');
    return response.data;
  },

  async getAllReviews(params = {}) {
    const response = await api.get('/reviews/all', { params });
    return response.data;
  },

  async updateReviewStatus(id, status) {
    const response = await api.patch(`/reviews/${id}/status`, {
      status,
    });

    return response.data;
  },

  async deleteReview(id) {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

export default reviewService;
