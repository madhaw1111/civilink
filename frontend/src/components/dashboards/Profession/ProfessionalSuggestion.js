import React from "react";

export default function ProfessionalSuggestions() {
  return (
    <div className="suggest-box">
      <h2>Suggested Professionals</h2>

      <div className="suggest-list">

        <div className="suggest-item">
          <div className="avatar">E</div>
          <div>
            <b>Elango (Engineer)</b>
            <p>Structural Specialist • 32 projects</p>
          </div>
          <button className="btn-outline">View</button>
        </div>

        <div className="suggest-item">
          <div className="avatar">A</div>
          <div>
            <b>Akshaya (Architect)</b>
            <p>Interior + Exterior Designer • 19 projects</p>
          </div>
          <button className="btn-outline">View</button>
        </div>

        <div className="suggest-item">
          <div className="avatar">W</div>
          <div>
            <b>Wasim (Worker)</b>
            <p>Mason • 7 yrs experience</p>
          </div>
          <button className="btn-outline">View</button>
        </div>

      </div>
    </div>
  );
}
