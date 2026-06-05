import api from './api';

const authService = {
  async register(data) {
    const response = await api.post('/auth/registro', data);
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getToken() {
    return localStorage.getItem('authToken');
  },

  removeToken() {
    localStorage.removeItem('authToken');
  },
};

export default authService;
