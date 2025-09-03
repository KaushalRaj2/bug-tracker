import React, { createContext, useContext, useState, useCallback } from 'react';
import { bugService } from '../services/bugService';
import toast from 'react-hot-toast';

const BugContext = createContext();

export const useBugs = () => {
  const context = useContext(BugContext);
  if (!context) {
    throw new Error('useBugs must be used within a BugProvider');
  }
  return context;
};

export const BugProvider = ({ children }) => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });

  const fetchBugs = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bugService.getBugs({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });
      
      setBugs(response.bugs || []);
      setPagination({
        page: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        total: response.totalBugs || 0,
        limit: pagination.limit
      });
    } catch (error) {
      console.error('Error fetching bugs:', error);
      setError(error.message || 'Failed to fetch bugs');
      toast.error('Failed to load bugs');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  const createBug = async (bugData) => {
    try {
      setLoading(true);
      const response = await bugService.createBug(bugData);
      
      if (response.success) {
        setBugs(prev => [response.bug, ...prev]);
        toast.success('Bug created successfully');
        return { success: true, bug: response.bug };
      } else {
        toast.error(response.message || 'Failed to create bug');
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to create bug';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateBug = async (id, updates) => {
    try {
      setLoading(true);
      const response = await bugService.updateBug(id, updates);
      
      if (response.success) {
        setBugs(prev => prev.map(bug => 
          bug._id === id ? { ...bug, ...response.bug } : bug
        ));
        toast.success('Bug updated successfully');
        return { success: true, bug: response.bug };
      } else {
        toast.error(response.message || 'Failed to update bug');
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to update bug';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const deleteBug = async (id) => {
    try {
      setLoading(true);
      const response = await bugService.deleteBug(id);
      
      if (response.success) {
        setBugs(prev => prev.filter(bug => bug._id !== id));
        toast.success('Bug deleted successfully');
        return { success: true };
      } else {
        toast.error(response.message || 'Failed to delete bug');
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to delete bug';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const getBugById = (id) => {
    return bugs.find(bug => bug._id === id);
  };

  const clearError = () => setError(null);

  const value = {
    bugs,
    loading,
    error,
    pagination,
    fetchBugs,
    createBug,
    updateBug,
    deleteBug,
    getBugById,
    clearError
  };

  return (
    <BugContext.Provider value={value}>
      {children}
    </BugContext.Provider>
  );
};
