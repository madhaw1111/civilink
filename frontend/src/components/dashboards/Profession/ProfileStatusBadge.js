import React from "react";
import { useNavigate } from "react-router-dom";
import "./profile.badge.css";

export default function ProfileStatusBadge({ user }) {
  const navigate = useNavigate();

  if (!user) return null;

  const status = user.professionalVerification?.status;
  const profession = user.profession;

  // 🔵 Normal Member
  if (!user.isProfessional) {
    return (
      <div className="badge member">
        🟦 Member
        <button
          className="badge-action"
          onClick={() => navigate("/profession")}
        >
          Switch to Professional
        </button>
      </div>
    );
  }

  // ⏳ Pending Verification
  if (status === "pending") {
    return (
      <div className="badge pending">
        ⏳ Verification Pending
      </div>
    );
  }

  // ✅ Approved
  if (status === "approved") {
    return (
      <div className="badge verified">
        ✅ Verified {profession}
      </div>
    );
  }

  // ❌ Rejected
  if (status === "rejected") {
    return (
      <div className="badge rejected">
        ❌ Verification Rejected
        <p className="reject-reason">
          {user.professionalVerification?.rejectionReason}
        </p>
        <button
          className="badge-action"
          onClick={() => navigate("/profession")}
        >
          Reapply
        </button>
      </div>
    );
  }

  // 🟩 Other Professionals (Worker / Contractor / Dealer)
  return (
    <div className="badge professional">
      🟩 {profession}
    </div>
  );
}

