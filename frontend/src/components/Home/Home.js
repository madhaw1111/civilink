import React, { useEffect, useRef, useState } from "react";
import "./home.css";

import ProfileMenu from "./Profile/ProfileMenu";
import PostModal from "./Modals/PostModal";
import ProfessionSuggestionRow from "./Feed/ProfessionSuggestionRow";
import { useNavigate } from "react-router-dom";
import ShareModal from "./Modals/ShareModal";
import CommentsModal from "./Modals/CommentsModal";

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


  /* ================= LOAD HOME FEED ================= */
useEffect(() => {
  const loadFeed = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/feed/home");
      const data = await res.json();

      if (data.success) {
        // IMPORTANT: use backend _id as id
        const normalized = data.feed.map(item => ({
          ...item,
          id: item._id
        }));
        setFeed(normalized);
      }
    } catch (err) {
      console.error("Failed to load feed", err);
    }
  };

  loadFeed();
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
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const navigate = useNavigate();

  const openChat = async (receiverId, contextType, contextId) => {
  const user = JSON.parse(localStorage.getItem("civilink_user"));
  if (!user) return alert("Please login");

  const res = await fetch("http://localhost:5000/api/chat/conversation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      senderId: user._id,
      receiverId,
      contextType,
      contextId
    })
  });

  const data = await res.json();

  if (data.success) {
    navigate(`/messages/${data.conversation._id}`);
  }
};

    /*CONSULT BUTTON REDIRECT TO CHAT*/
   const openConsultChat = async (receiverUserId, contextType = "feed", contextId = null) => {
  const user = JSON.parse(localStorage.getItem("civilink_user"));

  if (!user) {
    alert("Please login to consult");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/chat/conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: user._id,
        receiverId: receiverUserId,
        contextType,
        contextId
      })
    });

    const data = await res.json();

    if (data.success) {
      navigate(`/messages/${data.conversation._id}`);
    } else {
      alert("Unable to start chat");
    }
  } catch (err) {
    console.error("Chat error", err);
    alert("Server error. Try again.");
  }
};


