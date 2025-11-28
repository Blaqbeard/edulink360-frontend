const SUBMISSION_KEY = "edulink360:student-submissions";
const NOTIFICATION_KEY = "edulink360:student-submission-notifs";
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

const normalizeAssignmentStatus = (assignment = {}) => {
  const statusCandidates = [
    assignment.submissionStatus,
    assignment.status,
    assignment.submission?.status,
    assignment.submission?.grade ? "GRADED" : null,
    assignment.submission ? "SUBMITTED" : null,
    assignment.hasSubmitted ? "SUBMITTED" : null,
    assignment.isSubmitted ? "SUBMITTED" : null,
  ].filter(Boolean);

  if (statusCandidates.length === 0) return "PENDING";
  return `${statusCandidates[0]}`.toUpperCase();
};

const freshnessFilter = (entry, ttl = ONE_DAY) => Date.now() - entry.timestamp < ttl;

const buildNotification = ({ assignmentId, title, message }) => ({
  id: `local-${assignmentId}-${Date.now()}`,
  assignmentId,
  title: title || "Assignment submitted",
  message:
    message ||
    "Your assignment was submitted successfully. We'll notify you once it's graded.",
  type: "submission",
  createdAt: new Date().toISOString(),
  read: false,
  expiresAt: Date.now() + ONE_DAY,
});

export const submissionCache = {
  getEntries() {
    return readStorage(SUBMISSION_KEY);
  },

  getIds() {
    return this.getEntries().map((entry) => entry.assignmentId);
  },

  recordSubmission(assignmentId) {
    if (!assignmentId) return this.getIds();
    const entries = this.getEntries().filter((entry) => entry.assignmentId !== assignmentId);
    entries.unshift({ assignmentId, timestamp: Date.now() });
    writeStorage(SUBMISSION_KEY, entries);
    return entries.map((entry) => entry.assignmentId);
  },

  syncWithAssignments(assignments = []) {
    const entries = this.getEntries();
    const filtered = entries.filter((entry) => {
      const assignment = assignments.find((item) => item.id === entry.assignmentId);
      if (!assignment && freshnessFilter(entry, ONE_DAY * 3)) return true;
      if (!assignment) return false;
      const status = normalizeAssignmentStatus(assignment);
      if (["SUBMITTED", "COMPLETED", "GRADED"].includes(status)) return false;
      return freshnessFilter(entry);
    });
    writeStorage(SUBMISSION_KEY, filtered);
    return filtered.map((entry) => entry.assignmentId);
  },

  clearForAssignments(assignmentIds = []) {
    if (!assignmentIds.length) return this.getIds();
    const remaining = this
      .getEntries()
      .filter((entry) => !assignmentIds.includes(entry.assignmentId));
    writeStorage(SUBMISSION_KEY, remaining);
    return remaining.map((entry) => entry.assignmentId);
  },

  // Local notification helpers
  getNotifications() {
    return readStorage(NOTIFICATION_KEY).filter(
      (entry) => Date.now() < (entry.expiresAt || 0) || !entry.expiresAt
    );
  },

  addNotification({ assignmentId, title, message }) {
    if (!assignmentId) return this.getNotifications();
    const list = this.getNotifications().filter(
      (entry) => entry.assignmentId !== assignmentId
    );
    list.unshift(buildNotification({ assignmentId, title, message }));
    writeStorage(NOTIFICATION_KEY, list);
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
      freshnessFilter({ timestamp: entry.createdAt ? Date.parse(entry.createdAt) : Date.now() })
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

