import { useNavigate, useLocation } from "react-router-dom";
import { X, Activity, LogOut } from "lucide-react";
import { useAuth } from "../context/Auth/UseAuth";
import { useClinicStore } from "../store/store";
import ClinicSwitcher from "../components/ui/ClinicSwitcher";
import NavItem from "../components/ui/NavItem";
import Avatar from "../components/ui/Avatar";
import { getNavForRoles, ROUTE_MAP } from "../config/navConfig";

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { selectedClinic, setSelectedClinic, clinics } = useClinicStore();

  const roles = selectedClinic?.roles?.length
    ? selectedClinic.roles
    : selectedClinic?.role
      ? [selectedClinic.role]
      : [];

  const normalize = (r) => r.toLowerCase().replace(/\s+/g, "_");
  const normalizedRoles = roles.map(normalize);
  const isSuperAdmin = normalizedRoles.includes("super_admin");

  const navSections = getNavForRoles(roles);

  const initials = user
    ? `${user.fname?.[0] ?? ""}${user.lname?.[0] ?? ""}`.toUpperCase() || "??"
    : "??";

  const handleNav = (key) => {
    navigate(ROUTE_MAP[key] ?? (isSuperAdmin ? "/admin" : "/dashboard"));
    onClose();
  };

  const isActive = (key) => {
    const route = ROUTE_MAP[key];
    if (!route) return false;
    // exact match for root dashboard/admin pages
    if (key === "dashboard") return location.pathname === "/dashboard";
    if (key === "admin_dashboard") return location.pathname === "/admin";
    return location.pathname.startsWith(route);
  };

  const clinicList = clinics.map((c) => ({
    id: c.id,
    name: c.name,
    branches: Array.isArray(c.branches) ? c.branches : [],
    role: c.role,
    roles: c.roles ?? [],
  }));

  const handleSelectClinic = (selected) => {
    const fullClinic = clinics.find((c) => c.id === selected.id);
    setSelectedClinic({
      id: selected.id,
      name: selected.name,
      branch: selected.branch,
      branchId: selected.branchId,
      role: fullClinic?.role ?? null,
      roles: fullClinic?.roles ?? [],
    });
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen w-[260px] flex flex-col z-50
        transition-transform duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]
        lg:static lg:translate-x-0 lg:z-auto lg:shrink-0
        ${open ? "translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.3)]" : "-translate-x-full"}
      `}
      style={{ background: "#0D1117", overflowY: "auto" }}
    >
      {/* ── Logo ── */}
      <div
        className="flex items-center justify-between px-5 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
            style={{ background: isSuperAdmin ? "#C9A84C" : "#4A7C59" }}
          >
            <Activity size={18} color="#fff" />
          </div>
          <div>
            <p className="text-white text-[18px] leading-none" style={{ fontFamily: '"DM Serif Display", serif' }}>
              MediCore
            </p>
            <p style={{ color: isSuperAdmin ? "#C9A84C" : "#8A9BB0", fontSize: 11, marginTop: 2 }}>
              {isSuperAdmin ? "Super Admin" : "Clinic OS"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style={{ background: "rgba(255,255,255,0.06)", color: "#8A9BB0", border: "none", cursor: "pointer" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Clinic switcher (hidden for super admin) ── */}
      {!isSuperAdmin && (
        <ClinicSwitcher
          clinics={clinicList}
          selectedClinic={selectedClinic}
          onSelect={handleSelectClinic}
        />
      )}

      {/* ── Nav ── */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-3.5 flex flex-col gap-0.5"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
      >
        {navSections.map((section) => (
          <div key={section.label} className="mb-1">
            <p
              className="text-[10px] font-semibold uppercase px-3 pb-2 pt-1"
              style={{ color: "rgba(138,155,176,0.6)", letterSpacing: "0.1em" }}
            >
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavItem
                key={item.key}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                dot={item.dot}
                active={isActive(item.key)}
                onClick={() => handleNav(item.key)}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* ── User footer ── */}
      <div
        className="px-4 py-3.5 flex items-center gap-2.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Avatar initials={initials} color={isSuperAdmin ? "#C9A84C" : "#4A7C59"} size={32} />
        <div className="flex-1 min-w-0">
          <p className="text-white text-[13px] font-medium truncate">
            {user?.fname ? `${user.fname} ${user.lname ?? ""}`.trim() : "User"}
          </p>
          <p style={{ color: "#8A9BB0", fontSize: 11 }} className="capitalize truncate">
            {isSuperAdmin ? "Super Admin" : (selectedClinic?.role ?? "—")}
          </p>
        </div>
        <button
          style={{ background: "none", border: "none", cursor: "pointer", color: "#8A9BB0", padding: 4 }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "#8A9BB0")}
          onClick={() => { }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}