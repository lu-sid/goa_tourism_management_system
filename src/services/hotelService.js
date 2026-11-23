import api from './api';

export const getHotels = (params = {}) =>
  api.get('/hotels', { params });

export const getHotelById = (id) =>
  api.get(`/hotels/${id}`);

export const searchHotels = (search) =>
  api.get('/hotels', { params: { search } });

export const getHotelsByLocation = (city) =>
  api.get('/hotels', { params: { city } });

export const createHotel = (hotelData) =>
  api.post('/hotels', hotelData);

export const updateHotel = (id, hotelData) =>
  api.put(`/hotels/${id}`, hotelData);

export const deleteHotel = (id) =>
  api.delete(`/hotels/${id}`);
