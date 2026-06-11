import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://accessiscan-api-ccge.onrender.com';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/api/auth/register', { name, email, password }),
};

export const scanAPI = {
  scanUrl: (url: string) => api.post('/api/scan/url', { url }),
  scanHtml: (html: string) => api.post('/api/scan/html', { html }),
  getHistory: () => api.get('/api/scan/history'),
};

export default api;
