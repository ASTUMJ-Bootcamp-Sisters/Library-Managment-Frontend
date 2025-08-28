import { create } from "zustand";
import api from "../api/auth";

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
      alert(err?.response?.data?.message || "Failed to update blacklist status");
    }
  },
}));

export default useUserStore;
