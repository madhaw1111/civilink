import React from "react";
import ProfessionCard from "./ProfessionCard";

export default function ProfessionCategories({ onSelect }) {
  const roles = [
    { title: "Worker", icon: "🧱", color: "#ff8a65" },
    { title: "Engineer", icon: "🏗", color: "#4fc3f7" },
    { title: "Architect", icon: "🏛️", color: "#ba68c8" },
    { title: "Contractor", icon: "🔨", color: "#ffd54f" },
    { title: "Real Estate Dealer", icon: "🏢", color: "#81c784" },
  ];

  return (
    <div className="category-grid">
      {roles.map((r) => (
        <ProfessionCard
          key={r.title}
          title={r.title}
          icon={r.icon}
          color={r.color}
          onClick={() => onSelect(r.title)}
        />
      ))}
    </div>
  );
}
