import api from "./api";

export const analyticsService = {
  getAnalytics: async () => {
    const response = await api.get("/analytics/dashboard");
    return response.data;
  },

  getComplaintSummary: async () => {
    const response = await api.get("/analytics/summary");
    return response.data;
  },

  getCategoryStats: async () => {
    const response = await api.get("/analytics/category-stats");
    return response.data;
  },

  getMonthlyStats: async (months = 12) => {
    const response = await api.get(`/analytics/monthly-stats?months=${months}`);
    return response.data;
  },
};
