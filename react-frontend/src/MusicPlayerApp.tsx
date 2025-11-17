import React, { useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { getRecordingsByGenre } from './musicbrainz';

const GENRES = [
  'Classical',
  'Jazz',
  'Ambient',
  'Rock',
  'Electronic',
  'Folk',
  'Instrumental'
];

const MusicPlayerApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [loginInput, setLoginInput] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Classical');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [playlists, setPlaylists] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setIsLoggedIn(true);
      setUsername(userData.username);
      loadUserPreferences(userData.username);
    }
  }, []);

  useEffect(() => {
    fetchGenrePlaylist(selectedGenre);
  }, [selectedGenre]);

  const fetchGenrePlaylist = async (genre) => {
    if (playlists[genre]) return;
    setLoading(true);
    const recordings = await getRecordingsByGenre(genre, 5);
    setPlaylists(prev => ({ ...prev, [genre]: recordings }));
    setLoading(false);
  };

  const loadUserPreferences = (user) => {
    const savedFavorites = sessionStorage.getItem(`${user}_favorites`);
    const savedRecent = sessionStorage.getItem(`${user}_recent`);

    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedRecent) setRecentlyPlayed(JSON.parse(savedRecent));
  };

  const saveFavorites = (newFavorites) => {
    setFavorites(newFavorites);
    sessionStorage.setItem(`${username}_favorites`, JSON.stringify(newFavorites));
  };

  const saveRecentlyPlayed = (tracks) => {
    setRecentlyPlayed(tracks);
    sessionStorage.setItem(`${username}_recent`, JSON.stringify(tracks));
  };

  const handleLogin = () => {
    if (loginInput.trim()) {
      const userData = { username: loginInput };
      sessionStorage.setItem('currentUser', JSON.stringify(userData));
      setUsername(loginInput);
      setIsLoggedIn(true);
      loadUserPreferences(loginInput);
      setLoginInput('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setUsername('');
    setCurrentTrack(null);
    setFavorites({});
    setRecentlyPlayed([]);
  };

  const playTrack = (track) => {
    setCurrentTrack(track);
    const updatedRecent = [track, ...recentlyPlayed.filter(t => t.id !== track.id)].slice(0, 10);
    saveRecentlyPlayed(updatedRecent);
  };

  const toggleFavorite = (track) => {
    const newFavorites = { ...favorites };
    if (newFavorites[track.id]) {
      delete newFavorites[track.id];
    } else {
      newFavorites[track.id] = track;
    }
    saveFavorites(newFavorites);
  };

  const isFavorite = (track) => {
    return !!favorites[track.id];
  };
  
  const getArtistName = (track) => {
    return track?.['artist-credit']?.[0]?.name || 'Unknown Artist';
  }

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #472A76 0%, #ED6F3A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '400px', width: '90%' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#472A76', textAlign: 'center' }}>🧠 BrainTest Music</h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Create Your Life's Playlists</p>
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 'bold' }}>Username</label>
              <input
                type="text"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '16px' }}
                placeholder="Enter your username"
              />
            </div>
            <button
              onClick={handleLogin}
              style={{ width: '100%', padding: '15px', background: '#472A76', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }}
              onMouseOver={(e) => e.target.style.background = '#5a3594'}
              onMouseOut={(e) => e.target.style.background = '#472A76'}
            >
              Log In / Sign Up
            </button>
          </div>
          <p style={{ marginTop: '20px', fontSize: '12px', color: '#999', textAlign: 'center' }}>
            Your preferences are saved in browser memory
          </p>
        </div>
      </div>
    );
  }

  const currentGenreTracks = playlists[selectedGenre] || [];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ background: 'white', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#472A76', margin: 0 }}>🧠 BrainTest Music</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#666' }}>Welcome, <strong>{username}</strong></span>
          <button
            onClick={handleLogout}
            style={{ padding: '8px 20px', background: '#ED6F3A', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto', padding: '20px', gap: '20px', flexWrap: 'wrap' }}>
        <aside style={{ flex: '0 0 250px', background: 'white', borderRadius: '15px', padding: '20px', height: 'fit-content', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#472A76' }}>Genres</h2>
          {GENRES.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '10px',
                background: selectedGenre === genre ? '#472A76' : '#f5f5f5',
                color: selectedGenre === genre ? 'white' : '#333',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: selectedGenre === genre ? 'bold' : 'normal',
                transition: 'all 0.3s'
              }}
            >
              {genre}
            </button>
          ))}
        </aside>

        <main style={{ flex: '1', minWidth: '300px' }}>
          {currentTrack && (
            <div style={{ background: 'white', borderRadius: '15px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '5px', color: '#472A76' }}>{currentTrack.title}</h3>
              <p style={{ color: '#666', marginBottom: '15px' }}>{getArtistName(currentTrack)}</p>
              <AudioPlayer
                src={currentTrack.url}
                autoPlay
                showJumpControls={false}
                customAdditionalControls={[]}
                style={{ borderRadius: '10px', boxShadow: 'none' }}
              />
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '15px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#472A76' }}>{selectedGenre} Music</h2>
            {loading && <p>Loading...</p>}
            {currentGenreTracks.map(track => (
              <div
                key={track.id}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', marginBottom: '10px', background: currentTrack?.id === track.id ? '#f0f0f0' : '#fafafa', borderRadius: '10px', cursor: 'pointer', transition: 'background 0.3s' }}
                onClick={() => playTrack(track)}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>{track.title}</h4>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#666' }}>{getArtistName(track)}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '5px 10px' }}
                >
                  {isFavorite(track) ? '❤️' : '🤍'}
                </button>
              </div>
            ))}
          </div>

          {Object.values(favorites).length > 0 && (
            <div style={{ marginTop: '30px', background: 'white', borderRadius: '15px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#ED6F3A' }}>❤️ Favorites</h3>
              {Object.values(favorites).map(track => (
                <div
                  key={track.id}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', marginBottom: '8px', background: '#fff5f5', borderRadius: '8px', cursor: 'pointer' }}
                  onClick={() => playTrack(track)}
                >
                  <div>
                    <h5 style={{ margin: 0, color: '#333' }}>{track.title}</h5>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#666' }}>{getArtistName(track)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {recentlyPlayed.length > 0 && (
            <div style={{ background: 'white', borderRadius: '15px', padding: '20px', marginTop: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#20B2AA' }}>🕒 Recently Played</h3>
              {recentlyPlayed.map(track => (
                <div
                  key={track.id}
                  style={{ padding: '10px', marginBottom: '8px', background: '#f9f9f9', borderRadius: '8px', cursor: 'pointer' }}
                  onClick={() => playTrack(track)}
                >
                  <strong>{track.title}</strong> - {getArtistName(track)}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MusicPlayerApp;
