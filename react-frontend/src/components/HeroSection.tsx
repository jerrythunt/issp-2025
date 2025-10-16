import React, { useState } from 'react';
import { Container } from 'react-bootstrap';

const HeroSection: React.FC = () => {
  const [musicWaveError, setMusicWaveError] = useState(false);

  const handleImageLoad = () => {
    console.log('Hero image loaded');
  };

  const handleMusicWaveError = () => {
    setMusicWaveError(true);
  };

  return (
    <section className="hero-section">
      <Container>
        <h1 className="hero-title">
          CREATE<br/>YOUR<br/>LIFE'S<br/>PLAYLISTS
        </h1>
        <button 
          className="hero-signup-btn" 
          onClick={() => alert('Sign up functionality coming soon!')}
          style={{border: 'none', cursor: 'pointer'}}
        >
          Sign up
        </button>
        
        <div className="music-wave-container">
          {!musicWaveError ? (
            <img 
              src="/assets/images/music_notes 1.png" 
              alt="Music Notes" 
              className="music-wave-img"
              onLoad={handleImageLoad}
              onError={handleMusicWaveError}
            />
          ) : (
            <div className="music-wave-fallback" style={{display: 'block'}}></div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;