import { create } from "zustand";
import axiosInstance from "../../api/axiosInstance";

export const useSubStore = create((set, get) => ({
  subs: [],
  loading: false,
  error: null,

  fetchSubs: async () => {
    const { subs } = get();
    if (subs.length > 0) return subs;

    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/subscriptions");

      if (!response.data?.data?.subs)
        throw new Error("Invalid response structure");

      const subs = response.data.data.subs;
      set({ subs, loading: false, error: null });

      return subs;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to load subs";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
}));
