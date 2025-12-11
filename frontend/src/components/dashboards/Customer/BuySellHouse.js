import React from "react";
import "./buysell.css";

function BuySellHouse() {
  return (
    <div className="bs-container">
      <h3>Buy / Sell a House</h3>
      <p className="bs-sub">Choose what you want to do</p>

      <div className="bs-options">
        <button
          className="bs-card"
          onClick={() => (window.location.href = "/sell-house")}
        >
          🏷 Sell a House
          <span>Post your house for buyers</span>
        </button>

        <button
          className="bs-card"
          onClick={() => (window.location.href = "/buy-house")}
        >
          🏠 Buy a House
          <span>Find houses near you</span>
        </button>
      </div>
    </div>
  );
}

export default BuySellHouse;
