
import api from './api';

const packageService = {
  async getPackages(params = {}) {
    const response = await api.get('/packages', { params });
    return response.data;
  },

  async getPackageById(id) {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },

  async searchPackages(searchTerm) {
    const response = await api.get('/packages', {
      params: { search: searchTerm },
    });

    return response.data;
  },

  async getPackagesByCategory(category) {
    const response = await api.get('/packages', {
      params: { category },
    });

    return response.data;
  },

  async createPackage(packageData) {
    const response = await api.post('/packages', packageData);
    return response.data;
  },

  async updatePackage(id, packageData) {
    const response = await api.put(
      `/packages/${id}`,
      packageData
    );

    return response.data;
  },

  async deletePackage(id) {
    const response = await api.delete(`/packages/${id}`);
    return response.data;
  },
};

export default packageService;
