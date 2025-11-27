import api from "../config/api";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.notifications)) return payload.notifications;
  return [];
};

const getRole = (role) => (role || "").toUpperCase();

const getTeacherPath = (suffix = "") =>
  `/api/teacher/notifications${suffix}`;

export const notificationService = {
  getNotifications: async ({ page = 1, limit = 20, role } = {}) => {
    try {
      if (getRole(role) === "TEACHER") {
        const { data } = await api.get(
          `${getTeacherPath(`?page=${page}&limit=${limit}`)}`
        );
        return normalizeList(data);
      }
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
      if (getRole(role) === "TEACHER") {
        const { data } = await api.put(
          getTeacherPath(`/${notificationId}/read`)
        );
        return data;
      }
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
      if (getRole(role) === "TEACHER") {
        const { data } = await api.put(getTeacherPath("/read-all"));
        return data;
      }
      const { data } = await api.patch("/notifications/mark-read/all");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUnreadCount: async (role) => {
    try {
      if (getRole(role) === "TEACHER") {
        const { data } = await api.get(getTeacherPath("/unread-count"));
        return data;
      }
      const { data } = await api.get("/notifications/unread-count");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

