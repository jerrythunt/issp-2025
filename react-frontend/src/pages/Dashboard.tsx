import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PlaylistCard from '../components/PlaylistCard';
import GenreSelectionModal from '../components/GenreSelectionModal';
import UploadMusic from '../components/UploadMusic';
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
      <aside className="sidebar">
        <h2>Your Playlists</h2>
        <div className="sidebar-playlists">
          {playlists.map((playlist, index) => (
            <div key={index} className="sidebar-playlist-item">
              {playlist.name}
            </div>
          ))}
        </div>
      </aside>
      <main className="main-content">
        <h1>Good afternoon</h1>
        <UploadMusic />
        <button onClick={() => setIsModalOpen(true)} className="change-genres-button">Change Genres</button>
        <h2>Your Playlists</h2>
        <div className="playlists-container">
          {playlists.map((playlist, index) => (
            <PlaylistCard key={index} playlist={playlist} />
          ))}
        </div>
      </main>
      <GenreSelectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveGenres} 
      />
    </div>
  );
};

export default Dashboard;
