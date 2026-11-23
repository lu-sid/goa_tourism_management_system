import api from './api';

export const createPayment = (paymentData) =>
  api.post('/payments', paymentData);

export const getMyPayments = () =>
  api.get('/payments/my-payments');

export const getAllPayments = (params = {}) =>
  api.get('/payments', { params });

export const getPaymentById = (id) =>
  api.get(`/payments/${id}`);

export const updatePaymentStatus = (id, status) =>
  api.patch(`/payments/${id}/status`, { status });
