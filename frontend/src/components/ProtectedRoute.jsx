import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Only the logged-in admin can see the pages nested inside this route
export default function ProtectedRoute() {
  const token = useSelector((s) => s.auth.token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
