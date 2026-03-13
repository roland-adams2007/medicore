import { useState, useEffect } from "react";
import { CheckCircle, XCircle, UserCheck, LogIn, Mail } from "lucide-react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/Auth/UseAuth";
import { useStaffStore } from "../../store/store";

// ─── Shared styles ────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

  @keyframes mcSpin    { to { transform: rotate(360deg); } }
  @keyframes mcFadeUp  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes mcPop     { 0%{opacity:0;transform:scale(0.8)} 60%{transform:scale(1.08)} 100%{opacity:1;transform:scale(1)} }
  @keyframes mcPulse   { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.15;transform:scale(1.8)} }

  .mc-serif { font-family: 'DM Serif Display', Georgia, serif; }
  .mc-sans  { font-family: 'DM Sans', sans-serif; }

  .mc-fade-up { animation: mcFadeUp 0.5s ease both; }
  .mc-d1 { animation-delay: 0.05s; }
  .mc-d2 { animation-delay: 0.12s; }
  .mc-d3 { animation-delay: 0.20s; }
  .mc-d4 { animation-delay: 0.28s; }
  .mc-d5 { animation-delay: 0.36s; }
  .mc-d6 { animation-delay: 0.44s; }
  .mc-spin { animation: mcSpin 1s linear infinite; }
  .mc-pop  { animation: mcPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
  .mc-pulse-bg {
    position: absolute; inset: -20px; border-radius: 50%;
    animation: mcPulse 1.8s ease-in-out infinite;
  }

  .mc-btn-primary {
    padding: 14px 40px;
    background: #4A7C59; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
    border: none; border-radius: 12px; cursor: pointer;
    transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
    letter-spacing: 0.01em; display: inline-flex; align-items: center; gap: 8px;
  }
  .mc-btn-primary:hover  { background: #2F5C3A; box-shadow: 0 6px 20px rgba(47,92,58,0.28); transform: translateY(-1px); }
  .mc-btn-primary:active { transform: translateY(0); }
  .mc-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

  .mc-btn-ghost {
    padding: 13px 32px;
    background: transparent; color: #0D1117;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
    border: 1.5px solid rgba(13,17,23,0.14); border-radius: 12px; cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .mc-btn-ghost:hover    { background: #E8F2EB; border-color: #4A7C59; }
  .mc-btn-ghost:disabled { opacity: 0.6; cursor: not-allowed; }

  .mc-btn-danger {
    padding: 13px 32px;
    background: transparent; color: #C05C3C;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
    border: 1.5px solid rgba(192,92,60,0.25); border-radius: 12px; cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .mc-btn-danger:hover    { background: #FDF2F0; border-color: #C05C3C; }
  .mc-btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

  .mc-card { background: #F5F8F6; border-radius: 14px; padding: 20px 24px; width: 100%; max-width: 420px; }
  .mc-card-row {
    display: flex; flex-direction: column; gap: 3px;
    padding: 12px 0; border-bottom: 1px solid rgba(13,17,23,0.07);
  }
  .mc-card-row:last-child  { border-bottom: none; padding-bottom: 0; }
  .mc-card-row:first-child { padding-top: 0; }
  .mc-card-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #8A9BB0; font-family: 'DM Sans', sans-serif; }
  .mc-card-value { font-size: 14px; font-weight: 600; color: #0D1117; font-family: 'DM Sans', sans-serif; }
  .mc-card-value.green { color: #4A7C59; }
`;

// ─── Logo ─────────────────────────────────────────────────────────────────────
const Logo = () => (
    <div className="mc-fade-up mc-d1 flex items-center gap-2.5 mb-16" style={{ opacity: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#4A7C59,#2F5C3A)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        </div>
        <div>
            <div className="mc-serif" style={{ fontSize: 20, color: "#0D1117", lineHeight: 1 }}>MediCore</div>
            <div style={{ fontSize: 11, color: "#8A9BB0", marginTop: 2 }}>Healthcare Management Platform</div>
        </div>
    </div>
);

// ─── Status icon ──────────────────────────────────────────────────────────────
const StatusIcon = ({ status }) => {
    const isLoading = status === "loading";
    const isError = ["error", "expired", "wrong_user", "declined"].includes(status);
    const bgColor = isError ? "#FDF2F0" : "#E8F2EB";
    const borderClr = isError ? "rgba(192,92,60,0.2)" : "rgba(74,124,89,0.2)";

    return (
        <div className="mc-fade-up mc-d2 flex justify-center mb-8" style={{ opacity: 0 }}>
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                {isLoading && <div className="mc-pulse-bg" style={{ background: "rgba(74,124,89,0.08)" }} />}
                <div style={{ width: 88, height: 88, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: bgColor, border: `2px solid ${borderClr}` }}>
                    {isLoading && <svg className="mc-spin" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#4A7C59" strokeWidth="2.2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
                    {status === "accepted" && <CheckCircle className="mc-pop" style={{ width: 38, height: 38, color: "#4A7C59" }} />}
                    {status === "ready" && <UserCheck className="mc-pop" style={{ width: 38, height: 38, color: "#4A7C59" }} />}
                    {status === "need_login" && <LogIn className="mc-pop" style={{ width: 38, height: 38, color: "#4A7C59" }} />}
                    {status === "wrong_user" && <Mail className="mc-pop" style={{ width: 38, height: 38, color: "#C05C3C" }} />}
                    {["error", "expired", "declined"].includes(status) && <XCircle className="mc-pop" style={{ width: 38, height: 38, color: "#C05C3C" }} />}
                </div>
            </div>
        </div>
    );
};

// ─── Invite details card ──────────────────────────────────────────────────────
const InviteCard = ({ invite }) => (
    <div className="mc-card mc-fade-up mc-d4" style={{ opacity: 0, marginBottom: 32 }}>
        <div className="mc-card-row">
            <span className="mc-card-label">Clinic</span>
            <span className="mc-card-value">{invite.clinic_name}</span>
        </div>
        {invite.branch_name && (
            <div className="mc-card-row">
                <span className="mc-card-label">Branch</span>
                <span className="mc-card-value">{invite.branch_name}</span>
            </div>
        )}
        <div className="mc-card-row">
            <span className="mc-card-label">Role</span>
            <span className="mc-card-value green">{invite.role_name}</span>
        </div>
        <div className="mc-card-row">
            <span className="mc-card-label">Invited by</span>
            <span className="mc-card-value">{invite.invited_by}</span>
        </div>
    </div>
);

// ─── Footer ───────────────────────────────────────────────────────────────────
const FooterLinks = () => (
    <div className="mc-fade-up mc-d6" style={{ opacity: 0, marginTop: 56, display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center" }}>
        {[{ label: "Contact Support", to: "/support" }, { label: "Privacy Policy", to: "/privacy" }, { label: "Terms of Service", to: "/terms" }].map(({ label, to }) => (
            <Link key={to} to={to}
                style={{ fontSize: 12, color: "#B0B8C4", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => e.target.style.color = "#4A7C59"}
                onMouseLeave={e => e.target.style.color = "#B0B8C4"}>
                {label}
            </Link>
        ))}
    </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const StaffInvite = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, loadingUser } = useAuth();
    const { lookupInvite, acceptInvite, rejectInvite } = useStaffStore();

    const [status, setStatus] = useState("loading");
    const [invite, setInvite] = useState(null);
    const [message, setMessage] = useState("");
    const [acting, setActing] = useState(false);

    const token = searchParams.get("token");
    const redirectUrl = encodeURIComponent(window.location.pathname + window.location.search);

    // ── Lookup ────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (loadingUser) return;

        const lookup = async () => {
            if (!token) {
                setStatus("error");
                setMessage("Invite token is missing.");
                return;
            }

            try {
                const data = await lookupInvite(token);
                setInvite(data);

                if (!user) {
                    setStatus("need_login");
                    setMessage("You need to be logged in to accept or decline this invitation.");
                    return;
                }

                if (user.email?.toLowerCase() !== data.email?.toLowerCase()) {
                    setStatus("wrong_user");
                    setMessage(`This invite was sent to ${data.email}. You're currently logged in as ${user.email}.`);
                    return;
                }

                setStatus("ready");
            } catch (err) {
                const msg = err.response?.data?.message || err.message || "Invalid or expired invite.";
                setStatus(msg.toLowerCase().includes("expired") ? "expired" : "error");
                setMessage(msg);
            }
        };

        lookup();
    }, [token, user, loadingUser]);

    // ── Accept ────────────────────────────────────────────────────────────────
    const handleAccept = async () => {
        setActing(true);
        try {
            await acceptInvite(token);
            setStatus("accepted");
            setMessage(`You've joined ${invite?.clinic_name}${invite?.branch_name ? ` — ${invite.branch_name}` : ""} as ${invite?.role_name}.`);
            setTimeout(() => navigate("/dashboard"), 3000);
        } catch (err) {
            setStatus("error");
            setMessage(err.response?.data?.message || err.message || "Failed to accept invite.");
        } finally {
            setActing(false);
        }
    };

    // ── Decline ───────────────────────────────────────────────────────────────
    const handleDecline = async () => {
        setActing(true);
        try {
            await rejectInvite(token);
            setStatus("declined");
            setMessage("You've declined this invitation. You can close this page.");
        } catch (err) {
            setStatus("error");
            setMessage(err.response?.data?.message || err.message || "Failed to decline invite.");
        } finally {
            setActing(false);
        }
    };

    // ── Copy map ──────────────────────────────────────────────────────────────
    const headingMap = {
        loading: <><em className="italic" style={{ color: "#4A7C59" }}>Loading</em> your invite</>,
        need_login: <>Login to <em className="italic" style={{ color: "#4A7C59" }}>continue</em></>,
        wrong_user: <>Wrong <em className="italic" style={{ color: "#C05C3C" }}>account</em></>,
        ready: <>You've been <em className="italic" style={{ color: "#4A7C59" }}>invited</em></>,
        accepted: <>You're <em className="italic" style={{ color: "#4A7C59" }}>in!</em></>,
        declined: <>Invitation <em className="italic" style={{ color: "#C05C3C" }}>declined</em></>,
        expired: <>Invite <em className="italic" style={{ color: "#C05C3C" }}>expired</em></>,
        error: <>Something went <em className="italic" style={{ color: "#C05C3C" }}>wrong</em></>,
    };

    const subMap = {
        loading: "Please wait while we look up your invitation…",
        need_login: message,
        wrong_user: message,
        ready: `${invite?.invited_by} has invited you to join ${invite?.clinic_name} as ${invite?.role_name}.`,
        accepted: message,
        declined: message,
        expired: "This invite link is no longer valid. Ask the clinic admin to send a new one.",
        error: message,
    };

    return (
        <>
            <style>{styles}</style>
            <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ background: "#F7F4EF" }}>

                <Logo />
                <StatusIcon status={status} />

                {/* Heading */}
                <div className="mc-fade-up mc-d3 text-center" style={{ opacity: 0, marginBottom: 10 }}>
                    <h1 className="mc-serif" style={{ fontSize: "clamp(28px,4vw,40px)", color: "#0D1117", lineHeight: 1.2, margin: 0 }}>
                        {headingMap[status]}
                    </h1>
                </div>

                {/* Sub-message */}
                <div className="mc-fade-up mc-d4 text-center" style={{ opacity: 0, marginBottom: 32, maxWidth: 400 }}>
                    <p className="mc-sans" style={{ fontSize: 15, color: "#8A9BB0", lineHeight: 1.7, margin: 0 }}>
                        {subMap[status]}
                    </p>
                    {status === "accepted" && (
                        <p className="mc-sans" style={{ fontSize: 13, color: "#4A7C59", marginTop: 10, fontWeight: 500 }}>
                            Redirecting to dashboard in 3 seconds…
                        </p>
                    )}
                </div>

                {/* Invite card */}
                {invite && status === "ready" && (
                    <InviteCard invite={invite} />
                )}

                {/* Actions */}
                {status !== "loading" && (
                    <div className="mc-fade-up mc-d5 flex flex-wrap gap-3 justify-center" style={{ opacity: 0 }}>

                        {status === "ready" && (
                            <>
                                <button className="mc-btn-primary" onClick={handleAccept} disabled={acting}>
                                    {acting
                                        ? <svg className="mc-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                                        : <UserCheck size={16} />}
                                    Accept Invitation
                                </button>
                                <button className="mc-btn-danger" onClick={handleDecline} disabled={acting}>
                                    <XCircle size={16} /> Decline
                                </button>
                            </>
                        )}

                        {status === "need_login" && (
                            <>
                                <button className="mc-btn-primary" onClick={() => navigate(`/login?redirect=${redirectUrl}`)}>
                                    <LogIn size={16} /> Log In
                                </button>
                                <button className="mc-btn-ghost" onClick={() => navigate(`/register?redirect=${redirectUrl}`)}>
                                    Create Account
                                </button>
                            </>
                        )}

                        {status === "wrong_user" && (
                            <>
                                <button className="mc-btn-ghost" onClick={() => navigate(`/login?redirect=${redirectUrl}`)}>
                                    <LogIn size={16} /> Switch Account
                                </button>
                                <button className="mc-btn-ghost" onClick={() => navigate("/dashboard")}>
                                    Go to Dashboard
                                </button>
                            </>
                        )}

                        {status === "accepted" && (
                            <button className="mc-btn-primary" onClick={() => navigate("/dashboard")}>
                                Go to Dashboard
                            </button>
                        )}

                        {["declined", "expired", "error"].includes(status) && (
                            <button className="mc-btn-ghost" onClick={() => navigate("/dashboard")}>
                                Go to Dashboard
                            </button>
                        )}

                    </div>
                )}

                <FooterLinks />
            </div>
        </>
    );
};

export default StaffInvite;