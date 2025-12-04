import api from '../config/api';

// Settings Service
export const settingsService = {
  // Get teacher settings
  getSettings: async () => {
    try {
      const response = await api.get('/api/teacher/settings');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update teacher settings
  updateSettings: async (settingsData) => {
    try {
      const response = await api.put('/api/teacher/settings', settingsData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    try {
      const response = await api.put('/api/teacher/settings/notifications', preferences);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};





