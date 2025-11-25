import React from "react";
import { LineChart } from "lucide-react"; // Example icon
import Card from "../common/Card"; // Using our base card

export default function CourseProgress() {
  // Mock data based on your design
  const progress = 75;
  const completed = 12;
  const inProgress = 4;
  const total = 16;

  return (
    <Card className="bg-blue-600 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Course Progress</h2>
        <LineChart className="h-6 w-6" />
      </div>
      <p className="text-sm text-blue-200 mt-1">Overall Completion Status</p>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Completed</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-blue-800 rounded-full h-2.5">
          <div
            className="bg-white h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Stats at the bottom */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold">{completed}</p>
          <p className="text-sm text-blue-200">Completed</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{inProgress}</p>
          <p className="text-sm text-blue-200">In Progress</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-sm text-blue-200">Total</p>
        </div>
      </div>
    </Card>
  );
}
