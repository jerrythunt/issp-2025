import React, { useEffect, useMemo, useRef, useState } from 'react';

type Track = {
  name: string;
  url: string; // object URL created at runtime
  file?: File; // original File (optional)
};

interface LocalAudioPlayerProps {
  // Optionally pass a list of packaged audio URLs to play (e.g., from public folder)
  packagedTracks?: { name: string; url: string }[];
}

const LocalAudioPlayer: React.FC<LocalAudioPlayerProps> = ({ packagedTracks }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [manifestTracks, setManifestTracks] = useState<{ name: string; url: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up object URLs when component unmounts or when tracks change
  useEffect(() => {
    return () => {
      tracks.forEach((t: Track) => {
        if (t.file) URL.revokeObjectURL(t.url);
      });
    };
  }, [tracks]);

  // Fetch manifest of packaged audio files from public folder if available
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await fetch('/assets/audio/manifest.json', { signal: controller.signal });
        if (!res.ok) return;
        const data: { name: string; url: string }[] = await res.json();
        if (Array.isArray(data)) setManifestTracks(data);
      } catch (_e) {
        // ignore if not found
      }
    };
    void load();
    return () => controller.abort();
  }, []);

  const hasTracks = tracks.length > 0 || (packagedTracks && packagedTracks.length > 0);
  const currentSrc = useMemo(() => {
    if (tracks.length > 0) return tracks[currentIndex]?.url;
    if (manifestTracks.length > 0) return manifestTracks[currentIndex]?.url;
    if (packagedTracks && packagedTracks.length > 0) return packagedTracks[currentIndex]?.url;
    return undefined;
  }, [tracks, packagedTracks, manifestTracks, currentIndex]);

  const effectiveTracks = useMemo(() => {
    if (tracks.length > 0) return tracks.map((t: Track) => ({ name: t.name, url: t.url }));
    if (manifestTracks.length > 0) return manifestTracks;
    return packagedTracks ?? [];
  }, [tracks, manifestTracks, packagedTracks]);

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const selected: Track[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (
        f.type === 'audio/mpeg' ||
        f.type === 'audio/wav' ||
        f.name.toLowerCase().endsWith('.mp3') ||
        f.name.toLowerCase().endsWith('.wav')
      ) {
        const url = URL.createObjectURL(f);
        selected.push({ name: f.name, url, file: f });
      }
    }
    setTracks(selected);
    setCurrentIndex(0);
    setIsPlaying(true);
    // reset input value so same files can be re-selected later if desired
    e.currentTarget.value = '';
  };

  const play = async () => {
    try {
      await audioRef.current?.play();
      setIsPlaying(true);
    } catch (err) {
      // Autoplay might be blocked; user interaction will resolve
      console.warn('Play failed:', err);
    }
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const next = () => {
    if (effectiveTracks.length === 0) return;
    setCurrentIndex((i: number) => (i + 1) % effectiveTracks.length);
    setIsPlaying(true);
  };

  const prev = () => {
    if (effectiveTracks.length === 0) return;
    setCurrentIndex((i: number) => (i - 1 + effectiveTracks.length) % effectiveTracks.length);
    setIsPlaying(true);
  };

  // Auto play/pause when currentSrc or isPlaying changes
  useEffect(() => {
    if (!audioRef.current) return;
    if (!currentSrc) return;
    audioRef.current.src = currentSrc;
    if (isPlaying) {
      void audioRef.current.play().catch(() => {/* ignore */});
    } else {
      audioRef.current.pause();
    }
  }, [currentSrc, isPlaying]);

  return (
    <div className="local-audio-player" style={{border: '1px solid #e5e5e5', borderRadius: 6, padding: 12, margin: '12px 0'}}>
      <h3 style={{marginTop:0}}>Play Local or Packaged Audio</h3>
      <div style={{display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:8}}>
        <input type="file" accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.webm" multiple onChange={onPickFiles} />
        <button type="button" onClick={prev} disabled={!hasTracks}>&laquo; Prev</button>
        {isPlaying ? (
          <button type="button" onClick={pause} disabled={!hasTracks}>Pause</button>
        ) : (
          <button type="button" onClick={play} disabled={!hasTracks}>Play</button>
        )}
        <button type="button" onClick={next} disabled={!hasTracks}>Next &raquo;</button>
      </div>

      <audio ref={audioRef} controls style={{width:'100%'}} onEnded={next} />

      {effectiveTracks.length > 0 && (
        <ol style={{marginTop:12}}>
          {effectiveTracks.map((t: {name: string; url: string}, idx: number) => (
            <li key={idx} style={{cursor:'pointer', color: idx===currentIndex ? '#4caf50' : 'inherit'}}
                onClick={() => { setCurrentIndex(idx); setIsPlaying(true); }}>
              {t.name}
            </li>
          ))}
        </ol>
      )}

      {effectiveTracks.length === 0 && (
        <p style={{marginTop:8}}>
          Select one or more audio files to start playing, or add files under <code>public/assets/audio</code> and a manifest.json.
        </p>
      )}
    </div>
  );
};

export default LocalAudioPlayer;
