import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth/UseAuth";
import { useClinicStore } from "../store/store";

export default function RoleProtectedRoute({ allowedRoles = [] }) {
    const { user } = useAuth();
    const { selectedClinic } = useClinicStore();

    const normalize = (r) => (r ?? "").toLowerCase().replace(/\s+/g, "_");

    // Get roles from selected clinic first (like in Sidebar)
    let roles = [];

    if (selectedClinic?.roles?.length) {
        roles = selectedClinic.roles;
    } else if (selectedClinic?.role) {
        roles = [selectedClinic.role];
    } else if (user?.roles) {
        // Fallback to user roles if no clinic selected
        roles = Array.isArray(user.roles) ? user.roles : [user.role].filter(Boolean);
    }

    const userRoles = roles.map(normalize);
    const normalizedAllowed = allowedRoles.map(normalize);

    // Check if user is super_admin (has access to everything)
    const isSuperAdmin = userRoles.includes("super_admin");

    // Check if user has any of the allowed roles
    const hasAccess = isSuperAdmin || userRoles.some((r) => normalizedAllowed.includes(r));

    if (!hasAccess) {
        return <Navigate to="/not-allowed" replace />;
    }

    return <Outlet />;
}