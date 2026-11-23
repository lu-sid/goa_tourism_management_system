
import api from './api';

const feedbackService = {
  async submitFeedback(feedbackData) {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },

  async getAllFeedback(params = {}) {
    const response = await api.get('/feedback', { params });
    return response.data;
  },

  async getFeedbackById(id) {
    const response = await api.get(`/feedback/${id}`);
    return response.data;
  },

  async updateFeedback(id, feedbackData) {
    const response = await api.put(
      `/feedback/${id}`,
      feedbackData
    );

    return response.data;
  },

  async deleteFeedback(id) {
    const response = await api.delete(`/feedback/${id}`);
    return response.data;
  },
};

export default feedbackService;
