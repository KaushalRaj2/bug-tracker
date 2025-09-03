import api from './api';

class AuthService {
  async login(email, password) {
    try {
      console.log('🌐 API login request:', { email });
      const response = await api.post('/auth/login', { email, password });
      console.log('🌐 API login response:', response.data);
      
      // Handle different response formats from backend
      const data = response.data;
      
      // ✅ SUCCESS: Backend returns success response
      if (data.success || (data.token && data.user)) {
        return {
          success: true,
          token: data.token,
          user: data.user,
          message: data.message || 'Login successful'
        };
      } else {
        // ❌ FAILURE: Backend returns error
        return {
          success: false,
          error: data.message || data.error || 'Login failed'
        };
      }
    } catch (error) {
      console.error('🚨 API login error:', error);
      
      // Handle different error formats
      if (error.response?.data) {
        const errorData = error.response.data;
        return {
          success: false,
          error: errorData.message || errorData.error || 'Invalid credentials'
        };
      } else if (error.message) {
        return {
          success: false,
          error: error.message
        };
      } else {
        return {
          success: false,
          error: 'Network error. Please check your connection.'
        };
      }
    }
  }

  async register(userData) {
    try {
      console.log('🌐 API register request:', { ...userData, password: '[hidden]' });
      const response = await api.post('/auth/register', userData);
      console.log('🌐 API register response:', response.data);
      
      const data = response.data;
      
      // ✅ SUCCESS: Backend returns success response
      if (data.success || (data.token && data.user)) {
        return {
          success: true,
          token: data.token,
          user: data.user,
          message: data.message || 'Registration successful'
        };
      } else {
        // ❌ FAILURE: Backend returns error
        return {
          success: false,
          error: data.message || data.error || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('🚨 API register error:', error);
      
      // Handle different error formats
      if (error.response?.data) {
        const errorData = error.response.data;
        return {
          success: false,
          error: errorData.message || errorData.error || 'Registration failed'
        };
      } else if (error.message) {
        return {
          success: false,
          error: error.message
        };
      } else {
        return {
          success: false,
          error: 'Network error. Please check your connection.'
        };
      }
    }
  }

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Logout error:', error);
    }
  }

  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to change password');
    }
  }
}

const authService = new AuthService();
export { authService };
