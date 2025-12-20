import React from "react";
import FeedCard from "./FeedCard";

function FeedList({
  feed,
  menuPost,
  setMenuPost,
  menuRef,
  setActivePost,
  setShowComments,
  setSharePost,
  setShowShare
}) {
  return (
    <main className="home-feed">
      {feed?.map((item) => (
        <FeedCard
          key={item._id}          // 🔑 FIXED
          item={item}
          menuPost={menuPost}
          setMenuPost={setMenuPost}
          menuRef={menuRef}
          setActivePost={setActivePost}
          setShowComments={setShowComments}
          setSharePost={setSharePost}
          setShowShare={setShowShare}
           onLike={handleLike}  
        />
      ))}
    </main>
  );
}

export default FeedList;
