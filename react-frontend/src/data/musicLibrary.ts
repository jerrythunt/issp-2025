// Music Library - Local songs organized by genre
// Place MP3 files in public/assets/music/ folder

export interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  audioUrl: string;
  duration: number; // in seconds
  genre: string;
}

export interface PlaylistData {
  name: string;
  genres: string[];
  songs: Song[];
}

// Sample songs for each genre
// NOTE: You'll need to add actual MP3 files to public/assets/music/
// For now, these reference placeholder paths
export const musicLibrary: Record<string, Song[]> = {
  'Rock': [
    {
      id: 'rock-1',
      title: 'Summer Breeze',
      artist: 'Classic Rock Band',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/rock-1.mp3',
      duration: 180,
      genre: 'Rock'
    },
    {
      id: 'rock-2',
      title: 'Highway Dreams',
      artist: 'The Wanderers',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/rock-2.mp3',
      duration: 210,
      genre: 'Rock'
    },
    {
      id: 'rock-3',
      title: 'Electric Nights',
      artist: 'Voltage',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/rock-3.mp3',
      duration: 195,
      genre: 'Rock'
    }
  ],
  'Jazz': [
    {
      id: 'jazz-1',
      title: 'Midnight Blues',
      artist: 'Smooth Quartet',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/jazz-1.mp3',
      duration: 240,
      genre: 'Jazz'
    },
    {
      id: 'jazz-2',
      title: 'City Lights',
      artist: 'Urban Jazz Ensemble',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/jazz-2.mp3',
      duration: 220,
      genre: 'Jazz'
    },
    {
      id: 'jazz-3',
      title: 'Sunset Serenade',
      artist: 'The Cool Cats',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/jazz-3.mp3',
      duration: 200,
      genre: 'Jazz'
    }
  ],
  'Classical': [
    {
      id: 'classical-1',
      title: 'Morning Sonata',
      artist: 'Symphony Orchestra',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/classical-1.mp3',
      duration: 300,
      genre: 'Classical'
    },
    {
      id: 'classical-2',
      title: 'Piano Concerto',
      artist: 'Royal Philharmonic',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/classical-2.mp3',
      duration: 280,
      genre: 'Classical'
    },
    {
      id: 'classical-3',
      title: 'String Quartet No. 5',
      artist: 'Chamber Music Society',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/classical-3.mp3',
      duration: 260,
      genre: 'Classical'
    }
  ],
  'Pop': [
    {
      id: 'pop-1',
      title: 'Dancing Days',
      artist: 'Pop Stars',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/pop-1.mp3',
      duration: 190,
      genre: 'Pop'
    },
    {
      id: 'pop-2',
      title: 'Summer Love',
      artist: 'The Heartbeats',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/pop-2.mp3',
      duration: 175,
      genre: 'Pop'
    },
    {
      id: 'pop-3',
      title: 'Neon Lights',
      artist: 'City Pop',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/pop-3.mp3',
      duration: 185,
      genre: 'Pop'
    }
  ],
  'Country': [
    {
      id: 'country-1',
      title: 'Country Roads',
      artist: 'The Travelers',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/country-1.mp3',
      duration: 210,
      genre: 'Country'
    },
    {
      id: 'country-2',
      title: 'Home Sweet Home',
      artist: 'Nashville Stars',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/country-2.mp3',
      duration: 195,
      genre: 'Country'
    },
    {
      id: 'country-3',
      title: 'Sunset Ranch',
      artist: 'Wild West Band',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/country-3.mp3',
      duration: 205,
      genre: 'Country'
    }
  ],
  'Blues': [
    {
      id: 'blues-1',
      title: 'Stormy Monday',
      artist: 'Delta Blues Band',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/blues-1.mp3',
      duration: 225,
      genre: 'Blues'
    },
    {
      id: 'blues-2',
      title: 'Sweet Home Chicago',
      artist: 'Blues Brothers',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/blues-2.mp3',
      duration: 240,
      genre: 'Blues'
    },
    {
      id: 'blues-3',
      title: 'Crossroads',
      artist: 'Guitar Legends',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/blues-3.mp3',
      duration: 215,
      genre: 'Blues'
    }
  ],
  'R&B': [
    {
      id: 'rnb-1',
      title: 'Soul Sensation',
      artist: 'Smooth Grooves',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/rnb-1.mp3',
      duration: 200,
      genre: 'R&B'
    },
    {
      id: 'rnb-2',
      title: 'Velvet Nights',
      artist: 'The Soul Singers',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/rnb-2.mp3',
      duration: 190,
      genre: 'R&B'
    },
    {
      id: 'rnb-3',
      title: 'Rhythm & Love',
      artist: 'Urban Soul',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/rnb-3.mp3',
      duration: 185,
      genre: 'R&B'
    }
  ],
  'Folk': [
    {
      id: 'folk-1',
      title: 'Mountain Song',
      artist: 'Acoustic Wanderers',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/folk-1.mp3',
      duration: 220,
      genre: 'Folk'
    },
    {
      id: 'folk-2',
      title: 'River Stories',
      artist: 'The Folk Collective',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/folk-2.mp3',
      duration: 235,
      genre: 'Folk'
    },
    {
      id: 'folk-3',
      title: 'Wildflower',
      artist: 'Country Folk',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/folk-3.mp3',
      duration: 210,
      genre: 'Folk'
    }
  ],
  'Hip Hop': [
    {
      id: 'hiphop-1',
      title: 'Street Poetry',
      artist: 'Urban Flow',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/hiphop-1.mp3',
      duration: 190,
      genre: 'Hip Hop'
    },
    {
      id: 'hiphop-2',
      title: 'City Beats',
      artist: 'The MC Collective',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/hiphop-2.mp3',
      duration: 205,
      genre: 'Hip Hop'
    },
    {
      id: 'hiphop-3',
      title: 'Rhythm & Rhyme',
      artist: 'Beat Masters',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/hiphop-3.mp3',
      duration: 215,
      genre: 'Hip Hop'
    }
  ],
  'Electronic': [
    {
      id: 'electronic-1',
      title: 'Digital Dreams',
      artist: 'Synth Wave',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/electronic-1.mp3',
      duration: 240,
      genre: 'Electronic'
    },
    {
      id: 'electronic-2',
      title: 'Pulse',
      artist: 'Neon Lights',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/electronic-2.mp3',
      duration: 220,
      genre: 'Electronic'
    },
    {
      id: 'electronic-3',
      title: 'Circuit Break',
      artist: 'Digital Fusion',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/electronic-3.mp3',
      duration: 230,
      genre: 'Electronic'
    }
  ],
  'Reggae': [
    {
      id: 'reggae-1',
      title: 'Island Vibes',
      artist: 'Tropical Rhythms',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/reggae-1.mp3',
      duration: 195,
      genre: 'Reggae'
    },
    {
      id: 'reggae-2',
      title: 'Sunshine Groove',
      artist: 'Caribbean Soul',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/reggae-2.mp3',
      duration: 210,
      genre: 'Reggae'
    },
    {
      id: 'reggae-3',
      title: 'One Love',
      artist: 'Unity Band',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/reggae-3.mp3',
      duration: 205,
      genre: 'Reggae'
    }
  ],
  'Metal': [
    {
      id: 'metal-1',
      title: 'Iron Thunder',
      artist: 'Heavy Storm',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/metal-1.mp3',
      duration: 215,
      genre: 'Metal'
    },
    {
      id: 'metal-2',
      title: 'Rage Machine',
      artist: 'Steel Force',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/metal-2.mp3',
      duration: 225,
      genre: 'Metal'
    },
    {
      id: 'metal-3',
      title: 'Dark Abyss',
      artist: 'Shadow Legion',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/metal-3.mp3',
      duration: 240,
      genre: 'Metal'
    }
  ],
  'Indie': [
    {
      id: 'indie-1',
      title: 'Coffee Shop Dreams',
      artist: 'The Wandering Hearts',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/indie-1.mp3',
      duration: 185,
      genre: 'Indie'
    },
    {
      id: 'indie-2',
      title: 'Late Night Drive',
      artist: 'Echo & Fade',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/indie-2.mp3',
      duration: 200,
      genre: 'Indie'
    },
    {
      id: 'indie-3',
      title: 'Vinyl Days',
      artist: 'Retro Souls',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/indie-3.mp3',
      duration: 195,
      genre: 'Indie'
    }
  ],
  'Soul': [
    {
      id: 'soul-1',
      title: 'Smooth Operator',
      artist: 'Velvet Voice',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/soul-1.mp3',
      duration: 220,
      genre: 'Soul'
    },
    {
      id: 'soul-2',
      title: 'Heart & Soul',
      artist: 'Deep Groove',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/soul-2.mp3',
      duration: 235,
      genre: 'Soul'
    },
    {
      id: 'soul-3',
      title: 'Midnight Soul',
      artist: 'Satin Strings',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/soul-3.mp3',
      duration: 210,
      genre: 'Soul'
    }
  ],
  'Funk': [
    {
      id: 'funk-1',
      title: 'Get Down Tonight',
      artist: 'Funky Bunch',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/funk-1.mp3',
      duration: 205,
      genre: 'Funk'
    },
    {
      id: 'funk-2',
      title: 'Bass Line Fever',
      artist: 'Groove Machine',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/funk-2.mp3',
      duration: 215,
      genre: 'Funk'
    },
    {
      id: 'funk-3',
      title: 'Funky Fresh',
      artist: 'The Groove Squad',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/funk-3.mp3',
      duration: 200,
      genre: 'Funk'
    }
  ],
  'Latin': [
    {
      id: 'latin-1',
      title: 'Salsa Caliente',
      artist: 'Los Ritmos',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/latin-1.mp3',
      duration: 210,
      genre: 'Latin'
    },
    {
      id: 'latin-2',
      title: 'Bachata Love',
      artist: 'Tropical Heat',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/latin-2.mp3',
      duration: 225,
      genre: 'Latin'
    },
    {
      id: 'latin-3',
      title: 'Cumbia Nights',
      artist: 'La Banda',
      albumArt: '/assets/images/placeholder.jpg',
      audioUrl: '/assets/music/latin-3.mp3',
      duration: 215,
      genre: 'Latin'
    }
  ]
};

