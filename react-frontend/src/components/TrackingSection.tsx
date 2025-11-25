import React, { useState } from 'react';
import Carousel from './Carousel';
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
        <div className="section-content-layout">
          <div>
            <Carousel />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackingSection;