import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/UseAuth";
import { useClinicStore } from "../store/store";
import Header from "./Header";
import Sidebar from "./Sidebar";
import AppLoader from "../components/ui/loaders/AppLoader";
import { LayoutDashboard, CalendarDays, Users, Receipt, Settings } from "lucide-react";

const BOTTOM_NAV = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
  { icon: CalendarDays, label: "Schedule", href: "/dashboard/appointments" },
  { icon: Users, label: "Patients", href: "/dashboard/patients" },
  { icon: Receipt, label: "Billing", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clinicsFetched, setClinicsFetched] = useState(false);

  const { user, loadingUser } = useAuth();
  const { clinics, initialize, fetchClinics, initialized } = useClinicStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) initialize();
  }, [initialized, initialize]);

  useEffect(() => {
    if (!loadingUser && user) {
      fetchClinics()
        .catch(() => {})
        .finally(() => setClinicsFetched(true));
    }
  }, [user, loadingUser, fetchClinics]);

  useEffect(() => {
    if (!initialized || loadingUser || !clinicsFetched) return;
    if (clinics.length === 0) {
      navigate("/reg/clinic", { replace: true });
    }
  }, [clinics, initialized, loadingUser, clinicsFetched, navigate]);

  if (loadingUser || !initialized || !clinicsFetched) return <AppLoader />;

  return (
    <div className="flex h-screen overflow-hidden relative bg-paper">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-[72px] lg:pb-6">
          <Outlet />
        </main>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-[45] flex lg:hidden border-t"
        style={{
          background: "#0D1117",
          borderColor: "rgba(255,255,255,0.08)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {BOTTOM_NAV.map(({ icon: Icon, label, href }) => (
          <button
            key={label}
            onClick={() => navigate(href)}
            className="flex-1 flex flex-col items-center gap-[3px] py-2.5 pb-2 text-[10px] transition-colors text-gray-500 bg-transparent border-none cursor-pointer text-slate hover:text-sage"
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}