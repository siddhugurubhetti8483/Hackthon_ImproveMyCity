import axios from "axios";

const API_BASE_URL = "https://localhost:7230/api";

// Axios instance create karo
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - JWT token automatically add karo
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 403 errors handle karo
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // 403 error - show proper message
      const errorMessage =
        error.response?.data?.message ||
        "Access denied. You do not have permission to perform this action.";
      throw new Error(errorMessage);
    }

    if (error.response?.status === 401) {
      // 401 error - logout karo
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
