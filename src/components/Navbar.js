import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { getUserFromToken, logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function EducoreNavbar() {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const role =
    user?.authRole ||
    user?.role ||
    user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>Educore LMS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {role?.toLowerCase() === "admin" && (
              <Nav.Link onClick={() => navigate("/dashboard/admin")}>
                Admin Dashboard
              </Nav.Link>
            )}
            {role?.toLowerCase() === "lecturer" && (
              <Nav.Link onClick={() => navigate("/dashboard/lecturer")}>
                Lecturer Dashboard
              </Nav.Link>
            )}
            {role?.toLowerCase() === "student" && (
              <Nav.Link onClick={() => navigate("/dashboard/student")}>
                Student Dashboard
              </Nav.Link>
            )}
          </Nav>
          <div className="d-flex align-items-center text-white">
            <span className="me-3">{user?.email}</span>
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
