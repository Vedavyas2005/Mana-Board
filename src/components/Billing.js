import React, { useEffect, useState } from "react";
import client from "../api";
import { Card, Form, Button, ListGroup } from "react-bootstrap";

export default function Billing() {
  const [billing, setBilling] = useState([]);
  const [form, setForm] = useState({ address: "", card_last4: "" });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await client.get("/billing");
      setBilling(res.data.billings || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function onSave(e) {
    e.preventDefault();
    try {
      await client.post("/billing", form);
      setForm({ address: "", card_last4: "" });
      load();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Billing</Card.Title>
        <Form onSubmit={onSave} className="mb-3">
          <Form.Group className="mb-2">
            <Form.Label>Address</Form.Label>
            <Form.Control value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Card last4</Form.Label>
            <Form.Control value={form.card_last4} onChange={(e)=>setForm({...form,card_last4:e.target.value})} />
          </Form.Group>
          <Button type="submit">Save Billing</Button>
        </Form>

        <h6>Saved billing</h6>
        <ListGroup>
          {billing.length === 0 && <ListGroup.Item>No billing records</ListGroup.Item>}
          {billing.map((b, i) => <ListGroup.Item key={i}>{b.address} — {b.card_last4}</ListGroup.Item>)}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
