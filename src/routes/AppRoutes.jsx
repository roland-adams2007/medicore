import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../layouts/Layout";
import NotFound from "../components/errors/NotFound";
import AppLoader from "../components/ui/loaders/AppLoader";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import HomePage from "../pages/HomePage";
import RegClinic from "../pages/RegClinic";
import Dashboard from "../pages/Dashboard";
import NotAllowed from "../components/errors/NotAllowed";
import NotAllowedRoute from "./NotAllowedRoute";
import { useAuth } from "../context/Auth/UseAuth";

// ─── Lazy pages ────────────────────────────────────────────────────────────────
const Login = lazy(() => import("../components/auth/Login"));
const Register = lazy(() => import("../components/auth/Register"));
const VerifyEmail = lazy(() => import("../components/auth/VerifyEmail"));
const StaffInvite = lazy(() => import("../components/staffs/StaffInvite"));

// Main
// const Appointments   = lazy(() => import("../pages/Appointments"));
// const Patients       = lazy(() => import("../pages/Patients"));
// const RegisterPatient= lazy(() => import("../pages/RegisterPatient"));
// const Queue          = lazy(() => import("../pages/Queue"));
// const Consultations  = lazy(() => import("../pages/Consultations"));
// const MedicalRecords = lazy(() => import("../pages/MedicalRecords"));
// const PatientNotes   = lazy(() => import("../pages/PatientNotes"));
// const Triage         = lazy(() => import("../pages/Triage"));
// const Ward           = lazy(() => import("../pages/Ward"));
// const Vitals         = lazy(() => import("../pages/Vitals"));
// const Admissions     = lazy(() => import("../pages/Admissions"));
const Staff = lazy(() => import("../pages/Staff"));
// const Shifts         = lazy(() => import("../pages/Shifts"));
// const DoctorSchedules= lazy(() => import("../pages/DoctorSchedules"));
// const Tasks          = lazy(() => import("../pages/Tasks"));

// Finance
// const Billing        = lazy(() => import("../pages/Billing"));
// const Payments       = lazy(() => import("../pages/Payments"));
// const GenerateReceipt= lazy(() => import("../pages/GenerateReceipt"));
// const InsuranceClaims= lazy(() => import("../pages/InsuranceClaims"));
// const Expenses       = lazy(() => import("../pages/Expenses"));
// const Subscription   = lazy(() => import("../pages/Subscription"));
// const Reports        = lazy(() => import("../pages/Reports"));

// // Clinical
// const Prescriptions  = lazy(() => import("../pages/Prescriptions"));
// const LabRequests    = lazy(() => import("../pages/LabRequests"));
// const Lab            = lazy(() => import("../pages/Lab"));
// const Pharmacy       = lazy(() => import("../pages/Pharmacy"));
// const Inventory      = lazy(() => import("../pages/Inventory"));
// const PurchaseOrders = lazy(() => import("../pages/PurchaseOrders"));

// // Media
// const MediaLibrary   = lazy(() => import("../pages/MediaLibrary"));
// const PatientImages  = lazy(() => import("../pages/PatientImages"));
// const ScanUploads    = lazy(() => import("../pages/ScanUploads"));
// const Documents      = lazy(() => import("../pages/Documents"));
// const ConsentForms   = lazy(() => import("../pages/ConsentForms"));

// // Patient Portal
// const MyAppointments = lazy(() => import("../pages/MyAppointments"));
// const MyRecords      = lazy(() => import("../pages/MyRecords"));
// const MyPrescriptions= lazy(() => import("../pages/MyPrescriptions"));
// const LabResults     = lazy(() => import("../pages/LabResults"));
// const VitalsHistory  = lazy(() => import("../pages/VitalsHistory"));
// const BillsPayments  = lazy(() => import("../pages/BillsPayments"));
// const MyInsurance    = lazy(() => import("../pages/MyInsurance"));
// const DownloadReports= lazy(() => import("../pages/DownloadReports"));

// // Communication
// const Notifications  = lazy(() => import("../pages/Notifications"));
// const Announcements  = lazy(() => import("../pages/Announcements"));
// const Support        = lazy(() => import("../pages/Support"));

// // Platform
// const Integrations   = lazy(() => import("../pages/Integrations"));
// const Workflows      = lazy(() => import("../pages/Workflows"));
// const Branches       = lazy(() => import("../pages/Branches"));

// // System
// const Audit          = lazy(() => import("../pages/Audit"));
// const Profile        = lazy(() => import("../pages/Profile"));
// const Settings       = lazy(() => import("../pages/Settings"));

