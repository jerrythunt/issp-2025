import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Song } from '../data/musicLibrary';

export interface AudioPlayerContextValue {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffle: boolean;
  isRepeat: boolean;
  playbackRate: number;
  audioElement: HTMLAudioElement | null;
  currentPlaylistSource: string | null;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setPlaybackRate: (rate: number) => void;
  toggleMute: () => void;
  setPlaylist: (songs: Song[], source?: string) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export const useAudioPlayerContext = (): AudioPlayerContextValue => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayerContext must be used within AudioPlayerProvider');
  return ctx;
};

export const AudioPlayerProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentPlaylistSource, setCurrentPlaylistSource] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => undefined);
      } else {
        playNext();
      }
    };
    const handleError = (e: ErrorEvent) => {
      console.error('Audio playback error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError as any);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError as any);
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRepeat]);

  const playSong = (song: Song) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.src = song.audioUrl;
    audio.load();
    setCurrentSong(song);
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => { console.error(e); });
    }
  };

  const playNext = () => {
    if (playlist.length === 0) return;
    let nextIndex: number;
    if (isShuffle) nextIndex = Math.floor(Math.random() * playlist.length);
    else nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    playSong(playlist[nextIndex]);
  };

  const playPrevious = () => {
    if (playlist.length === 0) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    playSong(playlist[prevIndex]);
  };

  const seekTo = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setVolume = (newVolume: number) => {
    if (!audioRef.current) return;
    const clamped = Math.max(0, Math.min(1, newVolume));
    audioRef.current.volume = clamped;
    setVolumeState(clamped);
  };

  const toggleShuffle = () => setIsShuffle((s) => !s);
  const toggleRepeat = () => setIsRepeat((r) => !r);

  const setPlaybackRate = (rate: number) => {
    if (!audioRef.current) return;
    const clamped = Math.max(0.25, Math.min(2.0, rate));
    audioRef.current.playbackRate = clamped;
    setPlaybackRateState(clamped);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = previousVolume;
      setVolumeState(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      audioRef.current.volume = 0;
      setVolumeState(0);
      setIsMuted(true);
    }
  };

  const setPlaylistHandler = (songs: Song[], source?: string) => {
    setPlaylist(songs);
    if (source) {
      setCurrentPlaylistSource(source);
    }
    if (songs.length > 0 && !currentSong) {
      setCurrentIndex(0);
      setCurrentSong(songs[0]);
    }
  };

  const value: AudioPlayerContextValue = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isShuffle,
    isRepeat,
    playbackRate,
    audioElement: audioRef.current,
    currentPlaylistSource,
    playSong,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    setPlaybackRate,
    toggleMute,
    setPlaylist: setPlaylistHandler,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export default AudioPlayerContext;
