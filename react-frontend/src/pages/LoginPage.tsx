import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import Header from '../components/Header';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (email: string, password: string) => {
    console.log('Login attempted with:', { email, password });
    // Add your login logic here (API call, authentication, etc.)
    // After successful login, you might want to redirect:
    // navigate('/dashboard'); // or wherever you want to redirect after login
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Add forgot password logic here
    // You could navigate to a forgot password page:
    // navigate('/forgot-password');
  };

  const handleSignUp = () => {
    console.log('Sign up clicked');
    // Add navigation to sign up page here
    // navigate('/signup');
  };

  return (
    <>
      <Header />
      <Login
        onLogin={handleLogin}
        onForgotPassword={handleForgotPassword}
        onSignUp={handleSignUp}
      />
    </>
  );
};

export default LoginPage;