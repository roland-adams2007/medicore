import { create } from "zustand";
import axiosInstance from "../../api/axiosInstance";

export const useClinicStore = create((set, get) => ({
  selectedClinic: null,
  clinics: [],
  loading: false,
  error: null,
  initialized: false,

  initialize: () => {
    try {
      const stored = localStorage.getItem("selectedClinic");
      if (stored) {
        set({ selectedClinic: JSON.parse(stored), initialized: true });
      } else {
        set({ initialized: true });
      }
    } catch {
      localStorage.removeItem("selectedClinic");
      set({ selectedClinic: null, initialized: true });
    }
  },

  fetchClinics: async (forceRefresh = false) => {
    const { clinics, initialized } = get();
    if (!forceRefresh && clinics.length > 0 && initialized) return clinics;

    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/clinics");
      const clinics = response.data?.data?.clinics;
      if (!Array.isArray(clinics)) throw new Error("Invalid response structure");

      set({ clinics, loading: false, error: null });

      // auto-select first clinic if nothing is selected yet
      const { selectedClinic } = get();
      if (!selectedClinic && clinics.length > 0) {
        const first = clinics[0];
        const firstBranch = first.branches?.[0];
        get().setSelectedClinic({
          id: first.id,
          name: first.name,
          branch: firstBranch?.name ?? "Main Branch",
          branchId: firstBranch?.id ?? null,
          role: first.role ?? null,
          roles: first.roles ?? [],
        });
      } else if (selectedClinic) {
        // re-sync role/roles for the currently selected clinic in case they changed
        const match = clinics.find((c) => c.id === selectedClinic.id);
        if (match) {
          get().setSelectedClinic({
            ...selectedClinic,
            role: match.role ?? selectedClinic.role,
            roles: match.roles ?? selectedClinic.roles ?? [],
          });
        }
      }

      return clinics;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to load clinics";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  setSelectedClinic: (clinic) => {
    if (clinic) {
      try {
        localStorage.setItem("selectedClinic", JSON.stringify(clinic));
      } catch {}
    } else {
      localStorage.removeItem("selectedClinic");
    }
    set({ selectedClinic: clinic });
  },

  clearSelectedClinic: () => {
    localStorage.removeItem("selectedClinic");
    set({ selectedClinic: null });
  },

  addClinic: (clinic) => {
    if (!clinic) return;
    set((state) => ({ clinics: [clinic, ...state.clinics] }));
  },

  removeClinic: (clinicId) => {
    if (!clinicId) return;
    set((state) => {
      const newClinics = state.clinics.filter((c) => c.id !== clinicId);
      if (state.selectedClinic?.id === clinicId) {
        const next = newClinics[0] ?? null;
        if (next) localStorage.setItem("selectedClinic", JSON.stringify(next));
        else localStorage.removeItem("selectedClinic");
        return { clinics: newClinics, selectedClinic: next };
      }
      return { clinics: newClinics };
    });
  },

  getClinicById: (id) => {
    if (!id) return null;
    return get().clinics.find((c) => c.id === id) ?? null;
  },

  clearError: () => set({ error: null }),

  reset: () => {
    localStorage.removeItem("selectedClinic");
    set({ selectedClinic: null, clinics: [], loading: false, error: null, initialized: false });
  },
}));