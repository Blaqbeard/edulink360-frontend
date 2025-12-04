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
    // Handle FormData - let Axios set Content-Type with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // Define public endpoints that should NEVER receive Authorization header
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
    
    // For public endpoints, explicitly remove Authorization header
    if (isPublicEndpoint) {
      // Explicitly delete to ensure no token is sent
      delete config.headers.Authorization;
      // Also ensure it's not set elsewhere
      if (config.headers && config.headers.Authorization) {
        delete config.headers.Authorization;
      }
    } else {
      // For protected endpoints, add token if available
      // Support both token names for compatibility
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
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
      // Clear both token formats for compatibility
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signup';
    }
    return Promise.reject(error);
  }
);

export default api;
export { BASE_URL };

