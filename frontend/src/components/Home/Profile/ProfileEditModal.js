// src/components/Home/Profile/ProfileEditModal.js
import React, { useState } from "react";
import axios from "axios";

export default function ProfileEditModal({
  user = {},
  isProfessional = false, // ✅ NEW FLAG
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
        "http://localhost:5000/api/users/profile-photo",

        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      // 🔑 SET S3 URL INTO FORM (THIS IS THE KEY STEP)
      update("profilePhoto", res.data.user.profilePhoto);
      // 🔥 SYNC TO LOCAL STORAGE (GLOBAL APP USES THIS)
const storedUser = JSON.parse(localStorage.getItem("civilink_user"));

if (storedUser) {
  const updatedUser = {
    ...storedUser,
    profilePhoto: res.data.user.profilePhoto
  };

  localStorage.setItem(
    "civilink_user",
    JSON.stringify(updatedUser)
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

        <label>Location</label>
        <input
          placeholder="City, State"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
        />

        {/* ================= PROFESSIONAL ONLY ================= */}
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

          {/* ================= PROFILE PHOTO (S3) ================= */}
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


        {/* ================= PROFESSIONAL ONLY ================= */}
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
