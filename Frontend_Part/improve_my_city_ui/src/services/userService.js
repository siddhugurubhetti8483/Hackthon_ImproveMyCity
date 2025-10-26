import api from "./api";

export const userService = {
  /**   *  Get all users list   */
  getUsers: async () => {
    try {
      const response = await api.get("/Users");
      return response.data;
    } catch (error) {
      console.error("User service error:", error);
      throw error;
    }
  },

  /**   * Get all officers   */
  getOfficers: async () => {
    try {
      const response = await api.get("/Users/Admin,Officer");
      return response.data;
    } catch (error) {
      console.error("Officers service error:", error);
      throw error;
    }
  },

  getAvailableOfficers: async () => {
    try {
      const response = await api.get("/Users/Admin,Officer");
      return response.data;
    } catch (error) {
      console.error("Available officers service error:", error);
      throw error;
    }
  },

  /**  * Update user role (Admin/Officer/User)  */
  updateUserRole: async (userId, role) => {
    try {
      const response = await api.post(`/Users/${userId}/roles`, {
        roleName: role,
      });
      return response.data;
    } catch (error) {
      console.error("Update role error:", error);
      throw error;
    }
  },

  /** Activate / Deactivate user   */
  updateUserStatus: async (userId, isActive) => {
    try {
      const endpoint = isActive ? "activate" : "deactivate";
      const response = await api.put(`/Users/${userId}/${endpoint}`);
      return response.data;
    } catch (error) {
      console.error("Update status error:", error);
      throw error;
    }
  },

  /**  Get user by ID   */
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/Users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Get user by ID error:", error);
      throw error;
    }
  },

  /**   *  Update user profile   */
  updateUserProfile: async (userId, userData) => {
    try {
      const response = await api.put(`/Users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error("Update user profile error:", error);
      throw error;
    }
  },
};
