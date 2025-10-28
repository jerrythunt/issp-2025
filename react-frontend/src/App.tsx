import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
import TrackingSection from './components/TrackingSection';
import HowWorksSection from './components/HowWorksSection';
import Footer from './components/Footer';
import DebugInfo from './components/DebugInfo';

import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="App">
      <DebugInfo />
      <Header />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <BenefitsSection />
              <TrackingSection />
              <HowWorksSection />
            </>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
