import React from "react";

function FeedMenuPopup({ menuRef, close }) {
  return (
    <div className="feed-menu-popup" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      <button onClick={() => alert("Saved (coming soon)")}>⭐ Save Post</button>
      <button onClick={() => alert("Post Hidden")}>🙈 Hide</button>
      <button onClick={() => alert("Reported")}>🚩 Report</button>

      <button className="btn-outline" onClick={close}>
        Close
      </button>
    </div>
  );
}

export default FeedMenuPopup;
