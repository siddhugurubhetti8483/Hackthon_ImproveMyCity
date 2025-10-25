import api from "./api";

export const userService = {
  getUsers: async () => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      console.error("User service error:", error);
      throw error;
    }
  },

  getOfficers: async () => {
    try {
      const response = await api.get("/users/officers");
      return response.data;
    } catch (error) {
      console.error("Officers service error:", error);
      throw error;
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const response = await api.post(`/users/${userId}/roles`, {
        roleName: role,
      });
      return response.data;
    } catch (error) {
      console.error("Update role error:", error);
      throw error;
    }
  },

  updateUserStatus: async (userId, isActive) => {
    try {
      const endpoint = isActive ? "activate" : "deactivate";
      const response = await api.put(`/users/${userId}/${endpoint}`);
      return response.data;
    } catch (error) {
      console.error("Update status error:", error);
      throw error;
    }
  },
};
