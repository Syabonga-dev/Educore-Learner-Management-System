import EducoreNavbar from "../components/Navbar";
import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <Container className="mt-4">
      <h3>Unauthorized</h3>
      <p>You do not have access to this page.</p>
      <Button onClick={()=>navigate("/login")}>Go to Login</Button>
    </Container>
  );
}
