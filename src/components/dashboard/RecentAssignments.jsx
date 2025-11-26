import React from "react";

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-orange-400 text-white",
    Submitted: "bg-gray-800 text-white",
    Submitted_: "bg-gray-800 text-white",
    Completed: "bg-green-500 text-white",
  };
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-md ${
        styles[status] || "bg-gray-200 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

export default function RecentAssignments({ assignments = [] }) {
  if (!assignments || assignments.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            Recent Assignments
          </h2>
          <a
            href="#"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View All →
          </a>
        </div>
        <p className="text-sm text-gray-500">No assignments available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">Recent Assignments</h2>
        <a
          href="#"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View All →
        </a>
      </div>

      <div className="space-y-6">
        {assignments.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className={`flex items-center space-x-4 border-l-4 ${
              item.borderColor || "border-gray-200"
            } pl-4`}
          >
            <div className="flex-1">
              <p className="font-bold text-gray-800">
                {item.title || item.name}
              </p>
              <p className="text-sm text-gray-600">
                {item.course || item.courseName}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {item.dueDate
                  ? formatDisplayDate(item.dueDate)
                  : item.dueDateText || ""}
              </p>
            </div>
            <div className="flex-shrink-0">
              <StatusBadge
                status={
                  item.status || (item.submitted ? "Submitted" : "Pending")
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// helper
function formatDisplayDate(d) {
  try {
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return dt.toLocaleDateString();
  } catch {
    return d;
  }
}
