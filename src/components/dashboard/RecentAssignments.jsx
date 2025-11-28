import React from "react";

const assignments = [
  {
    id: 1,
    title: "Advanced React Patterns",
    course: "Web Development",
    dueDate: "Due Tomorrow",
    status: "Pending",
    borderColor: "border-orange-400", // Color for the left border
  },
  {
    id: 2,
    title: "Data Structure Final Project",
    course: "Computer Science",
    dueDate: "Due in 3 days",
    status: "Submitted",
    borderColor: "border-blue-500",
  },
  {
    id: 3,
    title: "UX Research",
    course: "Design Thinking",
    dueDate: "Due in 5 days",
    status: "Pending",
    borderColor: "border-purple-400",
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-orange-400 text-white",
    Submitted: "bg-gray-800 text-white",
  };
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-md ${styles[status]}`}
    >
      {status}
    </span>
  );
};

// Main Component
export default function RecentAssignments() {
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
        {assignments.map((item) => (
          <div
            key={item.id}
            className={`flex items-center space-x-4 border-l-4 ${item.borderColor} pl-4`}
          >
            <div className="flex-1">
              <p className="font-bold text-gray-800">{item.title}</p>
              <p className="text-sm text-gray-600">{item.course}</p>
              <p className="text-xs text-gray-400 mt-1">{item.dueDate}</p>
            </div>
            <div className="flex-shrink-0">
              <StatusBadge status={item.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
