import { createContext, useState, useCallback, useEffect, useRef } from "react";

const AlertContext = createContext();

const alertConfig = {
  success: {
    bg:       "#F0F7F2",
    border:   "#4A7C59",
    accent:   "#4A7C59",
    iconBg:   "#E8F2EB",
    text:     "#1a3322",
    subText:  "#4A7C59",
    progress: "#4A7C59",
    label:    "Success",
  },
  error: {
    bg:       "#FDF2F0",
    border:   "#C05C3C",
    accent:   "#C05C3C",
    iconBg:   "#FAF0ED",
    text:     "#3a1810",
    subText:  "#C05C3C",
    progress: "#C05C3C",
    label:    "Error",
  },
  warning: {
    bg:       "#FBF8EE",
    border:   "#C9A84C",
    accent:   "#C9A84C",
    iconBg:   "#FBF6E9",
    text:     "#3a2e10",
    subText:  "#C9A84C",
    progress: "#C9A84C",
    label:    "Warning",
  },
  info: {
    bg:       "#F0F4F8",
    border:   "#5B8DB8",
    accent:   "#5B8DB8",
    iconBg:   "#E8EFF5",
    text:     "#0D1117",
    subText:  "#5B8DB8",
    progress: "#5B8DB8",
    label:    "Info",
  },
};

const IconSuccess = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconError = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconWarning = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const HeartbeatIcon = () => (
  <svg width="14" height="10" viewBox="0 0 28 12" fill="none">
    <polyline
      points="0,6 5,6 7,6 9,1 11,11 13,3 15,9 17,6 22,6 28,6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const iconMap = {
  success: IconSuccess,
  error:   IconError,
  warning: IconWarning,
  info:    IconInfo,
};

const ProgressBar = ({ duration, color }) => (
  <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: 2, background: "rgba(0,0,0,0.06)" }}>
    <div
      style={{
        height: "100%",
        width: "100%",
        background: color,
        opacity: 0.5,
        animation: `mcAlertShrink ${duration}ms linear forwards`,
      }}
    />
  </div>
);

const Alert = ({ alert, onClose, duration }) => {
  const config        = alertConfig[alert.type] || alertConfig.info;
  const IconComponent = iconMap[alert.type]     || iconMap.info;

  return (
    <div
      className="fixed z-[9999]"
      style={{
        bottom: 24,
        left: 24,
        right: "auto",
        top: "auto",
        animation: "mcAlertSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
    >
      <div
        style={{
          width: 380,
          background: config.bg,
          border: `1.5px solid ${config.border}`,
          borderLeft: `4px solid ${config.accent}`,
          borderRadius: 14,
          boxShadow: "0 8px 32px rgba(13,17,23,0.10), 0 2px 8px rgba(13,17,23,0.06)",
          overflow: "hidden",
          position: "relative",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ padding: "14px 16px 16px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>

            {/* Icon */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: config.iconBg,
                border: `1px solid ${config.border}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: config.accent,
              }}
            >
              <IconComponent />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: config.subText, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  {config.label}
                </span>
                <span style={{ color: config.subText, opacity: 0.5 }}>
                  <HeartbeatIcon />
                </span>
                <span style={{ fontSize: 10, color: config.subText, opacity: 0.5, letterSpacing: "0.04em" }}>
                  MediCore
                </span>
              </div>
              <p style={{ fontSize: 13.5, fontWeight: 500, color: config.text, lineHeight: 1.45, margin: 0 }}>
                {alert.message}
              </p>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Dismiss"
              style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                borderRadius: 8,
                border: `1px solid ${config.border}33`,
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: config.text,
                opacity: 0.5,
                transition: "opacity 0.15s, background 0.15s",
                marginTop: 2,
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = config.iconBg; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = 0.5; e.currentTarget.style.background = "transparent"; }}
            >
              <IconClose />
            </button>
          </div>
        </div>

        <ProgressBar duration={duration} color={config.progress} />
      </div>
    </div>
  );
};

export function AlertProvider({ children }) {
  const [alert, setAlert]     = useState(null);
  const [duration, setDuration] = useState(5000);
  const timerRef              = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
      @keyframes mcAlertShrink {
        from { width: 100%; }
        to   { width: 0%; }
      }
      @keyframes mcAlertSlideIn {
        from { transform: translateX(-24px); opacity: 0; }
        to   { transform: translateX(0);     opacity: 1; }
      }
      @keyframes mcAlertSlideOut {
        from { transform: translateX(0);     opacity: 1; }
        to   { transform: translateX(-24px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const showAlert = useCallback((message, type = "info", customDuration = 5000) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAlert({ message, type });
    setDuration(customDuration);
    timerRef.current = setTimeout(() => {
      setAlert(null);
      timerRef.current = null;
    }, customDuration);
  }, []);

  const hideAlert = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setAlert(null);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
      {alert && <Alert alert={alert} onClose={hideAlert} duration={duration} />}
    </AlertContext.Provider>
  );
}

export { AlertContext };