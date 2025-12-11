import React from "react";

function BuyHouse() {
  return (
    <div style={{ padding: "16px" }}>
      <h3>Buy a House</h3>
      <p>Houses posted by sellers will appear here</p>

      {[1, 2, 3].map((h) => (
        <div
          key={h}
          style={{
            background: "#fff",
            padding: "12px",
            borderRadius: "12px",
            marginTop: "10px",
          }}
        >
          <h4>2BHK House – Chennai</h4>
          <p>₹45,00,000</p>
          <button className="btn-outline">Contact Seller</button>
        </div>
      ))}
    </div>
  );
}

export default BuyHouse;
