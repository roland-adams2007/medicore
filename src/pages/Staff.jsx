import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Users, Mail, Plus, Search, RefreshCw, MoreVertical,
  Settings, CheckCircle2, XCircle, Loader2, ChevronDown,
  Eye, Building2,
} from "lucide-react";
import { useStaffStore, useClinicStore } from "../store/store";
import ImagePreview from "../components/ui/file-manager/ImagePreview";
import { useAuth } from "../context/Auth/UseAuth";

const STATUS_COLORS = {
  active: "bg-[#E8F2EB] text-[#2F5C3A]",
  suspended: "bg-[#FBF6E9] text-[#8b6a1a]",
  terminated: "bg-[#FAF0ED] text-[#c05c3c]",
  resigned: "bg-[#EEF2F7] text-[#4a6580]",
};

const INVITE_STATUS_COLORS = {
  pending: "bg-[#FBF6E9] text-[#8b6a1a]",
  accepted: "bg-[#E8F2EB] text-[#2F5C3A]",
  declined: "bg-[#FAF0ED] text-[#c05c3c]",
  expired: "bg-[#EEF2F7] text-[#4a6580]",
};

const inputCls =
  "w-full px-3 py-2 text-[13px] font-['DM_Sans'] bg-[#F7F4EF] border-[1.5px] border-black/[0.09] rounded-xl outline-none text-[#0D1117] focus:border-[#4A7C59] focus:bg-white transition-all placeholder-[#B8C0CC]";

function Avatar({ fname, lname, photoUrl, size = 10, onClick }) {
  const initials = `${(fname?.[0] || "").toUpperCase()}${(lname?.[0] || "").toUpperCase()}`;
  const cls = `w-${size} h-${size} rounded-xl overflow-hidden flex-shrink-0 ${onClick ? "cursor-pointer" : ""}`;
  if (photoUrl) {
    return (
      <div className={cls} onClick={onClick}>
        <img src={photoUrl} alt={`${fname} ${lname}`} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`${cls} bg-[#E8F2EB] flex items-center justify-center text-[#4A7C59] font-bold text-[${size > 8 ? "14" : "11"}px]`}
      onClick={onClick}
    >
      {initials || <Users size={size > 8 ? 16 : 12} />}
    </div>
  );
}

