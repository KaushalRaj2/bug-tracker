import api from './api';

export const bugService = {
  // Get all bugs with optional filters
  getBugs: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const url = params.toString() ? `/bugs?${params.toString()}` : '/bugs';
      const response = await api.get(url);
      
      return {
        success: true,
        bugs: response.data.bugs || response.data || [],
        total: response.data.total || 0
      };
    } catch (error) {
      console.error('❌ Get bugs error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch bugs',
        bugs: []
      };
    }
  },

  // Get single bug by ID
  getBug: async (id) => {
    try {
      const response = await api.get(`/bugs/${id}`);
      return {
        success: true,
        bug: response.data.bug || response.data
      };
    } catch (error) {
      console.error('❌ Get bug error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Bug not found'
      };
    }
  },

  // Create new bug
  createBug: async (bugData) => {
    try {
      console.log('🌐 API: Creating bug', bugData);
      const response = await api.post('/bugs', bugData);
      console.log('✅ Create bug API response:', response.data);
      
      return {
        success: true,
        bug: response.data.bug || response.data,
        message: response.data.message || 'Bug created successfully'
      };
    } catch (error) {
      console.error('❌ Create bug error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create bug'
      };
    }
  },

  // Update bug
  updateBug: async (id, updates) => {
    try {
      console.log('🌐 API: Updating bug', id, updates);
      const response = await api.put(`/bugs/${id}`, updates);
      console.log('✅ Update bug API response:', response.data);
      
      return {
        success: true,
        bug: response.data.bug || response.data,
        message: response.data.message || 'Bug updated successfully'
      };
    } catch (error) {
      console.error('❌ Update bug error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update bug'
      };
    }
  },

  // Delete bug
  deleteBug: async (id) => {
    try {
      const response = await api.delete(`/bugs/${id}`);
      return {
        success: true,
        message: response.data.message || 'Bug deleted successfully'
      };
    } catch (error) {
      console.error('❌ Delete bug error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete bug'
      };
    }
  },

  // Get bug statistics
  getStats: async () => {
    try {
      const response = await api.get('/bugs/stats');
      return {
        success: true,
        ...response.data
      };
    } catch (error) {
      console.error('❌ Get stats error:', error);
      return {
        success: false,
        error: error.message,
        overview: {
          total: 0,
          open: 0,
          inProgress: 0,
          closed: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0
        }
      };
    }
  },

  // Add comment to bug
  addComment: async (bugId, commentData) => {
    try {
      const response = await api.post(`/bugs/${bugId}/comments`, commentData);
      return {
        success: true,
        comment: response.data.comment || response.data,
        message: response.data.message || 'Comment added successfully'
      };
    } catch (error) {
      console.error('❌ Add comment error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to add comment'
      };
    }
  },

  // Update comment
  updateComment: async (bugId, commentId, updates) => {
    try {
      const response = await api.put(`/bugs/${bugId}/comments/${commentId}`, updates);
      return {
        success: true,
        comment: response.data.comment || response.data,
        message: response.data.message || 'Comment updated successfully'
      };
    } catch (error) {
      console.error('❌ Update comment error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update comment'
      };
    }
  },

  // Delete comment
  deleteComment: async (bugId, commentId) => {
    try {
      const response = await api.delete(`/bugs/${bugId}/comments/${commentId}`);
      return {
        success: true,
        message: response.data.message || 'Comment deleted successfully'
      };
    } catch (error) {
      console.error('❌ Delete comment error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete comment'
      };
    }
  }
};
