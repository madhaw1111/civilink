import React, { useEffect } from "react";
import "./ProfileMenu.css";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu({
  open,
  onClose,
  user = {},
  onLogout = () => {},
}) {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

 return (
  <div className="profile-drawer-backdrop" onClick={onClose}>
    <div
      className="profile-drawer"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >

      {/* MINI PROFILE AT TOP INSIDE DRAWER */}
      <div className="profile-menu-header">
        <div className="profile-menu-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>

        <div className="profile-menu-info">
          <h3>{user.name || "Civilink User"}</h3>
          <p>{user.profession || "General Member"}</p>
        </div>
      </div>

      {/* SEPARATOR */}
      <div className="drawer-sep" />

      {/* MENU ITEMS */}
      <div className="profile-drawer-body">

        {/* VIEW PROFILE */}
        <button
          className="drawer-item"
          onClick={() => {
            onClose();
            navigate("/profile");
          }}
        >
          👤 View Profile
        </button>

        {/* NOTIFICATION */}
        <button className="drawer-item notif-btn">
          🔔 Notifications
          {user.notificationsCount > 0 && (
            <span className="notif-count">{user.notificationsCount}</span>
          )}
        </button>

        {/* LOCATION */}
        <button
          className="drawer-item"
          onClick={() => {
            const ok = window.confirm("Use current location?");
            if (ok) alert("Location set (demo)");
          }}
        >
          📍 Location
        </button>

        <div className="drawer-sep" />

        {/* SETTINGS */}
        <button
          className="drawer-item"
          onClick={() => {
            onClose();
            navigate("/settings");
          }}
        >
          ⚙️ Settings
        </button>

        {/* LOGOUT */}
        <button className="drawer-logout" onClick={onLogout}>
          🚪 Logout
        </button>

      </div>
    </div>
  </div>
);


}
