import React from "react";
import { useNavigate } from "react-router-dom";
import "./Intro.css";
import logo from "../../assets/logo.png";
import IntroProgress from "./IntroProgress";

function IntroPage1({ onNext }) {

  const handleSkip = () => {
  localStorage.setItem("civilink_intro_seen", "true");
  window.location.reload();
};
   const navigate = useNavigate();
  return (
  <div className="intro-page">

    <div className="intro-card slide-in">

      <img src={logo} alt="Civilink Logo" className="logo" />

      <IntroProgress step={1} />

      <h1>Welcome to Civilink</h1>
      <h3>India’s Online Construction & Property Platform</h3>

      <p>
        Civilink connects Engineers, Workers, Vendors,
        and Customers on one secure platform.
      </p>

      <div className="features">
        <p>✔ Verified Professionals</p>
        <p>✔ Secure Marketplace</p>
        <p>✔ Trusted Property Listings</p>
        <p>✔ Digital Support</p>
      </div>

      <p className="company">
        Operated by Civilink Private Limited<br />
        Registered under MCA, India<br />
        All Rights are Reserved by © CIVILINK PVT LTD
      </p>

      <div className="buttons">
        <button onClick={handleSkip}>Skip</button>
        <button onClick={() => navigate("/intro/2")}>Next</button>
      </div>

    </div>

  </div>
);
}

export default IntroPage1;