// // Super Admin
// const AdminDashboard    = lazy(() => import("../pages/admin/AdminDashboard"));
// const AdminClinics      = lazy(() => import("../pages/admin/AdminClinics"));
// const AdminUsers        = lazy(() => import("../pages/admin/AdminUsers"));
// const AdminPlans        = lazy(() => import("../pages/admin/AdminPlans"));
// const AdminRevenue      = lazy(() => import("../pages/admin/AdminRevenue"));
// const AdminFinancial    = lazy(() => import("../pages/admin/AdminFinancial"));
// const AdminReports      = lazy(() => import("../pages/admin/AdminReports"));
// const AdminIntegrations = lazy(() => import("../pages/admin/AdminIntegrations"));
// const AdminWorkflows    = lazy(() => import("../pages/admin/AdminWorkflows"));
// const AdminAudit        = lazy(() => import("../pages/admin/AdminAudit"));
// const AdminAnnouncements= lazy(() => import("../pages/admin/AdminAnnouncements"));
// const AdminNotifications= lazy(() => import("../pages/admin/AdminNotifications"));
// const AdminSettings     = lazy(() => import("../pages/admin/AdminSettings"));

// ─── Role shorthands ──────────────────────────────────────────────────────────
const SUPER_ADMIN = ["super_admin"];
const OWNERS = ["owner", "clinic_owner"];
const MANAGERS = ["owner", "clinic_owner", "clinic_manager"];
const BRANCH_UP = ["owner", "clinic_owner", "clinic_manager", "branch_manager"];
const DOCTOR_UP = [...BRANCH_UP, "doctor"];
const ALL_STAFF = [...DOCTOR_UP, "receptionist"];
const PATIENT_ONLY = ["patient"];
const ALL_ROLES = [...ALL_STAFF, "patient"];

