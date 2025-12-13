import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./buyhouse.css";

function BuyHouse() {
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("civilink_user"));

  /* ================================
     FETCH HOUSES (BACKEND READY)
  ================================= */
  useEffect(() => {
    // Temporary demo data (replace with backend later)
    setTimeout(() => {
      setHouses([
        {
          _id: "house1",
          title: "2BHK Independent House",
          location: "Chennai",
          price: 4500000,
          postedBy: "USER_ID_SELLER_1"
        },
        {
          _id: "house2",
          title: "3BHK Villa",
          location: "Coimbatore",
          price: 7200000,
          postedBy: "USER_ID_SELLER_2"
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  /* ================================
     CONTACT SELLER (CHAT)
  ================================= */
  const contactSeller = async (sellerId, houseId) => {
    if (!user) {
      alert("Please login to contact seller");
      return;
    }

    const res = await fetch(
      "http://localhost:5000/api/chat/conversation",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user._id,
          receiverId: sellerId,
          contextType: "house",
          contextId: houseId
        })
      }
    );

    const data = await res.json();

    if (data.success) {
      navigate(`/messages/${data.conversation._id}`);
    } else {
      alert("Unable to contact seller");
    }
  };

  if (loading) {
    return <div className="buyhouse-loading">Loading houses…</div>;
  }

  return (
    <div className="buyhouse-page">
      <div className="buyhouse-header">
        <h2>Buy a House</h2>
        <p>Verified houses posted by owners</p>
      </div>

      {houses.length === 0 ? (
        <div className="buyhouse-empty">
          No houses available right now
        </div>
      ) : (
        <div className="buyhouse-list">
          {houses.map((h) => (
            <div key={h._id} className="buyhouse-card">
              <div className="buyhouse-info">
                <h4>{h.title}</h4>
                <p className="location">{h.location}</p>
                <p className="price">
                  ₹{h.price.toLocaleString("en-IN")}
                </p>
              </div>

              <button
                className="contact-btn"
                onClick={() =>
                  contactSeller(h.postedBy, h._id)
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
