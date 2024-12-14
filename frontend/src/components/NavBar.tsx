import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';

const AppNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('user'); // Clear session storage
    navigate('/login'); // Redirect to login page
  };

  const isLoggedIn = !!sessionStorage.getItem('user'); // Check if user is logged in

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="custom-navbar">
      <Navbar.Brand href="/">Adopt-A-Pet</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <LinkContainer to="/">
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/admin/db">
            <Nav.Link>AdminDB</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/pets">
            <Nav.Link>Pets</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/appointments">
            <Nav.Link>Appointments</Nav.Link>
          </LinkContainer>
        </Nav>
        <Nav>
          {isLoggedIn ? (
            <>
              <LinkContainer to="/profile">
                <Nav.Link>Profile</Nav.Link>
              </LinkContainer>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </>
          ) : (
            <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppNavbar;
