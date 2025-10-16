import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string; phone?: string }) =>
    api.post('/auth/register', data),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  getMe: () => api.get('/auth/me'),

  updateProfile: (data: { name?: string; phone?: string; avatar?: string }) =>
    api.put('/auth/profile', data)
};

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events'),

  getById: (id: string) => api.get(`/events/${id}`),

  create: (data: any) => api.post('/events', data),

  update: (id: string, data: any) => api.put(`/events/${id}`, data),

  delete: (id: string) => api.delete(`/events/${id}`),

  getStats: (id: string) => api.get(`/events/${id}/stats`)
};

// Guests API
export const guestsAPI = {
  getInvitation: (eventId: string, confirmationCode: string) =>
    api.get(`/guests/invitation/${eventId}/${confirmationCode}`),

  confirmAttendance: (eventId: string, confirmationCode: string, data: { companions?: number; menuType?: string }) =>
    api.post(`/guests/confirm/${eventId}/${confirmationCode}`, data),

  markAttended: (eventId: string, guestId: string) =>
    api.post(`/guests/${eventId}/${guestId}/attend`),

  addGuest: (eventId: string, data: { name: string; phone: string; email?: string }) =>
    api.post(`/guests/${eventId}/guests`, data)
};

export default api;
