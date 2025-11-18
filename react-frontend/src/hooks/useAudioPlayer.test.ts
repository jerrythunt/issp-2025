
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAudioPlayer } from './useAudioPlayer';
import { Song } from '../data/musicLibrary';

const mockSong: Song = {
  id: '100',
  title: 'Test Song',
  artist: 'Test Artist',
  albumArt: '/test/art.jpg',
  audioUrl: 'test_url.mp3',
  duration: 180,
  genre: 'Test'
};

const mockPlaylist: Song[] = [
  { id: '1', title: 'Song 1', artist: 'Artist 1', albumArt: '/test/art1.jpg', audioUrl: 'url1.mp3', duration: 180, genre: 'Test' },
  { id: '2', title: 'Song 2', artist: 'Artist 2', albumArt: '/test/art2.jpg', audioUrl: 'url2.mp3', duration: 180, genre: 'Test' },
  { id: '3', title: 'Song 3', artist: 'Artist 3', albumArt: '/test/art3.jpg', audioUrl: 'url3.mp3', duration: 180, genre: 'Test' },
];

beforeEach(() => {
  jest.clearAllMocks();

  window.HTMLMediaElement.prototype.load = jest.fn();
  window.HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined);
  window.HTMLMediaElement.prototype.pause = jest.fn();
  window.HTMLMediaElement.prototype.addEventListener = jest.fn();
  window.HTMLMediaElement.prototype.removeEventListener = jest.fn();
});

describe('useAudioPlayer', () => {
  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useAudioPlayer());
    expect(result.current.currentSong).toBeNull();
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.volume).toBe(0.7);
  });

  it('plays a song and updates state', async () => {
    const { result } = renderHook(() => useAudioPlayer());

    act(() => {
      result.current.playSong(mockSong);
    });

    await waitFor(() => {
      expect(result.current.isPlaying).toBe(true);
    });

    expect(result.current.currentSong).toEqual(mockSong);
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it('toggles play/pause correctly', async () => {
    const { result } = renderHook(() => useAudioPlayer());

    act(() => {
      result.current.playSong(mockSong);
    });
    await waitFor(() => expect(result.current.isPlaying).toBe(true));

    act(() => {
      result.current.togglePlay();
    });
    expect(result.current.isPlaying).toBe(false);
    expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();

    act(() => {
      result.current.togglePlay();
    });
    await waitFor(() => expect(result.current.isPlaying).toBe(true));
  });

  it('manages playlists and navigates through songs', async () => {
    const { result } = renderHook(() => useAudioPlayer());

    act(() => {
      result.current.setPlaylist(mockPlaylist);
    });
    expect(result.current.currentSong).toEqual(mockPlaylist[0]);

    act(() => {
      result.current.playNext();
    });
    await waitFor(() => expect(result.current.currentSong).toEqual(mockPlaylist[1]));

    act(() => {
      result.current.playPrevious();
    });
    await waitFor(() => expect(result.current.currentSong).toEqual(mockPlaylist[0]));
  });

  it('does not crash when interacting with an empty playlist', () => {
    const { result } = renderHook(() => useAudioPlayer());

    act(() => {
      result.current.setPlaylist([]);
    });

    expect(result.current.currentSong).toBeNull();

    act(() => {
      result.current.playNext();
    });
    expect(result.current.currentSong).toBeNull();

    act(() => {
      result.current.playPrevious();
    });
    expect(result.current.currentSong).toBeNull();
  });

  it('does not crash when togglePlay is called without a song', () => {
    const { result } = renderHook(() => useAudioPlayer());

    act(() => {
      result.current.togglePlay();
    });

    expect(result.current.isPlaying).toBe(false);
  });

  it('handles seeking correctly', async () => {
    const { result } = renderHook(() => useAudioPlayer());

    act(() => {
      result.current.playSong(mockSong);
    });

    await waitFor(() => {
        expect(result.current.isPlaying).toBe(true);
    });

    act(() => {
      result.current.seekTo(30);
    });

    expect(result.current.audioElement!.currentTime).toBe(30);
  });
});
