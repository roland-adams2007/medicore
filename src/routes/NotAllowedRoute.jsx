// Create a new component: components/NotAllowedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth/UseAuth";
import { useClinicStore } from "../store/store";

export default function NotAllowedRoute({ children }) {
  const { user } = useAuth();
  const { selectedClinic } = useClinicStore();

  // Check if user has ANY role (meaning they should be in the app)
  const hasAnyRole = selectedClinic?.roles?.length > 0 || 
                     selectedClinic?.role || 
                     user?.roles?.length > 0;

  // If user has any role, redirect them away from not-allowed page
  if (hasAnyRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise show the not-allowed page
  return children;
}