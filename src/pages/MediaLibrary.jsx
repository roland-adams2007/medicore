import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
    Upload, Trash2, Search, Image as ImageIcon, File, Loader2, Send,
    X, Eye, MoreVertical, Download, RefreshCw, HardDrive, Calendar,
    User, CheckCircle2, AlertCircle, Filter, Grid3X3, List, Inbox,
} from "lucide-react";
import { useClinicStore, useAssetStore } from "../store/store";
import { fileToBase64 } from "../utils/fileToBase64";
import ImagePreview from "../components/ui/file-manager/ImagePreview";

const DEMO_USERS = [
    { id: 1, fname: "Adaeze", lname: "Obi", email: "adaeze.obi@gracehealth.ng", role: "Doctor" },
    { id: 2, fname: "Bello", lname: "Adeyemi", email: "bello.adeyemi@gracehealth.ng", role: "Nurse" },
    { id: 3, fname: "Chioma", lname: "Eze", email: "chioma.eze@gracehealth.ng", role: "Pharmacist" },
    { id: 4, fname: "Emeka", lname: "Nwachukwu", email: "emeka.nwachukwu@gracehealth.ng", role: "Admin" },
    { id: 5, fname: "Funke", lname: "Fashola", email: "funke.fashola@gracehealth.ng", role: "Receptionist" },
    { id: 6, fname: "Grace", lname: "Lawal", email: "grace.lawal@gracehealth.ng", role: "Lab Technician" },
];

