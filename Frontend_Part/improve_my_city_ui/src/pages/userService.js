import api from "./api";

export const userService = {
  getUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  getOfficers: async () => {
    const response = await api.get("/users/officers");
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.post(`/users/${userId}/roles`, {
      roleName: role,
    });
    return response.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const endpoint = isActive ? "activate" : "deactivate";
    const response = await api.put(`/users/${userId}/${endpoint}`);
    return response.data;
  },
};
