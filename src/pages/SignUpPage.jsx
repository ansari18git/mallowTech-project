import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  // MOCK: Always succeed after 1 second
  setTimeout(() => {
    setLoading(false);
    navigate("/login");
  }, 1000);
};

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default SignUpPage;