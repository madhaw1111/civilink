import React from "react";

function RentSearch() {
  return (
    <div style={{ padding: "16px" }}>
      <h3>Available Rental Houses</h3>

      {[1, 2, 3].map((r) => (
        <div
          key={r}
          style={{
            background: "#fff",
            padding: "12px",
            borderRadius: "12px",
            marginTop: "10px",
          }}
        >
          <h4>1BHK – Coimbatore</h4>
          <p>₹8,000 / month</p>
          <button className="btn-outline">
            Contact Owner
          </button>
        </div>
      ))}
    </div>
  );
}

export default RentSearch;
