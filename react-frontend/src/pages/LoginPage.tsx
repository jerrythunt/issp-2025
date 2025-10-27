import React from 'react';
import Login from '../components/Login';

const LoginPage: React.FC = () => {
  const handleLogin = (email: string, password: string) => {
    console.log('Login attempted with:', { email, password });
    // Add your login logic here (API call, authentication, etc.)
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Add forgot password logic here
  };

  const handleSignUp = () => {
    console.log('Sign up clicked');
    // Add navigation to sign up page here
  };

  return (
    <Login
      onLogin={handleLogin}
      onForgotPassword={handleForgotPassword}
      onSignUp={handleSignUp}
    />
  );
};

export default LoginPage;