export default function AppRoutes() {
  const { loadingUser } = useAuth();
  if (loadingUser) return <AppLoader />;
  return (
    <Suspense fallback={<AppLoader />}>
      <Routes>

        {/* ── Public ──────────────────────────────────────────────────────── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/staff/invite/accept" element={<StaffInvite />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/reg" element={<Register />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
        </Route>

        {/* ── Protected (auth required) ────────────────────────────────────── */}
        <Route element={<ProtectedRoute />}>

          {/* Clinic registration — any authenticated user */}
          <Route path="/reg/clinic" element={<RegClinic />} />

          {/* ── Super Admin ─────────────────────────────────────────────────── */}
          {/* <Route element={<RoleProtectedRoute allowedRoles={SUPER_ADMIN} />}>
            <Route path="/admin"                         element={<AdminDashboard />} />
            <Route path="/admin/clinics"                 element={<AdminClinics />} />
            <Route path="/admin/users"                   element={<AdminUsers />} />
            <Route path="/admin/plans"                   element={<AdminPlans />} />
            <Route path="/admin/revenue"                 element={<AdminRevenue />} />
            <Route path="/admin/financial-reports"       element={<AdminFinancial />} />
            <Route path="/admin/reports"                 element={<AdminReports />} />
            <Route path="/admin/integrations"            element={<AdminIntegrations />} />
            <Route path="/admin/workflows"               element={<AdminWorkflows />} />
            <Route path="/admin/audit"                   element={<AdminAudit />} />
            <Route path="/admin/announcements"           element={<AdminAnnouncements />} />
            <Route path="/admin/notifications"           element={<AdminNotifications />} />
            <Route path="/admin/settings"                element={<AdminSettings />} />
          </Route> */}

          {/* ── Clinic Dashboard (Layout wrapper) ───────────────────────────── */}
          <Route element={<Layout />}>

            {/* Dashboard — all clinic staff */}
            <Route element={<RoleProtectedRoute allowedRoles={BRANCH_UP.concat(["doctor", "receptionist"])} />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* ── Main ─────────────────────────────────────────────────────── */}
            {/* <Route element={<RoleProtectedRoute allowedRoles={ALL_STAFF} />}>
              <Route path="/dashboard/appointments"  element={<Appointments />} />
              <Route path="/dashboard/patients"      element={<Patients />} />
              <Route path="/dashboard/medical-records" element={<MedicalRecords />} />
              <Route path="/dashboard/admissions"    element={<Admissions />} />
              <Route path="/dashboard/tasks"         element={<Tasks />} />
            </Route> */}

            {/* <Route element={<RoleProtectedRoute allowedRoles={[...BRANCH_UP, "receptionist"]} />}>
              <Route path="/dashboard/register-patient" element={<RegisterPatient />} />
              <Route path="/dashboard/queue"            element={<Queue />} />
            </Route>

            <Route element={<RoleProtectedRoute allowedRoles={DOCTOR_UP} />}>
              <Route path="/dashboard/consultations"  element={<Consultations />} />
              <Route path="/dashboard/triage"         element={<Triage />} />
              <Route path="/dashboard/vitals"         element={<Vitals />} />
            </Route> */}

            {/* <Route element={<RoleProtectedRoute allowedRoles={["doctor"]} />}>
              <Route path="/dashboard/patient-notes" element={<PatientNotes />} />
            </Route> */}

            <Route element={<RoleProtectedRoute allowedRoles={BRANCH_UP} />}>
              {/* <Route path="/dashboard/ward"           element={<Ward />} /> */}
              <Route path="/dashboard/staff" element={<Staff />} />
              {/* <Route path="/dashboard/shifts"         element={<Shifts />} /> */}
            </Route>
            {/* 
            <Route element={<RoleProtectedRoute allowedRoles={["receptionist"]} />}>
              <Route path="/dashboard/doctor-schedules" element={<DoctorSchedules />} />
            </Route>

            {/* ── Finance ──────────────────────────────────────────────────── */}
            {/* <Route element={<RoleProtectedRoute allowedRoles={[...BRANCH_UP, "receptionist"]} />}>
              <Route path="/dashboard/billing"          element={<Billing />} />
              <Route path="/dashboard/payments"         element={<Payments />} />
              <Route path="/dashboard/generate-receipt" element={<GenerateReceipt />} />
              <Route path="/dashboard/insurance-claims" element={<InsuranceClaims />} />
            </Route> */}

            {/* <Route element={<RoleProtectedRoute allowedRoles={BRANCH_UP} />}>
              <Route path="/dashboard/expenses" element={<Expenses />} />
              <Route path="/dashboard/reports"  element={<Reports />} />
            </Route> */}
            {/* 
            <Route element={<RoleProtectedRoute allowedRoles={OWNERS} />}>
              <Route path="/dashboard/subscription" element={<Subscription />} />
            </Route> */}

            {/* ── Clinical ─────────────────────────────────────────────────── */}
            {/* <Route element={<RoleProtectedRoute allowedRoles={DOCTOR_UP} />}>
              <Route path="/dashboard/prescriptions" element={<Prescriptions />} />
              <Route path="/dashboard/lab"           element={<Lab />} />
              <Route path="/dashboard/pharmacy"      element={<Pharmacy />} />
            </Route>

            <Route element={<RoleProtectedRoute allowedRoles={ALL_STAFF} />}>
              <Route path="/dashboard/lab-requests" element={<LabRequests />} />
            </Route>

            <Route element={<RoleProtectedRoute allowedRoles={BRANCH_UP} />}>
              <Route path="/dashboard/inventory"       element={<Inventory />} />
              <Route path="/dashboard/purchase-orders" element={<PurchaseOrders />} />
            </Route> */}

            {/* ── Media ────────────────────────────────────────────────────── */}
            {/* <Route element={<RoleProtectedRoute allowedRoles={DOCTOR_UP} />}>
              <Route path="/dashboard/media-library"  element={<MediaLibrary />} />
              <Route path="/dashboard/patient-images" element={<PatientImages />} />
              <Route path="/dashboard/scan-uploads"   element={<ScanUploads />} />
            </Route>

            <Route element={<RoleProtectedRoute allowedRoles={ALL_STAFF} />}>
              <Route path="/dashboard/documents"     element={<Documents />} />
              <Route path="/dashboard/consent-forms" element={<ConsentForms />} />
            </Route> */}

            {/* ── Patient Portal ────────────────────────────────────────────── */}
            {/* <Route element={<RoleProtectedRoute allowedRoles={PATIENT_ONLY} />}>
              <Route path="/dashboard/my-appointments"  element={<MyAppointments />} />
              <Route path="/dashboard/my-records"       element={<MyRecords />} />
              <Route path="/dashboard/my-prescriptions" element={<MyPrescriptions />} />
              <Route path="/dashboard/lab-results"      element={<LabResults />} />
              <Route path="/dashboard/vitals-history"   element={<VitalsHistory />} />
              <Route path="/dashboard/bills-payments"   element={<BillsPayments />} />
              <Route path="/dashboard/my-insurance"     element={<MyInsurance />} />
              <Route path="/dashboard/download-reports" element={<DownloadReports />} />
            </Route> */}

            {/* ── Communication ─────────────────────────────────────────────── */}
            {/* <Route element={<RoleProtectedRoute allowedRoles={ALL_ROLES} />}>
              <Route path="/dashboard/notifications" element={<Notifications />} />
              <Route path="/dashboard/support"       element={<Support />} />
            </Route>

            <Route element={<RoleProtectedRoute allowedRoles={MANAGERS} />}>
              <Route path="/dashboard/announcements" element={<Announcements />} />
            </Route> */}

            {/* ── Platform ──────────────────────────────────────────────────── */}
            {/* <Route element={<RoleProtectedRoute allowedRoles={MANAGERS} />}>
              <Route path="/dashboard/integrations" element={<Integrations />} />
              <Route path="/dashboard/workflows"    element={<Workflows />} />
              <Route path="/dashboard/branches"     element={<Branches />} />
            </Route> */}

            {/* ── System ────────────────────────────────────────────────────── */}
            {/* <Route element={<RoleProtectedRoute allowedRoles={MANAGERS} />}>
              <Route path="/dashboard/audit" element={<Audit />} />
            </Route>

            <Route element={<RoleProtectedRoute allowedRoles={ALL_ROLES} />}>
              <Route path="/dashboard/profile" element={<Profile />} />
            </Route>

            <Route element={<RoleProtectedRoute allowedRoles={[...ALL_STAFF, "patient"]} />}>
              <Route path="/dashboard/settings" element={<Settings />} />
            </Route>  */}

          </Route>{/* end Layout */}
        </Route>{/* end ProtectedRoute */}

        {/* ── 404 ─────────────────────────────────────────────────────────── */}
        <Route path="/not-allowed" element={<NotAllowedRoute><NotAllowed /></NotAllowedRoute>} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}