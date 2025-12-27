import React, { useState } from "react";
import "./profession.dashboard.css";

export default function ProfessionSetupModal({ open, onClose, profession, user, onComplete }) {

  const [skills, setSkills] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  if (!open) return null;

  const uploadPhoto = (e) => {
    const reader = new FileReader();
    reader.onload = () => setProfilePhoto(reader.result);
    reader.readAsDataURL(e.target.files[0]);
  };

  async function submit() {
  const userId = user?._id || user?.id;

  if (!userId) {
    alert("User ID missing. Please login again.");
    return;
  }

  const res = await fetch("http://localhost:5000/api/profession/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      userId,
      profession,
      skills: skills.split(",").map(s => s.trim()),
      experienceYears: Number(experienceYears),
      profilePhoto,
    }),
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("civilink_user", JSON.stringify(data.user));
    onClose();
    onComplete();
  } else {
    alert(data.message || "Something went wrong");
  }
}


  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Become a {profession}</h2>

        <label>Upload Profile Photo</label>
        <input type="file" onChange={uploadPhoto} />

        <label>Skills (comma separated)</label>
        <input
          placeholder="Construction, AutoCAD, Estimation"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <label>Experience Years</label>
        <input
          type="number"
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
        />

        <button className="btn primary" onClick={submit}>
          Save Profession
        </button>

        <button className="btn outline" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
