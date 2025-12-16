import React, { useState } from "react";
import "./sellhouse.css";
import { useNavigate } from "react-router-dom";

function SellHouse() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const token = localStorage.getItem("civilink_token");

    if (!token) {
      alert("Please login again");
      return;
    }

    if (!title || !location || !price) {
      alert("Title, location and price are required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/house/sell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // 🔑 REQUIRED
        },
        body: JSON.stringify({
          title,
          location,
          price: Number(price),
          description,
          image
        })
      });

      const data = await response.json();

      if (data.success) {
        alert("House posted successfully");
        navigate("/buy-house");
      } else {
        alert(data.message || "Failed to post house");
      }
    } catch (err) {
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sell-page">
      <div className="sell-card">
        {/* Header actions */}
        <div className="sell-header-actions">
          <button
            className="sell-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <button
            className="sell-close-btn"
            onClick={() => navigate("/")}
          >
            ✕
          </button>
        </div>

        <h2 className="sell-title">Sell Your House</h2>
        <p className="sell-subtitle">
          Add accurate details to reach genuine buyers faster
        </p>

        <div className="form-group">
          <label>House Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 3BHK Independent House"
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City / Area"
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="₹ Expected price"
          />
        </div>

        <div className="form-group">
          <label>House Image URL</label>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Paste image link"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your house, amenities, age, nearby facilities..."
          />
        </div>

        <button
          className="post-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post House"}
        </button>
      </div>
    </div>
  );
}

export default SellHouse;
