import React from "react";

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

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">Recent Feedbacks</h2>
        <a
          href="#"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View All →
        </a>
      </div>

      <div className="space-y-6">
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
          </div>
        )}
      </div>
    </div>
  );
}

function formatDisplayDate(d) {
  try {
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return dt.toLocaleDateString();
  } catch {
    return d;
  }
}
