import React from "react";
import "./sellhouse.css";
import { useNavigate } from "react-router-dom";


function SellHouse({ addToFeed }) {
   const navigate = useNavigate();        
  return (
    <div className="sell-container">
      <h3>Sell Your House</h3>

      <input placeholder="House title" />
      <input placeholder="Location" />
      <input placeholder="Price" />
      <input type="file" />

      <textarea placeholder="House description" />

      <button
  className="btn-primary"
  onClick={() => {
   
    navigate("/");   
  }}
>
  Post House
</button>

    </div>
  );
}

export default SellHouse;
