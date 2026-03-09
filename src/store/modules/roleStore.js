import { create } from "zustand";
import axiosInstance from "../../api/axiosInstance";

export const useRolestore = create((set, get) => ({
  roles: [],
  loading: false,
  error: null,

  fetchRoles: async () => {
    const { roles } = get();
    if (roles.length > 0) return roles;

    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/roles");

      if (!response.data?.data?.roles)
        throw new Error("Invalid response structure");

      const roles = response.data.data.roles;
      set({ roles, loading: false, error: null });

      return roles;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load roles";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
}));
