import api from '../config/api';

// Dashboard Service – aligns with backend integration guide
export const dashboardService = {
  /**
   * Get teacher dashboard overview (stats + recent submissions)
   * Endpoint: GET /teacher/dashboard-stats
   */
  getTeacherDashboard: async () => {
    try {
      const { data } = await api.get('/teacher/dashboard-stats');
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get teacher classes list – useful for class counts or future views
   * Endpoint: GET /teacher/classes
   */
  getTeacherClasses: async () => {
    try {
      const { data } = await api.get('/teacher/classes');
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
