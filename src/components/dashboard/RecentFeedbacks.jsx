import React from "react";

const feedbacks = [
  {
    id: 1,
    sender: "Dr. Sarah Iwobi",
    topic: "React Performance",
    preview: "Great work on optimizing the re-renders for...",
    timestamp: "2 hours ago",
    initials: "SI",
    avatarColor: "bg-orange-500",
  },
  {
    id: 2,
    sender: "Mr Aina Adewale",
    topic: "Algorithm Analysis",
    preview: "Your solution is correct but lets try...",
    timestamp: "1 day ago",
    initials: "AA",
    avatarColor: "bg-gray-800",
  },
  {
    id: 3,
    sender: "Ms Emily Uyai",
    topic: "UX Design",
    preview: "Great attention to details in the workflow of...",
    timestamp: "2 days ago",
    initials: "EU",
    avatarColor: "bg-red-500",
  },
];

// Main Component
export default function RecentFeedbacks() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">Recent Feedbacks</h2>
        <a
          href="#"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View All →
        </a>
      </div>

      {/* List of Feedbacks */}
      <div className="space-y-6">
        {feedbacks.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between space-x-4"
          >
            {/* Left side: Avatar and Text */}
            <div className="flex items-start space-x-4">
              {/* 2. Avatar styling */}
              <div
                className={`h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold text-sm ${item.avatarColor}`}
              >
                {item.initials}
              </div>

              <div>
                <p className="font-bold text-gray-800">{item.sender}</p>
                <p className="text-sm text-gray-600">{item.topic}</p>
                <p className="text-xs text-gray-400 mt-1">{item.preview}</p>
              </div>
            </div>
            {/* Right side: Timestamp */}
            <div className="flex-shrink-0">
              <span className="text-xs text-gray-400">{item.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
