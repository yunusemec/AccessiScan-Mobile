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
  register: (email: string, password: string) =>
    api.post('/api/auth/register', { email, password }),
  me: () => api.get('/api/auth/me'),
};

export const analyzeAPI = {
  analyze: (type: 'url' | 'html', content: string) =>
    api.post('/api/analyze', { type, content }),
  history: () => api.get('/api/analyze/history'),
  historyDetail: (id: string) => api.get(`/api/analyze/history/${id}`),
};

export const aiAPI = {
  chat: (message: string, analysisId?: string) =>
    api.post('/api/ai/chat', { message, ...(analysisId ? { analysisId } : {}) }),
};

export const paymentAPI = {
  createCheckout: (plan: 'STARTER' | 'PRO') =>
    api.post('/api/payment/create-checkout', { plan }),
  cancelSubscription: () => api.delete('/api/payment/cancel-subscription'),
  reactivate: () => api.post('/api/payment/reactivate'),
};

export default api;
