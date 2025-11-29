<<<<<<< HEAD
import React from 'react';

const Footer: React.FC = () => {
  const handleFooterClick = (section: string) => {
    alert(`${section} functionality coming soon!`);
  };

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-main-links">
            <button onClick={() => handleFooterClick('About BrainTest')} style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>About BrainTest</button>
            <button onClick={() => handleFooterClick('Blog')} style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>Blog</button>
            <button onClick={() => handleFooterClick('The Team')} style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>The Team</button>
            <button onClick={() => handleFooterClick('The Science')} style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>The Science</button>
            <button onClick={() => handleFooterClick('Knowledge Center')} style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>Knowledge Center</button>
            <button onClick={() => handleFooterClick('Contact')} style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>Contact</button>
          </div>
          <div className="footer-social">
            <button onClick={() => handleFooterClick('Follow Us')} style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>Follow Us</button>
          </div>
          <div className="footer-bottom-links">
            <button onClick={() => handleFooterClick('Terms of Use')} style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(12px, 1.3vw, 14px)'}}>Terms of Use</button>
            <button onClick={() => handleFooterClick('Privacy Policy')} style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(12px, 1.3vw, 14px)'}}>Privacy Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
=======
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-main-links">
            <a href="https://braintest.com/about-braintest/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>About BrainTest</a>
            <a href="https://braintest.com/blog/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>Blog</a>
            <a href="https://braintest.com/about-us/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>The Team</a>
            <a href="https://braintest.com/the-science/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>The Science</a>
            <a href="https://braintest.com/knowledge/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>Knowledge Center</a>
            <a href="https://braintest.com/contact/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>Contact</a>
          </div>
          <div className="footer-social">
            <a href="https://www.linkedin.com/company/braintest/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>Follow Us</a>
          </div>
          <div className="footer-bottom-links">
            <a href="https://braintest.com/terms/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(12px, 1.3vw, 14px)'}}>Terms of Use</a>
            <a href="https://braintest.com/privacy/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(12px, 1.3vw, 14px)'}}>Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
>>>>>>> feature/frontend-dashboard
