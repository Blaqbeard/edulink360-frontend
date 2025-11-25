import React from "react";
import Card from "../common/Card";

// Mock data for recent feedbacks
const feedbacks = [
  {
    teacher: "Dr. Sarah Iwobi",
    course: "React Performance",
    preview: "Great work on optimizing the re-renders for...",
    timestamp: "2 hours ago",
    initials: "SI",
    color: "bg-orange-500",
  },
  {
    teacher: "Mr Aina Adewale",
    course: "Algorithm Analysis",
    preview: "Your solution is correct but lets try...",
    timestamp: "1 day ago",
    initials: "AA",
    color: "bg-gray-800",
  },
  {
    teacher: "Ms Emily Uyai",
    course: "UX Design",
    preview: "Great attention to details in the workflow of...",
    timestamp: "2 days ago",
    initials: "EU",
    color: "bg-blue-500",
  },
];

export default function RecentFeedbacks() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Feedbacks
        </h2>
        <a
          href="#"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View All
        </a>
      </div>
      <div className="space-y-6">
        {feedbacks.map((item, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div
              className={`h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold ${item.color}`}
            >
              {item.initials}
            </div>
            <div>
              <p className="font-semibold text-gray-700">{item.teacher}</p>
              <p className="text-sm text-gray-500">{item.preview}</p>
            </div>
            <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
              {item.timestamp}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
