// src/components/Home/Profile/ProfileNormal.js
import React from "react";

export default function ProfileNormal({ user, posts = [], onAddPost }) {
  return (
    <div className="profile-normal">
      <div className="normal-top">
        <div className="normal-left">
          <div className="avatar-large">{user.avatar || (user.name ? user.name.charAt(0).toUpperCase() : "U")}</div>
        </div>

        <div className="normal-right">
          <div className="name-row">
            <h1 className="display-name">{user.name || "Civilink User"}</h1>
            <button className="btn subtle">Message</button>
            <button className="btn outline">Share</button>
          </div>

          <div className="meta-row">
            <div><strong>{posts.length}</strong><span>Posts</span></div>
            <div><strong>24</strong><span>Followers</span></div>
            <div><strong>12</strong><span>Following</span></div>
          </div>

          <div className="bio">
            <div className="username">@{(user.name || "civilink").replace(/\s+/g,"").toLowerCase()}</div>
            <div className="bio-text">{user.bio || "Construction enthusiast — Build • Buy • Sell • Rent"}</div>
          </div>
        </div>
      </div>

      <div className="posts-section">
        <h3>Your Posts</h3>
        <div className="grid">
          {posts.length ? (
            posts.map(p => (
              <div key={p.id} className="grid-item">
                {p.image ? <img src={p.image} alt="post" /> : <div className="placeholder">{p.text || "No image"}</div>}
                <div className="grid-item-overlay">
                  <button className="icon">❤️</button>
                  <button className="icon">💬</button>
                  <button className="icon">🔗</button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">No posts yet — create one</div>
          )}
        </div>
      </div>
    </div>
  );
}
