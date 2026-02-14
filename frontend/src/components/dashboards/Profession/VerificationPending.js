import React from "react";
import { useNavigate } from "react-router-dom";
import "./verification.status.css";

export default function VerificationPending() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("civilink_user"));

  if (!user) {
    return <p>Please login again.</p>;
  }

  const status = user.professionalVerification?.status;

  // Safety guard
  if (status !== "pending") {
    navigate("/profile");
    return null;
  }

  return (
    <div className="status-container">
      <div className="status-card">
        <h2>⏳ Verification Pending</h2>

        <p className="status-message">
          Your professional verification request has been submitted successfully.
        </p>

        <div className="status-info">
          <div>
            <strong>Profession:</strong> {user.profession}
          </div>
          <div>
            <strong>Verification:</strong>{" "}
            <span className="pending">Pending</span>
          </div>
          <div>
            <strong>Submitted on:</strong>{" "}
            {new Date(user.updatedAt).toLocaleDateString()}
          </div>
        </div>

        <p className="status-note">
          🔒 Your profile is temporarily hidden until verification is completed.
          <br />
          You can continue using Civilink as a normal member.
        </p>

        <button
          className="btn primary"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
