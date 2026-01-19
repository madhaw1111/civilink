import React from "react";
import FeedCard from "./FeedCard";

function FeedList({
  feed,
  menuPost,
  setMenuPost,
  menuRef,
  setActivePost,
  setShowComments,
  onLike   // ✅ receive from parent
}) {
  return (
    <main className="home-feed">
      {feed?.map((item) => (
        <FeedCard
          key={item._id}
          item={item}
          menuPost={menuPost}
          setMenuPost={setMenuPost}
          menuRef={menuRef}
          setActivePost={setActivePost}
          setShowComments={setShowComments}
          onLike={onLike}   // ✅ pass correctly
        />
      ))}
    </main>
  );
}

export default FeedList;
