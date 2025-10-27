import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-main-links">
            <a href="/about" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>About BrainTest</a>
            <a href="/blog" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>Blog</a>
            <a href="/team" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>The Team</a>
            <a href="/science" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>The Science</a>
            <a href="/knowledge-center" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>Knowledge Center</a>
            <a href="/contact" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>Contact</a>
          </div>
          <div className="footer-social">
            <a href="#" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>Follow Us</a>
          </div>
          <div className="footer-bottom-links">
            <a href="#" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(12px, 1.3vw, 14px)'}}>Terms of Use</a>
            <a href="#" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(12px, 1.3vw, 14px)'}}>Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
