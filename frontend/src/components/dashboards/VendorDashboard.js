// frontend/src/components/dashboards/VendorDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./vendor.css";

function VendorDashboard() {
  const CATEGORIES = [
    { id: "raw", label: "Raw Materials" },
    { id: "furniture", label: "Furniture" },
    { id: "electrical", label: "Electrical" },
    { id: "plumbing", label: "Plumbing" },
    { id: "concrete", label: "Ready-Mix Concrete" },
    { id: "rental", label: "Rental Equipment" },
  ];

  const CITIES = ["All Cities", "Chennai", "Coimbatore", "Madurai", "Salem"];

  const [selectedCategory, setSelectedCategory] = useState("raw");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/products/all");
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    return (
      (selectedCity === "All Cities" || p.city === selectedCity) &&
      p.category?.toLowerCase() === selectedCategory.toLowerCase() &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="vendor-page">
      {/* Top Bar */}
      <header className="vendor-header">
        <div className="vendor-logo">Civilink Vendor</div>

        <div className="vendor-search">
          <input
            type="text"
            placeholder="Search materials, vendors…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="vendor-actions">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city === "All Cities" ? "All Locations" : city}
              </option>
            ))}
          </select>
          <button className="vendor-cart-btn">Cart</button>
        </div>
      </header>

      {/* Category Strip */}
      <div className="vendor-categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={
              cat.id === selectedCategory
                ? "vendor-category active"
                : "vendor-category"
            }
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Info Banner */}
      <section className="vendor-banner">
        <h2>
          {selectedCategory === "raw" && "Raw Materials for Your Site"}
          {selectedCategory === "furniture" &&
            "Construction-Grade Furniture"}
          {selectedCategory === "electrical" &&
            "Safe & Reliable Electrical Materials"}
          {selectedCategory === "plumbing" &&
            "Plumbing Pipes & Fittings"}
          {selectedCategory === "concrete" && "Ready-Mix Concrete Supply"}
          {selectedCategory === "rental" &&
            "Rental Shuttering & Equipment"}
        </h2>
        <p>
          Showing best options{" "}
          {selectedCity === "All Cities"
            ? "across all locations."
            : `available in ${selectedCity}.`}
        </p>
      </section>

      {/* Product Grid */}
      <main className="vendor-products">
        {filteredProducts.length === 0 ? (
          <div className="vendor-empty">
            No products found for this filter. Try another city or search term.
          </div>
        ) : (
          filteredProducts.map((p) => (
            <div key={p._id} className="vendor-card">
              <div className="vendor-card-header">
                <div className="vendor-product-name">{p.name}</div>
                <div className="vendor-product-id">#{p._id}</div>
              </div>

              <div className="vendor-price">
                ₹{p.price}{" "}
                <span className="vendor-unit">{p.unit}</span>
              </div>

              <div className="vendor-meta">
                <div className="vendor-vendor-name">{p.vendor?.name}</div>
                <div className="vendor-city">{p.city}</div>
              </div>

              <div className="vendor-tags">
                <span className="tag-primary">In stock</span>
              </div>

              <div className="vendor-actions-row">
                <button className="btn-primary">Add to Cart</button>
                <button className="btn-outline">View Details</button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default VendorDashboard;
