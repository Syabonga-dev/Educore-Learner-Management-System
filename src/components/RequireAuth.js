import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getUserFromToken } from "../services/auth";

export default function RequireAuth({ allowedRoles }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const user = getUserFromToken();

  // Get roles from token
  const roles = user?.role 
              || user?.roles 
              || user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  // Normalize to array
  const normalizedRoles = Array.isArray(roles) ? roles : [roles];

  // If no allowedRoles provided => allow any authenticated user
  if (!allowedRoles || allowedRoles.length === 0) return <Outlet />;

  // Check if user has at least one allowed role
  const ok = normalizedRoles.some(r =>
    allowedRoles.map(x => x.toLowerCase()).includes((r || "").toLowerCase())
  );

  if (!ok) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
