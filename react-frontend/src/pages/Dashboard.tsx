// Dashboard with iTunes Integration
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdDashboard, 
  MdTimeline, 
  MdSettings, 
  MdHelpOutline, 
  MdLogout,
  MdPlayArrow,
  MdPause,
  MdSearch,
  MdSkipNext,
  MdSkipPrevious,
  MdFavorite,
  MdFavoriteBorder,
  MdRepeat,
  MdShuffle,
  MdMoreHoriz,
  MdPerson
} from 'react-icons/md';
import VolumeControl from '../components/VolumeControl';
import PlaybackSpeedControl from '../components/PlaybackSpeedControl';
import EmojiReaction from '../components/EmojiReaction';
import AudioVisualizer from '../components/AudioVisualizer';
import { auth, db } from '../firebaseConfig';
import { User, signOut } from 'firebase/auth';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
} from 'firebase/firestore';
import './Dashboard.css';

const MOODS = ["Happy", "Sad", "Energetic", "Calm", "Angry", "Romantic"];

interface Song {
  id: number;
  title: string;
  artist: string;
  artwork: string;
  genre: string;
  previewUrl: string;
}

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

const fetchSongsByGenre = async (genre: string, excludeIds: number[] = []): Promise<Song[]> => {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        genre + " music"
      )}&media=music&entity=song&limit=50`
    );
    const data = await response.json();
    const filtered = data.results.filter(
      (track: any) => !excludeIds.includes(track.trackId)
    );

    // Shuffle
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }

    return filtered.slice(0, 20).map((track: any): Song => ({
      id: track.trackId,
      title: track.trackName,
      artist: track.artistName,
      artwork: track.artworkUrl100.replace("100x100", "300x300"),
      genre: track.primaryGenreName,
      previewUrl: track.previewUrl,
    }));
  } catch (err) {
    console.error("iTunes API error:", err);
    return [];
  }
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState("");
  const [shownSongIds, setShownSongIds] = useState<Record<string, number[]>>({});
  const [playingSong, setPlayingSong] = useState<Song | null>(null);
  const [mood, setMood] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [songToAdd, setSongToAdd] = useState<Song | null>(null);
  const [newPlaylistNameModal, setNewPlaylistNameModal] = useState("");

  const audioRef = useRef<HTMLAudioElement>(null);
  const [playerTime, setPlayerTime] = useState(0);
  const [playerDuration, setPlayerDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const [likedSongsPlaylist, setLikedSongsPlaylist] = useState<Song[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Song[]>([]);

  // Auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) navigate("/");
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch user data and liked songs
  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(
            data.name || `${data.firstName || ""} ${data.lastName || ""}`.trim() || user.email?.split('@')[0] || "User"
          );
          if (!data.preferences || data.preferences.length < 3) {
            // Only redirect once, don't keep redirecting
            setLoading(false);
            navigate('/profile', { replace: true });
            return;
          }
          setUserPreferences(data.preferences);
        } else {
          setName(user.email?.split('@')[0] || "User");
          // New user - redirect to profile
          setLoading(false);
          navigate('/profile', { replace: true });
          return;
        }

        // Fetch liked songs (IDs and full data)
        const likedSongsRef = collection(db, 'users', user.uid, 'likedSongs');
        const likedDocs = await getDocs(likedSongsRef);
        const filteredDocs = likedDocs.docs.filter(doc => !doc.data().deleted);
        
        const likedIds = filteredDocs.map(doc => doc.data().id);
        const likedSongsData = filteredDocs.map(doc => {
          const data = doc.data();
          return {
            id: data.id,
            title: data.title,
            artist: data.artist,
            artwork: data.artwork,
            genre: data.genre,
            previewUrl: data.previewUrl
          } as Song;
        });
        
        setLikedSongs(likedIds);
        setLikedSongsPlaylist(likedSongsData);
      } catch (err) {
        console.error(err);
        setName(user.email?.split('@')[0] || "User");
      }
      setLoading(false);
    };
    fetchUserData();
  }, [user, navigate]);

  // Fetch playlists - commented out to use genre-based playlists instead
  // const fetchUserPlaylists = async () => {
  //   if (!user) return;
  //   try {
  //     const response = await fetch(`http://localhost:8888/api/music/user/${user.uid}/playlists`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       setPlaylists(data);
  //     }
  //   } catch (err) {
  //     console.error('Failed to fetch playlists:', err);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserPlaylists();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user]);

  // Fetch songs
  const fetchAllSongs = async () => {
    if (userPreferences.length === 0) return;

    let allSongs: Song[] = [];
    const newShownIds: Record<string, number[]> = { ...shownSongIds };
    const genrePlaylists: Playlist[] = [];

    for (let genre of userPreferences) {
      const genreShownIds = newShownIds[genre] || [];
      const genreSongs = await fetchSongsByGenre(genre, genreShownIds);
      newShownIds[genre] = [...genreShownIds, ...genreSongs.map((s) => s.id)];
      allSongs = allSongs.concat(genreSongs);
      
      // Create genre-based playlist
      if (genreSongs.length > 0) {
        genrePlaylists.push({
          id: genre,
          name: genre,
          songs: genreSongs
        });
      }
    }

    setSongs(allSongs);
    setShownSongIds(newShownIds);
    setPlaylists(genrePlaylists);
  };

  useEffect(() => {
    if (userPreferences.length > 0) {
      fetchAllSongs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPreferences]);

  // Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setSearchLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          searchTerm
        )}&media=music&entity=song&limit=12`
      );
      const data = await response.json();

      if (data.results.length === 0) {
        setError("Song/Artist could not be found");
      } else {
        const results: Song[] = data.results.map((track: any): Song => ({
          id: track.trackId,
          title: track.trackName,
          artist: track.artistName,
          artwork: track.artworkUrl100.replace("100x100", "300x300"),
          genre: track.primaryGenreName,
          previewUrl: track.previewUrl,
        }));
        setSearchResults(results);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to search for songs");
    } finally {
      setSearchLoading(false);
    }
  };

  // Play song
  const playSong = (song: Song, playlist: Song[] = []) => {
    console.log('Playing song:', song.title, 'by', song.artist);
    console.log('Preview URL:', song.previewUrl);
    setPlayingSong(song);
    setPlayerTime(0);
    setSongToAdd(song);
    
    // Set current playlist for next/previous navigation
    if (playlist.length > 0) {
      setCurrentPlaylist(playlist);
    } else if (searchResults.length > 0) {
      setCurrentPlaylist(searchResults);
    } else {
      setCurrentPlaylist(songs);
    }
  };

  // Play a playlist
  const handlePlayPlaylist = (playlistData: Playlist) => {
    if (playlistData.songs.length > 0) {
      playSong(playlistData.songs[0], playlistData.songs);
    }
  };

  // Save mood
  const saveMood = (selectedMood: string) => {
    if (!playingSong) return;
    setMood((prev) =>
      prev ? Array.from(new Set([...prev, selectedMood])) : [selectedMood]
    );
  };

  const handleConfirmMoodSave = async () => {
    if (!playingSong || mood.length === 0 || !user) return;

    try {
      const now = new Date();
      const historyRef = collection(db, "users", user.uid, "moodHistory");
      await addDoc(historyRef, {
        songId: playingSong.id,
        title: playingSong.title,
        artist: playingSong.artist,
        moods: mood,
        timestamp: Math.floor(playerTime),
        listenedAt: now,
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      });
      alert("Mood saved!");
      setMood([]);
    } catch (err) {
      console.error(err);
      alert("Failed to save mood");
    }
  };

  // Add to playlist
  const handleConfirmAddToPlaylist = async (playlistId: string) => {
    if (!songToAdd || !user) return;

    try {
      if (playlistId === "new") {
        if (!newPlaylistNameModal.trim()) return;
        const response = await fetch(`http://localhost:8888/api/music/user/${user.uid}/playlists`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newPlaylistNameModal.trim(),
            songs: [songToAdd],
          })
        });
        if (!response.ok) throw new Error('Failed to create playlist');
      } else {
        // Get current playlist first
        const getResponse = await fetch(`http://localhost:8888/api/music/user/${user.uid}/playlists`);
        if (getResponse.ok) {
          const playlists = await getResponse.json();
          const playlist = playlists.find((p: Playlist) => p.id === playlistId);
          if (playlist) {
            const updatedSongs = [...playlist.songs, songToAdd];
            const updateResponse = await fetch(`http://localhost:8888/api/music/user/${user.uid}/playlists/${playlistId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ songs: updatedSongs })
            });
            if (!updateResponse.ok) throw new Error('Failed to update playlist');
          }
        }
      }

      // Refresh genre playlists
      await fetchAllSongs();
      setShowAddToPlaylistModal(false);
      setSongToAdd(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // Music player controls
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Play failed:', error);
            setIsPlaying(false);
          });
      }
    }
  };

  const playNext = () => {
    if (currentPlaylist.length === 0 || !playingSong) return;
    const currentIndex = currentPlaylist.findIndex(s => s.id === playingSong.id);
    const nextIndex = (currentIndex + 1) % currentPlaylist.length;
    playSong(currentPlaylist[nextIndex]);
  };

  const playPrevious = () => {
    if (currentPlaylist.length === 0 || !playingSong) return;
    const currentIndex = currentPlaylist.findIndex(s => s.id === playingSong.id);
    const prevIndex = currentIndex === 0 ? currentPlaylist.length - 1 : currentIndex - 1;
    playSong(currentPlaylist[prevIndex]);
  };

  const toggleLike = async (song?: Song) => {
    const targetSong = song || playingSong;
    if (!targetSong || !user) {
      console.log('Cannot toggle like: no song or user');
      return;
    }
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const likedSongsRef = collection(userRef, 'likedSongs');
      
      if (likedSongs.includes(targetSong.id)) {
        // Unlike: remove from state
        console.log('Unliking song:', targetSong.title);
        setLikedSongs(likedSongs.filter(id => id !== targetSong.id));
        setLikedSongsPlaylist(likedSongsPlaylist.filter(song => song.id !== targetSong.id));
        // Remove from Firestore
        const likedDocs = await getDocs(likedSongsRef);
        const songDoc = likedDocs.docs.find(doc => doc.data().id === targetSong.id);
        if (songDoc) {
          await updateDoc(doc(db, 'users', user.uid, 'likedSongs', songDoc.id), {
            deleted: true
          });
          console.log('Song unliked successfully');
        }
      } else {
        // Like: add to state
        console.log('Liking song:', targetSong.title);
        setLikedSongs([...likedSongs, targetSong.id]);
        setLikedSongsPlaylist([targetSong, ...likedSongsPlaylist]);
        // Add to Firestore
        const docRef = await addDoc(likedSongsRef, {
          id: targetSong.id,
          title: targetSong.title,
          artist: targetSong.artist,
          artwork: targetSong.artwork,
          genre: targetSong.genre,
          previewUrl: targetSong.previewUrl,
          likedAt: new Date().toISOString()
        });
        console.log('Song liked successfully, doc ID:', docRef.id);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (volume > 0) {
        setVolume(0);
        audioRef.current.volume = 0;
      } else {
        setVolume(1);
        audioRef.current.volume = 1;
      }
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setPlayerTime(time);
    }
  };

  const handleEmojiSelect = async (emoji: string) => {
    if (!playingSong || !user) return;
    
    try {
      const now = new Date();
      const historyRef = collection(db, "users", user.uid, "moodHistory");
      await addDoc(historyRef, {
        songId: playingSong.id,
        title: playingSong.title,
        artist: playingSong.artist,
        artwork: playingSong.artwork,
        emoji: emoji,
        timestamp: Math.floor(playerTime),
        listenedAt: now,
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      });
    } catch (err) {
      console.error("Failed to save emoji reaction:", err);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Audio element event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setPlayerTime(audio.currentTime);
    const handleDurationChange = () => setPlayerDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
        setIsPlaying(true);
      } else {
        playNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRepeat, playingSong, currentPlaylist]);

  // Auto-play when song changes
  useEffect(() => {
    if (playingSong && audioRef.current) {
      console.log('Setting audio source:', playingSong.previewUrl);
      audioRef.current.src = playingSong.previewUrl;
      audioRef.current.volume = volume;
      audioRef.current.load();
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio playing successfully');
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Failed to play audio:', error);
            console.error('Audio src:', audioRef.current?.src);
            console.error('Audio readyState:', audioRef.current?.readyState);
            setIsPlaying(false);
          });
      }
    }
  }, [playingSong, volume]);

  if (loading) return <div className="dashboard"><div className="main-content">Loading...</div></div>;

  return (
    <div className="dashboard">
      {/* Sidebar */}
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
            <div className="nav-item" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
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
            <div className="nav-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <span className="nav-icon"><MdLogout /></span>
              <span>Log out</span>
            </div>
          </nav>
        </div>

        <div className="version-info">
          <span>version 5.5.1</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="dashboard-header">
          <h2 className="dashboard-greeting">Hello, {name}!</h2>
        </div>
        
        {/* Search */}
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for songs or artists..."
              className="search-input"
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="search-btn"
            >
              <MdSearch /> {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Playlists */}
        {(playlists.length > 0 || likedSongs.length > 0) && (
          <div className="songs-section">
            <h3 className="section-title">Your Playlists</h3>
            <div className="playlists-grid">
              {/* Liked Songs Playlist */}
              {likedSongsPlaylist.length > 0 && (
                <div className="playlist-card-wrapper">
                  <div 
                    className="playlist-card-custom liked-playlist" 
                    onClick={() => navigate(`/playlist/Liked Songs`)}
                  >
                    <div className="playlist-artwork">
                      <div className="playlist-placeholder liked-placeholder">
                        <MdFavorite size={64} color="#ED6F3A" />
                      </div>
                      <div className="playlist-overlay">
                        <button 
                          className="playlist-play-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (likedSongsPlaylist.length > 0) {
                              playSong(likedSongsPlaylist[0], likedSongsPlaylist);
                            }
                          }}
                        >
                          <MdPlayArrow size={32} />
                        </button>
                      </div>
                    </div>
                    <div className="playlist-info">
                      <h4 className="playlist-name">Liked Songs</h4>
                      <p className="playlist-count">{likedSongsPlaylist.length} songs</p>
                    </div>
                  </div>
                </div>
              )}
              
              {playlists.map((playlist) => {
                const isCurrentPlaylist = playingSong !== null && playlist.songs?.some(s => s.id === playingSong.id);
                return (
                  <div key={playlist.id} className="playlist-card-wrapper">
                    <div 
                      className="playlist-card-custom" 
                      onClick={() => navigate(`/playlist/${encodeURIComponent(playlist.name)}`)}
                    >
                      <div className="playlist-artwork">
                        {playlist.songs && playlist.songs.length > 0 ? (
                          <img 
                            src={playlist.songs[0].artwork} 
                            alt={playlist.name}
                            className="playlist-cover"
                          />
                        ) : (
                          <div className="playlist-placeholder">
                            <MdPlayArrow size={64} color="#666" />
                          </div>
                        )}
                        <div className="playlist-overlay">
                          <button 
                            className="playlist-play-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayPlaylist(playlist);
                            }}
                          >
                            {isCurrentPlaylist && isPlaying ? <MdPause size={32} /> : <MdPlayArrow size={32} />}
                          </button>
                        </div>
                      </div>
                      <div className="playlist-info">
                        <h4 className="playlist-name">{playlist.name}</h4>
                        <p className="playlist-count">{playlist.songs?.length || 0} songs</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="songs-section">
            <h3 className="section-title">Search Results</h3>
            <div className="playlists-grid">
              {searchResults.map((song) => (
                <div key={song.id} className="playlist-card song-card">
                  <div className="song-card-image-wrapper" onClick={() => playSong(song)}>
                    <img src={song.artwork} alt={song.title} className="song-card-image" />
                    <div className="song-card-play-overlay">
                      <MdPlayArrow color="#fff" size={32} />
                    </div>
                  </div>
                  <div className="song-card-info">
                    <h4 className="song-card-title">{song.title}</h4>
                    <p className="song-card-artist">{song.artist}</p>
                    <button 
                      className="song-like-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(song);
                      }}
                    >
                      {likedSongs.includes(song.id) ? 
                        <MdFavorite size={20} color="#ED6F3A" /> : 
                        <MdFavoriteBorder size={20} color="#666" />
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Songs */}
        {songs.length > 0 && (
          <div className="songs-section">
            <h3 className="section-title">Recommended for You</h3>
            <div className="playlists-grid">
              {songs.map((song) => (
                <div key={song.id} className="playlist-card song-card">
                  <div className="song-card-image-wrapper" onClick={() => playSong(song)}>
                    <img src={song.artwork} alt={song.title} className="song-card-image" />
                    <div className="song-card-play-overlay">
                      <MdPlayArrow color="#fff" size={32} />
                    </div>
                  </div>
                  <div className="song-card-info">
                    <h4 className="song-card-title">{song.title}</h4>
                    <p className="song-card-artist">{song.artist}</p>
                    <p className="song-card-genre">{song.genre}</p>
                    <button 
                      className="song-like-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(song);
                      }}
                    >
                      {likedSongs.includes(song.id) ? 
                        <MdFavorite size={20} color="#ED6F3A" /> : 
                        <MdFavoriteBorder size={20} color="#666" />
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={fetchAllSongs}
              className="load-more-btn"
            >
              Load More Songs
            </button>
          </div>
        )}
      </main>

      {/* Music Player Modal */}
      {playingSong && showAddToPlaylistModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <img src={playingSong.artwork} alt={playingSong.title} className="music-modal-image" />
            
            <h3 className="mood-section-title">How are you feeling?</h3>
            <div className="mood-buttons">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => saveMood(m)}
                  className={`mood-btn ${mood.includes(m) ? 'selected' : ''}`}
                >
                  {m}
                </button>
              ))}
            </div>
            
            {mood.length > 0 && (
              <button
                onClick={handleConfirmMoodSave}
                className="modal-btn"
              >
                Save Mood
              </button>
            )}

            <h3 className="mood-section-title">Add to Playlist</h3>
            <div className="playlist-list">
              {playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleConfirmAddToPlaylist(p.id)}
                  className="playlist-item-btn"
                >
                  {p.name}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={newPlaylistNameModal}
              onChange={(e) => setNewPlaylistNameModal(e.target.value)}
              placeholder="New playlist name"
              className="modal-input"
            />
            <button
              onClick={() => handleConfirmAddToPlaylist("new")}
              className="modal-btn"
            >
              Create New Playlist
            </button>

            <button
              onClick={() => {
                setShowAddToPlaylistModal(false);
                setPlayingSong(null);
                setSongToAdd(null);
              }}
              className="modal-btn modal-btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hidden audio element - must be outside conditional render */}
      <audio 
        ref={audioRef} 
        style={{ display: 'none' }} 
        crossOrigin="anonymous"
        preload="auto"
      />

      {/* Music Player UI */}
      {playingSong && (
        <div className="music-player">
          <div className="player-left">
            <div className="player-album-art-container">
              <img 
                src={playingSong.artwork} 
                alt={playingSong.title} 
                className="player-album-art"
              />
              <AudioVisualizer 
                audioElement={audioRef.current} 
                isPlaying={isPlaying} 
              />
            </div>
            <div className="player-song-info">
              <div className="player-song-title">{playingSong.title}</div>
              <div className="player-song-artist">{playingSong.artist}</div>
            </div>
          </div>

          <div className="player-controls-inline">
            <button 
              className="control-btn" 
              onClick={playPrevious}
              disabled={currentPlaylist.length === 0}
            >
              <MdSkipPrevious size={20} />
            </button>
            <button 
              className="control-btn control-btn-play" 
              onClick={togglePlay}
            >
              {isPlaying ? <MdPause size={24} /> : <MdPlayArrow size={24} />}
            </button>
            <button 
              className="control-btn" 
              onClick={playNext}
              disabled={currentPlaylist.length === 0}
            >
              <MdSkipNext size={20} />
            </button>
          </div>

          <div className="player-center">
            <div className="progress-bar">
              <span className="time-current">{formatTime(playerTime)}</span>
              <div 
                className="progress-track"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = x / rect.width;
                  seekTo(percentage * playerDuration);
                }}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${playerDuration > 0 ? (playerTime / playerDuration) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <span className="time-total">{formatTime(playerDuration)}</span>
            </div>
          </div>

          <div className="player-right">
            <div className="volume-controls">
              <EmojiReaction onEmojiSelect={handleEmojiSelect} />
              <VolumeControl
                volume={volume}
                onVolumeChange={handleVolumeChange}
                onToggleMute={toggleMute}
              />
              <PlaybackSpeedControl
                speed={playbackRate}
                onChange={handlePlaybackRateChange}
              />
              <button 
                className={`volume-btn ${isRepeat ? 'liked' : ''}`}
                onClick={() => setIsRepeat(!isRepeat)}
              >
                <MdRepeat size={18} />
              </button>
              <button 
                className={`volume-btn ${isShuffle ? 'liked' : ''}`}
                onClick={() => setIsShuffle(!isShuffle)}
              >
                <MdShuffle size={18} />
              </button>
              <button 
                className={`volume-btn ${playingSong && likedSongs.includes(playingSong.id) ? 'liked' : ''}`} 
                onClick={() => toggleLike()}
                title="Like song"
              >
                {playingSong && likedSongs.includes(playingSong.id) ? 
                  <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />
                }
              </button>
              <button 
                className="volume-btn" 
                onClick={() => setShowAddToPlaylistModal(true)}
                title="Add to playlist"
              >
                <MdMoreHoriz size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
