import React, { useState } from "react";
import "./auth.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message);

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => (window.location.href = "/"), 1500);

    } catch (err) {
      setError("Network error — Try again.");
    }
  };

  return (
    <div className="auth-page upg">
      <div className="auth-card upg">

        <h1 className="auth-logo upg">Civilink</h1>
        <p className="auth-subtitle upg">Join the future of construction</p>

        {error && <div className="auth-error upg">{error}</div>}
        {success && <div className="auth-success upg">{success}</div>}

        <form className="auth-form upg" onSubmit={handleRegister}>
          
          <div className="input-floating">
            <input name="name" required onChange={update} />
            <label>Full Name</label>
          </div>

          <div className="input-floating">
            <input name="email" type="email" required onChange={update} />
            <label>Email Address</label>
          </div>

          <div className="input-floating">
            <input name="phone" onChange={update} />
            <label>Phone (optional)</label>
          </div>

          <div className="input-floating">
            <input name="password" type="password" required onChange={update} />
            <label>Password</label>
          </div>

          <button className="auth-btn-primary upg">
            <span>Create Account</span>
          </button>

        </form>

        <p className="auth-footer upg">
          Already have an account?{" "}
          <a href="/">Sign in</a>
        </p>

      </div>
    </div>
  );
}
