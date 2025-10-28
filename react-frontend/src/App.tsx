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
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import TeamPage from './pages/TeamPage';
import SciencePage from './pages/SciencePage';
import KnowledgeCenterPage from './pages/KnowledgeCenterPage';
import ContactPage from './pages/ContactPage';
import PostLoginPage from './pages/PostLoginPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <DebugInfo />
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <BenefitsSection />
              <TrackingSection />
              <HowWorksSection />
            </>
          } />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/science" element={<SciencePage />} />
          <Route path="/knowledge-center" element={<KnowledgeCenterPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/dashboard" element={<PrivateRoute><PostLoginPage /></PrivateRoute>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
