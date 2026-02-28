import React, { useEffect, useState } from "react";
import ProfessionCard from "./ProfessionCard";
import ProfessionCategories from "./ProfessionCategories";
import ProfessionalSuggestion from "./ProfessionalSuggestion";
import "./profession.dashboard.css";
import ProfessionSetupModal from "./ProfessionSetupModal";




export default function ProfessionDashboard() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const [showSetup, setShowSetup] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState("");
  const [availableProfessions, setAvailableProfessions] = useState([]);
  

  


  useEffect(() => {
    const raw = localStorage.getItem("civilink_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const handleSelectProfession = (profession) => {
  if (!user) return alert("Please login");

  setSelectedProfession(profession);
  setShowSetup(true); // open form instead of instant redirect
  };

  useEffect(() => {
  fetch("/api/profession/available")
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setAvailableProfessions(data.professions);
      }
    });
  }, []);

  const handleViewProfession = (profession) => {
  // navigate to profession list page
  window.location.href = `/profession/${profession.toLowerCase()}`;
  };



  return (
    <div className="pro-dashboard-container">

      <div className="pro-header">


  <button
    className="pro-menu-btn"
    onClick={() => setShowMenu(true)}
  >
    ☰
  </button>

  <h1 className="page-title">Civilink Profession Hub</h1>

</div>

      <p className="subtitle">
        Build your identity — find work, connect with professionals & grow your construction career.
      </p>

      <div className="pro-search-box">
  <input
    type="text"
    placeholder="Search professionals, skills, locations…"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="pro-search-input"
  />
</div>


      {/* Category Cards */}
      <ProfessionCategories
      data={availableProfessions}
      onSelect={handleViewProfession}
     />

      {/* Suggested professionals */}
      <ProfessionalSuggestion search={search} />


      <div style={{ height: 40 }}></div>


      {/* LEFT SLIDE MENU */}
{showMenu && (
  <div className="pro-menu-backdrop" onClick={() => setShowMenu(false)}>
    <div
      className="pro-slide-menu"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="menu-title">Choose Profession</h3>

      <button className="menu-item" onClick={() => handleSelectProfession("Worker")}>
        👷 Become Worker
      </button>

      <button className="menu-item" onClick={() => handleSelectProfession("Engineer")}>
        🧱 Become Engineer
      </button>

      <button className="menu-item" onClick={() => handleSelectProfession("Architect")}>
        🏛 Become Architect
      </button>

      <button className="menu-item" onClick={() => handleSelectProfession("Contractor")}>
        📐 Become Contractor
      </button>

      <button className="menu-item" onClick={() => handleSelectProfession("Real Estate Dealer")}>
        🏠 Real Estate Dealer
      </button>

      <button className="menu-close" onClick={() => setShowMenu(false)}>
        Close
      </button>
    </div>
  </div>
)}

<ProfessionSetupModal
  open={showSetup}
  onClose={() => setShowSetup(false)}
  profession={selectedProfession}
  user={user}
  onComplete={(profession) => {
  if (["Engineer", "Architect"].includes(profession)) {
    window.location.href = "/profile?verification=pending";
  } else {
    window.location.href = "/profile";
  }
}}

/>


    </div>
  );
}
