import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <nav className="navbar">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src="/logo.png" alt="Logo" className="logo-image" />
                    <span className="logo-text">Your App Name</span>
                </Link>
                <div className="d-flex gap-2">
                    <Link to="/login" className="btn btn-login">Login</Link>
                    <Link to="/signup" className="btn btn-signup">Sign Up</Link>
                </div>
            </div>
        </nav>
    );
};

export default Header;