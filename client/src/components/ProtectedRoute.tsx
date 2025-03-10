import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: ReactNode;
}

interface JwtPayload {
  exp: number; // Expiration time in seconds
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    if (decoded.exp < currentTime) {
      // Token is expired, clear it and redirect
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    // Invalid token, clear it and redirect
    console.log("Invalid token", error);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;