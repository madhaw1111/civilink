import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./professionlist.css";

export default function ProfessionList() {
  const { type } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===============================
     FETCH PROFESSIONAL DATA
  =============================== */
  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(`http://localhost:5000/api/profession/${type}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users);
        } else {
          setError("Failed to load profiles");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Server error. Please try again.");
        setLoading(false);
      });
  }, [type]);

  /* ===============================
     OPEN CONSULT CHAT
  =============================== */
  const openConsultChat = async (professionalUserId, professionId) => {
    const user = JSON.parse(localStorage.getItem("civilink_user"));

    if (!user) {
      alert("Please login to consult");
      return;
    }

    const res = await fetch("http://localhost:5000/api/chat/conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: user._id,
        receiverId: professionalUserId,
        contextType: "profession",
        contextId: professionId
      })
    });

    const data = await res.json();

    if (data.success) {
      navigate(`/messages/${data.conversation._id}`);
    } else {
      alert("Unable to start chat");
    }
  };

  /* ===============================
     UI STATES
  =============================== */
  if (loading) {
    return (
      <div className="profession-page">
        <p className="status-text">Loading {type} profiles…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profession-page">
        <p className="status-text error">{error}</p>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="profession-page">
        <p className="status-text">No {type}s found</p>
      </div>
    );
  }

  /* ===============================
     MAIN RENDER
  =============================== */
  return (
    <div className="profession-page">
      <div className="profession-header">
        <h2 className="profession-title">
          {type.charAt(0).toUpperCase() + type.slice(1)} Professionals
        </h2>
        <p className="profession-subtitle">
          Verified professionals available for consultation
        </p>
      </div>

      <div className="profession-grid">
        {users.map((u) => (
          <div key={u._id} className="profession-card"
            onClick={() => navigate(`/profile/${u._id}`)}
          >
            {/* Card Header */}
            <div className="profession-card-header">
              <div className="profession-avatar">
                {u.name?.charAt(0)}
              </div>

              <div className="profession-basic">
                <div className="profession-name">{u.name}</div>
                <div className="profession-role">{u.profession}</div>
              </div>
            </div>

            {/* Card Body */}
            <div className="profession-body">
              <div className="profession-info">
                <span>Experience</span>
                <strong>{u.experienceYears} years</strong>
              </div>

              {u.skills?.length > 0 && (
                <div className="profession-skills">
                  {u.skills.map((skill, i) => (
                    <span key={i} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="profession-footer">
              <button
  className="consult-btn"
  onClick={() => openConsultChat(u._id, u._id)}
>
  Consult
</button>


            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
