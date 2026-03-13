import EmptyState from "./EmptyState";
import { Plus, Building2, Settings, Users, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import StaffRowMenu from "./StaffRowMenu";
import { canEdit } from "../../utils/roleHierarchy";

const STATUS_COLORS = {
  active:     "bg-emerald-50 text-emerald-700 border border-emerald-200",
  suspended:  "bg-amber-50   text-amber-700   border border-amber-200",
  terminated: "bg-red-50     text-red-700     border border-red-200",
  resigned:   "bg-slate-100  text-slate-600   border border-slate-200",
};

function PaginationBar({ pagination, onPageChange }) {
  const { page, totalPages } = pagination;
  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-[12px] text-[#8A9BB0]">Page {page} of {totalPages}</p>
      <div className="flex items-center gap-1.5">
        <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-xl border border-black/[0.09] bg-white text-[#8A9BB0] hover:bg-[#F7F4EF] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all">
          <ChevronLeft size={13} />
        </button>
        <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-xl border border-black/[0.09] bg-white text-[#8A9BB0] hover:bg-[#F7F4EF] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all">
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

export default function StaffTable({
  staff, loading, pagination,
  currentUserId,
  currentUserRole,   // selectedClinic.role — string role name
  onPageChange, onPhotoClick, onInvite,
}) {
  if (loading && staff.length === 0)
    return <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-[#8A9BB0]" /></div>;

  if (!loading && staff.length === 0)
    return (
      <EmptyState icon={Users} title="No staff found" desc="No staff profiles match your search or have been set up yet."
        action={
          <button onClick={onInvite} className="flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white text-[12px] font-semibold rounded-xl hover:bg-[#2F5C3A] transition-all border-none cursor-pointer">
            <Plus size={13} /> Invite staff
          </button>
        }
      />
    );

  return (
    <>
      <div className="bg-white rounded-2xl border border-black/[0.09] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse">
            <thead>
              <tr className="border-b border-black/[0.06]">
                {["", "Name", "Role", "Branch", "Status", ""].map((h, i) => (
                  <th key={i} className="text-left text-[10px] font-bold uppercase tracking-[0.07em] text-[#8A9BB0] px-4 py-3 whitespace-nowrap font-['DM_Sans'] first:pl-5 last:pr-5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => {
                const isYou = member.user_id === currentUserId;
                // Role sourced from clinic — no user.role_level needed
                const memberCanEdit = !isYou && canEdit({
                  viewerRoleName: currentUserRole,
                  targetRoleName: member.role_name,
                  viewerLevel: undefined,
                  targetLevel: member.role_level ?? undefined,
                });

                return (
                  <tr key={member.staff_profile_id || member.user_id}
                    className="border-b border-black/[0.04] hover:bg-[#FAFAF8] transition-colors last:border-b-0">

                    <td className="pl-5 pr-3 py-3.5 w-10">
                      <Avatar fname={member.fname} lname={member.lname} photoUrl={member.profile_photo_url} size={10}
                        onClick={member.profile_photo_url ? () => onPhotoClick(member) : undefined} />
                    </td>

                    <td className="px-4 py-3.5 min-w-[180px] max-w-[240px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[13px] font-semibold text-[#0D1117]">{member.fname} {member.lname}</span>
                        {isYou && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#4A7C59] text-white leading-none">you</span>}
                      </div>
                      <p className="text-[11px] text-[#8A9BB0] truncate">{member.email}</p>
                      {member.staff_id && <p className="text-[10px] text-[#B8C0CC] font-mono">{member.staff_id}</p>}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="text-[11px] font-semibold text-[#4a6580] bg-[#EEF2F7] px-2.5 py-1 rounded-full">{member.role_name || "—"}</span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[11px] text-[#8A9BB0]">
                        <Building2 size={11} className="flex-shrink-0" />{member.branch_name || "—"}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[member.staff_status] || "bg-[#EEF2F7] text-[#4a6580]"}`}>
                        {member.staff_status || "active"}
                      </span>
                    </td>

                    <td className="pr-5 pl-2 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {member.staff_profile_id && memberCanEdit && (
                          <Link to={`/dashboard/staff/edit/${member.staff_profile_id}`}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#8A9BB0] hover:bg-[#E8F2EB] hover:text-[#4A7C59] transition-all no-underline">
                            <Settings size={13} />
                          </Link>
                        )}
                        <StaffRowMenu member={member} isYou={isYou} canEdit={memberCanEdit} />
                      </div>
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