import api from "./api";

export const authService = {
  // Register user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Verify email OTP
  verifyEmailOtp: async (otpData) => {
    const response = await api.post("/auth/verify-email-otp", otpData);
    return response.data;
  },

  // Setup TOTP
  setupTotp: async () => {
    const response = await api.post("/auth/setup-totp");
    return response.data;
  },

  // Verify and enable TOTP
  verifyEnableTotp: async (totpData) => {
    const response = await api.post("/auth/verify-enable-totp", totpData);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.post("/auth/change-password", passwordData);
    return response.data;
  },
};
