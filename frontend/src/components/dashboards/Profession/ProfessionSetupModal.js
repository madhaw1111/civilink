import React, { useState } from "react";
import "./profession.dashboard.css";

export default function ProfessionSetupModal({
  open,
  onClose,
  profession,
  user,
  onComplete
}) {
  const [step, setStep] = useState(1);

  const [skills, setSkills] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  // 🔐 verification docs
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [degreeFile, setDegreeFile] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  

  if (!open) return null;

  const requiresVerification =
    profession === "Engineer" || profession === "Architect";

  /* ================= PROFILE PHOTO ================= */
  const uploadPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setProfilePhoto(reader.result);
    reader.readAsDataURL(file);
  };

  /* =====================================================
     STEP 1 — UPLOAD DOCUMENTS (ENGINEER / ARCHITECT)
  ===================================================== */
  const uploadDocuments = async () => {
    if (!aadhaarFile || !degreeFile) {
      alert("Aadhaar card and Degree certificate are required");
      return false;
    }

    const formData = new FormData();
    formData.append("aadhaar", aadhaarFile);
    formData.append("degree", degreeFile);

    const res = await fetch(
      "/api/profession/upload-certificate",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      }
    );

    return res.ok;
  };

  /* =====================================================
     STEP 2 — EXISTING PROFESSION UPDATE (UNCHANGED)
  ===================================================== */
  const submitProfession = async () => {
    setSubmitting(true); 
    const userId = user?._id || user?.id;
    if (!userId) {
      alert("User ID missing. Please login again.");
      return;
    }

    // 🔐 verification FIRST
    if (requiresVerification) {
      const ok = await uploadDocuments();
      if (!ok) return;
    }

    const res = await fetch(
      "/api/profession/update",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          userId,
          profession,
          skills: skills
            .split(",")
            .map(s => s.trim())
            .filter(Boolean),
          experienceYears: Number(experienceYears),
          profilePhoto
        })
      }
    );

    const data = await res.json();

    setSubmitting(false);

    if (data.success) {
      localStorage.setItem("civilink_user", JSON.stringify(data.user));
       alert("Submitted for verification");
      onClose();
      onComplete(profession);
    } else {
      alert(data.message || "submission failed");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>

        {/* ================= STEP 1 — INFO ================= */}
        {requiresVerification && step === 1 && (
          <>
            <h2>🔒 Professional Verification Required</h2>
            <ul className="verification-points">
              <li>Profile hidden until verification</li>
              <li>Manual admin review</li>
              <li>Usually 24–72 hours</li>
            </ul>

            <button className="btn primary" onClick={() => setStep(2)}>
              Continue
            </button>
            <button className="btn outline" onClick={onClose}>
              Cancel
            </button>
          </>
        )}

        {/* ================= STEP 2 — DOCUMENT UPLOAD ================= */}
        {requiresVerification && step === 2 && (
          <>
            <h2>Submit for Verification</h2>

            <label>Profile Photo</label>
            <input type="file" onChange={uploadPhoto} />

            <label>Skills</label>
            <input
              value={skills}
              onChange={e => setSkills(e.target.value)}
            />

            <label>Experience Years</label>
            <input
              type="number"
              value={experienceYears}
              onChange={e => setExperienceYears(e.target.value)}
            />

            <label>Aadhaar Card (mandatory)</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={e => setAadhaarFile(e.target.files[0])}
            />

            <label>Degree / Engineer Certificate (mandatory)</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={e => setDegreeFile(e.target.files[0])}
            />

            <button className="btn primary" disabled={submitting} onClick={submitProfession}>
  {submitting ? "Submitting..." : "Submit for Verification"}
</button>

            <button className="btn outline" onClick={onClose}>
              Cancel
            </button>
          </>
        )}

        
        {!requiresVerification && (
          <>
            <h2>Become a {profession}</h2>
            <label>Upload Profile Photo</label>
            <input type="file" onChange={uploadPhoto} />
            <label>Skills (comma separated)</label>
            <input value={skills} onChange={e => setSkills(e.target.value)} />
            <label>Experience (Years)</label>
            <input
              type="number"
              value={experienceYears}
              onChange={e => setExperienceYears(e.target.value)}
            />

            <button className="btn primary" onClick={submitProfession}>
              Save Profession
            </button>
          </>
        )}
      </div>
    </div>
  );
}
