import React, { useEffect, useState } from "react";
import client from "../api";
import { Card, ListGroup } from "react-bootstrap";

export default function UserDashboard() {
  const [data, setData] = useState(null);
  const email = localStorage.getItem("USER_EMAIL");

  useEffect(() => {
    async function load() {
      try {
        const res = await client.get("/user/dashboard", { params: { email } });
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [email]);

  return (
    <Card>
      <Card.Body>
        <Card.Title>My Dashboard</Card.Title>
        {!data ? <div>Loading...</div> : (
          <>
            <p><strong>{data.email}</strong></p>
            <h6>Notifications</h6>
            <ListGroup className="mb-3">
              {data.notifications && data.notifications.map((n, i) => <ListGroup.Item key={i}>{n}</ListGroup.Item>)}
            </ListGroup>

            <h6>Plans</h6>
            <ListGroup>
              {data.plans && data.plans.map((p, i) => <ListGroup.Item key={i}>{p.name} — {p.renewal || p.status}</ListGroup.Item>)}
            </ListGroup>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
