import React, { useState } from 'react';
import './Login.css';

interface LoginProps {
  onLogin?: (email: string, password: string) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onForgotPassword, onSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin) {
      onLogin(email, password);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Log in</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="email-field">
          <label className="field-label">Email</label>
          <div className="input-container">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="password-field">
          <label className="field-label">Password</label>
          <div className="input-container">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>
        </div>

        <button
          type="button"
          className="forgot-password-btn"
          onClick={onForgotPassword}
        >
          Forgot Password
        </button>

        <button type="submit" className="login-btn">
          Log in
        </button>
      </form>

      <div className="signup-section">
        <span className="signup-text">Not registered yet?</span>
        <button
          type="button"
          className="signup-btn"
          onClick={onSignUp}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;