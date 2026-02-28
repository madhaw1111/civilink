import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profession.upload.css";

export default function ProfessionalUpload() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("civilink_user"));

  const [qualification, setQualification] = useState("");
  const [institution, setInstitution] = useState("");
  const [year, setYear] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [certificateFile, setCertificateFile] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <p>Please login again.</p>;
  }

  const uploadCertificate = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setCertificateFile(reader.result);
    reader.readAsDataURL(file);
  };

  const submitForVerification = async () => {
    if (!qualification || !institution || !year || !certificateFile) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/profession/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        userId: user._id,
        profession: user.profession || "Engineer", // already selected earlier
        skills: [],
        experienceYears: user.experienceYears || 0,
        profilePhoto: user.profilePhoto || "",
        professionalVerification: {
          applied: true,
          status: "pending",
          documents: {
            certificateType: qualification,
            certificateUrl: certificateFile,
            certificateNumber
          }
        }
      })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("civilink_user", JSON.stringify(data.user));
      navigate("/verification-status");
    } else {
      alert(data.message || "Submission failed");
    }

    setLoading(false);
  };

  return (
    <div className="upload-container">
      <h2>🔒 Professional Verification</h2>

      <p className="upload-info">
        Please submit your professional details for verification.
        Your profile will be hidden until approval.
      </p>

      <label>Degree / Qualification *</label>
      <input
        placeholder="B.E Civil Engineering"
        value={qualification}
        onChange={(e) => setQualification(e.target.value)}
      />

      <label>College / Institution *</label>
      <input
        placeholder="Anna University"
        value={institution}
        onChange={(e) => setInstitution(e.target.value)}
      />

      <label>Year of Passing *</label>
      <input
        type="number"
        placeholder="2020"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />

      <label>Certificate Number (optional)</label>
      <input
        placeholder="CERT-XXXX"
        value={certificateNumber}
        onChange={(e) => setCertificateNumber(e.target.value)}
      />

      <label>Upload Certificate (Image / PDF) *</label>
      <input type="file" accept="image/*,.pdf" onChange={uploadCertificate} />

      <button
        className="btn primary"
        disabled={loading}
        onClick={submitForVerification}
      >
        {loading ? "Submitting..." : "Submit for Verification"}
      </button>

      <button className="btn outline" onClick={() => navigate("/")}>
        Cancel
      </button>
    </div>
  );
}
