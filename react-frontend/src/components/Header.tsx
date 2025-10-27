import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    alert('Sign up functionality coming soon!');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <Navbar.Brand 
          className="navbar-brand" 
          style={{ cursor: 'pointer' }}
          onClick={handleLogoClick}
        >
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
            {location.pathname !== '/login' && (
              <button 
                className="btn-login" 
                onClick={handleLoginClick}
                style={{border: '2px solid #472A76', background: 'transparent', cursor: 'pointer'}}
              >
                Log in
              </button>
            )}
            <button 
              className="btn-signup" 
              onClick={handleSignUpClick}
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