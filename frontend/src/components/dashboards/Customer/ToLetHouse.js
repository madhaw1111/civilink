import React from "react";
import { useNavigate } from "react-router-dom";


function ToLetHouse({ addToFeed }) {
     const navigate = useNavigate();
  return (
    <div style={{ padding: "16px" }}>
      <h3>Post House for Rent</h3>

      <input placeholder="House title" />
      <input placeholder="Location" />
      <input placeholder="Monthly Rent" />
      <input type="file" />

      <textarea placeholder="House details" />
    <button
  className="btn-primary"
  onClick={() => {
    addToFeed({
      id: Date.now(),
      type: "rent",
      title: "House for Rent",
      location: "Coimbatore",
      price: "₹8,000 / month",
      user: "Posted by user",
    });

     navigate("/"); 
  }}
>
  Post To-Let
</button>

    </div>
  );
}

export default ToLetHouse;
