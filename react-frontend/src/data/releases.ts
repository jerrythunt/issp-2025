// Release and track metadata for packaged audio files.
// Updated to include six genre clips: blues, classical, gospel, rap, rnb, rock.

export interface TrackMeta {
  trackId: string;
  title: string;
  duration?: string; 
  audioSrc: string;
  genre: string; // e.g., 'blues', 'classical', etc.
}

export interface ReleaseMeta {
  releaseId: string;
  title: string;
  artist?: string;
  releaseDate?: string; 
  thumbnail?: string;
  tracks: TrackMeta[];
}

// Single release that groups the six genre clips.
export const releases: ReleaseMeta[] = [
  {
    releaseId: 'genre-clips',
    title: 'Genre Clips',
    artist: 'Various',
    releaseDate: '2025-11-17',
    thumbnail: '/assets/images/genre-clips.jpg',
    tracks: [
      { trackId: '01',
        title: 'Blues',
        duration: undefined,
        audioSrc: '/assets/audio/blues.mp3',
        genre: 'blues' },

      { trackId: '02',
        title: 'Classical',
        duration: undefined,
        audioSrc: '/assets/audio/classical.mp3',
        genre: 'classical' },

      { trackId: '03',
        title: 'Gospel',
        duration: undefined,
        audioSrc: '/assets/audio/gospel.mp3',
        genre: 'gospel' },

      { trackId: '04',
        title: 'Rap',
        duration: undefined,
        audioSrc: '/assets/audio/rap.mp3',
        genre: 'rap' },

      { trackId: '05',
        title: 'R&B',
        duration: undefined,
        audioSrc: '/assets/audio/rnb.mp3',
        genre: 'rnb' },

      { trackId: '06',
        title: 'Rock',
        duration: undefined,
        audioSrc: '/assets/audio/rock.mp3',
        genre: 'rock' }
    ]
  }
];

export default releases;