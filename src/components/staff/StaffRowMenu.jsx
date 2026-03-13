import { Link } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";
import { Settings, MoreVertical, Eye } from "lucide-react";

export default function StaffRowMenu({ member, isYou }) {
    if (isYou) return null;
    return (
        <DropdownMenu
            trigger={(handleOpen) => (
                <button onClick={handleOpen} className="icon-btn">
                    <MoreVertical size={14} />
                </button>
            )}
        >
            {member.staff_profile_id && (
                <Link to={`/dashboard/staff/edit/${member.staff_profile_id}`} className="menu-item">
                    <Settings size={13} className="text-[#8A9BB0]" /> Edit profile
                </Link>
            )}
            {member.staff_profile_id && (
                <Link to={`/dashboard/staff/view/${member.staff_profile_id}`} className="menu-item">
                    <Eye size={13} className="text-[#8A9BB0]" /> View details
                </Link>
            )}
        </DropdownMenu>
    );
}
