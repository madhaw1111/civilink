import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Intro.css";
import IntroProgress from "./IntroProgress";

function IntroPage3() {

  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

 const handleContinue = () => {

  if (!agree) {
    alert("Please accept Terms & Conditions");
    return;
  }

  // Save intro completion
  localStorage.setItem("civilink_intro_seen", "true");
  localStorage.setItem("civilink_terms_accepted", "true");

  // Force app to re-check login/intro status
  window.location.href = "/";
};

 return (
  <div className="intro-page">

    <div className="intro-card slide-in">

      <IntroProgress step={3} />

      <h1>Terms & User Agreement</h1>

      <p>
        By continuing, you agree to Civilink’s
        Terms, Privacy Policy, and Platform Rules.
      </p>

      <div className="legal-box">

        <p>✔ Platform is a technology service</p>
        <p>
✔ Civilink acts solely as a technology intermediary and facilitator. All transactions, services, and agreements are conducted directly between users. Users engage at their own risk, and Civilink shall not be responsible for any disputes, losses, or liabilities arising from such interactions.
</p>

<p>
✔ Civilink does not host, modify, verify, endorse, or control user-generated content, listings, communications, or transactions, and operates in compliance with intermediary safe-harbour provisions under applicable information technology laws.
</p>
        <p>✔ Users responsible for transactions</p>
        <p>✔ Data protected under Indian law</p>
        <p>✔ Disputes resolved via arbitration</p>
        <p>✔ Jurisdiction: Tamil Nadu</p>
        <p>✔ All Rights are Reserved by © CIVILINK PVT LTD</p>
      </div>

      <label className="agree">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
        />
        I agree to the Terms & Conditions
      </label>

      <div className="buttons">
        <button onClick={() => navigate("/intro/2")}>Back</button>
        <button onClick={handleContinue}>Agree & Continue</button>
      </div>

    </div>

  </div>
);
}

export default IntroPage3;