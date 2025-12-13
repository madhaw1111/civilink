import React, { useState } from "react";
import "./auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || "Invalid login credentials");
      }

      // ---------------------------------------------------------
      // ✅ STORE USER IN CIVILINK FORMAT (IMPORTANT)
      // ---------------------------------------------------------
      localStorage.setItem("civilink_user",JSON.stringify(data.user));


      // Save token
      localStorage.setItem("civilink_token", data.token);

      // Redirect to Home
      window.location.href = "/home";

    } catch (err) {
      setError("Network error — please try again.");
    }
  };

  return (
    <div className="auth-page upg">
      <div className="auth-card upg">

        {/* LOGO */}
        <h1 className="auth-logo upg">Civilink</h1>
        <p className="auth-subtitle upg">
          Your construction network — Reimagined
        </p>

        {/* ERROR */}
        {error && <div className="auth-error upg">{error}</div>}

        {/* FORM */}
        <form onSubmit={handleLogin} className="auth-form upg">

          <div className="input-floating">
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email address</label>
          </div>

          <div className="input-floating">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          <button className="auth-btn-primary upg" type="submit">
            <span>Sign In</span>
          </button>
        </form>

        {/* FOOTER */}
        <p className="auth-footer upg">
          New here? <a href="/register">Create account</a>
        </p>
      </div>
    </div>
  );
}
