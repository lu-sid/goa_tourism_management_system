import api from './api';

const TOKEN_KEY = 'sushegad_token';
const USER_KEY = 'sushegad_user';

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);

  if (response.data?.token) {
    localStorage.setItem(TOKEN_KEY, response.data.token);
  }

  if (response.data?.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
  }

  return response;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);

  if (response.data?.token) {
    localStorage.setItem(TOKEN_KEY, response.data.token);
  }

  if (response.data?.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
  }

  return response;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(USER_KEY);

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const getProfile = () => api.get('/users/profile');

export const updateProfile = (userData) =>
  api.put('/users/profile', userData);

export const isAuthenticated = () =>
  Boolean(localStorage.getItem(TOKEN_KEY));

export const getToken = () =>
  localStorage.getItem(TOKEN_KEY);
