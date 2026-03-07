import { create } from "zustand";
import axiosInstance from "../../api/axiosInstance";

export const useStateStore = create((set, get) => ({
  states: [],
  loading: false,
  error: null,

  fetchStates: async () => {
    const { states } = get();
    if (states.length > 0) return states;

    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/states");

      if (!response.data?.data?.states)
        throw new Error("Invalid response structure");

      const states = response.data.data.states;
      set({ states, loading: false, error: null });

      return states;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load states";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
}));
