import React, { useEffect, useState } from "react";
import client from "../api";
import { Card, Table, Alert } from "react-bootstrap";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(null);
  useEffect(() => {
    async function load() {
      try {
        const res = await client.get("/admin/users");
        setUsers(res.data.users || []);
      } catch (e) {
        setErr(e?.response?.data?.detail || "Could not load users");
      }
    }
    load();
  }, []);

  return (
    <Card>
      <Card.Body>
        <Card.Title>All Users</Card.Title>
        {err && <Alert variant="danger">{err}</Alert>}
        <Table striped bordered hover>
          <thead>
            <tr><th>Email</th><th>First</th><th>Last</th><th>Role</th></tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td>{u.email}</td>
                <td>{u.first_name || u.firstName}</td>
                <td>{u.last_name || u.lastName}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
