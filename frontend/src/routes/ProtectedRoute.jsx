import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
    children,
    role,
    devBypass = false
}) {
    const { user } = useAuth();

    // Development bypass.
    // Only routes explicitly using devBypass={true} can skip authentication.
    if (devBypass) {
        return children;
    }

    // Normal authentication protection
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role protection
    if (role && user.role !== role) {
        return <Navigate to="/patient" replace />;
    }

    return children;
}