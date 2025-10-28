import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import { signUp, signInWithGoogle } from '../firebaseAuth';

const Signup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    birthMonth: '',
    birthDay: '',
    birthYear: '',
    agreedToTerms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData({ ...formData, [name]: checked });
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email.includes('@')) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.agreedToTerms) {
      setError("You must agree to the Terms and Conditions.");
      return;
    }

    try {
      const userCredential = await signUp(formData.email, formData.password);
      if (userCredential) {
        navigate('/dashboard');
      }
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            setError('This email address is already in use.');
        } else if (error.code === 'auth/invalid-email') {
            setError('Please enter a valid email address.');
        } else if (error.code === 'auth/weak-password') {
            setError('The password is too weak. Please choose a stronger password.');
        } else {
            setError('An unknown error occurred. Please try again later.');
        }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithGoogle();
      if (userCredential) {
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Failed to sign in with Google. Please try again later.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-field">
            <label className="field-label">Email</label>
            <div className="input-container">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-field">
            <label className="field-label">Password</label>
            <div className="input-container">
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                className="input-field"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      case 3:
        return (
            <div className="form-field">
                <label className="field-label">Birthdate</label>
                <div className="birthdate-container">
                    <select name="birthMonth" value={formData.birthMonth} onChange={handleChange} className="birthdate-select">
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                    <select name="birthDay" value={formData.birthDay} onChange={handleChange} className="birthdate-select">
                        <option value="">Day</option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                    <select name="birthYear" value={formData.birthYear} onChange={handleChange} className="birthdate-select">
                        <option value="">Year</option>
                        {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>
        );
      case 4:
        return (
          <div className="form-field">
            <div className="terms-container">
              <input
                type="checkbox"
                name="agreedToTerms"
                id="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreedToTerms" className="terms-label">
                I agree to the <a href="/terms">Terms and Conditions</a>.
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Sign up</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-step">
          {renderStep()}
        </div>
        <div className="navigation-buttons">
          {step > 1 && <button type="button" onClick={handleBack} className="back-btn">Back</button>}
          {step < 4 && <button type="button" onClick={handleNext} className="next-btn">Next</button>}
          {step === 4 && <button type="submit" className="signup-btn">Sign up</button>}
        </div>
      </form>
      <button type="button" className="google-btn" onClick={handleGoogleSignIn}>Sign up with Google</button>
      <div className="login-section">
        <p className="login-text">Already have an account?</p>
        <a href="/login" className="login-btn-link">Log in</a>
      </div>
    </div>
  );
};

export default Signup;
