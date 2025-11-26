import api from '../config/api';

// Profile Service
export const profileService = {
  // Get teacher profile
  getProfile: async () => {
    try {
      const response = await api.get('/api/teacher/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update teacher profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/teacher/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const response = await api.post('/api/teacher/profile/picture', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

