
import api from './api';

const restaurantService = {
  async getRestaurants(params = {}) {
    const response = await api.get('/restaurants', { params });
    return response.data;
  },

  async getRestaurantById(id) {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },

  async searchRestaurants(searchTerm) {
    const response = await api.get('/restaurants', {
      params: { search: searchTerm },
    });

    return response.data;
  },

  async getRestaurantsByCuisine(cuisine) {
    const response = await api.get('/restaurants', {
      params: { cuisine },
    });

    return response.data;
  },

  async getRestaurantsByLocation(location) {
    const response = await api.get('/restaurants', {
      params: { location },
    });

    return response.data;
  },

  async createRestaurant(restaurantData) {
    const response = await api.post('/restaurants', restaurantData);
    return response.data;
  },

  async updateRestaurant(id, restaurantData) {
    const response = await api.put(
      `/restaurants/${id}`,
      restaurantData
    );

    return response.data;
  },

  async deleteRestaurant(id) {
    const response = await api.delete(`/restaurants/${id}`);
    return response.data;
  },
};

export default restaurantService;
