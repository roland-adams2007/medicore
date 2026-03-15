import { Link } from "react-router-dom";
import EmptyState from "./EmptyState";
import { Plus, Mail, Loader2, CheckCircle2,Settings } from "lucide-react";
import InviteRowMenu from "./InviteRowMenu";

const INVITE_STATUS_COLORS = {
    pending: "bg-amber-50  text-amber-700  border border-amber-200",
    accepted: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    declined: "bg-red-50    text-red-700    border border-red-200",
    expired: "bg-slate-100 text-slate-600  border border-slate-200",
};

export default function InvitesTable({ invites, loading, pagination, clinicId, branchId, currentUserEmail, onPageChange, onResend, onInvite }) {
    if (loading && invites.length === 0)
        return <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-[#8A9BB0]" /></div>;

    if (!loading && invites.length === 0)
        return (
            <EmptyState
                icon={Mail} title="No invitations"
                desc="No invitations have been sent to this branch yet."
                action={
                    <button onClick={onInvite}
                        className="flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl hover:bg-[#2F5C3A] transition-all border-none cursor-pointer">
                        <Plus size={13} /> Invite staff
                    </button>
                }
            />
        );

    return (
        <>
            <div className="bg-white rounded-2xl border border-black/[0.09] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[540px] border-collapse">
                        <thead>
                            <tr className="border-b border-black/[0.06]">
                                {["Email", "Role", "Status", "Profile", ""].map((h, i) => (
                                    <th key={i}
                                        className="text-left text-[10px] font-bold uppercase tracking-[0.07em] text-[#8A9BB0] px-4 py-3 whitespace-nowrap font-['DM_Sans'] first:pl-5 last:pr-5">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {invites.map((inv) => {
                                const profileDone = !!inv.staff_profile_id;
                                const isOwnInvite = !!(currentUserEmail && inv.email?.toLowerCase() === currentUserEmail);

                                return (
                                    <tr key={inv.id}
                                        className="border-b border-black/[0.04] hover:bg-[#FAFAF8] transition-colors last:border-b-0">

                                        {/* Email */}
                                        <td className="pl-5 pr-4 py-3.5 min-w-[200px] max-w-[280px]">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="text-[13px] font-semibold text-[#0D1117]">{inv.email}</span>
                                                {isOwnInvite && (
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#4A7C59] text-white leading-none">
                                                        you
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-[#8A9BB0]">
                                                {new Date(inv.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                                {inv.invited_by_fname && <> · by {inv.invited_by_fname} {inv.invited_by_lname}</>}
                                            </p>
                                        </td>

                                        {/* Role */}
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <span className="text-[11px] font-semibold text-[#4a6580] bg-[#EEF2F7] px-2.5 py-1 rounded-full">
                                                {inv.role_name || "—"}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${INVITE_STATUS_COLORS[inv.status] || "bg-[#EEF2F7] text-[#4a6580]"
                                                }`}>
                                                {inv.status}
                                            </span>
                                        </td>

                                        {/* Profile action */}
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            {isOwnInvite ? (
                                                <span className="text-[10px] text-[#B8C0CC]">—</span>
                                            ) : profileDone ? (
                                                <Link
                                                    to={`/dashboard/staff/edit/${inv.staff_profile_id}`}
                                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4A7C59] bg-[#E8F2EB] px-2.5 py-1 rounded-full no-underline hover:bg-[#4A7C59] hover:text-white transition-all"
                                                >
                                                    <CheckCircle2 size={10} /> Set up
                                                </Link>
                                            ) : inv.status === "accepted" ? (
                                                <Link
                                                    to={`/dashboard/staff/set-up/${inv.id}`}
                                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C9A84C] bg-[#FBF6E9] px-2.5 py-1 rounded-full no-underline hover:bg-[#C9A84C] hover:text-white transition-all"
                                                >
                                                    <Settings size={10} /> Setup
                                                </Link>
                                            ) : (
                                                <span className="text-[10px] text-[#B8C0CC]">—</span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="pr-5 pl-2 py-3.5">
                                            <InviteRowMenu
                                                invite={inv}
                                                onResend={onResend}
                                                currentUserEmail={currentUserEmail}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {pagination?.totalPages > 1 && <PaginationBar pagination={pagination} onPageChange={onPageChange} />}
        </>
    );
}