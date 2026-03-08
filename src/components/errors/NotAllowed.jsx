import { Link } from "react-router-dom";
import { Home, ArrowLeft, ShieldOff } from "lucide-react";

const NotAllowed = () => {
  return (
    <>
      <style>{`
        @keyframes mcFadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes mcFloat  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
        @keyframes mcPulseRing {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.55); opacity: 0; }
        }

        .mc-fade-up { animation: mcFadeUp 0.5s ease both; }
        .mc-d1 { animation-delay: 0.05s; }
        .mc-d2 { animation-delay: 0.12s; }
        .mc-d3 { animation-delay: 0.20s; }
        .mc-d4 { animation-delay: 0.28s; }
        .mc-d5 { animation-delay: 0.36s; }
        .mc-float { animation: mcFloat 3s ease-in-out infinite; }

        .mc-pulse-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(220, 60, 60, 0.12);
          animation: mcPulseRing 2s ease-out infinite;
        }

        .mc-btn-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 14px;
          background: #4A7C59; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
          border: none; border-radius: 12px; cursor: pointer; text-decoration: none;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          letter-spacing: 0.01em;
        }
        .mc-btn-primary:hover { background: #2F5C3A; box-shadow: 0 6px 20px rgba(47,92,58,0.28); transform: translateY(-1px); }
        .mc-btn-primary:active { transform: translateY(0); }

        .mc-btn-ghost {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 13px;
          background: transparent; color: #0D1117;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
          border: 1.5px solid rgba(13,17,23,0.14); border-radius: 12px; cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          text-decoration: none;
        }
        .mc-btn-ghost:hover { background: #E8F2EB; border-color: #4A7C59; color: #2F5C3A; }

        .mc-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px;
          background: rgba(220,60,60,0.08);
          border: 1px solid rgba(220,60,60,0.18);
          border-radius: 100px;
          font-size: 12px; font-weight: 600; color: #C53030;
          letter-spacing: 0.04em; text-transform: uppercase;
        }
      `}</style>

      <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ background: "#F7F4EF" }}>
        <div className="w-full text-center" style={{ maxWidth: 420 }}>

          {/* Logo */}
          <div className="mc-fade-up mc-d1 flex items-center justify-center gap-2.5 mb-14" style={{ opacity: 0 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg,#4A7C59,#2F5C3A)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 20, color: "#0D1117", lineHeight: 1, fontFamily: "Georgia, serif" }}>MediCore</div>
              <div style={{ fontSize: 11, color: "#8A9BB0", marginTop: 2 }}>Healthcare Management Platform</div>
            </div>
          </div>

          {/* Icon with pulse ring */}
          <div className="mc-fade-up mc-d2 mc-float flex justify-center mb-2" style={{ opacity: 0 }}>
            <div style={{ position: "relative", width: 88, height: 88 }}>
              <div className="mc-pulse-ring" />
              <div style={{
                position: "relative",
                width: 88, height: 88, borderRadius: "50%",
                background: "#FEF0F0",
                border: "1.5px solid rgba(220,60,60,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ShieldOff size={34} color="#DC3C3C" strokeWidth={1.8} />
              </div>
            </div>
          </div>

          {/* 403 number */}
          <div className="mc-fade-up mc-d2" style={{ opacity: 0, marginBottom: 4 }}>
            <span style={{ fontSize: 80, color: "rgba(220,60,60,0.10)", lineHeight: 1, letterSpacing: "-4px", fontFamily: "Georgia, serif" }}>403</span>
          </div>

          {/* Badge */}
          <div className="mc-fade-up mc-d3 flex justify-center mb-4" style={{ opacity: 0 }}>
            <span className="mc-badge">Access Denied</span>
          </div>

          {/* Heading */}
          <div className="mc-fade-up mc-d3" style={{ opacity: 0, marginBottom: 12 }}>
            <h1 style={{ fontSize: "clamp(26px,4vw,34px)", color: "#0D1117", lineHeight: 1.2, margin: 0, fontFamily: "Georgia, serif" }}>
              You're not{" "}
              <em className="italic" style={{ color: "#DC3C3C" }}>authorized</em>
            </h1>
          </div>

          {/* Sub message */}
          <div className="mc-fade-up mc-d4" style={{ opacity: 0, marginBottom: 40 }}>
            <p style={{ fontSize: 15, color: "#8A9BB0", lineHeight: 1.7, margin: 0 }}>
              You don't have permission to access this page. Contact your administrator if you believe this is a mistake.
            </p>
          </div>

          {/* Actions */}
          <div className="mc-fade-up mc-d5" style={{ opacity: 0, display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
            <Link to="/dashboard" className="mc-btn-primary">
              <Home style={{ width: 16, height: 16 }} />
              Go to Dashboard
            </Link>
            <button className="mc-btn-ghost" onClick={() => window.history.back()}>
              <ArrowLeft style={{ width: 16, height: 16 }} />
              Go Back
            </button>
          </div>

          {/* Footer */}
          <div className="mc-fade-up mc-d5" style={{ opacity: 0, paddingTop: 24, borderTop: "1px solid rgba(13,17,23,0.07)" }}>
            <p style={{ fontSize: 13, color: "#8A9BB0", margin: 0 }}>
              Need help?{" "}
              <Link
                to="/dashboard/support"
                style={{ color: "#4A7C59", fontWeight: 600, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = "#2F5C3A"}
                onMouseLeave={e => e.target.style.color = "#4A7C59"}
              >
                Contact Support
              </Link>
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default NotAllowed;