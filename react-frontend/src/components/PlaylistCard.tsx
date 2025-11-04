import React from 'react';
import './PlaylistCard.css';

interface Playlist {
  name: string;
  genres: string[];
}

const PlaylistCard: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
  return (
    <div className="playlist-card">
      <h3>{playlist.name}</h3>
    </div>
  );
};

export default PlaylistCard;
