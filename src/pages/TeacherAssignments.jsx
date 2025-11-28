import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { teacherService } from "../services/teacherService";
import { useNotifications } from "../context/NotificationContext";
import { authService } from "../services/authService";
import LogoutModal from "../components/common/LogoutModal";
import LanguageSelector from "../components/common/LanguageSelector";

const formatDate = (value) => {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function TeacherAssignments() {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotifications();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    submissionId: "",
    grade: "",
    feedback: "",
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState(null);
  const user = authService.getCurrentUser();

  const isActive = (path) => location.pathname === path;

  const fetchAllSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get all submissions across all assignments
      let allSubmissions = [];
      try {
        allSubmissions = await teacherService.getAllSubmissions();
        // Handle different response structures
        if (!Array.isArray(allSubmissions)) {
          allSubmissions = allSubmissions?.submissions || allSubmissions?.data || [];
        }
      } catch (submissionError) {
        console.warn("Could not fetch submissions:", submissionError);
        // Continue - we'll show assignments even without submissions
        allSubmissions = [];
      }
      
      // Group submissions by assignment
      const assignmentMap = new Map();
      
      if (Array.isArray(allSubmissions) && allSubmissions.length > 0) {
        allSubmissions.forEach((submission) => {
          const assignmentId = submission.assignmentId || submission.assignment?.id;
          const assignment = submission.assignment || {};
          
          if (!assignmentMap.has(assignmentId)) {
            assignmentMap.set(assignmentId, {
              id: assignmentId,
              title: assignment.title || "Untitled Assignment",
              description: assignment.description || "",
              dueDate: assignment.dueDate,
              createdAt: assignment.createdAt,
              submissions: [],
            });
          }
          
          assignmentMap.get(assignmentId).submissions.push({
            id: submission.id,
            student: submission.student || { name: "Unknown Student" },
            filePath: submission.filePath,
            submittedAt: submission.submittedAt || submission.createdAt,
            grade: submission.grade,
            feedback: submission.feedback,
            status: submission.grade ? "GRADED" : "PENDING",
          });
        });
      }
      
      // If we have assignments from submissions, use them
      let assignmentsList = Array.from(assignmentMap.values());
      
      // If no submissions but we want to show assignments, try to get from dashboard
      // This handles the case where assignments exist but have no submissions yet
      if (assignmentsList.length === 0) {
        try {
          const { dashboardService } = await import("../services/dashboardService");
          const dashboardData = await dashboardService.getTeacherDashboard();
          const recentSubmissions = dashboardData?.recentSubmissions || [];
          
          // Extract unique assignments from recent submissions
          if (Array.isArray(recentSubmissions) && recentSubmissions.length > 0) {
            recentSubmissions.forEach((submission) => {
              const assignmentId = submission.assignmentId || submission.assignment?.id;
              const assignment = submission.assignment || {};
              
              if (assignmentId && !assignmentMap.has(assignmentId)) {
                assignmentMap.set(assignmentId, {
                  id: assignmentId,
                  title: assignment.title || "Untitled Assignment",
                  description: assignment.description || "",
                  dueDate: assignment.dueDate,
                  createdAt: assignment.createdAt,
                  submissions: [],
                });
              }
            });
            assignmentsList = Array.from(assignmentMap.values());
          }
        } catch (dashboardError) {
          console.warn("Could not fetch dashboard data:", dashboardError);
        }
      }
      
      setAssignments(assignmentsList);
      
      // Auto-select first assignment if available
      if (assignmentsList.length > 0 && !selectedAssignment) {
        setSelectedAssignment(assignmentsList[0]);
        setSubmissions(assignmentsList[0].submissions);
      } else if (assignmentsList.length === 0) {
        // Clear selection if no assignments
        setSelectedAssignment(null);
        setSubmissions([]);
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
      // Only show error if it's a real server error (5xx), not 404 or empty results
      const status = err?.response?.status;
      const isNotFound = status === 404;
      const isNetworkError = err?.message === "Network Error" || err?.code === "ERR_NETWORK";
      
      if (!isNotFound && !isNetworkError && status && status >= 500) {
        // Real server error
        setError(err?.response?.data?.message || err?.message || "Failed to load assignments");
      } else {
        // 404 or network issues - just show empty state (no error message)
        setError(null);
        setAssignments([]);
        setSelectedAssignment(null);
        setSubmissions([]);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedAssignment]);

  useEffect(() => {
    fetchAllSubmissions();
  }, [fetchAllSubmissions]);

  const handleSelectAssignment = async (assignment) => {
    setSelectedAssignment(assignment);
    setSubmissions(assignment.submissions || []);
    setFeedbackForm({ submissionId: "", grade: "", feedback: "" });
    setFeedbackStatus(null);
    
    // Optionally fetch fresh details for this assignment
    if (assignment.id) {
      try {
        setSubmissionsLoading(true);
        const details = await teacherService.getAssignmentDetails(assignment.id);
        if (details?.assignment && details?.submissions) {
          setSubmissions(details.submissions);
        }
      } catch (err) {
        console.error("Error fetching assignment details:", err);
      } finally {
        setSubmissionsLoading(false);
      }
    }
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!selectedAssignment?.id || !feedbackForm.submissionId) {
      setFeedbackStatus({
        type: "error",
        message: "Please select a submission and provide feedback.",
      });
      return;
    }

    setSubmittingFeedback(true);
    setFeedbackStatus(null);

    try {
      const payload = {
        submissionId: feedbackForm.submissionId,
        grade: feedbackForm.grade.trim(),
        feedback: feedbackForm.feedback.trim(),
      };

      await teacherService.sendAssignmentFeedback(selectedAssignment.id, payload);
      
      setFeedbackStatus({
        type: "success",
        message: "Feedback submitted successfully!",
      });

      // Refresh submissions
      const details = await teacherService.getAssignmentDetails(selectedAssignment.id);
      if (details?.submissions) {
        setSubmissions(details.submissions);
      }

      // Reset form
      setFeedbackForm({ submissionId: "", grade: "", feedback: "" });
      
      // Refresh all assignments
      setTimeout(() => fetchAllSubmissions(), 1000);
    } catch (err) {
      setFeedbackStatus({
        type: "error",
        message: err?.message || "Failed to submit feedback. Please try again.",
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleSelectSubmission = (submission) => {
    setFeedbackForm({
      submissionId: submission.id,
      grade: submission.grade || "",
      feedback: submission.feedback || "",
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Hamburger Menu Button */}
      <button
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#0b1633] text-white rounded-lg flex items-center justify-center hover:bg-[#1A2332] transition-colors"
      >
        <i className="bi bi-list text-xl"></i>
      </button>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowMobileSidebar(false)}
        ></div>
      )}

      {/* Left Sidebar */}
      <div
        className={`fixed left-0 top-0 w-64 bg-[#0b1633] flex flex-col h-screen z-40 transition-transform duration-300 ${
          showMobileSidebar
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center my-3 mx-3 animate-[fadeInDown_0.8s_ease-out]">
          <div className="flex items-center px-3 py-1.5 border border-[#FF8A56] rounded hover:scale-105 transition-transform duration-300 cursor-pointer">
            <svg width="20" height="40" viewBox="0 0 31 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="21.0305" width="9.24673" height="9.24673" rx="4.62337" fill="#4278FF" />
              <rect x="0.000976562" y="18.4932" width="9.24673" height="9.24673" rx="4.62337" fill="#4278FF" />
              <rect x="21.0305" y="34.6006" width="9.24673" height="9.24673" rx="4.62337" fill="#4278FF" />
            </svg>
            <span className="hidden md:block text-white font-bold ml-2">EduLink360</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/teacher/dashboard");
              setShowMobileSidebar(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white transition-all duration-200 hover:translate-x-1 ${
              isActive("/teacher/dashboard")
                ? "bg-[#1A2332]"
                : "hover:bg-[#1A2332] text-white/80"
            }`}
          >
            <i className="bi bi-grid text-xl"></i>
            <span className="font-medium">Dashboard</span>
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/teacher/assignments");
              setShowMobileSidebar(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white transition-all duration-200 hover:translate-x-1 ${
              isActive("/teacher/assignments")
                ? "bg-[#1A2332]"
                : "hover:bg-[#1A2332] text-white/80"
            }`}
          >
            <i className="bi bi-file-earmark-text text-xl"></i>
            <span className="font-medium">Assignments</span>
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/teacher/messages");
              setShowMobileSidebar(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white transition-all duration-200 hover:translate-x-1 ${
              isActive("/teacher/messages")
                ? "bg-[#1A2332]"
                : "hover:bg-[#1A2332] text-white/80"
            }`}
          >
            <i className="bi bi-chat-dots text-xl"></i>
            <span className="font-medium">Messages</span>
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/teacher/notifications");
              setShowMobileSidebar(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white transition-all duration-200 hover:translate-x-1 ${
              isActive("/teacher/notifications")
                ? "bg-[#1A2332]"
                : "hover:bg-[#1A2332] text-white/80"
            }`}
          >
            <i className="bi bi-bell text-xl"></i>
            <span className="font-medium">Notifications</span>
          </a>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 space-y-2 border-t border-white/10">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/teacher/settings");
              setShowMobileSidebar(false);
            }}
            className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-[#1A2332] rounded-lg transition-all duration-200 hover:translate-x-1"
          >
            <i className="bi bi-gear text-xl"></i>
            <span className="font-medium">Settings</span>
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowLogoutModal(true);
            }}
            className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-[#1A2332] rounded-lg transition-all duration-200 hover:translate-x-1"
          >
            <i className="bi bi-box-arrow-right text-xl"></i>
            <span className="font-medium">Log out</span>
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto md:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assignments & Submissions</h1>
              <p className="text-sm text-gray-500 mt-1">
                Review and grade student submissions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <div
                onClick={() => navigate("/teacher/notifications")}
                className="relative cursor-pointer hover:scale-110 transition-transform duration-300"
              >
                <i className="bi bi-bell text-gray-600 text-xl hover:text-gray-900 transition-colors"></i>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <div
                onClick={() => navigate("/teacher/profile")}
                className="w-10 h-10 bg-[#FF8A56] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer"
              >
                <span className="text-white font-bold text-sm">
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)
                    : "AA"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B4D8] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading assignments...</p>
              </div>
            </div>
          ) : error && !assignments.length ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
                <p className="font-semibold mb-2">Error loading assignments</p>
                <p className="text-sm mb-4">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    fetchAllSubmissions();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : assignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <i className="bi bi-file-earmark-x text-6xl mb-4"></i>
              <p className="text-lg font-medium">No assignments with submissions yet</p>
              <p className="text-sm mt-2 text-center max-w-md">
                Create assignments from the dashboard. Submissions will appear here once students submit their work.
              </p>
              <button
                onClick={() => navigate("/teacher/dashboard")}
                className="mt-4 px-4 py-2 bg-[#00B4D8] text-white rounded-lg hover:bg-[#0093B8] transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Assignments List */}
              <div className="lg:col-span-1 space-y-3">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignments</h2>
                {assignments.map((assignment) => {
                  const pendingCount = assignment.submissions?.filter(
                    (s) => !s.grade
                  ).length || 0;
                  const isSelected = selectedAssignment?.id === assignment.id;
                  
                  return (
                    <button
                      key={assignment.id}
                      onClick={() => handleSelectAssignment(assignment)}
                      className={`w-full text-left p-4 rounded-lg border transition ${
                        isSelected
                          ? "border-[#00B4D8] bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {assignment.title}
                        </h3>
                        {pendingCount > 0 && (
                          <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                            {pendingCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {assignment.description || "No description"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {assignment.submissions?.length || 0} submission
                        {assignment.submissions?.length !== 1 ? "s" : ""}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Submissions and Grading */}
              <div className="lg:col-span-2 space-y-6">
                {selectedAssignment ? (
                  <>
                    {/* Assignment Details */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {selectedAssignment.title}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {selectedAssignment.description || "No description provided"}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          Due: {formatDate(selectedAssignment.dueDate)}
                        </span>
                        <span>
                          {submissions.length} submission
                          {submissions.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Submissions List */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Student Submissions
                      </h3>
                      
                      {submissionsLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B4D8]"></div>
                        </div>
                      ) : submissions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <i className="bi bi-inbox text-4xl mb-2 block"></i>
                          <p>No submissions yet</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {submissions.map((submission) => {
                            const isSelected = feedbackForm.submissionId === submission.id;
                            const studentName =
                              submission.student?.name || "Unknown Student";
                            const initials = studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .substring(0, 2);

                            return (
                              <div
                                key={submission.id}
                                onClick={() => handleSelectSubmission(submission)}
                                className={`p-4 rounded-lg border cursor-pointer transition ${
                                  isSelected
                                    ? "border-[#00B4D8] bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 bg-[#0b1633] rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-white font-bold text-sm">
                                      {initials}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-semibold text-gray-900">
                                        {studentName}
                                      </h4>
                                      <span
                                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                          submission.status === "GRADED"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                      >
                                        {submission.status}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                      Submitted: {formatDate(submission.submittedAt)}
                                    </p>
                                    {submission.filePath && (
                                      <a
                                        href={submission.filePath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-sm text-[#00B4D8] hover:underline inline-flex items-center gap-1"
                                      >
                                        <i className="bi bi-download"></i>
                                        View Submission
                                      </a>
                                    )}
                                    {submission.grade && (
                                      <div className="mt-2 p-2 bg-gray-50 rounded">
                                        <p className="text-sm">
                                          <span className="font-semibold">Grade:</span>{" "}
                                          {submission.grade}
                                        </p>
                                        {submission.feedback && (
                                          <p className="text-sm mt-1">
                                            <span className="font-semibold">Feedback:</span>{" "}
                                            {submission.feedback}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Feedback Form */}
                    {feedbackForm.submissionId && (
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Provide Feedback
                        </h3>
                        
                        {feedbackStatus && (
                          <div
                            className={`mb-4 px-4 py-2 rounded ${
                              feedbackStatus.type === "success"
                                ? "bg-green-50 text-green-700 border border-green-100"
                                : "bg-red-50 text-red-600 border border-red-100"
                            }`}
                          >
                            {feedbackStatus.message}
                          </div>
                        )}

                        <form onSubmit={handleSubmitFeedback} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Grade
                            </label>
                            <input
                              type="text"
                              name="grade"
                              value={feedbackForm.grade}
                              onChange={handleFeedbackChange}
                              placeholder="e.g., A, B+, 85, Pass"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Feedback
                            </label>
                            <textarea
                              name="feedback"
                              value={feedbackForm.feedback}
                              onChange={handleFeedbackChange}
                              rows={4}
                              placeholder="Provide detailed feedback for the student..."
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                              required
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              type="submit"
                              disabled={submittingFeedback}
                              className="px-6 py-2 bg-[#00B4D8] text-white rounded-lg hover:bg-[#0093B8] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setFeedbackForm({ submissionId: "", grade: "", feedback: "" })
                              }
                              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-lg p-12 text-center text-gray-500">
                    <i className="bi bi-file-earmark-text text-6xl mb-4 block"></i>
                    <p>Select an assignment to view submissions</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </div>
  );
}

export default TeacherAssignments;

