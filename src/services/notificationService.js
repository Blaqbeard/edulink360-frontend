import api from "../config/api";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.notifications)) return payload.notifications;
  return [];
};

export const notificationService = {
  /**
   * GET /notifications
   */
  getNotifications: async ({ page = 1, limit = 20 } = {}) => {
    try {
      const { data } = await api.get("/notifications", {
        params: { page, limit },
      });
      return normalizeList(data);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * PATCH /notifications/mark-read/{id}
   */
  markAsRead: async (notificationId) => {
    try {
      const { data } = await api.patch(
        `/notifications/mark-read/${notificationId}`
      );
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * PATCH /notifications/mark-read/all
   */
  markAllAsRead: async () => {
    try {
      const { data } = await api.patch("/notifications/mark-read/all");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * GET /notifications/unread-count
   */
  getUnreadCount: async () => {
    try {
      const { data } = await api.get("/notifications/unread-count");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

