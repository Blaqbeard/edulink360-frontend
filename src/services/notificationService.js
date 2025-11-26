import api from '../config/api';

// Notifications Service
export const notificationService = {
  // Get all notifications
  getNotifications: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/api/teacher/notifications?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/api/teacher/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.put('/api/teacher/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/api/teacher/notifications/unread-count');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

