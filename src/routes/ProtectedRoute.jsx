import { Outlet, Navigate, useLocation } from "react-router-dom";
import AppLoader from "../components/ui/loaders/AppLoader";
import { useAuth } from "../context/Auth/UseAuth";

export default function ProtectedRoute() {
  const { user, loadingUser } = useAuth();
  const location = useLocation();

  // Show loader while checking auth
  if (loadingUser) {
    return <AppLoader />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectTo}`} replace />;
  }

  // Render protected content
  return <Outlet />;
}