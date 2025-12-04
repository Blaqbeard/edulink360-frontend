import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const normalizedUserRole = (user.role || "").toUpperCase();
  const normalizedAllowedRoles = allowedRoles
    ? allowedRoles.map((role) => role.toUpperCase())
    : null;

  if (
    normalizedAllowedRoles &&
    !normalizedAllowedRoles.includes(normalizedUserRole)
  ) {
    const fallbackRoute =
      normalizedUserRole === "TEACHER" ? "/teacher/dashboard" : "/";
    return <Navigate to={fallbackRoute} replace />;
  }

  return children;
};

export default ProtectedRoute;
