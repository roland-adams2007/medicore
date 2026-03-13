import { useState, useEffect } from "react";
import { X, Send, Loader2, ChevronDown, Mail, ShieldCheck } from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";
import { getAssignableRoles } from "../../../utils/roleHierarchy";

/**
 * InviteModal
 *
 * Props:
 *  open            – boolean
 *  onClose         – () => void
 *  clinicId        – string | number
 *  branchId        – string | number  ← uses selectedClinic.branchId directly, no picker
 *  roles           – Role[] from selectedClinic.roles (already scoped to this clinic)
 *  currentUserRole – string  ← selectedClinic.role
 *  onSuccess       – () => void
 *  inputCls        – string
 */
export default function InviteModal({
    open,
    onClose,
    clinicId,
    branchId,
    roles,
    currentUserRole,
    onSuccess,
    inputCls,
}) {
    const [email, setEmail] = useState("");
    const [roleId, setRoleId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const assignableRoles = getAssignableRoles(roles, currentUserRole);

    useEffect(() => {
        if (assignableRoles.length > 0 && !roleId) {
            setRoleId(String(assignableRoles[0].id));
        }
    }, [assignableRoles.length]);

    // Reset form on open
    useEffect(() => {
        if (open) {
            setEmail("");
            setRoleId(assignableRoles.length > 0 ? String(assignableRoles[0].id) : "");
            setError(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) { setError("Email is required."); return; }
        if (!roleId) { setError("Please select a role."); return; }
        if (!branchId) { setError("No branch selected. Please switch to a branch first."); return; }

        setLoading(true);
        setError(null);
        try {
            await axiosInstance.post(`/branch_user/${clinicId}/invite`, {
                email: email.trim().toLowerCase(),
                role_id: parseInt(roleId, 10),
            });
            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to send invitation. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    const sharedInput = inputCls ||
        "w-full px-3 py-2.5 text-[13px] font-['DM_Sans'] bg-[#F7F4EF] border-[1.5px] border-black/[0.09] rounded-xl outline-none text-[#0D1117] focus:border-[#4A7C59] focus:bg-white transition-all placeholder-[#B8C0CC]";

    return (
        <div
            className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ background: "rgba(13,17,23,0.45)", backdropFilter: "blur(2px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full sm:max-w-[420px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-[slideUp_0.22s_ease]">
                <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>

                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-black/[0.06]">
                    <div className="w-9 h-9 rounded-xl bg-[#E8F2EB] flex items-center justify-center flex-shrink-0">
                        <Send size={15} className="text-[#4A7C59]" />
                    </div>
                    <div className="flex-1">
                        <h2 className="font-['DM_Serif_Display'] text-[17px] text-[#0D1117] leading-tight">Invite Staff</h2>
                        <p className="text-[11px] text-[#8A9BB0] mt-0.5">Send an invitation to join the clinic</p>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-[#8A9BB0] hover:bg-[#F7F4EF] hover:text-[#0D1117] transition-all bg-transparent border-none cursor-pointer">
                        <X size={15} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">

                    {/* Email */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.07em] text-[#8A9BB0] mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B8C0CC] pointer-events-none" />
                            <input
                                type="email"
                                className={sharedInput + " pl-9"}
                                placeholder="staff@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="off"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.07em] text-[#8A9BB0] mb-1.5">
                            Role
                        </label>
                        <div className="relative">
                            <ShieldCheck size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B8C0CC] pointer-events-none" />
                            {assignableRoles.length === 0 ? (
                                <div className={sharedInput + " pl-9 text-[#B8C0CC] cursor-not-allowed"}>
                                    No assignable roles
                                </div>
                            ) : (
                                <>
                                    <select
                                        className={sharedInput + " pl-9 pr-8 appearance-none cursor-pointer"}
                                        value={roleId}
                                        onChange={(e) => setRoleId(e.target.value)}
                                        disabled={loading}
                                    >
                                        <option value="">Select role</option>
                                        {assignableRoles.map((r) => (
                                            <option key={r.id} value={String(r.id)}>{r.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A9BB0] pointer-events-none" />
                                </>
                            )}
                        </div>
                        <p className="text-[10px] text-[#B8C0CC] mt-1.5">
                            You can only invite staff to roles below your own.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-start gap-2 px-3 py-2.5 bg-[#FAF0ED] border border-[#E8927C]/30 rounded-xl text-[12px] text-[#c05c3c]">
                            <span className="flex-shrink-0 mt-0.5">⚠</span>
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2.5 pt-1">
                        <button type="button" onClick={onClose} disabled={loading}
                            className="flex-1 py-2.5 text-[12px] font-semibold text-[#8A9BB0] bg-[#F7F4EF] rounded-xl border border-black/[0.09] hover:bg-[#EEF2F7] transition-all cursor-pointer font-['DM_Sans'] disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading || assignableRoles.length === 0}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold text-white bg-[#4A7C59] rounded-xl border-none hover:bg-[#2F5C3A] transition-all cursor-pointer font-['DM_Sans'] disabled:opacity-60 disabled:cursor-not-allowed">
                            {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                            {loading ? "Sending…" : "Send Invite"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}