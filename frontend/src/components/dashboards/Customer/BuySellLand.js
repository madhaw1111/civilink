import React from "react";
import "./buysell.css";

function BuySellLand() {
  return (
    <div className="bs-container">
      <h3>Buy / Sell Land</h3>
      <p className="bs-sub">Choose what you want to do</p>

      <div className="bs-options">
        <button
          className="bs-card"
          onClick={() => (window.location.href = "/sell-land")}
        >
          🌍 Sell a Land
          <span>Post your land for buyers</span>
        </button>

        <button
          className="bs-card"
          onClick={() => (window.location.href = "/buy-land")}
        >
          📍 Buy a Land
          <span>Find plots and lands near you</span>
        </button>
      </div>
    </div>
  );
}

export default BuySellLand;
