import React from "react";
import { useNavigate } from "react-router-dom";
import "./Intro.css";
import IntroProgress from "./IntroProgress";

function IntroPage2() {
  const navigate = useNavigate();

  return (
  <div className="intro-page">

    <div className="intro-card slide-in">

      {/* Progress Dots */}
      <IntroProgress step={2} />

      <h1>All Construction Services in One Platform</h1>
      <h3>Everything You Need. One Secure Network.</h3>

      <p>
        Civilink connects professionals, vendors,
        and customers on one trusted platform.
      </p>

      <div className="service-grid">

        <div className="card">
          <h4>🏗 Build & Design</h4>
          <p>Engineers, planning & execution</p>
        </div>

        <div className="card">
          <h4>🏠 Buy • Sell • Rent</h4>
          <p>Verified property listings</p>
        </div>

        <div className="card">
          <h4>🛒 Material Marketplace</h4>
          <p>Trusted vendors & pricing</p>
        </div>

        <div className="card">
          <h4>👷 Professional Network</h4>
          <p>Skilled & verified workers</p>
        </div>

      </div>

      <div className="buttons">
        <button onClick={() => navigate("/intro/1")}>Back</button>
        <button onClick={() => navigate("/intro/3")}>Next</button>
      </div>

    </div>

  </div>
);
}

export default IntroPage2;