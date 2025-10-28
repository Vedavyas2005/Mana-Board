// src/components/Signup.js
import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import client from "../api";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Modal state for admin access code (masked)
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [adminError, setAdminError] = useState("");
  const ADMIN_SECRET = "DeltaAccess"; // keep this secret server-side ideally

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setRole("user");
  };

  const doSignup = async () => {
    setError("");
    try {
      const payload = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role,
      };

      const resp = await client.post("/auth/signup", payload);
      // success -> navigate to login
      if (resp && (resp.status === 200 || resp.status === 201)) {
        alert("Signup successful — please login.");
        resetForm();
        navigate("/login");
      } else {
        // backend might return 200 with body or 201; handle fallback
        alert("Signup succeeded.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup error:", err);
      // if axios error with response:
      if (err?.response?.data?.detail) {
        setError(String(err.response.data.detail));
      } else {
        setError("Signup failed. Check console for details.");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // If admin chosen, open modal to request secret (masked)
    if (role === "admin") {
      setAdminCode("");
      setAdminError("");
      setShowAdminModal(true);
      return;
    }

    // Regular user signup
    doSignup();
  };

  const handleAdminConfirm = () => {
    setAdminError("");
    // Compare secret (case-sensitive). If match -> proceed to signup.
    if (adminCode === ADMIN_SECRET) {
      setShowAdminModal(false);
      // proceed to actual signup
      doSignup();
    } else {
      setAdminError("Incorrect access code. Try again.");
      setAdminCode("");
    }
  };

  const handleAdminCancel = () => {
    // hide modal and don't sign up as admin
    setShowAdminModal(false);
    setAdminCode("");
    setAdminError("");
    // optionally reset role back to 'user' to avoid accidental admin attempts
    setRole("user");
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center py-5"
      style={{ minHeight: "80vh" }}
    >
      <Card className="p-4 shadow" style={{ maxWidth: 600, width: "100%" }}>
        <h3 className="mb-3 text-center">Create an account</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="signupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="signupFirstName">
            <Form.Label>First name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="signupLastName">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="signupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="signupRole">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              aria-label="Select role"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Form.Select>
            <Form.Text className="text-muted">
              If you select Admin, you will be prompted to enter a secret access
              code.
            </Form.Text>
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" variant="primary" size="lg">
              Sign up
            </Button>
          </div>
        </Form>

        <div className="text-center mt-3">
          <small>
            Already have an account?{" "}
            <Button variant="link" onClick={() => navigate("/login")}>
              Login
            </Button>
          </small>
        </div>
      </Card>

      {/* Admin secret modal (masked input) */}
      <Modal show={showAdminModal} onHide={handleAdminCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Admin access code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">
            Enter the admin access code to register as an admin.
            <br />
            (Input is hidden for security.)
          </p>

          <InputGroup className="mb-2">
            <Form.Control
              type="password"
              placeholder="Enter admin access code"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              autoFocus
            />
          </InputGroup>

          {adminError && <Alert variant="danger">{adminError}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAdminCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdminConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
