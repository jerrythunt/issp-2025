import React, { useState, useEffect } from 'react';
import './Timeline.css';

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

const Timeline: React.FC = () => {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);

  useEffect(() => {
    const storedTimeline = localStorage.getItem('timeline');
    if (storedTimeline) {
      setTimeline(JSON.parse(storedTimeline));
    }
  }, []);

  return (
    <div className="timeline">
      <h2>Your Music Timeline</h2>
      <div className="timeline-entries">
        {timeline.map((entry, index) => (
          <div key={index} className="timeline-entry">
            <img src={entry.track.albumArt} alt={entry.track.title} className="timeline-album-art" />
            <div className="timeline-track-info">
              <div className="timeline-track-title">{entry.track.title}</div>
              <div className="timeline-track-artist">{entry.track.artist}</div>
            </div>
            <div className="timeline-mood">{entry.mood}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;