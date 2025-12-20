import React from "react";
import { useNavigate } from "react-router-dom";

function FeedActions({
  item,
  setShowComments,
  setActivePost,
  setShowShare,
  setSharePost,
  onLike
}) {
  const navigate = useNavigate();

  /* ===============================
     OPEN CONSULT CHAT (HOME FEED)
  =============================== */
 const openConsultChat = async () => {
  const user = JSON.parse(localStorage.getItem("civilink_user"));

  if (!user) {
    alert("Please login to consult");
    return;
  }

  // 🔍 DEBUG (remove later)
  console.log("user value:", item.user);
  console.log("typeof user:", typeof item.user);

  // 🔑 SAFE receiverId extraction
  const receiverId =
    typeof item.user === "string"
      ? item.user
      : item.user?._id;

  if (!receiverId) {
    console.error("Invalid postedBy Object", item.user);
    alert("Unable to consult this user");
    return;
  }

  // 🚫 prevent self chat
  if (user._id === receiverId) {
    alert("You cannot consult yourself");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/chat/conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: user._id,
        receiverId,            // ✅ FIXED
        contextType: "feed",
        contextId: item._id
      })
    });

    const data = await res.json();

    if (data.success) {
      navigate(`/messages/${data.conversation._id}`);
    } else {
      alert("Unable to start chat");
    }
  } catch (err) {
    console.error("Consult chat error:", err);
    alert("Server error. Try again.");
  }
};


  return (
    <div className="feed-actions">

      {/* ❤️ LIKE */}
    <button
  className={`feed-action-btn ${
    item.likes?.includes(
      JSON.parse(localStorage.getItem("civilink_user"))?._id
    )
      ? "liked"
      : ""
  }`}
  onClick={() => onLike(item)}
>
  ❤️ <span>
    {item.likes?.length || 0}
  </span>
</button>



      {/* 💬 COMMENT */}
      <button
        className="feed-action-btn"
        onClick={() => {
          setActivePost(item);
          setShowComments(true);
        }}
      >
        💬 <span>Comment</span>
      </button>

      {/* 🔗 SHARE */}
      <button
        className="feed-action-btn"
        onClick={() => {
          setSharePost(item);
          setShowShare(true);
        }}
      >
        🔗 <span>Share</span>
      </button>

      {/* 📞 CONSULT (FIXED) */}
      <button
        className="feed-action-btn consult-btn"
        onClick={(e) => {
          e.stopPropagation(); // 🔑 critical
          alert("CONSULT CLICKED");  
          openConsultChat();
        }}
      >
        📞 <span>Consult</span>
      </button>

    </div>
  );
}

export default FeedActions;
