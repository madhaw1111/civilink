import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./postrenthouse.css";

export default function PostRentHouse() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [rent, setRent] = useState("");
  const [deposit, setDeposit] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const token = localStorage.getItem("civilink_token");

    if (!token) {
      alert("Please login again");
      navigate("/login");
      return;
    }

    if (!title || !location || !rent) {
      alert("Title, location and rent are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/rent/post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title,
            location,
            rent: Number(rent),
            deposit: deposit ? Number(deposit) : 0,
            availableFrom,
            image,
            description
          })
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
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City / Area"
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

        <div className="rent-form-group">
          <label>House Image URL</label>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Paste image link"
          />
        </div>

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
