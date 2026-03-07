import { useState, useEffect } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  File,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";
import { useAssetStore } from "../../../store/store";
import { fileToBase64 } from "../../../utils/fileToBase64";
import Pagination from "../Pagination";

export default function FilePickerModal({
  isOpen,
  onClose,
  onSelectFile,
  websiteId,
  allowedTypes = ["image"],
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    assets,
    loading,
    pagination,
    fetchAssets,
    uploadAsset,
    deleteAsset
  } = useAssetStore();

  useEffect(() => {
    if (isOpen && websiteId) {
      setCurrentPage(1);
      fetchAssets(websiteId, 1);
    }
  }, [isOpen, websiteId, fetchAssets]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (allowedTypes.includes("image") && !file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setUploading(true);
    try {
      const base64Data = await fileToBase64(file);

      const payload = {
        file: base64Data,
        filename: file.name,
        filetype: file.type,
        website_id: websiteId,
        file_size: file.size,
        file_original_name: file.name,
      };

      const newFile = await uploadAsset(payload);
      setSelectedFile(newFile);
      setCurrentPage(1);
      await fetchAssets(websiteId, 1);
    } catch (error) {
      console.error("Failed to upload file:", error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      await deleteAsset(fileId);
      if (selectedFile?.id === fileId) {
        setSelectedFile(null);
      }
      await fetchAssets(websiteId, currentPage);
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert("Failed to delete file");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchAssets(websiteId, page);
  };

  const handleSelect = () => {
    if (selectedFile) {
      onSelectFile(selectedFile);
      onClose();
    }
  };

  const filteredFiles = assets.filter((file) => {
    const matchesSearch = file.file_original_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      allowedTypes.includes("all") ||
      (allowedTypes.includes("image") && file.mime_type?.startsWith("image"));
    return matchesSearch && matchesType;
  });

  const getFileUrl = (file) => {
    if (file.file_path && file.file_path.startsWith("http")) {
      return file.file_path;
    }
    return `${import.meta.env.VITE_APP_URL}${file.file_path}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Select File</h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose a file or upload a new one
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer flex items-center gap-2">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </>
              )}
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept={allowedTypes.includes("image") ? "image/*" : "*"}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : filteredFiles.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredFiles.map((file) => {
                const isImage =
                  file.mime_type?.startsWith("image/") ||
                  file.mime_type === "image";
                const isSelected = selectedFile?.id === file.id;

                return (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`group relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${isSelected
                      ? "border-indigo-500 ring-2 ring-indigo-100"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div className="aspect-square bg-gray-50 flex items-center justify-center">
                      {isImage ? (
                        <img
                          src={getFileUrl(file)}
                          loading="lazy"
                          alt={file.file_original_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNGRjVFNTAiLz48cGF0aCBkPSJNMzAgMzVMMjUgMjVMMjAgMzVIMzVaMzUgNDBIMjVMMzAgMzBMMzUgNDBaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==";
                          }}
                        />
                      ) : (
                        <File className="w-12 h-12 text-gray-400" />
                      )}
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file.id);
                      }}
                      className="absolute top-2 left-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      title="Delete file"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>

                    <div className="p-2 border-t border-gray-200 bg-white">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {file.file_original_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.file_size)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No files found
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Upload your first file to get started
              </p>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={pagination.lastPage}
          onPageChange={handlePageChange}
          loading={loading}
          totalItems={pagination.total}
          itemsPerPage={pagination.perPage}
        />

        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {selectedFile
              ? `Selected: ${selectedFile.file_original_name}`
              : "No file selected"}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedFile}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}