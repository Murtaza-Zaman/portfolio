import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";

export function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (!token) {
    return <Navigate replace state={{ from: location.pathname }} to="/admin/login" />;
  }

  return <Outlet />;
}