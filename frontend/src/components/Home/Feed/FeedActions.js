import React from "react";

function FeedActions({
  item,
  setShowComments,
  setActivePost,
  setShowShare,
  setSharePost,
  setShowConsult,
  setConsultUser
}) {
  return (
    <div className="feed-actions">

      {/* ❤️ LIKE */}
      <button
        className="feed-action-btn"
        onClick={() => alert("Like feature coming soon")}
      >
        ❤️ <span>Like</span>
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

      {/* 📞 CONSULT */}
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
  );
}

export default FeedActions;
