import api from "./api";

export const analyticsService = {
  /** Get overall analytics dashboard data   */
  getAnalytics: async () => {
    try {
      const response = await api.get("/Analytics/dashboard");
      return response.data;
    } catch (error) {
      console.error("Analytics service error:", error);
      throw error;
    }
  },

  /** Get complaint summary (counts, trends)   */
  getComplaintSummary: async () => {
    try {
      const response = await api.get("/Analytics/summary");
      return response.data;
    } catch (error) {
      console.error("Analytics summary error:", error);
      throw error;
    }
  },

  /**   Get stats based on complaint categories   */
  getCategoryStats: async () => {
    try {
      const response = await api.get("/Analytics/category-stats");
      return response.data;
    } catch (error) {
      console.error("Category stats error:", error);
      throw error;
    }
  },

  /**   Get monthly statistics for the last N months */
  getMonthlyStats: async (months = 12) => {
    try {
      const response = await api.get(
        `/Analytics/monthly-stats?months=${months}`
      );
      return response.data;
    } catch (error) {
      console.error("Monthly stats error:", error);
      throw error;
    }
  },
};
