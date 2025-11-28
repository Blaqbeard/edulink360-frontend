import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileSignature, MessageSquarePlus, TrendingUp } from "lucide-react";
import StatCard from "../components/common/StatCard";
import CourseProgress from "../components/dashboard/CourseProgress";
import RecentAssignments from "../components/dashboard/RecentAssignments";
import RecentFeedbacks from "../components/dashboard/RecentFeedbacks";
import useStudentDashboard from "../hooks/useStudentDashboard";
import { messageService } from "../services/messageService";

const clampNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function Dashboard() {
  const { dashboardStats, recentAssignments, recentFeedbacks, loading, error } =
    useStudentDashboard();

  const assignments = Array.isArray(recentAssignments) ? recentAssignments : [];
  const feedbacks = Array.isArray(recentFeedbacks) ? recentFeedbacks : [];

  const pendingAssignments = Number.isFinite(dashboardStats?.pendingAssignments)
    ? dashboardStats.pendingAssignments
    : assignments.filter((assignment) => {
        const status = (assignment.status || "").toLowerCase();
        return status !== "submitted" && status !== "completed";
      }).length;

  const newFeedbackCount = Number.isFinite(dashboardStats?.newFeedbackCount)
    ? dashboardStats.newFeedbackCount
    : feedbacks.length;

  // Calculate actual progress rate from completed/total assignments
  const completedCount = clampNumber(dashboardStats?.completedAssignments);
  const pendingCount = clampNumber(dashboardStats?.pendingAssignments);
  const totalCount = completedCount + pendingCount;

  // Use backend progressRate if available, otherwise calculate from completed/total
  const backendProgressRate = clampNumber(dashboardStats?.progressRate);
  const calculatedProgressRate =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const progressRate =
    backendProgressRate > 0 ? backendProgressRate : calculatedProgressRate;

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
            completedAssignments:
              dashboardStats?.completedAssignments ?? completed,
            inProgress: dashboardStats?.pendingAssignments ?? inProgress,
            total:
              (dashboardStats?.completedAssignments ?? completed) +
              (dashboardStats?.pendingAssignments ?? inProgress),
            progress: dashboardStats?.progressRate ?? progressRate,
            averageGrade: dashboardStats?.averageGrade ?? progressRate,
          }}
          completed={dashboardStats?.completedAssignments ?? completed}
          inProgress={dashboardStats?.pendingAssignments ?? inProgress}
          total={
            (dashboardStats?.completedAssignments ?? completed) +
            (dashboardStats?.pendingAssignments ?? inProgress)
          }
          progress={dashboardStats?.progressRate ?? progressRate}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAssignments assignments={assignments} />
        <RecentFeedbacks feedbacks={feedbacks} />
      </div>

      {/* Teachers Online Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Teachers</h2>
        <TeachersOnlineSection />
      </div>
    </div>
  );
}

// Component to show teachers online
function TeachersOnlineSection() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      // Try to get teachers from contacts or classes
      const contacts = await messageService.getContacts();
      const teacherList = Array.isArray(contacts)
        ? contacts.filter((c) => c.role?.toUpperCase() === "TEACHER")
        : [];
      setTeachers(teacherList);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageTeacher = (teacherId) => {
    navigate(`/messages?teacher=${teacherId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <i className="bi bi-person-x text-3xl mb-2 block"></i>
        <p>No teachers available yet.</p>
        <p className="text-sm mt-1">
          Teachers will appear here once assigned to your classes.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teachers.map((teacher) => (
        <div
          key={teacher.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-semibold flex items-center justify-center">
              {(teacher.name || "T")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {teacher.name || "Teacher"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleMessageTeacher(teacher.id)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Send Message
          </button>
        </div>
      ))}
    </div>
  );
}
