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

function App() {
  return (
    <div className="App">
      <DebugInfo />
      <Header />
      <HeroSection />
      <BenefitsSection />
      <TrackingSection />
      <HowWorksSection />
      <Footer />
    </div>
  );
}

export default App;
