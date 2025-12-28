import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./rentalhouse.css";

export default function RentHouse() {
  const navigate = useNavigate();

  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Filters */
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");

  const user = JSON.parse(localStorage.getItem("civilink_user"));

  /* ================================
     FETCH RENT HOUSES
  ================================= */
  const fetchRentHouses = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (search) params.append("q", search);
    if (location) params.append("location", location);
    if (minRent) params.append("minRent", minRent);
    if (maxRent) params.append("maxRent", maxRent);

    try {
      const res = await fetch(
        `http://localhost:5000/api/rent/list?${params.toString()}`
      );
      const data = await res.json();

      if (data.success) {
        setHouses(data.rentHouses);
      } else {
        setHouses([]);
      }
    } catch {
      setHouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentHouses();
  }, []);

  /* ================================
     CONTACT OWNER (CHAT)
  ================================= */
const contactOwner = async (ownerId, rentId) => {
  if (!user) {
    alert("Please login to contact owner");
    return;
  }

  if (!ownerId) {
    alert("Owner information missing");
    return;
  }

  if (user._id === ownerId) {
    return; // silently block (button already disabled)
  }

  const res = await fetch(
    "http://localhost:5000/api/chat/conversation",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: user._id,
        receiverId: ownerId,
        contextType: "rent",
        contextId: rentId
      })
    }
  );

  const data = await res.json();

  const conversationId = data?.conversation?._id;

  if (conversationId) {
    navigate(`/messages/${conversationId}`);
  } else if (data.message) {
    alert(data.message);
  }
};



  /* ================================
     RESET FILTERS
  ================================= */
  const resetFilters = () => {
    setSearch("");
    setLocation("");
    setMinRent("");
    setMaxRent("");
    fetchRentHouses();
  };

  return (
    <div className="rent-page">
      {/* ================= FILTER BAR ================= */}
      <div className="rent-filters">
        <input
          placeholder="Search house or area"
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
          placeholder="Min ₹ / month"
          value={minRent}
          onChange={(e) => setMinRent(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max ₹ / month"
          value={maxRent}
          onChange={(e) => setMaxRent(e.target.value)}
        />

        <button className="rent-apply-btn" onClick={fetchRentHouses}>
          Apply
        </button>

        <button className="rent-reset-btn" onClick={resetFilters}>
          Reset
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="rent-loading">Loading rentals…</div>
      ) : houses.length === 0 ? (
        <div className="rent-empty">
          No rental houses found
        </div>
      ) : (
        <div className="rent-list">
          {houses.map((h) => (
            <div key={h._id} className="rent-card">
              {h.imageUrl && (
                <img
                  src={h.imageUrl}
                  alt="Rent House"
                  className="rent-image"
                />
              )}

              <div className="rent-info">
                <h4>{h.title}</h4>
                <p className="rent-location">{h.location}</p>

                <p className="rent-price">
                  ₹{Number(h.rent).toLocaleString("en-IN")} / month
                </p>

                {h.deposit > 0 && (
                  <p className="rent-deposit">
                    Deposit: ₹{Number(h.deposit).toLocaleString("en-IN")}
                  </p>
                )}

                {h.availableFrom && (
                  <p className="rent-date">
                    Available from:{" "}
                    {new Date(h.availableFrom).toLocaleDateString()}
                  </p>
                )}
              </div>
            {user && (
  (typeof h.postedBy === "object"
    ? h.postedBy._id
    : h.postedBy) === user._id ? (

    <button className="rent-own-btn" disabled>
      Your Listing
    </button>

  ) : (

    <button
      className="rent-contact-btn"
      onClick={() =>
        contactOwner(
          typeof h.postedBy === "object" ? h.postedBy._id : h.postedBy,
          h._id
        )
      }
    >
      Contact Owner
    </button>
  )
)}

              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
