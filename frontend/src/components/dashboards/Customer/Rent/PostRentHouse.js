import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./postrenthouse.css";

export default function PostRentHouse() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
const [state, setState] = useState("");

  const [rent, setRent] = useState("");
  const [deposit, setDeposit] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      navigate("/login");
      return;
    }

    if (!title || !city || !rent) {
      alert("Title, location and rent are required");
      return;
    }

    try {
      setLoading(true);

      // 🔑 USE FORMDATA
      const formData = new FormData();
      formData.append("title", title);
      formData.append("location[city]", city);
formData.append("location[state]", state);

      formData.append("rent", rent);
      formData.append("deposit", deposit || 0);
      formData.append("availableFrom", availableFrom);
      formData.append("description", description);

      if (imageFile) {
        formData.append("image", imageFile); // 🔑 MUST BE "image"
      }

      const res = await fetch(
        "/api/rent/post",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}` // ❌ NO Content-Type
          },
          body: formData
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Rent house posted successfully");
        navigate("/home");
      } else {
        alert(data.message || "Failed to post rent house");
      }
    } catch (err) {
      console.error("RENT POST ERROR:", err);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rent-post-page">
      <div className="rent-post-card">

        {/* Header actions */}
        <div className="rent-header-actions">
          <button
            className="rent-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <button
            className="rent-close-btn"
            onClick={() => navigate("/")}
          >
            ✕
          </button>
        </div>

        <h2 className="rent-title">Post House for Rent / To-Let</h2>
        <p className="rent-subtitle">
          Reach genuine tenants with clear rental details
        </p>

        <div className="rent-form-group">
          <label>House Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 2BHK Apartment"
          />
        </div>

        <div className="rent-form-group">
          <label>Location</label>
          <input
  value={city}
  onChange={(e) => setCity(e.target.value)}
  placeholder="City"
/>

<input
  value={state}
  onChange={(e) => setState(e.target.value)}
  placeholder="State (optional)"
/>

        </div>

        <div className="rent-grid">
          <div className="rent-form-group">
            <label>Monthly Rent (₹)</label>
            <input
              type="number"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              placeholder="e.g. 15000"
            />
          </div>

          <div className="rent-form-group">
            <label>Deposit (optional)</label>
            <input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              placeholder="e.g. 50000"
            />
          </div>
        </div>

        <div className="rent-form-group">
          <label>Available From</label>
          <input
            type="date"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
          />
        </div>

        {/* 🔑 FILE INPUT */}
        <div className="rent-form-group">
          <label>House Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setImageFile(file);
              if (file) {
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </div>

        {/* IMAGE PREVIEW */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="rent-image-preview"
          />
        )}

        <div className="rent-form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Facilities, furnishing, parking, water supply, etc."
          />
        </div>

        <button
          className="rent-post-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Rent House"}
        </button>

      </div>
    </div>
  );
}
