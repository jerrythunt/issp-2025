import React from 'react';
import './PlaylistCard.css';

interface Playlist {
  name: string;
  genres: string[];
}

const PlaylistCard: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
  return (
    <div className="playlist-card">
      <div className="playlist-card-image">
        <span className="icon">🎵</span>
      </div>
      <h3>{playlist.name}</h3>
      <p>Your personal mix</p>
    </div>
  );
};

export default PlaylistCard;
