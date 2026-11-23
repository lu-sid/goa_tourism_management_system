
import api from './api';

const TOKEN_KEY = 'sushegad_token';
const USER_KEY = 'sushegad_user';

const saveAuthData = (response) => {
  const result = response.data?.data ?? response.data;

  const token = result?.token || result?.accessToken;
  const user = result?.user;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  return result;
};

const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return saveAuthData(response);
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return saveAuthData(response);
  },

  async logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  async getProfile() {
    const response = await api.get('/users/profile');
    const result = response.data?.data ?? response.data;

    if (result?.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    } else if (result && !Array.isArray(result)) {
      localStorage.setItem(USER_KEY, JSON.stringify(result));
    }

    return result;
  },

  async updateProfile(userData) {
    const response = await api.put('/users/profile', userData);
    const result = response.data?.data ?? response.data;

    const user = result?.user || result;

    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return result;
  },

  getCurrentUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
};

export default authService;
