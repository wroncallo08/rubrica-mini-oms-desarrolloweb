import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('oms_token');
    const savedUser = localStorage.getItem('oms_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('oms_token');
        localStorage.removeItem('oms_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      
      setUser(data.user);
      setToken(data.token);
      
      localStorage.setItem('oms_token', data.token);
      localStorage.setItem('oms_user', JSON.stringify(data.user));
      
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authService.register(name, email, password, "user");
      
      setUser(data.user);
      setToken(data.token);
      
      localStorage.setItem('oms_token', data.token);
      localStorage.setItem('oms_user', JSON.stringify(data.user));
      
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('oms_token');
    localStorage.removeItem('oms_user');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, error, login, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
