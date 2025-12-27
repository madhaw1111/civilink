import React, { useEffect, useState } from "react";
import "./professionSuggestion.css";

export default function ProfessionSuggestionRow() {
  const [list, setList] = useState([]);

  const loggedInUser = JSON.parse(
    localStorage.getItem("civilink_user")
  );

  const token = localStorage.getItem("token");

  const [connectedUsers, setConnectedUsers] = useState(
    loggedInUser?.connections || []
  );

  useEffect(() => {
    fetch("http://localhost:5000/api/profession/suggested/home")
      .then(res => res.json())
      .then(data => {
        if (data.success) setList(data.users);
      });
  }, []);

  /* ================= CONNECT USER ================= */
  const connectUser = async (targetUserId) => {
    if (!token) {
      alert("Please login to connect");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/connections/${targetUserId}/connect`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (data.success) {
        setConnectedUsers(prev => [...prev, targetUserId]);

        // keep localStorage in sync
        const updatedUser = {
          ...loggedInUser,
          connections: [...(loggedInUser.connections || []), targetUserId]
        };

        localStorage.setItem(
          "civilink_user",
          JSON.stringify(updatedUser)
        );
      }
    } catch (err) {
      console.error("Connect failed", err);
    }
  };

  if (!list.length) return null;

  return (
    <div className="profession-suggest-row">
      <h4>Suggested Professionals</h4>

      <div className="suggest-scroll">
        {list.map(u => {
          const isConnected =
            connectedUsers.includes(u._id);

          return (
            <div key={u._id} className="suggest-card">
              <div className="avatar">
                {u.profilePhoto ? (
                  <img src={u.profilePhoto} alt="" />
                ) : (
                  u.name.charAt(0)
                )}
              </div>

              <div className="info">
                <strong>{u.name}</strong>
                <span>{u.profession}</span>
              </div>

              <button
                className={`connect-btn ${
                  isConnected ? "connected" : ""
                }`}
                disabled={isConnected}
                onClick={() => connectUser(u._id)}
              >
                {isConnected ? "Connected" : "Connect"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
