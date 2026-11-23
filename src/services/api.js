
import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the authentication token to requests automatically.
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

// Handle common API errors.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'The request timed out. Please try again.';
    } else if (!error.response) {
      error.message =
        'Unable to connect to the server. Please check your connection.';
    } else if (error.response.status === 401) {
      // Keep the user on the page; authentication UI can handle this.
      console.warn('Authentication required or session expired.');
    }

    return Promise.reject(error);
  }
);

// Consistent error message for components.
export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
};

export default api;
