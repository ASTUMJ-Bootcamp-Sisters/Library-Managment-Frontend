import { create } from "zustand";
import { fetchSettings, updateSettings } from "../api/settings";

export const useSettingsStore = create((set) => ({
  settings: null,
  loading: false,
  error: null,
  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const settings = await fetchSettings();
      set({ settings, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  updateSettings: async (data, token) => {
    set({ loading: true, error: null });
    try {
      const settings = await updateSettings(data, token);
      set({ settings, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));
