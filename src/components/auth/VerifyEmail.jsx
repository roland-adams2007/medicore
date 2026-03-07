import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import axiosInstance from "./../../api/axiosInstance";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.post("/users/verify", { token });

        if (response.data && response.data.status === 200) {
          setStatus("success");
          setMessage(response.data.message || "Email verified successfully!");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(response.data?.message || "Verification failed.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
          "Verification failed. The token may be expired or invalid."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <>
      <style>{`
        @keyframes mcSpin { to { transform: rotate(360deg); } }
        @keyframes mcFadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes mcPop { 0%{opacity:0;transform:scale(0.8)} 60%{transform:scale(1.08)} 100%{opacity:1;transform:scale(1)} }
        @keyframes mcPulse { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.15;transform:scale(1.8)} }

        .mc-fade-up { animation: mcFadeUp 0.5s ease both; }
        .mc-d1 { animation-delay: 0.05s; }
        .mc-d2 { animation-delay: 0.12s; }
        .mc-d3 { animation-delay: 0.20s; }
        .mc-d4 { animation-delay: 0.28s; }
        .mc-d5 { animation-delay: 0.36s; }
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
          letter-spacing: 0.01em;
        }
        .mc-btn-primary:hover { background: #2F5C3A; box-shadow: 0 6px 20px rgba(47,92,58,0.28); transform: translateY(-1px); }
        .mc-btn-primary:active { transform: translateY(0); }

        .mc-btn-ghost {
          padding: 13px 32px;
          background: transparent; color: #0D1117;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
          border: 1.5px solid rgba(13,17,23,0.14); border-radius: 12px; cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .mc-btn-ghost:hover { background: #E8F2EB; border-color: #4A7C59; }
      `}</style>

      <div className="mc-ve min-h-screen flex flex-col items-center justify-center p-8" style={{ background: "#F7F4EF" }}>

        {/* Logo */}
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

        {/* Status icon */}
        <div className="mc-fade-up mc-d2 flex justify-center mb-8" style={{ opacity: 0 }}>
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            {loading && (
              <div className="mc-pulse-bg" style={{ background: "rgba(74,124,89,0.08)" }} />
            )}
            <div style={{
              width: 88, height: 88, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: loading || verificationStatus === "success" ? "#E8F2EB" : "#FDF2F0",
              border: `2px solid ${loading || verificationStatus === "success" ? "rgba(74,124,89,0.2)" : "rgba(192,92,60,0.2)"}`,
            }}>
              {loading ? (
                <svg className="mc-spin" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#4A7C59" strokeWidth="2.2" strokeLinecap="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              ) : verificationStatus === "success" ? (
                <CheckCircle className="mc-pop" style={{ width: 38, height: 38, color: "#4A7C59" }} />
              ) : (
                <XCircle className="mc-pop" style={{ width: 38, height: 38, color: "#C05C3C" }} />
              )}
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="mc-fade-up mc-d3 text-center" style={{ opacity: 0, marginBottom: 10 }}>
          <h1 className="mc-serif" style={{ fontSize: "clamp(28px,4vw,40px)", color: "#0D1117", lineHeight: 1.2, margin: 0 }}>
            {loading ? (
              <>Verifying your <em className="italic" style={{ color: "#4A7C59" }}>email</em></>
            ) : verificationStatus === "success" ? (
              <>Email <em className="italic" style={{ color: "#4A7C59" }}>verified</em></>
            ) : (
              <>Verification <em className="italic" style={{ color: "#C05C3C" }}>failed</em></>
            )}
          </h1>
        </div>

        {/* Sub message */}
        <div className="mc-fade-up mc-d4 text-center" style={{ opacity: 0, marginBottom: 36, maxWidth: 380 }}>
          <p style={{ fontSize: 15, color: "#8A9BB0", lineHeight: 1.7, margin: 0 }}>
            {loading ? "Please wait while we confirm your email address…" : message}
          </p>
          {verificationStatus === "success" && (
            <p style={{ fontSize: 13, color: "#4A7C59", marginTop: 10, fontWeight: 500 }}>
              Redirecting to login in 3 seconds…
            </p>
          )}
        </div>

        {/* Actions */}
        {!loading && (
          <div className="mc-fade-up mc-d5 flex gap-3" style={{ opacity: 0 }}>
            <button className="mc-btn-primary" onClick={() => navigate("/login")}>
              Go to Login
            </button>
            {verificationStatus === "error" && (
              <button className="mc-btn-ghost" onClick={() => navigate("/reg")}>
                Register Again
              </button>
            )}
          </div>
        )}

        {/* Footer links */}
        <div className="mc-fade-up mc-d5" style={{ opacity: 0, marginTop: 56, display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { label: "Contact Support", to: "/support" },
            { label: "Privacy Policy", to: "/privacy" },
            { label: "Terms of Service", to: "/terms" },
          ].map(({ label, to }) => (
            <Link key={to} to={to}
              style={{ fontSize: 12, color: "#B0B8C4", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.target.style.color = "#4A7C59"}
              onMouseLeave={e => e.target.style.color = "#B0B8C4"}>
              {label}
            </Link>
          ))}
        </div>

      </div>
    </>
  );
};

export default VerifyEmail;