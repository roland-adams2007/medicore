import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft, User, Phone, Briefcase, ShieldCheck,
    AlertCircle, Loader2, ChevronRight, Check,
    HeartPulse, FileText, XCircle, Image as ImageIcon,
    Shield, Eye, Lock, Plus, X,
} from "lucide-react";
import { useStaffStore, useClinicStore, useRolestore } from "../../store/store";
import FilePickerModal from "../ui/modals/FilePickerModal";
import ImagePreview from "../ui/file-manager/ImagePreview";
import { useAuth } from "../../context/Auth/UseAuth";
import { canEdit, getAssignableRoles } from "../../utils/roleHierarchy";

const EMPLOYMENT_TYPES = ["full_time", "part_time", "contract", "locum"];
const GENDERS = ["male", "female", "other"];
const SALARY_FREQUENCIES = ["monthly", "weekly", "daily", "hourly"];
const STAFF_STATUSES = ["active", "suspended", "terminated", "resigned"];
const SECTIONS = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "employment", label: "Employment", icon: Briefcase },
    { id: "medical", label: "Professional", icon: HeartPulse },
    { id: "emergency", label: "Emergency Contact", icon: ShieldCheck },
    { id: "notes", label: "Notes", icon: FileText },
];

const inputCls = "w-full px-3 py-2.5 text-[13px] font-['DM_Sans'] bg-[#F7F4EF] border-[1.5px] border-black/[0.09] rounded-xl outline-none text-[#0D1117] focus:border-[#4A7C59] focus:shadow-[0_0_0_3px_rgba(74,124,89,0.08)] focus:bg-white transition-all placeholder-[#B8C0CC] appearance-none disabled:opacity-50 disabled:cursor-not-allowed";
const labelCls = "block text-[10px] font-bold uppercase tracking-[0.07em] text-[#8A9BB0] mb-1.5";

function Field({ label, children, span = 1 }) {
    return (
        <div className={span === 2 ? "col-span-2" : ""}>
            <label className={labelCls}>{label}</label>
            {children}
        </div>
    );
}

