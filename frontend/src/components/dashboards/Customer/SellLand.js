import React, { useState } from "react";
import "./sellhouse.css"; // reuse same CSS
import { useNavigate } from "react-router-dom";

function SellLand() {
  const navigate = useNavigate();

  /* ================= COMMON ================= */
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  /* ================= LAND-ONLY ================= */
  const [approvalType, setApprovalType] = useState("");
  const [approvalNumber, setApprovalNumber] = useState("");
  const [plotArea, setPlotArea] = useState("");
  const [landmarks, setLandmarks] = useState("");
  const [loanAvailable, setLoanAvailable] = useState(false);

  /* ================= IMAGE ================= */
  const [layoutImage, setLayoutImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      return;
    }

    // ✅ REQUIRED VALIDATION (FIXED)
    if (!title || !city || !price) {
      alert("Title, city and price are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      // COMMON
      formData.append("title", title);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("price", price);
      formData.append("description", description);

      // LAND-ONLY
      formData.append("approvalType", approvalType);
      formData.append("approvalNumber", approvalNumber);
      formData.append("plotArea", plotArea);
      formData.append("landmarks", landmarks);
      formData.append("loanAvailable", loanAvailable);

      if (layoutImage) {
        formData.append("layoutImage", layoutImage);
      }

      const res = await fetch("/api/land/sell", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        alert("Land posted successfully");
        navigate("/home");
      } else {
        alert(data.message || "Failed to post land");
      }
    } catch (err) {
      console.error("SELL LAND ERROR:", err);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="sell-page">
      <div className="sell-card">

        {/* HEADER */}
        <div className="sell-header-actions">
          <button className="sell-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <button className="sell-close-btn" onClick={() => navigate("/")}>
            ✕
          </button>
        </div>

        <h2 className="sell-title">Sell Your Land</h2>

        {/* LAND TITLE */}
        <div className="form-group">
          <label>Land Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. DTCP Approved Residential Plot"
          />
        </div>

        {/* CITY */}
        <div className="form-group">
          <label>City *</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
        </div>

        {/* STATE */}
        <div className="form-group">
          <label>State</label>
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
          />
        </div>

        {/* ✅ PRICE (FIXED) */}
        <div className="form-group">
          <label>Price *</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="₹ Expected price"
          />
        </div>

        {/* APPROVAL TYPE */}
        <div className="form-group">
          <label>Approval Type</label>
          <select
            value={approvalType}
            onChange={(e) => setApprovalType(e.target.value)}
          >
            <option value="">Select</option>
            <option value="DTCP">DTCP</option>
            <option value="CMDA">CMDA</option>
            <option value="Panchayat">Panchayat</option>
          </select>
        </div>

        {/* APPROVAL NUMBER */}
        <div className="form-group">
          <label>Approval Number</label>
          <input
            value={approvalNumber}
            onChange={(e) => setApprovalNumber(e.target.value)}
            placeholder="Approval No"
          />
        </div>

        {/* PLOT AREA */}
        <div className="form-group">
          <label>Plot Area (sq.ft / cent)</label>
          <input
            value={plotArea}
            onChange={(e) => setPlotArea(e.target.value)}
            placeholder="e.g. 1200 sq.ft"
          />
        </div>

        {/* LANDMARKS */}
        <div className="form-group">
          <label>Nearby Landmarks</label>
          <textarea
            value={landmarks}
            onChange={(e) => setLandmarks(e.target.value)}
            placeholder="Bus stand, school, highway, etc."
          />
        </div>

        {/* LOAN */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={loanAvailable}
              onChange={(e) => setLoanAvailable(e.target.checked)}
            />
            &nbsp;Loan Available
          </label>
        </div>

        {/* IMAGE */}
        <div className="form-group">
          <label>Layout Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setLayoutImage(file);
              if (file) {
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </div>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="sell-image-preview"
          />
        )}

        {/* ACTION BUTTONS */}
        <button
          className="post-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Land"}
        </button>

        {/* ✅ CANCEL BUTTON */}
        <button
          className="sell-back-btn"
          style={{ width: "100%", marginTop: "12px", textAlign: "center" }}
          onClick={() => navigate(-1)}
        >
          Cancel Post
        </button>

      </div>
    </div>
  );
}

export default SellLand;
