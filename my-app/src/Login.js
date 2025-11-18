import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Successful login → redirect to landing page
      navigate("/landing");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "50px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "5px" }}
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "5px" }}
        />

        <button type="submit" style={{ width: "100%", marginTop: "10px" }}>
          Login
        </button>
      </form>

      {/* Display error message */}
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
      )}

      {/* Create Account link */}
      <p style={{ marginTop: "15px" }}>
        Don't have an account?{" "}
        <a href="/signup" style={{ color: "blue" }}>
          Create one
        </a>
      </p>
    </div>
  );
}