// Get songs for a specific genre
export const getSongsForGenre = (genre: string): Song[] => {
  return musicLibrary[genre] || [];
};

// Get all liked songs (from localStorage)
export const getLikedSongs = (): Song[] => {
  const likedSongIds = JSON.parse(localStorage.getItem('likedSongs') || '[]');
  const allSongs = Object.values(musicLibrary).flat();
  return allSongs.filter(song => likedSongIds.includes(song.id));
};

// Toggle like status for a song
export const toggleSongLike = (songId: string): boolean => {
  const likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
  const index = likedSongs.indexOf(songId);
  
  if (index > -1) {
    likedSongs.splice(index, 1);
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    return false;
  } else {
    likedSongs.push(songId);
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    return true;
  }
};

// Check if a song is liked
export const isSongLiked = (songId: string): boolean => {
  const likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
  return likedSongs.includes(songId);
};

// Like all songs in a genre/playlist
export const likeAllSongsInGenre = (genre: string): void => {
  const songs = getSongsForGenre(genre);
  const likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
  const songIds = songs.map(song => song.id);
  
  // Add all song IDs that aren't already liked
  songIds.forEach(id => {
    if (!likedSongs.includes(id)) {
      likedSongs.push(id);
    }
  });
  
  localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
};

// Unlike all songs in a genre/playlist
export const unlikeAllSongsInGenre = (genre: string): void => {
  const songs = getSongsForGenre(genre);
  const likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
  const songIds = songs.map(song => song.id);
  
  // Remove all song IDs from liked songs
  const updatedLikedSongs = likedSongs.filter((id: string) => !songIds.includes(id));
  
  localStorage.setItem('likedSongs', JSON.stringify(updatedLikedSongs));
};

// Format time in seconds to MM:SS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
