import api from './api';

export const createBooking = (bookingData) =>
  api.post('/bookings', bookingData);

export const getMyBookings = () =>
  api.get('/bookings/my-bookings');

export const getAllBookings = (params = {}) =>
  api.get('/bookings', { params });

export const getBookingById = (id) =>
  api.get(`/bookings/${id}`);

export const cancelBooking = (id) =>
  api.patch(`/bookings/${id}/cancel`);

export const updateBookingStatus = (id, status) =>
  api.patch(`/bookings/${id}/status`, { status });
