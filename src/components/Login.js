import React, { useState } from "react";
import client from "../api";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { saveUserToStorage } from "../utils/auth";

export default function Login() {
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const nav = useNavigate();

  function onChange(e) {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await client.post("/auth/login", creds);
      const user = res?.data?.user || {};
      // Save user info to localStorage (no JWT)
      saveUserToStorage(user);
      nav("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail || "Login failed.");
    }
  }

  return (
    <Card style={{ maxWidth: 700 }} className="mx-auto">
      <Card.Body>
        <Card.Title>Login</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" value={creds.email} onChange={onChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control name="password" type="password" value={creds.password} onChange={onChange} required />
          </Form.Group>

          <Button type="submit">Login</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
