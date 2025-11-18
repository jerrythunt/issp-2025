import React, { useState, useEffect } from 'react';
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
  MdShuffle,
  MdFavoriteBorder,
  MdMoreHoriz,
  MdFavorite,
  MdDelete,
  MdPlayCircleOutline,
  MdRepeat
} from 'react-icons/md';
import VolumeControl from '../components/VolumeControl';
import PlaybackSpeedControl from '../components/PlaybackSpeedControl';
import EmojiReaction from '../components/EmojiReaction';
import { logout } from '../firebaseAuth';
import { useAudioPlayerContext } from '../context/AudioPlayerContext';
import { getSongsForGenre, getLikedSongs, isSongLiked, toggleSongLike as toggleSongLikeInLibrary, likeAllSongsInGenre, unlikeAllSongsInGenre, formatTime, Song } from '../data/musicLibrary';
import './PlaylistDetail.css';

const PlaylistDetail: React.FC = () => {
  const navigate = useNavigate();
  const { playlistName } = useParams<{ playlistName: string }>();
  
  const isLikedPlaylist = playlistName === 'Liked';
  
  const getPlaylistLikedState = () => {
    const likedPlaylists = localStorage.getItem('likedPlaylists');
    if (likedPlaylists && playlistName) {
      const parsed = JSON.parse(likedPlaylists);
      return parsed[playlistName] ?? isLikedPlaylist;
    }
    return isLikedPlaylist;
  };
  
  const [isPlaylistLiked, setIsPlaylistLiked] = useState(() => getPlaylistLikedState());
  const [songs, setSongs] = useState<Song[]>([]);
  
  const audioPlayer = useAudioPlayerContext();
  
  const [isCurrentSongLiked, setIsCurrentSongLiked] = useState(false);

  useEffect(() => {
    setIsPlaylistLiked(getPlaylistLikedState());
  }, [playlistName]);

  useEffect(() => {
    if (playlistName) {
      let playlistSongs: Song[];
      
      if (isLikedPlaylist) {
        playlistSongs = getLikedSongs();
      } else {
        playlistSongs = getSongsForGenre(playlistName);
      }
      
      setSongs(playlistSongs);
      audioPlayer.setPlaylist(playlistSongs, playlistName);
      
      if (playlistSongs.length > 0 && !audioPlayer.currentSong) {
        audioPlayer.playSong(playlistSongs[0]);
      }
    }
  }, [playlistName]);

  useEffect(() => {
    if (audioPlayer.currentSong) {
      setIsCurrentSongLiked(isSongLiked(audioPlayer.currentSong.id));
    }
  }, [audioPlayer.currentSong]);

  const togglePlaylistLike = () => {
    const newLikedState = !isPlaylistLiked;
    setIsPlaylistLiked(newLikedState);
    
    if (playlistName && !isLikedPlaylist && newLikedState) {
      likeAllSongsInGenre(playlistName);
    }
    
    if (playlistName) {
      const likedPlaylists = localStorage.getItem('likedPlaylists');
      const parsed = likedPlaylists ? JSON.parse(likedPlaylists) : {};
      parsed[playlistName] = newLikedState;
      localStorage.setItem('likedPlaylists', JSON.stringify(parsed));
    }
  };

  const togglePlayerLike = () => {
    if (audioPlayer.currentSong) {
      const newLikedStatus = toggleSongLikeInLibrary(audioPlayer.currentSong.id);
      setIsCurrentSongLiked(newLikedStatus);
      
      if (isLikedPlaylist) {
        setSongs(getLikedSongs());
      }
    }
  };

  const toggleSongLike = (songId: string) => {
    toggleSongLikeInLibrary(songId);
    
    setSongs(songs.map(song => 
      song.id === songId ? { ...song } : song
    ));
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

  return (
    <div className="playlist-detail">
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
            <div className="nav-item" onClick={() => navigate('/timeline')} style={{ cursor: 'pointer' }}>
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
            <div className="nav-item" onClick={() => navigate('/dashboard/faq')} style={{ cursor: 'pointer' }}>
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

        <div className="version-info">version 5.5.1</div>
      </aside>

      <main className="playlist-content">
        <div className="playlist-header">
          <h1 className="playlist-title">{playlistName || 'Playlist Title'}</h1>
          <div className="playlist-actions">
            <button 
              className="play-all-btn"
              onClick={() => {
                if (songs.length > 0) {
                  audioPlayer.playSong(songs[0]);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <MdPlayCircleOutline size={48} />
            </button>
            <button className={`like-playlist-btn ${isPlaylistLiked ? 'liked' : ''}`} onClick={togglePlaylistLike}>
              {isPlaylistLiked ? <MdFavorite size={48} /> : <MdFavoriteBorder size={48} />}
            </button>
          </div>
        </div>

        <div className="songs-list">
          {songs.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
              {isLikedPlaylist ? 'No liked songs yet. Like some songs to see them here!' : 'No songs available for this genre.'}
            </div>
          ) : (
            songs.map((song) => (
              <div 
                key={song.id} 
                className="song-item"
                onClick={() => audioPlayer.playSong(song)}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className="song-album-art"
                  style={{ 
                    backgroundImage: song.albumArt ? `url(${song.albumArt})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                <div className="song-details">
                  <div className="song-title-large">{song.title}</div>
                  <div className="song-artist-large">{song.artist}</div>
                </div>
                <button 
                  className={`song-action-btn ${isSongLiked(song.id) ? 'liked' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSongLike(song.id);
                  }}
                >
                  {isSongLiked(song.id) ? <MdFavorite size={42} /> : <MdFavoriteBorder size={42} />}
                </button>
                <button 
                  className="song-action-btn delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isLikedPlaylist) {
                      toggleSongLike(song.id);
                    } else {
                      alert('Remove from playlist feature coming soon!');
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                    <path d="M16 18V30M20 18V30M24 18V30M28 18V30M12 14H30M26 14V12C26 11.4696 25.7893 10.9609 25.4142 10.5858C25.0391 10.2107 24.5304 10 24 10H18C17.4696 10 16.9609 10.2107 16.5858 10.5858C16.2107 10.9609 16 11.4696 16 12V14" stroke="#1D1B20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))
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
            <div className="song-artist">{audioPlayer.currentSong?.artist || 'Select a song'}</div>
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
            <button className={`volume-btn ${isCurrentSongLiked ? 'liked' : ''}`} onClick={togglePlayerLike}>
              {isCurrentSongLiked ? <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />}
            </button>
            <button className="volume-btn"><MdMoreHoriz size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;
