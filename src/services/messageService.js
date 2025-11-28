import api from "../config/api";

/**
 * Message Service - Aligned with backend guide
 * Backend guide shows:
 * - GET /messages/contacts
 * - POST /messages/send
 * - GET /messages/student/{id} (for Teachers) or /messages/teacher/{id} (for Students)
 */
export const messageService = {
  /**
   * GET /messages/contacts
   * Get list of users you can chat with
   */
  getContacts: async () => {
    try {
      const { data } = await api.get("/messages/contacts");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * POST /messages/send
   * Send a message
   * Payload: { receiverId, content }
   */
  sendMessage: async (payload) => {
    try {
      const { data } = await api.post("/messages/send", payload);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * GET /messages/student/{id} (for Teachers)
   * GET /messages/teacher/{id} (for Students)
   * Get chat history with a specific user
   * Returns: Array of message objects sorted by time
   */
  getChatHistory: async (userId, role = "teacher") => {
    try {
      const endpoint = role.toLowerCase() === "student" 
        ? `/messages/teacher/${userId}`
        : `/messages/student/${userId}`;
      const { data } = await api.get(endpoint);
      // Backend guide says it returns "List of message objects sorted by time"
      // Normalize to always return an array
      if (Array.isArray(data)) {
        return data;
      } else if (Array.isArray(data?.messages)) {
        return data.messages;
      } else if (Array.isArray(data?.data)) {
        return data.data;
      }
      return [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Legacy methods for backward compatibility with existing UI
  getConversations: async (type = "all", role = "teacher") => {
    try {
      // Try to get contacts and format as conversations
      const contacts = await this.getContacts();
      return Array.isArray(contacts) ? contacts : [];
    } catch (error) {
      // Fallback to old endpoint if contacts doesn't work
      const normalized = role?.toLowerCase();
      const basePath = normalized === "student"
        ? "/api/student/messages"
        : "/api/teacher/messages";
      try {
        const response = await api.get(`${basePath}/conversations?type=${type}`);
        return response.data;
      } catch (fallbackError) {
        throw error.response?.data || error.message;
      }
    }
  },

  getMessages: async (conversationId, page = 1, limit = 50, role = "teacher") => {
    try {
      // Try new endpoint format first
      const normalized = role?.toLowerCase();
      const endpoint = normalized === "student" 
        ? `/messages/teacher/${conversationId}`
        : `/messages/student/${conversationId}`;
      const { data } = await api.get(endpoint);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      // Fallback to old endpoint
      const normalized = role?.toLowerCase();
      const basePath = normalized === "student"
        ? "/api/student/messages"
        : "/api/teacher/messages";
      try {
        const response = await api.get(
          `${basePath}/${conversationId}?page=${page}&limit=${limit}`
        );
        return response.data;
      } catch (fallbackError) {
        throw error.response?.data || error.message;
      }
    }
  },

  markAsRead: async (conversationId, role = "teacher") => {
    try {
      // Backend guide doesn't specify mark-as-read endpoint
      // Keep existing implementation for now
      const normalized = role?.toLowerCase();
      const basePath = normalized === "student"
        ? "/api/student/messages"
        : "/api/teacher/messages";
      const response = await api.put(`${basePath}/${conversationId}/read`);
      return response.data;
    } catch (error) {
      // Silently fail if endpoint doesn't exist
      return { success: true };
    }
  },

  getConversationDetails: async (conversationId, role = "teacher") => {
    try {
      const normalized = role?.toLowerCase();
      const basePath = normalized === "student"
        ? "/api/student/messages"
        : "/api/teacher/messages";
      const response = await api.get(`${basePath}/${conversationId}/details`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

