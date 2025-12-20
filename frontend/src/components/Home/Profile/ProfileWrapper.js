// src/components/Home/Profile/ProfileWrapper.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProfileNormal from "./ProfileNormal";
import ProfileProfessional from "./ProfileProfessional";
import ProfileEditModal from "./ProfileEditModal";
import PostModal from "../Modals/PostModal";

import "./profile.full.css";

export default function ProfileWrapper() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const loggedInUser = JSON.parse(
    localStorage.getItem("civilink_user")
  );

  const token = localStorage.getItem("civilink_token");

  /* =====================================================
     LOAD USER
  ===================================================== */
  useEffect(() => {
    const loadUser = async () => {
      setLoadingUser(true);
      setUser(null);

      try {
        const url = userId
          ? `http://localhost:5000/api/users/${userId}`
          : `http://localhost:5000/api/users/me`;

        const res = await fetch(url, {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {}
        });

        if (!res.ok) {
          setUser(null);
          setLoadingUser(false);
          return;
        }

        const data = await res.json();
        setUser(data.user || data);
      } catch (err) {
        console.error("User load failed", err);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [userId, token]);

  /* =====================================================
     LOAD POSTS
  ===================================================== */
  useEffect(() => {
    if (!user?._id) return;

    const loadPosts = async () => {
      setLoadingPosts(true);

      try {
        const res = await fetch(
          `http://localhost:5000/api/profile/${user._id}/posts`
        );

        const data = await res.json();
        setPosts(data.success ? data.posts : []);
      } catch (err) {
        console.error("Post load failed", err);
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    loadPosts();
  }, [user?._id]);

  /* =====================================================
     HELPERS
  ===================================================== */
  const saveUser = (updatedUser) => {
    setUser(updatedUser);

    if (loggedInUser?._id === updatedUser._id) {
      localStorage.setItem(
        "civilink_user",
        JSON.stringify(updatedUser)
      );
    }
  };

  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/post/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.ok) {
        setPosts((prev) =>
          prev.filter((p) => p._id !== postId)
        );
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEditPost = async (post) => {
    const newText = prompt("Edit post text", post.text);
    if (newText === null) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/post/${post._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            text: newText,
            image: post.image
          })
        }
      );

      const data = await res.json();

      if (data.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === post._id ? data.post : p
          )
        );
      }
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  /* =====================================================
     STATES
  ===================================================== */
  if (loadingUser) {
    return (
      <div className="profile-empty">
        Loading profile…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-empty">
        User not found
      </div>
    );
  }

  const isProfessional =
    !!user.profession && user.profession !== "Member";

  const isOwnProfile =
    loggedInUser?._id === user._id;

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <div className="profile-root">
      {/* ========== TOP TOOLBAR ========== */}
      <div className="profile-toolbar">
        <div className="logo">Civilink</div>

        {isOwnProfile && (
          <div className="toolbar-actions">
            <button
              className="btn subtle"
              onClick={() => setShowEdit(true)}
            >
              Edit Profile
            </button>

            <button
              className="btn primary"
              onClick={() => setShowPostModal(true)}
            >
              Add Post
            </button>
          </div>
        )}
      </div>

      {/* ========== PROFILE BODY (SINGLE RENDER) ========== */}
      {isProfessional ? (
        <ProfileProfessional
          user={user}
          posts={posts}
          loadingPosts={loadingPosts}
          onAddPost={() => setShowPostModal(true)}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
        />
      ) : (
        <ProfileNormal
          user={user}
          posts={posts}
          loadingPosts={loadingPosts}
          onAddPost={() => setShowPostModal(true)}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
          portfolioLabel="Posts"
        />
      )}

      {/* ========== EDIT PROFILE MODAL ========== */}
      {showEdit && isOwnProfile && (
        <ProfileEditModal
          user={user}
          isProfessional={isProfessional}
          onClose={() => setShowEdit(false)}
          onSave={(u) => {
            saveUser(u);
            setShowEdit(false);
          }}
        />
      )}

      {/* ========== POST MODAL ========== */}
      {showPostModal && (
        <PostModal
          onClose={() => setShowPostModal(false)}
          addToFeed={handleNewPost}
        />
      )}
    </div>
  );
}
