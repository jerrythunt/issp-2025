import React from 'react';

type Props = {
  playlists: string[];
  onSelect?: (name: string) => void;
};

const PlaylistList: React.FC<Props> = ({ playlists, onSelect }) => {
  return (
    <div className="playlist-grid">
      {playlists.map((name, idx) => (
        <div
          key={idx}
          className="playlist-card"
          onClick={() => onSelect?.(name)}
          role="button"
          tabIndex={0}
        >
          <div className="playlist-card__thumb" />
          <div className="playlist-card__title">{name}</div>
        </div>
      ))}
    </div>
  );
};

export default PlaylistList;