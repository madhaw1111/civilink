import React, { useEffect, useState } from "react";
import "./professionSuggestion.css";

export default function ProfessionSuggestionRow() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/profession/suggested/home")
      .then(res => res.json())
      .then(data => {
        if (data.success) setList(data.users);
      });
  }, []);

  if (!list.length) return null;

  return (
    <div className="profession-suggest-row">
      <h4>Suggested Professionals</h4>

      <div className="suggest-scroll">
        {list.map(u => (
          <div key={u._id} className="suggest-card">
            <div className="avatar">
              {u.profilePhoto ? (
                <img src={u.profilePhoto} alt="" />
              ) : (
                u.name.charAt(0)
              )}
            </div>

            <div className="info">
              <strong>{u.name}</strong>
              <span>{u.profession}</span>
            </div>

            <button className="connect-btn">Connect</button>
          </div>
        ))}
      </div>
    </div>
  );
}
