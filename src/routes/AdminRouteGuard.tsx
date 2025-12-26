import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AdminRouteGuard({ children }: { children: React.ReactElement }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const role = user?.role?.toLowerCase();
  if (role !== "super_admin" && role !== "adm") {
    return <Navigate to="/app" replace />;
  }

  return children;
}
