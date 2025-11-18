import React, { useEffect, useRef } from 'react';
import { Track } from '../../pages/Dashboard';

type Props = {
  track: Track | null;
};

const AudioPlayer: React.FC<Props> = ({ track }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current && track?.url) {
      audioRef.current.load();
      audioRef.current.play().catch(() => undefined);
    }
  }, [track?.url]);

  return (
    <div className="audio-player">
      <div className="audio-player__meta">
        <div className="audio-player__title">{track?.title ?? 'No song selected'}</div>
        <div className="audio-player__artist">{track?.artist ?? ''}</div>
      </div>
      <audio ref={audioRef} controls style={{ width: '100%' }} aria-label={track?.title ?? 'Audio Player'}>
        {track?.url ? <source src={track.url} type="audio/mpeg" /> : null}
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;