import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await authService.login(email, password);
      console.log('🔍 AuthContext login response:', response);
      
      // ✅ Check for success response
      if (response && response.success && response.user && response.token) {
        const userData = {
          _id: response.user._id || response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          avatar: response.user.avatar,
          createdAt: response.user.createdAt
        };
        
        // Store in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        console.log('✅ Login successful in AuthContext');
        return { success: true, user: userData };
        
      } else {
        // ❌ Login failed
        const errorMessage = response?.message || response?.error || 'Invalid credentials';
        console.log('❌ Login failed:', errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('💥 Login exception:', error);
      return { 
        success: false, 
        error: error.message || 'Network error. Please check your connection.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      const response = await authService.register(userData);
      console.log('🔍 AuthContext register response:', response);
      
      // ✅ Check for success response
      if (response && response.success && response.user && response.token) {
        const userInfo = {
          _id: response.user._id || response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          avatar: response.user.avatar,
          createdAt: response.user.createdAt
        };
        
        // Store in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);
        
        console.log('✅ Registration successful in AuthContext');
        return { success: true, user: userInfo };
        
      } else {
        // ❌ Registration failed
        const errorMessage = response?.message || response?.error || 'Registration failed';
        console.log('❌ Registration failed:', errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('💥 Registration exception:', error);
      return { 
        success: false, 
        error: error.message || 'Network error. Please check your connection.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
