

import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUsers(filters);
      setUsers(response.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError(error.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDevelopers = useCallback(async () => {
    try {
      console.log('🔍 Fetching developers...');
      const response = await userService.getDevelopers();
      console.log('👥 Developers response:', response);
      return response.users || response || []; // Handle different response formats
    } catch (error) {
      console.error('❌ Failed to fetch developers:', error);
      // Return empty array instead of throwing
      return [];
    }
  }, []);

  const createUser = async (userData) => {
    try {
      setLoading(true);
      const response = await userService.createUser(userData);
      if (response.success) {
        await fetchUsers(); // Refresh list
        return { success: true, user: response.user };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      setLoading(true);
      const response = await userService.updateUser(userId, userData);
      if (response.success) {
        await fetchUsers(); // Refresh list
        return { success: true, user: response.user };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      setLoading(true);
      await userService.deleteUser(userId);
      await fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    getDevelopers,
    createUser,
    updateUser,
    deleteUser
  };
};


export default useUsers;
