import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
<<<<<<< HEAD
=======
import { AuthProvider } from './AuthContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext'; // Import AudioPlayerProvider
>>>>>>> feature/frontend-dashboard

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
<<<<<<< HEAD
    <App />
=======
    <AuthProvider>
      <AudioPlayerProvider> {/* Wrap App with AudioPlayerProvider */}
        <App />
      </AudioPlayerProvider>
    </AuthProvider>
>>>>>>> feature/frontend-dashboard
  </React.StrictMode>
);