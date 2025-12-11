import "./home.css";
import React, { useState, useRef, useEffect } from "react";

import FeedList from "./Feed/FeedList";

// MODALS
import PostModal from "./Modals/PostModal";
import CustomerMenuModal from "./Modals/CustomerMenuModal";
import ConsultModal from "./Modals/ConsultModal";
import CommentsModal from "./Modals/CommentsModal";
import ShareModal from "./Modals/ShareModal";
import ProfileMenu from "./Profile/ProfileMenu";



function Home({ feed }) {
  // -----------------------------
  // STATE
  // -----------------------------
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCustomerMenu, setShowCustomerMenu] = useState(false);

  // modal states
  const [showConsult, setShowConsult] = useState(false);
  const [consultUser, setConsultUser] = useState(null);

  const [showComments, setShowComments] = useState(false);
  const [activePost, setActivePost] = useState(null);

  const [showShare, setShowShare] = useState(false);
  const [sharePost, setSharePost] = useState(null);

  const [menuPost, setMenuPost] = useState(null);
  const menuRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("civilink_user"));
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hasNotification, setHasNotification] = useState(true); // fake notification

  
  // -----------------------------
  // CLOSE POPUP MENU WHEN CLICK OUTSIDE
  // -----------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuPost(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="home-container">

      {/* -------------------------------------
          TOP BAR
      -------------------------------------- */}
      <header className="home-header">
        <div className="home-logo">Civilink</div>

        <input
          className="home-search"
          placeholder="Search engineers, houses, vendors…"
        />
        <div className="top-right-icons">
  <div className="chat-icon">💬</div>

  <div className="home-icon" onClick={() => (window.location.href = "/profile")}>
  👤
</div>

</div>

        
      </header>


      {/* -------------------------------------
          FEED LIST
      -------------------------------------- */}
      <FeedList
        feed={feed}
        menuPost={menuPost}
        setMenuPost={setMenuPost}
        menuRef={menuRef}
        setActivePost={setActivePost}
        setShowComments={setShowComments}
        setSharePost={setSharePost}
        setShowShare={setShowShare}
        setConsultUser={setConsultUser}
        setShowConsult={setShowConsult}
      />


      {/* -------------------------------------
          BOTTOM NAV BAR
      -------------------------------------- */}
      <nav className="bottom-bar">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          🏠
        </button>

        <button onClick={() => alert("Worker feature coming soon")}>
          👷
        </button>

        <button className="add-post" onClick={() => setShowPostModal(true)}>
          +
        </button>

        <button onClick={() => setShowCustomerMenu(true)}>
          🧭
        </button>

        <button onClick={() => (window.location.href = "/vendor")}>
          🛒
        </button>
      </nav>


      {/* -------------------------------------
          ALL MODALS
      -------------------------------------- */}

      {showPostModal && (
        <PostModal onClose={() => setShowPostModal(false)} />
      )}

      {showProfileMenu && (
         <ProfileMenu close={() => setShowProfileMenu(false)} />
      )}


      {showCustomerMenu && (
        <CustomerMenuModal onClose={() => setShowCustomerMenu(false)} />
      )}

      {showConsult && (
        <ConsultModal
          user={consultUser}
          onClose={() => setShowConsult(false)}
        />
      )}

      {showComments && (
        <CommentsModal
          post={activePost}
          onClose={() => setShowComments(false)}
        />
      )}

      {showShare && (
        <ShareModal
          post={sharePost}
          onClose={() => setShowShare(false)}
        />
      )}

    </div>
  );
}

export default Home;
