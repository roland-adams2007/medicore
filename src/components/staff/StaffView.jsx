import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft, User, Phone, Briefcase, ShieldCheck,
    FileText, Loader2, HeartPulse,
    XCircle, Edit2, Mail, Calendar, Building2,
    Hash, CreditCard, MapPin, Users, LayoutGrid,
} from "lucide-react";
import { useStaffStore, useClinicStore } from "../../store/store";
import ImagePreview from "../ui/file-manager/ImagePreview";
import { useAuth } from "../../context/Auth/UseAuth";

function initials(fname, lname) {
    return `${(fname?.[0] || "").toUpperCase()}${(lname?.[0] || "").toUpperCase()}`;
}

function fmtDate(val) {
    if (!val) return "—";
    const d = new Date(val);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function StatusBadge({ status }) {
    const map = {
        active: "bg-[#E8F2EB] text-[#2F5C3A]",
        suspended: "bg-[#FBF6E9] text-[#8b6a1a]",
        terminated: "bg-[#FAF0ED] text-[#c05c3c]",
        resigned: "bg-[#EEF2F7] text-[#4a6580]",
    };
    return (
        <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${map[status] || "bg-[#EEF2F7] text-[#4a6580]"}`}>
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : "—"}
        </span>
    );
}

function InfoRow({ label, value, icon: Icon }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-black/[0.05] last:border-0">
            {Icon && <Icon size={14} className="text-[#8A9BB0] mt-0.5 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.07em] text-[#B8C0CC] mb-0.5">{label}</p>
                <p className="text-[13px] text-[#0D1117] font-medium break-words">{value || "—"}</p>
            </div>
        </div>
    );
}

function SectionCard({ title, icon: Icon, children }) {
    return (
        <div className="bg-white rounded-2xl border border-black/[0.09] overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-black/[0.06]">
                <div className="w-8 h-8 rounded-xl bg-[#E8F2EB] flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-[#4A7C59]" />
                </div>
                <span className="text-[13px] font-semibold text-[#0D1117] font-['DM_Sans']">{title}</span>
            </div>
            <div className="px-5 py-2">{children}</div>
        </div>
    );
}

export default function StaffView() {
    const { staffId } = useParams();
    const navigate = useNavigate();
    const { selectedClinic } = useClinicStore();
    const { user } = useAuth();
    const { getStaffProfileForEdit } = useStaffStore();

    const [profile, setProfile] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [showPhotoViewer, setShowPhotoViewer] = useState(false);

    const currentUserId = user?.id;
    const isOwnProfile = profile && currentUserId && String(profile.user_id) === String(currentUserId);

    useEffect(() => {
        if (!staffId || !selectedClinic?.id) return;
        setFetchLoading(true);
        setFetchError(null);
        getStaffProfileForEdit(selectedClinic.id, selectedClinic.branchId, staffId)
            .then((data) => {
                setProfile(data);
                setFetchLoading(false);
            })
            .catch((err) => {
                setFetchError(err?.response?.data?.message || err?.message || "Failed to load staff profile.");
                setFetchLoading(false);
            });
    }, [staffId, selectedClinic?.id]);

    if (fetchLoading) {
        return (
            <div className="min-h-screen bg-[#F7F4EF] font-['DM_Sans'] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-[#8A9BB0]">
                    <Loader2 size={28} className="animate-spin" />
                    <p className="text-[13px]">Loading staff profile…</p>
                </div>
            </div>
        );
    }

    if (fetchError || !profile) {
        return (
            <div className="min-h-screen bg-[#F7F4EF] font-['DM_Sans'] flex items-center justify-center p-6">
                <div className="text-center max-w-sm">
                    <div className="w-14 h-14 rounded-2xl bg-[#FAF0ED] flex items-center justify-center mx-auto mb-4">
                        <XCircle size={24} className="text-[#E8927C]" />
                    </div>
                    <p className="font-['DM_Serif_Display'] text-[20px] text-[#0D1117] mb-1">Profile not found</p>
                    <p className="text-[13px] text-[#8A9BB0] mb-5">{fetchError || "This staff profile does not exist."}</p>
                    <Link to="/dashboard/staff" className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl no-underline hover:bg-[#2F5C3A] transition-all">
                        <ArrowLeft size={13} />Back to staff
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F4EF] font-['DM_Sans'] text-[#0D1117]">
            <div className="sticky top-0 z-20 bg-white border-b border-black/[0.09] px-6 py-4 flex items-center gap-4">
                <Link to="/dashboard/staff"
                    className="w-8 h-8 flex items-center justify-center bg-[#F7F4EF] rounded-xl text-[#8A9BB0] hover:bg-[#E8F2EB] hover:text-[#4A7C59] transition-all no-underline">
                    <ArrowLeft size={15} />
                </Link>
                <div className="flex-1 min-w-0">
                    <h1 className="font-['DM_Serif_Display'] text-[18px] text-[#0D1117] leading-tight">Staff Profile</h1>
                    <p className="text-[11px] text-[#8A9BB0] mt-0.5 truncate">
                        {profile.fname} {profile.lname} · <span className="font-semibold text-[#4A7C59]">{profile.role_name || "—"}</span>
                        {profile.branch_name && <> · {profile.branch_name}</>}
                    </p>
                </div>
                {!isOwnProfile && (
                    <Link
                        to={`/dashboard/staff/edit/${staffId}`}
                        className="flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl hover:bg-[#2F5C3A] transition-all no-underline flex-shrink-0"
                    >
                        <Edit2 size={13} />Edit Profile
                    </Link>
                )}
            </div>

            <div className="max-w-[720px] mx-auto px-4 py-6 space-y-4">
                <div className="bg-white rounded-2xl border border-black/[0.09] p-5">
                    <div className="flex items-start gap-4">
                        <div
                            className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-black/[0.09] cursor-pointer relative group"
                            onClick={() => profile.profile_photo_url && setShowPhotoViewer(true)}
                        >
                            {profile.profile_photo_url ? (
                                <>
                                    <img src={profile.profile_photo_url} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <User size={16} className="text-white" />
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full bg-[#E8F2EB] flex items-center justify-center text-[#4A7C59] text-[20px] font-bold font-['DM_Serif_Display']">
                                    {initials(profile.fname, profile.lname)}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                                <div>
                                    <h2 className="font-['DM_Serif_Display'] text-[22px] text-[#0D1117] leading-tight">
                                        {profile.fname} {profile.lname}
                                    </h2>
                                    <p className="text-[13px] text-[#8A9BB0] mt-0.5">{profile.email}</p>
                                </div>
                                <StatusBadge status={profile.status} />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {profile.role_name && (
                                    <span className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 bg-[#E8F2EB] text-[#2F5C3A] rounded-lg">
                                        <ShieldCheck size={11} />{profile.role_name}
                                    </span>
                                )}
                                {profile.staff_id && (
                                    <span className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 bg-[#F7F4EF] text-[#8A9BB0] rounded-lg">
                                        <Hash size={11} />{profile.staff_id}
                                    </span>
                                )}
                                {profile.branch_name && (
                                    <span className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 bg-[#EEF2F7] text-[#4a6580] rounded-lg">
                                        <Building2 size={11} />{profile.branch_name}
                                    </span>
                                )}
                                {profile.employment_type && (
                                    <span className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 bg-[#FBF6E9] text-[#8b6a1a] rounded-lg">
                                        <Briefcase size={11} />{profile.employment_type.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                                    </span>
                                )}
                                {Array.isArray(profile.departments) && profile.departments.filter(Boolean).map(d => (
                                    <span key={d.id} className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 bg-[#F0EBF8] text-[#6b3fa0] rounded-lg">
                                        <LayoutGrid size={11} />{d.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SectionCard title="Personal Info" icon={User}>
                        <InfoRow label="Gender" value={profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : null} icon={User} />
                        <InfoRow label="Date of Birth" value={fmtDate(profile.date_of_birth)} icon={Calendar} />
                        <InfoRow label="Specialization" value={profile.specialization} icon={HeartPulse} />
                        <InfoRow label="Qualification" value={profile.qualification} icon={FileText} />
                    </SectionCard>

                    <SectionCard title="Contact" icon={Phone}>
                        <InfoRow label="Phone" value={profile.phone} icon={Phone} />
                        <InfoRow label="Alt. Phone" value={profile.alt_phone} icon={Phone} />
                        <InfoRow label="Email" value={profile.email} icon={Mail} />
                        <InfoRow label="City" value={profile.city} icon={MapPin} />
                        <InfoRow label="Address" value={profile.address} icon={MapPin} />
                    </SectionCard>

                    <SectionCard title="Employment" icon={Briefcase}>
                        <InfoRow label="Date Joined" value={fmtDate(profile.date_joined)} icon={Calendar} />
                        <InfoRow label="Date Left" value={fmtDate(profile.date_left)} icon={Calendar} />
                        <InfoRow label="Employment Type" value={profile.employment_type?.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())} icon={Briefcase} />
                        <InfoRow label="Salary Frequency" value={profile.salary_frequency ? profile.salary_frequency.charAt(0).toUpperCase() + profile.salary_frequency.slice(1) : null} icon={CreditCard} />
                        <InfoRow label="Salary" value={profile.salary ? `₦${Number(profile.salary).toLocaleString()}` : null} icon={CreditCard} />
                    </SectionCard>

                    <SectionCard title="Professional" icon={HeartPulse}>
                        <InfoRow label="License Number" value={profile.license_number} icon={Hash} />
                        <InfoRow label="License Expiry" value={fmtDate(profile.license_expiry)} icon={Calendar} />
                        <InfoRow label="Qualification" value={profile.qualification} icon={FileText} />
                    </SectionCard>

                    <SectionCard title="Emergency Contact" icon={ShieldCheck}>
                        <InfoRow label="Name" value={profile.emergency_contact_name} icon={User} />
                        <InfoRow label="Relationship" value={profile.emergency_contact_relationship} icon={Users} />
                        <InfoRow label="Phone" value={profile.emergency_contact_phone} icon={Phone} />
                    </SectionCard>

                    {Array.isArray(profile.departments) && profile.departments.filter(Boolean).length > 0 && (
                        <SectionCard title="Departments" icon={LayoutGrid}>
                            <div className="py-3 flex flex-wrap gap-2">
                                {profile.departments.filter(Boolean).map(d => (
                                    <span
                                        key={d.id}
                                        className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 bg-[#F0EBF8] text-[#6b3fa0] rounded-xl border border-[#6b3fa0]/10"
                                    >
                                        <LayoutGrid size={11} />{d.name}
                                    </span>
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    {profile.notes && (
                        <SectionCard title="Notes" icon={FileText}>
                            <div className="py-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.07em] text-[#B8C0CC] mb-1.5">Internal Notes</p>
                                <p className="text-[13px] text-[#0D1117] whitespace-pre-wrap">{profile.notes}</p>
                            </div>
                        </SectionCard>
                    )}
                </div>

                <p className="text-center text-[11px] text-[#B8C0CC] py-2">
                    Staff Profile #{staffId}
                </p>
            </div>

            {showPhotoViewer && profile.profile_photo_url && (
                <ImagePreview
                    isOpen={showPhotoViewer}
                    onClose={() => setShowPhotoViewer(false)}
                    asset={{
                        file_url: profile.profile_photo_url,
                        file_original_name: `${profile.fname} ${profile.lname}`,
                        mime_type: "image/jpeg",
                        fname: profile.fname,
                        lname: profile.lname,
                    }}
                />
            )}
        </div>
    );
}