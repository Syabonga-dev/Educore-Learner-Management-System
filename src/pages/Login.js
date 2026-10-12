import EducoreNavbar from "../components/Navbar";
import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";
import { login, setToken, getUserFromToken } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
  e.preventDefault();
  setErr("");
  setLoading(true);
  try {
    const data = await login(email, password);

    const token = data.token;
    if (!token) throw new Error("No token returned from server");
    setToken(token);

    
    const role = data.authRole?.toLowerCase();

    if (role === "admin") navigate("/dashboard/admin");
    else if (role === "lecturer") navigate("/dashboard/lecturer");
    else navigate("/dashboard/student");

  } catch (error) {
    setErr(error.message || "Login error");
  } finally {
    setLoading(false);
  }
};

  
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6} lg={5}>
          <Card>
            <Card.Body>
              <h3 className="mb-3">Educore Login</h3>
              {err && <Alert variant="danger">{err}</Alert>}
              <Form onSubmit={submit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" required value={email}
                    onChange={(e)=>setEmail(e.target.value)} placeholder="name@domain.com" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" required value={password}
                    onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
