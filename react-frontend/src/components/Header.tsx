import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Header: React.FC = () => {
  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <Navbar.Brand href="/" className="navbar-brand">
          <img 
            src="/assets/images/braintest-logo.png" 
            alt="BrainTest Music Logo" 
            className="logo-image"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const logoText = e.currentTarget.nextElementSibling as HTMLElement;
              if (logoText) logoText.style.display = 'inline';
            }}
          />
          <span className="logo-text" style={{display: 'none'}}>🧠 BrainTest Music</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/login" className="btn-login" style={{border: '2px solid #472A76', background: 'transparent', cursor: 'pointer'}}>
              Log in
            </Nav.Link>
            <Nav.Link href="/signup" className="btn-signup" style={{border: 'none', cursor: 'pointer'}}>
              Sign up
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
