import React from "react";
import Card from "../common/Card";

// Mock data for recent assignments
const assignments = [
  {
    title: "Advanced React Patterns",
    course: "Web Development",
    dueDate: "Due Tomorrow",
    status: "Pending",
  },
  {
    title: "Data Structure Final Project",
    course: "Computer Science",
    dueDate: "Due in 3 days",
    status: "Submitted",
  },
  {
    title: "UX Research",
    course: "Design Thinking",
    dueDate: "Due in 5 days",
    status: "Pending",
  },
];

// A small sub-component for the status badge
const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-orange-100 text-orange-600",
    Submitted: "bg-gray-800 text-white",
  };
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default function RecentAssignments() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Assignments
        </h2>
        <a
          href="#"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View All
        </a>
      </div>
      <div className="space-y-6">
        {assignments.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-700">{item.title}</p>
              <p className="text-sm text-gray-500">
                {item.course} &middot; {item.dueDate}
              </p>
            </div>
            <StatusBadge status={item.status} />
          </div>
        ))}
      </div>
    </Card>
  );
}
