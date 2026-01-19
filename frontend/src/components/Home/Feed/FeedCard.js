import React from "react";
import FeedActions from "./FeedActions";
import FeedMenuPopup from "./FeedMenuPopup";
import "./FeedCard.css";

function FeedCard({
  item,
  menuPost,
  setMenuPost,
  menuRef,
  setActivePost,
  setShowComments,
  onLike
}) 

{
  const loggedInUser = JSON.parse(
  localStorage.getItem("civilink_user")
);


const user =
  loggedInUser && item.user?._id === loggedInUser._id
    ? { ...item.postedBy, profilePhoto: loggedInUser.profilePhoto }
    : item.postedBy;

  const sharePostDirect = async () => {
  const postUrl = `${window.location.origin}/post/${item._id}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: "Civilink Post",
        url: postUrl
      });
    } else {
      await navigator.clipboard.writeText(postUrl);
      alert("Post link copied");
    }
  } catch (err) {
    console.error("Share failed", err);
  }
};



  return (
    <div className="feed-card">

      {/* HEADER */}
      <div className="feed-header">
        <div className="feed-user-box">
          <div className="feed-avatar">
  {user?.profilePhoto ? (
    <img src={user.profilePhoto} alt={user.name} />
  ) : (
    <span>{user?.name?.charAt(0) || "C"}</span>
  )}
</div>

       

          <div>
            <div className="feed-user">
              {user?.name || "Civilink User"}
              <span className="feed-role">
                {user?.role || "Member"}
              </span>
            </div>
            <div className="feed-meta">
              {item.location?.city}
{item.location?.state ? `, ${item.location.state}` : ""}
 • Just now
            </div>
          </div>
        </div>

        {/* ⋮ MENU */}
        <div
          className="feed-menu"
          onClick={(e) => {
            e.stopPropagation();
            setMenuPost(menuPost?._id === item._id ? null : item);
          }}
        >
          ⋮
        </div>
      </div>

      {/* IMAGE */}
      {item.imageUrl && (
        <img src={item.imageUrl} className="feed-image" alt="post" />
      )}

      {/* CONTENT */}
      <div className="feed-content">
        {item.title && <h4>{item.title}</h4>}
        {item.text && <p>{item.text}</p>}
        {item.price && <div className="feed-price">{item.price}</div>}
      </div>

      {/* ACTIONS */}
      <FeedActions
        item={item}
        setActivePost={setActivePost}
        setShowComments={setShowComments}
        onShare={sharePostDirect}
        onLike={onLike}   
      />

      {/* POPUP MENU */}
      {menuPost?._id === item._id && (
        <FeedMenuPopup
          menuRef={menuRef}
          close={() => setMenuPost(null)}
        />
      )}
    </div>
  );
}

export default FeedCard;
