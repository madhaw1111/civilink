import React, { useEffect, useRef, useState } from "react";
import "./home.css";

import ProfileMenu from "./Profile/ProfileMenu";
import PostModal from "./Modals/PostModal";
import ProfessionMenuModal from "./Modals/ProfessionMenuModal";
import ProfessionSuggestionRow from "./Feed/ProfessionSuggestionRow";

export default function Home() {

  /* ================= USER ================= */
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("civilink_user")) || null;
    } catch {
      return null;
    }
  });

  /* ================= FEED ================= */
  const [feed, setFeed] = useState([]);

  const addToFeed = (newPost) => {
    setFeed((prev) => [
      { ...newPost, id: Date.now() },
      ...prev,
    ]);
  };

  /* ================= MODALS ================= */
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCustomerMenu, setShowCustomerMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfessionMenu, setShowProfessionMenu] = useState(false);

  const [showConsult, setShowConsult] = useState(false);
  const [consultUser, setConsultUser] = useState(null);

  const [showComments, setShowComments] = useState(false);
  const [activePost, setActivePost] = useState(null);

  const [showShare, setShowShare] = useState(false);
  const [sharePost, setSharePost] = useState(null);

  /* ================= POST MENU ================= */
  const [menuPost, setMenuPost] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuPost(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ================= LOAD PENDING POST ================= */
  useEffect(() => {
    const pending = localStorage.getItem("civilink_new_post");
    if (pending) {
      addToFeed(JSON.parse(pending));
      localStorage.removeItem("civilink_new_post");
    }
  }, []);

  /* ================= PROFESSION SELECT ================= */
  const handleProfessionSelect = (profession) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    if (user.isProfessional) {
      alert("Profession already finalized");
      return;
    }

    const updatedUser = {
      ...user,
      profession,
      isProfessional: true,
    };

    localStorage.setItem("civilink_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setShowProfessionMenu(false);

    window.location.href = "/profile";
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("civilink_user");
    localStorage.removeItem("civilink_token");
    window.location.href = "/";
  };

  /* ================= RENDER ================= */
  return (
    <div className="home-container">

      {/* ================= TOP BAR ================= */}
      <header className="home-header">
        <div className="home-logo">Civilink</div>

        <input
          className="home-search"
          placeholder="Search engineers, houses, vendors…"
        />

        <button className="top-icon" onClick={() => alert("Chat coming soon")}>
          💬
        </button>

        <button className="top-icon" onClick={() => alert("Notifications coming soon")}>
          🔔
        </button>

        <button className="top-icon" onClick={() => setShowProfileMenu(true)}>
          👤
        </button>
      </header>

      {/* ================= FEED ================= */}
      <main className="home-feed">
        {feed.length ? (
          feed.map((item, index) => (
            <React.Fragment key={item.id}>

              <article
                className="feed-card"
                onClick={() => setMenuPost(null)}
              >
                {/* HEADER */}
                <div className="feed-header">
                  <div className="feed-user-box">
                    <div className="feed-avatar">
                      {(item.user || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="feed-user">
                        {item.user || "Civilink User"}
                        <span className="feed-role">
                          {item.role || "Member"}
                        </span>
                      </div>
                      <div className="feed-meta">
                        {item.location || "Tamil Nadu"} • Just now
                      </div>
                    </div>
                  </div>

                  <button
                    className="feed-menu"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuPost(menuPost?.id === item.id ? null : item);
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
                  <button className="feed-action-btn">❤️ Like</button>

                  <button
                    className="feed-action-btn"
                    onClick={() => {
                      setActivePost(item);
                      setShowComments(true);
                    }}
                  >
                    💬 Comment
                  </button>

                  <button
                    className="feed-action-btn"
                    onClick={() => {
                      setSharePost(item);
                      setShowShare(true);
                    }}
                  >
                    🔗 Share
                  </button>

                  <button
                    className="feed-action-btn"
                    onClick={() => {
                      setConsultUser(item);
                      setShowConsult(true);
                    }}
                  >
                    📞 Consult
                  </button>
                </div>

                {/* MENU */}
                {menuPost?.id === item.id && (
                  <div
                    className="feed-menu-popup"
                    ref={menuRef}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button>⭐ Save post</button>
                    <button>🙈 Hide post</button>
                    <button>🚩 Report</button>
                  </div>
                )}
              </article>

              {/* PROFESSION SUGGESTION */}
              {index % 3 === 2 && <ProfessionSuggestionRow />}

            </React.Fragment>
          ))
        ) : (
          <div style={{ padding: 20, color: "#666" }}>
            No feed items yet.
          </div>
        )}
      </main>

      {/* ================= MODALS ================= */}
      {showPostModal && (
        <PostModal
          onClose={() => setShowPostModal(false)}
          addToFeed={addToFeed}
        />
      )}

      {showProfessionMenu && (
        <ProfessionMenuModal
          onClose={() => setShowProfessionMenu(false)}
          onSelect={handleProfessionSelect}
        />
      )}
       {/* CUSTOMER MENU MODAL */}
{showCustomerMenu && (
  <div className="vendor-modal-overlay" onClick={() => setShowCustomerMenu(false)}>
    <div className="vendor-modal" onClick={(e) => e.stopPropagation()}>
      <h3 style={{ textAlign: "center" }}>What do you want to do?</h3>

      <button
        className="btn-primary"
        style={{ width: "100%", marginBottom: 10 }}
        onClick={() => {
          setShowCustomerMenu(false);
          window.location.href = "/sell-house";
        }}
      >
        🏠 Sell House
      </button>

      <button
        className="btn-primary"
        style={{ width: "100%", marginBottom: 10 }}
        onClick={() => {
          setShowCustomerMenu(false);
          window.location.href = "/buy-house";
        }}
      >
        🛒 Buy House
      </button>

      <button
        className="btn-primary"
        style={{ width: "100%", marginBottom: 10 }}
        onClick={() => {
          setShowCustomerMenu(false);
          window.location.href = "/rent-house";
        }}
      >
        🔑 Rent / To-Let
      </button>

      <button
        className="btn-outline"
        style={{ width: "100%" }}
        onClick={() => setShowCustomerMenu(false)}
      >
        Close
      </button>
    </div>
  </div>
)}



      <ProfileMenu
        open={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
        user={user}
        onLogout={handleLogout}
      />

      {/* ================= BOTTOM BAR ================= */}
      <nav className="bottom-bar">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          🏠
        </button>
        <button onClick={() => window.location.href = "/profession-dashboard"}>
          👷
        </button>
        <button className="add-post" onClick={() => setShowPostModal(true)}>
          +
        </button>
        <button onClick={() => setShowCustomerMenu(true)}>
          🧭
        </button>
        <button onClick={() => window.location.href = "/vendor"}>
          🛒
        </button>
      </nav>
    </div>
  );
}
