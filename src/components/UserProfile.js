import React, { useEffect, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import client from "../api";

export default function UserProfile() {
  const email = localStorage.getItem("USER_EMAIL");
  const [form, setForm] = useState({ email, first_name: "", last_name: "" });
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await client.get("/user/profile", { params: { email } });
        setForm({ email: res.data.email, first_name: res.data.first_name || "", last_name: res.data.last_name || "" });
      } catch (e) {
        console.error(e);
        setErr("Could not fetch profile");
      }
    }
    load();
  }, [email]);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function save(e) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    try {
      const res = await client.post("/user/profile/update", form);
      setMsg(res.data.message || "Saved");
    } catch (e) {
      setErr(e?.response?.data?.detail || "Save failed");
    }
  }

  return (
    <Card style={{ maxWidth: 700 }} className="mx-auto">
      <Card.Body>
        <Card.Title>My Profile</Card.Title>
        {err && <Alert variant="danger">{err}</Alert>}
        {msg && <Alert variant="success">{msg}</Alert>}
        <Form onSubmit={save}>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" value={form.email} disabled />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>First name</Form.Label>
            <Form.Control name="first_name" value={form.first_name} onChange={onChange} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Last name</Form.Label>
            <Form.Control name="last_name" value={form.last_name} onChange={onChange} />
          </Form.Group>

          <Button type="submit">Save Changes</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
