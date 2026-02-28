import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./auth.css";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  /* ================= STEP 1 → SEND OTP ================= */
  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setMessage("");
      setIsError(false);

      const res = await axios.post("/api/auth/forgot-password", { email });

      setMessage(res.data.message || "OTP sent to your email");
      setStep(2);

    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STEP 2 → VERIFY + RESET ================= */
  const handleResetPassword = async () => {
  try {
    setLoading(true);
    setMessage("");
    setIsError(false);

    const res = await axios.post("/api/auth/reset-password", {
      email,
      otp,
      newPassword,
    });

    setMessage("Password reset successful! Redirecting to login...");

    setTimeout(() => {
      navigate("/");   // your login page
    }, 1500);

  } catch (err) {
    setIsError(true);
    setMessage(err.response?.data?.message || "Reset failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-page upg">
      <div className="auth-card upg forgot-wrapper upg">

        {/* BRAND */}
        <div className="auth-brand upg">
          <img src={logo} alt="Civilink Logo" />
        </div>

        <div className="forgot-title">Reset Password</div>
        <div className="forgot-subtitle">
          Secure access to your Civilink account
        </div>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="forgot-step">
            <div className="input-floating">
              <input
                type="email"
                placeholder=" "
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email address</label>
            </div>

            <button
              className="auth-btn-primary upg"
              onClick={handleSendOTP}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="forgot-step">

            <div className="input-floating">
              <input
                type="text"
                placeholder=" "
                value={otp}
                required
                onChange={(e) => setOtp(e.target.value)}
              />
              <label>Enter OTP</label>
            </div>

            <div className="input-floating password-field">
  <input
    type={showPassword ? "text" : "password"}
    placeholder=" "
    value={newPassword}
    required
    onChange={(e) => setNewPassword(e.target.value)}
  />

  <span
    className="toggle-eye"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? "🙈" : "👁️"}
  </span>

  <label>New Password</label>
</div>

            <button
              className="auth-btn-primary upg"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </div>
        )}

        {/* ================= MESSAGE ================= */}
        {message && (
          <div
            className={`forgot-message ${
              isError ? "error" : "success"
            }`}
          >
            {message}
          </div>
        )}

        {/* ================= BACK LINK ================= */}
        <div className="forgot-back">
          <Link to="/">Back to Login</Link>
        </div>

      </div>
    </div>
  );
}