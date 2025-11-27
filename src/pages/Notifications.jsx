import { useEffect, useState } from "react";
import { notificationService } from "../services/notificationService";
import { useNotifications } from "../context/NotificationContext";

const iconClasses = {
  submission: { icon: "bi-file-earmark-check", color: "bg-blue-100 text-blue-600" },
  message: { icon: "bi-chat-dots", color: "bg-green-100 text-green-600" },
  feedback: { icon: "bi-chat-square-text", color: "bg-orange-100 text-orange-600" },
  deadline: { icon: "bi-clock", color: "bg-yellow-100 text-yellow-600" },
  grade: { icon: "bi-check-circle", color: "bg-purple-100 text-purple-600" },
  announcement: { icon: "bi-megaphone", color: "bg-indigo-100 text-indigo-600" },
};

const formatTime = (dateString) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [statusMessage, setStatusMessage] = useState(null);
  const { refreshCount } = useNotifications();
  const role = "student";

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await notificationService.getNotifications({
        page: 1,
        limit: 50,
        role,
      });
      setNotifications(list);
      refreshCount?.();
    } catch (err) {
      setError(
        err?.message ||
          err?.response?.data?.message ||
          "Unable to load notifications right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId, role);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setStatusMessage("Notification marked as read.");
    } catch (err) {
      setStatusMessage(
        err?.message || "Could not update the notification. Please try again."
      );
    }
  };

  const handleMarkAll = async () => {
    try {
      await notificationService.markAllAsRead(role);
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
      setStatusMessage("All notifications marked as read.");
    } catch (err) {
      setStatusMessage(
        err?.message || "Could not update notifications. Please try again."
      );
    }
  };

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((notif) =>
          filter === "unread" ? !notif.read : notif.type === filter
        );

  return (
    <div className="w-full max-w-5xl p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500">
            Stay on top of assignment updates, grades, and announcements.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="submission">Submissions</option>
            <option value="deadline">Deadlines</option>
            <option value="feedback">Feedback</option>
            <option value="grade">Grades</option>
            <option value="announcement">Announcements</option>
          </select>
          <button
            onClick={handleMarkAll}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mark all as read
          </button>
          <button
            onClick={fetchNotifications}
            className="px-4 py-2 border border-blue-600 text-blue-600 text-sm rounded-lg hover:bg-blue-50 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-sm">
          {statusMessage}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        </div>
      ) : error ? (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="py-16 text-center text-gray-500 border border-dashed border-gray-200 rounded-xl">
          No notifications to show.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notif) => {
            const visual = iconClasses[notif.type] || {
              icon: "bi-bell",
              color: "bg-gray-100 text-gray-600",
            };
            return (
              <div
                key={notif.id}
                className={`flex items-start gap-4 p-4 rounded-xl border ${
                  notif.read ? "bg-white border-gray-100" : "bg-blue-50 border-blue-100"
                }`}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full text-xl ${visual.color}`}
                >
                  <i className={`bi ${visual.icon}`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                      <p className="text-sm text-gray-600">{notif.message}</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {formatTime(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="mt-3 text-sm font-medium text-blue-600 hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

