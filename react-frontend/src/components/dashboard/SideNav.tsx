import React from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  appTitle: string;
  version: string;
  playlists: string[];
};

const SideNav: React.FC<Props> = ({ appTitle, version, playlists }) => {
  const navigate = useNavigate();

  return (
    <div className="side-nav">
      <div className="side-nav__brand" onClick={() => navigate('/')}>
        {appTitle}
      </div>

      <nav className="side-nav__section">
        <div className="side-nav__section-title">Menu</div>
        <button className="side-nav__link" onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button className="side-nav__link">Liked</button>
        <button className="side-nav__link">Profile</button>
        <button className="side-nav__link">Timeline</button>
        <button className="side-nav__link">Help</button>
        <button className="side-nav__link">Settings</button>
        <button className="side-nav__link">FAQs</button>
      </nav>

      <div className="side-nav__section">
        <div className="side-nav__section-title">Playlists</div>
        <ul className="side-nav__list">
          {playlists.slice(0, 2).map((p, idx) => (
            <li key={idx} className="side-nav__item">{p}</li>
          ))}
        </ul>
      </div>

      <div className="side-nav__spacer" />

      <div className="side-nav__section">
        <ul className="side-nav__list">
          {playlists.slice(2).map((p, idx) => (
            <li key={idx} className="side-nav__item">{p}</li>
          ))}
        </ul>
      </div>

      <div className="side-nav__version">version {version}</div>
    </div>
  );
};

export default SideNav;