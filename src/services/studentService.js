import api from "../config/api";

/**
 * Student Service – handles student-specific endpoints
 */
export const studentService = {
  /**
   * GET /student/dashboard-summary
   * Returns aggregated student stats
   */
  getDashboardSummary: async () => {
    try {
      const { data } = await api.get("/student/dashboard-summary");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * GET /student/assignments
   * Returns list of assignments
   */
  getAssignments: async () => {
    try {
      const { data } = await api.get("/student/assignments");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * POST /student/assignments/{id}/submit
   * payload: FormData with `file`
   */
  submitAssignment: async (assignmentId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post(
        `/student/assignments/${assignmentId}/submit`,
        formData
      );
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * GET /student/assignments/{id}/feedback
   */
  getAssignmentFeedback: async (assignmentId) => {
    try {
      const { data } = await api.get(
        `/student/assignments/${assignmentId}/feedback`
      );
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * GET /student/profile
   */
  getProfile: async () => {
    try {
      const { data } = await api.get("/student/profile");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * PATCH /student/profile
   */
  updateProfile: async (payload) => {
    try {
      const { data } = await api.patch("/student/profile", payload);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default studentService;


