import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon, File, Loader2, Search, Trash2 } from "lucide-react";
import { useAssetStore } from "../../../store/store";
import { fileToBase64 } from "../../../utils/fileToBase64";
import Pagination from "../Pagination";

export default function FilePickerModal({ isOpen, onClose, onSelectFile, clinicId, allowedTypes = ["image"] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { assets, loading, pagination, fetchAssets, uploadAsset, deleteAsset } = useAssetStore();

  useEffect(() => {
    if (isOpen && clinicId) {
      setCurrentPage(1);
      fetchAssets(clinicId, 1);
    }
  }, [isOpen, clinicId]);

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
      const newFile = await uploadAsset(clinicId, {
        file: base64Data,
        filename: file.name,
        filetype: file.type,
        file_size: file.size,
        file_original_name: file.name,
      });
      setSelectedFile(newFile);
      setCurrentPage(1);
      await fetchAssets(clinicId, 1);
    } catch (error) {
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      await deleteAsset(clinicId, fileId);
      if (selectedFile?.id === fileId) setSelectedFile(null);
    } catch {
      alert("Failed to delete file");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchAssets(clinicId, page);
  };

  const handleSelect = () => {
    if (selectedFile) {
      onSelectFile(selectedFile);
      onClose();
    }
  };

  const filteredFiles = assets.filter((file) => {
    const matchesSearch = file.file_original_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = allowedTypes.includes("all") || (allowedTypes.includes("image") && file.mime_type?.startsWith("image"));
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0D1117]/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-[0_24px_80px_rgba(13,17,23,0.25)] animate-[modalIn_0.22s_ease]">
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:none}}`}</style>

        <div className="p-5 border-b border-black/[0.09] flex items-center justify-between">
          <div>
            <h2 className="font-['DM_Serif_Display'] text-[20px] text-[#0D1117]">Media Library</h2>
            <p className="text-[12px] text-[#8A9BB0] mt-0.5">Choose a file or upload a new one</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-[#F7F4EF] rounded-lg flex items-center justify-center text-[#8A9BB0] hover:bg-[#FAF0ED] hover:text-[#E8927C] transition-all border-none cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 border-b border-black/[0.09] flex gap-3">
          <div className="flex-1 relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9BB0] pointer-events-none" />
            <input
              type="text"
              placeholder="Search files…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-[13px] font-['DM_Sans'] bg-[#F7F4EF] border border-black/[0.09] rounded-xl outline-none text-[#0D1117] placeholder-[#B8C0CC] focus:border-[#4A7C59] focus:bg-white transition-all"
            />
          </div>
          <label className="flex items-center gap-1.5 px-3 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl hover:bg-[#2F5C3A] transition-all cursor-pointer font-['DM_Sans']">
            {uploading ? <><Loader2 size={13} className="animate-spin" />Uploading…</> : <><Upload size={13} />Upload</>}
            <input type="file" className="hidden" onChange={handleFileUpload} accept={allowedTypes.includes("image") ? "image/*" : "*"} disabled={uploading} />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 size={24} className="animate-spin text-[#4A7C59]" />
            </div>
          ) : filteredFiles.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredFiles.map((file) => {
                const isImage = file.mime_type?.startsWith("image/") || file.mime_type === "image";
                const isSelected = selectedFile?.id === file.id;
                return (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`group relative border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${isSelected ? "border-[#4A7C59] shadow-[0_0_0_3px_rgba(74,124,89,0.12)]" : "border-black/[0.09] hover:border-[#4A7C59]/40"}`}
                  >
                    <div className="aspect-square bg-[#F7F4EF] flex items-center justify-center">
                      {isImage ? (
                        <img src={file.file_url} loading="lazy" alt={file.file_original_name} className="w-full h-full object-cover" />
                      ) : (
                        <File size={32} className="text-[#8A9BB0]" />
                      )}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#4A7C59] rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.id); }}
                      className="absolute top-2 left-2 p-1 bg-[#c05c3c] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#a04030] border-none cursor-pointer"
                    >
                      <Trash2 size={11} />
                    </button>
                    <div className="p-2 border-t border-black/[0.06] bg-white">
                      <p className="text-[11px] font-semibold text-[#0D1117] truncate">{file.file_original_name}</p>
                      <p className="text-[10px] text-[#8A9BB0]">{formatFileSize(file.file_size)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="w-14 h-14 bg-[#F7F4EF] rounded-2xl flex items-center justify-center mb-3">
                <ImageIcon size={22} className="text-[#8A9BB0]" />
              </div>
              <p className="text-[14px] font-semibold text-[#0D1117] mb-1">No files found</p>
              <p className="text-[12px] text-[#8A9BB0]">Upload your first file to get started</p>
            </div>
          )}
        </div>

        <div className="px-4">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.lastPage}
            onPageChange={handlePageChange}
            loading={loading}
            totalItems={pagination.total}
            itemsPerPage={pagination.perPage}
          />
        </div>

        <div className="p-4 border-t border-black/[0.09] flex justify-between items-center">
          <p className="text-[12px] text-[#8A9BB0]">
            {selectedFile ? `Selected: ${selectedFile.file_original_name}` : "No file selected"}
          </p>
          <div className="flex gap-2.5">
            <button onClick={onClose} className="px-4 py-2 bg-[#F7F4EF] border border-black/[0.09] text-[#8A9BB0] text-[12px] font-semibold rounded-xl hover:bg-[#EEF2F7] transition-all font-['DM_Sans'] cursor-pointer">
              Cancel
            </button>
            <button onClick={handleSelect} disabled={!selectedFile} className="px-4 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl hover:bg-[#2F5C3A] transition-all font-['DM_Sans'] border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              Select File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}