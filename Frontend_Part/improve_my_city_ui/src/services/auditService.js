import api from "./api";

export const auditService = {
  getAuditLogs: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.userId) params.append("userId", filters.userId);
      if (filters.actionType) params.append("actionType", filters.actionType);
      if (filters.fromDate) params.append("fromDate", filters.fromDate);
      if (filters.toDate) params.append("toDate", filters.toDate);

      const response = await api.get(`/audit?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Audit service error:", error);
      throw error;
    }
  },
};
