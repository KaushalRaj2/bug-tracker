import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased from 10000 to 30000ms
  headers: {
    'Content-Type': 'application/json',
  },
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
      console.error('🕐 Request timeout - Backend may be down');
      error.message = 'Request timeout. Please check if the backend server is running.';
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network error - Backend not reachable');
      error.message = 'Network error. Please check your backend server connection.';
    } else if (!error.response) {
      console.error('🔌 No response from server');
      error.message = 'Cannot connect to server. Please check if the backend is running on port 5000.';
    }

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      console.warn('🔐 Unauthorized - redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
