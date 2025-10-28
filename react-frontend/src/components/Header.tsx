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
    navigate('/signup'); // ✅ Now routes to signup page
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="navbar fixed-navbar">
      <Container fluid className="px-5">
        <Navbar.Brand
          className="navbar-brand d-flex align-items-center"
          style={{ cursor: 'pointer', marginLeft: '80px' }}
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
          <span className="logo-text" style={{ display: 'none' }}>
            🧠 BrainTest Music
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            className="ms-auto d-flex align-items-center"
            style={{ marginRight: '80px' }}
          >
            {location.pathname !== '/login' && (
              <button className="btn-login me-3" onClick={handleLoginClick}>
                Log in
              </button>
            )}
            <button className="btn-signup" onClick={handleSignUpClick}>
              Sign up
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
