
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdPerson,
  MdTimeline,
  MdSettings,
  MdHelpOutline,
  MdLogout,
  MdSkipPrevious,
  MdSkipNext,
  MdFastRewind,
  MdFastForward,
  MdPlayArrow,
  MdPause,
  MdShuffle,
  MdFavoriteBorder,
  MdFavorite,
  MdMoreHoriz,
  MdRepeat
} from 'react-icons/md';
import { usePageTitle } from './hooks/usePageTitle';
import { logout } from '../firebaseAuth';
import { useAudioPlayerContext } from '../context/AudioPlayerContext';
import { isSongLiked, toggleSongLike, formatTime } from '../data/musicLibrary';
import VolumeControl from '../components/VolumeControl';
import PlaybackSpeedControl from '../components/PlaybackSpeedControl';
import EmojiReaction from '../components/EmojiReaction';
import './Dashboard.css';
import './FAQPage.css';

type FAQItem = { q: string; a: string };

const FAQPage: React.FC = () => {
  usePageTitle('FAQs');
  const navigate = useNavigate();
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());

  const audioPlayer = useAudioPlayerContext();
  const [isCurrentSongLiked, setIsCurrentSongLiked] = useState(false);

  useEffect(() => {
    if (audioPlayer.currentSong) {
      setIsCurrentSongLiked(isSongLiked(audioPlayer.currentSong.id));
    }
  }, [audioPlayer.currentSong]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleLike = () => {
    if (audioPlayer.currentSong) {
      const newLikedStatus = toggleSongLike(audioPlayer.currentSong.id);
      setIsCurrentSongLiked(newLikedStatus);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (audioPlayer.currentSong) {
      const timelineEntry = {
        song: audioPlayer.currentSong,
        emoji,
        timestamp: new Date().toISOString(),
        songTimestamp: audioPlayer.currentTime,
      };
      const existingTimeline = JSON.parse(localStorage.getItem('timeline') || '[]');
      localStorage.setItem('timeline', JSON.stringify([...existingTimeline, timelineEntry]));
    }
  };

  const faqs: { category: string; items: FAQItem[] }[] = [
    {
      category: 'Getting Started',
      items: [
        { q: 'How do I create an account?', a: 'You can sign up using email/password or Google sign-in from the signup page.' },
        { q: 'How do I reset my password?', a: 'Use the "Forgot password" link on the login page to request a reset email.' },
      ],
    },
    {
      category: 'Music & Playlists',
      items: [
        { q: 'How do I add songs to a playlist?', a: 'Open a playlist and click the "Add" button next to any song.' },
        { q: 'What is the "Liked" playlist?', a: 'The "Liked" playlist contains all songs you tap the heart button for.' },
      ],
    },
    {
      category: 'Account & Settings',
      items: [
        { q: 'How do I change my email address?', a: 'Go to Profile → Account Information and use the Edit button to request a change.' },
        { q: 'How do I delete my account?', a: 'Contact support through the Contact page; we will guide you through verification and deletion.' },
      ],
    },
  ];

  const toggleKey = (key: string) => {
    setOpenSet(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="dashboard">
      <aside className="sidenav">
        <div className="sidenav-header">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img
              src="/assets/images/braintest-logo.png"
              alt="BrainTest Music"
              className="logo-icon"
            />
          </div>
        </div>
        <div className="nav-section">
          <h3 className="nav-section-title">Menu</h3>
          <div className="nav-divider"></div>
          <nav className="nav-items">
            <div className="nav-item" onClick={() => navigate('/dashboard')}>
              <span className="nav-icon"><MdDashboard /></span>
              <span>Dashboard</span>
            </div>
            <div className="nav-item" onClick={() => navigate('/dashboard/profile')}>
              <span className="nav-icon"><MdPerson /></span>
              <span>Profile</span>
            </div>
            <div className="nav-item" onClick={() => navigate('/timeline')}>
              <span className="nav-icon"><MdTimeline /></span>
              <span>Timeline</span>
            </div>
          </nav>
        </div>
        <div className="nav-section">
          <h3 className="nav-section-title">Help</h3>
          <div className="nav-divider"></div>
          <nav className="nav-items">
            <div className="nav-item" onClick={() => navigate('/dashboard/settings')}>
              <span className="nav-icon"><MdSettings /></span>
              <span>Settings</span>
            </div>
            <div className="nav-item active">
              <span className="nav-icon"><MdHelpOutline /></span>
              <span>FAQs</span>
            </div>
            <div className="nav-item" onClick={handleLogout}>
              <span className="nav-icon"><MdLogout /></span>
              <span>Log out</span>
            </div>
          </nav>
        </div>
        <div className="version-info">
          <span>version 5.5.1</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <h2>FAQs</h2>
        </header>
        <section className="faq-container">
          {faqs.map(cat => (
            <div className="faq-category" key={cat.category}>
              <h3 className="faq-category-title">{cat.category}</h3>
              <div className="faq-list">
                {cat.items.map((item, idx) => {
                  const key = `${cat.category}-${idx}`;
                  const open = openSet.has(key);
                  return (
                    <div className="faq-card" key={key}>
                      <button
                        className={`faq-question ${open ? 'open' : ''}`}
                        aria-expanded={open}
                        onClick={() => toggleKey(key)}
                      >
                        <span>{item.q}</span>
                        <span className="faq-chevron">{open ? '+' : '−'}</span>
                      </button>
                      <div className={`faq-answer ${open ? 'open' : ''}`}>
                        <p>{item.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      </main>

      <div className="music-player">
        <div className="player-left">
          <div
            className="album-art"
            style={{
              backgroundImage: audioPlayer.currentSong?.albumArt ? `url(${audioPlayer.currentSong.albumArt})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
          <div className="song-info">
            <div className="song-title">{audioPlayer.currentSong?.title || 'No Song Playing'}</div>
            <div className="song-artist">{audioPlayer.currentSong?.artist || 'Select a playlist'}</div>
          </div>
        </div>

        <div className="player-controls-inline">
          <button
            className="control-btn"
            onClick={audioPlayer.playPrevious}
            disabled={!audioPlayer.currentSong}
          >
            <MdSkipPrevious size={20} />
          </button>
          <button
            className="control-btn"
            onClick={() => audioPlayer.seekTo(Math.max(0, audioPlayer.currentTime - 10))}
            disabled={!audioPlayer.currentSong}
          >
            <MdFastRewind size={20} />
          </button>
          <button
            className="control-btn play-main"
            onClick={audioPlayer.togglePlay}
            disabled={!audioPlayer.currentSong}
          >
            {audioPlayer.isPlaying ? <MdPause size={18} /> : <MdPlayArrow size={18} />}
          </button>
          <button
            className="control-btn"
            onClick={() => audioPlayer.seekTo(Math.min(audioPlayer.duration, audioPlayer.currentTime + 10))}
            disabled={!audioPlayer.currentSong}
          >
            <MdFastForward size={20} />
          </button>
          <button
            className="control-btn"
            onClick={audioPlayer.playNext}
            disabled={!audioPlayer.currentSong}
          >
            <MdSkipNext size={20} />
          </button>
        </div>

        <div className="player-center">
          <div className="progress-bar">
            <span className="time-current">{formatTime(audioPlayer.currentTime)}</span>
            <div
              className="progress-track"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                audioPlayer.seekTo(percentage * audioPlayer.duration);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div
                className="progress-fill"
                style={{
                  width: `${audioPlayer.duration > 0 ? (audioPlayer.currentTime / audioPlayer.duration) * 100 : 0}%`
                }}
              ></div>
            </div>
            <span className="time-total">{formatTime(audioPlayer.duration)}</span>
          </div>
        </div>

        <div className="player-right">
          <div className="volume-controls">
            <EmojiReaction onEmojiSelect={handleEmojiSelect} />
            <VolumeControl
              volume={audioPlayer.volume}
              onVolumeChange={audioPlayer.setVolume}
              onToggleMute={audioPlayer.toggleMute}
            />
            <PlaybackSpeedControl
              speed={audioPlayer.playbackRate}
              onChange={audioPlayer.setPlaybackRate}
            />
            <button
              className={`volume-btn ${audioPlayer.isRepeat ? 'liked' : ''}`}
              onClick={audioPlayer.toggleRepeat}
            >
              <MdRepeat size={18} />
            </button>
            <button
              className={`volume-btn ${audioPlayer.isShuffle ? 'liked' : ''}`}
              onClick={audioPlayer.toggleShuffle}
            >
              <MdShuffle size={18} />
            </button>
            <button className={`volume-btn ${isCurrentSongLiked ? 'liked' : ''}`} onClick={toggleLike}>
              {isCurrentSongLiked ? <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />}
            </button>
            <button className="volume-btn"><MdMoreHoriz size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
