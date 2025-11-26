import axios from 'axios';

// Base URL for the backend API
const BASE_URL = 'https://flexisaf-edulink360-backend.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    const publicEndpoints = [
      '/auth/register',
      '/auth/signup',
      '/auth/login',
      '/api/auth/register',
      '/api/auth/signup',
      '/api/auth/login',
    ];
    
    const requestUrl = config.url || '';
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      requestUrl.includes(endpoint)
    );
    
    if (isPublicEndpoint) {
      delete config.headers.Authorization;
    } else {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/signup';
    }
    return Promise.reject(error);
  }
);

export default api;
export { BASE_URL };

