import api from '../config/api';

// Dashboard Service
export const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/teacher/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get recent submissions
  getRecentSubmissions: async (limit = 10) => {
    try {
      const response = await api.get(`/api/teacher/dashboard/submissions?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get class performance
  getClassPerformance: async () => {
    try {
      const response = await api.get('/api/teacher/dashboard/performance');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

