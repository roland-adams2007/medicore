import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search, UserPlus, ChevronDown, ChevronUp, ChevronsUpDown,
  X, Phone, Mail, Hash, Pencil, MessageCircle, CalendarOff,
  UserX, SearchX, Star, Clock, TrendingUp, CheckSquare, Send, Loader2,
  MoreVertical, Trash2, Settings, RefreshCw, Users, MailCheck,
  AlertCircle, CheckCircle2, Timer, XCircle,
} from "lucide-react";
import { useClinicStore, useRolestore, useStaffStore } from "../store/store";

const FIRST = ["Adaeze", "Bello", "Chioma", "Emeka", "Funke", "Grace", "Ibrahim", "Joy", "Kemi", "Ladi", "Moses", "Ngozi", "Olumide", "Praise", "Rita", "Seun", "Taiwo", "Uche", "Victor", "Yemi", "Zainab", "Aisha", "Biodun", "Chidi", "Damilola"];
const LAST = ["Obi", "Adeyemi", "Eze", "Nwachukwu", "Fashola", "Lawal", "Musa", "Okonkwo", "Adeleke", "Balogun", "Adesanya", "Nnadi", "Babatunde", "Okafor", "Nwosu", "Abubakar", "Chukwu", "Williams", "Mensah", "Ogbu"];
const ROLES = ["Doctor", "Nurse", "Receptionist", "Lab Technician", "Pharmacist", "Admin"];
const DEPTS = ["General Medicine", "Cardiology", "Paediatrics", "Surgery", "Gynaecology", "Emergency", "Pharmacy", "Laboratory", "Administration", "Front Desk"];
const SPECIALTIES = {
  Doctor: ["General Practitioner", "Cardiologist", "Paediatrician", "Gynaecologist", "Surgeon", "Internist"],
  Nurse: ["General Nursing", "ICU", "Paediatric", "Emergency", "Midwifery"],
  "Lab Technician": ["Haematology", "Microbiology", "Biochemistry", "Pathology"],
  Pharmacist: ["Clinical Pharmacy", "Dispensing"],
  Receptionist: ["Front Desk", "Medical Secretary"],
  Admin: ["HR", "Finance", "Operations", "IT"],
};
const AV_COLORS = ["#4A7C59", "#E8927C", "#C9A84C", "#8A9BB0", "#6BA37A", "#2F5C3A", "#6A3D85", "#c97058", "#2563EB", "#15803D"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const QUALIFICATIONS = ["MBBS", "FMCP", "FWACS", "FACS", "B.Sc. Nursing", "RN", "HND MLT", "B.Pharm", "MBA (Health Mgmt)", "Diploma Nursing"];

function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
function rndInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
function pastDate(d) { const dt = new Date(); dt.setDate(dt.getDate() - d); return dt; }
function fmtDate(d) {
  const m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${m[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
function fmtDateTime(d) {
  const dt = typeof d === "string" ? new Date(d) : d;
  if (!dt || isNaN(dt)) return "—";
  const m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${m[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
}
function initials(n) { return n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(); }
function fmtSalary(n) { return "₦" + n.toLocaleString(); }

function generateStaff() {
  return Array.from({ length: 32 }, (_, i) => {
    const fn = rnd(FIRST), ln = rnd(LAST);
    const role = ROLES[i % ROLES.length];
    const spec = rnd(SPECIALTIES[role] || ["General"]);
    const sr = Math.random();
    const status = sr < 0.72 ? "active" : sr < 0.88 ? "leave" : "inactive";
    const salary = role === "Doctor" ? rndInt(350000, 900000) : role === "Nurse" ? rndInt(120000, 250000) : rndInt(80000, 200000);
    const offDay = rnd(["Saturday", "Sunday"]);
    return {
      id: 3000 + i,
      name: `${fn} ${ln}`, role, specialty: spec,
      department: rnd(DEPTS), status,
      joined: pastDate(rndInt(60, 1200)),
      salary,
      patientsToday: role === "Doctor" ? rndInt(4, 18) : role === "Nurse" ? rndInt(8, 24) : 0,
      phone: `080${rndInt(10000000, 99999999)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@gracehealth.ng`,
      qualification: rnd(QUALIFICATIONS),
      color: AV_COLORS[i % AV_COLORS.length],
      schedule: DAYS.map(d => ({ day: d, off: d === "Sunday" || d === offDay, start: "08:00 AM", end: d === "Saturday" ? "02:00 PM" : "05:00 PM" })),
      activities: [
        { text: `Completed ${rndInt(3, 12)} consultations`, time: "Today, 3:00 PM", color: "#4A7C59" },
        { text: "Updated patient records", time: "Today, 11:20 AM", color: "#8A9BB0" },
        { text: "Attended staff briefing", time: "Today, 8:00 AM", color: "#C9A84C" },
        { text: "Submitted daily report", time: "Yesterday, 5:30 PM", color: "#4A7C59" },
      ].slice(0, rndInt(2, 4)),
      performance: {
        attendance: rndInt(88, 100),
        patientRating: rndInt(80, 100),
        punctuality: rndInt(85, 100),
        tasksCompleted: rndInt(75, 100),
      },
      yearsExp: rndInt(1, 20),
      consultationsThisMonth: rndInt(20, 120),
    };
  });
}

const roleBadgeClass = {
  Doctor: "bg-[#E8F2EB] text-[#2F5C3A]",
  Nurse: "bg-[#EEF6FF] text-[#2563EB]",
  Receptionist: "bg-[#FAF0ED] text-[#c05c3c]",
  Admin: "bg-[#F5F0F8] text-[#6A3D85]",
  "Lab Technician": "bg-[#FBF6E9] text-[#8b6a1a]",
  Pharmacist: "bg-[#F0FDF4] text-[#15803D]",
};
const statusBadgeClass = {
  active: "bg-[#E8F2EB] text-[#2F5C3A]",
  leave: "bg-[#FBF6E9] text-[#8b6a1a]",
  inactive: "bg-[#EEF2F7] text-[#4a6580]",
};
const inviteStatusConfig = {
  pending:  { label: "Pending",  cls: "bg-[#FBF6E9] text-[#8b6a1a]",  icon: <Timer size={11} /> },
  accepted: { label: "Accepted", cls: "bg-[#E8F2EB] text-[#2F5C3A]",  icon: <CheckCircle2 size={11} /> },
  declined: { label: "Declined", cls: "bg-[#FAF0ED] text-[#c05c3c]",  icon: <XCircle size={11} /> },
  expired:  { label: "Expired",  cls: "bg-[#EEF2F7] text-[#4a6580]",  icon: <AlertCircle size={11} /> },
};

function Badge({ text, cls }) {
  return (
    <span className={`text-[10px] font-bold px-2 py-[3px] rounded-full whitespace-nowrap ${cls}`}>
      {text}
    </span>
  );
}

function InviteStatusBadge({ status }) {
  const cfg = inviteStatusConfig[status] || inviteStatusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-[3px] rounded-full whitespace-nowrap ${cfg.cls}`}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

function InviteRowMenu({ invite, clinicId, onDelete, onResend }) {
  const [open, setOpen] = useState(false);
  const [resending, setResending] = useState(false);
  const ref = useRef(null);
  const profileComplete = !!invite.staff_profile_id;

  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const handleResend = async () => {
    setOpen(false);
    setResending(true);
    await onResend(invite);
    setResending(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        disabled={resending}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-[#8A9BB0] hover:bg-[#F7F4EF] hover:text-[#0D1117] transition-all border-none bg-transparent cursor-pointer disabled:opacity-50"
      >
        {resending ? <Loader2 size={13} className="animate-spin" /> : <MoreVertical size={14} />}
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 bg-white border border-black/[0.09] rounded-xl shadow-[0_8px_32px_rgba(13,17,23,0.14)] min-w-[170px] overflow-hidden animate-[menuIn_0.14s_ease]">
          <style>{`@keyframes menuIn{from{opacity:0;transform:scale(0.96) translateY(-4px)}to{opacity:1;transform:none}}`}</style>

          {invite.status === "pending" && (
            <button
              onClick={handleResend}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium text-[#0D1117] hover:bg-[#F7F4EF] transition-colors cursor-pointer bg-transparent border-none text-left"
            >
              <RefreshCw size={13} className="text-[#8A9BB0]" />
              Resend invite
            </button>
          )}

          {invite.status === "accepted" && !profileComplete && (
            <Link
              to={`/dashboard/staff/set-up/${invite.id}`}
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium text-[#4A7C59] hover:bg-[#E8F2EB] transition-colors cursor-pointer no-underline"
            >
              <Settings size={13} />
              Set up profile
            </Link>
          )}

          {invite.status === "accepted" && profileComplete && (
            <Link
              to={`/dashboard/staff/set-up/${invite.id}`}
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium text-[#8A9BB0] hover:bg-[#F7F4EF] transition-colors cursor-pointer no-underline"
            >
              <Settings size={13} />
              Edit profile
            </Link>
          )}

          <div className="h-px bg-black/[0.06] mx-2" />

          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onDelete(invite); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium text-[#c05c3c] hover:bg-[#FAF0ED] transition-colors cursor-pointer bg-transparent border-none text-left"
          >
            <Trash2 size={13} />
            Delete invite
          </button>
        </div>
      )}
    </div>
  );
}

function StaffInvitationsTab({ clinicId, branchId, onInvite }) {
  const { staffInvites, loading, error, fetchStaffInvitations, resendInvite } = useStaffStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [resendSuccess, setResendSuccess] = useState(null);

  useEffect(() => {
    if (clinicId && branchId) fetchStaffInvitations(clinicId, branchId);
  }, [clinicId, branchId]);

  const filtered = useMemo(() => {
    if (!Array.isArray(staffInvites)) return [];
    return staffInvites.filter(inv => {
      const matchStatus = statusFilter === "all" || inv.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchSearch = !q
        || inv.email?.toLowerCase().includes(q)
        || inv.role_name?.toLowerCase().includes(q)
        || `${inv.invited_by_fname ?? ""} ${inv.invited_by_lname ?? ""}`.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [staffInvites, search, statusFilter]);

  const handleDelete = useCallback((invite) => {
    if (!window.confirm(`Delete invite for ${invite.email}?`)) return;
    setDeletingId(invite.id);
    setTimeout(() => setDeletingId(null), 800);
  }, []);

  const handleResend = useCallback(async (invite) => {
    try {
      await resendInvite(clinicId,branchId, invite.id);
      setResendSuccess(invite.id);
      setTimeout(() => setResendSuccess(null), 3000);
    } catch {
      // error shown via store
    }
  }, [clinicId, branchId,resendInvite]);

  const STATUS_FILTERS = [
    { label: "All", val: "all" },
    { label: "Pending", val: "pending" },
    { label: "Accepted", val: "accepted" },
    { label: "Declined", val: "declined" },
    { label: "Expired", val: "expired" },
  ];

  if (loading && (!staffInvites || staffInvites.length === 0)) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-[#8A9BB0]">
          <Loader2 size={28} className="animate-spin" />
          <p className="text-[13px]">Loading invitations…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-2 text-[#c05c3c]">
          <AlertCircle size={28} className="opacity-60" />
          <p className="text-[13px]">{error}</p>
          <button onClick={() => fetchStaffInvitations(clinicId, branchId)}
            className="mt-1 text-[12px] font-semibold text-[#4A7C59] hover:underline bg-transparent border-none cursor-pointer">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {resendSuccess && (
        <div className="mx-4 mt-3 flex items-center gap-2 px-3.5 py-2.5 bg-[#E8F2EB] border border-[#4A7C59]/20 rounded-xl text-[12px] font-medium text-[#2F5C3A] animate-[fadeIn_0.2s_ease]">
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}`}</style>
          <CheckCircle2 size={14} />
          Invitation resent successfully.
        </div>
      )}

      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-black/[0.09] bg-white flex-shrink-0 mt-0">
        <div className="relative w-48">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8A9BB0] pointer-events-none" />
          <input type="text" placeholder="Search invites…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-7 pr-2.5 py-1.5 text-[12px] font-sans bg-[#F7F4EF] border border-black/[0.09] rounded-lg outline-none text-[#0D1117] placeholder-[#B8C0CC] focus:border-[#4A7C59] focus:bg-white transition-all" />
        </div>

        <div className="flex gap-1 flex-shrink-0">
          {STATUS_FILTERS.map(f => (
            <button key={f.val} onClick={() => setStatusFilter(f.val)}
              className={`px-2.5 py-1 text-[11px] font-semibold border rounded-md cursor-pointer whitespace-nowrap transition-all font-sans
                ${statusFilter === f.val ? "bg-[#4A7C59] text-white border-[#4A7C59]" : "bg-transparent text-[#8A9BB0] border-black/[0.09] hover:border-[#4A7C59] hover:text-[#2F5C3A]"}`}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="ml-auto">
          <button onClick={onInvite}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-lg hover:bg-[#2F5C3A] hover:shadow-[0_4px_14px_rgba(47,92,58,0.25)] transition-all border-none cursor-pointer font-sans">
            <UserPlus size={13} />Invite Staff
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-6 text-[#8A9BB0]">
            <MailCheck size={40} className="mx-auto opacity-25 mb-3" />
            <p className="text-[14px] font-medium text-[#0D1117]">No invitations found</p>
            <p className="text-[12px] mt-1">
              {statusFilter !== "all" ? "Try a different filter or " : ""}invite your first staff member to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="grid px-4 py-2 border-b border-black/[0.05] bg-[#F7F4EF]/60"
              style={{ gridTemplateColumns: "1fr 130px 160px 100px 110px 100px" }}>
              {["Email", "Role", "Invited by", "Date", "Status", ""].map((h, i) => (
                <span key={i} className="text-[10px] font-bold uppercase tracking-[0.07em] text-[#8A9BB0]">{h}</span>
              ))}
            </div>

            {filtered.map((inv) => {
              const profileComplete = !!inv.staff_profile_id;
              return (
                <div key={inv.id}
                  className={`grid items-center px-4 py-3 border-b border-black/[0.05] transition-all
                    ${deletingId === inv.id ? "opacity-40 pointer-events-none" : "hover:bg-[rgba(247,244,239,0.7)]"}`}
                  style={{ gridTemplateColumns: "1fr 130px 160px 100px 110px 100px" }}
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-[13px] font-semibold text-[#0D1117] truncate">{inv.email}</p>
                    {inv.status === "accepted" && profileComplete && (
                      <p className="text-[11px] text-[#4A7C59] mt-0.5 flex items-center gap-1">
                        <CheckCircle2 size={10} />Profile set up
                      </p>
                    )}
                    {inv.status === "accepted" && !profileComplete && inv.accepted_at && (
                      <p className="text-[11px] text-[#C9A84C] mt-0.5">Accepted · setup pending</p>
                    )}
                    {inv.status === "expired" && (
                      <p className="text-[11px] text-[#8A9BB0] mt-0.5">Expired {fmtDateTime(inv.expires_at)}</p>
                    )}
                  </div>

                  <div>
                    <span className={`text-[11px] font-semibold px-2 py-[3px] rounded-full ${roleBadgeClass[inv.role_name] || "bg-[#E8F2EB] text-[#2F5C3A]"}`}>
                      {inv.role_name || "—"}
                    </span>
                  </div>

                  <p className="text-[12px] text-[#8A9BB0] truncate pr-2">
                    {inv.invited_by_fname ? `${inv.invited_by_fname} ${inv.invited_by_lname || ""}`.trim() : "—"}
                  </p>

                  <p className="text-[12px] text-[#8A9BB0]">{fmtDateTime(inv.created_at)}</p>

                  <InviteStatusBadge status={inv.status} />

                  <div className="flex items-center justify-end gap-1.5">
                    {inv.status === "accepted" && !profileComplete && (
                      <Link
                        to={`/dashboard/staff/set-up/${inv.id}`}
                        className="flex items-center gap-1 px-2.5 py-1 bg-[#E8F2EB] text-[#2F5C3A] text-[10px] font-bold rounded-lg hover:bg-[#4A7C59] hover:text-white transition-all no-underline whitespace-nowrap"
                      >
                        <Settings size={10} />Setup
                      </Link>
                    )}
                    {inv.status === "accepted" && profileComplete && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-[#F7F4EF] text-[#8A9BB0] text-[10px] font-bold rounded-lg whitespace-nowrap">
                        <CheckCircle2 size={10} className="text-[#4A7C59]" />Done
                      </span>
                    )}
                    <InviteRowMenu
                      invite={inv}
                      clinicId={clinicId}
                      onDelete={handleDelete}
                      onResend={handleResend}
                    />
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

function InviteStaffModal({ onClose, clinicId, branchId }) {
  const { inviteStaff } = useStaffStore();
  const { roles, loading: loadingRoles, fetchRoles } = useRolestore();
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => { fetchRoles(); }, []);

  const filteredRoles = useMemo(() => {
    if (!Array.isArray(roles)) return [];
    return roles.filter(r => r.name?.toLowerCase() !== "super admin");
  }, [roles]);

  useEffect(() => {
    if (filteredRoles.length > 0 && !roleId) setRoleId(String(filteredRoles[0].id));
  }, [filteredRoles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !roleId) return;
    setError(null);
    setSubmitting(true);
    try {
      await inviteStaff(clinicId, { email: email.trim(), branch_id: branchId, role_id: parseInt(roleId, 10) });
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to send invite.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-3 py-2.5 text-[14px] font-sans bg-[#F7F4EF] border-[1.5px] border-black/[0.09] rounded-xl outline-none text-[#0D1117] focus:border-[#4A7C59] focus:shadow-[0_0_0_3px_rgba(74,124,89,0.1)] focus:bg-white transition-all appearance-none disabled:opacity-50";

  return (
    <div className="fixed inset-0 bg-[#0D1117]/50 backdrop-blur-sm z-[200] flex items-center justify-center p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-[420px] shadow-[0_24px_80px_rgba(13,17,23,0.25)] animate-[modalIn_0.22s_ease]">
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:none}}`}</style>
        <div className="p-5 pb-0 flex items-center justify-between">
          <div>
            <h2 className="font-['DM_Serif_Display'] text-[21px] text-[#0D1117]">Invite Staff</h2>
            <p className="text-[12px] text-[#8A9BB0] mt-0.5">Send an invite link via email</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-[#F7F4EF] rounded-lg flex items-center justify-center text-[#8A9BB0] hover:bg-[#FAF0ED] hover:text-[#E8927C] transition-all border-none cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 pt-4">
          {success ? (
            <div className="py-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F2EB] flex items-center justify-center mx-auto mb-4">
                <Send size={22} className="text-[#4A7C59]" />
              </div>
              <p className="font-['DM_Serif_Display'] text-[18px] text-[#0D1117] mb-1">Invite sent!</p>
              <p className="text-[13px] text-[#8A9BB0] mb-5">
                An invitation has been sent to <span className="font-semibold text-[#0D1117]">{email}</span>
              </p>
              <div className="flex gap-2.5">
                <button onClick={() => { setSuccess(false); setEmail(""); setRoleId(filteredRoles[0]?.id ? String(filteredRoles[0].id) : ""); }}
                  className="flex-1 py-2.5 bg-[#F7F4EF] border-[1.5px] border-black/[0.09] rounded-xl text-[13px] font-semibold text-[#0D1117] cursor-pointer hover:bg-[#EEF2F7] transition-all font-sans">
                  Invite another
                </button>
                <button onClick={onClose} className="flex-1 py-2.5 bg-[#4A7C59] rounded-xl text-[13px] font-semibold text-white cursor-pointer hover:bg-[#2F5C3A] transition-all font-sans border-none">
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3.5">
                <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#0D1117] mb-1.5">Email address</label>
                <input type="email" className={inputCls} placeholder="staff@gracehealth.ng" value={email} onChange={e => setEmail(e.target.value)} required disabled={submitting} />
              </div>
              <div className="mb-4">
                <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#0D1117] mb-1.5">Role</label>
                {loadingRoles ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F7F4EF] border-[1.5px] border-black/[0.09] rounded-xl text-[13px] text-[#8A9BB0]">
                    <Loader2 size={14} className="animate-spin" />Loading roles…
                  </div>
                ) : filteredRoles.length === 0 ? (
                  <div className="px-3 py-2.5 bg-[#FBF6E9] border-[1.5px] border-[#C9A84C]/30 rounded-xl text-[13px] text-[#8b6a1a]">No roles available</div>
                ) : (
                  <select className={inputCls} value={roleId} onChange={e => setRoleId(e.target.value)} required disabled={submitting}>
                    {filteredRoles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                )}
              </div>
              {error && (
                <div className="mb-3.5 px-3 py-2.5 bg-[#FAF0ED] border-[1.5px] border-[#E8927C]/40 rounded-xl text-[13px] text-[#c05c3c]">{error}</div>
              )}
              <div className="flex gap-2.5">
                <button type="button" onClick={onClose} disabled={submitting}
                  className="flex-1 py-2.5 bg-[#F7F4EF] border-[1.5px] border-black/[0.09] rounded-xl text-[13px] font-semibold text-[#8A9BB0] cursor-pointer hover:bg-[#EEF2F7] transition-all font-sans disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting || loadingRoles || filteredRoles.length === 0}
                  className="flex-[2] py-2.5 bg-[#4A7C59] rounded-xl text-[13px] font-semibold text-white cursor-pointer hover:bg-[#2F5C3A] transition-all font-sans border-none flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? <><Loader2 size={14} className="animate-spin" />Sending…</> : <><Send size={14} />Send invite</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function StaffDetailPanel({ staff: s, onClose, onEdit, onToggleLeave, onToggleActive }) {
  const [activeTab, setActiveTab] = useState("overview");
  useEffect(() => { setActiveTab("overview"); }, [s.id]);

  const perfMetrics = [
    { label: "Attendance", val: s.performance.attendance, color: "#4A7C59", icon: <CheckSquare size={13} /> },
    { label: "Patient Rating", val: s.performance.patientRating, color: "#E8927C", icon: <Star size={13} /> },
    { label: "Punctuality", val: s.performance.punctuality, color: "#C9A84C", icon: <Clock size={13} /> },
    { label: "Tasks Completed", val: s.performance.tasksCompleted, color: "#8A9BB0", icon: <TrendingUp size={13} /> },
  ];
  const tabs = [{ id: "overview", label: "Overview" }, { id: "schedule", label: "Schedule" }, { id: "perf", label: "Performance" }];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex border-b border-black/[0.09] flex-shrink-0">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer font-sans
              ${activeTab === t.id ? "text-[#4A7C59] border-[#4A7C59]" : "text-[#8A9BB0] border-transparent hover:text-[#0D1117] hover:bg-[#F7F4EF]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "overview" && (
          <>
            <div className="p-4 border-b border-black/[0.09]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0" style={{ background: s.color }}>
                  {initials(s.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-['DM_Serif_Display'] text-lg text-[#0D1117] leading-tight">{s.name}</p>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    <Badge text={s.role} cls={roleBadgeClass[s.role] || "bg-[#E8F2EB] text-[#2F5C3A]"} />
                    <Badge text={s.status} cls={statusBadgeClass[s.status]} />
                  </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-[#F7F4EF] rounded-lg text-[#8A9BB0] hover:bg-[#FAF0ED] hover:text-[#E8927C] transition-all flex-shrink-0 border-none cursor-pointer">
                  <X size={15} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { label: "Specialty", val: s.specialty },
                  { label: "Department", val: s.department },
                  { label: "Experience", val: `${s.yearsExp} years` },
                  { label: "Qualification", val: s.qualification },
                  { label: "Joined", val: fmtDate(s.joined) },
                  { label: "Monthly Salary", val: fmtSalary(s.salary), highlight: true },
                ].map(({ label, val, highlight }) => (
                  <div key={label} className="p-2.5 bg-[#F7F4EF] rounded-xl border border-black/[0.07]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#8A9BB0] mb-0.5">{label}</p>
                    <p className={`text-[13px] font-semibold ${highlight ? "text-[#4A7C59]" : "text-[#0D1117]"}`}>{val}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1.5 mb-3">
                {[{ icon: <Phone size={14} />, val: s.phone }, { icon: <Mail size={14} />, val: s.email }, { icon: <Hash size={14} />, val: `Staff ID: S-${s.id}` }].map(({ icon, val }) => (
                  <div key={val} className="flex items-center gap-2 text-[13px] text-[#8A9BB0]">
                    <span className="flex-shrink-0">{icon}</span>{val}
                  </div>
                ))}
              </div>
              {(s.role === "Doctor" || s.role === "Nurse") && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-[#E8F2EB] rounded-xl text-center">
                    <p className="font-['DM_Serif_Display'] text-2xl text-[#4A7C59]">{s.patientsToday}</p>
                    <p className="text-[11px] text-[#2F5C3A] mt-0.5">Patients today</p>
                  </div>
                  <div className="p-3 bg-[#FBF6E9] rounded-xl text-center">
                    <p className="font-['DM_Serif_Display'] text-2xl text-[#C9A84C]">{s.consultationsThisMonth}</p>
                    <p className="text-[11px] text-[#8b6a1a] mt-0.5">This month</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8A9BB0] mb-3">Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Edit Profile", icon: <Pencil size={18} />, iconColor: "#4A7C59", onClick: onEdit },
                  { label: "Message", icon: <MessageCircle size={18} />, iconColor: "#E8927C", onClick: () => {} },
                  { label: s.status === "leave" ? "End Leave" : "Mark Leave", icon: <CalendarOff size={18} />, iconColor: "#C9A84C", onClick: onToggleLeave },
                  { label: s.status === "inactive" ? "Reactivate" : "Deactivate", icon: <UserX size={18} />, iconColor: "#8A9BB0", onClick: onToggleActive },
                ].map(({ label, icon, iconColor, onClick }) => (
                  <button key={label} onClick={onClick} className="flex flex-col items-center gap-1.5 p-3 bg-[#F7F4EF] border border-black/[0.09] rounded-xl cursor-pointer text-[11px] font-semibold text-[#8A9BB0] hover:border-[#4A7C59] hover:bg-[#E8F2EB] hover:text-[#2F5C3A] transition-all font-sans group">
                    <span style={{ color: iconColor }} className="group-hover:!text-[#4A7C59] transition-colors">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "schedule" && (
          <div className="p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8A9BB0] mb-3">Weekly Schedule</p>
            <div className="flex flex-col">
              {s.schedule.map((d, i) => (
                <div key={d.day} className={`flex items-center justify-between py-2.5 ${i < s.schedule.length - 1 ? "border-b border-black/[0.05]" : ""}`}>
                  <span className="text-[12px] font-semibold text-[#0D1117] w-20">{d.day.slice(0, 3)}</span>
                  {d.off ? <span className="text-[12px] text-[#E8927C]">Day off</span> : <span className="text-[12px] text-[#8A9BB0]">{d.start} – {d.end}</span>}
                  <Badge text={d.off ? "Off" : "On duty"} cls={d.off ? statusBadgeClass.inactive : statusBadgeClass.active} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "perf" && (
          <>
            <div className="p-4 border-b border-black/[0.09]">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8A9BB0] mb-3">Performance Metrics</p>
              <div className="flex flex-col gap-3">
                {perfMetrics.map(({ label, val, color, icon }) => (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#0D1117]"><span style={{ color }}>{icon}</span>{label}</div>
                      <span className="text-[12px] font-bold" style={{ color }}>{val}%</span>
                    </div>
                    <div className="h-1.5 bg-black/[0.07] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${val}%`, background: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8A9BB0] mb-3">Recent Activity</p>
              <div className="flex flex-col gap-3">
                {s.activities.map((a, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.color }} />
                    <div>
                      <p className="text-[13px] text-[#0D1117] leading-snug">{a.text}</p>
                      <p className="text-[11px] text-[#8A9BB0] mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StaffModal({ editStaff, onClose, onSave }) {
  const isEdit = !!editStaff;
  const [form, setForm] = useState({
    fn: isEdit ? editStaff.name.split(" ")[0] : "",
    ln: isEdit ? editStaff.name.split(" ").slice(1).join(" ") : "",
    role: isEdit ? editStaff.role : ROLES[0],
    spec: isEdit ? editStaff.specialty : "",
    dept: isEdit ? editStaff.department : DEPTS[0],
    qual: isEdit ? editStaff.qualification : "",
    phone: isEdit ? editStaff.phone : "",
    email: isEdit ? editStaff.email : "",
    exp: isEdit ? String(editStaff.yearsExp) : "",
    salary: isEdit ? String(editStaff.salary) : "",
    status: isEdit ? editStaff.status : "active",
  });
  const specs = SPECIALTIES[form.role] || ["General"];
  const set = (key) => (e) => {
    const nf = { ...form, [key]: e.target.value };
    if (key === "role") nf.spec = (SPECIALTIES[e.target.value] || ["General"])[0];
    setForm(nf);
  };
  const handleSave = () => {
    if (!form.fn || !form.ln || !form.phone) { alert("Please fill in first name, last name, and phone."); return; }
    onSave(form, editStaff?.id);
  };
  const Field = ({ label, children }) => (
    <div className="mb-3.5">
      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#0D1117] mb-1.5">{label}</label>
      {children}
    </div>
  );
  const inputCls = "w-full px-3 py-2.5 text-[14px] font-sans bg-[#F7F4EF] border-[1.5px] border-black/[0.09] rounded-xl outline-none text-[#0D1117] focus:border-[#4A7C59] focus:shadow-[0_0_0_3px_rgba(74,124,89,0.1)] focus:bg-white transition-all appearance-none";

  return (
    <div className="fixed inset-0 bg-[#0D1117]/50 backdrop-blur-sm z-[200] flex items-center justify-center p-5" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto shadow-[0_24px_80px_rgba(13,17,23,0.25)] animate-[modalIn_0.22s_ease]">
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:none}}`}</style>
        <div className="p-5 pb-0 flex items-center justify-between">
          <h2 className="font-['DM_Serif_Display'] text-[21px] text-[#0D1117]">{isEdit ? "Edit Staff Member" : "Add Staff Member"}</h2>
          <button onClick={onClose} className="w-8 h-8 bg-[#F7F4EF] rounded-lg flex items-center justify-center text-[#8A9BB0] hover:bg-[#FAF0ED] hover:text-[#E8927C] transition-all border-none cursor-pointer"><X size={16} /></button>
        </div>
        <div className="p-5 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name"><input className={inputCls} placeholder="Adaeze" value={form.fn} onChange={set("fn")} /></Field>
            <Field label="Last Name"><input className={inputCls} placeholder="Obi" value={form.ln} onChange={set("ln")} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Role"><select className={inputCls} value={form.role} onChange={set("role")}>{ROLES.map(r => <option key={r}>{r}</option>)}</select></Field>
            <Field label="Specialty"><select className={inputCls} value={form.spec} onChange={set("spec")}>{specs.map(sp => <option key={sp}>{sp}</option>)}</select></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Department"><select className={inputCls} value={form.dept} onChange={set("dept")}>{DEPTS.map(d => <option key={d}>{d}</option>)}</select></Field>
            <Field label="Qualification"><input className={inputCls} placeholder="e.g. MBBS" value={form.qual} onChange={set("qual")} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone"><input className={inputCls} placeholder="08012345678" value={form.phone} onChange={set("phone")} /></Field>
            <Field label="Years Experience"><input className={inputCls} type="number" placeholder="5" min="0" max="50" value={form.exp} onChange={set("exp")} /></Field>
          </div>
          <Field label="Email"><input className={inputCls} type="email" placeholder="staff@gracehealth.ng" value={form.email} onChange={set("email")} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Monthly Salary (₦)"><input className={inputCls} type="number" placeholder="250000" value={form.salary} onChange={set("salary")} /></Field>
            <Field label="Status"><select className={inputCls} value={form.status} onChange={set("status")}>{["active", "leave", "inactive"].map(s => <option key={s}>{s}</option>)}</select></Field>
          </div>
          <div className="flex gap-2.5 mt-4">
            <button onClick={onClose} className="flex-1 py-2.5 bg-[#F7F4EF] border-[1.5px] border-black/[0.09] rounded-xl text-[13px] font-semibold text-[#8A9BB0] cursor-pointer hover:bg-[#EEF2F7] transition-all font-sans">Cancel</button>
            <button onClick={handleSave} className="flex-[2] py-2.5 bg-[#4A7C59] rounded-xl text-[13px] font-semibold text-white cursor-pointer hover:bg-[#2F5C3A] transition-all font-sans border-none">{isEdit ? "Save changes" : "Add staff member"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Staff() {
  const { selectedClinic } = useClinicStore();
  const { fetchStaff, staff, loading: staffLoading } = useStaffStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "staff";
  const setTab = (tab) => setSearchParams(tab === "staff" ? {} : { tab });

  useEffect(() => {
    if (selectedClinic?.id && selectedClinic?.branchId) {
      fetchStaff(selectedClinic.id, selectedClinic.branchId);
    }
  }, [selectedClinic?.id, selectedClinic?.branchId]);

  const [staffList, setStaffList] = useState(() => generateStaff());
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const selectedStaff = useMemo(() => staffList.find(s => s.id === selectedId), [staffList, selectedId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = staffList.filter(s => {
      const matchFilter = activeFilter === "all" || s.role === activeFilter;
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.department.toLowerCase().includes(q) || s.specialty.toLowerCase().includes(q);
      return matchFilter && matchQ;
    });
    list.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (typeof va === "string") { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      return va < vb ? -sortDir : va > vb ? sortDir : 0;
    });
    return list;
  }, [staffList, search, activeFilter, sortKey, sortDir]);

  const stats = useMemo(() => ({
    total: staffList.length,
    doctors: staffList.filter(s => s.role === "Doctor").length,
    nurses: staffList.filter(s => s.role === "Nurse").length,
    onLeave: staffList.filter(s => s.status === "leave").length,
  }), [staffList]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d * -1);
    else { setSortKey(key); setSortDir(1); }
  };

  const SortIcon = ({ k }) => sortKey === k
    ? (sortDir === 1 ? <ChevronDown size={12} className="text-[#4A7C59]" /> : <ChevronUp size={12} className="text-[#4A7C59]" />)
    : <ChevronsUpDown size={12} className="opacity-40" />;

  const handleSelectStaff = useCallback((id) => setSelectedId(id), []);
  const closeDetail = useCallback(() => setSelectedId(null), []);
  const openEdit = useCallback(() => { setEditId(selectedId); setShowEditModal(true); }, [selectedId]);

  const handleToggleLeave = useCallback(() => {
    setStaffList(prev => prev.map(s => s.id === selectedId ? { ...s, status: s.status === "leave" ? "active" : "leave" } : s));
    setSelectedId(null);
  }, [selectedId]);

  const handleToggleActive = useCallback(() => {
    const s = staffList.find(x => x.id === selectedId);
    if (!s) return;
    const action = s.status === "inactive" ? "reactivate" : "deactivate";
    if (window.confirm(`Are you sure you want to ${action} ${s.name}?`)) {
      setStaffList(prev => prev.map(x => x.id === selectedId ? { ...x, status: x.status === "inactive" ? "active" : "inactive" } : x));
      setSelectedId(null);
    }
  }, [selectedId, staffList]);

  const handleSave = useCallback((form, id) => {
    if (id) {
      setStaffList(prev => prev.map(s => s.id === id ? {
        ...s, name: `${form.fn} ${form.ln}`, role: form.role, specialty: form.spec,
        department: form.dept, qualification: form.qual, phone: form.phone,
        email: form.email, yearsExp: parseInt(form.exp) || 0, salary: parseInt(form.salary) || 0, status: form.status,
      } : s));
    } else {
      setStaffList(prev => [...prev, {
        id: Date.now() % 100000, name: `${form.fn} ${form.ln}`, role: form.role, specialty: form.spec,
        department: form.dept, qualification: form.qual, phone: form.phone, email: form.email,
        yearsExp: parseInt(form.exp) || 0, salary: parseInt(form.salary) || 0, status: form.status,
        joined: new Date(), color: rnd(AV_COLORS), patientsToday: 0, consultationsThisMonth: 0,
        schedule: DAYS.map(d => ({ day: d, off: d === "Sunday", start: "08:00 AM", end: "05:00 PM" })),
        activities: [],
        performance: { attendance: 100, patientRating: 100, punctuality: 100, tasksCompleted: 100 },
      }]);
    }
    setShowEditModal(false);
    setEditId(null);
  }, []);

  const FILTERS = [
    { label: "All", val: "all" },
    { label: "Doctors", val: "Doctor" },
    { label: "Nurses", val: "Nurse" },
    { label: "Admin", val: "Admin" },
  ];

  const STAT_ITEMS = [
    { val: stats.total, lbl: "Total staff" },
    { val: stats.doctors, lbl: "Doctors", highlight: true },
    { val: stats.nurses, lbl: "Nurses" },
    { val: stats.onLeave, lbl: "On leave" },
  ];

  const PAGE_TABS = [
    { id: "staff", label: "Staff", icon: <Users size={13} /> },
    { id: "staff_invites", label: "Invitations", icon: <MailCheck size={13} /> },
  ];

  return (
    <div className="h-screen overflow-hidden font-['DM_Sans'] bg-[#F7F4EF] text-[#0D1117] flex flex-col">
      <div className="flex items-center gap-1 px-4 pt-3 pb-0 bg-white border-b border-black/[0.09] flex-shrink-0">
        {PAGE_TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSelectedId(null); }}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[12px] font-semibold border-b-2 transition-all cursor-pointer font-sans bg-transparent
              ${activeTab === t.id ? "text-[#4A7C59] border-[#4A7C59]" : "text-[#8A9BB0] border-transparent hover:text-[#0D1117]"}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {activeTab === "staff" && (
          <div className={`flex flex-col overflow-hidden border-r border-black/[0.09] transition-all ${selectedId ? "flex-1 min-w-0" : "flex-1"}`}>
            <div className="flex gap-px bg-black/[0.09] border-b border-black/[0.09] flex-shrink-0">
              {STAT_ITEMS.map(({ val, lbl, highlight }) => (
                <div key={lbl} className="flex-1 bg-white py-3.5 px-4 text-center hover:bg-[#E8F2EB] transition-colors cursor-default">
                  <p className={`font-['DM_Serif_Display'] text-2xl leading-none ${highlight ? "text-[#4A7C59]" : "text-[#0D1117]"}`}>{val}</p>
                  <p className="text-[11px] text-[#8A9BB0] mt-0.5">{lbl}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-black/[0.09] bg-white flex-shrink-0">
              <div className="relative w-48">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8A9BB0] pointer-events-none" />
                <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-7 pr-2.5 py-1.5 text-[12px] font-sans bg-[#F7F4EF] border border-black/[0.09] rounded-lg outline-none text-[#0D1117] placeholder-[#B8C0CC] focus:border-[#4A7C59] focus:bg-white transition-all" />
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {FILTERS.map(f => (
                  <button key={f.val} onClick={() => setActiveFilter(f.val)}
                    className={`px-2.5 py-1 text-[11px] font-semibold border rounded-md cursor-pointer whitespace-nowrap transition-all font-sans
                      ${activeFilter === f.val ? "bg-[#4A7C59] text-white border-[#4A7C59]" : "bg-transparent text-[#8A9BB0] border-black/[0.09] hover:border-[#4A7C59] hover:text-[#2F5C3A]"}`}>
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex items-center gap-4">
                <button onClick={() => handleSort("role")} className={`hidden md:flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.06em] cursor-pointer bg-transparent border-none p-0 font-sans ${sortKey === "role" ? "text-[#4A7C59]" : "text-[#8A9BB0] hover:text-[#0D1117]"} transition-colors`}>
                  Role <SortIcon k="role" />
                </button>
                <button onClick={() => handleSort("department")} className={`hidden sm:flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.06em] cursor-pointer bg-transparent border-none p-0 font-sans ${sortKey === "department" ? "text-[#4A7C59]" : "text-[#8A9BB0] hover:text-[#0D1117]"} transition-colors`}>
                  Dept <SortIcon k="department" />
                </button>
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#8A9BB0] w-[70px] text-right">Status</span>
                <button onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-lg hover:bg-[#2F5C3A] hover:shadow-[0_4px_14px_rgba(47,92,58,0.25)] transition-all border-none cursor-pointer font-sans">
                  <UserPlus size={13} />Invite Staff
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="text-center py-16 px-6 text-[#8A9BB0]">
                  <SearchX size={40} className="mx-auto opacity-30 mb-2" />
                  <p className="text-[14px]">No staff found matching your search.</p>
                </div>
              ) : (
                filtered.map((s, i) => (
                  <div key={s.id} onClick={() => handleSelectStaff(s.id)}
                    className={`grid gap-2 px-4 py-3 border-b border-black/[0.05] cursor-pointer transition-colors items-center
                      ${s.id === selectedId ? "bg-[#E8F2EB]" : "hover:bg-[rgba(247,244,239,0.8)]"}`}
                    style={{ gridTemplateColumns: "36px 1fr 110px 90px 70px", animationDelay: `${i * 0.018}s` }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0" style={{ background: s.color }}>
                      {initials(s.name)}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#0D1117] leading-tight">{s.name}</p>
                      <p className="text-[11px] text-[#8A9BB0] mt-0.5">S-{s.id} · {s.specialty} · {s.yearsExp}yr exp</p>
                    </div>
                    <div className="hidden md:block">
                      <Badge text={s.role} cls={roleBadgeClass[s.role] || "bg-[#E8F2EB] text-[#2F5C3A]"} />
                    </div>
                    <p className="hidden sm:block text-[12px] text-[#8A9BB0]">{s.department.split(" ")[0]}</p>
                    <div className="flex justify-end">
                      <Badge text={s.status} cls={statusBadgeClass[s.status]} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "staff_invites" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <StaffInvitationsTab
              clinicId={selectedClinic?.id}
              branchId={selectedClinic?.branchId}
              onInvite={() => setShowInviteModal(true)}
            />
          </div>
        )}

        {selectedStaff && activeTab === "staff" && (
          <>
            <div className="fixed inset-0 bg-[#0D1117]/45 backdrop-blur-sm z-[55] xl:hidden" onClick={closeDetail} />
            <div className="w-[380px] flex-shrink-0 overflow-hidden border-l border-black/[0.09] fixed xl:relative right-0 top-0 bottom-0 z-[60] xl:z-auto shadow-[-4px_0_32px_rgba(13,17,23,0.12)] xl:shadow-none">
              <StaffDetailPanel
                staff={selectedStaff}
                onClose={closeDetail}
                onEdit={openEdit}
                onToggleLeave={handleToggleLeave}
                onToggleActive={handleToggleActive}
              />
            </div>
          </>
        )}
      </div>

      {showEditModal && (
        <StaffModal
          editStaff={editId ? staffList.find(s => s.id === editId) : null}
          onClose={() => { setShowEditModal(false); setEditId(null); }}
          onSave={handleSave}
        />
      )}

      {showInviteModal && (
        <InviteStaffModal
          onClose={() => setShowInviteModal(false)}
          clinicId={selectedClinic?.id}
          branchId={selectedClinic?.branchId}
        />
      )}
    </div>
  );
}