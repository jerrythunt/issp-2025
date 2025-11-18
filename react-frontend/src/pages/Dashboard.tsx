 
import React, { useState, useEffect, useRef } from 'react';
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

interface Track {
  id: number;
  title: string;
  artist: string;
  albumArt: string;
  url: string;
}

interface TimelineEntry {
  track: Track;
  mood: string;
  timestamp: number;
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tracks: Track[] = [
    { id: 1, title: 'Jazz Tune', artist: 'Jazz Artist', albumArt: '/assets/images/jazz-album.jpg', url: '/assets/music/jazz.mp3' },
    { id: 2, title: 'Rock Anthem', artist: 'Rock Band', albumArt: '/assets/images/rock-album.jpg', url: '/assets/music/rock.mp3' },
    { id: 3, title: 'Classical Piece', artist: 'Classical Composer', albumArt: '/assets/images/classical-album.jpg', url: '/assets/music/classical.mp3' },
    { id: 4, title: 'Electronic Beat', artist: 'DJ Beatmaker', albumArt: '/assets/images/electronic-album.jpg', url: '/assets/music/electronic.mp3' },
    { id: 5, title: 'Pop Hit', artist: 'Pop Star', albumArt: '/assets/images/pop-album.jpg', url: '/assets/music/pop.mp3' },
    { id: 6, title: 'Instrumental Melody', artist: 'Instrumentalist', albumArt: '/assets/images/instrumental-album.jpg', url: '/assets/music/instrumental.mp3' },
  ];

  useEffect(() => {
    if (!currentTrack && tracks.length > 0) {
      setCurrentTrack(tracks[0]);
    }
  }, [tracks, currentTrack]);

  const handleMoodSelect = (mood: string) => {
    if (currentTrack) {
      const newEntry: TimelineEntry = {
        track: currentTrack,
        mood: mood,
        timestamp: new Date().getTime(),
      };
      const existingTimeline = localStorage.getItem('timeline');
      const timeline: TimelineEntry[] = existingTimeline ? JSON.parse(existingTimeline) : [];
      timeline.push(newEntry);
      localStorage.setItem('timeline', JSON.stringify(timeline));
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const skipForward = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
  };

  const skipBackward = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[prevIndex]);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack]);


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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
            <div className="nav-item" onClick={() => navigate('/timeline')}>
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
      <div className="music-player">
        <audio
          ref={audioRef}
          src={currentTrack?.url || ''}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={skipForward}
        />
        <div className="player-left">
          <div className="album-art">
            <img src={currentTrack?.albumArt} alt={currentTrack?.title} />
          </div>
          <div className="song-info-wrapper">
            <div className="song-info">
              <div className="song-title">{currentTrack?.title || 'Song'}</div>
              <div className="song-artist">{currentTrack?.artist || 'Artist'}</div>
            </div>
            <div className="player-controls-inline">
              <button className="control-btn" onClick={skipBackward}><MdSkipPrevious size={20} /></button>
              <button className="control-btn" onClick={() => audioRef.current && (audioRef.current.currentTime -= 10)}><MdFastRewind size={20} /></button>
              <button className="control-btn play-main" onClick={togglePlay}>
                {isPlaying ? <MdPause size={18} /> : <MdPlayArrow size={18} />}
              </button>
              <button className="control-btn" onClick={() => audioRef.current && (audioRef.current.currentTime += 10)}><MdFastForward size={20} /></button>
              <button className="control-btn" onClick={skipForward}><MdSkipNext size={20} /></button>
            </div>
          </div>
        </div>

        <div className="player-center">
          <div className="progress-bar">
            <span className="time-current">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => audioRef.current && (audioRef.current.currentTime = Number(e.target.value))}
              className="progress-track"
            />
            <span className="time-total">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-right">
          <div className="mood-controls">
            <button className="mood-btn" onClick={() => handleMoodSelect('Happy')}>😊</button>
            <button className="mood-btn" onClick={() => handleMoodSelect('Sad')}>😢</button>
            <button className="mood-btn" onClick={() => handleMoodSelect('Energetic')}>⚡</button>
            <button className="mood-btn" onClick={() => handleMoodSelect('Calm')}>🧘</button>
          </div>
          <div className="volume-controls">
            <button className="volume-btn"><MdVolumeUp size={18} /></button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => {
                const newVolume = Number(e.target.value);
                setVolume(newVolume);
                if (audioRef.current) {
                  audioRef.current.volume = newVolume;
                }
              }}
            />
            <button className={`volume-btn ${isRepeat ? 'active' : ''}`} onClick={() => setIsRepeat(!isRepeat)}><MdRepeat size={18} /></button>
            <button className={`volume-btn ${isShuffle ? 'active' : ''}`} onClick={() => setIsShuffle(!isShuffle)}><MdShuffle size={18} /></button>
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