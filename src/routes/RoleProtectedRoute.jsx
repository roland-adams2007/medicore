import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth/UseAuth";

export default function RoleProtectedRoute({ allowedRoles = [] }) {
    const { user } = useAuth();

    const normalize = (r) => (r ?? "").toLowerCase().replace(/\s+/g, "_");

    const rawRoles = Array.isArray(user?.roles)
        ? user.roles
        : [user?.role].filter(Boolean);

    const userRoles = rawRoles.map(normalize);
    const allowed = allowedRoles.map(normalize);

    const hasAccess = userRoles.some((r) => allowed.includes(r));

    if (!hasAccess) {
        return <Navigate to="/not-allowed" replace />;
    }

    return <Outlet />;
}