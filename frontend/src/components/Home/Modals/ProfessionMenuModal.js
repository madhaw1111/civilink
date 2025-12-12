import React from "react";

export default function ProfessionMenuModal({ onClose, onSelect }) {
  return (
    <div className="vendor-modal-overlay" onClick={onClose}>
      <div className="vendor-modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ textAlign: "center", marginBottom: 20 }}>
          Choose Your Profession
        </h3>

        <button
          className="btn-primary"
          style={{ width: "100%", marginBottom: 10 }}
          onClick={() => onSelect("Worker")}
        >
          👷 To become a Worker
        </button>

        <button
          className="btn-primary"
          style={{ width: "100%", marginBottom: 10 }}
          onClick={() => onSelect("Engineer")}
        >
          🏗 To become Engineer / Architect
        </button>

        <button
          className="btn-outline"
          style={{ width: "100%", marginBottom: 10 }}
          onClick={() => onSelect("Search")}
        >
          🔍 Search for Workers
        </button>

        <button
          className="btn-outline"
          style={{ width: "100%" }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
