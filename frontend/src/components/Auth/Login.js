import React, { useState } from "react";
import "./auth.css";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("LOGIN"); // LOGIN | OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoading(false);
        return setError(data.message || "Login failed");
      }

      // ✅ OTP SENT SUCCESSFULLY
      setLoading(false);
      setStep("OTP");

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setLoading(false);
      setError("Network error — please try again");
    }
  };

  /* ================= OTP ================= */
  const handleOtpChange = (value, index) => {
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      return setError("Enter valid 6-digit OTP");
    }

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp })
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || "Invalid OTP");
      }

      // ✅ FINAL AUTH DATA
      localStorage.setItem("civilink_user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      window.location.replace("/home");

    } catch (err) {
      setError("OTP verification failed");
    }
  };

  return (
    <div className="auth-page upg">
      <div className="auth-card upg">

        <div className="auth-brand upg">
          <img src={logo} alt="Civilink Logo" />
        </div>

        <p className="auth-subtitle upg">
          Your construction network — Reimagined
        </p>

        {error && <div className="auth-error upg">{error}</div>}

        {/* LOGIN */}
        {step === "LOGIN" && (
          <form onSubmit={handleLogin} className="auth-form upg">

            <div className="input-floating">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email address</label>
            </div>

            <div className="input-floating password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                required
                placeholder=" "
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
              <label>Password</label>
            </div>

            <p className="auth-forgot">
  <Link to="/forgot-password">Forgot password?</Link>
</p>

            {/* GOOGLE LOGIN */}
            <GoogleLogin
              onSuccess={async (res) => {
                try {
                  const response = await fetch(
                    "/api/auth/google-login",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ credential: res.credential })
                    }
                  );

                  const data = await response.json();

                  if (!response.ok) {
                    return alert(data.message || "Google login failed");
                  }

                  localStorage.setItem("civilink_user", JSON.stringify(data.user));
                  localStorage.setItem("token", data.token);
                  localStorage.setItem("role", data.role);

                  window.location.replace("/home");

                } catch {
                  alert("Google login network error");
                }
              }}
              onError={() => alert("Google Sign-In Failed")}
            />

            <button className="auth-btn-primary upg" type="submit">
              Sign In
            </button>
          </form>
        )}

        {/* OTP */}
        {step === "OTP" && (
          <div className="otp-layer upg">
            <h2 className="otp-title">Verify OTP</h2>
            <p className="otp-sub">
              Enter the 6-digit OTP sent to your email
            </p>

            <div className="otp-inputs">
              {otp.map((v, i) => (
                <input
                  key={i}
                  maxLength="1"
                  value={v}
                  onChange={(e) => {
                    handleOtpChange(e.target.value, i);
                    if (e.target.value && e.target.nextSibling)
                      e.target.nextSibling.focus();
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              className="auth-btn-primary upg"
              onClick={verifyOtp}
            >
              Verify & Continue
            </button>
          </div>
        )}

        <p className="auth-footer upg">
          New here? <a href="/register">Create account</a>
        </p>

      </div>
    </div>
  );
}
