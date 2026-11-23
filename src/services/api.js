import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sushegad_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sushegad_token');
      localStorage.removeItem('sushegad_user');
    }

    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  'Something went wrong. Please try again.';

export default api;
