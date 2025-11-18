import React from 'react';
import { Track } from '../../pages/Dashboard';

type Props = {
  tracks: Track[];
  onPlay: (track: Track) => void;
};

const Timeline: React.FC<Props> = ({ tracks, onPlay }) => {
  return (
    <div className="timeline-table" role="table" aria-label="Timeline">
      <div className="timeline-row timeline-row--head" role="row">
        <div className="timeline-cell">Song</div>
        <div className="timeline-cell timeline-cell--date">02.10</div>
        <div className="timeline-cell timeline-cell--date">01.10</div>
        <div className="timeline-cell">Artist</div>
      </div>

      {tracks.map((t) => (
        <div
          key={t.id}
          className="timeline-row"
          role="button"
          tabIndex={0}
          onClick={() => onPlay(t)}
          onKeyDown={(e) => e.key === 'Enter' && onPlay(t)}
        >
          <div className="timeline-cell">{t.title}</div>
          <div className="timeline-cell timeline-cell--date">{t.date === '02.10' ? '●' : ''}</div>
          <div className="timeline-cell timeline-cell--date">{t.date === '01.10' ? '●' : ''}</div>
          <div className="timeline-cell">{t.artist}</div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;