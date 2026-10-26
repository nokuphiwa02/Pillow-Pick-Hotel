
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

interface ProtectedRouteProps {
  allowedRole: "admin" | "guest";
}

const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const { isAuthenticated, currentUser } = useSelector(
    (state: RootState) => state.signIn
  );

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== allowedRole) {
    if (currentUser.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (currentUser.role === "guest") {
      return <Navigate to="/Guestdashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
