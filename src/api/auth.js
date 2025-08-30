import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Assign role to user
export const assignUserRole = async (userId, role) => {
  const res = await api.put(`/auth/users/${userId}/role`, { role });
  return res.data;
};

export default api;