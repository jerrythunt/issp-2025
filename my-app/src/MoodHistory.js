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
        const d = doc.data() || {};
        return {
          id: doc.id,
          title: d.title || "Unknown Song",
          artist: d.artist || "Unknown Artist",
          moods: Array.isArray(d.moods) ? d.moods : [],
          timestamp: typeof d.timestamp === "number" ? d.timestamp : "N/A",
          day: typeof d.day === "number" ? d.day : 0,
          month: typeof d.month === "number" ? d.month : 0,
          year: typeof d.year === "number" ? d.year : 0,
          hours: typeof d.hours === "number" ? d.hours : 0,
          minutes: typeof d.minutes === "number" ? d.minutes : 0,
          seconds: typeof d.seconds === "number" ? d.seconds : 0,
        };
      }); // semicolon fixes parsing error

      // Sort by datetime descending
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
            {history.map((entry) => {
              const dateStr = entry.year && entry.month && entry.day
                ? `${entry.year}-${String(entry.month).padStart(2, "0")}-${String(entry.day).padStart(2, "0")} ${String(entry.hours).padStart(2, "0")}:${String(entry.minutes).padStart(2, "0")}:${String(entry.seconds).padStart(2, "0")}`
                : "N/A";

              return (
                <tr key={entry.id}>
                  <td>{entry.title}</td>
                  <td>{entry.artist}</td>
                  <td>{entry.moods.length > 0 ? entry.moods.join(", ") : "N/A"}</td>
                  <td>{dateStr}</td>
                  <td>{entry.timestamp !== "N/A" ? entry.timestamp : "N/A"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
