import api from "@/api/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/login", { email, password });
          const { user, accessToken, refreshToken } = response.data;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true, user };
        } catch (error) {
          set({
            error: error.response?.data?.message || "Login failed",
            isLoading: false,
          });
          return {
            success: false,
            error: error.response?.data?.message || "Login failed",
          };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          await api.post("/auth/register", userData);

          const loginResult = await get().login(
            userData.email,
            userData.password
          );
          return loginResult;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Registration failed",
            isLoading: false,
          });
          return {
            success: false,
            error: error.response?.data?.message || "Registration failed",
          };
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch (e) {
          // ignore
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setUser: (user) => set({ user }),

      isAdmin: () => {
        const { user } = get();
        return user?.role === "admin";
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
