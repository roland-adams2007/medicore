import { useState, useEffect, useRef, useCallback } from "react";
import {
    X, Download, ZoomIn, ZoomOut, RotateCw, Info, ChevronLeft, ChevronRight,
    Calendar, HardDrive, FileType, User, Maximize2, Minimize2,
    FileText, File, ExternalLink, Copy, Check, FlipHorizontal,
    Sun, Moon, Grid, Printer, RefreshCw, MoreHorizontal,
} from "lucide-react";
import { useAssetStore } from "../../../store/store";

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
    return `${m[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()} at ${dt.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`;
}

function isPdf(asset) {
    return asset?.mime_type === "application/pdf" || (asset?.extension || "").toLowerCase() === "pdf";
}
function isImage(asset) {
    return asset?.mime_type?.startsWith("image/") || asset?.mime_type === "image";
}

function Tip({ label, children, side = "bottom" }) {
    return (
        <div className="relative group/tip">
            {children}
            <span className={`
                pointer-events-none absolute left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-[10px] font-semibold
                whitespace-nowrap bg-[#1a1f2e] text-white/80 border border-white/10
                opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 z-[9999]
                ${side === "bottom" ? "top-full mt-2" : "bottom-full mb-2"}
            `}>
                {label}
            </span>
        </div>
    );
}

function TBtn({ onClick, active, danger, title, children, className = "", size = "md" }) {
    const sizeClass = size === "sm" ? "w-7 h-7 text-[11px]" : "w-8 h-8 text-[13px]";
    return (
        <Tip label={title}>
            <button
                onClick={onClick}
                className={`
                    ${sizeClass} flex items-center justify-center rounded-lg transition-all duration-150 border-none cursor-pointer font-semibold flex-shrink-0
                    ${active ? "bg-[#4A7C59] text-white shadow-[0_0_0_1px_rgba(74,124,89,0.5)]" : ""}
                    ${danger ? "text-white/60 hover:bg-red-500/20 hover:text-red-400 bg-white/8" : ""}
                    ${!active && !danger ? "bg-white/8 text-white/70 hover:bg-white/15 hover:text-white" : ""}
                    ${className}
                `}
            >
                {children}
            </button>
        </Tip>
    );
}

function Divider() {
    return <div className="w-px h-4 bg-white/10 mx-0.5 flex-shrink-0" />;
}

