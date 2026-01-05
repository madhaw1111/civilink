import React, { useState } from "react";
import "./auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("LOGIN"); // LOGIN | OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOGIN ================= */
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

      if (!res.ok) {
        setLoading(false);
        return setError(data.message || "Login failed");
      }

      if (!data?.user || !data?.token || !data?.role) {
        setLoading(false);
        return setError("Login failed: missing auth data");
      }

      // ✅ SAVE AUTH (UNCHANGED)
      localStorage.setItem("civilink_user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // ✅ SEND OTP (THIS WAS MISSING)
      await fetch("http://localhost:5000/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

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
      const res = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: enteredOtp })
        }
      );

      const data = await res.json();
      if (!res.ok) return setError(data.message || "Invalid OTP");

      // 🔥 STRONG REDIRECT (FIX)
      window.location.replace("/home");

    } catch (err) {
      setError("OTP verification failed");
    }
  };

  return (
    <div className="auth-page upg">
      <div className="auth-card upg">

        <h1 className="auth-logo upg">Civilink</h1>
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

            <div className="input-floating">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>

            <button type="button" className="auth-btn-google upg">
              Continue with Google
            </button>

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

            <span className="otp-resend">Resend OTP</span>
          </div>
        )}

        <p className="auth-footer upg">
          New here? <a href="/register">Create account</a>
        </p>

      </div>
    </div>
  );
}