function fmtDate(d) {
    if (!d) return "—";
    const dt = typeof d === "string" ? new Date(d) : d;
    if (isNaN(dt)) return "—";
    const m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${m[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
}

function formatFileSize(bytes) {
    if (!bytes) return "—";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
}

function initials(fname, lname) {
    return `${(fname?.[0] || "").toUpperCase()}${(lname?.[0] || "").toUpperCase()}`;
}

const AV_COLORS = ["#4A7C59", "#E8927C", "#C9A84C", "#8A9BB0", "#6A3D85", "#2563EB", "#15803D", "#c97058"];

function TransferModal({ asset, onClose, clinicId, onTransferred }) {
    const { transferAsset } = useAssetStore();
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);

    const filtered = DEMO_USERS.filter(u =>
        `${u.fname} ${u.lname} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    );

    const handleSend = async () => {
        if (!selectedUser) return;
        setSending(true);
        setError(null);
        try {
            await transferAsset(clinicId, asset.id, selectedUser.id, message);
            setSent(true);
            setTimeout(() => { onTransferred?.(); onClose(); }, 1800);
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Transfer failed");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0D1117]/60 backdrop-blur-sm z-[250] flex items-center justify-center p-5"
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-2xl w-full max-w-[420px] shadow-[0_24px_80px_rgba(13,17,23,0.25)] animate-[modalIn_0.22s_ease]">
                <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:none}}`}</style>
                <div className="p-5 pb-0 flex items-center justify-between">
                    <div>
                        <h2 className="font-['DM_Serif_Display'] text-[20px] text-[#0D1117]">Transfer File</h2>
                        <p className="text-[12px] text-[#8A9BB0] mt-0.5 truncate max-w-[280px]">{asset.file_original_name}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 bg-[#F7F4EF] rounded-lg flex items-center justify-center text-[#8A9BB0] hover:bg-[#FAF0ED] hover:text-[#E8927C] transition-all border-none cursor-pointer">
                        <X size={15} />
                    </button>
                </div>

                {sent ? (
                    <div className="p-5 py-10 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-[#E8F2EB] flex items-center justify-center mx-auto mb-3">
                            <CheckCircle2 size={22} className="text-[#4A7C59]" />
                        </div>
                        <p className="font-['DM_Serif_Display'] text-[18px] text-[#0D1117] mb-1">Transferred!</p>
                        <p className="text-[12px] text-[#8A9BB0]">File sent to {selectedUser.fname} {selectedUser.lname}</p>
                    </div>
                ) : (
                    <div className="p-5 pt-4">
                        <div className="mb-3">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.07em] text-[#0D1117] mb-1.5">Select recipient</label>
                            <div className="relative mb-2">
                                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8A9BB0] pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search staff…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-7 pr-3 py-2 text-[13px] font-['DM_Sans'] bg-[#F7F4EF] border border-black/[0.09] rounded-xl outline-none text-[#0D1117] placeholder-[#B8C0CC] focus:border-[#4A7C59] focus:bg-white transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-1 max-h-[180px] overflow-y-auto rounded-xl border border-black/[0.09] bg-[#F7F4EF]/40">
                                {filtered.map((u, i) => (
                                    <button
                                        key={u.id}
                                        onClick={() => setSelectedUser(u)}
                                        className={`flex items-center gap-2.5 px-3 py-2.5 text-left transition-all border-none cursor-pointer font-['DM_Sans'] ${selectedUser?.id === u.id ? "bg-[#E8F2EB]" : "bg-transparent hover:bg-[#F7F4EF]"} ${i < filtered.length - 1 ? "border-b border-black/[0.05]" : ""}`}
                                    >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0" style={{ background: AV_COLORS[i % AV_COLORS.length] }}>
                                            {initials(u.fname, u.lname)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-semibold text-[#0D1117] truncate">{u.fname} {u.lname}</p>
                                            <p className="text-[11px] text-[#8A9BB0]">{u.role}</p>
                                        </div>
                                        {selectedUser?.id === u.id && <CheckCircle2 size={14} className="text-[#4A7C59] flex-shrink-0" />}
                                    </button>
                                ))}
                                {filtered.length === 0 && <p className="text-center py-6 text-[12px] text-[#8A9BB0]">No staff found</p>}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.07em] text-[#0D1117] mb-1.5">Message (optional)</label>
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Add a note…"
                                rows={2}
                                className="w-full px-3 py-2 text-[13px] font-['DM_Sans'] bg-[#F7F4EF] border border-black/[0.09] rounded-xl outline-none text-[#0D1117] placeholder-[#B8C0CC] focus:border-[#4A7C59] focus:bg-white transition-all resize-none"
                            />
                        </div>

                        {error && (
                            <div className="mb-3 px-3 py-2 bg-[#FAF0ED] border border-[#E8927C]/30 rounded-xl text-[12px] text-[#c05c3c] flex items-center gap-2">
                                <AlertCircle size={13} />{error}
                            </div>
                        )}

                        <div className="flex gap-2.5">
                            <button onClick={onClose} className="flex-1 py-2.5 bg-[#F7F4EF] border border-black/[0.09] rounded-xl text-[12px] font-semibold text-[#8A9BB0] cursor-pointer hover:bg-[#EEF2F7] transition-all font-['DM_Sans']">
                                Cancel
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={!selectedUser || sending}
                                className="flex-[2] py-2.5 bg-[#4A7C59] rounded-xl text-[12px] font-semibold text-white cursor-pointer hover:bg-[#2F5C3A] transition-all font-['DM_Sans'] border-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {sending ? <><Loader2 size={13} className="animate-spin" />Sending…</> : <><Send size={13} />Send file</>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function AssetRowMenu({ asset, onDelete, onTransfer, onPreview }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
        if (open) document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [open]);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-[#8A9BB0] hover:bg-[#F7F4EF] hover:text-[#0D1117] transition-all border-none bg-transparent cursor-pointer"
            >
                <MoreVertical size={14} />
            </button>
            {open && (
                <div className="absolute right-0 top-8 z-50 bg-white border border-black/[0.09] rounded-xl shadow-[0_8px_32px_rgba(13,17,23,0.14)] min-w-[160px] overflow-hidden animate-[menuIn_0.14s_ease]">
                    <style>{`@keyframes menuIn{from{opacity:0;transform:scale(0.96) translateY(-4px)}to{opacity:1;transform:none}}`}</style>
                    <button onClick={() => { setOpen(false); onPreview(); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium text-[#0D1117] hover:bg-[#F7F4EF] transition-colors cursor-pointer bg-transparent border-none text-left">
                        <Eye size={13} className="text-[#8A9BB0]" />Preview
                    </button>
                    <button onClick={() => { setOpen(false); onTransfer(); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium text-[#0D1117] hover:bg-[#F7F4EF] transition-colors cursor-pointer bg-transparent border-none text-left">
                        <Send size={13} className="text-[#8A9BB0]" />Transfer
                    </button>
                    <div className="h-px bg-black/[0.06] mx-2" />
                    <button onClick={() => { setOpen(false); onDelete(); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium text-[#c05c3c] hover:bg-[#FAF0ED] transition-colors cursor-pointer bg-transparent border-none text-left">
                        <Trash2 size={13} />Delete
                    </button>
                </div>
            )}
        </div>
    );
}

export default function MediaLibrary() {
    const { selectedClinic } = useClinicStore();
    const { assets, loading, error, pagination, fetchAssets, uploadAsset, deleteAsset, downloadAsset } = useAssetStore();

    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [uploading, setUploading] = useState(false);
    const [previewAsset, setPreviewAsset] = useState(null);
    const [transferAssetData, setTransferAssetData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [mimeFilter, setMimeFilter] = useState("all");

    const clinicId = selectedClinic?.id;

    useEffect(() => {
        if (clinicId) fetchAssets(clinicId, 1);
    }, [clinicId]);

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !clinicId) return;
        setUploading(true);
        try {
            const base64Data = await fileToBase64(file);
            await uploadAsset(clinicId, {
                file: base64Data,
                filename: file.name,
                filetype: file.type,
                file_size: file.size,
                file_original_name: file.name,
            });
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
        } catch {
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = useCallback(async (asset) => {
        if (!window.confirm(`Delete "${asset.file_original_name}"?`)) return;
        await deleteAsset(clinicId, asset.id);
    }, [clinicId]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchAssets(clinicId, page);
    };

    const handleDownload = useCallback(async (asset) => {
        await downloadAsset(clinicId, asset.id, asset.file_original_name);
    }, [clinicId]);



    const filtered = useMemo(() => {
        return assets.filter(a => {
            const matchSearch = !search || a.file_original_name?.toLowerCase().includes(search.toLowerCase());
            const matchMime = mimeFilter === "all"
                || (mimeFilter === "image" && a.mime_type?.startsWith("image/"))
                || (mimeFilter === "other" && !a.mime_type?.startsWith("image/"));
            return matchSearch && matchMime;
        });
    }, [assets, search, mimeFilter]);

    const MIME_FILTERS = [
        { val: "all", label: "All" },
        { val: "image", label: "Images" },
        { val: "other", label: "Other" },
    ];

    return (
        <div className="h-screen overflow-hidden font-['DM_Sans'] bg-[#F7F4EF] text-[#0D1117] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-black/[0.09] flex-shrink-0">
                <div>
                    <h1 className="font-['DM_Serif_Display'] text-[22px] text-[#0D1117] leading-tight">Media Library</h1>
                    <p className="text-[12px] text-[#8A9BB0] mt-0.5">
                        {pagination.total} file{pagination.total !== 1 ? "s" : ""} · {selectedClinic?.name || "Clinic"}
                    </p>
                </div>
                <label className="flex items-center gap-1.5 px-4 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl hover:bg-[#2F5C3A] hover:shadow-[0_4px_14px_rgba(47,92,58,0.25)] transition-all cursor-pointer font-['DM_Sans']">
                    {uploading ? <><Loader2 size={13} className="animate-spin" />Uploading…</> : <><Upload size={13} />Upload file</>}
                    <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*,application/pdf,.doc,.docx" />
                </label>
            </div>

            {uploadSuccess && (
                <div className="mx-5 mt-3 flex items-center gap-2 px-3.5 py-2.5 bg-[#E8F2EB] border border-[#4A7C59]/20 rounded-xl text-[12px] font-medium text-[#2F5C3A]">
                    <CheckCircle2 size={14} />File uploaded successfully.
                </div>
            )}

            <div className="flex items-center gap-2.5 px-5 py-2.5 border-b border-black/[0.09] bg-white flex-shrink-0">
                <div className="relative w-52">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8A9BB0] pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search files…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-7 pr-2.5 py-1.5 text-[12px] font-['DM_Sans'] bg-[#F7F4EF] border border-black/[0.09] rounded-lg outline-none text-[#0D1117] placeholder-[#B8C0CC] focus:border-[#4A7C59] focus:bg-white transition-all"
                    />
                </div>

                <div className="flex gap-1">
                    {MIME_FILTERS.map(f => (
                        <button key={f.val} onClick={() => setMimeFilter(f.val)}
                            className={`px-2.5 py-1 text-[11px] font-semibold border rounded-md cursor-pointer whitespace-nowrap transition-all font-['DM_Sans'] ${mimeFilter === f.val ? "bg-[#4A7C59] text-white border-[#4A7C59]" : "bg-transparent text-[#8A9BB0] border-black/[0.09] hover:border-[#4A7C59] hover:text-[#2F5C3A]"}`}>
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="ml-auto flex items-center gap-1.5">
                    <button onClick={() => setViewMode("grid")} className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${viewMode === "grid" ? "bg-[#4A7C59] text-white border-[#4A7C59]" : "bg-transparent text-[#8A9BB0] border-black/[0.09] hover:border-[#4A7C59]"}`}>
                        <Grid3X3 size={13} />
                    </button>
                    <button onClick={() => setViewMode("list")} className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${viewMode === "list" ? "bg-[#4A7C59] text-white border-[#4A7C59]" : "bg-transparent text-[#8A9BB0] border-black/[0.09] hover:border-[#4A7C59]"}`}>
                        <List size={13} />
                    </button>
                    <button onClick={() => fetchAssets(clinicId, currentPage)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-black/[0.09] text-[#8A9BB0] hover:border-[#4A7C59] hover:text-[#4A7C59] transition-all cursor-pointer bg-transparent">
                        <RefreshCw size={13} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
                {loading && assets.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center gap-3 text-[#8A9BB0]">
                            <Loader2 size={24} className="animate-spin" />
                            <p className="text-[13px]">Loading media…</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center text-[#c05c3c]">
                            <AlertCircle size={32} className="mx-auto opacity-60 mb-2" />
                            <p className="text-[13px]">{error}</p>
                        </div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-[#8A9BB0]">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-black/[0.07]">
                            <ImageIcon size={24} className="opacity-40" />
                        </div>
                        <p className="text-[15px] font-semibold text-[#0D1117] mb-1">No files found</p>
                        <p className="text-[12px]">{search ? "Try a different search" : "Upload your first file to get started"}</p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {filtered.map(asset => {
                            const isImage = asset.mime_type?.startsWith("image/");
                            return (
                                <div key={asset.id} className="group relative bg-white rounded-2xl border border-black/[0.09] overflow-hidden hover:border-[#4A7C59]/40 hover:shadow-[0_4px_16px_rgba(74,124,89,0.1)] transition-all cursor-pointer"
                                    onClick={() => setPreviewAsset(asset)}>
                                    <div className="aspect-square bg-[#F7F4EF] flex items-center justify-center">
                                        {isImage ? (
                                            <img src={asset.file_url} alt={asset.file_original_name} className="w-full h-full object-cover" loading="lazy" />
                                        ) : (
                                            <File size={28} className="text-[#8A9BB0]" />
                                        )}
                                    </div>
                                    <div className="p-2.5">
                                        <p className="text-[11px] font-semibold text-[#0D1117] truncate">{asset.file_original_name}</p>
                                        <p className="text-[10px] text-[#8A9BB0] mt-0.5">{formatFileSize(asset.file_size)}</p>
                                    </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                        <AssetRowMenu
                                            asset={asset}
                                            onDelete={() => handleDelete(asset)}
                                            onTransfer={() => setTransferAssetData(asset)}
                                            onPreview={() => setPreviewAsset(asset)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-black/[0.09] overflow-hidden">
                        <div className="grid px-4 py-2.5 border-b border-black/[0.05] bg-[#F7F4EF]/60"
                            style={{ gridTemplateColumns: "40px 1fr 100px 80px 120px 40px" }}>
                            {["", "Name", "Type", "Size", "Uploaded", ""].map((h, i) => (
                                <span key={i} className="text-[10px] font-bold uppercase tracking-[0.07em] text-[#8A9BB0]">{h}</span>
                            ))}
                        </div>
                        {filtered.map(asset => {
                            const isImage = asset.mime_type?.startsWith("image/");
                            return (
                                <div key={asset.id}
                                    className="grid items-center px-4 py-3 border-b border-black/[0.05] hover:bg-[#F7F4EF]/60 transition-colors cursor-pointer"
                                    style={{ gridTemplateColumns: "40px 1fr 100px 80px 120px 40px" }}
                                    onClick={() => setPreviewAsset(asset)}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-[#F7F4EF] flex items-center justify-center flex-shrink-0 overflow-hidden border border-black/[0.07]">
                                        {isImage ? (
                                            <img src={asset.file_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                                        ) : (
                                            <File size={14} className="text-[#8A9BB0]" />
                                        )}
                                    </div>
                                    <div className="min-w-0 pl-2">
                                        <p className="text-[13px] font-semibold text-[#0D1117] truncate">{asset.file_original_name}</p>
                                        <p className="text-[11px] text-[#8A9BB0]">by {asset.fname || "—"} {asset.lname || ""}</p>
                                    </div>
                                    <p className="text-[11px] text-[#8A9BB0] truncate">{asset.extension || asset.mime_type?.split("/")[1] || "—"}</p>
                                    <p className="text-[12px] text-[#8A9BB0]">{formatFileSize(asset.file_size)}</p>
                                    <p className="text-[12px] text-[#8A9BB0]">{fmtDate(asset.created_at)}</p>
                                    <div onClick={e => e.stopPropagation()}>
                                        <AssetRowMenu
                                            asset={asset}
                                            onDelete={() => handleDelete(asset)}
                                            onTransfer={() => setTransferAssetData(asset)}
                                            onPreview={() => setPreviewAsset(asset)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {pagination.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                            <button key={page} onClick={() => handlePageChange(page)}
                                className={`w-8 h-8 text-[12px] font-semibold rounded-lg border transition-all cursor-pointer font-['DM_Sans'] ${currentPage === page ? "bg-[#4A7C59] text-white border-[#4A7C59]" : "bg-white text-[#8A9BB0] border-black/[0.09] hover:border-[#4A7C59] hover:text-[#2F5C3A]"}`}>
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {previewAsset && (
                <ImagePreview
                    isOpen={!!previewAsset}
                    onClose={() => setPreviewAsset(null)}
                    asset={previewAsset}
                    assets={filtered}
                    onNavigate={setPreviewAsset}
                    clinicId={clinicId}
                />
            )}

            {transferAssetData && (
                <TransferModal
                    asset={transferAssetData}
                    clinicId={clinicId}
                    onClose={() => setTransferAssetData(null)}
                    onTransferred={() => fetchAssets(clinicId, currentPage)}
                />
            )}
        </div>
    );
}