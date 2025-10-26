import api from "./api";

export const complaintService = {
  // Create complaint
  createComplaint: async (complaintData) => {
    const response = await api.post("/complaints", complaintData);
    return response.data;
  },

  // Get all complaints (role-based)
  getComplaints: async () => {
    try {
      const response = await api.get("/complaints");
      return response.data;
    } catch (error) {
      console.error("Error fetching complaints:", error);
      throw error;
    }
  },

  // Get complaint by ID
  getComplaintById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  // Update complaint
  updateComplaint: async (id, complaintData) => {
    const response = await api.put(`/complaints/${id}`, complaintData);
    return response.data;
  },

  // Update complaint status
  updateComplaintStatus: async (id, statusData) => {
    const response = await api.put(`/complaints/${id}/status`, statusData);
    return response.data;
  },

  // Assign complaint to officer
  assignComplaint: async (id, officerData) => {
    const response = await api.post(`/complaints/${id}/assign`, officerData);
    return response.data;
  },

  // Delete complaint
  deleteComplaint: async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  },

  // Add comment
  addComment: async (id, commentData) => {
    const response = await api.post(`/complaints/${id}/comments`, commentData);
    return response.data;
  },

  // Get comments
  getComments: async (id) => {
    const response = await api.get(`/complaints/${id}/comments`);
    return response.data;
  },

  // ADDED: Get available officers for assignment
  getAvailableOfficers: async () => {
    try {
      // Use userService to get officers list
      const response = await api.get("/Users/Admin,Officer");
      return response.data;
    } catch (error) {
      console.error("Get available officers error:", error);
      throw error;
    }
  },
};
