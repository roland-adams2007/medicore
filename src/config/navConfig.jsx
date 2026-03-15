import {
  LayoutDashboard, CalendarDays, Users, Stethoscope,
  UserRoundCog, Receipt, BarChart2, Pill, Package,
  ShieldCheck, Settings, FlaskConical, ClipboardList,
  HeartPulse, BedDouble, FileHeart, UserPlus, Banknote,
  FileText, Bell, Megaphone, Plug, Building2, UserCircle,
  Download, Shield, ScanHeart, CalendarPlus, MessageCircle,
  Image, FolderOpen, Video, FileImage, AlertTriangle,
  Truck, ShoppingCart, ClipboardCheck, GitBranch,
  CalendarCheck, Clock, CreditCard, HelpCircle,
  Workflow, FileLock,
} from "lucide-react";

// ─── ROUTE MAP ────────────────────────────────────────────────────────────────
// Super admin routes live under /admin/* to keep them fully separate
// from clinic dashboard routes under /dashboard/*

export const ROUTE_MAP = {
  // ── Super Admin (admin/* only) ──────────────────────────────────────────────
  admin_dashboard: "/admin",
  admin_clinics: "/admin/clinics",
  admin_users: "/admin/users",
  admin_plans: "/admin/plans",
  admin_revenue: "/admin/revenue",
  admin_financial: "/admin/financial-reports",
  admin_reports: "/admin/reports",
  admin_integrations: "/admin/integrations",
  admin_workflows: "/admin/workflows",
  admin_audit: "/admin/audit",
  admin_announcements: "/admin/announcements",
  admin_notifications: "/admin/notifications",
  admin_settings: "/admin/settings",

  // ── Main ────────────────────────────────────────────────────────────────────
  dashboard: "/dashboard",
  appointments: "/dashboard/appointments",
  patients: "/dashboard/patients",
  register_patient: "/dashboard/register-patient",
  queue: "/dashboard/queue",
  consultations: "/dashboard/consultations",
  medical_records: "/dashboard/medical-records",
  patient_notes: "/dashboard/patient-notes",
  triage: "/dashboard/triage",
  ward: "/dashboard/ward",
  vitals: "/dashboard/vitals",
  admissions: "/dashboard/admissions",
  staff: "/dashboard/staff",
  shifts: "/dashboard/shifts",
  doctor_schedules: "/dashboard/doctor-schedules",
  tasks: "/dashboard/tasks",

  // ── Finance ─────────────────────────────────────────────────────────────────
  billing: "/dashboard/billing",
  payments: "/dashboard/payments",
  generate_receipt: "/dashboard/generate-receipt",
  insurance_claims: "/dashboard/insurance-claims",
  expenses: "/dashboard/expenses",
  clinic_subscription: "/dashboard/subscription",   // clinic owner views their own plan
  reports: "/dashboard/reports",

  // ── Clinical ────────────────────────────────────────────────────────────────
  prescriptions: "/dashboard/prescriptions",
  lab_requests: "/dashboard/lab-requests",
  lab: "/dashboard/lab",
  pharmacy: "/dashboard/pharmacy",
  inventory: "/dashboard/inventory",
  purchase_orders: "/dashboard/purchase-orders",

  // ── Media ───────────────────────────────────────────────────────────────────
  media_library: "/dashboard/media-library",

  // ── Patient Portal ──────────────────────────────────────────────────────────
  my_appointments: "/dashboard/my-appointments",
  my_records: "/dashboard/my-records",
  my_prescriptions: "/dashboard/my-prescriptions",
  lab_results: "/dashboard/lab-results",
  vitals_history: "/dashboard/vitals-history",
  bills_payments: "/dashboard/bills-payments",
  my_insurance: "/dashboard/my-insurance",
  download_reports: "/dashboard/download-reports",

  // ── Communication ───────────────────────────────────────────────────────────
  notifications: "/dashboard/notifications",
  announcements: "/dashboard/announcements",
  support: "/dashboard/support",

  // ── Platform (clinic-level) ─────────────────────────────────────────────────
  integrations: "/dashboard/integrations",
  workflows: "/dashboard/workflows",
  branches: "/dashboard/branches",

  // ── System ──────────────────────────────────────────────────────────────────
  audit: "/dashboard/audit",
  profile: "/dashboard/profile",
  settings: "/dashboard/settings",
};

