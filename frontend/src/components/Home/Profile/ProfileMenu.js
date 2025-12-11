import React from "react";
import "./ProfileMenu.css";

export default function ProfileMenu({ setShowProfileMenu }) {
  return (
    <div className="profile-menu-dropdown">
      <button onClick={() => (window.location.href = "/profile")}>
        👤 View Profile
      </button>

      <button
        onClick={() => {
          localStorage.removeItem("civilink_user");
          window.location.href = "/";
        }}
      >
        🚪 Logout
      </button>

      <button onClick={() => setShowProfileMenu(false)}>Close</button>
    </div>
  );
}
