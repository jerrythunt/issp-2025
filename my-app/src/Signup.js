import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password || !firstName || !lastName || !dob) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      console.log("handleSignup called", { email, password, firstName, lastName, dob });

      // 1️⃣ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Firebase Auth success:", user);

      // 2️⃣ Write user profile to Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        firstName,
        lastName,
        email,
        dob,
        createdAt: serverTimestamp() // ensures Firestore generates a proper timestamp
      });
      console.log("Firestore write success at:", userRef.path);

      setSuccess("Account created successfully! Redirecting to login...");
      setLoading(false);

      // Redirect after 3 seconds
      setTimeout(() => navigate("/"), 3000);

    } catch (err) {
      console.error("Signup error:", err);
      setLoading(false);

      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Redirecting to login...");
        setTimeout(() => navigate("/"), 3000);
      } else {
        setError("Unable to create account. Please try again.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>Create Account</h2>

      <form onSubmit={handleSignup}>
        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Date of Birth:</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{ width: "100%", marginTop: "10px" }}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "15px" }}>{success}</p>}

      <p style={{ marginTop: "15px" }}>
        Already have an account?{" "}
        <Link to="/" style={{ color: "blue" }}>
          Log in
        </Link>
      </p>
    </div>
  );
}
