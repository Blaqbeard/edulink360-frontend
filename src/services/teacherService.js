import api from "../config/api";

/**
 * Teacher Service
 * Maps directly to the backend guide endpoints for teacher workflows
 */
export const teacherService = {
  /**
   * GET /teacher/classes
   * Returns all classes managed by the teacher
   */
  getClasses: async () => {
    try {
      const { data } = await api.get("/teacher/classes");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * POST /teacher/assignments/create
   * payload: { title, description, dueDate? }
   */
  createAssignment: async (payload) => {
    try {
      const { data } = await api.post("/teacher/assignments/create", payload);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * GET /teacher/assignments/:id
   */
  getAssignmentDetails: async (assignmentId) => {
    try {
      const { data } = await api.get(`/teacher/assignments/${assignmentId}`);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * POST /teacher/assignments/:id/feedback
   * payload: { submissionId, grade, feedback }
   */
  sendAssignmentFeedback: async (assignmentId, payload) => {
    try {
      const { data } = await api.post(
        `/teacher/assignments/${assignmentId}/feedback`,
        payload
      );
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default teacherService;

