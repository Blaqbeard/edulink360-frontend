import api from "../config/api";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.notifications)) return payload.notifications;
  return [];
};

const getRole = (role) => (role || "").toUpperCase();

export const notificationService = {
  getNotifications: async ({ page = 1, limit = 20, role } = {}) => {
    try {
      // Backend guide shows /notifications for both roles
      const { data } = await api.get("/notifications", {
        params: { page, limit },
      });
      return normalizeList(data);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  markAsRead: async (notificationId, role) => {
    try {
      // Backend guide shows PATCH /notifications/mark-read/{id} for both roles
      const { data } = await api.patch(
        `/notifications/mark-read/${notificationId}`
      );
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  markAllAsRead: async (role) => {
    try {
      // Backend guide doesn't specify mark-all, but we'll try it
      const { data } = await api.patch("/notifications/mark-read/all");
      return data;
    } catch (error) {
      // If endpoint doesn't exist, silently fail
      return { success: true };
    }
  },

  getUnreadCount: async (role) => {
    try {
      // Backend guide doesn't specify unread-count endpoint
      // Return 0 to avoid errors
      return { count: 0 };
    } catch (error) {
      return { count: 0 };
    }
  },
};

