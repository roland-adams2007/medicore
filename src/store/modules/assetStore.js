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

  transfers: [],
  transfersLoading: false,
  transfersError: null,

  storageStats: {
    usedBytes: 0,
    maxBytes: null,
    percent: 0,
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
    set({ transfersLoading: true, transfersError: null });
    try {
      const response = await axiosInstance.get(`/assets/my-transfers`);
      const transfers = response.data?.data?.transfers || [];
      set({ transfers, transfersLoading: false });
      return transfers;
    } catch (error) {
      set({
        transfersError:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch transfers",
        transfersLoading: false,
      });
      throw error;
    }
  },

  updateTransferStatus: async (clinicId, transferId, status) => {
    try {
      await axiosInstance.patch(
        `/assets/${clinicId}/assets/transfers/${transferId}/status`,
        { status },
      );
      set((state) => ({
        transfers: state.transfers.map((t) =>
          t.id === transferId ? { ...t, status } : t
        ),
      }));
    } catch (error) {
      throw error;
    }
  },

  fetchStorageStats: async (clinicId) => {
    try {
      const response = await axiosInstance.get(`/assets/${clinicId}/storage`);
      const data = response.data?.data;
      const usedBytes = data?.used_bytes ?? 0;
      const maxBytes = data?.max_bytes ?? null;
      const percent = maxBytes ? Math.min(100, (usedBytes / maxBytes) * 100) : 0;
      set({ storageStats: { usedBytes, maxBytes, percent } });
    } catch {
    }
  },

  downloadAsset: async (clinicId, assetId, filename) => {
    try {
      const response = await axiosInstance.get(
        `/assets/${clinicId}/assets/${assetId}/download`,
        { responseType: "blob" },
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      throw error;
    }
  },
}));