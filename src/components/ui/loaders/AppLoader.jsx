// ─── Inject styles once at module load time — survives any number of mounts ───
const STYLE_ID = "mc-apploader-styles";
if (!document.getElementById(STYLE_ID)) {
  const tag = document.createElement("style");
  tag.id = STYLE_ID;
  tag.textContent = `
    @keyframes heartbeat-move {
      0%   { stroke-dashoffset: 600; }
      100% { stroke-dashoffset: -600; }
    }
    @keyframes mc-fade-in {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .mc-heartbeat-line {
      stroke-dasharray: 600;
      stroke-dashoffset: 600;
      animation: heartbeat-move 2s linear infinite;
    }
    .mc-loader-text {
      font-family: 'DM Sans', sans-serif;
      animation: mc-fade-in 0.5s ease 0.2s both;
    }
    .mc-loader-logo {
      animation: mc-fade-in 0.5s ease 0.1s both;
    }
  `;
  document.head.appendChild(tag);
}

const AppLoader = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-[#F7F4EF]">

    {/* Logo */}
    <div className="flex items-center gap-2.5 mb-10 mc-loader-logo" style={{ opacity: 0 }}>
      <div
        className="w-[36px] h-[36px] rounded-[9px] flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg,#4A7C59,#2F5C3A)" }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
          stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#0D1117", lineHeight: 1 }}>
          MediCore
        </div>
        <div style={{ fontSize: 11, color: "#8A9BB0", marginTop: 2 }}>
          Healthcare Management Platform
        </div>
      </div>
    </div>

    {/* Heartbeat SVG */}
    <div className="relative mb-8" style={{ width: 280, height: 64 }}>

      {/* Track line */}
      <svg width="280" height="64" viewBox="0 0 280 64" className="absolute inset-0">
        <polyline
          points="0,32 40,32 55,32 65,8 75,56 85,20 95,44 105,32 145,32 185,32 220,32 235,32 245,8 255,56 265,20 275,44 280,32"
          fill="none" stroke="rgba(74,124,89,0.12)" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>

      {/* Animated line + gradient */}
      <svg width="280" height="64" viewBox="0 0 280 64" className="absolute inset-0">
        <defs>
          <linearGradient id="mc-hbGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#4A7C59" stopOpacity="0" />
            <stop offset="40%"  stopColor="#4A7C59" stopOpacity="0.6" />
            <stop offset="70%"  stopColor="#6BA37A" stopOpacity="1" />
            <stop offset="100%" stopColor="#6BA37A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          className="mc-heartbeat-line"
          points="0,32 40,32 55,32 65,8 75,56 85,20 95,44 105,32 145,32 185,32 220,32 235,32 245,8 255,56 265,20 275,44 280,32"
          fill="none" stroke="url(#mc-hbGrad)" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>

      {/* Glowing dot */}
      <svg width="280" height="64" viewBox="0 0 280 64" className="absolute inset-0">
        <circle r="3.5" fill="#4A7C59" style={{ filter: "drop-shadow(0 0 5px rgba(74,124,89,0.8))" }}>
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path="M0,32 L40,32 L55,32 L65,8 L75,56 L85,20 L95,44 L105,32 L145,32 L185,32 L220,32 L235,32 L245,8 L255,56 L265,20 L275,44 L280,32"
          />
        </circle>
      </svg>
    </div>

    {/* Label */}
    <p className="mc-loader-text text-[13px] uppercase" style={{ opacity: 0, color: "#8A9BB0", letterSpacing: "0.1em" }}>
      Loading your workspace…
    </p>
  </div>
);

export default AppLoader;