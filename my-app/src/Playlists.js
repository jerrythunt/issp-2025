// src/Playlists.js
import { useEffect, useState, useRef } from "react";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs, updateDoc, deleteDoc, doc, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Playlists.css";

export default function Playlists() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [mood, setMood] = useState([]);

  const audioRef = useRef(null);

  /** ---------------- AUTH ---------------- **/
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (!currentUser) navigate("/"); 
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [navigate]);

  /** ---------------- FETCH PLAYLISTS ---------------- **/
  const fetchUserPlaylists = async () => {
    if (!user) return;
    const playlistRef = collection(db, "users", user.uid, "playlists");
    const snapshot = await getDocs(playlistRef);
    setPlaylists(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };
  useEffect(() => { fetchUserPlaylists(); }, [user]);

  /** ---------------- DELETE PLAYLIST ---------------- **/
  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm("Delete this playlist?")) return;
    await deleteDoc(doc(db, "users", user.uid, "playlists", playlistId));
    fetchUserPlaylists();
  };

  /** ---------------- REMOVE SONG ---------------- **/
  const handleRemoveSong = async (playlistId, song) => {
    const playlistRef = doc(db, "users", user.uid, "playlists", playlistId);
    await updateDoc(playlistRef, {
      songs: playlists.find(p => p.id === playlistId).songs.filter(s => s.id !== song.id)
    });
    fetchUserPlaylists();
  };

  /** ---------------- PLAY SONG & SHOW MOOD MODAL ---------------- **/
  const playSong = (playlistId, index) => {
    setCurrentPlaylistId(playlistId);
    setCurrentSongIndex(index);
    setCurrentSong(playlists.find(p => p.id === playlistId).songs[index]);
    setMood([]); // Reset mood selections for new song
  };

  /** ---------------- SAVE MOOD ---------------- **/
  const saveMood = async (selectedMood) => {
    if (!currentSong) return;

    const now = new Date();
    setMood(prev => prev ? [...new Set([...prev, selectedMood])] : [selectedMood]);

    try {
      const historyRef = collection(db, "users", user.uid, "moodHistory");
      await addDoc(historyRef, {
        songId: currentSong.id,
        title: currentSong.title,
        artist: currentSong.artist,
        moods: [selectedMood],
        timestamp: Math.floor(audioRef.current?.currentTime || 0),
        listenedAt: now,
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds()
      });
    } catch (err) {
      console.error(err);
    }
  };

  /** ---------------- AUTO PLAY NEXT ---------------- **/
  const handleEnded = () => {
    const playlist = playlists.find(p => p.id === currentPlaylistId);
    if (!playlist) return;
    const nextIndex = currentSongIndex + 1;
    if (nextIndex < playlist.songs.length) {
      setCurrentSongIndex(nextIndex);
      setCurrentSong(playlist.songs[nextIndex]);
      setMood([]);
    } else {
      setCurrentSong(null);
      setCurrentPlaylistId(null);
      setCurrentSongIndex(0);
      setMood([]);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="playlists-container">
      <h1>{user.email}'s Playlists</h1>
      {playlists.length === 0 && <p>You have no playlists.</p>}

      {playlists.map(p => (
        <div key={p.id} className="playlist-card">
          <h2>{p.name}</h2>
          <button className="delete-playlist-btn" onClick={() => handleDeletePlaylist(p.id)}>Delete Playlist</button>

          {p.songs && p.songs.length > 0 ? (
            <ol>
              {p.songs.map((song, index) => (
                <li key={song.id} className="playlist-song">
                  <img src={song.artwork} alt={song.title} />
                  <div className="song-info">
                    <p><strong>{song.title}</strong> by {song.artist}</p>
                  </div>
                  <div className="song-actions">
                    <button onClick={() => playSong(p.id, index)}>Play</button>
                    <button onClick={() => handleRemoveSong(p.id, song)}>Remove</button>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p>No songs in this playlist.</p>
          )}
        </div>
      ))}

      {/* SONG PLAYER MODAL WITH MOOD TRACKER */}
      {currentSong && (
        <div className="song-modal">
          <div className="song-modal-content">
            <img src={currentSong.artwork} alt={currentSong.title} />
            <audio ref={audioRef} src={currentSong.previewUrl} controls autoPlay onEnded={handleEnded} />
            
            <div className="mood-buttons">
              <p>How are you feeling? {mood.length > 0 && `(Selected: ${mood.join(", ")})`}</p>
              {["Happy", "Sad", "Excited"].map(m => (
                <button
                  key={m}
                  onClick={() => saveMood(m)}
                  className={mood.includes(m) ? "selected-mood" : ""}
                >
                  {m}
                </button>
              ))}
            </div>

            <button className="close-modal" onClick={() => setCurrentSong(null)}>❌</button>
          </div>
        </div>
      )}
    </div>
  );
}
