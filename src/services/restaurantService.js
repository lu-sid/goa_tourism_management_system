import api from './api';

export const getRestaurants = (params = {}) =>
  api.get('/restaurants', { params });

export const getRestaurantById = (id) =>
  api.get(`/restaurants/${id}`);

export const searchRestaurants = (search) =>
  api.get('/restaurants', { params: { search } });

export const getRestaurantsByCuisine = (cuisine) =>
  api.get('/restaurants', { params: { cuisine } });

export const getRestaurantsByLocation = (city) =>
  api.get('/restaurants', { params: { city } });

export const createRestaurant = (restaurantData) =>
  api.post('/restaurants', restaurantData);

export const updateRestaurant = (id, restaurantData) =>
  api.put(`/restaurants/${id}`, restaurantData);

export const deleteRestaurant = (id) =>
  api.delete(`/restaurants/${id}`);
