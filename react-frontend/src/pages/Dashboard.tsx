import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  MdVolumeUp,
  MdShuffle,
  MdFavoriteBorder,
  MdFavorite,
  MdMoreHoriz,
  MdRepeat,
  MdMusicNote
} from 'react-icons/md';
import PlaylistCard from '../components/PlaylistCard';
import GenreSelectionModal from '../components/GenreSelectionModal';
import { logout } from '../firebaseAuth';
import './Dashboard.css';

interface Playlist {
  name: string;
  genres: string[];
}

const Dashboard: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const storedPlaylists = localStorage.getItem('playlists');
    return storedPlaylists ? JSON.parse(storedPlaylists) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Music Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  // TODO: Backend Integration - Add additional state:
  // - currentTime: number (in seconds, for progress bar)
  // - duration: number (total track length in seconds)
  // - volume: number (0-100)
  // - currentTrack: { title: string, artist: string, albumArt: string }
  // - isShuffle: boolean

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // TODO: Backend - Connect to actual audio playback API
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Backend - Connect to like/unlike API
  };

  useEffect(() => {
    if (location.state && location.state.selectedGenres && location.state.selectedGenres.length > 0) {
      updatePlaylists(location.state.selectedGenres);
    }
  }, [location.state]);

  const updatePlaylists = (selectedGenres: string[]) => {
    const newPlaylists = selectedGenres.map((genre: string) => ({
      name: genre,
      genres: [genre],
    }));
    setPlaylists(newPlaylists);
    localStorage.setItem('playlists', JSON.stringify(newPlaylists));
  };

  const handleSaveGenres = (selectedGenres: string[]) => {
    updatePlaylists(selectedGenres);
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard">
      {/* Sidebar Navigation */}
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
            <div className="nav-item active">
              <span className="nav-icon"><MdDashboard /></span>
              <span>Dashboard</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon"><MdPerson /></span>
              <span>Profile</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon"><MdTimeline /></span>
              <span>Timeline</span>
            </div>
            <div className="nav-item" onClick={() => navigate('/music')}>
              <span className="nav-icon"><MdMusicNote /></span>
              <span>Music Player</span>
            </div>
          </nav>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Help</h3>
          <div className="nav-divider"></div>
          <nav className="nav-items">
            <div className="nav-item">
              <span className="nav-icon"><MdSettings /></span>
              <span>Settings</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon"><MdHelpOutline /></span>
              <span>FAQs</span>
            </div>
            <div className="nav-item" onClick={async () => {
              await logout();
              navigate('/');
            }}>
              <span className="nav-icon"><MdLogout /></span>
              <span>Log out</span>
            </div>
          </nav>
        </div>

        <button className="change-genre-btn" onClick={() => setIsModalOpen(true)}>
          Change Genre
        </button>

        <div className="version-info">
          <span>version 5.5.1</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="playlists-grid">
          {/* Always show a "Liked" playlist first */}
          <PlaylistCard 
            key="liked" 
            playlist={{ name: "Liked", genres: ["Favorites"] }} 
            isLiked={true}
          />
          {playlists.map((playlist, index) => (
            <PlaylistCard key={index} playlist={playlist} />
          ))}
        </div>
      </main>

      {/* Music Player */}
      {/* TODO: Backend Integration - Connect to audio playback API */}
      <div className="music-player">
        <div className="player-left">
          {/* TODO: Replace with dynamic album art from currentTrack.albumArt */}
          <div className="album-art"></div>
          <div className="song-info-wrapper">
            <div className="song-info">
              {/* TODO: Replace with currentTrack.title and currentTrack.artist */}
              <div className="song-title">Song</div>
              <div className="song-artist">Artist</div>
            </div>
            <div className="player-controls-inline">
              {/* TODO: Add onClick handlers for: skipToPrevious(), rewind(), fastForward(), skipToNext() */}
              <button className="control-btn"><MdSkipPrevious size={20} /></button>
              <button className="control-btn"><MdFastRewind size={20} /></button>
              <button className="control-btn play-main" onClick={togglePlay}>
                {isPlaying ? <MdPause size={18} /> : <MdPlayArrow size={18} />}
              </button>
              <button className="control-btn"><MdFastForward size={20} /></button>
              <button className="control-btn"><MdSkipNext size={20} /></button>
            </div>
          </div>
        </div>

        <div className="player-center">
          <div className="progress-bar">
            {/* TODO: Update time-current with formatTime(currentTime) */}
            <span className="time-current">00:00</span>
            <div className="progress-track">
              {/* TODO: Update progress-fill width to (currentTime / duration) * 100% */}
              <div className="progress-fill"></div>
            </div>
            {/* TODO: Update time-total with formatTime(duration) */}
            <span className="time-total">00:00</span>
          </div>
        </div>

        <div className="player-right">
          <div className="volume-controls">
            {/* TODO: Add onClick handlers for: toggleVolume(), toggleShuffle(), toggleRepeat(), openSettings() */}
            <button className="volume-btn"><MdVolumeUp size={18} /></button>
            <button className="volume-btn"><MdRepeat size={18} /></button>
            <button className="volume-btn"><MdShuffle size={18} /></button>
            <button className={`volume-btn ${isLiked ? 'liked' : ''}`} onClick={toggleLike}>
              {isLiked ? <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />}
            </button>
            <button className="volume-btn"><MdMoreHoriz size={18} /></button>
          </div>
        </div>
      </div>

      <GenreSelectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveGenres} 
      />
    </div>
  );
};

export default Dashboard;
