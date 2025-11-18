// src/MoodHistory.js
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./MoodHistory.css";

export default function MoodHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/");
      else fetchMoodHistory(user.uid);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchMoodHistory = async (uid) => {
    try {
      const historyRef = collection(db, "users", uid, "moodHistory");
      const snapshot = await getDocs(historyRef);

      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d.title || "Unknown Song",
          artist: d.artist || "Unknown Artist",
          timestamp: typeof d.timestamp === "number" ? d.timestamp : 0,
          moods: Array.isArray(d.moods) ? d.moods : [], // safe fallback
          day: d.day || 0,
          month: d.month || 0,
          year: d.year || 0,
          hours: d.hours || 0,
          minutes: d.minutes || 0,
          seconds: d.seconds || 0,
        };
      }); // <-- semicolon added here

      // sort by date/time
      data.sort((a, b) => {
        const dateA = new Date(a.year, a.month - 1, a.day, a.hours, a.minutes, a.seconds);
        const dateB = new Date(b.year, b.month - 1, b.day, b.hours, b.minutes, b.seconds);
        return dateB - dateA;
      });

      setHistory(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching mood history:", err);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading mood history...</p>;

  return (
    <div className="mood-history-container">
      <h2>Mood History</h2>
      {history.length === 0 ? (
        <p>No moods recorded yet.</p>
      ) : (
        <table className="mood-history-table">
          <thead>
            <tr>
              <th>Song</th>
              <th>Artist</th>
              <th>Moods</th>
              <th>Date & Time</th>
              <th>Time Into Song (s)</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.title}</td>
                <td>{entry.artist}</td>
                <td>{entry.moods.length > 0 ? entry.moods.join(", ") : "No mood recorded"}</td>
                <td>{`${entry.year}-${String(entry.month).padStart(2, "0")}-${String(entry.day).padStart(2, "0")} ${String(entry.hours).padStart(2, "0")}:${String(entry.minutes).padStart(2, "0")}:${String(entry.seconds).padStart(2, "0")}`}</td>
                <td>{entry.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
