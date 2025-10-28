import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getUserFromStorage, clearUserStorage } from "../utils/auth";

export default function TopNav() {
  const navigate = useNavigate();
  const user = getUserFromStorage();

  function logout() {
    clearUserStorage();
    navigate("/login");
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Mana Dashboard</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
        </Nav>

        <Nav>
          {!user.email ? (
            <>
              <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/dashboard">{user.email}</Nav.Link>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
