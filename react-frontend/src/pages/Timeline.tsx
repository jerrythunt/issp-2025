import React, { useEffect, useState } from 'react';
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
import VolumeControl from '../components/VolumeControl';
import PlaybackSpeedControl from '../components/PlaybackSpeedControl';
import EmojiReaction from '../components/EmojiReaction';
import { logout } from '../firebaseAuth';
import { useAudioPlayerContext } from '../context/AudioPlayerContext';
import { isSongLiked, toggleSongLike, formatTime } from '../data/musicLibrary';
import './Timeline.css';

interface TimelineEntry {
  song: {
    id: string;
    title: string;
    artist: string;
    albumArt?: string;
  };
  emoji: string;
  timestamp: string;
  songTimestamp: number;
}

const Timeline: React.FC = () => {
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const navigate = useNavigate();
  const audioPlayer = useAudioPlayerContext();
  const [isCurrentSongLiked, setIsCurrentSongLiked] = useState(false);

  useEffect(() => {
    const storedTimeline = localStorage.getItem('timeline');
    if (storedTimeline) {
      setTimelineEntries(JSON.parse(storedTimeline));
    }
  }, []);

  useEffect(() => {
    if (audioPlayer.currentSong) {
      setIsCurrentSongLiked(isSongLiked(audioPlayer.currentSong.id));
    }
  }, [audioPlayer.currentSong]);

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
      setTimelineEntries(prevEntries => [...prevEntries, timelineEntry]);
    }
  };

  const formatFullTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const getEmojiColorClass = (emoji: string) => {
    switch (emoji) {
      case '😊':
        return 'happy';
      case '😢':
        return 'sad';
      case '⚡':
        return 'energetic';
      case '🧘':
        return 'calm';
      default:
        return '';
    }
  };

  return (
    <div className="timeline">
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
            <div className="nav-item" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
              <span className="nav-icon"><MdDashboard /></span>
              <span>Dashboard</span>
            </div>
            <div className="nav-item" onClick={() => alert('Profile page coming soon!')} style={{ cursor: 'pointer' }}>
              <span className="nav-icon"><MdPerson /></span>
              <span>Profile</span>
            </div>
            <div className="nav-item active">
              <span className="nav-icon"><MdTimeline /></span>
              <span>Timeline</span>
            </div>
          </nav>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Help</h3>
          <div className="nav-divider"></div>
          <nav className="nav-items">
            <div className="nav-item" onClick={() => alert('Settings page coming soon!')} style={{ cursor: 'pointer' }}>
              <span className="nav-icon"><MdSettings /></span>
              <span>Settings</span>
            </div>
            <div className="nav-item" onClick={() => alert('FAQs page coming soon!')} style={{ cursor: 'pointer' }}>
              <span className="nav-icon"><MdHelpOutline /></span>
              <span>FAQs</span>
            </div>
            <div className="nav-item" onClick={async () => {
              await logout();
              navigate('/');
            }} style={{ cursor: 'pointer' }}>
              <span className="nav-icon"><MdLogout /></span>
              <span>Log out</span>
            </div>
          </nav>
        </div>

        <button className="change-genre-btn" onClick={() => navigate('/dashboard')}>
          Change Genre
        </button>

        <div className="version-info">
          <span>version 5.5.1</span>
        </div>
      </aside>

      <main className="main-content">
        <h1>Timeline</h1>
        <div className="timeline-entries">
          {timelineEntries.length > 0 ? (
            timelineEntries.map((entry, index) => (
              <div key={index} className={`timeline-entry ${getEmojiColorClass(entry.emoji)}`}>
                <div className="timeline-song-info">
                  <div>
                    <p className="timeline-song-title">{entry.song.title}</p>
                    <p className="timeline-song-artist">{entry.song.artist}</p>
                    <p className="timeline-song-timestamp">{formatTime(entry.songTimestamp)}</p>
                  </div>
                </div>
                <p className="timeline-emoji">{entry.emoji}</p>
                <p className="timeline-timestamp">{formatFullTimestamp(entry.timestamp)}</p>
              </div>
            ))
          ) : (
            <p>No timeline entries yet.</p>
          )}
        </div>
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

export default Timeline;
