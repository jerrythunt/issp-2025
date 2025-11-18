import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Signup from './Signup';
import { signUp } from '../firebaseAuth';

// Mock the firebaseAuth module
jest.mock('../firebaseAuth', () => ({
  __esModule: true,
  signUp: jest.fn(),
}));

describe('Signup', () => {
  beforeEach(() => {
    // Clear mock history before each test
    (signUp as jest.Mock).mockClear();
  });

  test('renders initial step with email input', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('allows user to type in email', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');
  });

  test('moves to the next step on email submission', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  test('successful signup navigates to dashboard', async () => {
    (signUp as jest.Mock).mockResolvedValueOnce({ user: {} });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Step 1: Email
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Step 2: Password
    const passwordInput = await screen.findByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Step 3: Birthdate
    expect(await screen.findByText('Birthdate')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Step 4: Agree to Terms
    const agreeCheckbox = await screen.findByLabelText(/i agree to the/i);
    fireEvent.click(agreeCheckbox);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Step 5: Genres and Sign up
    const signupButton = await screen.findByRole('button', { name: /sign up/i });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard');
    });
  });
});
