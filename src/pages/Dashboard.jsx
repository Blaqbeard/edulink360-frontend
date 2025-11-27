import React from "react";

// Import all the components we've built
import StatCard from "../components/common/StatCard";
import CourseProgress from "../components/dashboard/CourseProgress";
import RecentAssignments from "../components/dashboard/RecentAssignments";
import RecentFeedbacks from "../components/dashboard/RecentFeedbacks";

// Import icons for the StatCards
import { FileSignature, MessageSquarePlus, TrendingUp } from "lucide-react";

// Mock data for the top row of StatCards
const stats = [
  {
    icon: <FileSignature />,
    value: "3",
    label: "Assignments Due",
    subtitle: "This week",
    color: "blue",
  },
  {
    icon: <MessageSquarePlus />,
    value: "4",
    label: "New Feedback",
    subtitle: "2 Unread",
    color: "orange",
  },
  {
    icon: <TrendingUp />,
    value: "80",
    label: "Progress Rate",
    subtitle: "Overall Performance",
    color: "green",
  },
];

export default function Dashboard() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Top row: Stat Cards */}
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

      {/* Middle row: Course Progress */}
      <div>
        <CourseProgress />
      </div>

      {/* Bottom row: Two lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAssignments />
        <RecentFeedbacks />
      </div>
    </div>
  );
}
