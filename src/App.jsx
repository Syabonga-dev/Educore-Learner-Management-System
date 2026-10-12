import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import LecturerDashboard from "./pages/LecturerDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import NotFound from "./pages/NotFound.jsx";

import RequireAuth from "./components/RequireAuth.jsx";

import {
  getUserFromToken,
  isAuthenticated,
} from "./services/auth";

import "./styles/educore.css";

function DashboardRedirect() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUserFromToken();
  const role = Array.isArray(user?.role)
    ? user.role[0]
    : user?.role;

  switch ((role || "").toLowerCase()) {
    case "admin":
      return <Navigate to="/dashboard/admin" replace />;

    case "lecturer":
      return <Navigate to="/dashboard/lecturer" replace />;

    case "student":
      return <Navigate to="/dashboard/student" replace />;

    default:
      return <Navigate to="/unauthorized" replace />;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        <Route
          path="/dashboard"
          element={<DashboardRedirect />}
        />

        <Route
          element={
            <RequireAuth
              allowedRoles={["Admin"]}
            />
          }
        >
          <Route
            path="/dashboard/admin"
            element={<AdminDashboard />}
          />
        </Route>

        <Route
          element={
            <RequireAuth
              allowedRoles={["Lecturer"]}
            />
          }
        >
          <Route
            path="/dashboard/lecturer"
            element={<LecturerDashboard />}
          />
        </Route>

        <Route
          element={
            <RequireAuth
              allowedRoles={["Student"]}
            />
          }
        >
          <Route
            path="/dashboard/student"
            element={<StudentDashboard />}
          />
        </Route>

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}