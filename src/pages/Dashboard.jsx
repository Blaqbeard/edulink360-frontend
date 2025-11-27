import React from "react";
import { FileSignature, MessageSquarePlus, TrendingUp } from "lucide-react";
import StatCard from "../components/common/StatCard";
import CourseProgress from "../components/dashboard/CourseProgress";
import RecentAssignments from "../components/dashboard/RecentAssignments";
import RecentFeedbacks from "../components/dashboard/RecentFeedbacks";
import useStudentDashboard from "../hooks/useStudentDashboard";

const clampNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function Dashboard() {
  const { dashboardStats, recentAssignments, recentFeedbacks, loading, error } =
    useStudentDashboard();

  const assignments = Array.isArray(recentAssignments)
    ? recentAssignments
    : [];
  const feedbacks = Array.isArray(recentFeedbacks) ? recentFeedbacks : [];

  const pendingAssignments = Number.isFinite(
    dashboardStats?.pendingAssignments
  )
    ? dashboardStats.pendingAssignments
    : assignments.filter((assignment) => {
        const status = (assignment.status || "").toLowerCase();
        return status !== "submitted" && status !== "completed";
      }).length;

  const newFeedbackCount = Number.isFinite(dashboardStats?.newFeedbackCount)
    ? dashboardStats.newFeedbackCount
    : feedbacks.length;

  const progressRate = clampNumber(
    dashboardStats?.progressRate,
    clampNumber(dashboardStats?.averageGrade)
  );

  const completed = clampNumber(dashboardStats?.completedAssignments);
  const inProgress = clampNumber(dashboardStats?.pendingAssignments);
  const total = completed + inProgress;

  const stats = [
    {
      icon: <FileSignature />,
      value: `${pendingAssignments}`,
      label: "Assignments Due",
      subtitle: "Upcoming tasks",
      color: "blue",
    },
    {
      icon: <MessageSquarePlus />,
      value: `${newFeedbackCount}`,
      label: "New Feedback",
      subtitle: "Latest updates",
      color: "orange",
    },
    {
      icon: <TrendingUp />,
      value: `${clampNumber(progressRate)}%`,
      label: "Progress Rate",
      subtitle: "Overall performance",
      color: "green",
    },
  ];

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B4D8] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            subtitle={stat.subtitle}
            color={stat.color}
          />
        ))}
      </div>

      <div>
        <CourseProgress
          progressData={{
            completedAssignments: completed,
            inProgress,
            total,
            progress: progressRate,
            averageGrade: dashboardStats?.averageGrade ?? progressRate,
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAssignments assignments={assignments} />
        <RecentFeedbacks feedbacks={feedbacks} />
      </div>
    </div>
  );
}
