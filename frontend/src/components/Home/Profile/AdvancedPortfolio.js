import React, { useState } from "react";
import "./advancedPortfolio.css";

export default function AdvancedPortfolio({
  posts = [],
  isOwnProfile = false,
  onEditPost = () => {},
  onDeletePost = () => {},
  loading = false
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (loading) {
    return <div className="portfolio-empty">Loading projects…</div>;
  }

  if (!posts.length) {
    return <div className="portfolio-empty">No projects yet</div>;
  }

  const activePost =
    activeIndex !== null ? posts[activeIndex] : null;

  const closeViewer = () => setActiveIndex(null);

  const next = () =>
    setActiveIndex((i) =>
      i < posts.length - 1 ? i + 1 : i
    );

  const prev = () =>
    setActiveIndex((i) => (i > 0 ? i - 1 : i));

  return (
    <>
      {/* GRID */}
      <div className="portfolio-2025">
        <div className="portfolio-grid">
          {posts.map((p, i) => (
            <div
              key={p._id}
              className="portfolio-card"
              onClick={() => setActiveIndex(i)}
            >
              {p.imageUrl ? (
                <img src={p.imageUrl} alt="project" />
              ) : (
                <div className="portfolio-placeholder">
                  {p.title || "Project"}
                </div>
              )}

              <div className="portfolio-hover">
                <h4>{p.title || "Project"}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULLSCREEN VIEWER */}
      {activePost && (
        <div className="portfolio-viewer">
          <button
            className="viewer-close"
            onClick={closeViewer}
          >
            ✕
          </button>

          {activeIndex > 0 && (
            <button
              className="viewer-nav left"
              onClick={prev}
            >
              ‹
            </button>
          )}

          {activeIndex < posts.length - 1 && (
            <button
              className="viewer-nav right"
              onClick={next}
            >
              ›
            </button>
          )}

          <div className="viewer-content">
            {activePost.imageUrl && (
              <img
                src={activePost.imageUrl}
                alt="project"
              />
            )}

            <div className="viewer-meta">
              <h3>{activePost.title || "Project"}</h3>
              {activePost.text && (
                <p>{activePost.text}</p>
              )}

              {isOwnProfile && (
  <div className="viewer-actions-2025">
    <button
      className="icon-btn edit"
      title="Edit project"
      onClick={() => onEditPost(activePost)}
    >
      ✏️
    </button>

    <button
      className="icon-btn delete"
      title="Delete project"
      onClick={() => {
        if (window.confirm("Delete this project?")) {
          onDeletePost(activePost._id);
        }
      }}
    >
      🗑
    </button>
  </div>
)}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
