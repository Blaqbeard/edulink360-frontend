
import React from "react";
import StatCard from "../components/common/StatCard";
import CourseProgress from "../components/dashboard/CourseProgress";
import RecentAssignments from "../components/dashboard/RecentAssignments";
import RecentFeedbacks from "../components/dashboard/RecentFeedbacks";
import useStudentDashboard from "../hooks/useStudentDashboard";

import { FileSignature, MessageSquarePlus, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { dashboardStats, recentAssignments, recentFeedbacks, loading, error } =
    useStudentDashboard();

  const stats = [
    {
      icon: <FileSignature />,
      value: dashboardStats?.pendingAssignments ?? "-",
      label: "Assignments Due",
      subtitle: "This week",
      color: "blue",
    },
    {
      icon: <MessageSquarePlus />,
      value: recentFeedbacks?.length ?? 0,
      label: "New Feedback",
      subtitle: `${recentFeedbacks?.length ?? 0} Unread`,
      color: "orange",
    },
    {
      icon: <TrendingUp />,
      value: dashboardStats?.averageGrade
        ? Math.round(dashboardStats.averageGrade)
        : "-",
      label: "Progress Rate",
      subtitle: "Overall Performance",
      color: "green",
    },
  ];

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div>
        <CourseProgress
          progressData={{
            completedAssignments: dashboardStats?.completedAssignments ?? 0,
            inProgress: dashboardStats?.pendingAssignments ?? 0,
            total:
              (dashboardStats?.completedAssignments ?? 0) +
              (dashboardStats?.pendingAssignments ?? 0),
            progress: dashboardStats?.averageGrade ?? 0,
            averageGrade: dashboardStats?.averageGrade ?? 0,
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAssignments assignments={recentAssignments} />
        <RecentFeedbacks feedbacks={recentFeedbacks} />
      </div>
    </div>
  );
}