// ─── NAV SECTIONS ─────────────────────────────────────────────────────────────

export const NAV_SECTIONS = [

  // ════════════════════════════════════════════════════════════
  // SUPER ADMIN — completely isolated sections
  // ════════════════════════════════════════════════════════════
  {
    label: "Overview",
    superAdminOnly: true,
    items: [
      { key: "admin_dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["super_admin"] },
    ],
  },
  {
    label: "Platform Management",
    superAdminOnly: true,
    items: [
      { key: "admin_clinics", label: "Clinics", icon: Building2, roles: ["super_admin"] },
      { key: "admin_users", label: "All Users", icon: Users, roles: ["super_admin"] },
      { key: "admin_plans", label: "Plans & Pricing", icon: Package, roles: ["super_admin"] },
      { key: "admin_integrations", label: "Integrations", icon: Plug, roles: ["super_admin"] },
      { key: "admin_workflows", label: "Workflows", icon: Workflow, roles: ["super_admin"] },
    ],
  },
  {
    label: "Platform Finance",
    superAdminOnly: true,
    items: [
      { key: "admin_revenue", label: "Platform Revenue", icon: Banknote, roles: ["super_admin"] },
      { key: "admin_financial", label: "Financial Reports", icon: BarChart2, roles: ["super_admin"] },
      { key: "admin_reports", label: "Reports", icon: BarChart2, roles: ["super_admin"] },
    ],
  },
  {
    label: "Platform System",
    superAdminOnly: true,
    items: [
      { key: "admin_announcements", label: "Announcements", icon: Megaphone, roles: ["super_admin"] },
      { key: "admin_notifications", label: "Notifications", icon: Bell, roles: ["super_admin"] },
      { key: "admin_audit", label: "Audit Log", icon: ShieldCheck, roles: ["super_admin"] },
      { key: "admin_settings", label: "Settings", icon: Settings, roles: ["super_admin"] },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // CLINIC ROLES — all non-super_admin roles below
  // ════════════════════════════════════════════════════════════
  {
    label: "Main",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "doctor", "receptionist"],
      },
      {
        key: "appointments",
        label: "Appointments",
        icon: CalendarDays,
        badge: "14",
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "doctor", "receptionist"],
      },
      {
        key: "patients",
        label: "Patients",
        icon: Users,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "doctor", "receptionist"],
      },
      {
        key: "register_patient",
        label: "Register Patient",
        icon: UserPlus,
        roles: ["receptionist", "owner", "clinic_owner", "clinic_manager", "branch_manager"],
      },
      {
        key: "queue",
        label: "Live Queue",
        icon: Clock,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "receptionist"],
      },
      {
        key: "consultations",
        label: "Consultations",
        icon: Stethoscope,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "doctor"],
      },
      {
        key: "medical_records",
        label: "Medical Records",
        icon: ClipboardList,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "doctor", "receptionist"],
      },
      {
        key: "patient_notes",
        label: "Patient Notes",
        icon: FileHeart,
        roles: ["doctor"],
      },
      {
        key: "triage",
        label: "Triage",
        icon: AlertTriangle,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "doctor"],
      },
      {
        key: "ward",
        label: "Ward & Beds",
        icon: BedDouble,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager"],
      },
      {
        key: "vitals",
        label: "Vitals & Triage",
        icon: ScanHeart,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "doctor"],
      },
      {
        key: "admissions",
        label: "Admissions",
        icon: CalendarCheck,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "doctor", "receptionist"],
      },
      {
        key: "staff",
        label: "Staff",
        icon: UserRoundCog,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager"],
      },
      {
        key: "shifts",
        label: "Shifts & Schedules",
        icon: CalendarCheck,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager"],
      },
      {
        key: "doctor_schedules",
        label: "Doctor Schedules",
        icon: CalendarDays,
        roles: ["receptionist"],
      },
      {
        key: "tasks",
        label: "Tasks & Reminders",
        icon: ClipboardCheck,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "doctor", "receptionist"],
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        key: "billing",
        label: "Billing & Invoices",
        icon: Receipt,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "receptionist"],
      },
      {
        key: "payments",
        label: "Payments",
        icon: Banknote,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "receptionist"],
      },
      {
        key: "generate_receipt",
        label: "Generate Receipt",
        icon: FileText,
        roles: ["receptionist", "owner", "clinic_owner", "clinic_manager", "branch_manager"],
      },
      {
        key: "insurance_claims",
        label: "Insurance & HMO",
        icon: Shield,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "receptionist"],
      },
      {
        key: "expenses",
        label: "Expenses",
        icon: CreditCard,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager"],
      },
      {
        key: "clinic_subscription",
        label: "My Subscription",
        icon: Package,
        roles: ["owner", "clinic_owner"],
      },
      {
        key: "reports",
        label: "Reports",
        icon: BarChart2,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager"],
      },
    ],
  },
  {
    label: "Clinical",
    items: [
      {
        key: "prescriptions",
        label: "Prescriptions",
        icon: Pill,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "doctor"],
      },
      {
        key: "lab_requests",
        label: "Lab Requests",
        icon: ClipboardList,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "doctor", "receptionist"],
      },
      {
        key: "lab",
        label: "Laboratory",
        icon: FlaskConical,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "doctor"],
      },
      {
        key: "pharmacy",
        label: "Pharmacy",
        icon: Pill,
        dot: true,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "doctor"],
      },
    ],
  },
  {
    label: "Media",
    items: [
      {
        key: "media_library",
        label: "Media Library",
        icon: FolderOpen,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "doctor"],
      }
    ],
  },
  {
    label: "Patient Portal",
    items: [
      { key: "my_appointments", label: "My Appointments", icon: CalendarPlus, roles: ["patient"] },
      { key: "my_records", label: "Medical Records", icon: FileHeart, roles: ["patient"] },
      { key: "my_prescriptions", label: "Prescriptions", icon: Pill, roles: ["patient"] },
      { key: "lab_results", label: "Lab Results", icon: FlaskConical, roles: ["patient"] },
      { key: "vitals_history", label: "Vitals & History", icon: HeartPulse, roles: ["patient"] },
      { key: "bills_payments", label: "Bills & Payments", icon: Receipt, roles: ["patient"] },
      { key: "my_insurance", label: "Insurance", icon: Shield, roles: ["patient"] },
      { key: "download_reports", label: "Download Reports", icon: Download, roles: ["patient"] },
    ],
  },
  {
    label: "Communication",
    items: [
      {
        key: "notifications",
        label: "Notifications",
        icon: Bell,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "doctor", "receptionist", "patient"],
      },
      {
        key: "announcements",
        label: "Announcements",
        icon: Megaphone,
        roles: ["owner", "clinic_owner", "clinic_manager"],
      },
      {
        key: "support",
        label: "Help & Support",
        icon: HelpCircle,
        roles: ["owner", "clinic_owner", "clinic_manager", "branch_manager", "doctor", "receptionist", "patient"],
      },
    ],
  },
  {
    label: "Platform",
    items: [
      {
        key: "integrations",
        label: "Integrations",
        icon: Plug,
        roles: ["owner", "clinic_owner", "clinic_manager"],
      },
      {
        key: "workflows",
        label: "Workflows",
        icon: Workflow,
        roles: ["owner", "clinic_owner", "clinic_manager"],
      },
      {
        key: "branches",
        label: "Branches",
        icon: GitBranch,
        roles: ["owner", "clinic_owner", "clinic_manager"],
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        key: "audit",
        label: "Audit Log",
        icon: ShieldCheck,
        roles: ["owner", "clinic_owner", "clinic_manager"],
      },
      {
        key: "profile",
        label: "My Profile",
        icon: UserCircle,
        roles: ["doctor", "patient", "receptionist", "owner", "clinic_owner", "clinic_manager", "branch_manager"],
      },
      {
        key: "settings",
        label: "Settings",
        icon: Settings,
        roles: ["owner", "clinic_owner", "clinic_manager", "doctor", "receptionist", "patient"],
      },
    ],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function getNavForRoles(userRoles = []) {
  const normalize = (r) => r.toLowerCase().replace(/\s+/g, "_");
  const roles = (Array.isArray(userRoles) ? userRoles : [userRoles]).map(normalize);
  const isSuperAdmin = roles.includes("super_admin");

  return NAV_SECTIONS
    .filter((section) => {
      // super admin only sees superAdminOnly sections
      if (isSuperAdmin) return section.superAdminOnly === true;
      // clinic roles never see superAdminOnly sections
      if (section.superAdminOnly) return false;
      return true;
    })
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.roles.some((r) => roles.includes(r))
      ),
    }))
    .filter((s) => s.items.length > 0);
}