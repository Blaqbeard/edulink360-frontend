import api from "../config/api";

const getBasePath = (role = "teacher") => {
  const normalized = role?.toLowerCase();
  return normalized === "student"
    ? "/api/student/messages"
    : "/api/teacher/messages";
};

export const messageService = {
  getConversations: async (type = "all", role = "teacher") => {
    try {
      const response = await api.get(
        `${getBasePath(role)}/conversations?type=${type}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMessages: async (conversationId, page = 1, limit = 50, role = "teacher") => {
    try {
      const response = await api.get(
        `${getBasePath(role)}/${conversationId}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  sendMessage: async (conversationId, messageData, role = "teacher") => {
    try {
      const response = await api.post(
        `${getBasePath(role)}/${conversationId}`,
        messageData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  markAsRead: async (conversationId, role = "teacher") => {
    try {
      const response = await api.put(
        `${getBasePath(role)}/${conversationId}/read`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getConversationDetails: async (conversationId, role = "teacher") => {
    try {
      const response = await api.get(
        `${getBasePath(role)}/${conversationId}/details`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

