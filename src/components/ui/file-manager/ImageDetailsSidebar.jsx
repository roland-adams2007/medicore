import {
  X,
  Download,
  Trash2,
  Calendar,
  HardDrive,
  FileType,
  Link as LinkIcon,
  Copy,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";

const ImageDetailsSidebar = ({ file, onClose, onDelete }) => {
  const [copied, setCopied] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (file) {
      requestAnimationFrame(() => setVisible(true));
    }
  }, [file]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (!file) return null;

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fileUrl =
    file.file_path?.startsWith("http")
      ? file.file_path
      : file.file_path
      ? `${import.meta.env.VITE_APP_URL}${file.file_path}`
      : null;

  const fileType = file.mime_type?.startsWith("image/")
    ? "image"
    : file.mime_type?.startsWith("video/")
    ? "video"
    : file.mime_type?.startsWith("audio/")
    ? "audio"
    : file.mime_type?.includes("pdf")
    ? "pdf"
    : file.mime_type || "unknown";

  const displayName = file.file_original_name || file.file_name || "Unnamed file";

  const extension =
    file.extension ||
    displayName.includes(".")
      ? displayName.split(".").pop().toUpperCase()
      : "—";

  const handleDownload = async () => {
    if (!fileUrl) return;
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = displayName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderFilePreview = () => {
    if (!fileUrl) return null;

    if (fileType === "image") {
      return (
        <div className="p-4 border-b border-gray-100">
          <img
            src={fileUrl}
            alt={displayName}
            className="w-full rounded-lg object-cover"
          />
        </div>
      );
    }

    if (fileType === "pdf") {
      return (
        <div className="p-4 border-b border-gray-100 h-64">
          <iframe
            src={fileUrl}
            title={displayName}
            className="w-full h-full rounded-lg"
          />
        </div>
      );
    }

    if (fileType === "video") {
      return (
        <div className="p-4 border-b border-gray-100">
          <video src={fileUrl} controls className="w-full rounded-lg" />
        </div>
      );
    }

    if (fileType === "audio") {
      return (
        <div className="p-4 border-b border-gray-100">
          <audio src={fileUrl} controls className="w-full" />
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          zIndex: 40,
          opacity: visible ? 1 : 0,
          transition: "opacity 300ms ease",
        }}
      />

      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: "100%",
          maxWidth: "360px",
          backgroundColor: "#fff",
          borderLeft: "1px solid #e5e7eb",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.12)",
          transform: visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">File Details</h3>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {renderFilePreview()}

          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                File Name
              </h4>
              <p className="text-sm text-gray-800 break-words font-medium">
                {displayName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <HardDrive size={11} />
                  Size
                </h4>
                <p className="text-sm text-gray-800 font-medium">
                  {formatFileSize(file.file_size)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <FileType size={11} />
                  Extension
                </h4>
                <p className="text-sm text-gray-800 font-medium uppercase">
                  {extension}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  Type
                </h4>
                <p className="text-sm text-gray-800 font-medium capitalize">
                  {fileType}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  MIME
                </h4>
                <p className="text-sm text-gray-800 font-medium truncate">
                  {file.mime_type || "—"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Calendar size={11} />
                Created
              </h4>
              <p className="text-sm text-gray-800 font-medium">
                {formatDate(file.created_at)}
              </p>
            </div>

            {file.updated_at && file.updated_at !== file.created_at && (
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <Calendar size={11} />
                  Modified
                </h4>
                <p className="text-sm text-gray-800 font-medium">
                  {formatDate(file.updated_at)}
                </p>
              </div>
            )}

            {file.file_uuid && (
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  File UUID
                </h4>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-xs font-mono text-gray-600 break-all flex-1">
                    {file.file_uuid}
                  </p>
                  <button
                    onClick={() => copyToClipboard(file.file_uuid, "uuid")}
                    className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0 text-gray-500"
                    title="Copy UUID"
                  >
                    {copied === "uuid" ? (
                      <Check size={13} className="text-emerald-500" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {fileUrl && (
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <LinkIcon size={11} />
                  File URL
                </h4>
                <div className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-500 hover:text-indigo-600 break-all flex-1"
                  >
                    {fileUrl}
                  </a>
                  <button
                    onClick={() => copyToClipboard(fileUrl, "url")}
                    className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0 text-gray-500"
                    title="Copy URL"
                  >
                    {copied === "url" ? (
                      <Check size={13} className="text-emerald-500" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={handleDownload}
            disabled={!fileUrl}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm shadow-sm shadow-indigo-200"
          >
            <Download size={16} />
            Download
          </button>
          <button
            onClick={() => onDelete(file.id)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 text-red-500 hover:text-red-600 font-medium rounded-lg transition-colors text-sm border border-red-200"
          >
            <Trash2 size={16} />
            Delete File
          </button>
        </div>
      </aside>
    </>
  );
};

export default ImageDetailsSidebar;