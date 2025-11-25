import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdDashboard, 
  MdTimeline, 
  MdSettings, 
  MdHelpOutline, 
  MdLogout
} from 'react-icons/md';
import { auth, db } from '../firebaseConfig';
import { User, signOut } from 'firebase/auth';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import './Timeline.css';

interface TimelineEntry {
  id: string;
  songId: number;
  title: string;
  artist: string;
  artwork?: string;
  emoji: string;
  timestamp: number;
  listenedAt: Date;
  day: number;
  month: number;
  year: number;
  hours: number;
  minutes: number;
  seconds: number;
  moods?: string[];
}

const Timeline: React.FC = () => {
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchTimeline(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTimeline = async (uid: string) => {
    try {
      const historyRef = collection(db, "users", uid, "moodHistory");
      const q = query(historyRef, orderBy("listenedAt", "desc"));
      const snapshot = await getDocs(q);
      
      const entries: TimelineEntry[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        listenedAt: doc.data().listenedAt?.toDate() || new Date(),
      })) as TimelineEntry[];
      
      setTimelineEntries(entries);
    } catch (err) {
      console.error("Failed to fetch timeline:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatFullTimestamp = (date: Date | number) => {
    const d = typeof date === 'number' ? new Date(date) : date;
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const getEmojiColorClass = (emoji: string) => {
    switch (emoji) {
      case '😊':
        return 'happy';
      case '😢':
        return 'sad';
      case '⚡':
        return 'energetic';
      case '🧘':
        return 'calm';
      default:
        return '';
    }
  };

  return (
    <div className="timeline">
      <aside className="sidenav">
        <div className="sidenav-header">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img 
              src="/assets/images/braintest-logo.png" 
              alt="BrainTest Music" 
              className="logo-icon"
            />
          </div>
        </div>
        
        <div className="nav-section">
          <h3 className="nav-section-title">Menu</h3>
          <div className="nav-divider"></div>
          <nav className="nav-items">
            <div className="nav-item" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
              <span className="nav-icon"><MdDashboard /></span>
              <span>Dashboard</span>
            </div>
            <div className="nav-item active">
              <span className="nav-icon"><MdTimeline /></span>
              <span>Timeline</span>
            </div>
          </nav>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Help</h3>
          <div className="nav-divider"></div>
          <nav className="nav-items">
            <div className="nav-item" onClick={() => alert('Settings page coming soon!')} style={{ cursor: 'pointer' }}>
              <span className="nav-icon"><MdSettings /></span>
              <span>Settings</span>
            </div>
            <div className="nav-item" onClick={() => navigate('/dashboard/faq')} style={{ cursor: 'pointer' }}>
              <span className="nav-icon"><MdHelpOutline /></span>
              <span>FAQs</span>
            </div>
            <div className="nav-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <span className="nav-icon"><MdLogout /></span>
              <span>Log out</span>
            </div>
          </nav>
        </div>

        <button className="change-genre-btn" onClick={() => navigate('/dashboard')}>
          Change Genre
        </button>

        <div className="version-info">
          <span>version 5.5.1</span>
        </div>
      </aside>

      <main className="main-content">
        <h1>Timeline</h1>
        {loading ? (
          <p>Loading timeline...</p>
        ) : timelineEntries.length > 0 ? (
          <div className="timeline-entries">
            {timelineEntries.map((entry) => (
              <div key={entry.id} className={`timeline-entry ${getEmojiColorClass(entry.emoji)}`}>
                <div className="timeline-song-info">
                  {entry.artwork && (
                    <img 
                      src={entry.artwork} 
                      alt={entry.title}
                      className="timeline-album-art"
                      style={{ width: '60px', height: '60px', borderRadius: '8px', marginRight: '16px' }}
                    />
                  )}
                  <div>
                    <p className="timeline-song-title">{entry.title}</p>
                    <p className="timeline-song-artist">{entry.artist}</p>
                    <p className="timeline-song-timestamp">{formatTime(entry.timestamp)}</p>
                    {entry.moods && entry.moods.length > 0 && (
                      <p className="timeline-moods">
                        {entry.moods.map((mood, i) => (
                          <span key={i} className="mood-tag">{mood}</span>
                        ))}
                      </p>
                    )}
                  </div>
                </div>
                <p className="timeline-emoji">{entry.emoji}</p>
                <p className="timeline-timestamp">{formatFullTimestamp(entry.listenedAt)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No timeline entries yet. Start listening to music and reacting with emojis!</p>
        )}
      </main>
    </div>
  );
};

export default Timeline;
