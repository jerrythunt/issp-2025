import React, { useState } from 'react';

const HowWorksSection: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('How it works image loaded');
  };

  return (
    <section className="how-works-section content-section">
      <div className="section-container">
        <div className="section-grid">
          <div>
            <h2 className="section-title">How it works</h2>
            <p className="section-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="image-container">
            {!imageError ? (
              <img 
                src="/assets/images/senior-woman-dancing-listening-music.png" 
                alt="Senior woman dancing" 
                className="circular-image"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="image-error circular-image">
                Image not found: Senior woman dancing
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWorksSection;