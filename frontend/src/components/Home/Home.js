// src/components/Home/Home.js
import React, { useRef, useEffect, useState } from "react";
import "./home.css";
import ProfileMenu from "./Profile/ProfileMenu";
import PostModal from "./Modals/PostModal";
import ProfessionMenuModal from "./Modals/ProfessionMenuModal";



export default function Home({ feed = [] }) {
  // state
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCustomerMenu, setShowCustomerMenu] = useState(false);
  const [showConsult, setShowConsult] = useState(false);
  const [consultUser, setConsultUser] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [activePost, setActivePost] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [sharePost, setSharePost] = useState(null);
  const [menuPost, setMenuPost] = useState(null);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfessionMenu, setShowProfessionMenu] = useState(false);

  const handleProfessionSelect = (type) => {
  const u = { ...user };

  if (type === "Worker") {
    u.profession = "Worker";
  } else if (type === "Engineer") {
    u.profession = "Engineer";
  } else if (type === "Search") {
    setShowProfessionMenu(false);
    window.location.href = "/search-worker";
    return;
  }

  // Save in localStorage
  localStorage.setItem("civilink_user", JSON.stringify(u));
  setShowProfessionMenu(false);

  // Redirect to profile to show LinkedIn-style UI
  window.location.href = "/profile";
};

  const user = JSON.parse(localStorage.getItem("civilink_user") || "{}");

  const handleLogout = () => {
  localStorage.removeItem("civilink_user");
  localStorage.removeItem("civilink_token");
  window.location.href = "/";
  };

  const addToFeed = (newPost) => {
  console.log("Add to feed:", newPost);
  };


  const menuRef = useRef(null);

  // close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuPost(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // helper to get user from localStorage
  const getUser = () => {
    try {
      const raw = localStorage.getItem("civilink_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  return (
    <div className="home-container">
      {/* TOP BAR */}
      <header className="home-header">
        <div className="home-logo">Civilink</div>

        <input
          className="home-search"
          placeholder="Search engineers, houses, vendors…"
        />

        {/* CHAT BUTTON */}
        <button
          className="top-icon"
          title="Chat (coming soon)"
          onClick={() => alert("Chat coming soon")}
        >
          💬
        </button>

        {/* NOTIFICATIONS BUTTON */}
        <button
          className="top-icon"
          title="Notifications"
          onClick={() => alert("Notifications coming soon")}
          style={{ position: "relative" }}
        >
          🔔
          {(() => {
            const u = getUser();
            if (u?.notificationsCount > 0) {
              return (
                <span
                  style={{
                    position: "absolute",
                    right: -6,
                    top: -6,
                    background: "#e91e63",
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: 99,
                    fontSize: 11,
                  }}
                >
                  {u.notificationsCount}
                </span>
              );
            }
            return null;
          })()}
        </button>

        {/* PROFILE BUTTON */}
        <button
  className="top-icon"
  title="Profile"
  onClick={() => setShowProfileMenu(true)}
>
  👤
</button>

      </header>

      {/* FEED */}
      <main className="home-feed">
        {Array.isArray(feed) && feed.length > 0 ? (
          feed.map((item) => (
            <article key={item.id} className="feed-card" onClick={() => setMenuPost(null)}>
              {/* HEADER */}
              <div className="feed-header">
                <div className="feed-user-box">
                  <div className="feed-avatar">
                    {(item.user || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="feed-user">
                      {item.user || "Civilink User"}
                      <span className="feed-role">{item.role || "Member"}</span>
                    </div>
                    <div className="feed-meta">{item.location || "Tamil Nadu"} • Just now</div>
                  </div>
                </div>

                <button
                  className="feed-menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (menuPost?.id === item.id) setMenuPost(null);
                    else setMenuPost(item);
                  }}
                >
                  ⋮
                </button>
              </div>

              {/* IMAGE */}
              {item.image && (
                <img src={item.image} alt="post" className="feed-image" />
              )}

              {/* CONTENT */}
              <div className="feed-content">
                {item.title && <h4>{item.title}</h4>}
                {item.text && <p>{item.text}</p>}
                {item.price && <div className="feed-price">{item.price}</div>}
              </div>

              {/* ACTIONS */}
              <div className="feed-actions">
                <button
                  className="feed-action-btn"
                  onClick={() => alert("Like (next step)")}
                >
                  ❤️ <span>Like</span>
                </button>

                <button
                  className="feed-action-btn"
                  onClick={() => {
                    setActivePost(item);
                    setShowComments(true);
                  }}
                >
                  💬 <span>Comment</span>
                </button>

                <button
                  className="feed-action-btn"
                  onClick={() => {
                    setSharePost(item);
                    setShowShare(true);
                  }}
                >
                  🔗 <span>Share</span>
                </button>

                <button
                  className="feed-action-btn consult-btn"
                  onClick={() => {
                    setConsultUser(item);
                    setShowConsult(true);
                  }}
                >
                  📞 <span>Consult</span>
                </button>
              </div>

              {/* MENU POPUP (per post) */}
              {menuPost?.id === item.id && (
                <div className="feed-menu-popup" ref={menuRef} onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => { alert("Saved (next step)"); setMenuPost(null); }}>⭐ Save post</button>
                  <button onClick={() => { alert("Hidden (next step)"); setMenuPost(null); }}>🙈 Hide post</button>
                  <button onClick={() => { alert("Reported (next step)"); setMenuPost(null); }}>🚩 Report</button>
                  <button className="btn-outline" onClick={() => setMenuPost(null)}>Close</button>
                </div>
              )}
            </article>
          ))
        ) : (
          <div style={{ padding: 20, color: "#666" }}>No feed items yet.</div>
        )}
      </main>

      {/* ADD POST MODAL */}
      {showPostModal && (
      <PostModal
     onClose={() => setShowPostModal(false)}
     addToFeed={addToFeed}
    />
    )}


      {/* CUSTOMER MENU MODAL (outside nav) */}
      {showCustomerMenu && (
        <div className="vendor-modal-overlay">
          <div className="vendor-modal">
            <h3 style={{ textAlign: "center" }}>What do you want to do?</h3>
            <button className="btn-primary" style={{ width: "100%", marginBottom: 10 }} onClick={() => (window.location.href = "/build-house")}>🏗 Build a House</button>
            <button className="btn-primary" style={{ width: "100%", marginBottom: 10 }} onClick={() => (window.location.href = "/buy-sell")}>🏠 Buy / Sell a House</button>
            <button className="btn-primary" style={{ width: "100%", marginBottom: 10 }} onClick={() => (window.location.href = "/rent-house")}>🔑 Rent / To-Let</button>
            <button className="btn-outline" style={{ width: "100%" }} onClick={() => setShowCustomerMenu(false)}>Close</button>
          </div>
        </div>
      )}

      {/* CONSULT / COMMENTS / SHARE modals */}
      {showConsult && consultUser && (
        <div className="vendor-modal-overlay">
          <div className="vendor-modal">
            <h3>Consult</h3>
            <p style={{ marginBottom: 6 }}><strong>{consultUser.user || "Civilink Member"}</strong></p>
            <p style={{ fontSize: 13, color: "#666" }}>{consultUser.role || "Service Provider"}</p>
            <a href={`tel:${consultUser.phone || "+919XXXXXXXXX"}`} className="btn-primary" style={{ display: "block", textAlign: "center", marginTop: 12 }}>📞 Call Now</a>
            <a href={`https://wa.me/${(consultUser.phone || "919XXXXXXXXX").replace("+","")}`} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: "block", textAlign: "center", marginTop: 8, background: "#25D366" }}>💬 WhatsApp</a>
            <a href={`mailto:${consultUser.email || "civilink.admin@gmail.com"}`} className="btn-outline" style={{ display: "block", textAlign: "center", marginTop: 8 }}>✉️ Email</a>
            <button className="btn-outline" style={{ width: "100%", marginTop: 12 }} onClick={() => setShowConsult(false)}>Close</button>
          </div>
        </div>
      )}

      {showComments && activePost && (
        <div className="vendor-modal-overlay">
          <div className="vendor-modal">
            <h3>Comments</h3>
            <div className="comment"><strong>Raj (Worker):</strong> Interested 👍</div>
            <div className="comment"><strong>Siva (Customer):</strong> Please share details</div>
            <input placeholder="Write a comment..." style={{ marginTop: 10 }} />
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowComments(false)}>Close</button>
              <button className="btn-primary">Post</button>
            </div>
          </div>
        </div>
      )}

      {showShare && sharePost && (
        <div className="vendor-modal-overlay">
          <div className="vendor-modal">
            <h3>Share Post</h3>
            <button className="btn-primary" style={{ width: "100%", marginBottom: 10 }} onClick={() => { alert("WhatsApp share (next step)"); setShowShare(false); }}>💬 Share via WhatsApp</button>
            <button className="btn-outline" style={{ width: "100%", marginBottom: 10 }} onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied"); setShowShare(false); }}>🔗 Copy Link</button>
            <button className="btn-outline" style={{ width: "100%" }} onClick={() => setShowShare(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showProfessionMenu && (
      <ProfessionMenuModal
      onClose={() => setShowProfessionMenu(false)}
       onSelect={handleProfessionSelect}
      />
      )}


      {/* BOTTOM TOOLBAR */}
      <nav className="bottom-bar" style={{ zIndex: 5 }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>🏠</button>
        <button onClick={() => (window.location.href = "/profession-dashboard")}> 👷</button>
        <button className="add-post" onClick={() => setShowPostModal(true)}>+</button>
        <button onClick={() => setShowCustomerMenu(true)}>🧭</button>
        <button onClick={() => (window.location.href = "/vendor")}>🛒</button>
      </nav>
    <ProfileMenu
      open={showProfileMenu}
      onClose={() => setShowProfileMenu(false)}
      user={user}
      onLogout={handleLogout}
      />

    </div>
    
  );
}
