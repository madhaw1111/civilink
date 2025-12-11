import React from "react";
import "./renthouse.css";

function RentHouse() {
  return (
    <div className="rent-container">
      <h3>Rent / To-Let a House</h3>
      <p className="rent-sub">Choose what you want to do</p>

      <div className="rent-options">
        <button
          className="rent-card"
          onClick={() => (window.location.href = "/tolet-house")}
        >
          🏷 To-Let a House
          <span>Post your house for rent</span>
        </button>

        <button
          className="rent-card"
          onClick={() => (window.location.href = "/rent-search")}
        >
          🔑 Rent a House
          <span>Find houses available for rent</span>
        </button>
      </div>
    </div>
  );
}

export default RentHouse;
