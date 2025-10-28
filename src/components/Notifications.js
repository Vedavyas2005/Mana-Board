import React, { useEffect, useState } from "react";
import client from "../api";
import { Card, Form, Button, ListGroup } from "react-bootstrap";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await client.get("/notifications");
      setItems(res.data.notifications || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function add(e) {
    e.preventDefault();
    try {
      await client.post("/notifications", { text });
      setText("");
      load();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Notifications</Card.Title>
        <Form onSubmit={add} className="mb-3">
          <Form.Control placeholder="New notification" value={text} onChange={(e)=>setText(e.target.value)} />
          <Button type="submit" className="mt-2">Add</Button>
        </Form>

        <ListGroup>
          {items.length === 0 && <ListGroup.Item>No notifications</ListGroup.Item>}
          {items.map((n, i) => <ListGroup.Item key={i}>{n}</ListGroup.Item>)}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
