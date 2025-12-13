import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProfessionList() {
  const { type } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/profession/${type}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setUsers(data.users);
        setLoading(false);
      });
  }, [type]);

  if (loading) return <p style={{ padding: 20 }}>Loading {type}s...</p>;

  if (!users.length)
    return <p style={{ padding: 20 }}>No {type}s found</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{type.charAt(0).toUpperCase() + type.slice(1)} Profiles</h2>

      {users.map(u => (
        <div
          key={u._id}
          style={{
            padding: 12,
            marginTop: 12,
            borderRadius: 10,
            background: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
          }}
        >
          <strong>{u.name}</strong>
          <div>{u.profession}</div>
          <div>{u.experienceYears} yrs experience</div>
          <div>{u.skills?.join(", ")}</div>
        </div>
      ))}
    </div>
  );
}
