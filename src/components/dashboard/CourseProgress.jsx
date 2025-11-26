import React from "react";
import { TrendingUp } from "lucide-react";

export default function CourseProgress({ progressData }) {
  const defaultData = {
    completedAssignments: 0,
    inProgress: 0,
    total: 0,
    progress: 0,
  };

  const {
    completedAssignments = defaultData.completedAssignments,
    inProgress = defaultData.inProgress,
    total = defaultData.total,
    // progress: prefer explicit progress or compute from completed/total
    progress = typeof progressData?.progress === "number"
      ? progressData.progress
      : total > 0
      ? Math.round((completedAssignments / total) * 100)
      : Math.round(progressData?.averageGrade || 0),
    averageGrade = progressData?.averageGrade,
  } = progressData || defaultData;

  return (
    <div className="bg-[#1D4ED8] text-white p-6 rounded-xl">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">Course Progress</h2>
          <p className="text-sm text-blue-200 mt-1">
            Overall Completion Status
          </p>
        </div>

        <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
          <TrendingUp size={20} />
        </button>
      </div>

      <div className="mt-8">
        <p className="text-sm font-medium mb-2">Completed</p>
        <div className="relative w-full">
          <div className="w-full bg-blue-900/70 rounded-full h-2"></div>

          <div
            className="absolute top-0 left-0 bg-cyan-300 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>

          <div
            className="absolute -top-6 font-semibold text-cyan-300"
            style={{ left: `calc(${progress}% - 1.5rem)` }}
          >
            {progress}%
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold">{completedAssignments}</p>
          <p className="text-sm text-blue-200">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">{inProgress}</p>
          <p className="text-sm text-blue-200">In Progress</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">{total}</p>
          <p className="text-sm text-blue-200">Total</p>
        </div>
      </div>
    </div>
  );
}