const handleLike = async (post) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("civilink_user"));

  if (!token || !user) {
    alert("Please login to like");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:5000/api/feed/${post._id}/like`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    if (!data.success) return;

    // ✅ UPDATE FEED STATE FROM BACKEND RESPONSE
    setFeed(prev =>
      prev.map(p =>
        p._id === data.postId
          ? { ...p, likes: data.likes }
          : p
      )
    );
  } catch (err) {
    console.error("Like failed", err);
  }
};

const handleAddComment = async (text) => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Please login");

  try {
    const res = await fetch(
      `http://localhost:5000/api/feed/${activePost._id}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      }
    );

    const data = await res.json();
    if (!data.success) return;

    setFeed(prev =>
      prev.map(p =>
        p._id === activePost._id
          ? { ...p, comments: data.comments }
          : p
      )
    );

    setActivePost(prev => ({
      ...prev,
      comments: data.comments
    }));
  } catch (err) {
    console.error("Comment failed", err);
  }
};
/* ================= REPORT POST ================= */
const handleReportPost = async (post) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("civilink_user"));

  if (!token || !user) {
    alert("Please login to report");
    return;
  }

  try {
    await fetch("http://localhost:5000/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        message: `
POST REPORT

Post ID: ${post._id}
Reported User: ${post.user?.name || "Unknown"}
Post Type: ${post.type || "feed"}
Content:
${post.text || post.title || "N/A"}
        `,
        source: "post_report"
      })
    });

    alert("Post reported successfully");
  } catch (err) {
    console.error("Report failed", err);
    alert("Failed to report post");
  }
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

        <button
       className="home-message-btn"
        onClick={() => navigate("/messages")}
       >
       💬 Messages
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
                <div
  className="feed-user-box"
  onClick={() => {
    if (item.user?._id) {
      navigate(`/profile/${item.user._id}`);
    }
  }}
  style={{ cursor: "pointer" }}
>
<div className="feed-avatar">
  {item.user?.profilePhoto ? (
    <img
      src={item.user.profilePhoto}
      alt={item.user.name}
    />
  ) : (
    <span>
      {(item.user?.name || "U").charAt(0).toUpperCase()}
    </span>
  )}
</div>

  <div>
    <div className="feed-user">
      {item.user?.name || "Civilink User"}
      <span className="feed-role">
        {item.user?.profession || item.role || "Member"}
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
                {item.imageUrl && (
                  <img src={item.imageUrl} alt="post" className="feed-image" />
                )}

                {/* CONTENT */}
                <div className="feed-content">

                  {/* BADGE */}
  {item.type === "sell" && (
    <span className="badge sell">For Sale</span>
  )}
  {item.type === "rent" && (
    <span className="badge rent">To-Let</span>
  )}

                  {item.title && <h4>{item.title}</h4>}
                  {item.text && <p>{item.text}</p>}
                  {item.price && <div className="feed-price">{item.price}</div>}
                </div>

                {/* ACTIONS */}
                <div className="feed-actions">
  <button
    className={`feed-action-btn ${
      item.likes?.includes(
        JSON.parse(localStorage.getItem("civilink_user"))?._id
      )
        ? "liked"
        : ""
    }`}
    onClick={(e) => {
      e.stopPropagation();   // 🔑 VERY IMPORTANT
      handleLike(item);
    }}
  >
    ❤️ {item.likes?.length || 0}
  </button>


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
  onClick={(e) => {
    e.stopPropagation();

    const receiverId =
      typeof item.user === "string"
        ? item.user
        : item.user?._id;

    if (!receiverId) {
      console.error("Invalid user object", item.user);
      return;
    }

    openConsultChat(
      receiverId,   // ✅ FIXED
      "feed",
      item._id
    );
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
                   <button
  onClick={async () => {
    if (!localStorage.getItem("token")) {
      alert("Please login");
      return;
    }

    const confirmed = window.confirm("Report this post?");
    if (!confirmed) return;

    await fetch(
      `http://localhost:5000/api/post/${item._id}/report`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason: "Inappropriate content" })
      }
    );

    alert("Post reported to admin");
    setMenuPost(null);
  }}
>
  🚩 Report
</button>


                  </div>
                )}
              </article>

              {/* PROFESSION SUGGESTION */}
               {index % 10 === 2 && (
      <ProfessionSuggestionRow key={`suggestion-${item.id}`} />
    )}
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

      {showShare && (
  <ShareModal
    post={sharePost}
    onClose={() => {
      setShowShare(false);
      setSharePost(null);
    }}
  />
)}

{showComments && (
  <CommentsModal
    post={activePost}
    onClose={() => {
      setShowComments(false);
      setActivePost(null);
    }}
    onAddComment={handleAddComment}
  />
)}


      
       {/* CUSTOMER MENU MODAL */}
       {showCustomerMenu && (
  <div
    className="customer-sheet-overlay"
    onClick={() => setShowCustomerMenu(false)}
  >
    <div
      className="customer-sheet"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="sheet-handle" />

      <h3 className="sheet-title">What do you want to do?</h3>

      <button
        className="sheet-btn primary"
        onClick={() => {
          setShowCustomerMenu(false);
          window.location.href = "/profession/engineer";
        }}
      >
        🏗 Build a House
      </button>

      <button
        className="sheet-btn primary"
        onClick={() => {
          setShowCustomerMenu(false);
          window.location.href = "/buy-sell";
        }}
      >
        🏠 Buy / Sell a House
      </button>

      <button
        className="sheet-btn primary"
        onClick={() => {
          setShowCustomerMenu(false);
          window.location.href = "/rent-house";
        }}
      >
        🔑 Rent / To-Let a House
      </button>

      <button
        className="sheet-btn outline"
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
