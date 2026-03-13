import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Users, Mail, Plus, Search, RefreshCw,
  CheckCircle2, XCircle, ChevronDown,
} from "lucide-react";
import { debounce } from "lodash";
import { useStaffStore, useClinicStore, useRolestore } from "../store/store";
import ImagePreview from "../components/ui/file-manager/ImagePreview";
import { useAuth } from "../context/Auth/UseAuth";
import InviteModal from "../components/ui/modals/InviteModal";
import StaffTable from "../components/staff/StaffTable";
import InvitesTable from "../components/staff/InvitesTable";

const getMimeTypeFromUrl = (url) => {
  if (!url) return "image/jpeg";
  const ext = url.split(".").pop()?.toLowerCase();
  return { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml", avif: "image/avif" }[ext] || "image/jpeg";
};

const inputCls =
  "w-full px-3 py-2 text-[13px] font-['DM_Sans'] bg-[#F7F4EF] border-[1.5px] border-black/[0.09] rounded-xl outline-none text-[#0D1117] focus:border-[#4A7C59] focus:bg-white transition-all placeholder-[#B8C0CC]";

export default function Staff() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "staff";
  const inviteModalOpen = searchParams.get("staff_invite") === "true";

  const { selectedClinic } = useClinicStore();
  const { user } = useAuth();
  const { staff, staffInvites, loading, pagination, fetchClinicStaff, fetchStaffInvitations, resendInvite } = useStaffStore();
  const { roles, loading: rolesLoading, fetchRoles } = useRolestore();

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [toast, setToast] = useState(null);

  const clinicId = selectedClinic?.id;
  const branchId = selectedClinic?.branchId;
  const currentUserId = user?.id;
  const currentUserEmail = user?.email?.toLowerCase() ?? null;

  // ── Role comes from the clinic, not the user object ──────────
  const currentUserRole = selectedClinic?.role ?? null;

  useEffect(() => { fetchRoles(); }, []);

  const openInviteModal = () => setSearchParams((p) => { const n = new URLSearchParams(p); n.set("staff_invite", "true"); return n; });
  const closeInviteModal = () => setSearchParams((p) => { const n = new URLSearchParams(p); n.delete("staff_invite"); return n; });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearch = useCallback(debounce((v) => setSearch(v), 350), []);
  const handleSearchChange = (e) => { setInputValue(e.target.value); debouncedSetSearch(e.target.value); };

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const loadStaff = useCallback(async (page = 1) => {
    if (!clinicId) return;
    try { await fetchClinicStaff(clinicId, { search, status: statusFilter || null, page }); } catch {}
  }, [clinicId, branchId, search, statusFilter]);

  const loadInvites = useCallback(async (page = 1) => {
    if (!clinicId || !branchId) return;
    try { await fetchStaffInvitations(clinicId, branchId, { search, page }); } catch {}
  }, [clinicId, branchId, search]);

  // branchId in deps so switching branch re-fetches
  useEffect(() => {
    if (tab === "staff") loadStaff(1);
    else loadInvites(1);
  }, [tab, search, statusFilter, branchId]);

  const handleResend = async (invite) => {
    try {
      await resendInvite(clinicId, branchId, invite.id);
      showToast("Invitation resent successfully.");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to resend invite.", "error");
    }
  };

  const handleInviteSuccess = () => {
    showToast("Invitation sent successfully.");
    loadInvites(1);
    setSearchParams({ tab: "staff_invites" });
  };

  const setTab = (t) => { setInputValue(""); setSearch(""); setStatusFilter(""); setSearchParams({ tab: t }); };

  return (
    <div className="min-h-screen bg-[#F7F4EF] font-['DM_Sans'] text-[#0D1117]">
      <style>{`
        .icon-btn{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:8px;color:#8A9BB0;background:transparent;border:none;cursor:pointer;transition:background .15s,color .15s;flex-shrink:0}
        .icon-btn:hover{background:#F7F4EF;color:#0D1117}
        .menu-item{width:100%;display:flex;align-items:center;gap:10px;padding:10px 14px;font-size:12px;font-weight:500;color:#0D1117;text-decoration:none;transition:background .12s;cursor:pointer;background:transparent;border:none}
        .menu-item:hover{background:#F7F4EF}
        @keyframes slideIn{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}}
      `}</style>

      {toast && (
        <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl text-[13px] font-medium shadow-lg animate-[slideIn_0.2s_ease] ${
          toast.type === "error" ? "bg-[#FAF0ED] text-[#c05c3c] border border-[#E8927C]/30" : "bg-[#E8F2EB] text-[#2F5C3A] border border-[#4A7C59]/20"
        }`}>
          {toast.type === "error" ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
          {toast.msg}
        </div>
      )}

      <InviteModal
        open={inviteModalOpen}
        onClose={closeInviteModal}
        clinicId={clinicId}
        branchId={branchId}
        roles={roles}                        // full role objects from useRolestore (has id + name)
        rolesLoading={rolesLoading}
        currentUserRole={currentUserRole}    // viewer's role name from selectedClinic.role
        onSuccess={handleInviteSuccess}
        inputCls={inputCls}
      />

      <div className="px-4 sm:px-6 py-6 max-w-[1100px] mx-auto">
        <div className="flex items-start justify-between mb-6 gap-3">
          <div>
            <h1 className="font-['DM_Serif_Display'] text-[24px] sm:text-[26px] text-[#0D1117] leading-tight">Staff</h1>
            <p className="text-[13px] text-[#8A9BB0] mt-0.5">{selectedClinic?.name || "Clinic"}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => (tab === "staff" ? loadStaff(1) : loadInvites(1))} disabled={loading}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-black/[0.09] text-[#8A9BB0] hover:bg-[#F7F4EF] hover:text-[#0D1117] transition-all disabled:opacity-50 cursor-pointer">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={openInviteModal}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl hover:bg-[#2F5C3A] transition-all border-none cursor-pointer whitespace-nowrap">
              <Plus size={14} />
              <span className="hidden sm:inline">Invite staff</span>
              <span className="sm:hidden">Invite</span>
            </button>
          </div>
        </div>

        <div className="flex gap-1 mb-5 bg-white rounded-2xl border border-black/[0.09] p-1">
          {[{ id: "staff", label: "Staff", icon: Users }, { id: "staff_invites", label: "Invitations", icon: Mail }].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold rounded-xl transition-all cursor-pointer border-none ${
                tab === id ? "bg-[#4A7C59] text-white shadow-sm" : "bg-transparent text-[#8A9BB0] hover:text-[#0D1117]"
              }`}>
              <Icon size={13} />{label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B8C0CC] pointer-events-none" />
            <input className={inputCls + " pl-9"}
              placeholder={tab === "staff" ? "Search by name, email, staff ID…" : "Search by email…"}
              value={inputValue} onChange={handleSearchChange} />
          </div>
          {tab === "staff" && (
            <div className="relative self-start sm:self-auto">
              <select className="px-3 pr-8 py-2 text-[12px] font-['DM_Sans'] bg-white border border-black/[0.09] rounded-xl outline-none text-[#0D1117] focus:border-[#4A7C59] transition-all appearance-none cursor-pointer w-full sm:w-auto"
                value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="terminated">Terminated</option>
                <option value="resigned">Resigned</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A9BB0] pointer-events-none" />
            </div>
          )}
        </div>

        {tab === "staff" && (
          <StaffTable
            staff={staff} loading={loading} pagination={pagination}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}   // ← from clinic
            onPageChange={(p) => loadStaff(p)}
            onPhotoClick={(s) => setPreviewPhoto(s)}
            onInvite={openInviteModal}
          />
        )}
        {tab === "staff_invites" && (
          <InvitesTable
            invites={staffInvites} loading={loading} pagination={pagination}
            clinicId={clinicId} branchId={branchId}
            currentUserEmail={currentUserEmail}
            onPageChange={(p) => loadInvites(p)}
            onResend={handleResend}
            onInvite={openInviteModal}
          />
        )}
      </div>

      {previewPhoto && (
        <ImagePreview
          isOpen={!!previewPhoto}
          onClose={() => setPreviewPhoto(null)}
          asset={{
            file_url: previewPhoto?.profile_photo_url,
            file_original_name: `${previewPhoto.fname} ${previewPhoto.lname}`,
            mime_type: getMimeTypeFromUrl(previewPhoto?.profile_photo_url),
            fname: previewPhoto.fname, lname: previewPhoto.lname,
          }}
        />
      )}
    </div>
  );
}