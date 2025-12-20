import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./connections.premium.css";

export default function ConnectionsPage() {
  const { userId } = useParams();
  const [connections, setConnections] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("civilink_token");

  useEffect(() => {
    const loadConnections = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/connections/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();
        setConnections(data.connections || []);
      } catch (err) {
        console.error("Failed to load connections", err);
      } finally {
        setLoading(false);
      }
    };

    loadConnections();
  }, [userId, token]);

  const filtered = connections.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="connections-2025">
      {/* HEADER */}
      <div className="connections-header">
        <div>
          <h2>Connections</h2>
          <p>{connections.length} total connections</p>
        </div>

        <input
          type="text"
          placeholder="Search connections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* BODY */}
      {loading ? (
        <div className="connections-loading">
          Loading connections…
        </div>
      ) : filtered.length === 0 ? (
        <div className="connections-empty">
          No connections found
        </div>
      ) : (
        <div className="connections-grid">
          {filtered.map((u) => (
            <div key={u._id} className="connection-card-2025">
              <Link
                to={`/profile/${u._id}`}
                className="card-main"
              >
                <div className="avatar-2025">
                  {u.profilePhoto ? (
                    <img
                      src={u.profilePhoto}
                      alt={u.name}
                    />
                  ) : (
                    u.name.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="card-info">
                  <h4>{u.name}</h4>
                  <p>{u.profession || "Member"}</p>
                </div>
              </Link>

              {/* ACTIONS */}
              <div className="card-actions">
                <button className="btn outline xs">
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