function SectionCard({ title, icon: Icon, children, active, onClick, completed }) {
    return (
        <div className={`rounded-2xl border transition-all ${active ? "border-[#4A7C59] shadow-[0_0_0_3px_rgba(74,124,89,0.08)]" : "border-black/[0.09]"} bg-white overflow-hidden`}>
            <button onClick={onClick} className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer bg-transparent border-none">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${active ? "bg-[#4A7C59] text-white" : completed ? "bg-[#E8F2EB] text-[#4A7C59]" : "bg-[#F7F4EF] text-[#8A9BB0]"}`}>
                    {completed && !active ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <span className={`text-[13px] font-semibold flex-1 font-['DM_Sans'] ${active ? "text-[#4A7C59]" : "text-[#0D1117]"}`}>{title}</span>
                <ChevronRight size={14} className={`text-[#8A9BB0] transition-transform ${active ? "rotate-90" : ""}`} />
            </button>
            {active && (
                <div className="px-5 pb-5 border-t border-black/[0.06]">
                    <div className="pt-4">{children}</div>
                </div>
            )}
        </div>
    );
}

function DepartmentSelect({ clinicId, branchId, selectedDepartments, onChange }) {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!clinicId || !branchId) return;
        setLoading(true);
        import("../../api/axiosInstance").then(({ default: axiosInstance }) => {
            axiosInstance.get(`/clinics/${clinicId}/branches/${branchId}/departments`)
                .then(res => setDepartments(res.data?.data?.departments || []))
                .catch(() => setDepartments([]))
                .finally(() => setLoading(false));
        });
    }, [clinicId, branchId]);

    const toggle = (dept) => {
        const exists = selectedDepartments.find(d => d.id === dept.id);
        onChange(exists ? selectedDepartments.filter(d => d.id !== dept.id) : [...selectedDepartments, dept]);
    };

    if (loading) return <div className="text-[12px] text-[#8A9BB0]">Loading departments…</div>;
    if (!departments.length) return <div className="text-[12px] text-[#B8C0CC]">No departments available for this branch.</div>;

    return (
        <div className="flex flex-wrap gap-2">
            {departments.map(dept => {
                const selected = selectedDepartments.find(d => d.id === dept.id);
                return (
                    <button key={dept.id} type="button" onClick={() => toggle(dept)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-xl border transition-all cursor-pointer font-['DM_Sans'] ${selected ? "bg-[#4A7C59] text-white border-[#4A7C59]" : "bg-[#F7F4EF] text-[#8A9BB0] border-black/[0.09] hover:border-[#4A7C59]/40 hover:text-[#4A7C59]"
                            }`}>
                        {selected ? <Check size={11} /> : <Plus size={11} />}
                        {dept.name}
                    </button>
                );
            })}
        </div>
    );
}

function toInputDate(val) {
    if (!val) return "";
    const d = new Date(val);
    return isNaN(d) ? "" : d.toISOString().slice(0, 10);
}

function initials(fname, lname) {
    return `${(fname?.[0] || "").toUpperCase()}${(lname?.[0] || "").toUpperCase()}`;
}

const EMPTY_FORM = {
    phone: "", alt_phone: "", gender: "", date_of_birth: "",
    profile_photo_url: "", address: "", city: "", state_id: "",
    date_joined: "", date_left: "", employment_type: "full_time",
    salary: "", salary_frequency: "monthly", specialization: "",
    license_number: "", license_expiry: "", qualification: "",
    emergency_contact_name: "", emergency_contact_phone: "",
    emergency_contact_relationship: "", notes: "", status: "active",
    new_role_id: "",
};

export default function StaffEdit() {
    const { staffId } = useParams();
    const navigate = useNavigate();
    const { selectedClinic } = useClinicStore();
    const { user } = useAuth();
    const { getStaffProfileForEdit, updateStaffProfile } = useStaffStore();
    const { roles, loading: rolesLoading, fetchRoles } = useRolestore();

    const [profile, setProfile] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [isHierarchyBlocked, setIsHierarchyBlocked] = useState(false);

    const [activeSection, setActiveSection] = useState("personal");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    const [completedSections, setCompletedSections] = useState(new Set());
    const [showFilePicker, setShowFilePicker] = useState(false);
    const [showPhotoViewer, setShowPhotoViewer] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [selectedDepartments, setSelectedDepartments] = useState([]);

    const currentUserId = user?.id;
    // ── Role comes from the clinic, NOT user object ───────────────
    const currentUserRole = selectedClinic?.role ?? null;

    useEffect(() => { fetchRoles(); }, []);

    useEffect(() => {
        if (!staffId || !selectedClinic?.id) return;
        setFetchLoading(true);
        setFetchError(null);
        setIsOwnProfile(false);
        setIsHierarchyBlocked(false);

        getStaffProfileForEdit(selectedClinic.id, selectedClinic.branchId, staffId)
            .then((data) => {
                setProfile(data);

                // Block: editing own profile
                if (currentUserId && data?.user_id && String(data.user_id) === String(currentUserId)) {
                    setIsOwnProfile(true);
                    setFetchLoading(false);
                    return;
                }

                // Block: viewer doesn't outrank the target
                const allowed = canEdit({
                    viewerRoleName: currentUserRole,
                    targetRoleName: data.role_name,
                    viewerLevel: undefined,
                    targetLevel: data.role_level ?? undefined,
                    roles: roles
                });


                if (!allowed) {
                    setIsHierarchyBlocked(true);
                    setFetchLoading(false);
                    return;
                }

                setForm({
                    phone: data.phone || "",
                    alt_phone: data.alt_phone || "",
                    gender: data.gender || "",
                    date_of_birth: toInputDate(data.date_of_birth),
                    profile_photo_url: data.profile_photo_url || "",
                    address: data.address || "",
                    city: data.city || "",
                    state_id: data.state_id ? String(data.state_id) : "",
                    date_joined: toInputDate(data.date_joined),
                    date_left: toInputDate(data.date_left),
                    employment_type: data.employment_type || "full_time",
                    salary: data.salary ? String(data.salary) : "",
                    salary_frequency: data.salary_frequency || "monthly",
                    specialization: data.specialization || "",
                    license_number: data.license_number || "",
                    license_expiry: toInputDate(data.license_expiry),
                    qualification: data.qualification || "",
                    emergency_contact_name: data.emergency_contact_name || "",
                    emergency_contact_phone: data.emergency_contact_phone || "",
                    emergency_contact_relationship: data.emergency_contact_relationship || "",
                    notes: data.notes || "",
                    status: data.status || "active",
                    new_role_id: data.role_id ? String(data.role_id) : "",
                });
                if (data.departments && Array.isArray(data.departments)) {
                    setSelectedDepartments(data.departments.filter(Boolean));
                }
                setCompletedSections(new Set(SECTIONS.map(s => s.id)));
                setFetchLoading(false);
            })
            .catch((err) => {
                setFetchError(err?.response?.data?.message || err?.message || "Failed to load staff profile.");
                setFetchLoading(false);
            });
    }, [staffId, selectedClinic?.id]);

    const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
    const markComplete = (sectionId) => setCompletedSections(prev => new Set([...prev, sectionId]));

    const handleSectionNext = (currentId, nextId) => {
        markComplete(currentId);
        setActiveSection(nextId);
        setTimeout(() => document.getElementById(`section-${nextId}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    };

    const handleSubmit = async () => {
        setSaving(true);
        setError(null);
        try {
            await updateStaffProfile(selectedClinic.id, selectedClinic.branchId, staffId, {
                ...form,
                salary: form.salary ? parseFloat(form.salary) : null,
                state_id: form.state_id ? parseInt(form.state_id, 10) : null,
                new_role_id: form.new_role_id ? parseInt(form.new_role_id, 10) : null,
                department_ids: selectedDepartments.map(d => d.id),
            });
            setSaved(true);
            setTimeout(() => navigate("/dashboard/staff"), 1800);
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    // ── Roles the current viewer can assign (uses clinic roles array) ──
    const assignableRoles = getAssignableRoles(roles, currentUserRole, profile?.role_id);

    /* ─── Guard screens ─────────────────────────────────────────── */
    if (fetchLoading) return (
        <div className="min-h-screen bg-[#F7F4EF] font-['DM_Sans'] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-[#8A9BB0]">
                <Loader2 size={28} className="animate-spin" />
                <p className="text-[13px]">Loading staff profile…</p>
            </div>
        </div>
    );

    if (isOwnProfile) return (
        <div className="min-h-screen bg-[#F7F4EF] font-['DM_Sans'] flex items-center justify-center p-6">
            <div className="text-center max-w-sm">
                <div className="w-14 h-14 rounded-2xl bg-[#FBF6E9] flex items-center justify-center mx-auto mb-4">
                    <Lock size={24} className="text-[#C9A84C]" />
                </div>
                <p className="font-['DM_Serif_Display'] text-[20px] text-[#0D1117] mb-1">You can't edit your own profile</p>
                <p className="text-[13px] text-[#8A9BB0] mb-5">Staff profiles must be edited by a higher-level administrator.</p>
                <Link to="/dashboard/staff" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F7F4EF] text-[#8A9BB0] text-[12px] font-semibold rounded-xl no-underline hover:bg-[#EEF2F7] transition-all border border-black/[0.09]">
                    <ArrowLeft size={13} />Back to staff
                </Link>
            </div>
        </div>
    );

    if (isHierarchyBlocked) return (
        <div className="min-h-screen bg-[#F7F4EF] font-['DM_Sans'] flex items-center justify-center p-6">
            <div className="text-center max-w-sm">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF0ED] flex items-center justify-center mx-auto mb-4">
                    <Shield size={24} className="text-[#E8927C]" />
                </div>
                <p className="font-['DM_Serif_Display'] text-[20px] text-[#0D1117] mb-1">Permission denied</p>
                <p className="text-[13px] text-[#8A9BB0] mb-5">You can only edit staff with a lower role than yours. Contact a higher-level administrator.</p>
                <Link to="/dashboard/staff" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F7F4EF] text-[#8A9BB0] text-[12px] font-semibold rounded-xl no-underline hover:bg-[#EEF2F7] transition-all border border-black/[0.09]">
                    <ArrowLeft size={13} />Back to staff
                </Link>
            </div>
        </div>
    );

    if (fetchError || !profile) return (
        <div className="min-h-screen bg-[#F7F4EF] font-['DM_Sans'] flex items-center justify-center p-6">
            <div className="text-center max-w-sm">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF0ED] flex items-center justify-center mx-auto mb-4">
                    <XCircle size={24} className="text-[#E8927C]" />
                </div>
                <p className="font-['DM_Serif_Display'] text-[20px] text-[#0D1117] mb-1">Profile not found</p>
                <p className="text-[13px] text-[#8A9BB0] mb-5">{fetchError || "This staff profile does not exist or you don't have access."}</p>
                <Link to="/dashboard/staff" className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl no-underline hover:bg-[#2F5C3A] transition-all">
                    <ArrowLeft size={13} />Back to staff
                </Link>
            </div>
        </div>
    );

    if (saved) return (
        <div className="min-h-screen bg-[#F7F4EF] font-['DM_Sans'] flex items-center justify-center p-6">
            <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#E8F2EB] flex items-center justify-center mx-auto mb-4 animate-[popIn_0.3s_ease]">
                    <style>{`@keyframes popIn{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}`}</style>
                    <Check size={28} className="text-[#4A7C59]" />
                </div>
                <p className="font-['DM_Serif_Display'] text-[22px] text-[#0D1117] mb-1">Profile updated!</p>
                <p className="text-[13px] text-[#8A9BB0]">Redirecting back to staff…</p>
            </div>
        </div>
    );

    /* ─── Main edit form ────────────────────────────────────────── */
    return (
        <div className="min-h-screen bg-[#F7F4EF] font-['DM_Sans'] text-[#0D1117]">
            <div className="sticky top-0 z-20 bg-white border-b border-black/[0.09] px-6 py-4 flex items-center gap-4">
                <Link to="/dashboard/staff" className="w-8 h-8 flex items-center justify-center bg-[#F7F4EF] rounded-xl text-[#8A9BB0] hover:bg-[#E8F2EB] hover:text-[#4A7C59] transition-all no-underline">
                    <ArrowLeft size={15} />
                </Link>
                <div className="flex-1 min-w-0">
                    <h1 className="font-['DM_Serif_Display'] text-[18px] text-[#0D1117] leading-tight">Edit Staff Profile</h1>
                    <p className="text-[11px] text-[#8A9BB0] mt-0.5 truncate">
                        {profile.fname} {profile.lname} · <span className="font-semibold text-[#4A7C59]">{profile.role_name}</span>
                        {profile.branch_name && <> · {profile.branch_name}</>}
                        {profile.staff_id && <> · <span className="font-mono">{profile.staff_id}</span></>}
                    </p>
                </div>
                <button onClick={handleSubmit} disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl hover:bg-[#2F5C3A] transition-all border-none cursor-pointer font-['DM_Sans'] disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0">
                    {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                    {saving ? "Saving…" : "Save changes"}
                </button>
            </div>

            <div className="max-w-[720px] mx-auto px-4 py-6 space-y-3">
                {/* Profile header card */}
                <div className="bg-white rounded-2xl border border-black/[0.09] p-4 flex items-center gap-4 mb-2">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-black/[0.09] cursor-pointer relative group"
                        onClick={() => form.profile_photo_url && setShowPhotoViewer(true)}>
                        {form.profile_photo_url ? (
                            <>
                                <img src={form.profile_photo_url} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Eye size={14} className="text-white" /></div>
                            </>
                        ) : (
                            <div className="w-full h-full bg-[#E8F2EB] flex items-center justify-center text-[#4A7C59] text-[16px] font-bold">{initials(profile.fname, profile.lname)}</div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-[#0D1117]">{profile.fname} {profile.lname}</p>
                        <p className="text-[11px] text-[#8A9BB0] mt-0.5">{profile.email}</p>
                        {profile.staff_id && <p className="text-[10px] font-mono text-[#B8C0CC] mt-0.5">{profile.staff_id}</p>}
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${form.status === "active" ? "bg-[#E8F2EB] text-[#2F5C3A]" :
                        form.status === "suspended" ? "bg-[#FBF6E9] text-[#8b6a1a]" :
                            form.status === "terminated" ? "bg-[#FAF0ED] text-[#c05c3c]" :
                                "bg-[#EEF2F7] text-[#4a6580]"
                        }`}>{form.status}</span>
                </div>

                {error && (
                    <div className="flex items-center gap-2.5 px-4 py-3 bg-[#FAF0ED] border border-[#E8927C]/30 rounded-xl text-[13px] text-[#c05c3c]">
                        <AlertCircle size={15} className="flex-shrink-0" />{error}
                    </div>
                )}

                {/* ── Personal Info ── */}
                <div id="section-personal">
                    <SectionCard title="Personal Info" icon={User} active={activeSection === "personal"} completed={completedSections.has("personal")} onClick={() => setActiveSection("personal")}>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Gender">
                                <select className={inputCls} value={form.gender} onChange={set("gender")}>
                                    <option value="">Select gender</option>
                                    {GENDERS.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
                                </select>
                            </Field>
                            <Field label="Date of Birth">
                                <input type="date" className={inputCls} value={form.date_of_birth} onChange={set("date_of_birth")} />
                            </Field>
                            <Field label="Status">
                                <select className={inputCls} value={form.status} onChange={set("status")}>
                                    {STAFF_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </select>
                            </Field>
                            <Field label="Profile Photo">
                                <div className="flex items-center gap-2">
                                    {form.profile_photo_url ? (
                                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-black/[0.09] flex-shrink-0 cursor-pointer relative group" onClick={() => setShowPhotoViewer(true)}>
                                            <img src={form.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Eye size={11} className="text-white" /></div>
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-xl bg-[#F7F4EF] border border-black/[0.09] flex items-center justify-center flex-shrink-0"><User size={16} className="text-[#8A9BB0]" /></div>
                                    )}
                                    <button type="button" onClick={() => setShowFilePicker(true)}
                                        className="flex-1 flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-semibold text-[#4A7C59] bg-[#E8F2EB] border border-[#4A7C59]/20 rounded-xl hover:bg-[#4A7C59] hover:text-white transition-all cursor-pointer font-['DM_Sans']">
                                        <ImageIcon size={13} />{form.profile_photo_url ? "Change photo" : "Select photo"}
                                    </button>
                                </div>
                            </Field>

                            <Field label="Change Role" span={2}>
                                <div className="flex items-start gap-2">
                                    <Shield size={13} className="text-[#8A9BB0] flex-shrink-0 mt-3" />
                                    <div className="flex-1">
                                        <select className={inputCls} value={form.new_role_id} onChange={set("new_role_id")} disabled={rolesLoading}>
                                            <option value="">Keep current role ({profile.role_name})</option>
                                            {assignableRoles.map(r => (
                                                <option key={r.id} value={String(r.id)}>{r.name}</option>
                                            ))}
                                        </select>
                                        <p className="text-[10px] text-[#B8C0CC] mt-1.5">Role hierarchy is enforced — you can only assign roles below your own.</p>
                                    </div>
                                </div>
                            </Field>

                            <Field label="Departments" span={2}>
                                <DepartmentSelect
                                    clinicId={selectedClinic?.id}
                                    branchId={selectedClinic?.branchId || profile?.branch_id}
                                    selectedDepartments={selectedDepartments}
                                    onChange={setSelectedDepartments}
                                />
                                {selectedDepartments.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {selectedDepartments.map(d => (
                                            <span key={d.id} className="flex items-center gap-1 text-[11px] px-2 py-1 bg-[#E8F2EB] text-[#2F5C3A] rounded-lg font-semibold">
                                                {d.name}
                                                <button type="button" onClick={() => setSelectedDepartments(prev => prev.filter(p => p.id !== d.id))}
                                                    className="ml-0.5 bg-transparent border-none cursor-pointer text-[#4A7C59] hover:text-[#c05c3c] transition-colors p-0">
                                                    <X size={10} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button onClick={() => handleSectionNext("personal", "contact")}
                                className="flex items-center gap-1.5 px-4 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl border-none cursor-pointer hover:bg-[#2F5C3A] transition-all font-['DM_Sans']">
                                Next <ChevronRight size={13} />
                            </button>
                        </div>
                    </SectionCard>
                </div>

                {/* ── Contact ── */}
                <div id="section-contact">
                    <SectionCard title="Contact" icon={Phone} active={activeSection === "contact"} completed={completedSections.has("contact")} onClick={() => setActiveSection("contact")}>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Phone"><input className={inputCls} placeholder="08012345678" value={form.phone} onChange={set("phone")} /></Field>
                            <Field label="Alt. Phone"><input className={inputCls} placeholder="08012345678" value={form.alt_phone} onChange={set("alt_phone")} /></Field>
                            <Field label="City"><input className={inputCls} placeholder="Lagos" value={form.city} onChange={set("city")} /></Field>
                            <Field label="State"><input className={inputCls} placeholder="State" value={form.state_id} onChange={set("state_id")} /></Field>
                            <Field label="Address" span={2}>
                                <textarea className={inputCls + " resize-none h-20"} placeholder="Full address…" value={form.address} onChange={set("address")} />
                            </Field>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button onClick={() => setActiveSection("personal")} className="text-[12px] font-semibold text-[#8A9BB0] bg-transparent border-none cursor-pointer hover:text-[#0D1117] transition-colors font-['DM_Sans']">Back</button>
                            <button onClick={() => handleSectionNext("contact", "employment")}
                                className="flex items-center gap-1.5 px-4 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl border-none cursor-pointer hover:bg-[#2F5C3A] transition-all font-['DM_Sans']">
                                Next <ChevronRight size={13} />
                            </button>
                        </div>
                    </SectionCard>
                </div>

                {/* ── Employment ── */}
                <div id="section-employment">
                    <SectionCard title="Employment" icon={Briefcase} active={activeSection === "employment"} completed={completedSections.has("employment")} onClick={() => setActiveSection("employment")}>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Employment Type">
                                <select className={inputCls} value={form.employment_type} onChange={set("employment_type")}>
                                    {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                                </select>
                            </Field>
                            <Field label="Date Joined"><input type="date" className={inputCls} value={form.date_joined} onChange={set("date_joined")} /></Field>
                            <Field label="Salary">
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9BB0] text-[13px] font-semibold pointer-events-none">₦</span>
                                    <input type="number" className={inputCls + " pl-7"} placeholder="0.00" value={form.salary} onChange={set("salary")} />
                                </div>
                            </Field>
                            <Field label="Salary Frequency">
                                <select className={inputCls} value={form.salary_frequency} onChange={set("salary_frequency")}>
                                    {SALARY_FREQUENCIES.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
                                </select>
                            </Field>
                            <Field label="Date Left (if applicable)" span={2}>
                                <input type="date" className={inputCls} value={form.date_left} onChange={set("date_left")} />
                            </Field>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button onClick={() => setActiveSection("contact")} className="text-[12px] font-semibold text-[#8A9BB0] bg-transparent border-none cursor-pointer hover:text-[#0D1117] transition-colors font-['DM_Sans']">Back</button>
                            <button onClick={() => handleSectionNext("employment", "medical")}
                                className="flex items-center gap-1.5 px-4 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl border-none cursor-pointer hover:bg-[#2F5C3A] transition-all font-['DM_Sans']">
                                Next <ChevronRight size={13} />
                            </button>
                        </div>
                    </SectionCard>
                </div>

                {/* ── Professional ── */}
                <div id="section-medical">
                    <SectionCard title="Professional" icon={HeartPulse} active={activeSection === "medical"} completed={completedSections.has("medical")} onClick={() => setActiveSection("medical")}>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Specialization"><input className={inputCls} placeholder="e.g. Cardiology" value={form.specialization} onChange={set("specialization")} /></Field>
                            <Field label="Qualification"><input className={inputCls} placeholder="e.g. MBBS, RN" value={form.qualification} onChange={set("qualification")} /></Field>
                            <Field label="License Number"><input className={inputCls} placeholder="MDC-123456" value={form.license_number} onChange={set("license_number")} /></Field>
                            <Field label="License Expiry"><input type="date" className={inputCls} value={form.license_expiry} onChange={set("license_expiry")} /></Field>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button onClick={() => setActiveSection("employment")} className="text-[12px] font-semibold text-[#8A9BB0] bg-transparent border-none cursor-pointer hover:text-[#0D1117] transition-colors font-['DM_Sans']">Back</button>
                            <button onClick={() => handleSectionNext("medical", "emergency")}
                                className="flex items-center gap-1.5 px-4 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl border-none cursor-pointer hover:bg-[#2F5C3A] transition-all font-['DM_Sans']">
                                Next <ChevronRight size={13} />
                            </button>
                        </div>
                    </SectionCard>
                </div>

                {/* ── Emergency Contact ── */}
                <div id="section-emergency">
                    <SectionCard title="Emergency Contact" icon={ShieldCheck} active={activeSection === "emergency"} completed={completedSections.has("emergency")} onClick={() => setActiveSection("emergency")}>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Contact Name"><input className={inputCls} placeholder="Full name" value={form.emergency_contact_name} onChange={set("emergency_contact_name")} /></Field>
                            <Field label="Relationship"><input className={inputCls} placeholder="e.g. Spouse, Parent" value={form.emergency_contact_relationship} onChange={set("emergency_contact_relationship")} /></Field>
                            <Field label="Contact Phone" span={2}><input className={inputCls} placeholder="08012345678" value={form.emergency_contact_phone} onChange={set("emergency_contact_phone")} /></Field>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button onClick={() => setActiveSection("medical")} className="text-[12px] font-semibold text-[#8A9BB0] bg-transparent border-none cursor-pointer hover:text-[#0D1117] transition-colors font-['DM_Sans']">Back</button>
                            <button onClick={() => handleSectionNext("emergency", "notes")}
                                className="flex items-center gap-1.5 px-4 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl border-none cursor-pointer hover:bg-[#2F5C3A] transition-all font-['DM_Sans']">
                                Next <ChevronRight size={13} />
                            </button>
                        </div>
                    </SectionCard>
                </div>

                {/* ── Notes ── */}
                <div id="section-notes">
                    <SectionCard title="Notes" icon={FileText} active={activeSection === "notes"} completed={completedSections.has("notes")} onClick={() => setActiveSection("notes")}>
                        <Field label="Internal Notes">
                            <textarea className={inputCls + " resize-none h-28"} placeholder="Any additional notes about this staff member…" value={form.notes} onChange={set("notes")} />
                        </Field>
                        <div className="mt-4 flex justify-between">
                            <button onClick={() => setActiveSection("emergency")} className="text-[12px] font-semibold text-[#8A9BB0] bg-transparent border-none cursor-pointer hover:text-[#0D1117] transition-colors font-['DM_Sans']">Back</button>
                            <button onClick={() => { markComplete("notes"); handleSubmit(); }} disabled={saving}
                                className="flex items-center gap-2 px-5 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl border-none cursor-pointer hover:bg-[#2F5C3A] transition-all font-['DM_Sans'] disabled:opacity-60">
                                {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                                {saving ? "Saving…" : "Save changes"}
                            </button>
                        </div>
                    </SectionCard>
                </div>

                <p className="text-center text-[11px] text-[#B8C0CC] py-2">
                    Staff Profile #{staffId} · Role changes are enforced by hierarchy.
                </p>
            </div>

            <FilePickerModal
                isOpen={showFilePicker}
                onClose={() => setShowFilePicker(false)}
                clinicId={selectedClinic?.id}
                allowedTypes={["image"]}
                onSelectFile={(file) => { setForm(f => ({ ...f, profile_photo_url: file.file_url })); setShowFilePicker(false); }}
            />

            {showPhotoViewer && form.profile_photo_url && (
                <ImagePreview
                    isOpen={showPhotoViewer}
                    onClose={() => setShowPhotoViewer(false)}
                    asset={{ file_url: form.profile_photo_url, mime_type: "image/jpeg", file_original_name: `${profile.fname} ${profile.lname}`, fname: profile.fname, lname: profile.lname }}
                />
            )}
        </div>
    );
}