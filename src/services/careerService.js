import api from "../config/api";

/**
 * Career Guidance Service
 * Aligned with backend guide endpoints
 */
export const careerService = {
  /**
   * GET /career-quiz/questions
   * Get list of quiz questions
   */
  getQuizQuestions: async () => {
    try {
      const { data } = await api.get("/career-quiz/questions");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * GET /career-stories
   * Get list of career stories
   */
  getCareerStories: async () => {
    try {
      const { data } = await api.get("/career-stories");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default careerService;


