import React, { useState, useRef, useEffect } from 'react';
import { ReleaseMeta, TrackMeta } from '../data/releases';

interface ReleasePlayerProps {
  release: ReleaseMeta;
}

const ReleasePlayer: React.FC<ReleasePlayerProps> = ({ release }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack: TrackMeta | undefined = release.tracks[currentTrackIndex];

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    audioRef.current.src = currentTrack.audioSrc;
    if (isPlaying) {
      void audioRef.current.play().catch(() => {/* ignore autoplay errors */});
    } else {
      audioRef.current.pause();
    }
  }, [currentTrackIndex, currentTrack, isPlaying]);

  const play = () => {
    if (!audioRef.current) return;
    void audioRef.current.play().then(() => setIsPlaying(true));
  };
  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };
  const next = () => {
    setCurrentTrackIndex(i => (i + 1) % release.tracks.length);
    setIsPlaying(true);
  };
  const prev = () => {
    setCurrentTrackIndex(i => (i - 1 + release.tracks.length) % release.tracks.length);
    setIsPlaying(true);
  };

  return (
    <div style={{border:'1px solid #ddd', borderRadius:8, padding:16, maxWidth:420}}>
      <h3 style={{marginTop:0}}>{release.title}</h3>
      {release.thumbnail && (
        <img src={release.thumbnail} alt={release.title} style={{width:'100%', borderRadius:6, marginBottom:12}} />
      )}
      <p style={{margin:'4px 0'}}><strong>Artist:</strong> {release.artist ?? 'Unknown'}</p>
      {currentTrack && (
        <p style={{margin:'4px 0'}}><strong>Track:</strong> {currentTrack.title}</p>
      )}
      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:8}}>
        <button onClick={prev} disabled={release.tracks.length <= 1}>Prev</button>
        {isPlaying ? (
          <button onClick={pause}>Pause</button>
        ) : (
          <button onClick={play} disabled={!currentTrack}>Play</button>
        )}
        <button onClick={next} disabled={release.tracks.length <= 1}>Next</button>
      </div>
      <audio ref={audioRef} controls style={{width:'100%', marginTop:12}} onEnded={next} />
      <ol style={{marginTop:12}}>
        {release.tracks.map((t, idx) => (
          <li
            key={t.trackId}
            style={{cursor:'pointer', color: idx === currentTrackIndex ? '#4caf50' : undefined}}
            onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
          >
            {t.title} {t.duration ? `(${t.duration})` : ''}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ReleasePlayer;