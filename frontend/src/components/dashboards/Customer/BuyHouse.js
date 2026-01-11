import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./buyhouse.css";

function BuyHouse() {
  const navigate = useNavigate();

  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================================
     FILTER STATES
  ================================= */
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("latest");

  const user = JSON.parse(localStorage.getItem("civilink_user"));

  /* ================================
     FETCH HOUSES WITH FILTERS
  ================================= */
  const fetchHouses = async () => {
    setLoading(true);

    const params = new URLSearchParams();

    if (search) params.append("q", search);
    if (location) params.append("location", location);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (sort) params.append("sort", sort);

    const res = await fetch(
      `http://localhost:5000/api/house/buy?${params.toString()}`
    );

    const data = await res.json();

    if (data.success) {
      setHouses(data.houses);
    } else {
      setHouses([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  /* ================================
     CONTACT SELLER (CHAT)
  ================================= */
  const contactSeller = async (sellerId, houseId) => {
    if (!user) {
      alert("Please login to contact seller");
      return;
    }

    const res = await fetch("http://localhost:5000/api/chat/conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: user._id,
        receiverId: sellerId,
        contextType: "house",
        contextId: houseId
      })
    });

    const data = await res.json();

    if (data.success) {
      navigate(`/messages/${data.conversation._id}`);
    } else {
      alert("Unable to contact seller");
    }
  };

  /* ================================
     RESET FILTERS
  ================================= */
  const resetFilters = () => {
    setSearch("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setSort("latest");
    fetchHouses();
  };

  return (
    <div className="buyhouse-page">

      {/* ================= FILTER BAR ================= */}
      <div className="buyhouse-filters">
        <input
          placeholder="Search house or location"
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
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="latest">Latest</option>
          <option value="priceLow">Price: Low → High</option>
          <option value="priceHigh">Price: High → Low</option>
        </select>

        <button className="filter-btn" onClick={fetchHouses}>
          Apply
        </button>

        <button className="reset-btn" onClick={resetFilters}>
          Reset
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="buyhouse-loading">Loading houses…</div>
      ) : houses.length === 0 ? (
        <div className="buyhouse-empty">
          No houses found
        </div>
      ) : (
        <div className="buyhouse-list">
          {houses.map((h) => (
            <div key={h._id} className="buyhouse-card">

              {h.imageUrl && (
                <img
                  src={h.imageUrl }
                  alt="House"
                  className="buyhouse-image"
                />
              )}

              <div className="buyhouse-info">
                <h4>{h.title}</h4>
                <p className="location">
  📍 {h.location?.city}, {h.location?.state}
</p>

                <p className="price">
                  ₹{Number(h.price).toLocaleString("en-IN")}
                </p>
              </div>

              <button
                className="contact-btn"
                onClick={() =>
                  contactSeller(h.postedBy._id, h._id)
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

export default BuyHouse;
