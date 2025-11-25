import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Preferences from "./Preferences";
import Playlists from "./Playlists";
import Landing from "./Landing";
import MoodHistory from "./MoodHistory"
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./DashboardLayout";

// Wrapper component to conditionally render Dashboard Layout
function LayoutWrapper({ children }) {
  const location = useLocation();
  const authPaths = ["/", "/signup"]; // pages without dashboard
  const showDashboard = !authPaths.includes(location.pathname);

  return (
    <>
      {showDashboard ? (
        <DashboardLayout>{children}</DashboardLayout>
      ) : (
        children
      )}
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
