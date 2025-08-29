import api from "./axios";

// Fetch admin dashboard stats
export const getAdminStats = async () => {
  const res = await api.get("/auth/admin/stats");
  return res.data;
};
