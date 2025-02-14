import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import Home from '../home/Home'
import Login from '../login/Login'
import Blog from '../blog/Blog'
import About from '../about/About'
import Help from '../help/Help'

function Navigation() {
  return (
    <BrowserRouter>
      <Navbar expand="sm" className="bg-body-secondary" fixed="top">
        <Container>
          <Navbar.Brand>ShowBrain</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="login">Login</Nav.Link>
              <Nav.Link as={Link} to="blog">Blog</Nav.Link>
              <Nav.Link as={Link} to="about">About</Nav.Link>
              <Nav.Link as={Link} to="help">Help</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/blog' element={<Blog/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/help' element={<Help/>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
function NotFound() {
  return <main className="container-fluid bg-secondary text-center m-5 p-5">404: Return to sender. Address unknown.</main>;
}

export default Navigation;