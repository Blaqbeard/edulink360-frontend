import React from "react";
import { LineChart } from "lucide-react";
import Card from "../common/Card";

export default function CourseProgress({
  progressData,
  progress,
  completed,
  inProgress,
  total,
}) {
  const defaultData = {
    completedAssignments: 0,
    inProgress: 0,
    total: 0,
    progress: 0,
  };

  const completedFromData =
    typeof progressData?.completedAssignments === "number"
      ? progressData.completedAssignments
      : defaultData.completedAssignments;
  const inProgressFromData =
    typeof progressData?.inProgress === "number"
      ? progressData.inProgress
      : defaultData.inProgress;
  const totalFromData =
    typeof progressData?.total === "number"
      ? progressData.total
      : defaultData.total;

  const fallbackProgress =
    typeof progressData?.progress === "number"
      ? progressData.progress
      : totalFromData > 0
      ? Math.round((completedFromData / totalFromData) * 100)
      : Math.round(progressData?.averageGrade || 0);

  const resolvedCompleted =
    typeof completed === "number" ? completed : completedFromData;
  const resolvedInProgress =
    typeof inProgress === "number" ? inProgress : inProgressFromData;
  const resolvedTotal = typeof total === "number" ? total : totalFromData;
  const resolvedProgress =
    typeof progress === "number" ? progress : fallbackProgress;

  const safeProgress = Number.isFinite(resolvedProgress)
    ? Math.max(0, Math.min(resolvedProgress, 100))
    : 0;

  return (
    <Card className="bg-blue-600 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Course Progress</h2>
        <LineChart className="h-6 w-6" />
      </div>
      <p className="text-sm text-blue-200 mt-1">Overall Completion Status</p>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Completed</span>
          <span className="text-sm font-semibold">{safeProgress}%</span>
        </div>
        <div className="w-full bg-blue-500/40 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-white h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${safeProgress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold">{resolvedCompleted ?? 0}</p>
          <p className="text-sm text-blue-200">Completed</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{resolvedInProgress ?? 0}</p>
          <p className="text-sm text-blue-200">In Progress</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{resolvedTotal ?? 0}</p>
          <p className="text-sm text-blue-200">Total</p>
        </div>
      </div>
    </Card>
  );
}
