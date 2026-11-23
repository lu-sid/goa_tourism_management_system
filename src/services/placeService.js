
import api from './api';

const placeService = {
  async getPlaces(params = {}) {
    const response = await api.get('/places', { params });
    return response.data;
  },

  async getPlaceById(id) {
    const response = await api.get(`/places/${id}`);
    return response.data;
  },

  async searchPlaces(searchTerm) {
    const response = await api.get('/places', {
      params: { search: searchTerm },
    });

    return response.data;
  },

  async getPlacesByCategory(category) {
    const response = await api.get('/places', {
      params: { category },
    });

    return response.data;
  },

  async getPlacesByRegion(region) {
    const response = await api.get('/places', {
      params: { region },
    });

    return response.data;
  },

  async createPlace(placeData) {
    const response = await api.post('/places', placeData);
    return response.data;
  },

  async updatePlace(id, placeData) {
    const response = await api.put(`/places/${id}`, placeData);
    return response.data;
  },

  async deletePlace(id) {
    const response = await api.delete(`/places/${id}`);
    return response.data;
  },
};

export default placeService;
