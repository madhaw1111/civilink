// src/components/Home/Profile/ProfileEditModal.js
import React, { useState } from "react";

export default function ProfileEditModal({ user = {}, onClose = () => {}, onSave = () => {} }) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    profession: user.profession || "Member",
    bio: user.bio || "",
    phone: user.phone || "",
  });

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
        <h3>Edit profile</h3>

        <label>Name</label>
        <input value={form.name} onChange={e => update("name", e.target.value)} />

        <label>Email</label>
        <input value={form.email} onChange={e => update("email", e.target.value)} />

        <label>Profession (leave Member for normal)</label>
        <input value={form.profession} onChange={e => update("profession", e.target.value)} />

        <label>Phone</label>
        <input value={form.phone} onChange={e => update("phone", e.target.value)} />

        <label>Bio</label>
        <textarea value={form.bio} onChange={e => update("bio", e.target.value)} />

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button className="btn outline" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={() => {
            const next = { ...user, ...form };
            onSave(next);
          }}>Save</button>
        </div>
      </div>
    </div>
  );
}
