import React, { useEffect, useState } from "react";
import client from "../api";
import { Card, ListGroup } from "react-bootstrap";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await client.get("/admin/dashboard");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <Card>
      <Card.Body>
        <Card.Title>Admin Dashboard</Card.Title>
        {!data ? <div>Loading...</div> : (
          <>
            <p>Total users: <strong>{data.total_users}</strong></p>
            <p>Active users: <strong>{data.active_users}</strong></p>
            <p>Pending: <strong>{data.pending_users}</strong></p>

            <h6>Notifications</h6>
            <ListGroup>
              {data.notifications && data.notifications.map((n, i) => <ListGroup.Item key={i}>{n}</ListGroup.Item>)}
            </ListGroup>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
