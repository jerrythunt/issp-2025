import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Preferences from "./Preferences";
import Playlists from "./Playlists";
import Landing from "./Landing";
import MoodHistory from "./MoodHistory"
import ProtectedRoute from "./ProtectedRoute";
import Header from "./Header"; // import the header
import { db } from "./firebase";

// Wrapper component to conditionally render Header
function LayoutWrapper({ children }) {
  const location = useLocation();
  const hideHeaderPaths = ["/", "/signup"]; // pages without header
  const showHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* Login page */}
          <Route path="/" element={<Login />} />

          {/* Signup page */}
          <Route path="/signup" element={<Signup />} />

          {/* Preferences page */}
          <Route path="/preferences" element={<Preferences />} />

          <Route path="/moodHistory" element={<MoodHistory />} />

          {/* Playlists page */}
          <Route path="/playlists" element={<Playlists />} />

          {/* Protected landing page */}
          <Route
            path="/landing"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}
