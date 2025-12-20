import React from "react";
import "./advancedPortfolio.css";

export default function AdvancedPortfolio({
  posts = [],
  isOwnProfile = false,
  onEditPost = () => {},
  onDeletePost = () => {},
  loading = false
}) {
  if (loading) {
    return (
      <div className="portfolio-empty">
        Loading projects…
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="portfolio-empty">
        No projects yet
      </div>
    );
  }

  return (
    <div className="portfolio-2025">
      <div className="portfolio-grid">
        {posts.map((p) => (
          <div key={p._id} className="portfolio-card">
            {p.image ? (
              <img src={p.image} alt="project" />
            ) : (
              <div className="portfolio-placeholder">
                {p.text || "Project"}
              </div>
            )}

            <div className="portfolio-overlay">
              <div className="overlay-content">
                <h4>{p.title || "Project"}</h4>
                <p>{p.text}</p>

                {isOwnProfile && (
                  <div className="overlay-actions">
                    <button
                      className="btn xs outline"
                      onClick={() => onEditPost(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn xs danger"
                      onClick={() => onDeletePost(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
