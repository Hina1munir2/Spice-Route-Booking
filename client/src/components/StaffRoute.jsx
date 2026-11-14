
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function StaffRoute() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "staff") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default StaffRoute;
