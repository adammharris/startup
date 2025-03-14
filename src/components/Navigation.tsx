import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/UserContext';

const Navigation: React.FC = () => {
  const { loggedIn } = useAuth();
  
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
};

export default Navigation;