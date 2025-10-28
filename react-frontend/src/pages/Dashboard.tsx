import React, { useState } from 'react';
import SideNav from '../components/dashboard/SideNav';
import PlaylistList from '../components/dashboard/PlaylistList';
import Timeline from '../components/dashboard/Timeline';
import AudioPlayer from '../components/dashboard/AudioPlayer';

export type Track = {
  id: string;
  title: string;
  artist: string;
  url: string;     // audio file
  date: string;    // e.g., "02.10"
};

const sampleTracks: Track[] = [
  {
    id: 't1',
    title: 'Song Alpha',
    artist: 'Artist One',
    // Put your own file into public/assets/audio/sample1.mp3 or use a demo URL:
    url: '/assets/audio/sample1.mp3',
    date: '02.10',
  },
  {
    id: 't2',
    title: 'Song Beta',
    artist: 'Artist Two',
    url: '/assets/audio/sample2.mp3',
    date: '01.10',
  },
];

const Dashboard: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(sampleTracks[0] || null);

  const playlists = [
    'Playlist Title',
    'Playlist Title',
    'Playlist Title',
    'Playlist Title',
    'Playlist Title',
  ];

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidenav">
        <SideNav
          appTitle="BrainTest Music"
          version="5.5.1"
          playlists={playlists}
        />
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Dashboard</h2>
        </header>

        <section>
          <h3 className="section-heading">Playlists</h3>
          <PlaylistList
            playlists={playlists}
            onSelect={(name) => console.log('Selected playlist:', name)}
          />
        </section>

        <section style={{ marginTop: 24 }}>
          <h3 className="section-heading">Timeline</h3>
          <Timeline
            tracks={sampleTracks}
            onPlay={handlePlayTrack}
          />
        </section>
      </main>

      <footer className="dashboard-player">
        <AudioPlayer track={currentTrack} />
      </footer>
    </div>
  );
};

export default Dashboard;
