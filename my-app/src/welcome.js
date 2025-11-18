// Welcome.js
import { useParams } from "react-router-dom";

export default function Welcome() {
  const { username } = useParams();
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome, {username}!</h1>
      <p>You successfully logged in using Firebase.</p>
    </div>
  );
}
