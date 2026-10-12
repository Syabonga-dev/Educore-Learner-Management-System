import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Unauthorized from "./pages/Unauthorized";
import RequireAuth from "./components/RequireAuth";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* protected routes */}
        <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["Lecturer"]} />}>
          <Route path="/dashboard/lecturer" element={<LecturerDashboard />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["Student"]} />}>
          <Route path="/dashboard/student" element={<StudentDashboard />} />
        </Route>

        {/* generic authenticated area (any role) */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<div style={{padding:20}}>Pick your dashboard</div>} />
        </Route>

        <Route path="*" element={<div style={{padding:20}}>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
