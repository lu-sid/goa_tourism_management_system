import api from './api';

export const createReview = (reviewData) =>
  api.post('/reviews', reviewData);

export const getReviews = (params = {}) =>
  api.get('/reviews', { params });

export const getMyReviews = () =>
  api.get('/reviews/my-reviews');

export const getReviewsByTarget = (targetType, targetId) =>
  api.get('/reviews', {
    params: { targetType, targetId }
  });

export const getAllReviews = (params = {}) =>
  api.get('/reviews/all', { params });

export const updateReviewStatus = (id, status) =>
  api.patch(`/reviews/${id}/status`, { status });

export const deleteReview = (id) =>
  api.delete(`/reviews/${id}`);
