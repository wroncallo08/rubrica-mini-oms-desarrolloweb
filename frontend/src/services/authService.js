import api from './api';

export const authService = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },
  register: async (name, email, password, role) => {
    return api.post('/auth/register', { name, email, password, role });
  }
};

export default authService;
