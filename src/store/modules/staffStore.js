import { create } from "zustand";
import axiosInstance from "../../api/axiosInstance";

export const useStaffStore = create((set, get) => ({
  staff: [],
  staffInvites: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {},

  fetchStaff: async (clinicId, branchId, forceRefresh = false) => {
    const { staff } = get();
    if (!forceRefresh && staff.length > 0) return staff;
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/clinics/${clinicId}/branches/${branchId}/staff`,
      );
      const staff = response.data?.data?.staff;
      if (!Array.isArray(staff)) throw new Error("Invalid response structure");
      set({ staff, loading: false, error: null });
      return staff;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load staff";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  fetchStaffInvitations: async (clinicId, branchId, params = {}) => {
    const { pagination } = get();
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      const page = params.page || pagination.currentPage || 1;
      const limit = params.limit || pagination.pageSize || 20;
      queryParams.append("page", page);
      queryParams.append("limit", limit);
      if (params.search) queryParams.append("search", params.search);
      if (params.roleId) queryParams.append("role_id", params.roleId);
      if (params.status) queryParams.append("status", params.status);

      const response = await axiosInstance.get(
        `/clinics/${clinicId}/branches/${branchId}/staff/invites?${queryParams}`,
      );

      const responseData = response.data?.data;
      const staffInvites = responseData?.staffInvites || [];
      const paginationData = responseData?.pagination;

      if (!Array.isArray(staffInvites))
        throw new Error("Invalid response structure");

      set({
        staffInvites,
        pagination: paginationData || {
          total: staffInvites.length,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
        loading: false,
        error: null,
      });

      return { staffInvites, pagination: paginationData };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load staff invitations";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  getInviteById: async (clinicId, branchId, inviteId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/clinics/${clinicId}/branches/${branchId}/staff/invites/${inviteId}/setup`,
      );
      const invite = response.data?.data?.invite;
      set({ loading: false });
      return invite;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load invitation";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  setupStaffProfile: async (clinicId, branchId, inviteId, profileData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `/clinics/${clinicId}/branches/${branchId}/staff/invites/${inviteId}/setup`,
        profileData,
      );
      set({ loading: false });

      set((state) => ({
        staffInvites: state.staffInvites.map((inv) =>
          String(inv.id) === String(inviteId)
            ? {
                ...inv,
                staff_profile_id: response.data?.data?.staff_profile_id ?? true,
              }
            : inv,
        ),
      }));

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save staff profile";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  resendInvite: async (clinicId, branchId, inviteId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `/clinics/${clinicId}/branches/${branchId}/staff/invites/${inviteId}/resend`,
      );
      set({ loading: false });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend invite";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  inviteStaff: async (clinicId, { email, branch_id, role_id }) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `/branch_users/${clinicId}/invite`,
        { email, branch_id, role_id },
      );
      set({ loading: false });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send invite";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  lookupInvite: async (token) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/branch_users/invite/lookup`, {
        params: { token },
      });
      const invite = response.data?.data;
      set({ loading: false });
      return invite;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to look up invite";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  acceptInvite: async (token) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(`/branch_users/invite/accept`, {
        token,
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to accept invite";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  rejectInvite: async (token) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(`/branch_users/invite/reject`, {
        token,
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to decline invite";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  addStaff: (member) => {
    if (!member) return;
    set((state) => ({ staff: [member, ...state.staff] }));
  },

  removeStaff: (userId) => {
    if (!userId) return;
    set((state) => ({
      staff: state.staff.filter((s) => s.user_id !== userId),
    }));
  },

  getStaffById: (userId) => {
    if (!userId) return null;
    return get().staff.find((s) => s.user_id === userId) ?? null;
  },

  clearError: () => set({ error: null }),
  reset: () => set({ staff: [], loading: false, error: null }),
}));
