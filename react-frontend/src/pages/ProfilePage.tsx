import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdDashboard, 
  MdTimeline, 
  MdSettings, 
  MdHelpOutline, 
  MdLogout,
  MdPerson
} from 'react-icons/md';
import { auth, db } from '../firebaseConfig';
import { User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './ProfilePage.css';

const BACKEND_URL = 'http://localhost:8888/api/music';
const GENRES = [
  "Pop", "Rock", "Jazz", "Hip-Hop", "Classical", "Electronic", "Country", "Reggae", "R&B", "Metal",
  "Indie", "Alternative", "Blues", "Folk", "Punk", "Soul", "Funk", "Latin", "K-Pop", "EDM",
  "House", "Techno", "Trap", "Lo-fi", "Ambient", "Gospel", "World", "Ska", "Disco", "Grunge"
];

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingDOB, setEditingDOB] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setEmail(currentUser.email || '');
        await fetchUserData(currentUser.uid);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || '');
        setPhoneNumber(data.phoneNumber || '');
        setDateOfBirth(data.dateOfBirth || '');
        setPreferences(data.preferences || []);
        setSelectedGenres(data.preferences || []);
        
        // If no preferences set, automatically show genre selection
        if (!data.preferences || data.preferences.length < 3) {
          setShowGenreModal(true);
        }
      } else {
        // New user - show genre selection
        setShowGenreModal(true);
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  const handleUpdateName = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${BACKEND_URL}/user/${user.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (response.ok) {
        setEditingName(false);
      }
    } catch (err) {
      console.error('Failed to update name:', err);
    }
  };

  const handleUpdateDOB = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${BACKEND_URL}/user/${user.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateOfBirth })
      });
      if (response.ok) {
        setEditingDOB(false);
      }
    } catch (err) {
      console.error('Failed to update DOB:', err);
    }
  };

  const handleUpdatePhone = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${BACKEND_URL}/user/${user.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      if (response.ok) {
        setEditingPhone(false);
      }
    } catch (err) {
      console.error('Failed to update phone:', err);
    }
  };

  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSaveGenres = async () => {
    if (!user || selectedGenres.length < 3) {
      alert('Please select at least 3 genres');
      return;
    }
    try {
      // Save to Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        name: name,
        dateOfBirth: dateOfBirth,
        phoneNumber: phoneNumber,
        preferences: selectedGenres
      }, { merge: true });
      
      setPreferences(selectedGenres);
      setShowGenreModal(false);
      // Preferences saved silently
    } catch (err) {
      console.error('Failed to update genres:', err);
      alert('Failed to save preferences. Please try again.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="main-content">Loading...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Sidebar */}
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
              <span className="nav-icon"><MdPerson /></span>
              <span>Profile</span>
            </div>
            <div className="nav-item" onClick={() => navigate('/timeline')} style={{ cursor: 'pointer' }}>
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

        <div className="version-info">
          <span>version 5.5.1</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="profile-content">
        <section className="profile-section">
          <h2 className="section-title">Account Information</h2>
          <div className="section-divider"></div>

          {/* Email */}
          <div className="info-row">
            <label className="info-label">Email</label>
            <div className="info-value-container">
              {editingEmail ? (
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="info-input"
                />
              ) : (
                <>
                  <span className="info-value">{email}</span>
                  <span className="info-status unverified">Unverified</span>
                </>
              )}
              <button 
                className="edit-btn" 
                onClick={() => setEditingEmail(!editingEmail)}
              >
                Edit
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="info-row">
            <label className="info-label">Password</label>
            <div className="info-value-container">
              <span className="info-value">************</span>
              <button 
                className="edit-btn" 
                onClick={() => setEditingPassword(!editingPassword)}
              >
                Edit
              </button>
            </div>
          </div>

          {/* Name */}
          <div className="info-row">
            <label className="info-label">Name</label>
            <div className="info-value-container">
              {editingName ? (
                <>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="info-input"
                  />
                  <button className="save-btn" onClick={handleUpdateName}>Save</button>
                </>
              ) : (
                <>
                  <span className="info-value">{name || 'Not set'}</span>
                  <button 
                    className="edit-btn" 
                    onClick={() => setEditingName(true)}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Date of Birth */}
          <div className="info-row">
            <label className="info-label">Date of Birth</label>
            <div className="info-value-container">
              {editingDOB ? (
                <>
                  <input 
                    type="date" 
                    value={dateOfBirth} 
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="info-input"
                  />
                  <button className="save-btn" onClick={handleUpdateDOB}>Save</button>
                </>
              ) : (
                <>
                  <span className="info-value">
                    {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Not set'}
                  </span>
                  <button 
                    className="edit-btn" 
                    onClick={() => setEditingDOB(true)}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div className="info-row">
            <label className="info-label">Phone Number</label>
            <div className="info-value-container">
              {editingPhone ? (
                <>
                  <input 
                    type="tel" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="info-input"
                    placeholder="(123) 456-7890"
                  />
                  <button className="save-btn" onClick={handleUpdatePhone}>Save</button>
                </>
              ) : (
                <>
                  <span className="info-value">{phoneNumber || 'Not set'}</span>
                  <button 
                    className="edit-btn" 
                    onClick={() => setEditingPhone(true)}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User ID */}
          <div className="info-row">
            <label className="info-label">User ID</label>
            <div className="info-value-container">
              <span className="info-value">{user?.uid || 'N/A'}</span>
            </div>
          </div>

          {/* Created At */}
          <div className="info-row">
            <label className="info-label">Member Since</label>
            <div className="info-value-container">
              <span className="info-value">
                {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </span>
            </div>
          </div>

          {/* Last Sign In */}
          <div className="info-row">
            <label className="info-label">Last Sign In</label>
            <div className="info-value-container">
              <span className="info-value">
                {user?.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </span>
            </div>
          </div>
        </section>

        {/* Music Preferences */}
        <section className="profile-section">
          <div className="section-header-with-edit">
            <h2 className="section-title">Music Preferences</h2>
            {preferences.length > 0 && (
              <button 
                className="edit-btn"
                onClick={() => setShowGenreModal(!showGenreModal)}
              >
                {showGenreModal ? 'Cancel' : 'Edit'}
              </button>
            )}
          </div>
          <div className="section-divider"></div>
          
          {!showGenreModal ? (
            preferences.length > 0 ? (
              <div className="music-tiles">
                {preferences.map((genre, index) => (
                  <div 
                    key={index} 
                    className={`music-tile ${index % 2 === 0 ? 'purple' : 'orange'}`}
                  >
                    {genre}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '1rem', background: '#FFF3E0', borderRadius: '8px', marginTop: '1rem' }}>
                <p style={{ color: '#ED6F3A', fontWeight: 'bold', margin: 0 }}>
                  ⚠️ Please select at least 3 genres to continue
                </p>
              </div>
            )
          ) : (
            <div className="genre-selection-inline">
              <p className="genre-instruction">Select Your Favorite Genres (minimum 3)</p>
              <div className="genre-grid">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`genre-btn ${selectedGenres.includes(genre) ? 'selected' : ''}`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  onClick={handleSaveGenres}
                  className="save-btn"
                  disabled={selectedGenres.length < 3}
                  style={{ 
                    padding: '12px 24px',
                    opacity: selectedGenres.length < 3 ? 0.5 : 1,
                    cursor: selectedGenres.length < 3 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Save Preferences ({selectedGenres.length}/3 minimum)
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
