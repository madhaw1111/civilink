import React from "react";
import "./buildhouse.css";

function BuildHouse() {
  return (
    <div className="build-container">
      {/* HEADER */}
      <header className="build-header">
        <h3>Find an Engineer</h3>
        <p>Choose the right professional for your house</p>
      </header>

      {/* FILTER BAR (UI ONLY) */}
      <div className="build-filters">
        <select>
          <option>All Locations</option>
          <option>Chennai</option>
          <option>Coimbatore</option>
          <option>Madurai</option>
        </select>

        <select>
          <option>All Ratings</option>
          <option>4+ ⭐</option>
          <option>3+ ⭐</option>
        </select>
      </div>

      {/* ENGINEER LIST */}
      <div className="engineer-list">
        {[1, 2, 3, 4].map((e) => (
          <div key={e} className="engineer-card">
            <div className="engineer-info">
              <div className="engineer-avatar" />

              <div>
                <h4>R. Kumar</h4>
                <p>Civil Engineer • Chennai</p>
                <p className="rating">⭐⭐⭐⭐☆ (4.5)</p>
              </div>
            </div>

            <div className="engineer-actions">
              <button className="btn-outline">
                View Profile
              </button>
              <button className="btn-primary">
                Consult
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuildHouse;