function DropdownMenu({ children, trigger }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handle(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const handleOpen = (e) => {
    e.stopPropagation();
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((o) => !o);
  };

  return (
    <>
      <div ref={btnRef}>{trigger(handleOpen, open)}</div>
      {open && (
        <div
          ref={menuRef}
          style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 9999 }}
          className="bg-white border border-black/[0.09] rounded-xl shadow-[0_8px_32px_rgba(13,17,23,0.18)] min-w-[170px] overflow-hidden"
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </>
  );
}

// isYou: true if this member is the currently logged-in user — hide edit actions
function StaffRowMenu({ member, isYou }) {
  // If it's the current user's own profile, render nothing (no self-edit)
  if (isYou) return null;

  return (
    <DropdownMenu
      trigger={(handleOpen) => (
        <button
          onClick={handleOpen}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#8A9BB0] hover:bg-[#F7F4EF] hover:text-[#0D1117] transition-all border-none bg-transparent cursor-pointer"
        >
          <MoreVertical size={14} />
        </button>
      )}
    >
      {member.staff_profile_id && (
        <Link
          to={`/dashboard/staff/edit/${member.staff_profile_id}`}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium text-[#0D1117] hover:bg-[#F7F4EF] transition-colors cursor-pointer no-underline"
        >
          <Settings size={13} className="text-[#8A9BB0]" />
          Edit profile
        </Link>
      )}
      {member.staff_profile_id && (
        <Link
          to={`/dashboard/staff/view/${member.staff_profile_id}`}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium text-[#0D1117] hover:bg-[#F7F4EF] transition-colors cursor-pointer no-underline"
        >
          <Eye size={13} className="text-[#8A9BB0]" />
          View details
        </Link>
      )}
    </DropdownMenu>
  );
}

function InviteRowMenu({ invite, clinicId, branchId, onResend, currentUserEmail }) {
  const [resending, setResending] = useState(false);

  const handleResend = async (e) => {
    e.stopPropagation();
    setResending(true);
    await onResend(invite);
    setResending(false);
  };

  const profileDone = !!invite.staff_profile_id;
  const isOwnInvite = !!(currentUserEmail && invite.email?.toLowerCase() === currentUserEmail);

  return (
    <DropdownMenu
      trigger={(handleOpen) => (
        <button
          onClick={resending ? undefined : handleOpen}
          disabled={resending}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#8A9BB0] hover:bg-[#F7F4EF] hover:text-[#0D1117] transition-all border-none bg-transparent cursor-pointer disabled:opacity-50"
        >
          {resending ? <Loader2 size={13} className="animate-spin" /> : <MoreVertical size={14} />}
        </button>
      )}
    >
      {(invite.status === "pending" || invite.status === "expired") && (
        <button
          onClick={handleResend}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium text-[#0D1117] hover:bg-[#F7F4EF] transition-colors cursor-pointer bg-transparent border-none text-left"
        >
          <RefreshCw size={13} className="text-[#8A9BB0]" />
          Resend invite
        </button>
      )}

      {/* Only show setup/edit options for other people's invites */}
      {!isOwnInvite && invite.status === "accepted" && !profileDone && (
        <Link
          to={`/dashboard/staff/set-up/${invite.id}`}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium text-[#4A7C59] hover:bg-[#E8F2EB] transition-colors cursor-pointer no-underline"
        >
          <Settings size={13} />
          Set up profile
        </Link>
      )}

      {!isOwnInvite && profileDone && (
        <Link
          to={`/dashboard/staff/edit/${invite.staff_profile_id}`}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium text-[#0D1117] hover:bg-[#F7F4EF] transition-colors cursor-pointer no-underline"
        >
          <Settings size={13} className="text-[#8A9BB0]" />
          Edit profile
        </Link>
      )}
    </DropdownMenu>
  );
}

function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#F7F4EF] flex items-center justify-center mb-4">
        <Icon size={22} className="text-[#B8C0CC]" />
      </div>
      <p className="text-[14px] font-semibold text-[#0D1117] font-['DM_Sans'] mb-1">{title}</p>
      <p className="text-[12px] text-[#8A9BB0] font-['DM_Sans'] mb-4 max-w-xs">{desc}</p>
      {action}
    </div>
  );
}

export default function Staff() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "staff";
  const { selectedClinic } = useClinicStore();
  const { user } = useAuth();
  const { staff, staffInvites, loading, pagination, fetchClinicStaff, fetchStaffInvitations, resendInvite } =
    useStaffStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [toast, setToast] = useState(null);

  const clinicId = selectedClinic?.id;
  const branchId = selectedClinic?.branchId;
  const currentUserId = user?.id;
  const currentUserEmail = user?.email?.toLowerCase() ?? null;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadStaff = useCallback(
    async (page = 1) => {
      if (!clinicId) return;
      try {
        await fetchClinicStaff(clinicId, { search, status: statusFilter || null, page });
      } catch { }
    },
    [clinicId, branchId, search, statusFilter]
  );

  const loadInvites = useCallback(
    async (page = 1) => {
      if (!clinicId || !branchId) return;
      try {
        await fetchStaffInvitations(clinicId, branchId, { search, page });
      } catch { }
    },
    [clinicId, branchId, search]
  );

  useEffect(() => {
    if (tab === "staff") loadStaff(1);
    else loadInvites(1);
  }, [tab, search, statusFilter]);

  const handleResend = async (invite) => {
    try {
      await resendInvite(clinicId, branchId, invite.id);
      showToast("Invitation resent successfully.");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to resend invite.", "error");
    }
  };

  const setTab = (t) => {
    setSearch("");
    setStatusFilter("");
    setSearchParams({ tab: t });
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] font-['DM_Sans'] text-[#0D1117]">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl text-[13px] font-medium shadow-lg transition-all animate-[slideIn_0.2s_ease] ${toast.type === "error"
              ? "bg-[#FAF0ED] text-[#c05c3c] border border-[#E8927C]/30"
              : "bg-[#E8F2EB] text-[#2F5C3A] border border-[#4A7C59]/20"
            }`}
        >
          <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}}`}</style>
          {toast.type === "error" ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
          {toast.msg}
        </div>
      )}

      <div className="px-6 py-6 max-w-[1100px] mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-['DM_Serif_Display'] text-[26px] text-[#0D1117] leading-tight">Staff</h1>
            <p className="text-[13px] text-[#8A9BB0] mt-0.5">{selectedClinic?.name || "Clinic"}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => (tab === "staff" ? loadStaff(1) : loadInvites(1))}
              disabled={loading}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-black/[0.09] text-[#8A9BB0] hover:bg-[#F7F4EF] hover:text-[#0D1117] transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <Link
              to="/dashboard/staff/invite"
              className="flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl hover:bg-[#2F5C3A] transition-all no-underline"
            >
              <Plus size={14} />
              Invite staff
            </Link>
          </div>
        </div>

        <div className="flex gap-1 mb-5 bg-white rounded-2xl border border-black/[0.09] p-1">
          {[
            { id: "staff", label: "Staff", icon: Users },
            { id: "staff_invites", label: "Invitations", icon: Mail },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold rounded-xl transition-all cursor-pointer border-none ${tab === id ? "bg-[#4A7C59] text-white shadow-sm" : "bg-transparent text-[#8A9BB0] hover:text-[#0D1117]"
                }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B8C0CC] pointer-events-none" />
            <input
              className={inputCls + " pl-9"}
              placeholder={tab === "staff" ? "Search by name, email, staff ID…" : "Search by email…"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {tab === "staff" && (
            <div className="relative">
              <select
                className="px-3 pr-8 py-2 text-[12px] font-['DM_Sans'] bg-white border border-black/[0.09] rounded-xl outline-none text-[#0D1117] focus:border-[#4A7C59] transition-all appearance-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
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
            staff={staff}
            loading={loading}
            pagination={pagination}
            currentUserId={currentUserId}
            onPageChange={(p) => loadStaff(p)}
            onPhotoClick={(s) => setPreviewPhoto(s)}
          />
        )}

        {tab === "staff_invites" && (
          <InvitesTable
            invites={staffInvites}
            loading={loading}
            pagination={pagination}
            clinicId={clinicId}
            branchId={branchId}
            currentUserEmail={currentUserEmail}
            onPageChange={(p) => loadInvites(p)}
            onResend={handleResend}
          />
        )}
      </div>

      {previewPhoto && (
        <ImagePreview
          isOpen={!!previewPhoto}
          onClose={() => setPreviewPhoto(null)}
          asset={{
            file_url: previewPhoto.profile_photo_url,
            file_original_name: `${previewPhoto.fname} ${previewPhoto.lname}`,
            fname: previewPhoto.fname,
            lname: previewPhoto.lname,
          }}
        />
      )}
    </div>
  );
}

function StaffTable({ staff, loading, pagination, currentUserId, onPageChange, onPhotoClick }) {
  if (loading && staff.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-[#8A9BB0]" />
      </div>
    );
  }

  if (!loading && staff.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No staff found"
        desc="No staff profiles match your search or have been set up yet."
        action={
          <Link
            to="/dashboard/staff/invite"
            className="flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl hover:bg-[#2F5C3A] transition-all no-underline"
          >
            <Plus size={13} />
            Invite staff
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-black/[0.09] overflow-visible">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-0 px-5 py-3 border-b border-black/[0.06]">
          {["", "Name", "Role", "Branch", "Status", ""].map((h, i) => (
            <span key={i} className="text-[10px] font-bold uppercase tracking-[0.07em] text-[#8A9BB0] px-2 first:px-0 last:px-0">
              {h}
            </span>
          ))}
        </div>

        {staff.map((member) => {
          const isYou = member.user_id === currentUserId;
          return (
            <div
              key={member.staff_profile_id || member.user_id}
              className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-0 px-5 py-3.5 border-b border-black/[0.04] hover:bg-[#FAFAF8] transition-colors last:border-b-0"
            >
              <div className="pr-3">
                <Avatar
                  fname={member.fname}
                  lname={member.lname}
                  photoUrl={member.profile_photo_url}
                  size={10}
                  onClick={member.profile_photo_url ? () => onPhotoClick(member) : undefined}
                />
              </div>
              <div className="min-w-0 px-2">
                <div className="flex items-center gap-1.5">
                  <p className="text-[13px] font-semibold text-[#0D1117] truncate">
                    {member.fname} {member.lname}
                  </p>
                  {isYou && (
                    <span className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#4A7C59] text-white leading-none">
                      you
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#8A9BB0] truncate">{member.email}</p>
                {member.staff_id && <p className="text-[10px] text-[#B8C0CC] font-mono">{member.staff_id}</p>}
              </div>
              <div className="px-2">
                <span className="text-[11px] font-semibold text-[#4a6580] bg-[#EEF2F7] px-2.5 py-1 rounded-full whitespace-nowrap">
                  {member.role_name || "—"}
                </span>
              </div>
              <div className="px-2">
                <div className="flex items-center gap-1 text-[11px] text-[#8A9BB0]">
                  <Building2 size={11} />
                  <span className="whitespace-nowrap">{member.branch_name || "—"}</span>
                </div>
              </div>
              <div className="px-2">
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${STATUS_COLORS[member.staff_status] || "bg-[#EEF2F7] text-[#4a6580]"
                    }`}
                >
                  {member.staff_status || "active"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 pl-2">
                {/* Hide the settings shortcut and menu for the current user's own row */}
                {member.staff_profile_id && !isYou && (
                  <Link
                    to={`/dashboard/staff/edit/${member.staff_profile_id}`}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#8A9BB0] hover:bg-[#E8F2EB] hover:text-[#4A7C59] transition-all no-underline"
                  >
                    <Settings size={13} />
                  </Link>
                )}
                <StaffRowMenu member={member} isYou={isYou} />
              </div>
            </div>
          );
        })}
      </div>

      {pagination?.totalPages > 1 && <PaginationBar pagination={pagination} onPageChange={onPageChange} />}
    </>
  );
}

function InvitesTable({ invites, loading, pagination, clinicId, branchId, currentUserEmail, onPageChange, onResend }) {
  if (loading && invites.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-[#8A9BB0]" />
      </div>
    );
  }

  if (!loading && invites.length === 0) {
    return (
      <EmptyState
        icon={Mail}
        title="No invitations"
        desc="No invitations have been sent to this branch yet."
        action={
          <Link
            to="/dashboard/staff/invite"
            className="flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl hover:bg-[#2F5C3A] transition-all no-underline"
          >
            <Plus size={13} />
            Invite staff
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-black/[0.09] overflow-visible">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-0 px-5 py-3 border-b border-black/[0.06]">
          {["Email", "Role", "Status", "Profile", ""].map((h, i) => (
            <span key={i} className="text-[10px] font-bold uppercase tracking-[0.07em] text-[#8A9BB0] px-2 first:px-0 last:px-0">
              {h}
            </span>
          ))}
        </div>

        {invites.map((inv) => {
          const profileDone = !!inv.staff_profile_id;
          const isOwnInvite = !!(currentUserEmail && inv.email?.toLowerCase() === currentUserEmail);

          return (
            <div
              key={inv.id}
              className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-0 px-5 py-3.5 border-b border-black/[0.04] hover:bg-[#FAFAF8] transition-colors last:border-b-0"
            >
              <div className="min-w-0 pr-3">
                <div className="flex items-center gap-1.5">
                  <p className="text-[13px] font-semibold text-[#0D1117] truncate">{inv.email}</p>
                  {isOwnInvite && (
                    <span className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#4A7C59] text-white leading-none">
                      you
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#8A9BB0]">
                  {new Date(inv.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  {inv.invited_by_fname && (
                    <>
                      {" "}· by {inv.invited_by_fname} {inv.invited_by_lname}
                    </>
                  )}
                </p>
              </div>
              <div className="px-2">
                <span className="text-[11px] font-semibold text-[#4a6580] bg-[#EEF2F7] px-2.5 py-1 rounded-full whitespace-nowrap">
                  {inv.role_name || "—"}
                </span>
              </div>
              <div className="px-2">
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${INVITE_STATUS_COLORS[inv.status] || "bg-[#EEF2F7] text-[#4a6580]"
                    }`}
                >
                  {inv.status}
                </span>
              </div>
              <div className="px-2">
                {/* Always hide profile setup/edit buttons for own invite */}
                {isOwnInvite ? (
                  <span className="text-[10px] text-[#B8C0CC]">—</span>
                ) : profileDone ? (
                  <Link
                    to={`/dashboard/staff/edit/${inv.staff_profile_id}`}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#4A7C59] bg-[#E8F2EB] px-2.5 py-1 rounded-full no-underline hover:bg-[#4A7C59] hover:text-white transition-all whitespace-nowrap"
                  >
                    <CheckCircle2 size={10} />
                    Set up
                  </Link>
                ) : inv.status === "accepted" ? (
                  <Link
                    to={`/dashboard/staff/set-up/${inv.id}`}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#C9A84C] bg-[#FBF6E9] px-2.5 py-1 rounded-full no-underline hover:bg-[#C9A84C] hover:text-white transition-all whitespace-nowrap"
                  >
                    <Settings size={10} />
                    Setup
                  </Link>
                ) : (
                  <span className="text-[10px] text-[#B8C0CC]">—</span>
                )}
              </div>
              <div className="pl-2">
                <InviteRowMenu
                  invite={inv}
                  clinicId={clinicId}
                  branchId={branchId}
                  onResend={onResend}
                  currentUserEmail={currentUserEmail}
                />
              </div>
            </div>
          );
        })}
      </div>

      {pagination?.totalPages > 1 && <PaginationBar pagination={pagination} onPageChange={onPageChange} />}
    </>
  );
}

function PaginationBar({ pagination, onPageChange }) {
  const { page, totalPages, total, hasNext, hasPrev } = pagination;
  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-[11px] text-[#8A9BB0]">
        {total} total · Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className="px-3 py-1.5 text-[11px] font-semibold bg-white border border-black/[0.09] rounded-lg text-[#0D1117] hover:bg-[#F7F4EF] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Prev
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-7 h-7 text-[11px] font-semibold rounded-lg transition-all cursor-pointer border-none ${p === page ? "bg-[#4A7C59] text-white" : "bg-white border border-black/[0.09] text-[#0D1117] hover:bg-[#F7F4EF]"
                }`}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="px-3 py-1.5 text-[11px] font-semibold bg-white border border-black/[0.09] rounded-lg text-[#0D1117] hover:bg-[#F7F4EF] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}