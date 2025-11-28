const NOTIFICATION_KEY = "edulink360:teacher-notifications";
const ONE_DAY = 1000 * 60 * 60 * 24;

const canUseStorage = () => typeof window !== "undefined" && !!window.localStorage;

const readStorage = (key, fallback = []) => {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage quota errors silently
  }
};

const freshnessFilter = (entry, ttl = ONE_DAY) => Date.now() - entry.timestamp < ttl;

const buildNotification = ({ type, assignmentId, title, message, studentName }) => ({
  id: `local-${type}-${assignmentId || Date.now()}-${Date.now()}`,
  assignmentId,
  type,
  title: title || (type === "assignment_created" ? "Assignment created" : "Assignment submitted"),
  message:
    message ||
    (type === "assignment_created"
      ? "Your assignment has been posted successfully."
      : studentName
      ? `${studentName} submitted an assignment.`
      : "A student submitted an assignment."),
  createdAt: new Date().toISOString(),
  read: false,
  expiresAt: Date.now() + ONE_DAY,
  timestamp: Date.now(),
});

export const teacherNotificationCache = {
  getNotifications() {
    return readStorage(NOTIFICATION_KEY).filter(
      (entry) => Date.now() < (entry.expiresAt || 0) || !entry.expiresAt
    );
  },

  addNotification({ type, assignmentId, title, message, studentName }) {
    if (!type) return this.getNotifications();
    const list = this.getNotifications();
    // Avoid duplicates for the same assignment/type within a short time window
    // Only check duplicates if assignmentId is provided
    if (assignmentId) {
      const isDuplicate = list.some(
        (entry) =>
          entry.type === type &&
          entry.assignmentId === assignmentId &&
          Date.now() - (entry.timestamp || Date.parse(entry.createdAt) || 0) < 60000 // 1 minute window
      );
      if (isDuplicate) return list;
    }
    const newNotification = buildNotification({ type, assignmentId, title, message, studentName });
    list.unshift(newNotification);
    writeStorage(NOTIFICATION_KEY, list);
    console.log("Teacher notification added:", newNotification);
    return list;
  },

  markNotificationRead(notificationId) {
    const list = this.getNotifications().map((entry) =>
      entry.id === notificationId ? { ...entry, read: true } : entry
    );
    writeStorage(NOTIFICATION_KEY, list);
    return list;
  },

  clearNotifications() {
    writeStorage(NOTIFICATION_KEY, []);
    return [];
  },

  pruneNotifications() {
    const list = this.getNotifications().filter((entry) =>
      freshnessFilter({ timestamp: entry.timestamp || Date.parse(entry.createdAt) || Date.now() })
    );
    writeStorage(NOTIFICATION_KEY, list);
    return list;
  },

  removeNotificationByAssignment(assignmentId) {
    if (!assignmentId) return this.getNotifications();
    const list = this.getNotifications().filter(
      (entry) => entry.assignmentId !== assignmentId
    );
    writeStorage(NOTIFICATION_KEY, list);
    return list;
  },
};

