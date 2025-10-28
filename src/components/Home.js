// src/components/Home.js
import React from "react";
import { Container, Card, Button, ListGroup, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* 🟦 Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="px-4">
        <Navbar.Brand href="/">Mana Dashboard</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link onClick={() => navigate("/signup")}>Signup</Nav.Link>
          <Nav.Link onClick={() => navigate("/login")}>Login</Nav.Link>
        </Nav>
      </Navbar>

      {/* 🏠 Main Section */}
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
        <Card className="shadow-lg p-4" style={{ maxWidth: "600px", width: "100%" }}>
          <h3 className="text-center mb-4 text-primary">Welcome</h3>
          <p className="text-muted text-center mb-4">
            This frontend is connected to your <strong>FastAPI + Lambda</strong> backend using the following endpoints:
          </p>

          <div className="d-flex justify-content-center gap-3">
            <Button variant="primary" onClick={() => navigate("/signup")}>
              Signup
            </Button>
            <Button variant="outline-primary" onClick={() => navigate("/login")}>
              Login
            </Button>
          </div>
        </Card>
      </Container>
    </>
  );
}

export default Home;
