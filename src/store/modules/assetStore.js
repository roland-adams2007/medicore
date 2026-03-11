import { create } from "zustand";
import axiosInstance from "../../api/axiosInstance";

export const useAssetStore = create((set, get) => ({
  assets: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
    perPage: 20,
    lastPage: 1,
  },

  fetchAssets: async (clinicId, page = 1, params = {}) => {
    set({ loading: true, error: null });
    try {
      const query = new URLSearchParams({ page, limit: 20, ...params });
      const response = await axiosInstance.get(
        `/assets/${clinicId}/assets?${query}`,
      );
      const data = response.data?.data;
      set({
        assets: data?.assets || [],
        pagination: {
          currentPage: data?.pagination?.page || page,
          total: data?.pagination?.total || 0,
          totalPages: data?.pagination?.totalPages || 1,
          hasNext: data?.pagination?.hasNext || false,
          hasPrev: data?.pagination?.hasPrev || false,
          perPage: data?.pagination?.limit || 20,
          lastPage: data?.pagination?.totalPages || 1,
        },
        loading: false,
      });
      return data?.assets || [];
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch assets",
        loading: false,
      });
      throw error;
    }
  },

  uploadAsset: async (clinicId, payload) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `/assets/${clinicId}/assets/upload`,
        payload,
      );
      const asset = response.data?.data?.asset;
      set((state) => ({
        assets: [asset, ...state.assets],
        loading: false,
      }));
      return asset;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message || error?.message || "Upload failed",
        loading: false,
      });
      throw error;
    }
  },

  deleteAsset: async (clinicId, assetId) => {
    try {
      await axiosInstance.delete(`/assets/${clinicId}/assets/${assetId}`);
      set((state) => ({
        assets: state.assets.filter((a) => a.id !== assetId),
      }));
    } catch (error) {
      throw error;
    }
  },

  transferAsset: async (clinicId, assetId, receiverId, message) => {
    try {
      const response = await axiosInstance.post(
        `/assets/${clinicId}/assets/${assetId}/transfer`,
        {
          receiver_id: receiverId,
          message,
        },
      );
      return response.data?.data?.transfer;
    } catch (error) {
      throw error;
    }
  },

  getMyTransfers: async () => {
    try {
      const response = await axiosInstance.get(`/assets/my-transfers`);
      return response.data?.data?.transfers || [];
    } catch (error) {
      throw error;
    }
  },
}));
