import React from "react";

export default function ProfessionCard({ title, icon, color, onClick }) {
  return (
    <div
      className="pro-card"
      style={{ borderColor: color, "--glow": color }}
      onClick={onClick}
    >
      <div className="pro-icon">{icon}</div>
      <h3>{title}</h3>
      <p className="pro-desc">Create a profile as {title}</p>
    </div>
  );
}
