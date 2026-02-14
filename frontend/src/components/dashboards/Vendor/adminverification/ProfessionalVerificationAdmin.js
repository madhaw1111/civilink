// src/components/dashboards/Vendor/adminverification/ProfessionalVerificationAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./professionalVerification.css";

export default function ProfessionalVerificationAdmin() {
  const [verifications, setVerifications] = useState([]);
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:5000/api/admin",
    headers: { Authorization: `Bearer ${token}` }
  });

  const loadVerifications = async () => {
    const res = await api.get("/professional-verifications");
    setVerifications(res.data);
  };

  useEffect(() => {
    loadVerifications();
  }, []);

  const approve = async (userId) => {
    await api.post(`/professional-verifications/${userId}/approve`);
    toast.success("Verification approved");
    loadVerifications();
  };

  const reject = async (userId) => {
    const reason = prompt("Enter rejection reason");
    if (!reason) return;

    await api.post(
      `/professional-verifications/${userId}/reject`,
      { reason }
    );

    toast.success("Verification rejected");
    loadVerifications();
  };

  return (
    <section className="admin-card">
      <h3>Professional Verification Requests</h3>

      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Profession</th>
            <th>Status</th>
            <th>Certificate</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {verifications.length === 0 ? (
            <tr>
              <td colSpan="5">No requests</td>
            </tr>
          ) : (
            verifications.map(u => (
              <tr key={u._id}>
                <td>
                  <strong>{u.name}</strong><br />
                  {u.email}
                </td>

                <td>{u.profession}</td>

                <td>
                  <b>{u.professionalVerification.status}</b>
                </td>

                <td>
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    {u.professionalVerification.documents?.aadhaarUrl && (
      <a
        href={u.professionalVerification.documents.aadhaarUrl}
        target="_blank"
        rel="noreferrer"
      >
        🪪 View Aadhaar
      </a>
    )}

    {u.professionalVerification.documents?.degreeUrl && (
      <a
        href={u.professionalVerification.documents.degreeUrl}
        target="_blank"
        rel="noreferrer"
      >
        🎓 View Degree
      </a>
    )}

    {!u.professionalVerification.documents?.aadhaarUrl &&
      !u.professionalVerification.documents?.degreeUrl &&
      "-"}
  </div>
</td>


                <td>
                  {u.professionalVerification.status === "pending" && (
                    <>
                      <button
                        className="admin-primary-btn"
                        onClick={() => approve(u._id)}
                      >
                        Approve
                      </button>

                      <button
                        className="admin-secondary-btn"
                        onClick={() => reject(u._id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
