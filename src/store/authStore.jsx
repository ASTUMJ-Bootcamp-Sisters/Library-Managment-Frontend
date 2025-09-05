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
      
      // Login action
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/login", { email, password });
          const { user, accessToken, refreshToken } = response.data;
          
          // Save tokens to local storage
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
          return { success: false, error: error.response?.data?.message || "Login failed" };
        }
      },
      
      // Register action
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          await api.post("/auth/register", userData);
          
          // Auto login after registration
          const loginResult = await get().login(userData.email, userData.password);
          return loginResult;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Registration failed",
            isLoading: false,
          });
          return { success: false, error: error.response?.data?.message || "Registration failed" };
        }
      },
      
      // Logout action
      logout: async () => {
        try {
          await api.post("/auth/logout");
        // eslint-disable-next-line no-unused-vars
        } catch (e) {
          // ignore error, just clear state
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
      
      // Check if user is admin
      isAdmin: () => {
        const { user } = get();
        return user?.role === "admin";
      },
    }),
    {
      name: "auth-storage", // Name for the localStorage item
    }
  )
);

export default useAuthStore;