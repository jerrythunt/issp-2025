import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
import TrackingSection from './components/TrackingSection';
import HowWorksSection from './components/HowWorksSection';
import Footer from './components/Footer';
import DebugInfo from './components/DebugInfo';
import LoginPage from './pages/LoginPage';

// Landing Page Component
const LandingPage: React.FC = () => (
  <>
    <DebugInfo />
    <Header />
    <HeroSection />
    <BenefitsSection />
    <TrackingSection />
    <HowWorksSection />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
