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
  setShowShare,
  setConsultUser,
  setShowConsult
}) {
  return (
    <main className="home-feed">
      {feed?.map(item => (
        <FeedCard
          key={item.id}
          item={item}
          menuPost={menuPost}
          setMenuPost={setMenuPost}
          menuRef={menuRef}
          setActivePost={setActivePost}
          setShowComments={setShowComments}
          setSharePost={setSharePost}
          setShowShare={setShowShare}
          setConsultUser={setConsultUser}
          setShowConsult={setShowConsult}
        />
      ))}
    </main>
  );
}

export default FeedList;
