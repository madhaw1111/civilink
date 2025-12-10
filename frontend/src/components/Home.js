
import "./home.css";
import React, { useRef } from "react";


function Home({ feed }) {


const [showPostModal, setShowPostModal] = React.useState(false);
const [showCustomerMenu, setShowCustomerMenu] = React.useState(false);
const [showConsult, setShowConsult] = React.useState(false);
const [consultUser, setConsultUser] = React.useState(null);
const [showComments, setShowComments] = React.useState(false);
const [activePost, setActivePost] = React.useState(null);
const [showShare, setShowShare] = React.useState(false);
const [sharePost, setSharePost] = React.useState(null);
const [menuPost, setMenuPost] = React.useState(null);
const menuRef = useRef(null);



React.useEffect(() => {
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuPost(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  


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
    <main className="home-feed">
  {feed.map((item) => (
    <div key={item.id} className="feed-card">

      {/* 🔝 HEADER */}
      <div className="feed-header">
        <div className="feed-user-box">
          <div className="feed-avatar">
            {(item.user || "C").charAt(0)}
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

        <div
  className="feed-menu"
  onClick={(e) => {
    e.stopPropagation();
    if (menuPost?.id === item.id) {
      setMenuPost(null); // ✅ close if same post
    } else {
      setMenuPost(item); // ✅ open for this post
    }
  }}
>
  ⋮
</div>


      </div>

      {/* 🖼 IMAGE (OPTIONAL) */}
      {item.image && (
        <img
          src={item.image}
          alt="post"
          className="feed-image"
        />
      )}

      {/* 📝 CONTENT */}
      <div className="feed-content">
        {item.title && <h4>{item.title}</h4>}
        {item.text && <p>{item.text}</p>}
        {item.price && (
          <div className="feed-price">{item.price}</div>
        )}
      </div>

      {/* ❤️ ACTIONS */}
      <div className="feed-actions">
  <button className="feed-action-btn">
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
 {/* ✅ MENU POPUP — MUST BE HERE */}
      {menuPost?.id === item.id && (
        <div className="feed-menu-popup"ref={menuRef}>
          <button onClick={() => alert("Saved (next step)")}>
            ⭐ Save post
          </button>
          <button onClick={() => alert("Post hidden")}>
            🙈 Hide post
          </button>
          <button onClick={() => alert("Reported")}>
            🚩 Report
          </button>
            <button
      className="btn-outline"
      onClick={() => setMenuPost(null)}
    >
      Close
    </button>
        </div>
      )}


    </div>
  ))}
</main>

      

      {/* ✅ ADD POST MODAL — PLACE HERE */}
      {showPostModal && (
      <div className="vendor-modal-overlay">
      <div className="vendor-modal">
      <h3>Create Post</h3>

      <input type="file" />
      <textarea placeholder="Write something..." />

      <div className="modal-actions">
        <button
          className="btn-outline"
          onClick={() => setShowPostModal(false)}
        >
          Cancel
        </button>

        <button
          className="btn-primary"
          onClick={() => {
            alert("Post uploaded (next step)");
            setShowPostModal(false);
          }}
        >
          Post
        </button>
       </div>
      </div>
    </div>
    )}
    {showCustomerMenu && (
  <div className="vendor-modal-overlay">
    <div className="vendor-modal">
      <h3>What do you want to do?</h3>

      <button className="btn-primary">
        🏗 Build a House
      </button>

      <button className="btn-primary">
        🏠 Buy / Sell a House
      </button>

      <button className="btn-primary">
        🔑 Rent / To-Let House
      </button>

      <button
        className="btn-outline"
        onClick={() => setShowCustomerMenu(false)}
      >
        Close
      </button>
    </div>
  </div>
)}

   {showCustomerMenu && (
  <div className="vendor-modal-overlay">
    <div className="vendor-modal">
      <h3 style={{ textAlign: "center" }}>
        What do you want to do?
      </h3>

      <button
        className="btn-primary"
        style={{ width: "100%", marginBottom: "10px" }}
        onClick={() => (window.location.href = "/build-house")}

      >
        🏗 Build a House
      </button>

      <button
        className="btn-primary"
        style={{ width: "100%", marginBottom: "10px" }}
        onClick={() => (window.location.href = "/buy-sell")}

      >
        🏠 Buy / Sell a House
      </button>

      <button
        className="btn-primary"
        style={{ width: "100%", marginBottom: "10px" }}
        onClick={() => (window.location.href = "/rent-house")}

      >
        🔑 Rent / To-Let House
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



      {/* 🔽 BOTTOM TOOLBAR */}
     <nav className="bottom-bar">
    {/* HOME */}
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
    🏠
  </button>

  {/* WORKER (future) */}
  <button onClick={() => alert("Worker feature coming soon")}>
    👷
  </button>

  {/* ADD POST */}
  <button
    className="add-post"
    onClick={() => setShowPostModal(true)}
  >
    +
  </button>

  {/* CUSTOMER OPTIONS */}
  <button onClick={() => setShowCustomerMenu(true)}>
    🧭
  </button>

  {/* VENDOR */}
  <button onClick={() => (window.location.href = "/vendor")}>
    🛒
  </button>
{showConsult && consultUser && (
  <div className="vendor-modal-overlay">
    <div className="vendor-modal">
      <h3>Consult</h3>

      <p style={{ marginBottom: "6px" }}>
        <strong>{consultUser.user || "Civilink Member"}</strong>
      </p>
      <p style={{ fontSize: "13px", color: "#666" }}>
        {consultUser.role || "Service Provider"}
      </p>

      {/* 📞 CALL */}
      <a
        href={`tel:${consultUser.phone || "+919XXXXXXXXX"}`}
        className="btn-primary"
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "12px",
        }}
      >
        📞 Call Now
      </a>

      {/* 💬 WHATSAPP */}
      <a
        href={`https://wa.me/${(consultUser.phone || "919XXXXXXXXX").replace(
          "+",
          ""
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "8px",
          background: "#25D366",
        }}
      >
        💬 WhatsApp
      </a>

      {/* ✉️ EMAIL */}
      <a
        href={`mailto:${consultUser.email || "civilink.admin@gmail.com"}`}
        className="btn-outline"
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "8px",
        }}
      >
        ✉️ Email
      </a>

      <button
        className="btn-outline"
        style={{ width: "100%", marginTop: "12px" }}
        onClick={() => {
          setShowConsult(false);
          document.body.style.overflow = "auto";
        }}
      >
        Close
      </button>
    </div>
  </div>
)}

{showComments && activePost && (
  <div className="vendor-modal-overlay">
    <div className="vendor-modal">
      <h3>Comments</h3>

      <div className="comment">
        <strong>Raj (Worker):</strong> Interested 👍
      </div>
      <div className="comment">
        <strong>Siva (Customer):</strong> Please share details
      </div>

      <input
        placeholder="Write a comment..."
        style={{ marginTop: "10px" }}
      />

      <div className="modal-actions">
        <button
          className="btn-outline"
          onClick={() => setShowComments(false)}
        >
          Close
        </button>
        <button className="btn-primary">
          Post
        </button>
      </div>
    </div>
  </div>
)}
{showShare && sharePost && (
  <div className="vendor-modal-overlay">
    <div className="vendor-modal">
      <h3>Share Post</h3>

      <button
        className="btn-primary"
        style={{ width: "100%", marginBottom: "10px" }}
        onClick={() => {
          alert("WhatsApp share (next step)");
          setShowShare(false);
        }}
      >
        💬 Share via WhatsApp
      </button>

      <button
        className="btn-outline"
        style={{ width: "100%", marginBottom: "10px" }}
        onClick={() => {
          navigator.clipboard.writeText(
            window.location.href
          );
          alert("Link copied");
          setShowShare(false);
        }}
      >
        🔗 Copy Link
      </button>

      <button
        className="btn-outline"
        style={{ width: "100%" }}
        onClick={() => setShowShare(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}



</nav>

    
    </div>
  );
}

export default Home;
