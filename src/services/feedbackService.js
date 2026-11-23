import api from './api';

export const submitFeedback = (feedbackData) =>
  api.post('/feedback', feedbackData);

export const createFeedback = submitFeedback;

export const getFeedback = (params = {}) =>
  api.get('/feedback', { params });

export const getFeedbackById = (id) =>
  api.get(`/feedback/${id}`);

export const updateFeedback = (id, feedbackData) =>
  api.put(`/feedback/${id}`, feedbackData);

export const deleteFeedback = (id) =>
  api.delete(`/feedback/${id}`);
