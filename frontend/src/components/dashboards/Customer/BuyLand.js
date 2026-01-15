import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./buyhouse.css"; // reuse same CSS

function BuyLand() {
  const navigate = useNavigate();

  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FILTER STATES ================= */
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [approvalType, setApprovalType] = useState("");
  const [loanAvailable, setLoanAvailable] = useState("");
  const [sort, setSort] = useState("latest");

  const user = JSON.parse(localStorage.getItem("civilink_user"));

  /* ================= FETCH LANDS ================= */
  const fetchLands = async () => {
    setLoading(true);

    const params = new URLSearchParams();

    if (search) params.append("q", search);
    if (location) params.append("location", location);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (approvalType) params.append("approvalType", approvalType);
    if (loanAvailable) params.append("loanAvailable", loanAvailable);
    if (sort) params.append("sort", sort);

    const res = await fetch(
      `http://localhost:5000/api/land/buy?${params.toString()}`
    );

    const data = await res.json();

    if (data.success) {
      setLands(data.lands);
    } else {
      setLands([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchLands();
  }, []);

  /* ================= CONTACT SELLER ================= */
  const contactSeller = async (sellerId, landId) => {
    if (!user) return alert("Please login to contact seller");

    const res = await fetch("http://localhost:5000/api/chat/conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: user._id,
        receiverId: sellerId,
        contextType: "land",
        contextId: landId
      })
    });

    const data = await res.json();

    if (data.success) {
      navigate(`/messages/${data.conversation._id}`);
    } else {
      alert("Unable to contact seller");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setApprovalType("");
    setLoanAvailable("");
    setSort("latest");
    fetchLands();
  };

  return (
    <div className="buyhouse-page">

      {/* ================= FILTER BAR ================= */}
      <div className="buyhouse-filters">
        <input
          placeholder="Search land or layout"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select
          value={approvalType}
          onChange={(e) => setApprovalType(e.target.value)}
        >
          <option value="">All Approvals</option>
          <option value="DTCP">DTCP</option>
          <option value="CMDA">CMDA</option>
          <option value="Panchayat">Panchayat</option>
        </select>

        <select
          value={loanAvailable}
          onChange={(e) => setLoanAvailable(e.target.value)}
        >
          <option value="">Loan</option>
          <option value="yes">Loan Available</option>
          <option value="no">No Loan</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="latest">Latest</option>
          <option value="priceLow">Price: Low → High</option>
          <option value="priceHigh">Price: High → Low</option>
        </select>

        <button className="filter-btn" onClick={fetchLands}>
          Apply
        </button>

        <button className="reset-btn" onClick={resetFilters}>
          Reset
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="buyhouse-loading">Loading lands…</div>
      ) : lands.length === 0 ? (
        <div className="buyhouse-empty">No lands found</div>
      ) : (
        <div className="buyhouse-list">
          {lands.map((l) => (
            <div key={l._id} className="buyhouse-card">

              {l.layoutImageUrl && (
                <img
                  src={l.layoutImageUrl}
                  alt="Land"
                  className="buyhouse-image"
                />
              )}

              <div className="buyhouse-info">
                <h4>{l.title}</h4>
                <p className="location">
                  📍 {l.location?.city}, {l.location?.state}
                </p>
                <p className="price">
                  ₹{Number(l.price).toLocaleString("en-IN")}
                </p>
              </div>

              <button
                className="contact-btn"
                onClick={() =>
                  contactSeller(l.postedBy._id, l._id)
                }
              >
                Contact Seller
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BuyLand;
