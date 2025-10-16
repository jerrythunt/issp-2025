import React, { useState } from 'react';

interface ImageState {
  elderly: boolean;
  headphones: boolean;
  woman: boolean;
}

const TrackingSection: React.FC = () => {
  const [imageErrors, setImageErrors] = useState<ImageState>({
    elderly: false,
    headphones: false,
    woman: false
  });

  const handleImageError = (imageType: keyof ImageState) => {
    setImageErrors(prev => ({ ...prev, [imageType]: true }));
  };

  const handleImageLoad = () => {
    console.log('Tracking image loaded');
  };

  const renderImage = (
    src: string, 
    alt: string, 
    errorKey: keyof ImageState, 
    fallbackText: string
  ) => {
    return imageErrors[errorKey] ? (
      <div className="image-error section-image">
        Image not found: {fallbackText}
      </div>
    ) : (
      <img 
        src={src}
        alt={alt}
        className="section-image"
        onLoad={handleImageLoad}
        onError={() => handleImageError(errorKey)}
      />
    );
  };

  return (
    <section className="tracking-section content-section">
      <div className="section-container">
        <div className="section-grid section-grid-full">
          <div>
            <h2 className="section-title">Tracking Mood</h2>
            <p className="section-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            
            <div className="image-grid">
              <div className="image-container">
                {renderImage(
                  "/assets/images/elderly-man 1.png",
                  "Elderly man",
                  "elderly",
                  "Elderly man"
                )}
              </div>
              <div className="image-container">
                {renderImage(
                  "/assets/images/senior-enjoying-music-headphones 1.png",
                  "Senior with headphones",
                  "headphones",
                  "Senior with headphones"
                )}
              </div>
              <div className="image-container">
                {renderImage(
                  "/assets/images/elderly-woman 1.png",
                  "Elderly woman",
                  "woman",
                  "Elderly woman"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackingSection;