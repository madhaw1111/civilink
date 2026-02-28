import React, { useState } from "react";
import "./auth.css";
import logo from "../../assets/logo.png";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [step, setStep] = useState("FORM"); // FORM | OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");



  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message);

      setSuccess("Account created successfully!");
      setStep("OTP"); // UI gate only
    } catch (err) {
      setError("Network error — Try again.");
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
        "/api/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            otp: enteredOtp
          })
        }
      );

      const data = await res.json();
      if (!res.ok) return setError(data.message || "Invalid OTP");

      // 🔥 THIS WAS MISSING — SAVE FINAL AUTH
      localStorage.setItem("civilink_user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // ✅ FIRST-TIME USER → HOME
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
          Join the future of construction
        </p>

        {error && <div className="auth-error upg">{error}</div>}
        {success && <div className="auth-success upg">{success}</div>}

        {/* ================= REGISTER FORM ================= */}
        {step === "FORM" && (
          <form className="auth-form upg" onSubmit={handleRegister}>

            <div className="input-floating">
              <input name="name" required onChange={update} />
              <label>Full Name</label>
            </div>

            <div className="input-floating">
              <input
                name="email"
                type="email"
                required
                onChange={update}
              />
              <label>Email Address</label>
            </div>

            <div className="input-floating">
              <input name="phone" onChange={update} />
              <label>Phone (optional)</label>
            </div>

       <div className="input-floating password-field">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    value={form.password}
    required
     placeholder=" "  
    onChange={update}
  />

  <span
    className="toggle-eye"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? "🙈" : "👁️"}
  </span>

  <label>Password</label>
</div>



            

            <button className="auth-btn-primary upg">
              Create Account
            </button>
          </form>
        )}

        {/* ================= OTP STEP ================= */}
        {step === "OTP" && (
          <div className="otp-layer upg">
            <h2 className="otp-title">Verify Your Account</h2>
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
              className="auth-btn-primary upg"
              onClick={verifyOtp}
            >
              Verify & Continue
            </button>

            <span className="otp-resend">
              Resend OTP
            </span>
          </div>
        )}

        <p className="auth-footer upg">
          Already have an account? <a href="/">Sign in</a>
        </p>

      </div>
    </div>
  );
}
