import React from "react";
import FeedActions from "./FeedActions";
import FeedMenuPopup from "./FeedMenuPopup";

function FeedCard({
  item,
  menuPost,
  setMenuPost,
  menuRef,
  setActivePost,
  setShowComments,
  setSharePost,
  setShowShare,
  setConsultUser,
  setShowConsult
}) {
  return (
    <div className="feed-card">
      {/* HEADER */}
      <div className="feed-header">

        {/* Avatar + User Info */}
        <div className="feed-user-box">
          <div className="feed-avatar">{(item.user || "C").charAt(0)}</div>

          <div>
            <div className="feed-user">
              {item.user || "Civilink User"}
              <span className="feed-role">
                {item.role || "Member"}
              </span>
            </div>
            <div className="feed-meta">{item.location || "Tamil Nadu"} • Just now</div>
          </div>
        </div>

        {/* ⋮ MENU BUTTON */}
        <div
          className="feed-menu"
          onClick={(e) => {
            e.stopPropagation();
            setMenuPost(menuPost?.id === item.id ? null : item);
          }}
        >
          ⋮
        </div>
      </div>

      {/* IMAGE */}
      {item.image && <img src={item.image} className="feed-image" alt="post" />}

      {/* CONTENT */}
      <div className="feed-content">
        {item.title && <h4>{item.title}</h4>}
        {item.text && <p>{item.text}</p>}
        {item.price && <div className="feed-price">{item.price}</div>}
      </div>

      {/* ACTION BUTTONS */}
      <FeedActions
        item={item}
        setActivePost={setActivePost}
        setShowComments={setShowComments}
        setSharePost={setSharePost}
        setShowShare={setShowShare}
        setConsultUser={setConsultUser}
        setShowConsult={setShowConsult}
      />

      {/* POPUP MENU */}
      {menuPost?.id === item.id && (
        <FeedMenuPopup
          menuRef={menuRef}
          close={() => setMenuPost(null)}
        />
      )}
    </div>
  );
}

export default FeedCard;
