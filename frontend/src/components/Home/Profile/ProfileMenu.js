import React, { useEffect, useState } from "react";

import "./ProfileMenu.css";
import { useNavigate } from "react-router-dom";
import LocationModal from "../Modals/LocationModal";

export default function ProfileMenu({
  open,
  onClose,
  user = {},
  onLogout = () => {},
}) {
  const navigate = useNavigate();
  const [showLocation, setShowLocation] = React.useState(false);

  const [location, setLocation] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem("civilink_location")
    );
  } catch {
    return null;
  }
});


  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  const safeUser = user && Object.keys(user).length ? user : {};
  
  
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
          {safeUser?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="profile-menu-info">
          <h3>{safeUser?.name || "Civilink User"}</h3>
          <p>{safeUser?.profession || "General Member"}</p>
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
            navigate(`/profile/${safeUser._id}`);
          }}
        >
          👤 View Profile
        </button>

        {/* NOTIFICATION */}
        <button
  className="drawer-item"
  onClick={() => {
    onClose();
    navigate("/notifications");
  }}
>
  🔔 Notifications
</button>


        {/* LOCATION */}
        <button
  className="drawer-item"
  onClick={() => setShowLocation(true)}
>
  📍 Location
  <span className="drawer-sub">
    {location
      ? `${location.city}${location.state ? ", " + location.state : ""}`
      : "Set location"}
  </span>
</button>



        {/* SAVED POSTS / HOUSES */}
<button
  className="drawer-item"
  onClick={() => {
    onClose();
    navigate("/saved");
  }}
>
  ⭐ Saved
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

     {/* ================= LOCATION MODAL ================= */}
  {showLocation && (
    <LocationModal
      onClose={() => setShowLocation(false)}
      onSave={(loc) => {
        localStorage.setItem(
          "civilink_location",
          JSON.stringify(loc)
        );
        setLocation(loc);
        setShowLocation(false);
        alert(`Location set to ${loc.city}`);
      }}
    />
  )}
  </div>
);


}
