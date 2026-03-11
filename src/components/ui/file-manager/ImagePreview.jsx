import { useState, useEffect, useRef, useCallback } from "react";
import {
  X, Download, ZoomIn, ZoomOut, RotateCw, Info, ChevronLeft, ChevronRight,
  Calendar, HardDrive, FileType, User, Eye, EyeOff, Maximize2, Minimize2,
} from "lucide-react";

function formatFileSize(bytes) {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function fmtDateTime(d) {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dt)) return "—";
  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${m[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()} at ${dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export default function ImagePreview({ isOpen, onClose, asset, assets = [], onNavigate }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  const currentIndex = assets.findIndex(a => a.id === asset?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < assets.length - 1;

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
    }
  }, [asset?.id, isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate?.(assets[currentIndex - 1]);
      if (e.key === "ArrowRight" && hasNext) onNavigate?.(assets[currentIndex + 1]);
      if (e.key === "+") setZoom(z => Math.min(z + 0.25, 4));
      if (e.key === "-") setZoom(z => Math.max(z - 0.25, 0.25));
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, hasPrev, hasNext, currentIndex, assets]);

  const handleDownload = useCallback(async () => {
    if (!asset?.file_url) return;
    try {
      const response = await fetch(asset.file_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = asset.file_original_name || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(asset.file_url, "_blank");
    }
  }, [asset]);

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging || !dragStart) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDragStart(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoom(z => Math.max(0.25, Math.min(4, z + delta)));
  };

  if (!isOpen || !asset) return null;

  const isImage = asset.mime_type?.startsWith("image/") || asset.mime_type === "image";

  return (
    <div
      className={`fixed inset-0 z-[300] flex ${fullscreen ? "bg-black" : "bg-[#0D1117]/90 backdrop-blur-md"}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        @keyframes previewIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        .preview-animate { animation: previewIn 0.18s ease; }
        .img-protected { -webkit-user-drag: none; user-drag: none; pointer-events: none; }
      `}</style>

      <div className={`relative flex flex-col flex-1 overflow-hidden preview-animate`}>
        <div className="flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-sm flex-shrink-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all border-none cursor-pointer flex-shrink-0">
              <X size={15} />
            </button>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-white truncate">{asset.file_original_name}</p>
              {assets.length > 1 && (
                <p className="text-[11px] text-white/50">{currentIndex + 1} of {assets.length}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={() => setZoom(z => Math.max(0.25, z - 0.25))} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all border-none cursor-pointer" title="Zoom out">
              <ZoomOut size={14} />
            </button>
            <button onClick={() => setZoom(1)} className="px-2.5 h-8 text-[11px] font-bold text-white bg-white/10 rounded-lg hover:bg-white/20 transition-all border-none cursor-pointer min-w-[44px]">
              {Math.round(zoom * 100)}%
            </button>
            <button onClick={() => setZoom(z => Math.min(4, z + 0.25))} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all border-none cursor-pointer" title="Zoom in">
              <ZoomIn size={14} />
            </button>
            <div className="w-px h-5 bg-white/20 mx-1" />
            <button onClick={() => setRotation(r => r + 90)} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all border-none cursor-pointer" title="Rotate">
              <RotateCw size={14} />
            </button>
            <button onClick={() => setShowDetails(s => !s)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all border-none cursor-pointer ${showDetails ? "bg-[#4A7C59] text-white" : "bg-white/10 text-white hover:bg-white/20"}`} title="File details">
              <Info size={14} />
            </button>
            <button onClick={handleDownload} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-[#4A7C59] transition-all border-none cursor-pointer" title="Download">
              <Download size={14} />
            </button>
            <button onClick={() => setFullscreen(f => !f)} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all border-none cursor-pointer" title="Fullscreen">
              {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div
            ref={containerRef}
            className="flex-1 flex items-center justify-center overflow-hidden relative"
            style={{ cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            {hasPrev && (
              <button
                onClick={() => onNavigate?.(assets[currentIndex - 1])}
                className="absolute left-4 z-10 w-10 h-10 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl text-white hover:bg-black/60 transition-all border-none cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
            )}

            {isImage ? (
              <div
                ref={imgRef}
                className="select-none"
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transition: dragging ? "none" : "transform 0.15s ease",
                  transformOrigin: "center center",
                }}
              >
                <img
                  src={asset.file_url}
                  alt={asset.file_original_name}
                  className="img-protected max-w-[80vw] max-h-[75vh] object-contain rounded-lg shadow-2xl select-none"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-white/60">
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center">
                  <FileType size={32} />
                </div>
                <p className="text-[14px]">{asset.file_original_name}</p>
                <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white text-[13px] font-semibold rounded-xl border-none cursor-pointer hover:bg-[#2F5C3A] transition-all">
                  <Download size={14} /> Download file
                </button>
              </div>
            )}

            {hasNext && (
              <button
                onClick={() => onNavigate?.(assets[currentIndex + 1])}
                className="absolute right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl text-white hover:bg-black/60 transition-all border-none cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>

          {showDetails && (
            <div className="w-72 flex-shrink-0 bg-[#0D1117]/80 backdrop-blur-md border-l border-white/10 overflow-y-auto">
              <div className="p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/40 mb-4">File Details</p>

                {isImage && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-white/10">
                    <img src={asset.file_url} alt="" className="w-full object-cover max-h-40 img-protected" onContextMenu={e => e.preventDefault()} draggable={false} />
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  {[
                    { icon: <FileType size={13} />, label: "File name", val: asset.file_original_name },
                    { icon: <HardDrive size={13} />, label: "File size", val: formatFileSize(asset.file_size) },
                    { icon: <FileType size={13} />, label: "Type", val: asset.mime_type || asset.extension || "—" },
                    { icon: <User size={13} />, label: "Uploaded by", val: asset.fname ? `${asset.fname} ${asset.lname || ""}`.trim() : "—" },
                    { icon: <Calendar size={13} />, label: "Uploaded on", val: fmtDateTime(asset.created_at) },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="p-3 bg-white/5 rounded-xl border border-white/[0.07]">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-white/30 mb-1">
                        {icon}{label}
                      </div>
                      <p className="text-[12px] text-white/80 break-all">{val}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleDownload}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl border-none cursor-pointer hover:bg-[#2F5C3A] transition-all font-['DM_Sans']"
                >
                  <Download size={13} /> Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}