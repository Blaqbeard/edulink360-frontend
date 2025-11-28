import { useEffect, useState } from "react";
import { studentService } from "../services/studentService";

export default function useStudentDashboard() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [summary, assignmentsList] = await Promise.all([
          studentService.getDashboardSummary().catch(() => null),
          studentService.getAssignments().catch(() => []),
        ]);

        if (cancelled) return;

        // Normalize summary data
        const summaryData = summary?.data || summary || null;
        // Normalize assignments data
        let assignments = Array.isArray(assignmentsList)
          ? assignmentsList
          : Array.isArray(assignmentsList?.data)
          ? assignmentsList.data
          : Array.isArray(assignmentsList?.assignments)
          ? assignmentsList.assignments
          : [];

        assignments = assignments
          .map((a) => ({
            ...a,
            // attempt to parse a date to use for ordering (fallback to now)
            _sortDate: new Date(
              a.submittedAt || a.dueDate || Date.now()
            ).getTime(),
          }))
          .sort((a, b) => b._sortDate - a._sortDate);

        const feedbacks = [];
        for (const a of assignments) {
          // if feedbacks is an array on assignment
          if (Array.isArray(a.feedbacks) && a.feedbacks.length) {
            a.feedbacks.forEach((f) =>
              feedbacks.push({
                id: `${a.id}-${f.id || Math.random()}`,
                courseName: a.course || a.title || "Assignment",
                comment: f.comment || f.feedback || f.message || "",
                date: f.createdAt || f.date || f.updatedAt || a._sortDate,
                rawAssignmentId: a.id,
              })
            );
          } else if (a.feedback) {
            // single feedback field
            feedbacks.push({
              id: `${a.id}-fb`,
              courseName: a.course || a.title || "Assignment",
              comment: a.feedback,
              date: a.feedbackDate || a._sortDate,
              rawAssignmentId: a.id,
            });
          }
        }

        // sort feedbacks newest-first
        feedbacks.sort(
          (x, y) => new Date(y.date).getTime() - new Date(x.date).getTime()
        );

        // take latest 3 for UI
        setDashboardStats(summaryData);
        setRecentAssignments(assignments.slice(0, 3));
        setRecentFeedbacks(feedbacks.slice(0, 3));
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Failed to load dashboard data"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    dashboardStats,
    recentAssignments,
    recentFeedbacks,
    loading,
    error,
  };
}
