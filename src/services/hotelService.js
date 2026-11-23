
import api from './api';

const hotelService = {
  async getHotels(params = {}) {
    const response = await api.get('/hotels', { params });
    return response.data;
  },

  async getHotelById(id) {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  },

  async searchHotels(searchTerm) {
    const response = await api.get('/hotels', {
      params: { search: searchTerm },
    });

    return response.data;
  },

  async getHotelsByLocation(location) {
    const response = await api.get('/hotels', {
      params: { location },
    });

    return response.data;
  },

  async getHotelsByPrice(minPrice, maxPrice) {
    const response = await api.get('/hotels', {
      params: { minPrice, maxPrice },
    });

    return response.data;
  },

  async createHotel(hotelData) {
    const response = await api.post('/hotels', hotelData);
    return response.data;
  },

  async updateHotel(id, hotelData) {
    const response = await api.put(`/hotels/${id}`, hotelData);
    return response.data;
  },

  async deleteHotel(id) {
    const response = await api.delete(`/hotels/${id}`);
    return response.data;
  },
};

export default hotelService;
