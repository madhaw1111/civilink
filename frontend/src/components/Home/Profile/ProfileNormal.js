// src/components/Home/Profile/ProfileNormal.js
import React, { useEffect, useState } from "react";
import AdvancedPortfolio from "./AdvancedPortfolio";

export default function ProfileNormal({
  user,
  posts = [],
  loadingPosts = false,
  onEditPost=() => {},
  onDeletePost=() => {}  ,
  portfolioLabel = "Posts"
}) {
  const loggedInUser = JSON.parse(
    localStorage.getItem("civilink_user")
  );

  const token = localStorage.getItem("civilink_token");

  const isOwnProfile =
    loggedInUser?._id === user?._id;

  const [connected, setConnected] = useState(false);

  /* ================= CHECK CONNECTION ================= */
  useEffect(() => {
    if (!loggedInUser || !user) return;

    setConnected(
      loggedInUser.connections?.includes(user._id)
    );
  }, [loggedInUser, user]);

  /* ================= CONNECT USER ================= */
  const connectUser = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/connections/${user._id}/connect`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.ok) {
        setConnected(true);
      }
    } catch (err) {
      console.error("Connect failed", err);
    }
  };

  /* ================= SHARE PROFILE ================= */
  const profileUrl = `${window.location.origin}/profile/${user._id}`;

  const shareProfile = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${user.name} | Civilink`,
          url: profileUrl
        });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        alert("Profile link copied");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  return (
    <div className="profile-normal">
      {/* ================= HEADER ================= */}
      <div className="normal-top">
        <div className="normal-left">
          <div className="avatar-large">
            {user.profilePhoto ||
              user.avatar ||
              (user.name
                ? user.name.charAt(0).toUpperCase()
                : "U")}
          </div>
        </div>

        <div className="normal-right">
          <div className="name-row">
            <h1 className="display-name">
              {user.name || "Civilink User"}
            </h1>

            {/* ACTIONS */}
            {!isOwnProfile && (
              <>
                <button className="btn primary">
                  Message
                </button>

                <button
                  className={`btn ${
                    connected
                      ? "outline"
                      : "primary"
                  }`}
                  disabled={connected}
                  onClick={connectUser}
                >
                  {connected
                    ? "Connected"
                    : "Connect"}
                </button>
              </>
            )}

            {isOwnProfile && (
              <button
                className="btn outline"
                onClick={() =>
                  (window.location.href = `/profile/${user._id}/connections`)
                }
              >
                Connections
              </button>
            )}

            <button
              className="btn subtle"
              onClick={shareProfile}
            >
              Share
            </button>
          </div>

          {/* META */}
          <div className="meta-row">
            <div>
              <strong>{posts.length}</strong>
              <span>Posts</span>
            </div>
            <div>
              <strong>
                {user.connections?.length || 0}
              </strong>
              <span>Connections</span>
            </div>
          </div>

          {/* BIO */}
          {user.bio && (
            <div className="bio">
              <div className="bio-text">
                {user.bio}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= POSTS / PORTFOLIO ================= */}
      <section className="card">
        <h3>{portfolioLabel}</h3>

        <AdvancedPortfolio
  posts={posts}
  loading={loadingPosts}
  isOwnProfile={isOwnProfile}
  onEditPost={onEditPost}
  onDeletePost={onDeletePost}
/>

      </section>
    </div>
  );
}

