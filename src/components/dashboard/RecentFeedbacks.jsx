import React from "react";

export default function RecentFeedbacks({ feedbacks = [] }) {
  if (!feedbacks || feedbacks.length === 0) {
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
        <p className="text-sm text-gray-500">No feedback available.</p>
      </div>
    );
  }

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
        {feedbacks.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between space-x-4"
          >
            <div className="flex items-start space-x-4">
              <div
                className={`h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold text-sm ${
                  item.avatarColor || "bg-gray-400"
                }`}
              >
                {item.initials ||
                  (item.sender ? initialsFromName(item.sender) : "NA")}
              </div>

              <div>
                <p className="font-bold text-gray-800">
                  {item.sender || item.courseName}
                </p>
                <p className="text-sm text-gray-600">
                  {item.topic || item.comment || ""}
                </p>
                {item.preview && (
                  <p className="text-xs text-gray-400 mt-1">{item.preview}</p>
                )}
              </div>
            </div>

            <div className="flex-shrink-0">
              <span className="text-xs text-gray-400">
                {formatDisplayDate(item.date || item.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// helpers
function initialsFromName(name = "") {
  return name
    .split(" ")
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
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
