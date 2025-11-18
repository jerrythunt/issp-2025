// src/Header.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/"); // redirect to login
  };

  return (
    <header className="header">
      <div className="menu-button-container">
        <button className="menu-button" onClick={() => setOpen(!open)}>☰</button>
        {open && (
          <div className="menu-dropdown">
            <button onClick={() => navigate("/landing")}>Home</button>
            <button onClick={() => navigate("/playlists")}>My Playlists</button>
            <button onClick={() => navigate("/preferences")}>My Preferences</button>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </div>
    </header>
  );
}
