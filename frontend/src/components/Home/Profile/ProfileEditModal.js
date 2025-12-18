// src/components/Home/Profile/ProfileEditModal.js
import React, { useState } from "react";

export default function ProfileEditModal({
  user = {},
  onClose = () => {},
  onSave = () => {}
}) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    bio: user.bio || "",
    location: user.location || "",
    experienceYears: user.experienceYears || "",
    profilePhoto: user.profilePhoto || user.avatar || "",
    skills: Array.isArray(user.skills) ? user.skills.join(", ") : ""
  });

  const update = (k, v) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Edit profile</h3>

        <label>Name</label>
        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />

        <label>Email</label>
        <input
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />

        <label>Phone</label>
        <input
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
        />

        <label>Location</label>
        <input
          placeholder="City, State"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
        />

        <label>Experience (years)</label>
        <input
          type="number"
          min="0"
          value={form.experienceYears}
          onChange={(e) => update("experienceYears", e.target.value)}
        />

        <label>Profile Photo URL</label>
        <input
          placeholder="https://..."
          value={form.profilePhoto}
          onChange={(e) => update("profilePhoto", e.target.value)}
        />

        <label>Skills (comma separated)</label>
        <input
          placeholder="AutoCAD, Estimation, Site Management"
          value={form.skills}
          onChange={(e) => update("skills", e.target.value)}
        />

        <label>Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
        />

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button className="btn outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn primary"
            onClick={() => {
              const next = {
                ...user,
                ...form,
                experienceYears: Number(form.experienceYears) || 0,
                skills: form.skills
                  ? form.skills.split(",").map((s) => s.trim())
                  : []
              };
              onSave(next);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
