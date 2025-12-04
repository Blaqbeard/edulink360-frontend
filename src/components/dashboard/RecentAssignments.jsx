import React from "react";

const statusStyles = {
  pending: "bg-orange-100 text-orange-600",
  submitted: "bg-gray-800 text-white",
  completed: "bg-green-100 text-green-600",
};

const StatusBadge = ({ status }) => {
  const normalized = status?.toLowerCase();
  const classes = statusStyles[normalized] || "bg-gray-200 text-gray-700";
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${classes}`}>
      {status || "Pending"}
    </span>
  );
};

export default function RecentAssignments({ assignments = [], items = [] }) {
  const list =
    Array.isArray(assignments) && assignments.length > 0 ? assignments : items;
  const hasAssignments = Array.isArray(list) && list.length > 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">Recent Assignments</h2>
        <a
          href="#"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View All →
        </a>
      </div>

      {/* List of Assignments */}
      <div className="space-y-6">
        {hasAssignments ? (
          list.slice(0, 5).map((item, index) => {
            const title =
              item.title ||
              item.assignmentTitle ||
              item.name ||
              "Untitled Assignment";
            const course =
              item.course || item.courseName || item.subject || "Course";
            const dueDateText = item.dueDate
              ? formatDisplayDate(item.dueDate)
              : item.dueDateText || item.dueLabel || "Due soon";
            const status =
              item.status || (item.submitted ? "Submitted" : "Pending");

            return (
              <div
                key={item.id || index}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-700">{title}</p>
                  <p className="text-sm text-gray-500">
                    {course} &middot; {dueDateText}
                  </p>
                </div>
                <StatusBadge status={status} />
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-8">
            No assignments available.
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
