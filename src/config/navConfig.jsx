import {
  LayoutDashboard, CalendarDays, Users, Stethoscope,
  UserRoundCog, Receipt, BarChart2, Pill, Package,
  ShieldCheck, Settings, FlaskConical, ClipboardList,
  HeartPulse, BedDouble,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["owner", "admin", "doctor", "nurse", "receptionist", "pharmacist", "lab"] },
      { key: "appointments", label: "Appointments", icon: CalendarDays, badge: "14", roles: ["owner", "admin", "doctor", "nurse", "receptionist"] },
      { key: "patients", label: "Patients", icon: Users, roles: ["owner", "admin", "doctor", "nurse", "receptionist"] },
      { key: "consultations", label: "Consultations", icon: Stethoscope, roles: ["owner", "admin", "doctor", "nurse"] },
      { key: "ward", label: "Ward & Beds", icon: BedDouble, roles: ["owner", "admin", "nurse"] },
      { key: "vitals", label: "Vitals", icon: HeartPulse, roles: ["owner", "admin", "doctor", "nurse"] },
      { key: "staff", label: "Staff", icon: UserRoundCog, roles: ["owner", "admin"] },
    ],
  },
  {
    label: "Finance",
    items: [
      { key: "billing", label: "Billing & Invoices", icon: Receipt, roles: ["owner", "admin", "receptionist"] },
      { key: "reports", label: "Reports", icon: BarChart2, roles: ["owner", "admin"] },
    ],
  },
  {
    label: "Operations",
    items: [
      { key: "pharmacy", label: "Pharmacy", icon: Pill, dot: true, roles: ["owner", "admin", "pharmacist", "doctor"] },
      { key: "lab", label: "Laboratory", icon: FlaskConical, roles: ["owner", "admin", "lab", "doctor"] },
      { key: "inventory", label: "Inventory", icon: Package, roles: ["owner", "admin", "pharmacist"] },
      { key: "labRequests", label: "Lab Requests", icon: ClipboardList, roles: ["owner", "admin", "doctor", "nurse", "lab"] },
      { key: "audit", label: "Audit Log", icon: ShieldCheck, roles: ["owner", "admin"] },
      { key: "settings", label: "Settings", icon: Settings, roles: ["owner", "admin"] },
    ],
  },
];

export function getNavForRoles(userRoles = []) {
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  return NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      item.roles.some((r) => roles.includes(r))
    ),
  })).filter((s) => s.items.length > 0);
}