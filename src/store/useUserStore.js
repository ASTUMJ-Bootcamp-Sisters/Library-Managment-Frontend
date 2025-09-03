import { create } from "zustand";
import api from "../api/auth";
import { toast } from "../hooks/use-toast";

const useUserStore = create((set, get) => ({
  users: [],
  loading: false,
  error: "",
  fetchUsers: async () => {
    set({ loading: true, error: "" });
    try {
      const res = await api.get("/auth/users");
      set({ users: res.data });
    } catch (err) {
      set({ error: err?.response?.data?.message || "Failed to fetch users" });
    } finally {
      set({ loading: false });
    }
  },
  toggleBlacklist: async (userId, isBlacklisted) => {
    try {
      const res = await api.put(`/auth/users/${userId}/blacklist`, { isBlacklisted: !isBlacklisted });
      set({
        users: get().users.map((u) =>
          u._id === userId ? { ...u, isBlacklisted: res.data.user.isBlacklisted } : u
        ),
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to update blacklist status",
        variant: "destructive"
      });
    }
  },
  assignRole: async (userId, role) => {
    try {
      const res = await import("../api/auth").then(m => m.assignUserRole(userId, role));
      set({
        users: get().users.map((u) =>
          u._id === userId ? { ...u, role: res.user.role } : u
        ),
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to update user role",
        variant: "destructive"
      });
    }
  },
}));

export default useUserStore;
