import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/UserContext';

const Navigation: React.FC = () => {
  const { loggedIn } = useAuth();
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar
      expand="sm"
      className="bg-body-secondary"
      fixed="top"
      expanded={expanded}
      collapseOnSelect
      onSelect={() => setExpanded(false)}
    >
      <Container>
        <Navbar.Brand
          as={NavLink}
          to="/"
          onClick={() => setExpanded(false)}
        >
          ShowBrain
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" onClick={() => setExpanded(false)}>
              Home
            </Nav.Link>
            {loggedIn ? (
              <Nav.Link
                as={NavLink}
                to="/dashboard"
                onClick={() => setExpanded(false)}
              >
                Dashboard
              </Nav.Link>
            ) : (
              <Nav.Link
                as={NavLink}
                to="/login"
                onClick={() => setExpanded(false)}
              >
                Login
              </Nav.Link>
            )}
            <Nav.Link as={NavLink} to="/blog" onClick={() => setExpanded(false)}>
              Blog
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about" onClick={() => setExpanded(false)}>
              About
            </Nav.Link>
            <Nav.Link as={NavLink} to="/help" onClick={() => setExpanded(false)}>
              Help
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;