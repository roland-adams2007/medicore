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
    lastPage: 0,
    hasNext: false,
    hasPrev: false,
  },

  fetchClinicStaff: async (clinicId, params = {}) => {
    set({ loading: true, error: null });
    try {
      const { pagination } = get();
      const q = new URLSearchParams();
      q.append("page", params.page || pagination.currentPage || 1);
      q.append("limit", params.limit || pagination.pageSize || 20);
      if (params.search) q.append("search", params.search);
      if (params.roleId) q.append("role_id", params.roleId);
      if (params.status) q.append("status", params.status);

      const res = await axiosInstance.get(`/clinics/${clinicId}/staff?${q}`);
      const data = res.data?.data;
      const staff = data?.staff || [];
      const pag = data?.pagination;

      set({
        staff,
        pagination: pag || {
          total: staff.length,
          page: 1,
          totalPages: 1,
          lastPage: 1,
          hasNext: false,
          hasPrev: false,
        },
        loading: false,
        error: null,
      });
      return { staff, pagination: pag };
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to load staff";
      set({ error: msg, loading: false });
      throw error;
    }
  },

  fetchStaff: async (clinicId, branchId, forceRefresh = false) => {
    const { staff } = get();
    if (!forceRefresh && staff.length > 0) return staff;
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(
        `/clinics/${clinicId}/branches/${branchId}/staff`,
      );
      const staff = res.data?.data?.staff;
      if (!Array.isArray(staff)) throw new Error("Invalid response structure");
      set({ staff, loading: false, error: null });
      return staff;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to load staff";
      set({ error: msg, loading: false });
      throw error;
    }
  },

  fetchStaffInvitations: async (clinicId, branchId, params = {}) => {
    const { pagination } = get();
    set({ loading: true, error: null });
    try {
      const q = new URLSearchParams();
      q.append("page", params.page || pagination.currentPage || 1);
      q.append("limit", params.limit || pagination.pageSize || 20);
      if (params.search) q.append("search", params.search);
      if (params.roleId) q.append("role_id", params.roleId);
      if (params.status) q.append("status", params.status);

      const res = await axiosInstance.get(
        `/clinics/${clinicId}/branches/${branchId}/staff/invites?${q}`,
      );
      const responseData = res.data?.data;
      const staffInvites = responseData?.staffInvites || [];
      const paginationData = responseData?.pagination;

      if (!Array.isArray(staffInvites))
        throw new Error("Invalid response structure");

      set({
        staffInvites,
        pagination: paginationData || {
          total: staffInvites.length,
          page: 1,
          limit: 20,
          totalPages: 1,
          lastPage: 1,
          hasNext: false,
          hasPrev: false,
        },
        loading: false,
        error: null,
      });
      return { staffInvites, pagination: paginationData };
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to load invitations";
      set({ error: msg, loading: false });
      throw error;
    }
  },

  getInviteById: async (clinicId, branchId, inviteId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(
        `/clinics/${clinicId}/branches/${branchId}/staff/invites/${inviteId}/setup`,
      );
      const invite = res.data?.data?.invite;
      set({ loading: false });
      return invite;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to load invitation";
      set({ error: msg, loading: false });
      throw error;
    }
  },

  setupStaffProfile: async (clinicId, branchId, inviteId, profileData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post(
        `/clinics/${clinicId}/branches/${branchId}/staff/invites/${inviteId}/setup`,
        profileData,
      );
      set({ loading: false });
      set((state) => ({
        staffInvites: state.staffInvites.map((inv) =>
          String(inv.id) === String(inviteId)
            ? {
                ...inv,
                staff_profile_id: res.data?.data?.staff_profile_id ?? true,
              }
            : inv,
        ),
      }));
      return res.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to save staff profile";
      set({ error: msg, loading: false });
      throw error;
    }
  },

  getStaffProfileForEdit: async (clinicId, branchId, staffId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(
        `/clinics/${clinicId}/branches/${branchId}/staff/profiles/${staffId}`,
      );
      const profile = res.data?.data?.profile;
      set({ loading: false });
      return profile;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to load staff profile";
      set({ error: msg, loading: false });
      throw error;
    }
  },

  updateStaffProfile: async (clinicId, branchId, staffId, profileData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put(
        `/clinics/${clinicId}/branches/${branchId}/staff/profiles/${staffId}`,
        profileData,
      );
      set({ loading: false });
      set((state) => ({
        staff: state.staff.map((s) =>
          String(s.staff_profile_id) === String(staffId)
            ? { ...s, ...profileData }
            : s,
        ),
      }));
      return res.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to update staff profile";
      set({ error: msg, loading: false });
      throw error;
    }
  },

  resendInvite: async (clinicId, branchId, inviteId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post(
        `/clinics/${clinicId}/branches/${branchId}/staff/invites/${inviteId}/resend`,
      );
      set({ loading: false });
      return res.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend invite";
      set({ error: msg, loading: false });
      throw error;
    }
  },

  inviteStaff: async (clinicId, { email, branch_id, role_id }) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post(`/branch_users/${clinicId}/invite`, {
        email,
        branch_id,
        role_id,
      });
      set({ loading: false });
      return res.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to send invite";
      set({ error: msg, loading: false });
      throw error;
    }
  },

  lookupInvite: async (token) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/branch_users/invite/lookup`, {
        params: { token },
      });
      set({ loading: false });
      return res.data?.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to look up invite";
      set({ error: msg, loading: false });
      throw error;
    }
  },

  acceptInvite: async (token) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post(`/branch_users/invite/accept`, {
        token,
      });
      set({ loading: false });
      return res.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to accept invite";
      set({ error: msg, loading: false });
      throw error;
    }
  },

  rejectInvite: async (token) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post(`/branch_users/invite/reject`, {
        token,
      });
      set({ loading: false });
      return res.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to decline invite";
      set({ error: msg, loading: false });
      throw error;
    }
  },

  addStaff: (member) => {
    if (!member) return;
    set((state) => ({ staff: [member, ...state.staff] }));
  },

  removeStaff: (staffProfileId) => {
    if (!staffProfileId) return;
    set((state) => ({
      staff: state.staff.filter((s) => s.staff_profile_id !== staffProfileId),
    }));
  },

  getStaffById: (staffProfileId) => {
    if (!staffProfileId) return null;
    return (
      get().staff.find((s) => s.staff_profile_id === staffProfileId) ?? null
    );
  },

  clearError: () => set({ error: null }),
  reset: () =>
    set({ staff: [], staffInvites: [], loading: false, error: null }),
}));
