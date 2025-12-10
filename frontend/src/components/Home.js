import React from "react";
import "./home.css";

function Home() {
  return (
    <div className="home-container">
      {/* 🔝 TOP BAR */}
      <header className="home-header">
        <div className="home-logo">Civilink</div>
        <input
          className="home-search"
          placeholder="Search engineers, houses, vendors…"
        />
        <div className="home-menu">☰</div>
      </header>

      {/* 📰 FEED */}
      <main className="home-feed">
        {[1, 2, 3, 4].map((post) => (
          <div key={post} className="feed-card">
            <div className="feed-user">
              <div className="avatar" />
              <div>
                <strong>Engineer Name</strong>
                <p className="role">Civil Engineer • Chennai</p>
              </div>
            </div>

            <div className="feed-content">
              <p>Completed a residential project ✅</p>
              <div className="feed-image" />
            </div>

            <div className="feed-actions">
              <button>👍 Like</button>
              <button>💬 Comment</button>
              <button>📞 Consult</button>
            </div>
          </div>
        ))}
      </main>

      {/* 🔽 BOTTOM TOOLBAR */}
      <nav className="bottom-bar">
        <button>🏠</button>
        <button>👷</button>
        <button className="add-post">＋</button>
        <button>🧭</button>
        <button>🛒</button>
      </nav>
    </div>
  );
}

export default Home;
