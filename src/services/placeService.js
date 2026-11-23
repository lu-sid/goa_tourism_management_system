import api from './api';

export const getPlaces = (params = {}) =>
  api.get('/places', { params });

export const getPlaceById = (id) =>
  api.get(`/places/${id}`);

export const searchPlaces = (search) =>
  api.get('/places', { params: { search } });

export const getPlacesByCategory = (category) =>
  api.get('/places', { params: { category } });

export const getPlacesByRegion = (region) =>
  api.get('/places', { params: { region } });

export const createPlace = (placeData) =>
  api.post('/places', placeData);

export const updatePlace = (id, placeData) =>
  api.put(`/places/${id}`, placeData);

export const deletePlace = (id) =>
  api.delete(`/places/${id}`);
