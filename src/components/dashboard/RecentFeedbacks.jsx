import React from "react";

<<<<<<< HEAD
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
=======
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n?.[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .substring(0, 2) || "FB";

export default function RecentFeedbacks({ feedbacks = [], items = [] }) {
  const list =
    Array.isArray(feedbacks) && feedbacks.length > 0 ? feedbacks : items;
  const hasFeedbacks = Array.isArray(list) && list.length > 0;
>>>>>>> 52633fc5f6dcd93935268bcaadcb768ca65f2398

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
<<<<<<< HEAD
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
=======
        {hasFeedbacks ? (
          list.slice(0, 5).map((item, index) => {
            const displayName =
              item.sender ||
              item.teacher ||
              item.reviewer ||
              item.courseName ||
              "Instructor";
            const preview =
              item.preview ||
              item.topic ||
              item.comment ||
              item.feedback ||
              "Feedback will appear here once available.";
            const timestamp =
              item.timestamp ||
              item.timeAgo ||
              formatDisplayDate(item.date || item.createdAt);
            const avatarColor = item.avatarColor || item.color || "bg-blue-500";

            return (
              <div
                key={item.id || index}
                className="flex items-start justify-between space-x-4"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold ${avatarColor}`}
                  >
                    {item.initials || getInitials(displayName)}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {displayName}
                    </p>
                    <p className="text-sm text-gray-600">{preview}</p>
                  </div>
                </div>

                <span className="text-xs text-gray-400 flex-shrink-0">
                  {timestamp || "Just now"}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-8">
            No feedback available.
>>>>>>> 52633fc5f6dcd93935268bcaadcb768ca65f2398
          </div>
        )}
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

function formatDisplayDate(d) {
  try {
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return dt.toLocaleDateString();
  } catch {
    return d;
  }
}
>>>>>>> 52633fc5f6dcd93935268bcaadcb768ca65f2398
