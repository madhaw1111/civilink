import React, { useEffect, useState } from "react";
import "./profile.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("civilink_user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">

      {/* COVER PHOTO */}
      <div className="profile-cover"></div>

      {/* PROFILE HEADER */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user.avatar || user.email.charAt(0).toUpperCase()}
        </div>

        <div className="profile-info">
          <h2>{user.name || "Civilink User"}</h2>
          <p className="profile-role">{user.role || "Member"}</p>
          <p className="profile-location">🌍 Tamil Nadu, India</p>

          <button className="edit-profile-btn">Edit Profile</button>
        </div>
      </div>

      {/* STATS */}
      <div className="profile-stats">
        <div><strong>12</strong><span>Posts</span></div>
        <div><strong>52</strong><span>Followers</span></div>
        <div><strong>34</strong><span>Following</span></div>
        <div><strong>18</strong><span>Consults</span></div>
      </div>

      {/* ABOUT SECTION */}
      <div className="profile-section">
        <h3>About</h3>
        <p>
          {user.bio ||
            "Welcome to my Civilink profile. Build, Buy, Sell, Rent and Connect with construction professionals."}
        </p>
      </div>

      {/* SKILLS */}
      <div className="profile-section">
        <h3>Skills</h3>
        <div className="skills-list">
          <span>Construction</span>
          <span>Planning</span>
          <span>AutoCAD</span>
          <span>Estimation</span>
        </div>
      </div>

      {/* EXPERIENCE */}
      <div className="profile-section">
        <h3>Experience</h3>

        <div className="experience-card">
          <h4>Site Engineer</h4>
          <p>3 Years — Chennai</p>
        </div>

        <div className="experience-card">
          <h4>Freelance Contractor</h4>
          <p>2 Years — Tamil Nadu</p>
        </div>
      </div>

      {/* LOGOUT */}
      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("civilink_user");
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
  );
}
