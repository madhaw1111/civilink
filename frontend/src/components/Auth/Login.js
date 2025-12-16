import React, { useState } from "react";
import "./auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE 👉", data); // 🔍 keep for now

      if (!res.ok) {
        setLoading(false);
        return setError(data.message || "Login failed");
      }

      // 🔴 HARD SAFETY CHECKS (IMPORTANT)
      if (!data || !data.user || !data.token) {
        setLoading(false);
        return setError("Login failed: token missing");
      }

      // ✅ SAVE USER & TOKEN (STANDARD)
      localStorage.setItem(
        "civilink_user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "civilink_token",
        data.token
      );

      // 🔍 VERIFY IMMEDIATELY
      console.log(
        "SAVED TOKEN 👉",
        localStorage.getItem("civilink_token")
      );

      setLoading(false);

      // ✅ REDIRECT
      window.location.href = "/home";

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setLoading(false);
      setError("Network error — please try again");
    }
  };

  return (
    <div className="auth-page upg">
      <div className="auth-card upg">

        <h1 className="auth-logo upg">Civilink</h1>
        <p className="auth-subtitle upg">
          Your construction network — Reimagined
        </p>

        {error && (
          <div className="auth-error upg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form upg">

          <div className="input-floating">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <label>Email address</label>
          </div>

          <div className="input-floating">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <label>Password</label>
          </div>

          <button
            className="auth-btn-primary upg"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footer upg">
          New here? <a href="/register">Create account</a>
        </p>
      </div>
    </div>
  );
}
