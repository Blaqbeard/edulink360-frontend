import api from "../config/api";

/**
 * Digital Portfolio Service
 * Aligned with backend guide endpoints
 */
export const portfolioService = {
  /**
   * POST /portfolio/upload-document
   * Content-Type: multipart/form-data
   * Payload: file (The document)
   */
  uploadDocument: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post("/portfolio/upload-document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * GET /portfolio
   * Get list of uploaded documents
   */
  getPortfolio: async () => {
    try {
      const { data } = await api.get("/portfolio");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * DELETE /portfolio/{documentId}
   * Delete a document
   */
  deleteDocument: async (documentId) => {
    try {
      const { data } = await api.delete(`/portfolio/${documentId}`);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default portfolioService;





