import React from "react";

function FeedMenuPopup({ post, onReport, onHide, onSave, close, menuRef }) {
  return (
    <div
      className="feed-menu-popup"
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={() => onSave(post)}>
        ⭐ Save Post
      </button>

      <button onClick={() => onHide(post)}>
        🙈 Hide
      </button>

      <button onClick={() => onReport(post)}>
        🚩 Report
      </button>

      <button className="btn-outline" onClick={close}>
        Close
      </button>
    </div>
  );
}

export default FeedMenuPopup;
