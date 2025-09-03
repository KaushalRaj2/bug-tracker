import axios from 'axios';

// Use environment variable with proper fallbacks
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://bug-tracker-api.onrender.com/api'  // Production backend URL
    : 'http://localhost:5000/api'                 // Local development (port 5000)
  );

console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🔧 Environment:', import.meta.env.PROD ? 'Production' : 'Development');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for production
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(`❌ ${error.config?.method?.toUpperCase() || 'REQUEST'} ${error.config?.url || 'UNKNOWN'}:`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });

    // Handle different error types
    if (error.code === 'ECONNABORTED') {
      console.error('🕐 Request timeout - Backend may be slow or down');
      error.message = 'Request timeout. The server is taking too long to respond.';
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network error - Backend not reachable');
      error.message = 'Network error. Cannot connect to the server.';
    } else if (!error.response) {
      console.error('🔌 No response from server');
      error.message = import.meta.env.PROD 
        ? 'Server is currently unavailable. Please try again later.'
        : 'Cannot connect to server. Please check if the backend is running on port 5000.';
    }

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      console.warn('🔐 Unauthorized - redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect in development to avoid issues
      if (import.meta.env.PROD) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
