import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Auth/UseAuth";

export default function ProtectedRoute() {
  const { user, loadingUser } = useAuth();
  const location = useLocation();

  if (loadingUser) return null; // ← Suspense fallback above is already showing AppLoader

  if (!user) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectTo}`} replace />;
  }

  return <Outlet />;
}