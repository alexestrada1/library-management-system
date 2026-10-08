import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

// Wraps pages that need a login.
// Not logged in? Redirect to /login. Logged in? Show the page inside.
function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // "put the child page here"
}

export default ProtectedRoute;
