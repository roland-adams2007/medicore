export default function NavItem({ icon: Icon, label, active, badge, dot, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 text-left border-none cursor-pointer"
      style={{
        borderLeft: `3px solid ${active ? "#4A7C59" : "transparent"}`,
        background: active ? "rgba(74,124,89,0.22)" : "transparent",
        color: active ? "#fff" : "#8A9BB0",
        fontFamily: '"DM Sans", sans-serif',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = "rgba(74,124,89,0.15)";
          e.currentTarget.style.color = "#fff";
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#8A9BB0";
        }
      }}
    >
      {Icon && <Icon size={17} className="shrink-0" />}
      <span className="flex-1">{label}</span>
      {badge && (
        <span
          className="text-[11px] text-white px-2 py-0.5 rounded-full"
          style={{ background: "#4A7C59" }}
        >
          {badge}
        </span>
      )}
      {dot && (
        <span
          className="w-2 h-2 rounded-full shrink-0 animate-pulse"
          style={{ background: "#E8927C" }}
        />
      )}
    </button>
  );
}