import React from 'react';
import HeroSection from '../components/HeroSection';
import BenefitsSection from '../components/BenefitsSection';
import TrackingSection from '../components/TrackingSection';
import HowWorksSection from '../components/HowWorksSection';
import ReleasePlayer from '../components/ReleasePlayer';
import { releases } from '../data/releases';

const FrontPage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <TrackingSection />
      <HowWorksSection />
      {/* Simple embedded player for bpm.wav */}
      <div style={{padding:'24px 16px'}}>
        <ReleasePlayer release={releases[0]} />
      </div>
    </>
  );
};

export default FrontPage;
