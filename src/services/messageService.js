import api from '../config/api';

// Messages Service
export const messageService = {
  // Get all conversations (groups, students, favorites, unread)
  getConversations: async (type = 'all') => {
    try {
      const response = await api.get(`/api/teacher/messages/conversations?type=${type}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId, page = 1, limit = 50) => {
    try {
      const response = await api.get(
        `/api/teacher/messages/${conversationId}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Send a message
  sendMessage: async (conversationId, messageData) => {
    try {
      const response = await api.post(`/api/teacher/messages/${conversationId}`, messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark conversation as read
  markAsRead: async (conversationId) => {
    try {
      const response = await api.put(`/api/teacher/messages/${conversationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get conversation details
  getConversationDetails: async (conversationId) => {
    try {
      const response = await api.get(`/api/teacher/messages/${conversationId}/details`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

