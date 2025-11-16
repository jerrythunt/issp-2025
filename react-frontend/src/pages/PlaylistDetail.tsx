import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  MdMoreHoriz,
  MdFavorite,
  MdDelete,
  MdPlayCircleOutline,
  MdRepeat
} from 'react-icons/md';
import { logout } from '../firebaseAuth';
import './PlaylistDetail.css';

interface Song {
  id: number;
  title: string;
  artist: string;
  albumArt?: string;
  isLiked?: boolean;
}

const PlaylistDetail: React.FC = () => {
  const navigate = useNavigate();
  const { playlistName } = useParams<{ playlistName: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Check if this is the "Liked" playlist
  const isLikedPlaylist = playlistName === 'Liked';
  
  const [isPlaylistLiked, setIsPlaylistLiked] = useState(isLikedPlaylist);
  const [isPlayerLiked, setIsPlayerLiked] = useState(false);

  // Mock data - replace with actual data from backend
  // If it's the Liked playlist, all songs should be liked by default
  const [songs, setSongs] = useState<Song[]>([
    { id: 1, title: 'Title', artist: 'Artist', isLiked: isLikedPlaylist },
    { id: 2, title: 'Title', artist: 'Artist', isLiked: isLikedPlaylist },
    { id: 3, title: 'Title', artist: 'Artist', isLiked: isLikedPlaylist },
    { id: 4, title: 'Title', artist: 'Artist', isLiked: isLikedPlaylist },
  ]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const togglePlaylistLike = () => {
    setIsPlaylistLiked(!isPlaylistLiked);
  };

  const togglePlayerLike = () => {
    setIsPlayerLiked(!isPlayerLiked);
  };

  const toggleSongLike = (songId: number) => {
    setSongs(songs.map(song => 
      song.id === songId ? { ...song, isLiked: !song.isLiked } : song
    ));
  };

  return (
    <div className="playlist-detail">
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
            <div className="nav-item" onClick={() => navigate('/dashboard')}>
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

        <button className="change-genre-btn" onClick={() => navigate('/dashboard')}>
          Change Genre
        </button>

        <div className="version-info">version 5.5.1</div>
      </aside>

      {/* Main Content */}
      <main className="playlist-content">
        {/* Playlist Header */}
        <div className="playlist-header">
          <h1 className="playlist-title">{playlistName || 'Playlist Title'}</h1>
          <div className="playlist-actions">
            <button className="play-all-btn">
              <MdPlayCircleOutline size={48} />
            </button>
            <button className={`like-playlist-btn ${isPlaylistLiked ? 'liked' : ''}`} onClick={togglePlaylistLike}>
              {isPlaylistLiked ? <MdFavorite size={48} /> : <MdFavoriteBorder size={48} />}
            </button>
          </div>
        </div>

        {/* Songs List */}
        <div className="songs-list">
          {songs.map((song) => (
            <div key={song.id} className="song-item">
              <div className="song-album-art"></div>
              <div className="song-details">
                <div className="song-title-large">{song.title}</div>
                <div className="song-artist-large">{song.artist}</div>
              </div>
              <button 
                className={`song-action-btn ${song.isLiked ? 'liked' : ''}`}
                onClick={() => toggleSongLike(song.id)}
              >
                {song.isLiked ? <MdFavorite size={42} /> : <MdFavoriteBorder size={42} />}
              </button>
              <button className="song-action-btn delete-btn">
                <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                  <path d="M16 18V30M20 18V30M24 18V30M28 18V30M12 14H30M26 14V12C26 11.4696 25.7893 10.9609 25.4142 10.5858C25.0391 10.2107 24.5304 10 24 10H18C17.4696 10 16.9609 10.2107 16.5858 10.5858C16.2107 10.9609 16 11.4696 16 12V14" stroke="#1D1B20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Music Player */}
      <div className="music-player">
        <div className="player-left">
          <div className="album-art"></div>
          <div className="song-info-wrapper">
            <div className="song-info">
              <div className="song-title">Song</div>
              <div className="song-artist">Artist</div>
            </div>
            <div className="player-controls-inline">
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
            <span className="time-current">00:00</span>
            <div className="progress-track">
              <div className="progress-fill"></div>
            </div>
            <span className="time-total">00:00</span>
          </div>
        </div>

        <div className="player-right">
          <div className="volume-controls">
            <button className="volume-btn"><MdVolumeUp size={18} /></button>
            <button className="volume-btn"><MdRepeat size={18} /></button>
            <button className="volume-btn"><MdShuffle size={18} /></button>
            <button className={`volume-btn ${isPlayerLiked ? 'liked' : ''}`} onClick={togglePlayerLike}>
              {isPlayerLiked ? <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />}
            </button>
            <button className="volume-btn"><MdMoreHoriz size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;
