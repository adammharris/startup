import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useLocation } from 'react-router-dom'

function Navigation() {
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('email')));

  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem('username')));
  }, [location]);

  return (
    <Navbar expand="sm" className="bg-body-secondary" fixed="top">
      <Container>
        <Navbar.Brand>ShowBrain</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            {loggedIn ? (
              <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
            ) : (
              <Nav.Link as={NavLink} to="login">Login</Nav.Link>
            )}
            <Nav.Link as={NavLink} to="blog">Blog</Nav.Link>
            <Nav.Link as={NavLink} to="about">About</Nav.Link>
            <Nav.Link as={NavLink} to="help">Help</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;