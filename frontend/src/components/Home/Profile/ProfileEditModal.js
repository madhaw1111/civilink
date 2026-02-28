// src/components/Home/Profile/ProfileEditModal.js
import React, { useState } from "react";
import axios from "axios";

export default function ProfileEditModal({
  user = {},
  isProfessional = false,
  onClose = () => {},
  onSave = () => {}
}) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    bio: user.bio || "",
    city: user.city || "",
    state: user.state || "",
    experienceYears: user.experienceYears || "",
    profilePhoto: user.profilePhoto || user.avatar || "",
    skills: Array.isArray(user.skills)
      ? user.skills.join(", ")
      : ""
  });

  const [uploading, setUploading] = useState(false);

  const update = (k, v) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  /* ================= PROFILE PHOTO UPLOAD ================= */
  const handleProfilePhotoUpload = async (file) => {
    if (!file) return;

    try {
      setUploading(true);

      const data = new FormData();
      data.append("profilePhoto", file);

      const res = await axios.post(
        "/api/users/profile-photo",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      update("profilePhoto", res.data.user.profilePhoto);

      const storedUser = JSON.parse(
        localStorage.getItem("civilink_user")
      );

      if (storedUser) {
        localStorage.setItem(
          "civilink_user",
          JSON.stringify({
            ...storedUser,
            profilePhoto: res.data.user.profilePhoto
          })
        );
      }
    } catch (err) {
      console.error("Profile photo upload failed", err);
      alert("Profile photo upload failed");
    } finally {
      setUploading(false);
    }
  };

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

        <label>City</label>
        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
        />

        <label>State</label>
        <input
          placeholder="State"
          value={form.state}
          onChange={(e) => update("state", e.target.value)}
        />

        {isProfessional && (
          <>
            <label>Experience (years)</label>
            <input
              type="number"
              min="0"
              value={form.experienceYears}
              onChange={(e) =>
                update("experienceYears", e.target.value)
              }
            />
          </>
        )}

        <label>Profile Photo</label>

        {form.profilePhoto && (
          <img
            src={form.profilePhoto}
            alt="profile"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 8
            }}
          />
        )}

        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) =>
            handleProfilePhotoUpload(e.target.files[0])
          }
        />

        {isProfessional && (
          <>
            <label>Skills (comma separated)</label>
            <input
              placeholder="AutoCAD, Estimation, Site Management"
              value={form.skills}
              onChange={(e) =>
                update("skills", e.target.value)
              }
            />
          </>
        )}

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
                experienceYears: isProfessional
                  ? Number(form.experienceYears) || 0
                  : user.experienceYears || 0,
                skills: isProfessional
                  ? form.skills
                      ?.split(",")
                      .map((s) => s.trim())
                  : user.skills || []
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
