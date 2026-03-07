import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <>
      <style>{`
        @keyframes mcFadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes mcFloat  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }

        .mc-fade-up { animation: mcFadeUp 0.5s ease both; }
        .mc-d1 { animation-delay: 0.05s; }
        .mc-d2 { animation-delay: 0.12s; }
        .mc-d3 { animation-delay: 0.20s; }
        .mc-d4 { animation-delay: 0.28s; }
        .mc-d5 { animation-delay: 0.36s; }
        .mc-float { animation: mcFloat 3s ease-in-out infinite; }

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
        }
        .mc-btn-ghost:hover { background: #E8F2EB; border-color: #4A7C59; color: #2F5C3A; }
      `}</style>

      <div className="mc-nf min-h-screen flex flex-col items-center justify-center p-8" style={{ background: "#F7F4EF" }}>
        <div className="w-full text-center" style={{ maxWidth: 420 }}>

          {/* Logo */}
          <div className="mc-fade-up mc-d1 flex items-center justify-center gap-2.5 mb-14" style={{ opacity: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#4A7C59,#2F5C3A)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <div className="mc-serif" style={{ fontSize: 20, color: "#0D1117", lineHeight: 1 }}>MediCore</div>
              <div style={{ fontSize: 11, color: "#8A9BB0", marginTop: 2 }}>Healthcare Management Platform</div>
            </div>
          </div>

          {/* Icon */}
          <div className="mc-fade-up mc-d2 mc-float flex justify-center mb-2" style={{ opacity: 0 }}>
            <div style={{
              width: 88, height: 88, borderRadius: "50%",
              background: "#E8F2EB",
              border: "1.5px solid rgba(74,124,89,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4A7C59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>

          {/* 404 number */}
          <div className="mc-fade-up mc-d2" style={{ opacity: 0, marginBottom: 4 }}>
            <span className="mc-serif" style={{ fontSize: 80, color: "rgba(74,124,89,0.12)", lineHeight: 1, letterSpacing: "-4px" }}>404</span>
          </div>

          {/* Heading */}
          <div className="mc-fade-up mc-d3" style={{ opacity: 0, marginBottom: 12 }}>
            <h1 className="mc-serif" style={{ fontSize: "clamp(26px,4vw,36px)", color: "#0D1117", lineHeight: 1.2, margin: 0 }}>
              Page <em className="italic" style={{ color: "#4A7C59" }}>not found</em>
            </h1>
          </div>

          {/* Sub message */}
          <div className="mc-fade-up mc-d4" style={{ opacity: 0, marginBottom: 40 }}>
            <p style={{ fontSize: 15, color: "#8A9BB0", lineHeight: 1.7, margin: 0 }}>
              The page you're looking for doesn't exist or has been moved. Let's get you back on track.
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
              <Link to="/support" style={{ color: "#4A7C59", fontWeight: 600, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = "#2F5C3A"}
                onMouseLeave={e => e.target.style.color = "#4A7C59"}>
                Contact Support
              </Link>
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default NotFound;