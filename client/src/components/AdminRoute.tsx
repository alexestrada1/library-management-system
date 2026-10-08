import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

// Only lets admins in. Must be placed INSIDE a ProtectedRoute.
function AdminRoute() {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
