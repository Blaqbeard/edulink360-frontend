import { useCallback, useEffect, useMemo, useState } from "react";
import { studentService } from "../services/studentService";
import { useNotifications } from "../context/NotificationContext";

const formatDate = (value) => {
  if (!value) return "No due date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [locallySubmittedIds, setLocallySubmittedIds] = useState([]);
  const { refreshCount } = useNotifications();

  useEffect(() => {
    setFeedback(null);
    setSelectedFile(null);
  }, [selectedAssignmentId]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAssignments();
      const list = Array.isArray(data?.assignments)
        ? data.assignments
        : Array.isArray(data)
        ? data
        : data?.data || [];
      setAssignments(list);
      if (!selectedAssignmentId && list.length > 0) {
        setSelectedAssignmentId(list[0].id);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to load assignments."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedAssignment = useMemo(
    () => assignments.find((assignment) => assignment.id === selectedAssignmentId),
    [assignments, selectedAssignmentId]
  );

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const handleSubmit = async () => {
    if (!selectedAssignment || !selectedFile) return;
    try {
      setSubmitting(true);
      setStatusMessage(null);
      await studentService.submitAssignment(selectedAssignment.id, selectedFile);
      setSelectedFile(null);
      refreshCount?.();
      setLocallySubmittedIds((prev) =>
        prev.includes(selectedAssignment.id)
          ? prev
          : [...prev, selectedAssignment.id]
      );
      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === selectedAssignment.id
            ? {
                ...assignment,
                submissionStatus: "SUBMITTED",
                submittedAt: new Date().toISOString(),
                submission: {
                  ...(assignment.submission || {}),
                  submittedAt: new Date().toISOString(),
                },
              }
            : assignment
        )
      );
      await fetchAssignments();
      setStatusMessage("Assignment submitted successfully.");
    } catch (err) {
      setStatusMessage(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Could not submit assignment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewFeedback = async () => {
    if (!selectedAssignment) return;
    try {
      setFeedbackLoading(true);
      setFeedback(null);
      const data = await studentService.getAssignmentFeedback(
        selectedAssignment.id
      );
      setFeedback(data?.feedback || data);
    } catch (err) {
      setStatusMessage(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Feedback is not available yet."
      );
    } finally {
      setFeedbackLoading(false);
    }
  };

  const getStatusBadge = useCallback(
    (assignment) => {
      if (!assignment) return "PENDING";
      if (locallySubmittedIds.includes(assignment.id)) return "SUBMITTED";

      const statusCandidates = [
        assignment?.submissionStatus,
        assignment?.status,
        assignment?.submission?.status,
        assignment?.submission?.grade ? "GRADED" : null,
        assignment?.submitted ? "SUBMITTED" : null,
        assignment?.hasSubmitted ? "SUBMITTED" : null,
        assignment?.isSubmitted ? "SUBMITTED" : null,
      ].filter(Boolean);

      if (statusCandidates.length > 0) {
        return statusCandidates[0].toUpperCase();
      }

      if (assignment?.submission || assignment?.submissionId) {
        return "SUBMITTED";
      }

      const dueDate = assignment?.dueDate;
      if (dueDate && new Date(dueDate) < new Date()) {
        return "OVERDUE";
      }

      return "PENDING";
    },
    [locallySubmittedIds]
  );

  return (
    <div className="w-full max-w-6xl p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-sm text-gray-500">
            Track deadlines, submit work, and review instructor feedback.
          </p>
        </div>
        <button
          onClick={fetchAssignments}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {statusMessage && (
        <div className="px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-sm">
          {statusMessage}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assignments...</p>
          </div>
        </div>
      ) : error ? (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      ) : assignments.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl py-16 text-center text-gray-500">
          You don't have any assignments yet.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          <div className="space-y-3">
            {assignments.map((assignment) => {
              const status = getStatusBadge(assignment);
              const isActive = assignment.id === selectedAssignmentId;
              return (
                <button
                  key={assignment.id}
                  onClick={() => setSelectedAssignmentId(assignment.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition ${
                    isActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {assignment.title || "Untitled Assignment"}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        status === "SUBMITTED"
                          ? "bg-green-100 text-green-700"
                          : status === "OVERDUE"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {assignment.description || "No description provided."}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Due {formatDate(assignment.dueDate)}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl space-y-4">
            {selectedAssignment ? (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-500">Assignment</p>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedAssignment.title || "Untitled Assignment"}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedAssignment.description || "No description provided."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-xl bg-gray-50">
                    <p className="text-gray-500">Due</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(selectedAssignment.dueDate)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50">
                    <p className="text-gray-500">Status</p>
                    <p className="font-semibold text-gray-900">
                      {getStatusBadge(selectedAssignment)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Submit your work
                  </p>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.jpg,.png"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedFile || submitting}
                    className="w-full py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                  >
                    {submitting ? "Submitting..." : "Submit Assignment"}
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Instructor feedback
                      </p>
                      <p className="text-xs text-gray-500">
                        View your grade and comments once posted.
                      </p>
                    </div>
                    <button
                      onClick={handleViewFeedback}
                      className="text-sm font-semibold text-blue-600 hover:underline"
                      disabled={feedbackLoading}
                    >
                      {feedbackLoading ? "Loading..." : "View Feedback"}
                    </button>
                  </div>

                  {feedback ? (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-100 space-y-2">
                      {feedback.grade && (
                        <p className="text-sm font-semibold text-green-800">
                          Grade: {feedback.grade}
                        </p>
                      )}
                      <p className="text-sm text-green-700">
                        {feedback.comment ||
                          feedback.feedback ||
                          "Great job! Keep up the good work."}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Feedback not available yet.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="py-16 text-center text-gray-500">
                Select an assignment to get started.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

