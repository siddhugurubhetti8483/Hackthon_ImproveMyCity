import api from "./api";

export const analyticsService = {
  getAnalytics: async () => {
    try {
      const response = await api.get("/analytics/dashboard");
      return response.data;
    } catch (error) {
      console.error("Analytics service error:", error);
      throw error;
    }
  },

  getComplaintSummary: async () => {
    try {
      const response = await api.get("/analytics/summary");
      return response.data;
    } catch (error) {
      console.error("Analytics summary error:", error);
      throw error;
    }
  },

  getCategoryStats: async () => {
    try {
      const response = await api.get("/analytics/category-stats");
      return response.data;
    } catch (error) {
      console.error("Category stats error:", error);
      throw error;
    }
  },

  getMonthlyStats: async (months = 12) => {
    try {
      const response = await api.get(
        `/analytics/monthly-stats?months=${months}`
      );
      return response.data;
    } catch (error) {
      console.error("Monthly stats error:", error);
      throw error;
    }
  },
};
