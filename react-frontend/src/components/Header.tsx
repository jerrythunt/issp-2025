import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Header: React.FC = () => {
  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <Navbar.Brand href="#" className="navbar-brand">
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
            <button 
              className="btn-login" 
              onClick={() => alert('Login functionality coming soon!')}
              style={{border: '2px solid #472A76', background: 'transparent', cursor: 'pointer'}}
            >
              Log in
            </button>
            <button 
              className="btn-signup" 
              onClick={() => alert('Sign up functionality coming soon!')}
              style={{border: 'none', cursor: 'pointer'}}
            >
              Sign up
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;