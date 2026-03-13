import { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, RefreshCw, Loader2, MoreVertical } from "lucide-react";
import DropdownMenu from "./DropdownMenu";

export default function InviteRowMenu({ invite, onResend, currentUserEmail }) {
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
                    className="icon-btn disabled:opacity-50"
                >
                    {resending ? <Loader2 size={13} className="animate-spin" /> : <MoreVertical size={14} />}
                </button>
            )}
        >
            {(invite.status === "pending" || invite.status === "expired") && (
                <button onClick={handleResend} className="menu-item w-full text-left">
                    <RefreshCw size={13} className="text-[#8A9BB0]" /> Resend invite
                </button>
            )}
            {!isOwnInvite && invite.status === "accepted" && !profileDone && (
                <Link to={`/dashboard/staff/set-up/${invite.id}`} className="menu-item" style={{ color: "#4A7C59" }}>
                    <Settings size={13} /> Set up profile
                </Link>
            )}
            {!isOwnInvite && profileDone && (
                <Link to={`/dashboard/staff/edit/${invite.staff_profile_id}`} className="menu-item">
                    <Settings size={13} className="text-[#8A9BB0]" /> Edit profile
                </Link>
            )}
        </DropdownMenu>
    );
}