function PdfViewer({ asset, fullscreen, clinicId }) {
    const { downloadAsset } = useAssetStore();
    const [mode, setMode] = useState("embed");

    useEffect(() => { setMode("embed"); }, [asset?.id]);

    if (mode === "fallback") {
        return (
            <div className="flex flex-col items-center gap-5 text-white/60 p-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/8 flex items-center justify-center">
                    <FileText size={36} className="text-white/30" />
                </div>
                <div>
                    <p className="text-[15px] font-semibold text-white/80 mb-1">{asset.file_original_name}</p>
                    <p className="text-[12px] text-white/40 mb-4">PDF preview unavailable in this browser</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                    <button
                        onClick={() => downloadAsset(clinicId, asset.id, asset.file_original_name)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#4A7C59] text-white text-[13px] font-semibold rounded-xl border-none cursor-pointer hover:bg-[#3a6448] transition-all"
                    >
                        <Download size={14} /> Download PDF
                    </button>
                    <button
                        onClick={() => window.open(asset.file_url, "_blank")}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white text-[13px] font-semibold rounded-xl border-none cursor-pointer hover:bg-white/15 transition-all"
                    >
                        <ExternalLink size={14} /> Open in browser
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full">
            {mode === "embed" ? (
                <embed
                    src={`${asset.file_url}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                    type="application/pdf"
                    className="w-full flex-1 border-none"
                    style={{ minHeight: "72vh", maxWidth: fullscreen ? "100%" : "960px", margin: "0 auto", borderRadius: "12px" }}
                    onError={() => setMode("object")}
                />
            ) : (
                <object
                    data={`${asset.file_url}#toolbar=1`}
                    type="application/pdf"
                    className="w-full flex-1 border-none"
                    style={{ minHeight: "72vh", maxWidth: fullscreen ? "100%" : "960px", margin: "0 auto", borderRadius: "12px" }}
                    onError={() => setMode("fallback")}
                >
                    <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(asset.file_url)}&embedded=true`}
                        className="w-full border-none"
                        style={{ minHeight: "72vh", borderRadius: "12px" }}
                        onError={() => setMode("fallback")}
                        title={asset.file_original_name}
                    />
                </object>
            )}
            <p className="text-[11px] text-white/25 text-center mt-2 flex-shrink-0">
                Having trouble?{" "}
                <button onClick={() => window.open(asset.file_url, "_blank")} className="text-white/45 underline bg-transparent border-none cursor-pointer">
                    Open in new tab
                </button>
                {" "}or{" "}
                <button onClick={() => downloadAsset(clinicId, asset.id, asset.file_original_name)} className="text-white/45 underline bg-transparent border-none cursor-pointer">
                    download
                </button>
            </p>
        </div>
    );
}

function FileFallback({ asset, clinicId }) {
    const { downloadAsset } = useAssetStore();
    return (
        <div className="flex flex-col items-center gap-5 text-white/60 p-8 text-center">
            <div className="w-24 h-24 rounded-2xl bg-white/8 flex items-center justify-center">
                <File size={40} className="text-white/30" />
            </div>
            <div>
                <p className="text-[16px] font-semibold text-white/80 mb-1">{asset.file_original_name}</p>
                <p className="text-[13px] text-white/40">{asset.mime_type || asset.extension || "Unknown file type"}</p>
                {asset.file_size && <p className="text-[12px] text-white/30 mt-1">{formatFileSize(asset.file_size)}</p>}
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
                <button
                    onClick={() => downloadAsset(clinicId, asset.id, asset.file_original_name)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#4A7C59] text-white text-[13px] font-semibold rounded-xl border-none cursor-pointer hover:bg-[#3a6448] transition-all"
                >
                    <Download size={14} /> Download file
                </button>
                <button
                    onClick={() => window.open(asset.file_url, "_blank")}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white text-[13px] font-semibold rounded-xl border-none cursor-pointer hover:bg-white/15 transition-all"
                >
                    <ExternalLink size={14} /> Open in browser
                </button>
            </div>
        </div>
    );
}

function CopyUrlButton({ url }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {}
    };
    return (
        <TBtn onClick={copy} title={copied ? "Copied!" : "Copy URL"} active={copied}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
        </TBtn>
    );
}

function DownloadButton({ asset, clinicId, className = "" }) {
    const { downloadAsset } = useAssetStore();
    const [state, setState] = useState("idle");

    const handle = async () => {
        if (state === "downloading") return;
        setState("downloading");
        try {
            await downloadAsset(clinicId, asset.id, asset.file_original_name);
            setState("done");
            setTimeout(() => setState("idle"), 2500);
        } catch {
            setState("error");
            setTimeout(() => setState("idle"), 2500);
        }
    };

    return (
        <TBtn
            onClick={handle}
            title={state === "downloading" ? "Downloading…" : state === "done" ? "Downloaded!" : state === "error" ? "Failed – retry" : "Download"}
            active={state === "done"}
            className={className}
        >
            {state === "downloading" ? <RefreshCw size={13} className="animate-spin" /> :
             state === "done" ? <Check size={13} /> :
             <Download size={13} />}
        </TBtn>
    );
}

// Overflow menu for actions that don't fit on smaller screens
function OverflowMenu({ children }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <TBtn onClick={() => setOpen(o => !o)} title="More actions" active={open}>
                <MoreHorizontal size={13} />
            </TBtn>
            {open && (
                <div className="absolute right-0 top-full mt-2 bg-[#141820] border border-white/10 rounded-xl shadow-2xl z-[9999] p-1.5 flex flex-col gap-0.5 min-w-[160px]"
                     onClick={() => setOpen(false)}>
                    {children}
                </div>
            )}
        </div>
    );
}

function OverflowItem({ onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-white/70 hover:text-white hover:bg-white/8 rounded-lg transition-all border-none cursor-pointer text-left"
        >
            <span className="text-white/40">{icon}</span>
            {label}
        </button>
    );
}

export default function ImagePreview({ isOpen, onClose, asset, assets = [], onNavigate, clinicId }) {
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [flipH, setFlipH] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState(null);
    const [imgBg, setImgBg] = useState("dark");
    const [imgLoaded, setImgLoaded] = useState(false);
    const [showThumbs, setShowThumbs] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const imgRef = useRef(null);
    const containerRef = useRef(null);

    const currentIndex = assets.findIndex(a => a.id === asset?.id);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < assets.length - 1;

    // Detect mobile
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setZoom(1); setRotation(0); setFlipH(false);
            setOffset({ x: 0, y: 0 }); setImgLoaded(false);
        }
    }, [asset?.id, isOpen]);

    useEffect(() => {
        const handleKey = (e) => {
            if (!isOpen) return;
            if (e.key === "Escape") { if (fullscreen) setFullscreen(false); else onClose(); }
            if (e.key === "ArrowLeft" && hasPrev) onNavigate?.(assets[currentIndex - 1]);
            if (e.key === "ArrowRight" && hasNext) onNavigate?.(assets[currentIndex + 1]);
            if ((e.key === "+" || e.key === "=") && isImage(asset)) setZoom(z => Math.min(z + 0.25, 5));
            if (e.key === "-" && isImage(asset)) setZoom(z => Math.max(z - 0.25, 0.1));
            if (e.key === "0" && isImage(asset)) { setZoom(1); setOffset({ x: 0, y: 0 }); }
            if (e.key === "r" && isImage(asset)) setRotation(r => r + 90);
            if (e.key === "f") setFullscreen(f => !f);
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, hasPrev, hasNext, currentIndex, assets, asset, fullscreen]);

    // Touch support for mobile pan
    const touchRef = useRef(null);
    const handleTouchStart = (e) => {
        if (zoom <= 1 || !isImage(asset)) return;
        const t = e.touches[0];
        touchRef.current = { x: t.clientX - offset.x, y: t.clientY - offset.y };
    };
    const handleTouchMove = (e) => {
        if (!touchRef.current || !isImage(asset)) return;
        e.preventDefault();
        const t = e.touches[0];
        setOffset({ x: t.clientX - touchRef.current.x, y: t.clientY - touchRef.current.y });
    };
    const handleTouchEnd = () => { touchRef.current = null; };

    const handleMouseDown = (e) => {
        if (zoom <= 1 || !isImage(asset)) return;
        e.preventDefault();
        setDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };
    const handleMouseMove = (e) => {
        if (!dragging || !dragStart) return;
        setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };
    const handleMouseUp = () => { setDragging(false); setDragStart(null); };

    const handleWheel = (e) => {
        if (!isImage(asset)) return;
        e.preventDefault();
        setZoom(z => Math.max(0.1, Math.min(5, z + (e.deltaY > 0 ? -0.12 : 0.12))));
    };

    const handleDblClick = () => {
        if (!isImage(asset)) return;
        if (zoom !== 1) { setZoom(1); setOffset({ x: 0, y: 0 }); } else setZoom(2);
    };

    const handlePrint = useCallback(() => {
        if (!asset?.file_url) return;
        const w = window.open("", "_blank");
        if (!w) return;
        if (isImage(asset)) {
            w.document.write(`<html><head><title>${asset.file_original_name || "Print"}</title><style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh}img{max-width:100%;height:auto}</style></head><body><img loading="lazy" src="${asset.file_url}" onload="window.print();window.close()"/></body></html>`);
        } else {
            w.location = asset.file_url;
        }
        w.document.close();
    }, [asset]);

    const bgClass = { dark: "bg-[#0a0c10]", light: "bg-[#e8e8e8]", checker: "" };
    const checkerStyle = imgBg === "checker" ? {
        backgroundImage: "linear-gradient(45deg,#555 25%,transparent 25%),linear-gradient(-45deg,#555 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#555 75%),linear-gradient(-45deg,transparent 75%,#555 75%)",
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0,0 10px,10px -10px,-10px 0",
        backgroundColor: "#333",
    } : {};

    const cycleBg = () => setImgBg(b => b === "dark" ? "light" : b === "light" ? "checker" : "dark");
    const bgLabel = imgBg === "dark" ? "Dark bg" : imgBg === "light" ? "Light bg" : "Checker bg";
    const BgIcon = imgBg === "dark" ? Moon : imgBg === "light" ? Sun : Grid;

    if (!isOpen || !asset) return null;

    const assetIsImage = isImage(asset);
    const assetIsPdf = isPdf(asset);

    // Image toolbar — shown centered, collapsed on mobile
    const imageToolbar = assetIsImage && (
        <div className="flex items-center gap-1">
            {/* Always visible core controls */}
            <TBtn onClick={() => setZoom(z => Math.max(0.1, z - 0.25))} title="Zoom out (-)">
                <ZoomOut size={13} />
            </TBtn>
            <button
                onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
                className="px-2 h-8 text-[11px] font-bold text-white/70 bg-white/8 rounded-lg hover:bg-white/15 hover:text-white transition-all border-none cursor-pointer min-w-[46px] flex-shrink-0"
                title="Reset zoom (0)"
            >
                {Math.round(zoom * 100)}%
            </button>
            <TBtn onClick={() => setZoom(z => Math.min(5, z + 0.25))} title="Zoom in (+)">
                <ZoomIn size={13} />
            </TBtn>

            {/* Hidden on mobile — shown via overflow menu instead */}
            {!isMobile && (
                <>
                    <Divider />
                    <TBtn onClick={() => setRotation(r => r + 90)} title="Rotate 90° (R)">
                        <RotateCw size={13} />
                    </TBtn>
                    <TBtn onClick={() => setFlipH(f => !f)} title="Flip horizontal" active={flipH}>
                        <FlipHorizontal size={13} />
                    </TBtn>
                    <Divider />
                    <TBtn onClick={cycleBg} title={bgLabel}>
                        <BgIcon size={13} />
                    </TBtn>
                </>
            )}
        </div>
    );

    return (
        <div
            className={`fixed inset-0 z-[300] flex ${fullscreen ? "bg-black" : "bg-[#05070d]/92 backdrop-blur-xl"}`}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <style>{`
                @keyframes previewIn { from { opacity:0; transform:scale(0.97) } to { opacity:1; transform:scale(1) } }
                .preview-animate { animation: previewIn 0.16s cubic-bezier(.22,1,.36,1); }
                @keyframes thumbIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
                .thumb-animate { animation: thumbIn 0.2s cubic-bezier(.22,1,.36,1); }
                .img-no-drag { -webkit-user-drag:none; user-drag:none; pointer-events:none; user-select:none; }
                ::-webkit-scrollbar { width:5px; height:5px; }
                ::-webkit-scrollbar-track { background:transparent; }
                ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.15); border-radius:3px; }
            `}</style>

            <div className="relative flex flex-col flex-1 overflow-hidden preview-animate">

                {/* ── TOOLBAR ── */}
                <div className={`
                    flex items-center gap-2 px-3 py-2 flex-shrink-0 z-20 min-h-[48px]
                    ${fullscreen ? "bg-black/60 backdrop-blur-sm" : "bg-[#0d1117]/80 backdrop-blur-md border-b border-white/[0.07]"}
                `}>

                    {/* LEFT: close + filename */}
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <TBtn onClick={onClose} title="Close (Esc)" danger>
                            <X size={14} />
                        </TBtn>
                        <div className="min-w-0 flex-1">
                            <p className="text-[12px] font-semibold text-white truncate leading-tight">
                                {asset.file_original_name}
                            </p>
                            {assets.length > 1 && (
                                <p className="text-[10px] text-white/35 leading-none mt-0.5">
                                    {currentIndex + 1} / {assets.length}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* CENTER: image controls (hidden on mobile, shown inline on desktop) */}
                    {assetIsImage && !isMobile && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                            {imageToolbar}
                        </div>
                    )}

                    {/* Mobile zoom controls — always visible for images */}
                    {assetIsImage && isMobile && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <TBtn onClick={() => setZoom(z => Math.max(0.1, z - 0.25))} title="Zoom out" size="sm">
                                <ZoomOut size={12} />
                            </TBtn>
                            <button
                                onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
                                className="px-1.5 h-7 text-[10px] font-bold text-white/70 bg-white/8 rounded-lg hover:bg-white/15 hover:text-white transition-all border-none cursor-pointer min-w-[40px] flex-shrink-0"
                            >
                                {Math.round(zoom * 100)}%
                            </button>
                            <TBtn onClick={() => setZoom(z => Math.min(5, z + 0.25))} title="Zoom in" size="sm">
                                <ZoomIn size={12} />
                            </TBtn>
                        </div>
                    )}

                    {/* RIGHT: action buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        {/* Filmstrip toggle — only when multiple assets */}
                        {assets.length > 1 && !isMobile && (
                            <TBtn onClick={() => setShowThumbs(t => !t)} title="Filmstrip" active={showThumbs}>
                                <Grid size={13} />
                            </TBtn>
                        )}

                        {/* Details panel */}
                        <TBtn onClick={() => setShowDetails(s => !s)} title="File details" active={showDetails}>
                            <Info size={13} />
                        </TBtn>

                        {/* On desktop: show all actions individually */}
                        {!isMobile && (
                            <>
                                {asset.file_url && <CopyUrlButton url={asset.file_url} />}
                                <DownloadButton asset={asset} clinicId={clinicId} />
                                {(assetIsPdf || !assetIsImage) && (
                                    <TBtn onClick={() => window.open(asset.file_url, "_blank")} title="Open in new tab">
                                        <ExternalLink size={13} />
                                    </TBtn>
                                )}
                                <TBtn onClick={handlePrint} title="Print">
                                    <Printer size={13} />
                                </TBtn>
                            </>
                        )}

                        {/* On mobile: collapse secondary actions into overflow menu */}
                        {isMobile && (
                            <OverflowMenu>
                                {assetIsImage && (
                                    <>
                                        <OverflowItem
                                            onClick={() => setRotation(r => r + 90)}
                                            icon={<RotateCw size={13} />}
                                            label="Rotate 90°"
                                        />
                                        <OverflowItem
                                            onClick={() => setFlipH(f => !f)}
                                            icon={<FlipHorizontal size={13} />}
                                            label={flipH ? "Unflip" : "Flip horizontal"}
                                        />
                                        <OverflowItem
                                            onClick={cycleBg}
                                            icon={<BgIcon size={13} />}
                                            label={bgLabel}
                                        />
                                    </>
                                )}
                                {asset.file_url && (
                                    <OverflowItem
                                        onClick={async () => {
                                            try { await navigator.clipboard.writeText(asset.file_url); } catch {}
                                        }}
                                        icon={<Copy size={13} />}
                                        label="Copy URL"
                                    />
                                )}
                                <OverflowItem
                                    onClick={() => window.open(asset.file_url, "_blank")}
                                    icon={<ExternalLink size={13} />}
                                    label="Open in browser"
                                />
                                <OverflowItem onClick={handlePrint} icon={<Printer size={13} />} label="Print" />
                                {assets.length > 1 && (
                                    <OverflowItem
                                        onClick={() => setShowThumbs(t => !t)}
                                        icon={<Grid size={13} />}
                                        label="Filmstrip"
                                    />
                                )}
                            </OverflowMenu>
                        )}

                        <Divider />

                        {/* Download — always visible */}
                        <DownloadButton asset={asset} clinicId={clinicId} />

                        {/* Fullscreen */}
                        <TBtn onClick={() => setFullscreen(f => !f)} title={fullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}>
                            {fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                        </TBtn>
                    </div>
                </div>

                {/* ── MAIN CONTENT AREA ── */}
                <div className="flex flex-1 overflow-hidden">
                    <div
                        ref={containerRef}
                        className={`flex-1 flex flex-col items-center justify-center overflow-hidden relative ${assetIsImage ? bgClass[imgBg] : "bg-[#0a0c10]"}`}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                        onDoubleClick={handleDblClick}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{
                            cursor: assetIsImage && zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
                            ...(assetIsImage ? checkerStyle : {}),
                        }}
                    >
                        {/* Prev nav */}
                        {hasPrev && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onNavigate?.(assets[currentIndex - 1]); }}
                                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl text-white hover:bg-[#4A7C59]/70 hover:scale-105 transition-all border-none cursor-pointer shadow-lg"
                            >
                                <ChevronLeft size={18} />
                            </button>
                        )}

                        {/* Image viewer */}
                        {assetIsImage ? (
                            <div
                                ref={imgRef}
                                className="select-none"
                                style={{
                                    transform: `translate(${offset.x}px,${offset.y}px) scale(${zoom}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`,
                                    transition: dragging ? "none" : "transform 0.12s ease",
                                    transformOrigin: "center center",
                                    willChange: "transform",
                                }}
                            >
                                {!imgLoaded && (
                                    <div className="w-40 h-40 flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
                                    </div>
                                )}
                                <img
                                    loading="lazy"
                                    src={asset.file_url}
                                    alt={asset.file_original_name}
                                    className={`img-no-drag object-contain rounded-md shadow-2xl ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                                    style={{
                                        maxWidth: isMobile ? "92vw" : "82vw",
                                        maxHeight: isMobile ? "70vh" : "76vh",
                                        transition: "opacity 0.2s ease",
                                    }}
                                    onLoad={() => setImgLoaded(true)}
                                    onContextMenu={(e) => e.preventDefault()}
                                    draggable={false}
                                />
                            </div>
                        ) : assetIsPdf ? (
                            <div className="flex flex-col flex-1 w-full items-center px-3 pt-3 pb-2 overflow-auto">
                                <PdfViewer asset={asset} fullscreen={fullscreen} clinicId={clinicId} />
                            </div>
                        ) : (
                            <FileFallback asset={asset} clinicId={clinicId} />
                        )}

                        {/* Next nav */}
                        {hasNext && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onNavigate?.(assets[currentIndex + 1]); }}
                                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl text-white hover:bg-[#4A7C59]/70 hover:scale-105 transition-all border-none cursor-pointer shadow-lg"
                            >
                                <ChevronRight size={18} />
                            </button>
                        )}

                        {/* Hint text — hide on mobile to save space */}
                        {assetIsImage && zoom === 1 && imgLoaded && !isMobile && (
                            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-white/20 select-none pointer-events-none whitespace-nowrap">
                                scroll to zoom · drag to pan · double-click to 2×
                            </p>
                        )}
                    </div>

                    {/* ── DETAILS PANEL ── */}
                    {showDetails && (
                        <div className={`
                            flex-shrink-0 bg-[#0d1117]/95 backdrop-blur-xl border-l border-white/[0.07] overflow-y-auto
                            ${isMobile
                                ? "absolute inset-y-0 right-0 w-[85vw] max-w-[300px] z-30 shadow-2xl"
                                : "w-[272px]"
                            }
                        `}>
                            {/* Mobile: tap outside to close */}
                            {isMobile && (
                                <button
                                    className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg bg-white/8 text-white/50 border-none cursor-pointer hover:bg-white/15 z-10"
                                    onClick={() => setShowDetails(false)}
                                >
                                    <X size={13} />
                                </button>
                            )}
                            <div className="p-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/30 mb-4">File Details</p>

                                {assetIsImage && (
                                    <div className="mb-4 rounded-xl overflow-hidden border border-white/[0.08] bg-black/30">
                                        <img loading="lazy" src={asset.file_url} alt="" className="w-full object-cover max-h-36 img-no-drag" onContextMenu={e => e.preventDefault()} draggable={false} />
                                    </div>
                                )}
                                {assetIsPdf && (
                                    <div className="mb-4 rounded-xl overflow-hidden border border-white/[0.08] bg-white/4 flex items-center justify-center h-20">
                                        <FileText size={28} className="text-white/20" />
                                    </div>
                                )}

                                <div className="flex flex-col gap-2">
                                    {[
                                        { icon: <FileType size={12} />, label: "File name",    val: asset.file_original_name },
                                        { icon: <HardDrive size={12} />, label: "File size",   val: formatFileSize(asset.file_size) },
                                        { icon: <FileType size={12} />, label: "Type",         val: asset.mime_type || asset.extension || "—" },
                                        { icon: <User size={12} />,     label: "Uploaded by",  val: asset.fname ? `${asset.fname} ${asset.lname || ""}`.trim() : "—" },
                                        { icon: <Calendar size={12} />, label: "Uploaded on",  val: fmtDateTime(asset.created_at) },
                                    ].map(({ icon, label, val }) => (
                                        <div key={label} className="p-2.5 bg-white/[0.04] rounded-lg border border-white/[0.06]">
                                            <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.07em] text-white/25 mb-1">
                                                {icon}{label}
                                            </div>
                                            <p className="text-[11.5px] text-white/75 break-all leading-snug">{val}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Keyboard shortcuts — desktop only */}
                                {!isMobile && (
                                    <div className="mt-5">
                                        <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-white/20 mb-2">Keyboard Shortcuts</p>
                                        <div className="flex flex-col gap-1">
                                            {[
                                                ["←  →", "Navigate"],
                                                ["+  −",  "Zoom"],
                                                ["0",     "Reset zoom"],
                                                ["R",     "Rotate"],
                                                ["F",     "Fullscreen"],
                                                ["Esc",   "Close"],
                                            ].map(([key, desc]) => (
                                                <div key={key} className="flex items-center justify-between">
                                                    <code className="text-[10px] text-white/30 bg-white/8 px-1.5 py-0.5 rounded font-mono">{key}</code>
                                                    <span className="text-[10px] text-white/30">{desc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-2 mt-4">
                                    <button
                                        onClick={() => window.open(asset.file_url, "_blank")}
                                        className="w-full flex items-center justify-center gap-2 py-2 bg-white/8 text-white/70 text-[11.5px] font-semibold rounded-xl border-none cursor-pointer hover:bg-white/12 hover:text-white transition-all"
                                    >
                                        <ExternalLink size={12} /> Open in browser
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile details backdrop */}
                    {isMobile && showDetails && (
                        <div className="absolute inset-0 z-20 bg-black/40" onClick={() => setShowDetails(false)} />
                    )}
                </div>

                {/* ── FILMSTRIP ── */}
                {showThumbs && assets.length > 1 && (
                    <div className="flex-shrink-0 bg-black/60 backdrop-blur-md border-t border-white/[0.06] px-3 py-2 overflow-x-auto thumb-animate">
                        <div className="flex gap-2 items-center" style={{ width: "max-content" }}>
                            {assets.map((a) => (
                                <button
                                    key={a.id}
                                    onClick={() => onNavigate?.(a)}
                                    className={`relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-white/8
                                        ${isMobile ? "w-11 h-11" : "w-14 h-14"}
                                        ${a.id === asset.id ? "border-[#4A7C59] shadow-[0_0_0_1px_#4A7C59]" : "border-transparent hover:border-white/30"}`}
                                    title={a.file_original_name}
                                >
                                    {isImage(a) ? (
                                        <img loading="lazy" src={a.file_url} alt="" className="w-full h-full object-cover img-no-drag" draggable={false} onContextMenu={e => e.preventDefault()} />
                                    ) : isPdf(a) ? (
                                        <div className="w-full h-full flex items-center justify-center"><FileText size={18} className="text-white/30" /></div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center"><File size={18} className="text-white/30" /></div>
                                    )}
                                    {a.id === asset.id && <div className="absolute inset-0 bg-[#4A7C59]/15 pointer-events-none" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}