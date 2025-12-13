// src/components/Home/Profile/ProfileWrapper.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProfileNormal from "./ProfileNormal";
import ProfileProfessional from "./ProfileProfessional";
import ProfileEditModal from "./ProfileEditModal";

import "./profile.full.css";

export default function ProfileWrapper() {
  const { userId } = useParams(); // 👈 viewed profile userId

  const [user, setUser] = useState(null);          // viewed user
  const [posts, setPosts] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  // logged-in user (for permissions only)
  const loggedInUser = JSON.parse(
    localStorage.getItem("civilink_user")
  );

  /* ================================
     FETCH PROFILE USER (KEY FIX)
  ================================= */
  useEffect(() => {
    setLoading(true);

    // Load posts (existing logic preserved)
    try {
      const savedPosts = JSON.parse(
        localStorage.getItem("civilink_posts") || "[]"
      );
      setPosts(Array.isArray(savedPosts) ? savedPosts : []);
    } catch {
      setPosts([]);
    }

    // 🔑 FETCH USER FROM BACKEND USING URL PARAM
    fetch(`http://localhost:5000/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, [userId]);

  /* ================================
     HELPERS
  ================================= */
  const saveUser = (u) => {
    setUser(u);

    // update localStorage ONLY if editing own profile
    if (loggedInUser?._id === u._id) {
      localStorage.setItem("civilink_user", JSON.stringify(u));
    }
  };

  const addPost = (p) => {
    const next = [{ id: Date.now(), ...p }, ...posts];
    setPosts(next);
    localStorage.setItem("civilink_posts", JSON.stringify(next));
  };

  if (loading) {
    return <div className="profile-empty">Loading profile…</div>;
  }

  if (!user) {
    return <div className="profile-empty">User not found</div>;
  }

  // 🔑 CORRECT PROFILE TYPE DECISION
  const isProfessional =
    !!user.profession && user.profession !== "Member";

  // 🔐 OWN PROFILE CHECK
  const isOwnProfile =
    loggedInUser?._id === user._id;

  /* ================================
     RENDER
  ================================= */
  return (
    <div className="profile-root">
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
              onClick={() =>
                addPost({ image: "", text: "Test post from UI" })
              }
            >
              Add Demo Post
            </button>
          </div>
        )}
      </div>

      {/* 🔑 PROFESSIONAL vs NORMAL PROFILE */}
      {isProfessional ? (
        <ProfileProfessional
          user={user}
          posts={posts}
          isOwnProfile={isOwnProfile}
          onSaveUser={saveUser}
          onAddPost={addPost}
        />
      ) : (
        <ProfileNormal
          user={user}
          posts={posts}
          isOwnProfile={isOwnProfile}
          onSaveUser={saveUser}
          onAddPost={addPost}
        />
      )}

      {/* 🔐 EDIT ONLY OWN PROFILE */}
      {showEdit && isOwnProfile && (
        <ProfileEditModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSave={(u) => {
            saveUser(u);
            setShowEdit(false);
          }}
        />
      )}
    </div>
  );
}
