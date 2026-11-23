import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getCurrentUser,
  isAuthenticated
} from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      setUser(null);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);

    try {
      const response = await loginService(credentials);
      const loggedInUser = response.data.user;

      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);

    try {
      const response = await registerService(userData);
      const registeredUser = response.data.user;

      setUser(registeredUser);
      return registeredUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    logoutService();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user && isAuthenticated()),
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout
  }), [user, loading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
