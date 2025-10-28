import React, { useEffect, useState } from "react";
import client from "../api";
import { Card, Form, Button, ListGroup } from "react-bootstrap";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({ name: "", price: 0, details: "" });
  const role = localStorage.getItem("USER_ROLE");

  useEffect(() => {
    fetchPlans();
  }, []);

  async function fetchPlans() {
    try {
      const res = await client.get("/plans");
      setPlans(res.data.plans || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function addPlan(e) {
    e.preventDefault();
    try {
      await client.post("/plans", form);
      setForm({ name: "", price: 0, details: "" });
      fetchPlans();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Plans & Add-ons</Card.Title>

        {role === "admin" && (
          <Form onSubmit={addPlan} className="mb-3">
            <Form.Group className="mb-2">
              <Form.Label>Plan name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Details</Form.Label>
              <Form.Control name="details" value={form.details} onChange={(e)=>setForm({...form,details:e.target.value})} />
            </Form.Group>
            <Button type="submit">Add Plan (admin)</Button>
          </Form>
        )}

        <h6>Available plans</h6>
        <ListGroup>
          {plans.length === 0 && <ListGroup.Item>No plans available</ListGroup.Item>}
          {plans.map((p, i) => <ListGroup.Item key={i}>{p.name} — {p.price}</ListGroup.Item>)}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
