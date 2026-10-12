import React from "react";
import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  getUserFromToken,
  isAuthenticated,
} from "../services/auth";

export default function RequireAuth({
  allowedRoles,
}) {
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const user = getUserFromToken();

  const roles = user?.role || [];

  const normalizedRoles = Array.isArray(roles)
    ? roles
    : [roles];

  if (
    !allowedRoles ||
    allowedRoles.length === 0
  ) {
    return <Outlet />;
  }

  const allowed = allowedRoles.map(
    (role) => role.toLowerCase()
  );

  const hasAccess =
    normalizedRoles.some((role) =>
      allowed.includes(
        (role || "").toLowerCase()
      )
    );

  if (!hasAccess) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <Outlet />;
}