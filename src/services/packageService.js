import api from './api';

export const getPackages = (params = {}) =>
  api.get('/packages', { params });

export const getAdminPackages = () =>
  api.get('/packages/admin/all');

export const getPackageById = (id) =>
  api.get(`/packages/${id}`);

export const searchPackages = (search) =>
  api.get('/packages', { params: { search } });

export const getPackagesByCategory = (category) =>
  api.get('/packages', { params: { category } });

export const createPackage = (packageData) =>
  api.post('/packages', packageData);

export const updatePackage = (id, packageData) =>
  api.put(`/packages/${id}`, packageData);

export const deletePackage = (id) =>
  api.delete(`/packages/${id}`);